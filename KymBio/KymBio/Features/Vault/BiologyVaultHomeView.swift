import AVFoundation
import SwiftUI

// MARK: - Learn By Heart Models & Progressive Deletion Engine

public struct BioLearnByHeartCard: Identifiable, Codable, Equatable, Sendable {
    public var id: String
    public var title: String
    public var category: String
    public var unitRef: String
    public var chapterNumber: Int
    public var text: String
    public var keyTerms: [String]
    public var whyItMatters: String
}

public enum BioProgressiveDeletionComposer {
    /// Generates 6 progressive deletion stages (0 = full text ... 5 = first-letter cold recall).
    public static func render(text: String, keyTerms: [String], stage: Int) -> String {
        guard stage > 0 else { return text }
        let words = text.components(separatedBy: " ")
        let normalizedKeySet = Set(keyTerms.map { $0.lowercased().trimmingCharacters(in: .punctuationCharacters) })

        return words.enumerated().map { index, token in
            let clean = token.trimmingCharacters(in: .punctuationCharacters)
            guard clean.count >= 2 else { return token }
            let isKeyTerm = normalizedKeySet.contains(clean.lowercased())

            let shouldMask: Bool
            switch stage {
            case 1:
                shouldMask = isKeyTerm && (index % 2 == 0)
            case 2:
                shouldMask = isKeyTerm
            case 3:
                shouldMask = isKeyTerm || (clean.count >= 5 && index % 2 == 0)
            case 4:
                shouldMask = clean.count >= 4
            default:
                shouldMask = true
            }

            guard shouldMask else { return token }
            let prefix = token.prefix(while: { $0.isPunctuation })
            let suffix = token.reversed().prefix(while: { $0.isPunctuation }).reversed()
            if stage <= 3 {
                let firstChar = clean.first.map(String.init) ?? "_"
                let underscores = String(repeating: "_", count: max(clean.count - 1, 2))
                return "\(prefix)\(firstChar)\(underscores)\(String(suffix))"
            } else {
                let underscores = String(repeating: "_", count: max(clean.count, 3))
                return "\(prefix)\(underscores)\(String(suffix))"
            }
        }.joined(separator: " ")
    }
}

// MARK: - Greek & Latin Morpheme Models

public enum MorphemeOwnershipRung: Int, Codable, CaseIterable, Sendable {
    case seen = 0
    case decoded = 1
    case context = 2
    case examReady = 3
    case owned = 4

    public var label: String {
        switch self {
        case .seen: return "1. Seen"
        case .decoded: return "2. Decoded"
        case .context: return "3. In Context"
        case .examReady: return "4. Exam-Ready"
        case .owned: return "5. Owned"
        }
    }
}

public struct BioMorphemeEntry: Identifiable, Codable, Equatable, Sendable {
    public var id: String
    public var root: String
    public var origin: String
    public var literalMeaning: String
    public var biologyTerms: [String]
    public var wordBreakdownExample: String
    public var unitConnection: String
}

// MARK: - Pre-Seeded Vault & Morpheme Catalog

