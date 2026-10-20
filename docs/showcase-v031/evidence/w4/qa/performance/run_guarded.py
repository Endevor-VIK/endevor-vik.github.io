#!/usr/bin/env python3
"""Run the frozen W4 Lighthouse harness with a predeclared quiet-CPU guard.

No product/test writes, downloads, foreign process termination or foreign argv logs.
Full Lighthouse reports remain in the harness's bounded /tmp run directory.
"""
import argparse
import datetime as dt
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time

BROWSERS = {"chrome", "chrome-headless", "chrome-headless-shell", "chromium", "chromium-browser",
            "firefox", "Web Content", "WebExtensions", "MiniBrowser", "WebKitWebProces", "WebKitNetworkPr"}
BUILD_EXES = {"rustc", "cargo", "esbuild", "tsc", "vite", "webpack", "vitest", "jest"}
BUILD_ARG_PARTS = ("/typescript/bin/tsc", "/typescript/lib/tsc", "/typescript/lib/_tsc",
                   "/vitest/", "/vite/bin/", "/webpack/", "/jest/bin/", "/esbuild/bin/")
POLICY = {
    "preflight": {"consecutiveQuietSeconds": 15, "sampleSeconds": 1, "maxWaitSeconds": 90,
                  "aggregateBusyPercentStrictlyBelow": 10, "foreignBrowsersAllowed": 0, "foreignBuildsAllowed": 0},
    "measurement": {"sampleSeconds": 1, "foreignBrowsersAllowed": 0, "foreignBuildsAllowed": 0,
                    "foreignCpuPercentOneCoreThreshold": 100, "consecutiveHighCpuSamplesAllowed": 1,
                    "onViolation": "Stop only the owned Lighthouse runner; preserve the entire attempt; no selective sample culling"},
    "limits": "Only /proc-visible Linux activity is observed; Windows workloads and real-device/field performance are not certified."
}
OWN_RUNNER = None


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def write_json(file, value):
    temp = file.with_name(file.name + ".writing")
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    temp.replace(file)


def snapshot():
    cpu = list(map(int, Path("/proc/stat").read_text().splitlines()[0].split()[1:]))
    processes = {}
    for directory in Path("/proc").iterdir():
        if not directory.name.isdigit():
            continue
        try:
            raw = (directory / "stat").read_text()
            comm = raw[raw.index("(") + 1:raw.rindex(")")]
            fields = raw[raw.rindex(")") + 2:].split()
            if fields[0] == "Z":
                continue
            exe = Path(os.readlink(directory / "exe")).name
            # Inspect arguments only to classify known compiler tools; never retain them.
            argv = (directory / "cmdline").read_bytes().split(b"\0")
            build_arg = any(part.encode() in arg for arg in argv for part in BUILD_ARG_PARTS)
            processes[int(directory.name)] = {
                "pid": int(directory.name), "ppid": int(fields[1]), "comm": comm, "executableBasename": exe,
                "ticks": int(fields[11]) + int(fields[12]), "browser": comm in BROWSERS or exe in BROWSERS,
                "build": exe in BUILD_EXES or comm in BUILD_EXES or build_arg,
            }
        except (OSError, ValueError):
            continue
    return cpu, processes


def measure(old, new, seconds, own_root):
    before, previous = old
    after, processes = new
    total = sum(after) - sum(before)
    idle = (after[3] + after[4]) - (before[3] + before[4])
    hz = os.sysconf("SC_CLK_TCK")

    def own(pid):
        seen = set()
        while pid not in seen:
            if pid == own_root:
                return True
            if pid not in processes:
                return False
            seen.add(pid)
            pid = processes[pid]["ppid"]
        return False

    foreign, browsers, builds = [], [], []
    for pid, process in processes.items():
        if own(pid):
            continue
        cpu = max(0, 100 * (process["ticks"] - previous.get(pid, {"ticks": 0})["ticks"]) / hz / seconds)
        row = {key: process[key] for key in ["pid", "ppid", "comm", "executableBasename"]}
        row["cpuPercentOneCore"] = round(cpu, 3)
        row["classification"] = "browser" if process["browser"] else "build" if process["build"] else "background"
        if cpu >= 0.5:
            foreign.append(row)
        if process["browser"]:
            browsers.append(row)
        if process["build"]:
            builds.append(row)
    foreign.sort(key=lambda item: -item["cpuPercentOneCore"])
    return {"at": now(), "seconds": seconds, "aggregateBusyPercent": 100 * (total - idle) / total,
            "foreignCpuPercentOneCoreSum": round(sum(item["cpuPercentOneCore"] for item in foreign), 3),
            "foreignBrowsers": browsers, "foreignBuilds": builds, "foreignTop": foreign[:8]}


