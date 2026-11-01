# Chapter 11 local verification

From `/Users/amarsukhi/src/MyCode/kym_bio/source`, run:

```bash
./tests/verify_ch11.sh
```

This command builds the real book and runs Chapter 11 acceptance, the unchanged Chapter 10, Chapter 9, Chapter 8, Chapter 7, Chapter 6 and Chapter 5 acceptance scripts, and the whole-book live/offline smoke test. It exits nonzero if any step fails. It does not publish, push or dispatch hosted CI.

The default receipt root is `/tmp/lt_bio_ch11/final`, with separate `qa_ch11`, `qa_ch10_regression`, `qa_ch09_regression`, `qa_ch08_regression`, `qa_ch07_regression`, `qa_ch06_regression`, `qa_ch05_regression` and `full` directories. Use `BIO_CH11_VERIFY_OUT` for a separate run so earlier receipts remain intact. The Python interpreter defaults to `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`; `BIO_PYTHON_INTERPRETER` overrides it. Local prerequisites are the installed Node/esbuild dependencies, Playwright Chromium, `pdftotext` and `pdftoppm`.

`tests/qa_ch11.py` checks the actual `build/site`, not a component fixture. It retains its report and screenshots even if it fails. `tests/ch11_domain.mjs` independently recomputes complementary DNA base pairing (`A=T`, `C≡G`), Erwin Chargaff base equivalence (`%A = %T`, `%G = %C`), Rosalind Franklin & Raymond Gosling's Photo 51 B-DNA geometry (`3.4 nm` pitch, `0.34 nm` step, `10` bp/turn, `2.0 nm` width), combinatorial triplet capacity (`4¹ = 4`, `4² = 16`, `4³ = 64`), Crick–Brenner `+1/+2/+3` frameshift restoration, Marshall Nirenberg (`poly-U`) and Har Gobind Khorana synthetic repeating copolymers (`(UC)ₙ`, `(UG)ₙ`, `(AG)ₙ`, `(AC)ₙ`, `(UUC)ₙ`, `(UAG)ₙ`), the six-step Cambridge `0610 17.1` transcription-and-translation pathway, Vernon Ingram's beta-globin Codon 6 (`GAG → GTG`, `Glu⁶ → Val⁶`) missense substitution versus silent (`CTG → CTT`, `Leu³`) and nonsense (`CAG → TAG`, `UAG` Stop) substitutions, immutable captured states and explicit tour controls. `tests/ch11-preserved.json` captures the completed/corrected pre-Chapter 11 source state (including all 282 files from Chapters 0–10); never regenerate it to accept a change.

The acceptance matrix and browser receipts do not substitute for looking at images. Direct visual/PDF inspection, final cache version, independent reviews, access limits and any targeted follow-up runs are recorded in `gates/ch11-verification.md`. Activities were reviewed, not physically trialled.