public enum BiologyVaultCatalog {
    public static let cards: [BioLearnByHeartCard] = [
        BioLearnByHeartCard(
            id: "vault-aerobic-eq",
            title: "Aerobic respiration word and symbol equation",
            category: "Core Equation",
            unitRef: "Unit 1.4 · Ch 3",
            chapterNumber: 3,
            text: "glucose + oxygen -> carbon dioxide + water (C6H12O6 + 6O2 -> 6CO2 + 6H2O), releasing energy as ATP inside the mitochondria.",
            keyTerms: ["glucose", "oxygen", "carbon", "dioxide", "water", "C6H12O6", "6O2", "6CO2", "6H2O", "energy", "ATP", "mitochondria"],
            whyItMatters: "Cambridge mark schemes require 'releases energy' (never 'makes' or 'produces' energy) and distinguish cellular respiration in mitochondria from breathing."
        ),
        BioLearnByHeartCard(
            id: "vault-anaerobic-compare",
            title: "Anaerobic respiration: human muscle vs. yeast",
            category: "Comparison",
            unitRef: "Unit 1.4 · Ch 3",
            chapterNumber: 3,
            text: "In human muscle during vigorous exercise: glucose -> lactic acid, releasing a small amount of energy and building an oxygen debt. In yeast fermentation: glucose -> ethanol + carbon dioxide.",
            keyTerms: ["muscle", "glucose", "lactic", "acid", "oxygen", "debt", "yeast", "ethanol", "carbon", "dioxide"],
            whyItMatters: "Human muscles never produce ethanol or carbon dioxide during anaerobic respiration — only lactic acid."
        ),
        BioLearnByHeartCard(
            id: "vault-alveoli-adaptations",
            title: "Alveolar gas exchange: three structural adaptations",
            category: "Structure & Function",
            unitRef: "Unit 1.2 · Ch 5",
            chapterNumber: 5,
            text: "Alveoli maximise diffusion rate via Fick's Law by providing a huge total surface area, walls that are a single squamous epithelial cell thick for a short diffusion distance, and a dense capillary network with continuous blood flow and ventilation to maintain a steep concentration gradient.",
            keyTerms: ["diffusion", "surface", "area", "single", "cell", "thick", "distance", "capillary", "steep", "concentration", "gradient"],
            whyItMatters: "Every 3-mark Cambridge question on gas exchange awards 1 mark each for surface area, one-cell-thick wall, and steep concentration gradient."
        ),
        BioLearnByHeartCard(
            id: "vault-inspiration-cascade",
            title: "Mechanism of inhalation (breathing in)",
            category: "Causal Cascade",
            unitRef: "Unit 1.3 · Ch 5",
            chapterNumber: 5,
            text: "The external intercostal muscles contract pulling the ribcage upwards and outwards, while the diaphragm muscles contract and flatten downwards. Thoracic volume increases, causing pressure inside the thorax to fall below atmospheric pressure, so air flows down the pressure gradient into the lungs.",
            keyTerms: ["intercostal", "contract", "upwards", "outwards", "diaphragm", "flatten", "volume", "increases", "pressure", "below", "atmospheric"],
            whyItMatters: "Notice how Boyle's Law (P1V1 = P2V2) drives inhalation: muscles change volume first, pressure drops second, and air flows last."
        ),
        BioLearnByHeartCard(
            id: "vault-photosynthesis-eq",
            title: "Photosynthesis equation and chloroplast energy transfer",
            category: "Core Equation",
            unitRef: "Unit 4.1 · Ch 7",
            chapterNumber: 7,
            text: "carbon dioxide + water -> glucose + oxygen (6CO2 + 6H2O -> C6H12O6 + 6O2) in the presence of light and chlorophyll inside chloroplasts, transferring light energy into chemical potential energy stored in glucose.",
            keyTerms: ["carbon", "dioxide", "water", "glucose", "oxygen", "light", "chlorophyll", "chloroplasts", "chemical", "potential"],
            whyItMatters: "Photosynthesis is an endothermic reaction whose reactants and products are the exact reverse of aerobic respiration."
        ),
        BioLearnByHeartCard(
            id: "vault-osmosis-def",
            title: "Cambridge definition of osmosis",
            category: "Exact Definition",
            unitRef: "Ch 2 · Ch 7",
            chapterNumber: 2,
            text: "Osmosis is the net movement of water molecules from a region of higher water potential (dilute solution) to a region of lower water potential (concentrated solution) through a partially permeable membrane.",
            keyTerms: ["net", "water", "molecules", "higher", "potential", "dilute", "lower", "concentrated", "partially", "permeable", "membrane"],
            whyItMatters: "Always specify 'water molecules' and 'partially permeable membrane' to earn full marks."
        ),
        BioLearnByHeartCard(
            id: "vault-enzyme-denaturation",
            title: "Enzyme lock-and-key specificity and thermal denaturation",
            category: "Mechanism",
            unitRef: "Unit 7.1 · Ch 3",
            chapterNumber: 3,
            text: "An enzyme is a biological catalyst made of folded protein with a specifically shaped active site complementary to its substrate. Above the optimum temperature, kinetic vibration breaks intramolecular bonds, permanently changing the 3D shape of the active site so the substrate can no longer fit — the enzyme is denatured.",
            keyTerms: ["catalyst", "protein", "active", "site", "complementary", "substrate", "optimum", "bonds", "shape", "denatured"],
            whyItMatters: "Never write that an enzyme 'dies' at high temperature — enzymes are molecules, not living cells; they denature."
        ),
        BioLearnByHeartCard(
            id: "vault-unit7-nutrients",
            title: "Unit 7.1 Seven nutrient groups and key deficiency diseases",
            category: "School Unit 7 Core",
            unitRef: "Unit 7.1–7.2 · Ch 4",
            chapterNumber: 4,
            text: "Carbohydrates provide fast respiratory energy; lipids provide long-term energy storage and thermal insulation; proteins build and repair cells (deficiency: kwashiorkor); Vitamin C maintains skin and gums (deficiency: scurvy); Vitamin D and calcium build strong bones and teeth (deficiency: rickets); iron forms haemoglobin in red blood cells (deficiency: anaemia); dietary fibre provides bulk for peristalsis; water acts as the solvent for all metabolic reactions.",
            keyTerms: ["Carbohydrates", "lipids", "insulation", "proteins", "kwashiorkor", "Vitamin", "scurvy", "calcium", "rickets", "iron", "haemoglobin", "anaemia", "fibre", "peristalsis", "solvent"],
            whyItMatters: "Directly covers Cambridge Science 8 Unit 7.1 and 7.2 Learner's Book (pp. 233–247) and Workbook (pp. 134–143)."
        ),
        BioLearnByHeartCard(
            id: "vault-unit7-antagonistic",
            title: "Unit 7.4 Antagonistic muscles at the hinge joint",
            category: "School Unit 7 Core",
            unitRef: "Unit 7.4 · Ch 10",
            chapterNumber: 10,
            text: "Skeletal muscles can only pull by contracting; they can never push. Therefore muscles work in antagonistic pairs across a joint: to bend (flex) the arm, the biceps contracts while the triceps relaxes; to straighten (extend) the arm, the triceps contracts while the biceps relaxes.",
            keyTerms: ["pull", "contracting", "push", "antagonistic", "pairs", "biceps", "contracts", "triceps", "relaxes"],
            whyItMatters: "Directly answers the classic Unit 7.4 question on why two muscles are needed to move a bone back and forth."
        ),
        BioLearnByHeartCard(
            id: "vault-unit4-bioaccumulation",
            title: "Unit 4.4 Bioaccumulation vs. biomagnification",
            category: "School Unit 4 Core",
            unitRef: "Unit 4.4 · Ch 15",
            chapterNumber: 15,
            text: "Bioaccumulation is the build-up of a persistent, non-biodegradable toxin (such as mercury or DDT) within a single organism over its lifetime because it cannot be excreted. Biomagnification is the increasing concentration of that toxin at successively higher trophic levels up a food chain because each predator consumes many contaminated prey.",
            keyTerms: ["Bioaccumulation", "persistent", "non-biodegradable", "single", "organism", "Biomagnification", "concentration", "trophic", "levels", "predator", "prey"],
            whyItMatters: "Distinguishing within one organism over time (bioaccumulation) from multiplying up trophic levels (biomagnification) wins full marks in Unit 4.4."
        ),
        BioLearnByHeartCard(
            id: "vault-central-dogma",
            title: "Central dogma of molecular biology",
            category: "First Principles",
            unitRef: "Ch 1 · Ch 12",
            chapterNumber: 12,
            text: "Genetic information flows from DNA to mRNA via transcription in the nucleus, and from mRNA triplets (codons) to a specific sequence of amino acids via translation at the ribosome, folding into a functional protein.",
            keyTerms: ["DNA", "mRNA", "transcription", "nucleus", "codons", "amino", "acids", "translation", "ribosome", "protein"],
            whyItMatters: "Connects genotype (DNA sequence) to phenotype (protein structure and function)."
        ),
        BioLearnByHeartCard(
            id: "vault-natural-selection",
            title: "Natural selection four-step mechanism (variation, struggle, survival, inheritance)",
            category: "First Principles",
            unitRef: "Ch 14",
            chapterNumber: 14,
            text: "1. Genetic variation exists among individuals in a population due to random mutation. 2. Environmental selection pressures create a struggle for survival. 3. Individuals with advantageous alleles are better adapted, survive, and reproduce. 4. They pass those advantageous alleles to their offspring, increasing the allele's frequency in the population over generations.",
            keyTerms: ["variation", "mutation", "selection", "pressures", "advantageous", "alleles", "adapted", "survive", "reproduce", "offspring", "frequency", "generations"],
            whyItMatters: "Individual organisms never evolve during their lifetime; populations evolve as allele frequencies shift across generations."
        )
    ]

