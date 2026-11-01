import SwiftUI

// MARK: - Thinking Fortress: Biological Claim Autopsy Models & Catalog

struct BiologicalClaimCase: Identifiable, Codable, Equatable {
    let id: String
    let title: String
    let viralClaimQuote: String
    let cambridgeStrandTag: String
    let flawChoices: [String]
    let correctFlawIndex: Int
    let mechanismFallacyExplanation: String
    let modelCambridgeEvaluation: String
    let requiredKeyTerms: [String]
}

enum BiologyClaimAutopsyCatalog {
    static let cases: [BiologicalClaimCase] = [
        BiologicalClaimCase(
            id: "autopsy-alkaline-water",
            title: "Case 1 · 'Alkaline Water (pH 9.5) Alkalises Your Blood and Cures Fatigue'",
            viralClaimQuote: "\"Drinking bottled water at pH 9.5 raises your blood pH from acidic to alkaline, supercharging your red blood cells!\"",
            cambridgeStrandTag: "Unit 7.1,Unit 1.5 & Ch 7/10 · Homeostasis",
            flawChoices: [
                "Ignores stomach hydrochloric acid (pH 1.5–2.0) neutralisation and tight renal/respiratory blood pH buffering (7.35–7.45)",
                "Uses a thermometer with 1 °C graduations instead of 0.1 °C",
                "Measures plant transpiration rate in the dark"
            ],
            correctFlawIndex: 0,
            mechanismFallacyExplanation: "As soon as alkaline water enters the stomach, gastric juice (hydrochloric acid, pH ~1.5–2.0) neutralises it. Even more importantly, human blood pH is homeostatically locked between 7.35 and 7.45 by bicarbonate buffers, lung CO2 exhalation, and kidney nephrons—if blood pH actually rose to 9.5, plasma proteins and haemoglobin would denature fatally.",
            modelCambridgeEvaluation: "The claim is scientifically invalid because hydrochloric acid in the stomach neutralises alkaline water, and homeostasis (lungs and kidneys) keeps blood pH strictly buffered between 7.35 and 7.45 so enzymes and haemoglobin do not denature.",
            requiredKeyTerms: ["stomach", "acid", "neutralises", "blood", "homeostasis", "denature"]
        ),
        BiologicalClaimCase(
            id: "autopsy-monsoon-antibiotics",
            title: "Case 2 · 'Antibiotics Cured My Monsoon Cold in 48 Hours'",
            viralClaimQuote: "\"I took leftover amoxicillin tablets for my viral runny nose, and two days later I felt better—proving antibiotics kill cold viruses!\"",
            cambridgeStrandTag: "Unit 4 & Ch 2/14 · Scientific Enquiry & Selection",
            flawChoices: [
                "Uses metric units instead of imperial units",
                "No untreated control group (confounded by the immune system's natural 48-hour recovery) and confuses acellular viruses with prokaryotic bacteria",
                "Tests too many bacterial species at once"
            ],
            correctFlawIndex: 1,
            mechanismFallacyExplanation: "First, a single anecdote (n = 1) with no control group confuses natural immune recovery over 48 hours with drug efficacy. Second, antibiotics target bacterial peptidoglycan cell walls or 70S ribosomes; viruses are acellular protein-coated genetic material (no cell wall, no ribosomes) replicating inside host cells, so antibiotics have zero target to attack—and misusing them selects for antibiotic-resistant bacteria.",
            modelCambridgeEvaluation: "Antibiotics only inhibit bacteria (by targeting bacterial cell walls or ribosomes) and cannot affect viruses because viruses lack cell walls and replicate inside host cells; recovering in 48 hours without a control group reflects natural immune response.",
            requiredKeyTerms: ["bacteria", "viruses", "cell wall", "control", "immune", "resistant"]
        ),
        BiologicalClaimCase(
            id: "autopsy-fern-fertiliser",
            title: "Case 3 · 'Miracle Seaweed Tonic Doubles Plant Growth (Tested on 1 Window Fern)'",
            viralClaimQuote: "\"We placed one fern with Miracle Tonic on a sunny balcony and one untreated fern in a dark cupboard—the tonic fern grew twice as tall!\"",
            cambridgeStrandTag: "Unit 1/4/7 · Thinking and Working Scientifically",
            flawChoices: [
                "Sample size is n = 1 with no repeats, and light intensity/temperature were not kept constant as control variables",
                "The ruler used to measure stem height was made of plastic",
                "Ferns do not contain chlorophyll in their chloroplasts"
            ],
            correctFlawIndex: 0,
            mechanismFallacyExplanation: "In a fair test, only the independent variable (presence of tonic) may be changed while all control variables (light intensity, temperature, pot volume, water volume, initial plant mass) are kept constant. Placing the treated fern in sunlight and the control in a dark cupboard confounds the experiment with photosynthesis rate, and n = 1 cannot rule out individual genetic variation.",
            modelCambridgeEvaluation: "This is not a fair test because light intensity was not kept constant as a control variable (the sunlit plant photosynthesised more), and a sample size of one plant per group is too small to identify anomalous results or calculate a reliable mean.",
            requiredKeyTerms: ["fair test", "control variable", "light", "photosynthesis", "sample size", "mean"]
        ),
        BiologicalClaimCase(
            id: "autopsy-van-helmont-soil",
            title: "Case 4 · 'Giant Banyan Trees Build Their Heavy Wood Trunks Out of Soil'",
            viralClaimQuote: "\"A 100-tonne banyan tree has massive wooden branches, so it must have eaten 100 tonnes of soil through its roots as it grew.\"",
            cambridgeStrandTag: "Ch 5 & Unit 5.5 · Photosynthesis Mass Balance",
            flawChoices: [
                "Ignores that dry plant biomass (cellulose and lignin) is built almost entirely from atmospheric carbon dioxide gas (CO2) and water (H2O) during photosynthesis",
                "Assumes roots absorb chlorophyll from soil bacteria",
                "Forgets that banyan trees only respire during the daytime"
            ],
            correctFlawIndex: 0,
            mechanismFallacyExplanation: "As Jan Baptist van Helmont proved with his 5-year willow tree experiment (where the tree gained 74 kg while dry soil mass dropped by only 57 grams), soil only supplies trace mineral ions (like nitrates and magnesium) and water. The carbon and oxygen atoms making up >95% of dry wood biomass come from atmospheric CO2 gas entering through leaf stomata during photosynthesis.",
            modelCambridgeEvaluation: "Plant biomass is built primarily from carbon dioxide gas diffusing through stomata and water absorbed by roots during photosynthesis; soil only contributes a tiny mass of dissolved mineral ions such as nitrates and magnesium.",
            requiredKeyTerms: ["carbon dioxide", "water", "photosynthesis", "stomata", "mineral ions", "biomass"]
        ),
        BiologicalClaimCase(
            id: "autopsy-sugarfree-energy",
            title: "Case 5 · 'Zero-Calorie Caffeine Drinks Give Your Muscle Cells Boundless Energy'",
            viralClaimQuote: "\"This zero-sugar, zero-calorie energy drink gives your muscle mitochondria 4 hours of pure cellular energy!\"",
            cambridgeStrandTag: "Unit 1.4,Unit 7.1 & Ch 6/9 · Cellular Respiration vs. Synapses",
            flawChoices: [
                "Confuses nervous-system alertness (blocking adenosine receptors at brain synapses) with actual chemical energy (ATP) released by oxidising glucose or lipids in mitochondria",
                "Caffeine is a dietary fibre that cannot be absorbed into the bloodstream",
                "Muscle cells only use Vitamin C as their respiratory substrate"
            ],
            correctFlawIndex: 0,
            mechanismFallacyExplanation: "In biology, cellular energy means ATP synthesised by oxidising organic fuel molecules (glucose, fatty acids) during cellular respiration in mitochondria. A zero-calorie drink contains zero chemical bond energy (0 kJ) for respiration; caffeine merely blocks adenosine receptors in brain synapses so you temporarily feel less tired while drawing down your existing glycogen reserves.",
            modelCambridgeEvaluation: "Zero-calorie drinks provide no glucose or chemical energy for aerobic respiration in mitochondria; caffeine only stimulates the nervous system by blocking tiredness signals in the brain while cells must still oxidise stored glycogen or fat.",
            requiredKeyTerms: ["glucose", "respiration", "mitochondria", "chemical energy", "nervous", "glycogen"]
        ),
        BiologicalClaimCase(
            id: "autopsy-detox-sweat",
            title: "Case 6 · 'Hot Yoga & Detox Teas Flush Metabolic Toxins Out Through Your Sweat'",
            viralClaimQuote: "\"Sweating heavily in a hot room replaces your liver and kidneys by flushing metabolic toxins out through your skin pores!\"",
            cambridgeStrandTag: "Ch 10 & Unit 1.5 · Excretion vs. Thermoregulation",
            flawChoices: [
                "Confuses thermoregulatory evaporative cooling (99% water + NaCl) with hepatic deamination and renal nephron filtration of urea",
                "Sweat glands are located inside the lungs rather than the dermis",
                "The liver produces oxygen gas during exercise"
            ],
            correctFlawIndex: 0,
            mechanismFallacyExplanation: "Sweating is a thermoregulatory homeostasis response: evaporation of water from the skin surface removes latent heat to cool blood in dermal capillaries. Sweat is ~99% water with small amounts of sodium chloride. Metabolic waste products and toxins are detoxified by liver hepatocytes (converting excess amino acids to urea) and filtered out of blood plasma by kidney nephrons.",
            modelCambridgeEvaluation: "Sweat glands function in thermoregulation (cooling the body by evaporation of water), whereas metabolic wastes like urea and toxins are broken down by the liver and filtered from the blood by the kidneys.",
            requiredKeyTerms: ["thermoregulation", "evaporation", "water", "liver", "kidneys", "urea"]
        )
    ]

