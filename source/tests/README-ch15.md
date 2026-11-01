# Chapter 15 Verification & QA Suite

**Chapter 15:** *“Web of Life & Code Rewritable: Ecology, Nutrient Cycles & Biotechnology”*

## Quick Run

```bash
BIO_CH15_VERIFY_OUT=/tmp/lt_bio_ch15/final ./source/tests/verify_ch15.sh
```

## Components

1. **Pre-Authoring Preservation Baseline (`source/tests/ch15-preserved.json`):**
   - SHA-256 hashes and byte sizes of all `350` pre-existing files under `source/`, plus `original_base64` of `source/live/enhancements.js` (`114,778` bytes) to verify append-only addition of the three Chapter 15 widget entries (`ecosystem_trophic_lab`, `nutrient_cycles_eutrophication`, `biotech_fermenter_plasmid_lab`).
2. **Pure ES Module Domain Oracles (`source/tests/ch15_domain.mjs`):**
   - Exhaustive Node unit and oracle tests (`27,148` assertions) covering `source/live/biosphere_biotech_model.js` across all valid and out-of-range states, SGNP food web trophic energy cascades, Banyan tree pyramids of numbers/biomass/energy, human crop-vs-livestock dietary energy efficiency, 4-phase sigmoid population growth curves, 4-guild soil nitrogen cycling and legume nodulation, the 7-step Powai Lake eutrophication cascade, Mauna Loa Keeling carbon cycle and greenhouse gases, Western Ghats deforestation, the 5-step recombinant plasmid human insulin pipeline, 6-parameter industrial fermenters, enzyme/yeast biotechnology, GM crops vs CRISPR-Cas9, and immutable trial captures.
3. **Playwright Final-Book Browser, Print PDF & Offline Acceptance (`source/tests/qa_ch15.py`):**
   - Verifies all 9 SVG plates (`#fig-15-1` through `#fig-15-9`) across 5 viewport widths (`390, 820, 1024, 1180, 1440 px`) and 3 themes (`light`, `dark`, `sepia`) for zero text clipping, zero text overlap, zero arrow collision, and zero horizontal overflow.
   - Verifies all 3 interactive 2D Canvas widgets (`#fig-15-1`, `#fig-15-4`, `#fig-15-8`), 5-step guided tours, challenge completion via contrasting trial captures, full-size inspection, resize/theme repainting, keyboard accessibility, no-WebGL fallback, no-JS fallback, and service-worker offline reload.
   - Verifies companion story `lindeman-chain-boyer-doudna-biosphere-biotech` and natural links to 11 existing stories (`p-ali`, `p-ammal`, `p-helmont`, `p-ingenhousz`, `p-pasteur`, `p-subbarow`, `banting-mahalanabis-lifelines`, `franklin-khorana-codebreakers`, `meselson-flemming-gurdon-divisions`, `mendel-morgan-sanghvi-inheritance`, `darwin-wallace-luria-sahni-selection`) with `0` hijacked links in preserved Chapters 0–14.
   - Generates print PDF and high-resolution page PNG receipts (`pdf-*.png`) for direct visual inspection.
