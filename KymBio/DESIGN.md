# KymBio Design System & Architecture Charter

## 1. Visual Direction: The Standard
`KymBio` draws in The Standard, the design system it shares with the other subject apps and apple_poem.
Its themes, tokens, type scale, motion and components live in teaching_kit; the values and rules are in
`teaching_kit/docs/STANDARD.md`. Do not restate them here.
- **Themes:** the six Standard themes plus Follow System, with Vivid as the default. `Design/AppTheme.swift`
  moves a choice saved under the old catalogue: Terracotta and Scholar become Warm, Living World and Grove
  become Paper, Dusk stays Dusk, and the rest become Vivid.
- **Screens:** room pages use the editorial header (`JournalPage(eyebrow:)`), filters use the ink-inverted
  chip, and each room has at most one `BrassButtonStyle` primary action.
- **Features/ drift:** no radius literals, fixed or shorthand system fonts, system secondary text or named
  system colours (`check-consumers.mjs --lint`). Fixed sizes inside drawn figures go in `BioFigureGeometry`.
- **Living World web book:** gets the closest of its own `light`, `dark` and `sepia` themes plus the
  Standard colours as `--kymbio-*` variables.

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