    /// Scores a claim autopsy submission (`flawCorrect` + `evaluationScore`).
    static func scoreAutopsy(
        claimCase: BiologicalClaimCase,
        selectedFlawIndex: Int?,
        writtenEvaluation: String
    ) -> (isFlawCorrect: Bool, recallEval: BiologicalRecallEvaluation, passedProof: Bool) {
        let flawOK = (selectedFlawIndex == claimCase.correctFlawIndex)
        let eval = AnswerComparison.evaluateRecall(
            spoken: writtenEvaluation,
            expected: claimCase.modelCambridgeEvaluation,
            keyTerms: claimCase.requiredKeyTerms
        )
        let passed = flawOK && eval.combinedScore >= 0.55
        return (flawOK, eval, passed)
    }
}

// MARK: - Thinking Fortress: Biological Claim Autopsy View

struct BiologyClaimAutopsyView: View {
    @State private var selectedCaseID: String = BiologyClaimAutopsyCatalog.cases[0].id
    @State private var selectedFlawIndex: Int?
    @State private var writtenEvaluation: String = ""
    @State private var submittedResult: (isFlawCorrect: Bool, recallEval: BiologicalRecallEvaluation, passedProof: Bool)?
    @State private var completedCaseIDs: Set<String> = []

    private static let completedKey = "kymbio.thinkingfortress.completed"

