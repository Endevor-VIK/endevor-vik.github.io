#!/bin/bash
export NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules CHROME_PATH=$HOME/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome
cd /tmp/axs-0524-w4r-r4
IMPL=685140a40e55f151f9edcf9e7ab0170773ad4f55
for part in fidelity behavior deeplink; do node tools/r4_probe.cjs --repo /tmp/axs-0524-w4r-r4/wt --out /tmp/axs-0524-w4r-r4/runs/$part --part $part > runs/$part.log 2>&1; echo "probe-$part rc=$?" >> runs/chain.txt; done
node /tmp/axs-0524-w4r-r4/wt/docs/showcase-v031/evidence/w4r2/tools/r3_webkit_keyboard.cjs --impl $IMPL --out /tmp/axs-0524-w4r-r4/runs/exec-webkit-keyboard > runs/exec-webkit-keyboard.log 2>&1; echo "exec-webkit-keyboard rc=$?" >> runs/chain.txt
node /tmp/axs-0524-w4r-r4/wt/docs/showcase-v031/evidence/w4r2/tools/r3_overflow_sweep.cjs --impl $IMPL --out /tmp/axs-0524-w4r-r4/runs/exec-overflow > runs/exec-overflow.log 2>&1; echo "exec-overflow rc=$?" >> runs/chain.txt
xvfb-run -a -s "-screen 0 1920x1080x24" node /tmp/axs-0524-w4r-r4/wt/docs/showcase-v031/evidence/w4r2/tools/r3_native_zoom.cjs --impl $IMPL --out /tmp/axs-0524-w4r-r4/runs/exec-zoom > runs/exec-zoom.log 2>&1; echo "exec-zoom rc=$?" >> runs/chain.txt
node /tmp/axs-0524-w4r-r4/wt/docs/showcase-v031/evidence/w4r2/tools/r3_matrix.cjs --impl $IMPL --out /tmp/axs-0524-w4r-r4/runs/exec-matrix > runs/exec-matrix.log 2>&1; echo "exec-matrix rc=$?" >> runs/chain.txt
echo DONE >> runs/chain.txt
