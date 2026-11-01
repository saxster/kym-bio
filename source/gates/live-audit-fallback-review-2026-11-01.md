# Independent review: generic no-WebGL canvas text layout

Reviewed 1 November 2026. Scope: the new generic `drawFallback` branch in `source/live/atlas/adapters/kym-live.js`, its immediate readout contract and the current 64 station definitions. No implementation was edited; no browser/build/expensive test was repeated.

## Consequential finding

**Canvas footer selects the wrong station readout.** At the reviewed line 223, `chapter.readout(state, P)` omits the third page index. Chapter readout functions commonly select their topic by that third argument. For example, Chapter 13's Mendel station consequently falls through to its X-linked readout, and Chapter 15's energy pyramid falls through to its recombinant-plasmid/CRISPR readout. The accessible text immediately below already calls `chapter.readout(state, P, page)` and can therefore disagree with the canvas footer.

This is a pre-existing defect in the exact footer branch under review, rather than a regression caused by wrapping. Reported immediately to the coordinator. Minimal repair: pass `page` and use an `opts.readout` override when present, consistently with the adjacent accessible readout. The new layout should be verified against that corrected text.

## Wrapping and vertical layout

The word-wrap algorithm correctly measures text in the current drawing font, preserves ordinary inter-word spaces, splits overlong words by Unicode code point, and truncates extra rows with a width-measured ellipsis. Row limits prevent a long plate description from intruding into the next card or footer. Empty input yields no rows; a zero line budget yields no drawing. Truncation is visibly marked instead of silently dropping the rest of the last shown line.

For the current default 420 px canvas height and at most four parts (two rows), the intended layout is internally consistent:

- Header baselines 50/67 leave space above the body baseline at 86; cards begin at 104.
- Two card rows have height 100, separated by 10 px. Heading line budgets and description line budgets are derived from that card height. At most two heading lines and three description lines fit with the stated fonts and padding; the nominal four-line cap permits four only when space allows.
- The footer begins at height minus 60 and occupies at most three 14 px-spaced baselines. The card-height calculation reserves a gap before its first baseline. Its final baseline remains 32 px above the canvas bottom.

The new code affects only the generic no-WebGL drawing branch. Chapter-specific `drawFallback2D`, numerical models and WebGL rendering are unchanged. No additional wrapping or body-coordinate defect was found for the intended mobile/normal canvas sizes by source inspection.

## Limits

This helper is not a general guarantee for arbitrarily tiny custom canvases: a single glyph or ellipsis can be wider than an extremely narrow width, and sufficiently short heights cannot fit the fixed header/card/footer reserves. The current station set has at most four parts and uses a substantially larger default height; no unsupported-size redesign is requested here. Actual font ink extents, card containment and overlay/label interactions must be established by the coordinator's real 360 px forced-fallback checks across all 64 stations. This reviewer has not rerun those checks or claimed a visual gate.

**Result at this review point:** wrapping/layout source review is satisfactory within the current size limits; the page-index/readout mismatch remains the one consequential item to correct and recheck.

## Independent resolved-source follow-up

Re-read the final footer expression at `source/live/atlas/adapters/kym-live.js:223`. It now selects `opts.readout(state, P, page)` when provided, otherwise `chapter.readout(state, P, page)`, consistently with the adjacent default accessible readout. The reported wrong-station/footer mismatch is resolved in source. **Pass for the bounded source review; no consequential residual identified.** No tests or further searches were run. Actual 360 px canvas ink/card containment and footer-prefix agreement remain the coordinator's browser checks.
