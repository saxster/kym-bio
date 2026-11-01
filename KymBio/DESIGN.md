# KymBio Design System & Architecture Charter

## 1. Visual Direction: Apple Journal for iPad + *The Living World*
`KymBio` uses the Apple Journal for iPad design kit (`Design/Journal/`) ported from `KymaiaTutor`:
- **Default Theme (`.journal`):** Soft lavender page (`#F3F1F7` light / `#0E0E12` dark) with lifted pure-white cards (`#FFFFFF` light / `#1C1B22` dark) and iris violet (`#5856D6` / `#7D7AFF`).
- **Signature Biology Theme (`.botanical` — *Living World*):** Warm rag paper (`#F7F3E8` light / `#0F1916` dark), deep forest ink (`#203D36` / `#ECF4F0`), conservation emerald (`#2E604A` / `#58B88C`), and terracotta specimen highlights (`#8A3B28` / `#E0866E`).
- **Mumbai Coastal Theme (`.monsoon` — *Marine Drive*):** Coastal mist (`#F1F5F7` light / `#0C1418` dark), Arabian Sea teal (`#125E7A` / `#57B8D9`), and lantern gold (`#7A4A10` / `#E8B268`).
- **Plus 5 Scholarly Themes:** `Sketchbook`, `Terracotta`, `Scholar`, `Grove`, and `Dusk` — all audited for WCAG AAA (`>= 7.0:1`) body ink and WCAG AA (`>= 4.5:1`) secondary/accent contrast.

## 2. Three-App Science Spine (`KymBio`, `KymChem`, `KymPhysics`)
- Kym's school textbook is **Cambridge Lower Secondary Science 8 (Second Edition)** (*Learner's Book 8* & *Workbook 8* by Mary Jones, Diane Fellowes-Freeman & Michael Smyth).
- `KymBio` provides a **3-Lens Filter** in the School Science 8 room:
  1. **Biology units (1, 4, 7)** *(Default)*: Unit 1 *Respiration*, Unit 4 *Ecosystems*, and Unit 7 *Diet and growth*.
  2. **Biology + Chem/Phys bridges**: Adds Unit 2 *Properties of materials*, Unit 3 *Forces and energy*, Unit 5 *Materials and cycles on Earth*, Unit 6 *Light*, and Unit 8 *Chemical reactions*, embedding First-Principles Bridge cards from *The Invisible World* (`../kym_chem`) and *The Moving World* (`../kym_physics`).
  3. **All 9 Science units**: Complete Table of Contents (`1.1`–`9.4`, LB pp. 8–326, WB pp. 2–197).
- Shared App Group (`group.com.kymaia.science`) synchronises textbook progress, Question Proofs, FSRS cards, and deadlines across `KymBio`, `KymChem`, and `KymPhysics`.

## 3. Pedagogical Honesty Guardrails
- **Three-Stage Readiness:** *1. Material in → 2. Checked learning → 3. Independent proof & spaced study*.
- **No False Mastery:** Viewing a Worked Example or Faded Completion marks the current attempt as `assisted`; independent proof (`proven` today, `secure` across 2+ calendar days) requires answering from a fresh attempt with zero hints.
- **No AI Rewriting of Retrieval:** Every learner answer field uses `.learnerTextInput(.retrieval)`, disabling autocorrect and Apple Intelligence Writing Tools (`.writingToolsBehavior(.disabled)`).