    public static let morphemes: [BioMorphemeEntry] = [
        BioMorphemeEntry(id: "m-photo", root: "photo-", origin: "Greek phōs", literalMeaning: "light", biologyTerms: ["photosynthesis", "phototropism", "photoreceptor", "photon"], wordBreakdownExample: "photo (light) + syn (together) + thesis (putting) = putting molecules together using light", unitConnection: "Ch 7 · Unit 6"),
        BioMorphemeEntry(id: "m-aero", root: "aero- / an-", origin: "Greek aēr / an-", literalMeaning: "air / without", biologyTerms: ["aerobic", "anaerobic", "aerobe"], wordBreakdownExample: "an (without) + aero (air/oxygen) + bios (life) = respiration without oxygen", unitConnection: "Unit 1.4 · Ch 3"),
        BioMorphemeEntry(id: "m-haemo", root: "haemo- / -globin", origin: "Greek haima + Latin globus", literalMeaning: "blood + sphere", biologyTerms: ["haemoglobin", "oxyhaemoglobin", "haemorrhage"], wordBreakdownExample: "haemo (blood) + globin (globular protein) = the iron-containing oxygen carrier in red blood cells", unitConnection: "Unit 1.5 · Unit 7.1"),
        BioMorphemeEntry(id: "m-homeo", root: "homeo- + -stasis", origin: "Greek homoios + stasis", literalMeaning: "similar + standing still", biologyTerms: ["homeostasis", "homeothermic"], wordBreakdownExample: "homeo (steady/similar) + stasis (state) = maintaining a constant internal environment despite external change", unitConnection: "Ch 11"),
        BioMorphemeEntry(id: "m-osmo", root: "osmo-", origin: "Greek ōsmos", literalMeaning: "push / thrust", biologyTerms: ["osmosis", "osmoregulation", "osmotic pressure"], wordBreakdownExample: "osmo (push) + -sis (process) = water pushing across a partially permeable membrane", unitConnection: "Ch 2 · Ch 7"),
        BioMorphemeEntry(id: "m-troph", root: "-troph / trophic", origin: "Greek trophē", literalMeaning: "nourishment / feeding", biologyTerms: ["autotroph", "heterotroph", "trophic level", "eutrophication"], wordBreakdownExample: "auto (self) + troph (feeder) = an organism that makes its own organic food from inorganic molecules", unitConnection: "Unit 4 · Ch 15"),
        BioMorphemeEntry(id: "m-endo-exo", root: "endo- / exo-", origin: "Greek endon / exō", literalMeaning: "within (inward) / outside (outward)", biologyTerms: ["endothermic", "exothermic", "endocytosis", "exocytosis", "endoskeleton"], wordBreakdownExample: "endo (inward) + therm (heat) = a reaction that takes in thermal energy from the surroundings", unitConnection: "Unit 8.1–8.2 · Ch 3"),
        BioMorphemeEntry(id: "m-cyto-plasm", root: "cyto- + -plasm", origin: "Greek kytos + plasma", literalMeaning: "hollow vessel (cell) + moulded substance", biologyTerms: ["cytoplasm", "cytoskeleton", "cytokinesis", "lymphocyte", "phagocyte"], wordBreakdownExample: "phago (eating) + cyte (cell) = a white blood cell that engulfs and digests pathogens", unitConnection: "Unit 1.5 · Ch 2 · Ch 8"),
        BioMorphemeEntry(id: "m-chloro-phyll", root: "chloro- + -phyll", origin: "Greek chlōros + phyllon", literalMeaning: "pale green + leaf", biologyTerms: ["chlorophyll", "chloroplast", "mesophyll"], wordBreakdownExample: "meso (middle) + phyll (leaf) = the middle photosynthetic tissue layer of a leaf (palisade and spongy mesophyll)", unitConnection: "Ch 7"),
        BioMorphemeEntry(id: "m-geno-pheno", root: "geno- / pheno-", origin: "Greek genos / phainein", literalMeaning: "race/offspring (code) / to show (appearance)", biologyTerms: ["genotype", "phenotype", "genome", "gene", "pathogen"], wordBreakdownExample: "geno (genetic code) vs. pheno (what shows outwardly)", unitConnection: "Ch 12 · Ch 13"),
        BioMorphemeEntry(id: "m-karyo", root: "pro- / eu- + -karyote", origin: "Greek pro (before) / eu (true) + karyon (kernel/nucleus)", literalMeaning: "before nucleus / true nucleus", biologyTerms: ["prokaryote", "eukaryote", "karyotype"], wordBreakdownExample: "eu (true) + karyon (nucleus) = cells with a membrane-bound nucleus (plants, animals, fungi, protists)", unitConnection: "Ch 2"),
        BioMorphemeEntry(id: "m-peri-stalsis", root: "peri- + -stalsis", origin: "Greek peri + stalsis", literalMeaning: "around + constriction", biologyTerms: ["peristalsis", "pericardium", "periosteum"], wordBreakdownExample: "peri (around) + stalsis (squeezing) = wave-like muscular contractions squeezing food along the gut", unitConnection: "Unit 7.1 · Ch 4")
    ]
}

