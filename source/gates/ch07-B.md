# Chapter 7 — Gate B: reader clarity, mechanism, safety and history

Independent report-only review, 30 October 2026. Reviewed the supplied finished artifacts without authoring them or seeing their writing process. No chapter, story, illustration, widget, ledger, baseline, runner or other shared file was edited. The sole output is this report. No publication, Git operation or hosted verification was performed.

**Disposition: 0 BLOCKER, 2 FIX, 2 CONSIDER.** The chapter can support a correct three-sentence account in every section; no section requires a conceptual REWRITE. Resolve the two FIX findings before acceptance and request reconfirmation against the corrected hashes. The two CONSIDER findings are optional refinements.

## Scope and evidence

Read source/SKILL.md, FORMAT.md, NARRATIVE.md, GATES.md, the Chapter 7 BOOKPLAN entry and PLAYBOOK §9, grounding/ch07.md, the chapter, story, all nine figure functions, provenance ledger, shared digestion model, all three Chapter 7 widgets and exactly the three appended enhancement entries. The applicable supplied global instruction requires local verification only. No project AGENTS.md was found within this repository; the ancestor home instructions limit their standing conventions to home-directory sessions. The approved plan's fixed length, fixed stomach pH, fixed bile area/rate multiplier and tennis-court language are appropriately superseded by the grounding's corrected account.

