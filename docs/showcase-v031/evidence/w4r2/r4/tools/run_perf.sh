#!/bin/bash
export NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules CHROME_PATH=$HOME/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome
cd /tmp/axs-0524-w4r-r4/wt
( while true; do echo "$(date -u +%FT%TZ) $(cat /proc/loadavg)"; sleep 15; done ) > /tmp/axs-0524-w4r-r4/perf/host-load.log &
LP=$!
for x in a b; do
 node /tmp/axs-0524-w4r-r4/tools/w4_perf_r4copy.cjs --before-root /tmp/axs-0524-w4r-r4/perf-roots/before --before-sha b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5 --after-root /tmp/axs-0524-w4r-r4/perf-roots/after --after-sha 685140a40e55f151f9edcf9e7ab0170773ad4f55 --pairs 5 --repo /tmp/axs-0524-w4r-r4/wt --out /tmp/axs-0524-w4r-r4/perf/run-r4-685140a-$x > /tmp/axs-0524-w4r-r4/perf/console-$x.log 2>&1
 echo "rc-$x=$?" >> /tmp/axs-0524-w4r-r4/perf/rc.txt
done
kill $LP