// MARK: - Speech Helper for Vault & Coach

@MainActor
public final class BioSpeechSynthesizer: ObservableObject {
    public static let shared = BioSpeechSynthesizer()
    private let synthesizer = AVSpeechSynthesizer()
    @Published public var isSpeaking: Bool = false

    public func speak(_ text: String, rate: Float = 0.48) {
        synthesizer.stopSpeaking(at: .immediate)
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-GB") ?? AVSpeechSynthesisVoice(language: "en-US")
        utterance.rate = rate
        synthesizer.speak(utterance)
        isSpeaking = true
    }

    public func stop() {
        synthesizer.stopSpeaking(at: .immediate)
        isSpeaking = false
    }
}

// MARK: - Vault & Field Guide Room View

struct BiologyVaultHomeView: View {
    enum Tab: String, CaseIterable {
        case learnByHeart = "Learn by Heart"
        case memoryPalaces = "Memory Palaces"
        case mindMap = "Concept Mind-Map"
        case claimAutopsy = "Claim Autopsy"
        case morphemeLadder = "Greek & Latin Roots"
        case fieldGuide = "Visual Field Guides"
    }

    @State private var selectedTab: Tab = .learnByHeart
    @State private var activeCard: BioLearnByHeartCard = BiologyVaultCatalog.cards[0]
    @State private var deletionStage: Int = 0
    @State private var isRevealed: Bool = false
    @State private var recallAttempt: String = ""
    @State private var recallScoreFeedback: String?
    @AppStorage("kymbio.vault.masteredCardIds") private var masteredCardIdsRaw: String = ""
    @AppStorage("kymbio.morphemes.rungs") private var morphemeRungsJSON: String = "{}"
    @ObservedObject private var speaker = BioSpeechSynthesizer.shared

