# Independent review of Atlas assembly framing

Reviewed 1 November 2026. Scope: `source/live/atlas/engine/framing.js`, the `frameParts` integration in `engine/stage.js`, its opt-in and shortened page title in `adapters/kym-live.js`, and the subsequent particle-bound invalidation and focused regression sources. No implementation was edited, and no build, browser or expensive test run was repeated.

## Findings and confirmed resolutions

The first integration skipped fitting whenever a pointer drag was active or manual pan was nonzero. Since each frame first restored the authored camera pose, that made scenes snap back to their formerly cropped distance during interaction. I reported this before completion. The final integration always performs the fit when the feature is enabled. The helper compensates the bound corners by the user's world-space pan before transforming them through the panned camera. It therefore calculates distance from the unpanned composition while retaining the returned pose's panned target. The removed drag guard avoids the pointer-down/pointer-up zoom discontinuity.

I also reported that `Box3.expandByObject` caches `InstancedMesh.boundingBox`, while the particle primitive originally invalidated only its bounding sphere after movement. The latest `prims.particles.set()` and `.show()` invalidate both bounding box and bounding sphere. This covers both particle movement and changes in the number of visible instances. I checked the installed Three.js `Box3.expandByObject` implementation: a null object-level box triggers recomputation, so these invalidations address the actual cache used by framing. The focused regression source moves an instance beyond the previously computed bounds and then hides it, checking expansion and contraction independently of the framing helper.

Both reported correctness defects are resolved in the latest implementation inspected.

## Camera and scientific-behaviour agreement

The helper preserves the authored target, azimuth and elevation and only increases distance. It takes the union of the selected page's named assemblies rather than the floor or neighbouring stations. When a part is selected, the integration fits that selected assembly rather than automatically pulling out to encompass the entire page. The existing focus interpolation and authored/custom focus target remain in use.

The projected-corner calculation is consistent with retreating a perspective camera along its view direction. For each corner, it finds the depth needed to satisfy horizontal and asymmetric vertical margins. Adding the corner's camera-space z to the initial distance gives the necessary new camera distance; taking the maximum with the existing distance avoids moving the camera closer. The extra depth factor supplies a small safety margin. The helper is called after model updates and explosion transforms, so ordinary changed mesh transforms participate in the fit.

This change does not alter the scientific model inputs, computed model state or clock rules. Its output is another camera placement. Shortening the visible title to `P.tab || P.fig` does not remove the full figure description from the accessible label or change the selected lesson.

## Regression coverage reviewed

The mathematical framing regression constructs the real chapter scenes, visits the page assembly lists at default and control extremes, and checks conservative projected bounds at phone and desktop aspect ratios. Its additional pan check compares fitted distance before and after applying a world-space pan. The particle-bound regression independently checks the cache behaviour that the earlier framing test could otherwise have missed.

I reviewed these test sources but did not rerun them. The coordinator reports 576 framing cases passing and an original-camera failure. Those runtime results remain the coordinator's receipt, not a new independent execution by this reviewer.

## Limits and performance considerations

The frame loop now traverses the relevant assembly subtrees and may recompute current instance bounds each rendered frame. That is proportional to the selected geometry and live instance counts. The ordinary geometry boxes remain cached; no shader compilation or geometry reconstruction is introduced by the framing helper. I found no concrete performance blocker in this bounded inspection, but did not measure frame time on a phone. If a measured slowdown appears, reuse scratch objects and cache bounds only where the corresponding geometry and transforms are known unchanged. Reintroducing stale instance bounds would invalidate the correctness guarantee.

Conservative world-axis-aligned boxes can pull the camera farther back than an exact projected silhouette would require, particularly for rotated or exploded assemblies. That is a fit-versus-size tradeoff for screenshot review. The mathematical test covers geometry bounds, not HTML label boxes, title overlays, label collisions, near-camera readability or aesthetic scale. Manual panning intentionally allows a reader to move content offscreen; fitting its unpanned composition should not cancel that choice. Selected-focus transitions, dragging and resizing also retain a visual QA requirement.

**Result: pass for the bounded independent implementation review, with no unresolved consequential defect identified after the two fixes. This is not a visual gate or a measured performance pass.**

## Independent review of label separation

I reviewed the added `separateLabels` helper and its opt-in placement after horizontal edge adjustment. Its offsets are correctly derived from the original projected label anchors on each frame, rather than repeatedly shifting already shifted positions. Applying the returned offset to the CSS anchor correctly moves the measured box by the same amount despite the label transform. Existing leader polylines are updated to the new label endpoint while their scene anchors and dots remain fixed. The label overlay remains pointer-transparent, so displaced annotations do not intercept the canvas's picking or dragging events.

**One consequential semantic risk was reported to the coordinator:** the integration initially moved every label class, including numeric axis ticks and vector symbols without leader lines. For example, `prims.axes` creates anchored numeric `.tick` labels at `prims.js:105`; Chapter 4 has several such plots. A collision-free label layout can still be scientifically misleading if numbers no longer align with their ticks. Keep numerical tick labels anchored as fixed obstacles for movable explanatory annotations, or provide clear leaders for any moved value. A box-overlap check alone does not verify this association.

The greedy helper is also best-effort rather than a mathematical guarantee of collision-free packing. After 24 unsuccessful candidates, it leaves a label at its clamped starting position. Varying label heights or dense configurations can therefore retain overlaps even when the simple three-label example passes. The coordinator's actual page-by-page visible-label checks are needed to establish the delivered result. The top/bottom reservations and horizontal adjustment do not remove that requirement.

There is an extra batch of layout measurements after horizontal writes and a bounded collision search over the visible labels. I found no specific pointer or leader defect, but did not measure mobile frame time. This addition does not change the scientific simulation state. Its source review remains conditional on resolving the anchored-value issue above, and it is not a visual gate.

## Independent check of the final label-association repair

I reread the revised helper, stage integration and focused assertions. The reported semantic risk is resolved: only `.board` explanatory annotations receive vertical separation offsets. Numeric ticks, vectors, axis labels and marks receive zero separation offset and are prepopulated as obstacles before any annotation is placed, regardless of input order. The new mixed-input assertion specifically checks that a later fixed tick stays unchanged while the earlier annotation avoids it.

Displaced board annotations without an explicit leader now receive an automatic leader back to the original projected anchor. The helper does not replace an existing explicit leader. Automatic lines and dots are hidden when the annotation remains at its anchor, and hidden/offscreen labels are not subsequently re-enabled by the placement pass. Pointer transparency remains unchanged. I found no further consequential source-level pointer, leader or association defect in this bounded review.

**Final label-addition source result: pass.** The greedy packing fallback and unmeasured layout cost remain the limits described above. Actual visible-label bounds, unresolved overlaps, readability and leader crossings still require the coordinator's all-station mobile checks; this follow-up does not claim a visual gate or independently rerun the reported 1,728 camera/label cases.