    private var activeCase: BiologicalClaimCase {
        BiologyClaimAutopsyCatalog.cases.first(where: { $0.id == selectedCaseID }) ?? BiologyClaimAutopsyCatalog.cases[0]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.md) {
            // Case selector strip
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: Spacing.xs) {
                    ForEach(BiologyClaimAutopsyCatalog.cases) { item in
                        let isDone = completedCaseIDs.contains(item.id)
                        JournalChip(
                            item.title,
                            systemImage: isDone ? "checkmark.shield.fill" : "shield.lefthalf.filled",
                            isSelected: item.id == selectedCaseID
                        ) {
                            selectedCaseID = item.id
                            selectedFlawIndex = nil
                            writtenEvaluation = ""
                            submittedResult = nil
                        }
                    }
                }
            }

            // Active Claim Dissection Bench
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    HStack {
                        JournalChip(activeCase.cambridgeStrandTag, systemImage: "magnifyingglass.circle.fill", tone: .accent)
                        Spacer()
                        if completedCaseIDs.contains(activeCase.id) {
                            JournalChip("Claim Dissected", systemImage: "checkmark.seal.fill", tone: .success)
                        }
                    }

                    Text(activeCase.title)
                        .font(.kymaiaTitle3)
                        .foregroundStyle(Color.kymaiaInk)

                    VStack(alignment: .leading, spacing: 4) {
                        Label("Viral claim to evaluate (Science in Context):", systemImage: "quote.opening")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaWarning)
                        Text(activeCase.viralClaimQuote)
                            .font(.kymaiaSerifProse)
                            .foregroundStyle(Color.kymaiaInk)
                            .padding(Spacing.sm)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .fill(Color.kymaiaElevatedSurface)
                            )
                    }

                    // Step 1: Identify the Methodological / Mechanistic Flaw
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Text("Step 1 · Spot the primary scientific & experimental flaw")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaPrimary)

                        ForEach(Array(activeCase.flawChoices.enumerated()), id: \.offset) { idx, choice in
                            Button {
                                selectedFlawIndex = idx
                            } label: {
                                HStack(alignment: .top, spacing: Spacing.sm) {
                                    Image(systemName: selectedFlawIndex == idx ? "largecircle.fill.circle" : "circle")
                                        .foregroundStyle(selectedFlawIndex == idx ? Color.kymaiaPrimary : Color.kymaiaMutedInk)
                                    Text(choice)
                                        .font(.kymaiaBody)
                                        .foregroundStyle(Color.kymaiaInk)
                                        .multilineTextAlignment(.leading)
                                    Spacer()
                                }
                                .padding(Spacing.sm)
                                .background(
                                    RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                        .fill(selectedFlawIndex == idx ? Color.kymaiaPrimary.opacity(0.10) : Color.kymaiaElevatedSurface)
                                )
                            }
                            .buttonStyle(.plain)
                            .accessibilityIdentifier("claim-autopsy.choice.\(idx)")
                        }
                    }

                    // Step 2: Write or Speak Cambridge Scientific Evaluation
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        HStack {
                            Text("Step 2 · Write (or speak) your Cambridge scientific evaluation refuting the claim")
                                .font(.kymaiaCaption.weight(.semibold))
                                .foregroundStyle(Color.kymaiaPrimary)
                            Spacer()
                            VoiceDictationButton(text: $writtenEvaluation, label: "Speak evaluation")
                        }

                        WritingTextEditor(text: $writtenEvaluation, serif: true)
                            .learnerTextInput(.retrieval)
                            .frame(minHeight: 96)
                            .padding(Spacing.xs)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .fill(Color.kymaiaElevatedSurface)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .strokeBorder(Color.kymaiaControlBorder, lineWidth: 1)
                            )
                    }

                    Button {
                        let res = BiologyClaimAutopsyCatalog.scoreAutopsy(
                            claimCase: activeCase,
                            selectedFlawIndex: selectedFlawIndex,
                            writtenEvaluation: writtenEvaluation
                        )
                        submittedResult = res
                        if res.passedProof {
                            completedCaseIDs.insert(activeCase.id)
                            UserDefaults.standard.set(Array(completedCaseIDs), forKey: Self.completedKey)
                        }
                    } label: {
                        Label("Run claim autopsy", systemImage: "checkmark.shield.fill")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .regular))
                    .disabled(selectedFlawIndex == nil || writtenEvaluation.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)

                    if let res = submittedResult {
                        Divider()
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            HStack {
                                Image(systemName: res.passedProof ? "checkmark.seal.fill" : "exclamationmark.triangle.fill")
                                    .foregroundStyle(res.passedProof ? Color.kymaiaSuccess : Color.kymaiaWarning)
                                Text(res.isFlawCorrect ? "Flaw identified correctly!" : "Re-check Step 1: look for the biological mechanism or control-variable flaw.")
                                    .font(.kymaiaSubheadline)
                                    .foregroundStyle(res.isFlawCorrect ? Color.kymaiaSuccess : Color.kymaiaWarning)
                            }

                            Text(res.recallEval.feedbackSummary)
                                .font(.kymaiaBody)
                                .foregroundStyle(Color.kymaiaInk)

                            VStack(alignment: .leading, spacing: 4) {
                                Text("First-principles biological autopsy:")
                                    .font(.kymaiaCaption.weight(.semibold))
                                    .foregroundStyle(Color.kymaiaPrimary)
                                Text(activeCase.mechanismFallacyExplanation)
                                    .font(.kymaiaSerifProse)
                                    .foregroundStyle(Color.kymaiaSecondaryInk)
                            }

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Model Cambridge 0893 mark-scheme phrasing:")
                                    .font(.kymaiaCaption.weight(.semibold))
                                    .foregroundStyle(Color.kymaiaMutedInk)
                                Text(activeCase.modelCambridgeEvaluation)
                                    .font(.kymaiaSerifProse)
                                    .foregroundStyle(Color.kymaiaInk)
                            }
                        }
                    }
                }
            }
        }
        .onAppear {
            if let saved = UserDefaults.standard.stringArray(forKey: Self.completedKey) {
                completedCaseIDs = Set(saved)
            }
        }
    }
}