Inspected the nine temporary static plate renders, the plate montage, and the temporary component montage. These are evidence about diagram pedagogy and component presentation, **not final assembled-book/browser acceptance**. No physical home trial was performed. Independently executed Python geometry/atom arithmetic and Node model/capture probes; both commands exited 0. Node printed only its module-type warning. Current official/primary-source checks included the [Cambridge 2026–2028 syllabus](https://www.cambridgeinternational.org/Images/697203-2026-2028-syllabus.pdf), [Helander and Fändriks abstract](https://pubmed.ncbi.nlm.nih.gov/24694282/), [Iqbal and Hussain lipid review](https://pmc.ncbi.nlm.nih.gov/articles/PMC2692399/), and the [Beaumont archive scholarship](https://pmc.ncbi.nlm.nih.gov/articles/PMC6172101/). Read the cached 1833 primary-text First Series, especially printed pp125–129, independently of its summary in the grounding. Neither the unavailable full area paper nor the unavailable manuscript contract was treated as directly inspected.

## 7.1 — A tube and a barrier

No finding. The pocket example makes enclosure versus boundary crossing concrete, and the text immediately limits the sense of “outside.” It neither portrays the gut as detached nor claims lumen contents cannot affect the body. The connection map separates solid food routes from dashed secretions, allows liver bile to reach the duodenum without gallbladder storage, and does not misrepresent schematic positions as anatomy. The boundary drawing is explicitly an enlargement of epithelium, not a one-cell-thick entire wall.

Ingestion, digestion, absorption, assimilation and egestion are distinguished by events and examples. Excretion is not conflated with every substance in faeces. Nutrient material and fuel roles are kept separate from ATP production, and already absorbable water/ions/sugars are explicit exceptions to prior digestion. Two central concept cards follow teaching; their five core and three deeper questions are complete. The engine supplies the Your turn explain-back automatically.

**Exactly three-sentence explain-back:** Food can be inside my body's outline but still on the far side of the gut lining from my tissues. Digestion changes food into useful smaller products, absorption takes suitable substances across the lining, and assimilation is what cells later do with them. Unabsorbed food can leave as faeces, while excretion describes removing metabolic waste or excess substances.

## 7.2 — Movement, chemistry and protection

**FIX B1 — Captured “product endpoints” do not consistently show the products being compared.** Location: live/w_digestive_steps.js, `history` mapping at the end of `refresh`; live/digestion_model.js, protein/triglyceride stage 4; live/enhancements.js:311. The challenge instructs Kym to compare recorded products, but history exposes only `t.lines[1]`. Executed endpoint probes return the saved protein line “Some small peptides enter, then are hydrolysed” and triglyceride line “Long-chain material is rebuilt and packaged”; neither names the central product comparison. The complete triglyceride endpoint snapshot does not name fatty acids or monoacylglycerols either, although stage 3 does. Retain and show a clear product field or the relevant full endpoint lines for each food, with triglyceride hydrolysis products distinguished from the subsequently rebuilt chylomicron cargo. This is an outcome-display issue, not a defective capture gate: stage 3 capture correctly returns null, the three-food completion condition requires real captures, and no written explanation is graded.

Otherwise the section passes the mechanism read. Coordinated narrowing behind and relaxation ahead explains propulsion before naming peristalsis. Particle division, starch intermediates, water-reactant hydrolysis, protein intermediates and continuing intestinal digestion are explicit. Acid is a condition and contributor, not an all-purpose enzyme. Mucus/bicarbonate, joined cells, repair and inactive precursors explain maintained protection and its failure. Three central cards come after their mechanisms; the tooth inset serves a school objective without suggesting canines require a meat diet.

Independent arithmetic: maltose plus water and two glucoses each total C12 H24 O12; nominal relative masses give 342 + 18 = 360. There is no inverted-eating experiment, saliva collection, gastric-juice reproduction or hot-liquid protocol. The 1833 vial comparison supports chemical activity away from muscular grinding, not acid-only action or absorption.

**Exactly three-sentence explain-back:** Teeth divide food and travelling muscle squeezes move it, but those changes do not cut all its molecules into absorbable products. Enzymes help reactions with water split particular links, and different enzymes continue the work in different parts of the gut. The stomach's mucus, bicarbonate, joined cells, repair and inactive enzyme precursors reduce damage to its own wall, but that protection can fail.

## 7.3 — Droplets, molecular links and the home model

**FIX B2 — Earn the triglyceride structure before naming its chemistry.** Location: src/ch07.md:345–351. The first lipase paragraph requires “ester links,” “fatty-acid parts,” “glycerol” and “triglyceride” before the next paragraph explains the three-parts-on-a-backbone structure. The mechanism is scientifically sound, but this is a local name-before-thing and sequencing failure under PLAYBOOK §9. Move the simple structural description before lipase's named ester-link action, and gloss an ester link as the relevant chemical attachment. Colipase can remain a brief supporting detail after the principal reaction is clear. No wholesale rewrite is needed.

**CONSIDER B3 — Specify a readily measurable starting size.** Location: src/ch07.md:335–342. “A small piece” leaves a reader free to start with the preceding diagram's 3 mm radius, producing eight 3 mm-diameter balls that are awkward to roll and measure accurately with an ordinary ruler. A suggested original ball about 3 cm across would make the eight balls about 1.5 cm across. Independent Python gives R = 15 mm, original volume 14137.16694 mm³, eight r = 7.5 mm balls with the same combined volume, and total-area ratio 2. This is a practical size suggestion, not a claim of a physically tested procedure.

**CONSIDER B4 — Label the released fatty-acid head-group omission.** Location: figs_ch07.py:155–180, c7_lipase. The product cartoon draws OH groups on the glycerol-side stubs and two detached zigzag tails, with no carboxyl head on the released fatty acids. Its “simplified ester-link map” notice and balanced formula prevent this being an atom ledger, so it is not a factual blocker. A short label such as “released fatty acids; head groups omitted” would stop a learner treating the detached zigzag alone as a complete hydrolysis product. The chapter's useful insistence that water supplies new groups makes this extra precision especially valuable.

The activity is otherwise ordinary-home feasible: familiar clay or adult-prepared cool dough, washable tray and ruler; no heat, knife, detergent or biological fluid. Amount of material is held constant, eight approximate spheres are the intended change, prediction precedes division, repeat variation is requested, and unequal sizes/dents/loss are acknowledged. Surface is inferred geometrically rather than falsely said to be measured. No tasting, skin-irritation alternative, cleanup and handwashing are present, and the explicit “reviewed, not physically trialled” statement is honest.

Independent geometry for R = 3 mm: V = 36π = 113.0973355 mm³; k = 2 gives N = 8, r = 1.5 mm and A = 72π = 226.1946711 mm²; k = 4 gives N = 64, r = 0.75 mm and A = 144π = 452.3893421 mm². The general area ratio is k, not k³. The widget and static drawing keep their circles a spread-out projection of three-dimensional spheres, never infer an enzyme rate, and correctly give zero droplets/area/volume and an undefined area ratio at zero supply. Executed capture probes reject changed reference volume and accept same-radius/different-division captures. Both static molecular and geometry diagrams distinguish droplets from molecules. The lipase equation totals C57 H108 O8 on either side. Two concept cards follow the corresponding teaching.

**Exactly three-sentence explain-back:** Bile and mixing help keep fat in smaller droplets, which exposes more surface without changing the fat molecules. Lipase and water then change particular chemical links, mainly leaving fatty acids and a glycerol-containing molecule with one fatty acid still attached. More surface can help contact with enzymes, but geometry alone does not tell us how much faster real digestion will happen.

## 7.4 — Cross the epithelium, then carry material

No finding. The section earns folds, tissue villi and cell-membrane microvilli separately and explicitly keeps vessels out of microvilli. The nested static drawing has separate enlargements. One-cell thickness belongs to epithelium, not the whole intestine. The adult surface estimate and its abstract-only access limit are properly qualified; 32 − 2 ≈ 30 m² is transparent approximate subtraction, not a measurement of Kym.

The sodium-gradient relay is grounded in Chapter 3's already taught electrical/concentration gradient and ATP-driven pump account. The prose separates entry, epithelial exit, tissue fluid, capillary entry and portal flow. Amino acids, small peptides and fructose prevent a universal-passive or universal-active story. Long-chain products leave micelles, enter cells, undergo rebuilding/packaging, then travel through lacteals/lymph to blood; shorter-chain exceptions are retained. Most water uptake is correctly assigned to small intestine under ordinary conditions, with further colon uptake. Assimilation requires additional cellular use. Two concept cards follow their mechanisms.

The absorption widget's material markers explicitly survive molecular rebuilding rather than depicting unchanged molecules or swallowed fat droplets. Its manually selected stages are not time, permeability or efficiency. Endpoint capture requires positive supply and stage 4; executed zero-supply and pre-endpoint probes return null. Captures preserve destinations. The appended challenge asks for actual glucose and long-chain endpoint captures and explicitly says its stamp does not assess explanation accuracy. Every one of the three appended tours sets its controls and cutaway state explicitly and never clicks a capture button; observing tour stops alone cannot meet the new capture conditions. The gallbladder case separates production, storage, delivery, dispersion and chemical reaction without offering patient advice.

**Exactly three-sentence explain-back:** Folds, villi and microvilli provide more surface, but substances still need suitable ways to cross the cells. Glucose can enter using a sodium gradient kept going by an ATP-powered pump and then travel in blood towards the liver. Much long-chain fat material is rebuilt and packaged inside intestinal cells before travelling through lymph to blood, while some shorter-chain fatty acids take the portal blood route.

## Story — What disappeared from the string?

No finding. The story distinguishes 1822 injury, 1825 experimental work and 1833 publication without inventing a witnessed scene, quotations, feelings or a beneficiary narrative. Cached primary printed pp125–127 support the differently prepared foods, softness/falling-off/melting alternatives, recorded discomfort and final withdrawal. Printed pp128–129 support the extracted-fluid vial, water bath and comparable beef in the stomach. The text correctly treats visible disappearance as an observation requiring interpretation, not a chemical bond count or a modern controlled rate experiment.

St. Martin is a person with family, employment and participation essential to the work. The doctor/employer/participant imbalance is grounded in documented roles and the [archive scholarship's contract evidence](https://pmc.ncbi.nlm.nih.gov/articles/PMC6172101/); it is not embellished into a claim of freely revocable modern informed consent. The return to Canada and uneven access to the two men's accounts make the limits visible. Scientific contribution is not used to settle ethical acceptability. Historical procedures are never offered as home reproductions.

## Reviewed hashes and summary counts

SHA-256 of reviewed content, taken when this report was written. The enhancements hash covers the whole shared file; review ownership and findings concern only its three appended Chapter 7 entries.

```text
ee20a20f09b99ef2324d46dc7ae6d7862eb16a512ee97eee313ac2e33d0fa14f  grounding/ch07.md
bb8658f9c5711334d393886e6224bc553d198fc7f59c1867e091cfabc1fb5e9a  src/ch07.md
bd71750e225f150f137ab8e124781b45a8da54e280b837aa94a8d8db7a6df899  src/stories/beaumont-st-martin.md
604c3f17ffe8b04326a8a411c0f7035136bcfd293b42e923546b111c1724a902  figs_ch07.py
79a24e392ff21bd72fd806c16f9d1015d84d8bc5caedf06193944986ef02be2c  provenance/ch07.yml
d368080d8a2d11d71192903aa3a1f63243f8743650e33fd6231afdfc6d0d2606  live/digestion_model.js
58081a90eb4d35eb02f371c6ca54d290614ce486ba199592e1ab2dd96165abf2  live/w_digestive_steps.js
8b85baf35c167b58dc6f24a6dd7d0c64154b1acb77ace95707076a48da35b999  live/w_emulsification.js
c076e0a717f0be234542e9bedce1d53c7f3c85475260374e9c12758eca641c90  live/w_absorption_routes.js
7c7a7bea0a3ca7d8e312e7b363b3c2594747821e1ca0a6ad05611259af3534e7  live/enhancements.js
```

Final counts: **0 BLOCKER · 2 FIX (B1–B2) · 2 CONSIDER (B3–B4)**. Four section explain-backs, exactly three sentences each. Nine static diagrams and three widgets reviewed; all three appended enhancements reviewed. No conceptual REWRITE, no physical trial claim, no final-book acceptance claim.


## Final independent reconfirmation — 30 October 2026

**Gate B PASS. Current outstanding counts: 0 BLOCKER · 0 FIX · 0 CONSIDER.** This decision supersedes the initial disposition above; that initial review remains as the audit trail.

Independently re-read the corrected source, supporting grounding/provenance updates, model and widget capture path, figure alt/subtitle and chapter caption. Compared all ten initial content hashes: the story, emulsification widget, absorption widget and complete shared enhancements file remain unchanged. The corrections resolve the recorded issues without changing their teaching contracts.

- **B1 resolved:** `digestionAccount` supplies explicit endpoint product identities, `captureDigestion` saves the immutable `products` string, and saved widget history displays `t.products`. The lipid stage-4 text now names fatty acids and monoacylglycerols before rebuilding/packaging. The protein capture explicitly includes amino acids while retaining the small-peptide qualification. The challenge still requires three real stage-4 captures and does not grade the written explanation.
- **B2 resolved:** section 7.3 now describes the glycerol backbone, three attached fatty-acid parts and the chemical attachments called ester links before explaining lipase's hydrolysis of those connections. The structure is earned before its action is unpacked.
- **B3 adopted:** the activity now chooses a ball about 3 cm across. Recomputed independently: eight equal spheres of the same total volume each have diameter 1.5 cm and twice the combined original surface area. The same-amount control, approximate-shape limitations, no-tasting instruction, cleanup and explicit absence of a physical trial remain.
- **B4 adopted:** the c7_lipase subtitle, alt text and chapter caption explicitly disclose omitted fatty-acid head-group atoms, and distinguish the simplified cartoon from the complete formula account including reaction water. No atom-completeness claim is now attached to the cartoon.

The 7.1 swallowing example is now descriptive rather than an activity instruction; this preserves its intended barrier puzzle without implying another home protocol. Grounding and provenance record the corrections and additional tooth-anatomy source trace. The chapter's nine concept cards and the initial four exactly-three-sentence explain-backs remain appropriate to the corrected text.

Executed `node source/tests/ch07_domain.mjs` locally after reading its independent geometry, bounds, capture-identity/immutability, formula and tour assertions: **2,046 cases passed, exit 0**. Node emitted its known module-type warning only. This verifies those model contracts and the corrected saved identities; it is not a physical trial or a final assembled-book browser acceptance receipt. No receipt from the separately running final browser suite was reviewed here, and this report makes no claim that it has passed.

Final reviewed SHA-256 values, including the strengthened local domain check:

```text
ce0f04b57d6e85bda62e5e6f21631c2aaba8dbe67ed54c49741068a2d1e3deab  grounding/ch07.md
beb585fcc396c0839a0ba51563147f28af68dd58867e681c9f394efcbe32de89  src/ch07.md
bd71750e225f150f137ab8e124781b45a8da54e280b837aa94a8d8db7a6df899  src/stories/beaumont-st-martin.md
965b38403009180a0d6ca362062fe0c22a3e18d1fd0cdfb6a469ec9573e623fa  figs_ch07.py
705f93b6ecff4e40da3041b8ea1bade8c779a6ecaa6575e521b2bafec33387fa  provenance/ch07.yml
52bd6b279a3aa74d3da057e5181e713c452d00505fc15a5a3ee3b7bc4cdaa93f  live/digestion_model.js
ecc384f92ba4b469f0c342242337424cf8b6fc454acd507ae4f64435f919f280  live/w_digestive_steps.js
8b85baf35c167b58dc6f24a6dd7d0c64154b1acb77ace95707076a48da35b999  live/w_emulsification.js
c076e0a717f0be234542e9bedce1d53c7f3c85475260374e9c12758eca641c90  live/w_absorption_routes.js
7c7a7bea0a3ca7d8e312e7b363b3c2594747821e1ca0a6ad05611259af3534e7  live/enhancements.js
25578687049e169f8b485c115a9e029c725e854095f5c8dcf216b58806ba27a6  tests/ch07_domain.mjs
```

Final Gate B counts: **0 BLOCKER · 0 FIX · 0 CONSIDER outstanding**; two initial FIX findings closed and both optional suggestions adopted. Four explain-backs remain exactly three sentences each. Only this report was edited during reconfirmation.


## Scoped reconfirmation after mobile-control correction — 30 October 2026

**Gate B PASS retained. Outstanding: 0 BLOCKER · 0 FIX · 0 CONSIDER.** The real final-book acceptance failure at 390 px is recorded in grounding/provenance; it is not hidden behind the earlier component checks. The native absorption supply label is now “Marked portions”. Its output still says “abstract portions”; the readout, model and teaching retain their material-tracking qualifications.

Independently checked the native label, all five explicit absorption tour shots, the tour's live-number accessor, domain-test control list and browser-test selectors. Each consistently uses “Marked portions”; the old control label is absent from these matching paths. Replacing this new label with the old label in the current absorption widget, whole shared enhancements file and domain-test file reconstructs each file's exact prior confirmed SHA-256. Thus those three file changes are label replacement only; in particular there is no hidden change to older enhancement entries. The chapter, story, figures, numerical model, digestive widget and emulsification widget still match the preceding confirmed hashes.

Independently verified all **214 preserved files** against tests/ch07-preserved.json, reconstructing the original shared enhancements bytes by removing only the three appended Chapter 7 entries: **zero preservation failures**. Re-ran `node source/tests/ch07_domain.mjs`: **2,046 cases passed, exit 0**, with only the known Node module-type warning. These checks establish label/tour consistency, model contracts and preservation. They do not establish that the rebuilt browser acceptance suite has passed or that the revised control now fits at 390 px; no completed final-suite receipt was reviewed during this scoped reconfirmation.

Updated reviewed SHA-256 values:

```text
72ee337a8a06696f2418e7efb1237ac8d04268477d2e36df8928bfa70e882b10  grounding/ch07.md
beb585fcc396c0839a0ba51563147f28af68dd58867e681c9f394efcbe32de89  src/ch07.md
bd71750e225f150f137ab8e124781b45a8da54e280b837aa94a8d8db7a6df899  src/stories/beaumont-st-martin.md
965b38403009180a0d6ca362062fe0c22a3e18d1fd0cdfb6a469ec9573e623fa  figs_ch07.py
9d4f3d508d0890cca74f700608f00c12eec799ecea9f073cc9408fc0b5ee5817  provenance/ch07.yml
52bd6b279a3aa74d3da057e5181e713c452d00505fc15a5a3ee3b7bc4cdaa93f  live/digestion_model.js
ecc384f92ba4b469f0c342242337424cf8b6fc454acd507ae4f64435f919f280  live/w_digestive_steps.js
8b85baf35c167b58dc6f24a6dd7d0c64154b1acb77ace95707076a48da35b999  live/w_emulsification.js
ceeeb0e98196ef7a60a1aa21bce4759ade304170aefd914d9fe19d066514adf4  live/w_absorption_routes.js
5502146a54729d027ddface39ff63361b82398f2f24342363ab72c063209d4f3  live/enhancements.js
bb7c7c14df8d965c69ed1e67799978e745d121f35ae16ecbeb842dcfa3ec1285  tests/ch07_domain.mjs
e1cf30baf9d63023a5e22ceb600092a3111cb7b22e523b0d3719f8d6f9092ee8  tests/qa_ch07.py
f8dcf4f8ba519177dd539abbd601eea835bc19cfa73a9bd0a200adfebf5fd72f  tests/ch07-preserved.json
```

Final scoped counts: **0 BLOCKER · 0 FIX · 0 CONSIDER outstanding**. Only this report was edited.


## Scoped reconfirmation after dark outlines and PDF locator correction — 30 October 2026

**Gate B PASS retained. Outstanding: 0 BLOCKER · 0 FIX · 0 CONSIDER.** Directly inspected the current assembled-book dark screenshots at `/tmp/lt_bio_ch07/final/qa_ch07/plate-{3,5,6,8}-1440-dark.png`. The fat spheres have clear exposed perimeters; tooth inner layers remain distinguishable; the folded lining, villus and absorptive-cell boundaries are visible at their separate enlargements. The stomach protection drawing's outer epithelial-layer boundary frames the label without crossing it. These inspected images support the scoped contrast correction, not a claim that the entire running acceptance suite is complete.

Independently reversed only the added semantic theme-token stroke attributes and the single outer protection-layer rectangle from the current figure source: the reconstructed bytes match the previous confirmed `figs_ch07.py` SHA-256 exactly. Thus no geometry, text, arrow or equation change is concealed in this patch. Chapter, story, all numerical model/widget files, shared enhancements, domain test and preservation baseline retain their prior confirmed hashes. Supporting grounding/provenance explicitly describe the contrast finding, correction and newly successful primary-scan inspection without converting prior failed retrievals into successes. No direct primary-scan inspection by this Gate B reviewer is claimed beyond the already recorded cached primary text review.

Read the changed PDF-caption locator: it retains layout extraction, adds raw reading-order extraction, normalises whitespace/hyphenation and typographic apostrophes, and searches for each **entire** source caption on exactly one printed page. This addresses margin-note interleaving without reducing the assertion to a prefix. Text matching remains distinct from drawing inspection. No final PDF or full-browser pass is asserted here; the complete suite was still running when this scoped decision was written.

Rechecked all **214 preserved files**, reconstructing the original enhancements bytes by removing exactly the three appended Chapter 7 entries: **zero hash/length failures**. Domain-model code and its previously passing 2,046-case check are unchanged by this visual/test-locator patch; no unnecessary repeat domain execution was used as evidence of rendering correctness.

Latest reviewed SHA-256 values:

```text
d9bb6ed45595755650bd98ad2be8701879b0d91359f8e2a1d0d956cbbe380a0f  grounding/ch07.md
beb585fcc396c0839a0ba51563147f28af68dd58867e681c9f394efcbe32de89  src/ch07.md
bd71750e225f150f137ab8e124781b45a8da54e280b837aa94a8d8db7a6df899  src/stories/beaumont-st-martin.md
bb0a7020bc286bec75591c0c202a6eac4745fbad6cce83ea5e83f4958bd2b246  figs_ch07.py
aa60290c53ba3e94d00b08867fe6b78b7639baecf8710bc9924b4e389e804a04  provenance/ch07.yml
52bd6b279a3aa74d3da057e5181e713c452d00505fc15a5a3ee3b7bc4cdaa93f  live/digestion_model.js
ecc384f92ba4b469f0c342242337424cf8b6fc454acd507ae4f64435f919f280  live/w_digestive_steps.js
8b85baf35c167b58dc6f24a6dd7d0c64154b1acb77ace95707076a48da35b999  live/w_emulsification.js
ceeeb0e98196ef7a60a1aa21bce4759ade304170aefd914d9fe19d066514adf4  live/w_absorption_routes.js
5502146a54729d027ddface39ff63361b82398f2f24342363ab72c063209d4f3  live/enhancements.js
bb7c7c14df8d965c69ed1e67799978e745d121f35ae16ecbeb842dcfa3ec1285  tests/ch07_domain.mjs
23bb55c26ac7b05df986cb30f432007acc6ff1e92572b7512bce24c83339bcd3  tests/qa_ch07.py
f8dcf4f8ba519177dd539abbd601eea835bc19cfa73a9bd0a200adfebf5fd72f  tests/ch07-preserved.json
```

Latest Gate B counts: **0 BLOCKER · 0 FIX · 0 CONSIDER outstanding**. Only this report was edited during this scoped recheck.


## Scoped reconfirmation after epithelial-row overhang correction — 30 October 2026

**Gate B PASS retained. Outstanding: 0 BLOCKER · 0 FIX · 0 CONSIDER.** The native-PDF overhang revealed an extra illustrative epithelial rectangle outside the intended drawing boundary. Independently confirmed the exact arithmetic: `range(27,612,73)` produces nine rectangles, the last starting at x = 611 and ending at x = 682, beyond the 640-unit viewBox. The corrected `range(27,600,73)` produces eight complete rectangles, with the last starting at x = 538 and ending at x = 609, inside the layer's outer right boundary x = 614. This schematic makes no biological claim about a tissue's cell count.

Reversing only the loop stop 600 → 612 reconstructs the preceding confirmed figure-source SHA-256 exactly. Therefore no other figure text, geometry, arrow, mechanism or formula changed in this correction. Chapter, story, all model/widget files, appended enhancements and domain check retain their preceding confirmed hashes. The earlier visual recheck did not detect this shape overhang; this source correction closes that subsequently observed defect rather than treating the older image review as proof of its absence.

Read the strengthened browser SVG audit: alongside existing text bounds it now checks `getBBox()` for every rect, circle, ellipse, path, line, polygon and polyline against the viewBox, for all nine plates in the acceptance matrix. This is an appropriate direct regression check for the generated extra rectangle. Bounding boxes do not replace inspection of stroke rendering or PDF images. The `pdftoppm -scale-to` subprocess argument is now the string `'1500'`, repairing harness invocation without changing product content. Grounding and provenance record both changes and the need to rebuild/recheck.

Reverified all **214 preserved files** with exact shared-enhancements reconstruction: **zero hash/length failures**. No browser/PDF receipt for this newly corrected build was reviewed, so earlier-build passes are not represented as final acceptance of it. The unchanged domain-model check was not rerun as a substitute for the required rebuilt visual checks.

Latest reviewed SHA-256 values:

```text
11fdcbe97e458de8fc59d2fbd8e7b179401ba7dd749bd8ee15ad902f38d5b4ef  grounding/ch07.md
beb585fcc396c0839a0ba51563147f28af68dd58867e681c9f394efcbe32de89  src/ch07.md
bd71750e225f150f137ab8e124781b45a8da54e280b837aa94a8d8db7a6df899  src/stories/beaumont-st-martin.md
0f1a48af8cda115378c6e2b686aa1fac0f0dc9fc5bdf524659992fb375593029  figs_ch07.py
bb9fd303a287318c4d46839f2a340411406d586c49f307d8d0df2c0f89321ec5  provenance/ch07.yml
52bd6b279a3aa74d3da057e5181e713c452d00505fc15a5a3ee3b7bc4cdaa93f  live/digestion_model.js
ecc384f92ba4b469f0c342242337424cf8b6fc454acd507ae4f64435f919f280  live/w_digestive_steps.js
8b85baf35c167b58dc6f24a6dd7d0c64154b1acb77ace95707076a48da35b999  live/w_emulsification.js
ceeeb0e98196ef7a60a1aa21bce4759ade304170aefd914d9fe19d066514adf4  live/w_absorption_routes.js
5502146a54729d027ddface39ff63361b82398f2f24342363ab72c063209d4f3  live/enhancements.js
bb7c7c14df8d965c69ed1e67799978e745d121f35ae16ecbeb842dcfa3ec1285  tests/ch07_domain.mjs
8aff7e302d0813636eb88117c2ff3e3271ea65da6cefcf9d08a11fdc52db2068  tests/qa_ch07.py
f8dcf4f8ba519177dd539abbd601eea835bc19cfa73a9bd0a200adfebf5fd72f  tests/ch07-preserved.json
```

Latest Gate B counts: **0 BLOCKER · 0 FIX · 0 CONSIDER outstanding**. Only this report was edited.


## Frozen-source reconfirmation after all-open print setup correction — 30 October 2026

**Gate B source PASS retained. Outstanding: 0 BLOCKER · 0 FIX · 0 CONSIDER.** Compared the frozen source with the preceding confirmed hashes: chapter, story, corrected eight-cell figure, all numerical/widget files, complete enhancements file, domain test and preservation baseline are unchanged. Only grounding/provenance and the browser acceptance harness changed. No candidate `p_print_figures.css` exists anywhere under source, and all **214 preserved files** again match exact lengths and SHA-256, reconstructing only the three authorised appended enhancements. The delivered shared print engine is therefore preserved.

Read the revised evidence account in grounding/provenance. It explicitly withdraws the inference of a print defect from an offscreen pre-pagination visibility probe and unnormalised raw-text spacing. Independently normalised the supplied first exported PDF's text at `/tmp/lt_bio_ch07/final/visual/all-open-light.txt`: **all nine entire chapter captions and all three widget-backed drawing titles are present**. This is supplementary text evidence from that PDF, not a claim to have completed visual inspection of every page or acceptance of the subsequently rebuilt corrected-figure artifact.

The current harness opens all three widgets together, checks actual print display styles and exclusion of interactive stages, exports the real PDF, then checks original SVG visibility after pagination and searches every entire caption in reading-order text. This meaningfully tests the disputed behaviour rather than requiring an unnecessary shared-engine change. No final corrected-build full-suite pass is claimed; that receipt had not been supplied at this reconfirmation.

Frozen reviewed SHA-256 values:

```text
8d50988b50cc47c9013fa6287b27cc08421d838a6d2548275b0a7c67c2a7e5c6  grounding/ch07.md
beb585fcc396c0839a0ba51563147f28af68dd58867e681c9f394efcbe32de89  src/ch07.md
bd71750e225f150f137ab8e124781b45a8da54e280b837aa94a8d8db7a6df899  src/stories/beaumont-st-martin.md
0f1a48af8cda115378c6e2b686aa1fac0f0dc9fc5bdf524659992fb375593029  figs_ch07.py
6147735e1c0a4ad59e88e57e96699da658035827ac9c61088539b9a26a513d42  provenance/ch07.yml
52bd6b279a3aa74d3da057e5181e713c452d00505fc15a5a3ee3b7bc4cdaa93f  live/digestion_model.js
ecc384f92ba4b469f0c342242337424cf8b6fc454acd507ae4f64435f919f280  live/w_digestive_steps.js
8b85baf35c167b58dc6f24a6dd7d0c64154b1acb77ace95707076a48da35b999  live/w_emulsification.js
ceeeb0e98196ef7a60a1aa21bce4759ade304170aefd914d9fe19d066514adf4  live/w_absorption_routes.js
5502146a54729d027ddface39ff63361b82398f2f24342363ab72c063209d4f3  live/enhancements.js
bb7c7c14df8d965c69ed1e67799978e745d121f35ae16ecbeb842dcfa3ec1285  tests/ch07_domain.mjs
e9dae8dfb3ab166d988320f221107c54bf7f38dc3f11ce83654389f6a419fa26  tests/qa_ch07.py
f8dcf4f8ba519177dd539abbd601eea835bc19cfa73a9bd0a200adfebf5fd72f  tests/ch07-preserved.json
```

Frozen-source Gate B counts: **0 BLOCKER · 0 FIX · 0 CONSIDER outstanding**. Only this report was edited.


## Final frozen-build receipt reconfirmation — 30 October 2026

**Gate B final source PASS. Outstanding: 0 BLOCKER · 0 FIX · 0 CONSIDER.** Independently compared every one of the 13 entries in `/tmp/lt_bio_ch07/final/artifact-hashes.json` against both the latest frozen-source PASS hashes above and current file bytes/lengths: **13 matches, zero mismatches**. Rechecked all 214 preserved files with exact reconstruction of the pre-Chapter-7 enhancements content: zero hash/length failures. The previously reviewed corrected eight-cell figure is unchanged.

Read the actual final Chapter 7 receipt at `/tmp/lt_bio_ch07/final/qa_ch07/report.json`: **status pass, 1,710 recorded assertions, 2,046 independent domain cases, no console/page errors**, cache `lw-1fb964059709` matching the recorded browser cache. This receipt is for the frozen corrected artifact whose 13 source hashes match. Read the unaffected chapter regression receipts/logs: Chapter 6 reports PASS with 1,441 assertions and 1,145 independent cases; Chapter 5's completion log reports PASS with 985 assertions and 18,133 domain cases, and its JSON records no errors. These are inspected local execution receipts, not claims that this reviewer personally reran each suite.

Independently examined the final exported PDF's actual reading-order text at `/tmp/lt_bio_ch07/final/qa_ch07/print-raw.txt`: after the documented typography/whitespace/hyphen normalisation, **all nine entire Chapter 7 captions are present**. The story body's closing-sentence probe is absent, agreeing with `story_body_printed: false` in the receipt. The ordinary book PDF therefore must not be represented as containing the complete separate story-panel body; interactive story behaviour has its own acceptance checks. Caption presence is not a claim of new independent visual review of every printed drawing.

Read `/tmp/lt_bio_ch07/final/visual/print-restoration.json`: it records separate fresh contexts for light, dark and sepia, all three original widget-backed SVGs restored after each actual first PDF export, and all nine full captions per export. Read `extra-views.json`: it records 18 additional changed route/widget states across mobile/desktop and all three themes, with 36 screenshots. Those are supplementary execution receipts; no additional image inspection by this reviewer is claimed here.

The full-book final smoke run remains outside this final source/Chapter 7 decision: no completed smoke receipt was inspected, and no full-book smoke certification is given. No physical trial or publication is claimed. All four original section explain-backs remain exactly three sentences and appropriate to the final source.

Final matching source SHA-256 values:

```text
beb585fcc396c0839a0ba51563147f28af68dd58867e681c9f394efcbe32de89  src/ch07.md
0f1a48af8cda115378c6e2b686aa1fac0f0dc9fc5bdf524659992fb375593029  figs_ch07.py
bd71750e225f150f137ab8e124781b45a8da54e280b837aa94a8d8db7a6df899  src/stories/beaumont-st-martin.md
52bd6b279a3aa74d3da057e5181e713c452d00505fc15a5a3ee3b7bc4cdaa93f  live/digestion_model.js
ecc384f92ba4b469f0c342242337424cf8b6fc454acd507ae4f64435f919f280  live/w_digestive_steps.js
8b85baf35c167b58dc6f24a6dd7d0c64154b1acb77ace95707076a48da35b999  live/w_emulsification.js
ceeeb0e98196ef7a60a1aa21bce4759ade304170aefd914d9fe19d066514adf4  live/w_absorption_routes.js
5502146a54729d027ddface39ff63361b82398f2f24342363ab72c063209d4f3  live/enhancements.js
6147735e1c0a4ad59e88e57e96699da658035827ac9c61088539b9a26a513d42  provenance/ch07.yml
8d50988b50cc47c9013fa6287b27cc08421d838a6d2548275b0a7c67c2a7e5c6  grounding/ch07.md
e9dae8dfb3ab166d988320f221107c54bf7f38dc3f11ce83654389f6a419fa26  tests/qa_ch07.py
bb7c7c14df8d965c69ed1e67799978e745d121f35ae16ecbeb842dcfa3ec1285  tests/ch07_domain.mjs
f8dcf4f8ba519177dd539abbd601eea835bc19cfa73a9bd0a200adfebf5fd72f  tests/ch07-preserved.json
```

Final Gate B counts: **0 BLOCKER · 0 FIX · 0 CONSIDER outstanding**. Initial two FIX findings closed; both optional suggestions adopted. Only this report was edited.
