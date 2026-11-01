# Independent review of Atlas and service-worker lifecycle changes

Reviewed 1 November 2026. Scope: retained-context disposal/reset in `source/live/atlas/engine/render.js`, forwarding in `engine/stage.js`, canvas acquisition/rebuild/release and event cleanup in `adapters/kym-live.js`, and the generated service worker in `source/build.py`. The installed Three.js renderer implementation and the local two-edition upgrade test were read as supporting evidence. No implementation was edited and no expensive tests, build or browser run was repeated.

## Consequential finding and verified repair

The initial canvas-pooling patch retained anonymous adapter `pointermove` and `wheel` listeners on each reused canvas. Those listeners captured old mounts and could restart their animation callbacks after the associated stage and renderer were destroyed. Discarding the canvas previously allowed those closures to be collected; pooling exposed the leak. I reported it immediately.

The latest implementation records exact removal callbacks in `canvasWakes`, removes them on destruction, makes destruction idempotent, and guards `build`, `draw`, `kick` and `own` with a destroyed flag. Together with the stage's existing removal of its own input listeners and resize observer, this resolves the reported retained-mount/restarted-render problem. The adapter also disconnects its observers, removes its window resize listener and stops sensors before releasing the canvas.

## Context ownership and disposal

Only the adapter opts into retaining the WebGL context. Other engine callers keep the previous default of explicit context loss on disposal. The retained path disposes scene geometries/materials and instanced-mesh resources, cached normal materials, render targets, composer resources and the Three.js renderer's internal resources. It returns rendering to the default target before renderer disposal. A new renderer on the reused canvas resets WebGL state before use. The installed Three.js implementation confirms that renderer disposal removes its context listeners and disposes its render/program/binding caches, while `resetState` resets WebGL and binding state.

The adapter keeps at most one idle canvas. Acquisition removes it from the idle slot and rejects a lost context; release pools only a non-fallback canvas with a live context. Theme rebuilds now retain that canvas instead of creating another context. I found no further consequential source-level ownership or disposal defect in the reviewed normal lifecycle.

A minor cosmetic state detail was sent to the coordinator: a canvas closed while hovered or dragged can retain the `pointing`, `draggable-hover` or `dragging` CSS class. Clearing those transient classes on acquisition prevents an inherited cursor state. This does not affect the numerical model or GPU ownership.

## Edition-safe service-worker activation

Removing `skipWaiting()` is consistent with retaining an old edition's cached lazy chunks while tabs controlled by the old worker remain open. The new worker still precaches its complete file list during installation. Old book caches are removed only when the new worker activates after the old controlled clients are gone; the activation promise includes cleanup and claiming clients. The same-origin, read-only fetch handling is unchanged.

This is a cache-lifetime repair, not a promise that online navigation can never display a newer HTML response before activation: navigation remains network-first. The relevant protection is that the old cached assets are retained while old controlled readers can still need them.

The local upgrade-test source exercises the right sequence: distinct old/new editions, a waiting new worker with both caches retained, an old tab opening its original lazy Atlas offline, closing that tab, activation and old-cache cleanup, then byte-exact new HTML and new lazy code offline. It also checks saved answers and self-ratings. I reviewed the test but did not execute it or treat its existence as a passing result.

## Result and limits

**Pass for this bounded independent lifecycle source review after the listener repair. No unresolved consequential defect was identified.** The one-idle-canvas rule bounds retained idle contexts, but source inspection alone does not establish WebKit's actual context count, absence of GPU warnings, memory usage after many cycles or successful recovery from every hardware context loss. Those remain the coordinator's real repeated-open, theme, WebKit and edition-upgrade checks. This report makes no new browser or visual-gate claim.

## Independent follow-up: failed two-edition fixture diagnosis

Reviewed the saved `/tmp/bio-offline-upgrade-debug3/report.json`, candidate `/tmp/bio-framing-repair-v7/sw.js`, old fetched worker, latest `source/tests/qa_offline_upgrade.py`, and the installed Playwright polling implementation. No browser test was run by this reviewer.

The saved failure does **not** establish that a successfully installed new worker activated without deleting the old cache. Its observations are also consistent with an installation interrupted by going offline, leaving an orphan cache and the old worker active:

- The original `wait_for_function` used an async predicate. The installed Playwright implementation (`.venv/lib/python3.11/site-packages/playwright/driver/package/lib/coreBundle.js:25707`) tests `const success = predicate(); if (success) { fulfill(success); return; }`. An async function immediately returns a truthy Promise; adopting that promise can subsequently yield false without scheduling another poll. The test could therefore proceed before installation completed. Cache existence alone does not prove `addAll(FILES)` completed: `caches.open` creates the cache first. Disconnecting the network then can reject installation and leave that cache behind.
- Reading `self.registration.active.state` through the new worker's debugging target reports the registration's current active worker. It does not establish that the particular target being evaluated is the active worker. An old active worker plus no waiting worker explains `active: activated`, `waiting: null`, both cache names and old offline HTML.
- The latest explicit Python loop awaiting `page.evaluate(async predicate)` at `source/tests/qa_offline_upgrade.py:21`–25 correctly waits for the Boolean result and retries. It fixes the original premature-offline condition on source inspection.

One additional consequential **test instrumentation race** was reported to the coordinator: the post-close `cacheCounts` expression at `source/tests/qa_offline_upgrade.py:30` enumerates cache names and then calls `caches.open(k)` on each. If activation deletes an old cache after enumeration but before that open, the diagnostic itself recreates the deleted cache. Remove cache-opening diagnostics after closing the old client; take count/hash snapshots only while the fully installed worker is confirmed waiting, or retain already opened Cache handles for read-only observation. The simple `caches.keys()` activation poll does not create this problem.

The candidate activation handler awaits the old-cache deletion promises and then `clients.claim`; no source error in that deletion chain was found. The recorded debug3 run preceded the added `cacheCounts` expression, so the latter is a separate new race, not a claimed explanation of that earlier artifact. Runtime upgrade acceptance remains pending the coordinator's corrected fixture result.
