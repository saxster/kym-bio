# Chapters 11–15 reader revision

Date: 1 November 2026

Status: PASS — final isolated build, all five domain suites, independent scene regressions, actual WebGL stations, all chapter browser/figure/print suites, whole-book runtime/offline smoke and source-stability checks.

## Scope

Corrected the five manuscripts, figure text, companion stories, grounding notes, provenance, 2D widgets, 3D Atlas scenes and models, guided tours, lesson catalogue and worked answers. Historical scenes and the five-chapter progression remain. Unrelated concurrent Chapters 1–10 changes were preserved. Nothing was published or pushed.

The revision distinguishes synonymous sequence identity from biological neutrality; mature HBB numbering from translation initiation; homologues from sisters; meiosis sorting products from functional gametes; dominance from transcription; probabilities from guaranteed family outcomes; mutation from selection; empirical evidence from illustrative data; trophic production from food absorption; and insulin cloning from expression and processing.

The independent scene review also corrected right-handed DNA geometry, reversible normal/sickle red-cell geometry, missing Chapter 12 material import, and invalid surface/vector scene calls. The new scene regressions construct actual Three.js scenes without WebGL and check finite vertices, rail handedness, cell geometry and fibre visibility. The final WebGL gate also exposed missing material imports and invalid surface, plot, particle and blob calls in Chapters 14–15. Those calls and the affected axis/marker coordinates were corrected; new regressions exercise real assemblies across control extremes.

## Chapter decisions and reasons

- **11 — DNA and the genetic code:** Kept the experimental stories while tightening the relationship between DNA, genes, RNA and proteins. A synonymous change preserves the encoded amino-acid sequence, but is not automatically biologically harmless. Explained mature haemoglobin-chain numbering and corrected the displayed DNA/RNA sequences. These changes prevent the models from teaching stronger claims than the evidence supports.
- **12 — Cell division and expression:** Made homologues, sister chromatids and chromosome counts explicit. Qualified the four products of meiosis, the simplified human-cell examples and the representative gene-expression panel. Separated banana sterility from parthenocarpy and clarified what cloning preserves. These distinctions connect the chromosome diagrams to actual cells and organisms without presenting one organism as a universal rule.
- **13 — Inheritance:** Separated dominance from gene transcription and avoided treating allele count as a direct enzyme-percentage measurement. Clarified expected cross ratios, test-cross limitations, pedigree assumptions and sex-linked examples. Revised the predictions and worked answers so the reasoning tests inference rather than memorised ratios.
- **14 — Evolution:** Labelled selection data and model time as illustrative, distinguished mutation from selection and qualified claims about inherited variation. Improved the leaf examples, sickle-cell explanation and molecular comparisons. The reader can now distinguish an observed result, an explanatory mechanism and an assumption built into an activity.
- **15 — Ecology and biotechnology:** Distinguished trophic production from absorbed food and made transfer efficiency an explicit model assumption. Corrected insulin production, compatible DNA ends, CRISPR repair and eutrophication explanations. Marked the Mumbai environments as fictional separate examples. This preserves the teaching stories while removing misleading causal shortcuts.

Across all five chapters, revised summaries, recall prompts, answer explanations, SVG labels, model readouts and guided activities follow the same scientific distinctions. Story links were checked as part of the browser suites. The book has not been reduced to a shorter outline.

## Local command

From the repository root:

```bash
./source/tests/verify_ch11_15_revision.sh
```

The runner defaults to `python3`. Set `BIO_PYTHON_INTERPRETER` to a Python interpreter with the book/Playwright dependencies if needed. The final run used `/tmp/kym-bio-revision-venv/bin/python`; its Playwright version was 1.64.1. Biology now has its own locked Node installation rather than a symlink into Physics. The removed external Python environment interrupted only the final smoke-test launch; the resumed run validates the same content/cache/test hashes before retaining any completed chapter receipt. `BIO_REVISION_OUT` changes the isolated evidence directory, default `/tmp/kym-bio-ch11-15-revision`.

The command builds an isolated site, runs all five domain suites plus independent revision regressions, runs all five chapter browser/figure/print suites, requires actual WebGL across the revised Atlas stations, checks prediction option structure, tests offline loading, and checks that frozen revised sources remain unchanged during verification. It exits unsuccessfully on any failure. The old chapter-authoring preservation checks remain available when no revised baseline is supplied. For the shared enhancements table, the revised baseline freezes the module wrapper and all Chapter 11–15 entries; independent concurrent Chapter 1–10 entries are outside this revision. Other tracked files retain whole-file hashes.

Build chunk configuration now uses a unique temporary directory per build; isolated builds no longer race over a shared `.chunks/cfg.json`.

## Evidence

Final run directory: `/tmp/kym-bio-ch11-15-final`.

Domain and browser results, screenshots, print receipts, frozen source hashes and final status are retained there. A `result.json` with status `pass` is written only after every required check succeeds.

## Final observed results

- 82,146 domain assertions passed, plus independent sequence, ploidy, DNA handedness and reversible red-cell scene regressions.
- All 20 Atlas stations rendered in actual WebGL with changed controls, mobile resize and no browser errors.
- Chapter browser suites passed 1,458 / 1,456 / 1,463 / 1,395 / 1,382 checks respectively (7,154 total). They include figures, control behaviour, keyboard access, tours, stories, print, fallbacks and chapter offline checks.
- The whole-book live-figure and explorer smoke passed, followed by a successful service-worker offline reload with a working live figure and no console errors. Two software-GL performance notes were ignored by the existing harness.
- All frozen revised source hashes match. Final cache: `lw-f998a796fb9c`. Final receipt: `/tmp/kym-bio-ch11-15-final/result.json`.
- The finish resumed after the removed external environment was replaced; completed chapter receipts were retained only after exact content/cache/test validation. Domain and WebGL checks ran again in the isolated environment.

Local preview: http://127.0.0.1:61988/index.html#ch11