    init() {}

    private var masteredSet: Set<String> {
        Set(masteredCardIdsRaw.split(separator: ",").map(String.init))
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: Spacing.sm) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: Spacing.xs) {
                        ForEach(Tab.allCases, id: \.self) { tab in
                            JournalChip(
                                tab.rawValue,
                                isSelected: selectedTab == tab
                            ) {
                                selectedTab = tab
                            }
                        }
                    }
                }
                Spacer()
                JournalChip(text: "\(masteredSet.count)/\(BiologyVaultCatalog.cards.count) passages owned", tone: .success)
            }
            .padding(.horizontal, Spacing.lg)
            .padding(.vertical, Spacing.sm)
            .background(Color.kymaiaSurface)

            Divider()

            switch selectedTab {
            case .learnByHeart:
                learnByHeartBody
            case .memoryPalaces:
                JournalPage(
                    title: "Biology memory palaces",
                    subtitle: "Walk spatial Mumbai and home loci trails to anchor multi-step biological sequences and food tests."
                ) {
                    BiologyMemoryPalaceView()
                }
            case .mindMap:
                JournalPage(
                    title: "Causal concept mind-map",
                    subtitle: "Explore and extend the mechanistic web linking The Living World, Cambridge Science 8, and Chemistry/Physics bridges."
                ) {
                    BiologyMindMapView()
                }
            case .claimAutopsy:
                JournalPage(
                    title: "Thinking fortress: biological claim autopsy",
                    subtitle: "Evaluate viral health and environmental claims using Cambridge Thinking and Working Scientifically criteria."
                ) {
                    BiologyClaimAutopsyView()
                }
            case .morphemeLadder:
                morphemeLadderBody
            case .fieldGuide:
                SubjectTipsLibraryView()
            }
        }
    }

    private var learnByHeartBody: some View {
        JournalPage(
            title: "Learn by heart vault",
            subtitle: "Progressive word deletion and spoken recall for Cambridge mark-scheme definitions, equations, and causal cascades."
        ) {
            JournalSection(title: "1. Choose a passage or equation (\(BiologyVaultCatalog.cards.count) essential cards)") {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: Spacing.sm) {
                        ForEach(BiologyVaultCatalog.cards) { card in
                            let isOwned = masteredSet.contains(card.id)
                            Button {
                                activeCard = card
                                deletionStage = 0
                                isRevealed = false
                                recallAttempt = ""
                                recallScoreFeedback = nil
                            } label: {
                                HStack(spacing: 6) {
                                    Image(systemName: isOwned ? "checkmark.seal.fill" : "text.quote")
                                    Text(card.title)
                                        .lineLimit(1)
                                }
                            }
                            .buttonStyle(KymaiaOptionButtonStyle(isSelected: activeCard.id == card.id))
                        }
                    }
                }
            }

            JournalSection(title: "2. Progressive deletion stage (Stage \(deletionStage) of 5)") {
                JournalCard {
                    VStack(alignment: .leading, spacing: Spacing.md) {
                        HStack {
                            JournalChip(label: activeCard.category, systemImage: "bookmark.fill", tone: .accent)
                            JournalChip(label: activeCard.unitRef, systemImage: "book.closed", tone: .neutral)
                            Spacer()
                            Button {
                                speaker.speak(activeCard.text)
                            } label: {
                                Label("Listen aloud", systemImage: "speaker.wave.2.fill")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        }

                        Text(activeCard.title)
                            .font(.kymaiaTitle3)
                            .foregroundStyle(Color.kymaiaInk)

                        // Stage step bar
                        HStack(spacing: Spacing.xs) {
                            ForEach(0...5, id: \.self) { stage in
                                Button {
                                    deletionStage = stage
                                    isRevealed = false
                                } label: {
                                    Text(stage == 0 ? "0 · Full" : (stage == 5 ? "5 · Cold" : "Stage \(stage)"))
                                        .font(.kymaiaCaption.weight(.semibold))
                                        .padding(.horizontal, Spacing.sm)
                                        .padding(.vertical, 6)
                                        .background(
                                            Capsule().fill(deletionStage == stage ? Color.kymaiaPrimary : Color.kymaiaControlFill)
                                        )
                                        .foregroundStyle(deletionStage == stage ? Color.white : Color.kymaiaInk)
                                }
                                .buttonStyle(.plain)
                            }
                        }

                        let displayedText = isRevealed
                            ? activeCard.text
                            : BioProgressiveDeletionComposer.render(
                                text: activeCard.text,
                                keyTerms: activeCard.keyTerms,
                                stage: deletionStage
                            )

                        Text(displayedText)
                            .font(.kymaiaSerifProse)
                            .foregroundStyle(Color.kymaiaInk)
                            .padding(Spacing.md)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.medium)
                                    .fill(Color.kymaiaBackground)
                            )

                        HStack(spacing: Spacing.sm) {
                            Button {
                                isRevealed.toggle()
                            } label: {
                                Label(isRevealed ? "Hide words again" : "Peek at full text", systemImage: isRevealed ? "eye.slash" : "eye")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

                            if deletionStage < 5 {
                                Button {
                                    deletionStage += 1
                                    isRevealed = false
                                } label: {
                                    Label("Next fading stage", systemImage: "arrow.right.circle.fill")
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                            }
                        }

                        Divider()

                        VStack(alignment: .leading, spacing: Spacing.xs) {
                            HStack {
                                Text("Test your cold recall (Stage 5 check)")
                                    .font(.kymaiaEyebrow)
                                    .foregroundStyle(Color.kymaiaMutedInk)
                                Spacer()
                                VoiceDictationButton(text: $recallAttempt, label: "Speak passage aloud")
                            }
                            TextField("Type or dictate the passage from memory...", text: $recallAttempt, axis: .vertical)
                                .textFieldStyle(.roundedBorder)
                                .learnerTextInput(.retrieval)

                            HStack {
                                Button {
                                    scoreColdRecall()
                                } label: {
                                    Label("Score my recall against key terms", systemImage: "checkmark.seal.fill")
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                                .disabled(recallAttempt.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)

                                Spacer()
                                Text("Why it matters: \(activeCard.whyItMatters)")
                                    .font(.kymaiaCaption)
                                    .foregroundStyle(Color.kymaiaMutedInk)
                            }

                            if let recallScoreFeedback {
                                Text(recallScoreFeedback)
                                    .font(.kymaiaBody)
                                    .foregroundStyle(Color.kymaiaPrimaryStrong)
                                    .padding(.top, 4)
                            }
                        }
                    }
                }
            }
        }
    }

    private func scoreColdRecall() {
        let eval = AnswerComparison.evaluateRecall(
            spoken: recallAttempt,
            expected: activeCard.text,
            keyTerms: activeCard.keyTerms
        )
        let ratio = Double(eval.matchedKeyTerms.count) / Double(max(activeCard.keyTerms.count, 1))
        if (ratio >= 0.8 || eval.combinedScore >= 0.82) && !isRevealed {
            var next = masteredSet
            next.insert(activeCard.id)
            masteredCardIdsRaw = next.sorted().joined(separator: ",")
            recallScoreFeedback = "Owned! \(eval.feedbackSummary)"
        } else {
            recallScoreFeedback = eval.feedbackSummary
        }
    }

    private var morphemeLadderBody: some View {
        JournalPage(
            title: "Greek and Latin biology morpheme ladder",
            subtitle: "Decode any unfamiliar biology word by owning the 12 core Greek and Latin roots that build the textbook."
        ) {
            ForEach(BiologyVaultCatalog.morphemes) { entry in
                let rung = currentRung(for: entry.id)
                JournalCard {
                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        HStack {
                            Text(entry.root)
                                .font(.kymaiaTitle2)
                                .foregroundStyle(Color.kymaiaPrimaryStrong)
                            JournalChip(label: entry.origin, systemImage: "character.book.closed", tone: .neutral)
                            JournalChip(label: "\"\(entry.literalMeaning)\"", systemImage: "sparkles", tone: .accent)
                            Spacer()
                            JournalChip(text: entry.unitConnection, tone: .neutral)
                        }

                        Text(entry.wordBreakdownExample)
                            .font(.kymaiaBody)
                            .foregroundStyle(Color.kymaiaInk)

                        FlowLayout(spacing: Spacing.xs) {
                            ForEach(entry.biologyTerms, id: \.self) { word in
                                Button {
                                    speaker.speak(word)
                                } label: {
                                    Label(word, systemImage: "speaker.wave.1")
                                        .font(.kymaiaCaption.weight(.semibold))
                                        .padding(.horizontal, Spacing.sm)
                                        .padding(.vertical, 4)
                                        .background(Capsule().fill(Color.kymaiaSelectionFill))
                                }
                                .buttonStyle(.plain)
                            }
                        }

                        Divider()

                        HStack(spacing: Spacing.xs) {
                            Text("OWNERSHIP RUNG:")
                                .font(.kymaiaEyebrow)
                                .foregroundStyle(Color.kymaiaMutedInk)
                            ForEach(MorphemeOwnershipRung.allCases, id: \.self) { level in
                                Button(level.label) {
                                    setRung(level, for: entry.id)
                                }
                                .buttonStyle(KymaiaOptionButtonStyle(isSelected: rung == level))
                            }
                        }
                    }
                }
            }
        }
    }

    private func currentRung(for id: String) -> MorphemeOwnershipRung {
        guard let data = morphemeRungsJSON.data(using: .utf8),
              let dict = try? JSONDecoder().decode([String: Int].self, from: data),
              let raw = dict[id],
              let rung = MorphemeOwnershipRung(rawValue: raw) else {
            return .seen
        }
        return rung
    }

    private func setRung(_ rung: MorphemeOwnershipRung, for id: String) {
        var dict: [String: Int] = [:]
        if let data = morphemeRungsJSON.data(using: .utf8),
           let decoded = try? JSONDecoder().decode([String: Int].self, from: data) {
            dict = decoded
        }
        dict[id] = rung.rawValue
        if let encoded = try? JSONEncoder().encode(dict),
           let str = String(data: encoded, encoding: .utf8) {
            morphemeRungsJSON = str
        }
    }
}
