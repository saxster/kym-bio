# Local verification

From the repository root, install the book's own dependencies:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r source/requirements-verification.txt
.venv/bin/python -m playwright install chromium
npm ci --prefix source --no-audit --no-fund
```

Run the combined reader-revision integration gate:

```bash
bash source/verify-integrated-revision.sh
```

This builds all sixteen chapters into a fresh temporary directory, runs the
existing domain and scene regressions, requires actual WebGL in all sixty-four Atlas
stations in Chapters 0–15, checks the Chapter 6–10 paused-mobile-redraw regression,
and tests the 47 non-Atlas live figures, three explorers and offline reopening. Source hashes
must stay unchanged throughout. The command fails if any required check fails.
The final receipt and logs are retained in the printed directory. Set
`BIO_INTEGRATION_OUT` to choose a destination or `BIO_PYTHON_INTERPRETER` to choose
an installed Python. No command above publishes, pushes or uses hosted CI.

The detailed chapter browser, figure, keyboard and print acceptance checks remain
available in `verify-reader-revision.sh`, `tests/verify_ch06_10_revision.sh` and
`tests/verify_ch11_15_revision.sh`. Their existing receipts and scientific reviews
are recorded in `gates/`. The combined gate adds integration evidence; it does not
replace those chapter checks or physical activity and learner trials.

## Check the published site locally

After publishing, compare the actual served HTML, scripts, images and offline
manifest with the checkout, then exercise the deployed site in fresh browser
profiles:

```bash
.venv/bin/python source/tests/check_published_assets.py --out /tmp/bio-live-assets
.venv/bin/python source/tests/qa_published_site.py figures --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py models --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py atlas --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py offline --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py offline-webkit --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py webkit --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py cover --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py fallback --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py map --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py explorers --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py explorers-offline --out /tmp/bio-live
.venv/bin/python source/tests/qa_published_site.py explorers-webkit --out /tmp/bio-live
.venv/bin/python source/tests/qa_explorer_lifecycle.py --out /tmp/bio-live/explorer-lifecycle
```

The URL defaults to the published Biology book. Both scripts accept `--url` and
`--out`. The browser checks support `--chapters` for a targeted Atlas/figure run.
The offline check waits for the complete service-worker cache, disconnects the
browser context, then opens a fresh tab before testing the models and explorers.
WebKit and touch-enabled Chromium emulate mobile browsers; these checks do not
claim testing on physical phones. The WebKit run requires its browser binary
(`.venv/bin/python -m playwright install webkit`). All commands run locally.

For an edition-upgrade regression, keep the previous served files before
publishing the new build. This uses a local two-edition server and isolated browser:

```bash
.venv/bin/python source/tests/qa_offline_upgrade.py --previous-site /path/to/previous/fetched --site /path/to/new/build --out /tmp/bio-upgrade
```

It waits for the complete new precache, keeps the old tab open and loads its
original Atlas offline, then closes that tab and verifies the exact new HTML,
new model, saved answer and self-rating offline. It fails if the new worker
activates before the existing reader is finished. The Atlas browser checks also
require one reused canvas across chapters and separate, unclipped visible labels.
WebKit online checks block service-worker prefetch so they test rendering and
interaction without a parallel whole-book download; offline coverage runs independently in touch-enabled Chromium and WebKit.
Both offline checks first require an uncached network request to fail.

The explorer lifecycle check opens the cell and DNA explorers twelve times in
mobile WebKit, changes their selections, requires one shared canvas, and counts
GPU buffer/texture creation and deletion to check bounded resources after close.

The two-edition fixture sends `Cache-Control: public, max-age=600`, matching the
observed GitHub Pages freshness window. A new precache must bypass that HTTP
cache so its HTML and lazy chunks belong to the same edition.

The quantitative scene gate checks all three Mendelian crosses and energy
transfer at 5%, 10% and 20%, including visible letters, readouts and label fit:

```bash
.venv/bin/python source/tests/qa_quantitative_scenes.py --offline --out /tmp/bio-quantitative-chromium
.venv/bin/python source/tests/qa_quantitative_scenes.py --engine webkit --offline --out /tmp/bio-quantitative-webkit
```

The combined local integration command also checks actual 3D bar heights,
baselines, Punnett cell colours/letters, clipping and trophic block areas against
independent expected values in `atlas_quantitative_display_domain.mjs`.

The forced no-WebGL check runs all 64 schematic stations at 360 px. It measures
actual canvas text ink bounds, card containment and overlapping text, and requires
each canvas footer to agree with the current station’s full HTML readout.
