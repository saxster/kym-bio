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

enum DistractorCraftAuditor {
    struct AuditVerdict: Equatable, Sendable {
        let caseId: String
        let maxToMinLengthRatio: Double
        let issues: [String]
        var passed: Bool { issues.isEmpty }
    }

    static func audit(_ claimCase: BiologicalClaimCase) -> AuditVerdict {
        var issues: [String] = []
        let lengths = claimCase.flawChoices.map { $0.trimmingCharacters(in: .whitespacesAndNewlines).count }
        let minLen = max(1, lengths.min() ?? 1)
        let maxLen = lengths.max() ?? 1
        let ratio = Double(maxLen) / Double(minLen)

        if ratio > 1.8 {
            issues.append(String(format: "Option length ratio %.2f exceeds 1.80 symmetry ceiling.", ratio))
        }
        for (idx, choice) in claimCase.flawChoices.enumerated() {
            if choice.contains("(") || choice.contains(")") {
                issues.append("Option \(idx) contains parenthetical explanation giveaway.")
            }
            if choice.count < 45 {
                issues.append("Option \(idx) is too short (\(choice.count) chars) to match technical register.")
            }
        }
        return AuditVerdict(caseId: claimCase.id, maxToMinLengthRatio: ratio, issues: issues)
    }

    static func auditAll(_ cases: [BiologicalClaimCase] = BiologyClaimAutopsyCatalog.cases) -> [AuditVerdict] {
        cases.map { audit($0) }
    }
}

enum BiologyClaimAutopsyCatalog {
    static let cases: [BiologicalClaimCase] = [
        BiologicalClaimCase(
            id: "autopsy-alkaline-water",
            title: "Case 1 · 'Alkaline Water (pH 9.5) Alkalises Your Blood and Cures Fatigue'",
            viralClaimQuote: "\"Drinking bottled water at pH 9.5 raises your blood pH from acidic to alkaline, supercharging your red blood cells!\"",
            cambridgeStrandTag: "Unit 7.1,Unit 1.5 & Ch 7/10 · Homeostasis",
            flawChoices: [
                "Ignores gastric hydrochloric acid neutralisation and tight renal-respiratory blood pH buffering",
                "Assumes alkaline hydroxide ions cross the intestinal epithelium only by active transport pumps",
                "Overlooks that haemoglobin releases oxygen faster only when plasma pH rises above neutral levels"
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
                "Assumes oral amoxicillin requires at least seven days to diffuse into upper respiratory mucus",
                "Omits an untreated control group and confuses acellular viruses with cell-walled bacteria",
                "Ignores that cold viruses rapidly mutate their peptidoglycan cell walls against beta-lactams"
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
                "Uses a single-plant sample size without repeats and fails to control light intensity across groups",
                "Measures vertical stem elongation rather than counting the total number of new root hair cells",
                "Applies liquid mineral tonic to mature fern fronds that absorb nitrates only through stomata"
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
                "Ignores that dry woody biomass is synthesised from atmospheric carbon dioxide gas and water",
                "Overlooks that root hair cells convert absorbed silicate sand grains into cellulose fibres",
                "Forgets that phloem sieve tubes transport dissolved soil humus directly into woody bark tissue"
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
                "Confuses synaptic adenosine-receptor stimulation with chemical energy released by oxidising glucose",
                "Assumes skeletal muscle mitochondria oxidise caffeine molecules only during anaerobic exercise",
                "Overlooks that artificial sweeteners block glucose transport proteins across muscle membranes"
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
                "Confuses evaporative thermoregulation by dermal sweat glands with hepatic and renal urea excretion",
                "Assumes eccrine sweat ducts actively pump deaminated proteins against a concentration gradient",
                "Ignores that high ambient humidity prevents nephron glomeruli from filtering blood plasma"
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
    @State private var selectedConfidence: LearnerConfidenceStop? = .moderate
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

                    ConfidenceRailControl(
                        selectedStop: $selectedConfidence,
                        onDontKnowYet: {
                            selectedConfidence = .zero
                            submittedResult = BiologyClaimAutopsyCatalog.scoreAutopsy(
                                claimCase: activeCase,
                                selectedFlawIndex: selectedFlawIndex,
                                writtenEvaluation: writtenEvaluation
                            )
                        }
                    )

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