def main():
    global OWN_RUNNER
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, required=True)
    parser.add_argument("--before-root", type=Path, required=True)
    parser.add_argument("--before-sha", required=True)
    parser.add_argument("--after-root", type=Path, required=True)
    parser.add_argument("--after-sha", required=True)
    parser.add_argument("--scratch", type=Path, required=True)
    parser.add_argument("--durable", type=Path, required=True)
    args = parser.parse_args()
    repo, durable, scratch = args.repo.resolve(), args.durable.resolve(), args.scratch.resolve()
    expected = repo / "docs/showcase-v031/evidence/w4/qa/performance"
    if durable.parent != expected or durable.exists() or scratch.exists():
        parser.error("Use a new direct attempt-* durable child and a new scratch directory")
    if not durable.name.startswith("attempt-"):
        parser.error("Durable child must start with attempt-")
    durable.mkdir()
    record = {"startedAt": now(), "status": "PREFLIGHT", "policy": POLICY, "logicalCpus": os.cpu_count(),
              "preflight": [], "samples": [], "runnerExitCode": None, "noForeignProcessesTerminated": True}
    write_json(durable / "guard.json", record)
    command = ["node", "tests/browser/w4_perf.cjs", "--before-root", str(args.before_root.resolve()),
               "--before-sha", args.before_sha, "--after-root", str(args.after_root.resolve()),
               "--after-sha", args.after_sha, "--pairs", "5", "--out", str(scratch)]
    checked = subprocess.run(command + ["--check"], cwd=repo, text=True, capture_output=True, check=True)
    write_json(durable / "source-check.json", json.loads(checked.stdout.split("\nCHECK ONLY:")[0]))
    quiet, deadline = 0, time.monotonic() + POLICY["preflight"]["maxWaitSeconds"]
    old = snapshot()
    while quiet < 15:
        started = time.monotonic()
        time.sleep(1)
        new = snapshot()
        sample = measure(old, new, time.monotonic() - started, os.getpid())
        clear = not sample["foreignBrowsers"] and not sample["foreignBuilds"] and sample["aggregateBusyPercent"] < 10
        quiet = quiet + 1 if clear else 0
        sample["consecutiveQuietSamples"] = quiet
        record["preflight"].append(sample)
        write_json(durable / "guard.json", record)
        old = new
        if quiet % 5 == 0:
            print("PREFLIGHT", quiet, "CPU", round(sample["aggregateBusyPercent"], 2), "BROWSERS", len(sample["foreignBrowsers"]), "BUILDS", len(sample["foreignBuilds"]), flush=True)
        if time.monotonic() > deadline:
            record.update(status="PREFLIGHT_NOT_QUIET", finishedAt=now())
            write_json(durable / "guard.json", record)
            return 2
    record["status"] = "MEASURING"
    log = (durable / "runner.log").open("w")
    proc = subprocess.Popen(command, cwd=repo, stdout=log, stderr=subprocess.STDOUT, text=True)
    OWN_RUNNER = proc
    record["runnerPid"] = proc.pid
    hot, violations, printed = 0, [], 0
    while True:
        started = time.monotonic()
        try:
            code = proc.wait(timeout=1)
        except subprocess.TimeoutExpired:
            code = None
        new = snapshot()
        sample = measure(old, new, time.monotonic() - started, os.getpid())
        old = new
        record["samples"].append(sample)
        hot = hot + 1 if sample["foreignCpuPercentOneCoreSum"] > 100 else 0
        reason = "foreign browser/build" if sample["foreignBrowsers"] or sample["foreignBuilds"] else "sustained foreign CPU" if hot > 1 else None
        if reason and not violations:
            violations.append({"at": sample["at"], "reason": reason, "sample": sample})
            print("GUARD REJECTED", reason, flush=True)
            if code is None:
                proc.send_signal(signal.SIGTERM)
        summary = scratch / "summary.json"
        if summary.exists():
            try:
                data = json.loads(summary.read_text())
                write_json(durable / "summary.json", data)
                if len(data["runs"]) > printed:
                    for run in data["runs"][printed:]:
                        print("OBSERVATION", run["pair"], run["formFactor"], run["arm"], json.dumps(run["metrics"]), flush=True)
                    printed = len(data["runs"])
            except (OSError, json.JSONDecodeError):
                pass
        record["violations"] = violations
        write_json(durable / "guard.json", record)
        if code is not None:
            break
    log.close()
    if (scratch / "summary.json").exists():
        write_json(durable / "summary.json", json.loads((scratch / "summary.json").read_text()))
    summary = json.loads((durable / "summary.json").read_text()) if (durable / "summary.json").exists() else {}
    complete = code == 0 and summary.get("status") == "OBSERVED" and len(summary.get("runs", [])) == 20
    record.update(finishedAt=now(), runnerExitCode=code, status="QUIET_CPU_QUALIFIED" if complete and not violations else "CONTAMINATED" if violations else "INCOMPLETE")
    write_json(durable / "guard.json", record)
    print("GUARD RESULT", record["status"], "DURABLE", durable, flush=True)
    return 0 if record["status"] == "QUIET_CPU_QUALIFIED" else 2


if __name__ == "__main__":
    try:
        result = main()
    finally:
        if OWN_RUNNER is not None and OWN_RUNNER.poll() is None:
            OWN_RUNNER.send_signal(signal.SIGTERM)
            try:
                OWN_RUNNER.wait(timeout=15)
            except subprocess.TimeoutExpired:
                OWN_RUNNER.kill()
                OWN_RUNNER.wait(timeout=5)
    sys.exit(result)
