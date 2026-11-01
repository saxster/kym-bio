# Independent review: cell and genetic-code explorer lifecycle

Reviewed 1 November 2026. Scope: the current changes in `source/app/x_cell.js`, `source/app/x_code.js` and the `acquireRenderer`/`releaseRenderer` exports in `source/live/three_kit.js`. Read the shared renderer/clearGroup implementation and explorer shell as supporting ownership evidence. No implementation was edited; no build, browser run or expensive test was repeated.

**Result: pass for the bounded source review. No consequential defect introduced by the reviewed changes was found.** Repeated WebKit opens, GPU buffer accounting, loss recovery and actual control interaction remain the coordinator's runtime gates.

## Ownership and rebuilds

- Both explorers now borrow the existing shared renderer pool instead of constructing and forcibly losing a new renderer/context on every open. The pool retains at most one idle renderer and rejects lost contexts. Its acquisition resets WebGL binding state, render target, clipping, scissor state, auto-clear and clear colour before reuse; both explorers set their own pixel ratio and output colour space.
- `clearGroup(root)` replaces bare child removal (`x_cell.js:204`, `x_code.js:138`). Every material created by these explorers belongs to its current mesh collection, so disposing those materials on rebuild is correct. No explorer-created textures or instanced meshes introduce extra ownership complications.
- Session sphere/cylinder/torus/box geometries are explicitly marked shared only to survive those rebuilds (`x_cell.js:196`, `x_code.js:130`). They are not globally shared: each mount constructs its own set. Cleanup explicitly disposes that set once, after clearing the scene and releasing the renderer (`x_cell.js:365`–378, `x_code.js:245`–256). This avoids both premature geometry disposal and the previous lost-material accumulation.
- Cleanup is idempotent, stops the animation callback, disconnects observers, and nulls renderer/root/scene references. The cell explorer also removes its motion-preference listener and disconnects visibility observation. The explorer shell removes the old wrapper and drops its cleanup closure. The double cleanup from the close button and shell therefore remains safe.

## Pointer and fallback behavior

Pointer listeners are attached to each session's `viewWrap`, not to the pooled canvas. Reusing the canvas consequently does not retain the previous explorer's drag closures or create the Atlas canvas-listener problem identified in the earlier lifecycle review. Rebuilds preserve the root transform, so selection changes do not unexpectedly reset rotation.

The shared WebGL2 probe replaces a fresh probe-and-context-loss cycle on every open. Initial acquisition failure is caught, and any acquired renderer is returned or destroyed according to its actual lost-context state. The text controls and readouts remain available when no renderer is created. There is no newly implemented 2D canvas fallback; the old cell setup comment describing one was already inaccurate. No new fallback regression was identified in this patch. These explorers still rely on reopening for recovery from a context lost while actively displayed; this review does not claim live loss recovery was added.

## Evidence limits

This is an ownership/source agreement review, not a visual or performance gate. It does not independently establish absence of WebKit context warnings, constant live GPU buffer counts after selection/rebuild cycles, renderer identity reuse in the browser, correct mobile pointer behavior, or complete visual fallback. The coordinator's planned repeated-open and all-control tests provide that evidence.

## Independent follow-up: explicit unavailable-3D branch

Read the final unavailable-renderer branches at `source/app/x_cell.js:190`–196 and `source/app/x_code.js:126`–132. **Pass for this bounded source addition; no consequential residual identified.** Both show an honest unavailable-3D message and a normal chapter link to the relevant still drawings (cell: Chapter 2; DNA: Chapter 11). Neither promises an unimplemented 2D canvas. The cell setup comment now matches that behavior.

Removing `role="img"`, its label and `tabindex` from the fallback wrapper allows the explanatory text and link to be represented as ordinary accessible content. The wrapper switches to content-based height. Cell cutaway/spin/turn controls and the DNA spin control are hidden because they require a renderer. Cell-type/organelle tabs, DNA mutation/codon controls and the evidence readouts remain, and their update functions do not require a rendered scene. This agrees with the fallback message. No renderer is acquired or returned by this branch itself; the earlier acquisition-failure cleanup remains responsible for any partial renderer setup.

The coordinator reports that the real WebKit lifecycle/control run passed 12 openings, one canvas identity and bounded post-close resources (zero buffers/four textures), with 82 checks. This reviewer did not rerun that test or convert the reported result into an independent browser claim. The extended no-WebGL note/link/tab checks likewise remain the coordinator's runtime verification.
