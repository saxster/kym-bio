# Live-site audit, 1 November 2026

The [published book](https://saxster.github.io/kym-bio/) contains all three revision sessions. I found several real display and offline defects, repaired them, published the repairs and checked the served files. All final gates below passed. All verification ran locally.

The runtime release is `9dc0013`, cache `lw-1208ef91bea2`. Every one of the 101 public files checked, including the HTML, service worker, lazy modules, fonts/assets and publication notices, matched this checkout byte for byte. The index SHA-256 is `3521edeefa034c2a3f2489ac4f96c23305760d166f147248a2026075acb33d34`. Pages deployment `7472524200` succeeded for this release. The companion [machine-readable receipts](live-site-audit-2026-11-01/receipts.json) retain the individual file hashes, gate versions, counts, regression results and original receipt hashes.

The three session commits are ancestors of the published release:

| Session | Commit | Result |
| --- | --- | --- |
| Chapters 1–5 | `0e96cbf` | Included |
| Chapters 6–10 | `de5e1b0` | Included |
| Chapters 11–15 | `7bc5b00` | Included |

The initial audit already found the merged publication's files on the server. These repairs preserve all chapter manuscripts from that starting point. They correct the supporting figures, cover, scene code, reader layout and cache lifecycle. No chapter was shortened or replaced.

The most consequential problems were these.

- Chapter 0's four Atlas views silently fell back to schematics. A missing material import and outdated particle/molecule calls prevented scene construction. They now construct real 3D scenes. Tests also require flies to enter the open jar while staying above the covered jars. Microscope estimates and scale columns are explicitly schematic where appropriate.
- Several phone views cropped assemblies or allowed labels to collide. The camera now fits the current assemblies after model updates. Movable annotation labels separate with leader lines; axis labels and genotype letters remain attached to their actual anchors. Camera panning survives refitting. Particle bounds refresh when particles move.
- Repeatedly opening 3D views could exhaust WebKit's context budget. Atlas now reuses one canvas/context and removes old listeners and renderer resources. The cell and DNA explorers share a renderer and dispose replaced resources. Twelve explorer reopenings left zero allocated scene buffers and a stable four renderer textures after each close.
- Chapter 13's genotype bars and Punnett grid could disagree with the selected parents. The displayed heights now equal the expected probabilities, zero probabilities have no bar, and all four grid genotypes and colours follow the actual cross. Exploding the assembly preserves the baseline. Tests cover all three crosses, sample sizes 20/400/2000 and both exploded/unexploded states.
- Chapter 15's energy blocks could widen in the wrong order as efficiency changed. Their horizontal areas now equal their energy fractions, with equal display heights stated explicitly. Tests check every integer efficiency from 5% through 20%. The 5% top consumer retains its exact 1.25 kJ readout. The predator–prey marker is described honestly as a chosen scan of example states rather than a solved trajectory.
- A new service worker could activate while an old tab still needed the old lazy modules. It now waits until those tabs close. Its install also bypasses stale HTTP-cache responses; otherwise GitHub's ten-minute freshness window could put old HTML into the new cache beside incompatible scripts. The implementation uses Request objects with `cache: 'reload'` in `Cache.addAll`, consistent with the documented [request cache behaviour](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache) and [Cache.addAll input contract](https://developer.mozilla.org/en-US/docs/Web/API/Cache/addAll).
- The no-WebGL canvas clipped descriptions on phones and sometimes showed another station's footer. It now wraps measured text within each card, marks shortened summaries with an ellipsis, and uses the same current-station readout as the full HTML explanation. All 64 stations pass actual text-ink bounds, overlap and footer-agreement checks at 360 px.
- The cover's summaries and symbols now match the revised content. Phone cards stay visible after selecting horizontally scrolled tiles. Static repairs include the Redi footer, Pasteur/scale labels, Chapter 5 electron/carrier spacing and the Chapter 14 table's phone overflow.

The browser checks exercised controls, selections, close/reopen behaviour and readouts as well as successful loading. Actual 3D badges, healthy WebGL contexts and draw calls were required in the 3D tests, so a silent fallback could not count as a pass.

| Verification | Passing assertions | Coverage |
| --- | ---: | --- |
| Static figures and print | 1,600 | 118 SVG plates including cover; widths 360/390/768/1440; light/dark/sepia; print retains all plates |
| Atlas whole-book sweep | 918 | All 64 stations at desktop and phone widths; geometry, visible label fit, controls, resize, cuts and part selection |
| Standard models and explorers | 459 | All 47 non-Atlas models, scale/cell/DNA explorers and adventure map |
| WebKit whole-book interaction | 972 | All 47 models, four explorer/map experiences and 64 actual 3D stations; portrait and landscape mobile layouts |
| Cover cards | 194 | All 16 cards at 360/390/1440, chapter navigation and revised summaries |
| Explorer resource lifecycle | 15 | Twelve openings in WebKit; bounded GPU resources; shared canvas |
| Chromium whole-book offline | 881 | Fresh offline tab after complete download; 47 models, four explorer/map experiences and all 64 actual 3D stations |
| WebKit whole-book offline | 881 | Same whole-book coverage; uncached network probe fails before testing begins |
| Corrected Chapters 13/15 | 120 | All eight stations at 390/1440 after the numerical geometry fixes |
| Final published fallback | 282 | No-JS still figures and all 64 no-WebGL stations at 360 px, text fit and footer agreement |
| Final published Atlas sample | 234 | All 16 stations in Chapters 0/6/13/15 at 390/1440 after the shared fallback-only change |
| Final published numerical controls offline | 40 | Mobile WebKit; three crosses and transfer efficiencies 5/10/20; labels at phone and desktop widths |
| Final two-edition upgrade | 12 | HTTP `max-age=600`; old-tab lazy loading, safe activation, exact new HTML/model offline and saved answers/ratings |
| Domain regressions | 15 scripts | Numerical, particle-bounds, scene-framing, sequence/ploidy and chapter model gates |

Counts are per gate and overlap; they are not a count of unique user journeys. The receipts record the release tested by each gate. The complete static sweep ran on `bcd055a`; all 118 SVGs and all CSS rules excluding embedded font data are byte-identical in the final runtime release. The complete model/explorer and WebKit sweeps ran after the explorer repairs on `888be35`. Later product changes were the HTTP-cache install policy, the two numerical chapters and the generic no-WebGL text branch. Those changes received their own live/offline, numerical, full fallback and final 3D checks. The final whole-book WebKit offline sweep ran on `ff0284b`; the following release changes only fallback drawing. Earlier whole-book results are retained with their versions, rather than presented as another complete rerun of the final release.

A few early runs failed because of harness timing or live navigation transport errors. The async service-worker wait was corrected to poll resolved values, touch targets were centred below the fixed header, and expected failures from a deliberately uncached offline fetch were isolated in a disposable tab. Passing final receipts contain no unexpected browser errors. The original application failures were reproduced before their fixes; the HTTP-cache and fallback layout regressions retain explicit failing-baseline evidence.

I inspected mobile contact sheets for all 64 Atlas stations and checked the corrected quantitative views and fallback screenshots directly. Representative final live captures:

| Corrected cross | Corrected energy pyramid | No-WebGL fallback |
| --- | --- | --- |
| [All-Tt cross](live-site-audit-2026-11-01/mendel-all-Tt-mobile.png) | [20% transfer](live-site-audit-2026-11-01/energy-pyramid-20-mobile.png) | [Wrapped phone schematic](live-site-audit-2026-11-01/fallback-mobile.png) |

Independent reviews are saved for [Chapter 0/static/cover](live-audit-independent-review-2026-11-01.md), [framing and label placement](live-audit-framing-review-2026-11-01.md), [offline upgrades](live-audit-lifecycle-review-2026-11-01.md), [explorer resources](live-audit-explorer-review-2026-11-01.md), [numerical scene geometry](live-audit-numerical-scene-review-2026-11-01.md) and [fallback text/readouts](live-audit-fallback-review-2026-11-01.md). Findings in those reports were resolved before publication.

GitHub Actions remains disabled. No hosted verification was created, dispatched or relied upon. The sole historical workflow run, `41293548040`, remains cancelled; it was the automatic Dependency Graph job from the initial publication. Dependency Graph was disabled with the user's earlier authorization. Pages publishes prebuilt files from the root of `main` using legacy publishing and `.nojekyll`.

For a reproducible local integration gate, run `bash source/verify-integrated-revision.sh`. [VERIFY.md](../VERIFY.md) documents the local browser, domain, lifecycle, fallback and published-file commands. This audit used those focused commands against local builds and the public URL. The original combined local integration gate also passed before the live audit; it is recorded in [the integration receipt](all-sessions-integration-2026-11-01.md).

Mobile coverage uses touch-enabled Chromium and WebKit emulation, including 360/390 px portrait and 844 px landscape cases. It does not certify physical phones. Audio output, read-aloud voices, microphone, camera and motion-sensor paths were not exercised. The print check generated 813 pages and retained all 118 SVG plates; it was a print smoke check, not a page-by-page proofread.

Existing readers should close old book tabs, reopen the book while online and allow its offline download to finish before disconnecting. The new worker deliberately waits for old tabs so those tabs keep a consistent edition. Fresh readers receive the published edition and complete precache. Unrelated concurrent native-app work in `KymBio/` and `source/export_kymbio_pack.py` was left untouched and excluded from audit commits.
