# Chapter 14 Verification & QA Suite

**Chapter 14:** *“The Glitch Engine & Natural Selection: Variation, Adaptation & Evolution”*

## Quick Run

```bash
BIO_CH14_VERIFY_OUT=/tmp/lt_bio_ch14/final ./source/tests/verify_ch14.sh
```

## Components

1. **Pre-Authoring Preservation Baseline (`source/tests/ch14-preserved.json`):**
   - SHA-256 hashes and byte sizes of all `333` pre-existing files under `source/`, plus `original_base64` of `source/live/enhancements.js` (`102,985` bytes) to verify append-only addition of the three Chapter 14 widget entries (`variation_mutation_lab`, `natural_selection_simulator`, `adaptive_features_selective_breeding`).
2. **Pure ES Module Domain Oracles (`source/tests/ch14_domain.mjs`):**
   - Exhaustive Node unit and oracle tests (`4,664` assertions) covering `source/live/selection_model.js` across all valid and out-of-range states, continuous vs discontinuous distributions, Lederberg (`1952`) replica-plating coordinates, mutagen dose multipliers (`1×` to `50×`), `10`-step antibiotic selection vs Day-3 relapse, *Biston betularia* industrial melanism and Clean Air recovery, *Plasmodium falciparum* `Hbˢ` balancing selection, xerophyte/hydrophyte leaf metrics, `40`-generation selective breeding lineages, vertebrate `Cytochrome c` / `HBB` molecular clocks, and immutable trial captures.
3. **Playwright Final-Book Browser, Print PDF & Offline Acceptance (`source/tests/qa_ch14.py`):**
   - Verifies all 9 SVG plates (`#fig-14-1` through `#fig-14-9`) across 5 viewport widths (`390, 820, 1024, 1180, 1440 px`) and 3 themes (`light`, `dark`, `sepia`) for zero text clipping, zero text overlap, zero arrow collision, and zero horizontal overflow.
   - Verifies all 3 interactive 2D Canvas widgets (`#fig-14-1`, `#fig-14-4`, `#fig-14-5`), 5-step guided tours, challenge completion via contrasting trial captures, full-size inspection, resize/theme repainting, keyboard accessibility, no-WebGL fallback, no-JS fallback, and service-worker offline reload.
   - Verifies companion story `darwin-wallace-luria-sahni-selection` and natural links to existing stories (`p-ammal`, `p-margulis`, `p-pasteur`, `p-ramachandran`, `franklin-khorana-codebreakers`, `meselson-flemming-gurdon-divisions`, `mendel-morgan-sanghvi-inheritance`) with `0` hijacked links in preserved Chapters 0–13.
   - Generates print PDF and high-resolution page PNG receipts (`pdf-*.png`) for direct visual inspection.
