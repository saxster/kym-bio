import AVFoundation
import Foundation
import GRDB

// The review scheduler (FSRSScheduler, FSRS v5), BKTEngine and FSRSRating live in the shared
// KymLearning package. These conformances let the engines read and write the app's GRDB records.
extension FSRSCardRecord: ReviewCard {}

extension FSRSScheduler {
    /// This app's review schedule: FSRS v5, and a card rated again comes back the next day.
    static let app = FSRSScheduler(relearningStepDays: 1)
}
extension BKTSkillRecord: BKTSkill {}

// MARK: - Pre-Check Confidence Rail & 4-Quadrant Verdict Matrix (Workstream 2)

public enum LearnerConfidenceStop: Int, Codable, CaseIterable, Identifiable, Sendable {
    case zero = 0
    case low = 30
    case fiftyFifty = 50
    case moderate = 70
    case high = 90
    case certain = 100

    public var id: Int { rawValue }

    public var displayLabel: String {
        "\(rawValue)%"
    }

    public var shortCaption: String {
        switch self {
        case .zero: return "No idea"
        case .low: return "Wild guess"
        case .fiftyFifty: return "50–50"
        case .moderate: return "Leaning yes"
        case .high: return "Confident"
        case .certain: return "Certain"
        }
    }
}

public enum ConfidenceVerdictQuadrant: String, Codable, CaseIterable, Sendable {
    case solidMastery = "solid_mastery"               // Correct + high confidence (>=70%)
    case fragileGuess = "fragile_guess"               // Correct + low confidence (<=50%)
    case honestGap = "honest_gap"                     // "I don't know yet" or wrong + low confidence (<=50%)
    case committedMisconception = "committed_misconception" // Wrong + high confidence (>=70%)

    public var badgeTitle: String {
        switch self {
        case .solidMastery: return "Got It Cold"
        case .fragileGuess: return "Right — Let's Lock It In"
        case .honestGap: return "Good Question to Learn"
        case .committedMisconception: return "Watch Out — Common Mix-Up"
        }
    }

    public var coachingDirective: String {
        switch self {
        case .solidMastery:
            return "Brief affirmation. Highlight the key causal link and move forward."
        case .fragileGuess:
            return "Correct, but Kym was unsure. Reinforce the underlying mechanism so it stops feeling like a guess."
        case .honestGap:
            return "Honest gap acknowledged. Walk through the mechanism from first principles without penalty."
        case .committedMisconception:
            return "High confidence on an incomplete or mistaken mechanism. Unpack what made the wrong path feel right before contrasting with the Cambridge mark scheme."
        }
    }

    public static func compute(
        isPass: Bool,
        confidence: LearnerConfidenceStop?,
        isDontKnow: Bool
    ) -> ConfidenceVerdictQuadrant {
        if isDontKnow {
            return .honestGap
        }
        let pct = confidence?.rawValue ?? (isPass ? 70 : 50)
        switch (isPass, pct >= 70) {
        case (true, true):
            return .solidMastery
        case (true, false):
            return .fragileGuess
        case (false, false):
            return .honestGap
        case (false, true):
            return .committedMisconception
        }
    }
}

// MARK: - Isomorphic Transfer Twin Catalog (Workstream 3)

public struct SchoolScienceTransferTwin: Codable, Identifiable, Equatable, Sendable {
    public let id: String
    public let parentQuestionId: String
    public let transferContextTitle: String
    public let prompt: String
    public let markSchemeKeywords: [String]
    public let modelAnswer: String
}

enum TransferTwinCatalog {
    static func twin(for question: SchoolScienceQuestion) -> SchoolScienceTransferTwin {
        if let curated = curatedTwins[question.id] {
            return curated
        }
        return SchoolScienceTransferTwin(
            id: "\(question.id)-twin",
            parentQuestionId: question.id,
            transferContextTitle: "New Scenario · Topic \(question.topicCode)",
            prompt: "[New Scenario] Apply the exact same mechanism from Topic \(question.topicCode) to a new laboratory observation: \(question.prompt)",
            markSchemeKeywords: question.markSchemeKeywords,
            modelAnswer: question.modelAnswer
        )
    }

    private static let curatedTwins: [String: SchoolScienceTransferTwin] = [
        "q-u1-1.1-lb": SchoolScienceTransferTwin(
            id: "q-u1-1.1-lb-twin",
            parentQuestionId: "q-u1-1.1-lb",
            transferContextTitle: "New Scenario · Dusty Marathon Runner Airways",
            prompt: "During a dusty cross-country run in Mumbai, an athlete inhales air through the nose. Trace the path of an oxygen molecule to an alveolus and explain how cartilage in the trachea and cilia + mucus in the bronchi protect the lungs during heavy breathing.",
            markSchemeKeywords: ["trachea", "bronchus", "bronchiole", "cartilage", "collapse", "mucus", "cilia"],
            modelAnswer: "Air travels down the trachea, into a bronchus, through smaller bronchioles to an alveolus. C-shaped rings of cartilage support the trachea so it does not collapse when air pressure drops during deep inhalation. Goblet cells secrete sticky mucus that traps dust and bacteria, and cilia beat rhythmically to sweep the mucus up to the throat."
        ),
        "q-u1-1.2-wb": SchoolScienceTransferTwin(
            id: "q-u1-1.2-wb-twin",
            parentQuestionId: "q-u1-1.2-wb",
            transferContextTitle: "New Scenario · High-Altitude Mountain Goose Alveoli",
            prompt: "A bar-headed goose flying over the Himalayas relies on rapid gas exchange in its lungs. Explain three structural adaptations of an alveolus and its surrounding blood supply that maximise the rate of oxygen diffusion into the blood.",
            markSchemeKeywords: ["surface area", "one cell thick", "short distance", "concentration gradient", "capillaries", "diffusion"],
            modelAnswer: "Millions of alveoli provide a huge total surface area for diffusion. Both the alveolus wall and capillary wall are one cell thick, giving a very short distance for diffusion. A dense network of blood capillaries and continuous ventilation maintain a steep concentration gradient."
        ),
        "q-u1-1.3-lb": SchoolScienceTransferTwin(
            id: "q-u1-1.3-lb-twin",
            parentQuestionId: "q-u1-1.3-lb",
            transferContextTitle: "New Scenario · Swimmer Taking a Deep Breath Before Diving",
            prompt: "Before diving into a pool, a swimmer takes a deep breath in. Describe and explain the exact sequence of actions in the intercostal muscles, ribcage, and diaphragm that causes air to rush into the lungs.",
            markSchemeKeywords: ["intercostal", "contract", "diaphragm", "flattens", "volume increases", "pressure decreases"],
            modelAnswer: "The external intercostal muscles contract to pull the ribcage upwards and outwards, while the diaphragm muscle contracts and flattens downwards. Consequently, thorax volume increases and air pressure inside the lungs decreases below atmospheric pressure, forcing air in."
        ),
        "q-u1-1.4-wb": SchoolScienceTransferTwin(
            id: "q-u1-1.4-wb-twin",
            parentQuestionId: "q-u1-1.4-wb",
            transferContextTitle: "New Scenario · Germinating Chickpea Vacuum Flasks",
            prompt: "Two insulated vacuum flasks are set up in a school lab: Jar X holds live germinating chickpeas washed in mild disinfectant; Jar Y holds boiled dead chickpeas washed in disinfectant. Write the word equation for aerobic respiration and explain why Jar X is 5 °C warmer than Jar Y after two days.",
            markSchemeKeywords: ["glucose", "oxygen", "carbon dioxide", "water", "releases energy", "heat", "mitochondria"],
            modelAnswer: "Word equation: glucose + oxygen -> carbon dioxide + water. Live germinating chickpeas carry out aerobic respiration inside their mitochondria, which releases energy from glucose; part of that energy transfers to the surroundings as heat. Boiled chickpeas have denatured enzymes so no respiration occurs."
        ),
        "q-u1-1.5-cyp": SchoolScienceTransferTwin(
            id: "q-u1-1.5-cyp-twin",
            parentQuestionId: "q-u1-1.5-cyp",
            transferContextTitle: "New Scenario · Sprinter Blood Smear Comparison",
            prompt: "A sports physiologist examines a stained blood smear from a 400 m sprinter. State two visible structural differences between red blood cells and white blood cells, and explain how each red blood cell adaptation speeds up oxygen delivery to working muscle fibres.",
            markSchemeKeywords: ["no nucleus", "haemoglobin", "biconcave", "surface area", "white blood cell", "oxyhaemoglobin"],
            modelAnswer: "Red blood cells have no nucleus (unlike a white blood cell), leaving more space to pack in haemoglobin molecules that bind oxygen to form oxyhaemoglobin. Their biconcave disc shape gives a large surface area to volume ratio for rapid oxygen diffusion."
        ),
        "q-u2-2.4-wb": SchoolScienceTransferTwin(
            id: "q-u2-2.4-wb-twin",
            parentQuestionId: "q-u2-2.4-wb",
            transferContextTitle: "New Scenario · Red Hibiscus Petal Chromatography",
            prompt: "A student extracts pigments from crushed red hibiscus petals and sets up a paper chromatogram. Explain (a) why the origin line is drawn with a graphite pencil instead of a ballpoint pen, and (b) why the solvent in the chromatography tank must sit below the origin spot.",
            markSchemeKeywords: ["insoluble", "dissolve", "ink", "solvent", "below"],
            modelAnswer: "(a) Graphite is insoluble in the solvent, whereas pen ink would dissolve and travel up the paper, ruining the chromatogram. (b) The solvent level must start below the spot so the petal pigments do not dissolve directly into the pool of solvent at the bottom."
        ),
        "q-u3-3.4-wb": SchoolScienceTransferTwin(
            id: "q-u3-3.4-wb-twin",
            parentQuestionId: "q-u3-3.4-wb",
            transferContextTitle: "New Scenario · Holding a Lab Microscope on the Palm",
            prompt: "Treating the forearm as a lever with the elbow joint as the pivot: a student holds a 12 N portable microscope in her palm 0.30 m from the elbow pivot. Her biceps tendon attaches to the radius 0.04 m from the pivot. Calculate the moment of the load and the upward force exerted by the biceps to keep the forearm level.",
            markSchemeKeywords: ["3.6", "90", "moment", "pivot"],
            modelAnswer: "Clockwise moment about the elbow pivot = 12 N x 0.30 m = 3.6 N m. For equilibrium, anticlockwise moment = 3.6 N m = biceps force x 0.04 m, so upward biceps force = 3.6 / 0.04 = 90 N."
        ),
        "q-u4-4.1-lb": SchoolScienceTransferTwin(
            id: "q-u4-4.1-lb-twin",
            parentQuestionId: "q-u4-4.1-lb",
            transferContextTitle: "New Scenario · Namib Desert Barrel Succulent Adaptations",
            prompt: "Explain how three structural adaptations of a spiny desert barrel cactus allow it to collect water, conserve water, and survive in an arid desert ecosystem.",
            markSchemeKeywords: ["roots", "store water", "stem", "spines", "surface area", "herbivores"],
            modelAnswer: "Wide, shallow roots absorb rainwater rapidly before it evaporates. A thick fleshy green stem can store water and carry out photosynthesis. Leaves are reduced to sharp spines, reducing the surface area for water loss by transpiration and deterring thirsty herbivores."
        ),
        "q-u4-4.2-wb": SchoolScienceTransferTwin(
            id: "q-u4-4.2-wb-twin",
            parentQuestionId: "q-u4-4.2-wb",
            transferContextTitle: "New Scenario · Barents Sea Pack-Ice Food Web",
            prompt: "In a polar marine food chain (under-ice algae -> copepods -> polar cod -> ringed seals -> polar bears), state what the arrows represent and explain how rapid loss of summer sea ice alters the seal and polar bear populations.",
            markSchemeKeywords: ["energy transfer", "algae", "producer", "habitat", "seals", "decrease"],
            modelAnswer: "The arrows represent the direction of energy transfer through the food chain. Under-ice algae are the primary producer; losing sea ice destroys their habitat and hunting platforms, causing krill/fish and seals to decline so the polar bear population will decrease."
        ),
        "q-u4-4.3-lb": SchoolScienceTransferTwin(
            id: "q-u4-4.3-lb-twin",
            parentQuestionId: "q-u4-4.3-lb",
            transferContextTitle: "New Scenario · Invasive African Grass in Arid Scrubland",
            prompt: "An introduced African pasture grass invades a dry desert reserve populated by slow-growing native cacti. Explain why the invasive grass multiplies unchecked and how it causes native cactus numbers to fall.",
            markSchemeKeywords: ["predators", "herbivores", "outcompetes", "water", "minerals", "fire", "native"],
            modelAnswer: "The invasive grass has no natural predators or specialist herbivores in the new desert, so it outcompetes native seedlings for scarce water and soil minerals. Its dense dry mats fuel frequent brush fire cycles that kill native cacti not adapted to fire."
        ),
        "q-u4-4.4-cyp": SchoolScienceTransferTwin(
            id: "q-u4-4.4-cyp-twin",
            parentQuestionId: "q-u4-4.4-cyp",
            transferContextTitle: "New Scenario · Mercury & PCB Amplification in an Estuary",
            prompt: "Trace amounts of a persistent organochlorine pesticide enter a coastal estuary (plankton -> minnows -> mullet -> sea eagles). Using the terms bioaccumulation and biomagnification, explain why sea eagles accumulate lethal toxin concentrations while the water tests almost clean.",
            markSchemeKeywords: ["persistent", "break down", "excreted", "bioaccumulation", "biomagnification", "concentration increases", "trophic"],
            modelAnswer: "The pesticide is persistent: it does not break down and cannot be excreted, so it builds up inside individual organisms over time (bioaccumulation). Because each predator eats many prey from the lower level, the toxin concentration increases at each trophic level (biomagnification)."
        ),
        "q-u7-7.1-lb": SchoolScienceTransferTwin(
            id: "q-u7-7.1-lb-twin",
            parentQuestionId: "q-u7-7.1-lb",
            transferContextTitle: "New Scenario · Hospital Nutrition Lab & Anaemia Check",
            prompt: "(a) Describe the reagents and positive colour changes used to test a crushed biscuit suspension for (i) starch and (ii) reducing sugar. (b) Explain why an endurance runner with severe dietary iron deficiency feels exhausted during exercise.",
            markSchemeKeywords: ["iodine", "blue-black", "Benedict", "heat", "brick-red", "haemoglobin", "oxygen", "respiration"],
            modelAnswer: "(a)(i) Add iodine solution; starch turns it blue-black. (ii) Add Benedict's solution and heat in a water bath; reducing sugar turns it brick-red. (b) Iron is needed to make haemoglobin in red blood cells; less haemoglobin transports less oxygen to muscles for aerobic respiration."
        ),
        "q-u7-7.2-wb": SchoolScienceTransferTwin(
            id: "q-u7-7.2-wb-twin",
            parentQuestionId: "q-u7-7.2-wb",
            transferContextTitle: "New Scenario · Adolescent Growth Spurt & Maternal Nutrition",
            prompt: "Compare the daily nutritional needs of a growing 13-year-old athlete and an expectant mother. Explain (a) why both require extra dietary protein and calcium, and (b) why total daily energy intake must rise during pregnancy.",
            markSchemeKeywords: ["protein", "new cells", "growth", "calcium", "bones", "fetus", "respiration"],
            modelAnswer: "(a) Protein is required to build new cells and tissues for growth, and calcium is required to mineralise growing bones and teeth. (b) During pregnancy, extra energy from respiration is needed to support the developing fetus and carry the mother's increased body mass."
        ),
        "q-u7-7.3-lb": SchoolScienceTransferTwin(
            id: "q-u7-7.3-lb-twin",
            parentQuestionId: "q-u7-7.3-lb",
            transferContextTitle: "New Scenario · Maternal Smoking & Airway Pathology",
            prompt: "Cigarette smoke delivers carbon monoxide and tar to the lungs. Explain the biological mechanisms by which (a) carbon monoxide restricts fetal growth during pregnancy, and (b) tar damages gas exchange and airway clearance.",
            markSchemeKeywords: ["carbon monoxide", "haemoglobin", "less oxygen", "respiration", "tar", "cilia", "mucus", "alveoli", "surface area"],
            modelAnswer: "(a) Carbon monoxide binds irreversibly to haemoglobin, so red blood cells carry less oxygen to the fetus for aerobic respiration and cell growth. (b) Tar paralyses cilia so mucus builds up, and chronic coughing breaks down alveoli walls, reducing the surface area for gas exchange."
        ),
        "q-u7-7.4-cyp": SchoolScienceTransferTwin(
            id: "q-u7-7.4-cyp-twin",
            parentQuestionId: "q-u7-7.4-cyp",
            transferContextTitle: "New Scenario · Rowing Stroke Elbow Biomechanics",
            prompt: "When a rower pulls an oar towards the chest and then pushes it back out, both biceps and triceps muscles are required. Explain why skeletal muscles must work as an antagonistic pair at the elbow, and distinguish the roles of tendons and ligaments.",
            markSchemeKeywords: ["only pull", "cannot push", "antagonistic", "biceps contracts", "triceps relaxes", "tendons", "ligaments"],
            modelAnswer: "Muscles can only pull bones when they contract and cannot push. Therefore they work as an antagonistic pair: to bend the arm, the biceps contracts while the triceps relaxes (and vice versa to straighten). Tendons attach muscle to bone, whereas ligaments connect bone to bone to stabilise the joint."
        )
    ]
}

// MARK: - Question Proof Service (Worked Example -> Faded -> Independent Proof)

struct QuestionEvaluationResult: Equatable, Sendable {
    let matchedKeywords: [String]
    let missingKeywords: [String]
    let coverageFraction: Double
    let isPass: Bool
    let resultingProofLevel: QuestionProofLevel
    let feedbackSummary: String
    let confidence: LearnerConfidenceStop?
    let isDontKnow: Bool
    let quadrant: ConfidenceVerdictQuadrant
    let usedTransferTwin: Bool

    init(
        matchedKeywords: [String],
        missingKeywords: [String],
        coverageFraction: Double,
        isPass: Bool,
        resultingProofLevel: QuestionProofLevel,
        feedbackSummary: String,
        confidence: LearnerConfidenceStop? = nil,
        isDontKnow: Bool = false,
        quadrant: ConfidenceVerdictQuadrant? = nil,
        usedTransferTwin: Bool = false
    ) {
        self.matchedKeywords = matchedKeywords
        self.missingKeywords = missingKeywords
        self.coverageFraction = coverageFraction
        self.isPass = isPass
        self.resultingProofLevel = resultingProofLevel
        self.feedbackSummary = feedbackSummary
        self.confidence = confidence
        self.isDontKnow = isDontKnow
        self.quadrant = quadrant ?? ConfidenceVerdictQuadrant.compute(
            isPass: isPass,
            confidence: confidence,
            isDontKnow: isDontKnow
        )
        self.usedTransferTwin = usedTransferTwin
    }
}

enum QuestionProofService {
    static func dayKey(for date: Date, calendar: Calendar = .current) -> String {
        let comps = calendar.dateComponents([.year, .month, .day], from: date)
        return String(format: "%04d-%02d-%02d", comps.year ?? 2026, comps.month ?? 1, comps.day ?? 1)
    }

    static func evaluateAndRecord(
        question: SchoolScienceQuestion,
        answerText: String,
        usedAssistance: Bool,
        existingProof: QuestionProofRecord?,
        now: Date = Date(),
        confidence: LearnerConfidenceStop? = nil,
        isDontKnow: Bool = false,
        readingThinkingText: String = "",
        usedTransferTwin: Bool = false
    ) -> (result: QuestionEvaluationResult, record: QuestionProofRecord) {
        let normalizedAnswer = answerText.lowercased()
        var matched: [String] = []
        var missing: [String] = []

        for kw in question.markSchemeKeywords {
            if normalizedAnswer.contains(kw.lowercased()) {
                matched.append(kw)
            } else {
                missing.append(kw)
            }
        }

        let total = max(1, question.markSchemeKeywords.count)
        let coverage = isDontKnow ? 0.0 : Double(matched.count) / Double(total)
        // Require at least 60% of key mark-scheme terms and at least 12 characters of explanation
        let isPass = !isDontKnow
            && coverage >= 0.60
            && normalizedAnswer.trimmingCharacters(in: .whitespacesAndNewlines).count >= 12

        let quadrant = ConfidenceVerdictQuadrant.compute(
            isPass: isPass,
            confidence: confidence,
            isDontKnow: isDontKnow
        )

        let todayKey = dayKey(for: now)
        var passDays = existingProof?.independentPassDays ?? 0
        var lastPassDay = existingProof?.lastIndependentPassDayKey

        let nextLevel: QuestionProofLevel
        let feedback: String

        if isDontKnow {
            if let prev = existingProof?.level, prev.isIndependentProof {
                nextLevel = prev
            } else {
                nextLevel = .assisted
            }
            feedback = "Honest gap recorded — no penalty for skipping guessing. Walk through the worked example or ask Coach, then try the Transfer Twin to earn Independent Proof."
        } else if usedAssistance {
            // Honest rule: assisted work never claims independent proof
            if let prev = existingProof?.level, prev.isIndependentProof {
                nextLevel = prev
            } else {
                nextLevel = .assisted
            }
            feedback = isPass
                ? "Good guided answer (\(matched.count)/\(total) mark-scheme ideas). Come back and answer without the scaffold to earn Independent Proof."
                : "Guided attempt recorded. Include: \(missing.prefix(3).joined(separator: ", "))."
        } else if isPass {
            if lastPassDay != todayKey {
                passDays += 1
                lastPassDay = todayKey
            }
            let twinNote = usedTransferTwin ? " via Transfer Twin" : ""
            if passDays >= 2 {
                nextLevel = .secure
                feedback = "Secure across \(passDays) separate days\(twinNote) (\(matched.count)/\(total) mark-scheme points)."
            } else {
                nextLevel = .proven
                feedback = "Proven independently today\(twinNote) (\(matched.count)/\(total) mark-scheme points). Prove it on one more day to lock it as Secure."
            }
        } else {
            nextLevel = .shaky
            let misconceptionNote = quadrant == .committedMisconception
                ? " High confidence on a missing mechanism — logged to your Metacognition Error Log so we can unpack what felt right."
                : ""
            feedback = "Almost there (\(matched.count)/\(total) mark-scheme points). Try adding: \(missing.prefix(3).joined(separator: ", ")).\(misconceptionNote)"
        }

        let record = QuestionProofRecord(
            id: question.id,
            unitNumber: question.unitNumber,
            topicCode: question.topicCode,
            proofLevel: nextLevel.rawValue,
            independentPassDays: passDays,
            lastIndependentPassDayKey: lastPassDay,
            lastAttemptAt: now,
            lastAnswerText: answerText,
            lastUsedAssistance: usedAssistance || isDontKnow,
            matchedKeywordsCSV: matched.joined(separator: ","),
            missingKeywordsCSV: missing.joined(separator: ","),
            lastConfidencePercent: confidence?.rawValue,
            lastWasDontKnow: isDontKnow,
            lastReadingThinkingText: readingThinkingText,
            lastQuadrant: quadrant.rawValue,
            provedViaTransferTwin: (existingProof?.provedViaTransferTwin ?? false) || (isPass && !usedAssistance && usedTransferTwin)
        )

        let eval = QuestionEvaluationResult(
            matchedKeywords: matched,
            missingKeywords: missing,
            coverageFraction: coverage,
            isPass: isPass,
            resultingProofLevel: nextLevel,
            feedbackSummary: feedback,
            confidence: confidence,
            isDontKnow: isDontKnow,
            quadrant: quadrant,
            usedTransferTwin: usedTransferTwin
        )
        return (eval, record)
    }
}

// MARK: - Three-Stage Readiness Service (Material In -> Checked Learning -> Independent Proof)

struct UnitReadinessSnapshot: Equatable, Sendable {
    let unitNumber: Int
    let topicsCount: Int
    let chaptersReadCount: Int
    let widgetsStampedCount: Int
    let questionsTotal: Int
    let questionsAssistedCount: Int
    let questionsProvenCount: Int
    let questionsSecureCount: Int
    let averageBKTMastery: Double

    var independentProofFraction: Double {
        guard questionsTotal > 0 else { return 0 }
        return Double(questionsProvenCount + questionsSecureCount) / Double(questionsTotal)
    }

    var readinessBadgeText: String {
        if questionsTotal > 0 && questionsSecureCount == questionsTotal {
            return "Exam-ready"
        } else if questionsProvenCount + questionsSecureCount > 0 {
            return "\(questionsProvenCount + questionsSecureCount)/\(questionsTotal) proven"
        } else if questionsAssistedCount > 0 {
            return "Guided practice"
        } else {
            return "Ready to start"
        }
    }
}

enum ReadinessService {
    static func snapshot(
        for unit: SchoolScienceUnit,
        pack: KymBioSeedPack,
        proofs: [QuestionProofRecord],
        skills: [BKTSkillRecord],
        stamps: [WidgetChallengeStampRecord],
        readingProgress: [ChapterReadingProgressRecord]
    ) -> UnitReadinessSnapshot {
        let unitQuestions = pack.schoolQuestions.filter { $0.unitNumber == unit.unitNumber }
        let unitProofs = proofs.filter { $0.unitNumber == unit.unitNumber }
        let assisted = unitProofs.filter { $0.level == .assisted || $0.level == .shaky }.count
        let proven = unitProofs.filter { $0.level == .proven }.count
        let secure = unitProofs.filter { $0.level == .secure }.count

        let topicCodes = Set(unit.topics.map(\.code))
        let unitSkills = skills.filter { topicCodes.contains($0.id) }
        let avgMastery = unitSkills.isEmpty
            ? 0.0
            : unitSkills.map(\.pLearned).reduce(0, +) / Double(unitSkills.count)

        let linkedChSet = Set(unit.livingWorldChapters)
        let chaptersRead = readingProgress.filter { linkedChSet.contains($0.chapterNumber) && $0.readFraction >= 0.5 }.count
        let stampsCount = stamps.filter { linkedChSet.contains($0.chapterNumber) }.count

        return UnitReadinessSnapshot(
            unitNumber: unit.unitNumber,
            topicsCount: unit.topics.count,
            chaptersReadCount: chaptersRead,
            widgetsStampedCount: stampsCount,
            questionsTotal: unitQuestions.count,
            questionsAssistedCount: assisted,
            questionsProvenCount: proven,
            questionsSecureCount: secure,
            averageBKTMastery: avgMastery
        )
    }
}

// MARK: - Brilliant-Style Phenomenon -> Submicroscopic Mechanism -> Formal Principle Bridge

public struct MechanismTermMapping: Identifiable, Hashable, Sendable {
    public let id: String
    public let symbolOrTerm: String
    public let biologicalMeaning: String
    public let sliderVariable: String
    public let physicalAnchor: String

    public init(
        id: String,
        symbolOrTerm: String,
        biologicalMeaning: String,
        sliderVariable: String,
        physicalAnchor: String
    ) {
        self.id = id
        self.symbolOrTerm = symbolOrTerm
        self.biologicalMeaning = biologicalMeaning
        self.sliderVariable = sliderVariable
        self.physicalAnchor = physicalAnchor
    }
}

/// Bridges an everyday Mumbai phenomenon -> submicroscopic biological mechanism -> formal Cambridge equation or law.
public struct PhenomenonToMechanismBridge: Identifiable, Hashable, Sendable {
    public var id: String { "bio-bridge-ch\(chapterNumber)" }
    public let chapterNumber: Int
    public let title: String
    public let observablePhenomenon: String
    public let ahaMechanismInvariant: String
    public let principleOrEquationDisplay: String
    public let termMappings: [MechanismTermMapping]

    public init(
        chapterNumber: Int,
        title: String,
        observablePhenomenon: String,
        ahaMechanismInvariant: String,
        principleOrEquationDisplay: String,
        termMappings: [MechanismTermMapping]
    ) {
        self.chapterNumber = chapterNumber
        self.title = title
        self.observablePhenomenon = observablePhenomenon
        self.ahaMechanismInvariant = ahaMechanismInvariant
        self.principleOrEquationDisplay = principleOrEquationDisplay
        self.termMappings = termMappings
    }

    public func perturbationPrompt(for mapping: MechanismTermMapping) -> String {
        "What if: If you change \(mapping.sliderVariable) while keeping everything else the same, how does \(mapping.symbolOrTerm) affect the outcome?"
    }

    public func perturbationExplanation(for mapping: MechanismTermMapping) -> String {
        "\(mapping.symbolOrTerm) represents \(mapping.biologicalMeaning). In the real organism (\(mapping.physicalAnchor)), altering \(mapping.sliderVariable) directly shifts \(ahaMechanismInvariant)"
    }

    public static func bridge(forChapter chapterNumber: Int) -> PhenomenonToMechanismBridge {
        switch chapterNumber {
        case 0:
            return PhenomenonToMechanismBridge(
                chapterNumber: 0,
                title: "Controlled Experiments & Biogenesis",
                observablePhenomenon: "Rotting fish in a July Mumbai kitchen swarms with maggots if left open, yet stays completely maggot-free under fine muslin gauze while still smelling foul.",
                ahaMechanismInvariant: "Living organisms arise only from pre-existing parent organisms (Omne vivum ex vivo); changing one independent variable at a time isolates the causal agent.",
                principleOrEquationDisplay: "ΔN_offspring = N_parent_eggs_laid   (Spontaneous Generation = 0)",
                termMappings: [
                    MechanismTermMapping(
                        id: "c0-barrier",
                        symbolOrTerm: "Gauze / Swan-Neck",
                        biologicalMeaning: "Physical filter that admits air (O₂) while blocking flies or airborne dust microbes",
                        sliderVariable: "Barrier Permeability to Parents",
                        physicalAnchor: "Redi's gauze-topped jar & Pasteur's curved swan-neck flask"
                    ),
                    MechanismTermMapping(
                        id: "c0-iv",
                        symbolOrTerm: "Independent Variable",
                        biologicalMeaning: "The single factor deliberately changed between experimental and control jars",
                        sliderVariable: "Access of Adult Flies / Spores",
                        physicalAnchor: "Open jar vs gauze-covered jar at identical temperature"
                    ),
                    MechanismTermMapping(
                        id: "c0-lens",
                        symbolOrTerm: "M = I ÷ A",
                        biologicalMeaning: "Magnification reveals microscopic parent eggs and bacteria invisible to the naked eye",
                        sliderVariable: "Lens Curvature & Focal Length",
                        physicalAnchor: "Leeuwenhoek's single glass bead microscope (~270×)"
                    )
                ]
            )
        case 1:
            return PhenomenonToMechanismBridge(
                chapterNumber: 1,
                title: "Imbibition, Vitrification & Exothermic Respiration",
                observablePhenomenon: "Hard, dry green moong beans sit motionless for months in a kitchen jar, yet swell, warm up a thermos flask by 6 °C, and sprout roots within 24 hours of soaking in June monsoon water.",
                ahaMechanismInvariant: "Water imbibition melts the glassy (vitrified) cytoplasm so mitochondrial enzymes can oxidise glucose with oxygen, releasing ATP for growth and thermal energy.",
                principleOrEquationDisplay: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O   (ΔH < 0 · Exothermic ATP & Heat Release)",
                termMappings: [
                    MechanismTermMapping(
                        id: "c1-water",
                        symbolOrTerm: "Imbibition (H₂O)",
                        biologicalMeaning: "Water uptake that rehydrates vitrified cytoplasmic glass and activates enzymes",
                        sliderVariable: "Seed Hydration Percentage (%)",
                        physicalAnchor: "Dry moong bean (10% water) swelling to hydrated seed (57% water)"
                    ),
                    MechanismTermMapping(
                        id: "c1-glucose",
                        symbolOrTerm: "C₆H₁₂O₆ + 6O₂",
                        biologicalMeaning: "Stored seed starch hydrolysed to glucose and oxidised inside mitochondria",
                        sliderVariable: "Oxygen Availability in Flask",
                        physicalAnchor: "Live germinating peas vs boiled control peas in thermos"
                    ),
                    MechanismTermMapping(
                        id: "c1-heat",
                        symbolOrTerm: "Released Energy",
                        biologicalMeaning: "Chemical energy from glucose bonds transferred to ATP and measurable heat (never 'created')",
                        sliderVariable: "Active Mitochondrial Rate",
                        physicalAnchor: "Thermometer rising 6 °C in live germinating seed flask"
                    )
                ]
            )
        case 2:
            return PhenomenonToMechanismBridge(
                chapterNumber: 2,
                title: "Surface-Area-to-Volume Scaling & Cell Ultrastructure",
                observablePhenomenon: "When 0.5 cm, 1 cm, and 2 cm paneer cubes soak in turmeric dye for 15 minutes, dye penetrates 2 mm into all of them—turning the 0.5 cm cube golden right to its core while leaving the 2 cm cube bone-white inside.",
                ahaMechanismInvariant: "As cell side length L grows, surface area grows as 6L² while volume grows faster as L³, so supply-to-demand ratio (SA:V = 6/L) collapses unless cells stay microscopic or fold their membranes.",
                principleOrEquationDisplay: "SA : V = 6L² ÷ L³ = 6 ÷ L     and     Actual Size A = Image I ÷ Magnification M",
                termMappings: [
                    MechanismTermMapping(
                        id: "c2-sav",
                        symbolOrTerm: "6 ÷ L (SA:V)",
                        biologicalMeaning: "Surface area available per unit cytoplasmic volume for diffusion of O₂ and nutrients",
                        sliderVariable: "Cell Cube Side Length L",
                        physicalAnchor: "Microscopic human cell (10–30 µm) vs large cube core starving"
                    ),
                    MechanismTermMapping(
                        id: "c2-wall",
                        symbolOrTerm: "Cell Wall vs Membrane",
                        biologicalMeaning: "Rigid cellulose box resists turgor (plants only), while the phospholipid membrane selects molecules",
                        sliderVariable: "Compartment Boundary Type",
                        physicalAnchor: "Onion epidermal cell vs human cheek squamous cell"
                    ),
                    MechanismTermMapping(
                        id: "c2-mag",
                        symbolOrTerm: "A = I ÷ M",
                        biologicalMeaning: "True specimen size in µm after converting measured image mm × 1,000",
                        sliderVariable: "Objective × Eyepiece Magnification",
                        physicalAnchor: "Red blood cell (8 µm) imaged at ×400 or ×4,000"
                    )
                ]
            )
        case 3:
            return PhenomenonToMechanismBridge(
                chapterNumber: 3,
                title: "Fick's Diffusion, Osmosis & Water Potential",
                observablePhenomenon: "Limp cucumber or onion slices crispen in fresh tap water but shrivel in concentrated salt water; Carter Road mangroves thrive in salty Arabian Sea mud that would wilt a garden marigold.",
                ahaMechanismInvariant: "Thermal motion drives individual molecules randomly in all directions, producing a net flux down the concentration or water-potential gradient until forward and reverse crossings balance.",
                principleOrEquationDisplay: "J = D · A · ΔC ÷ Δx     and     Ψ = Ψ_s + Ψ_p  (Net H₂O: High Ψ → Low Ψ)",
                termMappings: [
                    MechanismTermMapping(
                        id: "c3-grad",
                        symbolOrTerm: "ΔC / ΔΨ",
                        biologicalMeaning: "Difference in solute concentration or free water potential across the membrane",
                        sliderVariable: "External Solution Molarity",
                        physicalAnchor: "Potato cylinder in 0.0 M vs 0.6 M sucrose solution"
                    ),
                    MechanismTermMapping(
                        id: "c3-area",
                        symbolOrTerm: "A ÷ Δx",
                        biologicalMeaning: "Exchange surface area divided by membrane/barrier diffusion distance",
                        sliderVariable: "Membrane Folding & Thickness",
                        physicalAnchor: "Root hair cell extensions and one-cell-thick alveolar walls"
                    ),
                    MechanismTermMapping(
                        id: "c3-atp",
                        symbolOrTerm: "Active Carrier + ATP",
                        biologicalMeaning: "Protein pump that moves ions AGAINST their concentration gradient using respiratory ATP",
                        sliderVariable: "Root Oxygen & ATP Supply",
                        physicalAnchor: "Mineral ion uptake into root hairs and mangrove salt regulation"
                    )
                ]
            )
        case 4:
            return PhenomenonToMechanismBridge(
                chapterNumber: 4,
                title: "Biological Polymers & Enzyme Active-Site Catalysis",
                observablePhenomenon: "A cube of raw potato dropped into 6% hydrogen peroxide fizzes violently with oxygen foam, whereas a cube of boiled potato sits in the same liquid without producing a single bubble.",
                ahaMechanismInvariant: "Enzymes are folded protein catalysts whose 3D active site is complementary to a specific substrate, lowering activation energy E_a; excessive heat or extreme pH breaks weak bonds and denatures (never 'kills') the active site.",
                principleOrEquationDisplay: "E + S ⇌ ES_complex → E + Products   (Peak rate at T_opt ≈ 37 °C; Denatured > 45 °C)",
                termMappings: [
                    MechanismTermMapping(
                        id: "c4-site",
                        symbolOrTerm: "ES Complex",
                        biologicalMeaning: "Complementary 3D active site binding substrate to strain bonds and lower E_a",
                        sliderVariable: "Substrate Concentration [S]",
                        physicalAnchor: "Catalase breaking 40,000,000 H₂O₂ molecules per second"
                    ),
                    MechanismTermMapping(
                        id: "c4-temp",
                        symbolOrTerm: "T_opt vs Denaturation",
                        biologicalMeaning: "Kinetic collision rate rises with T until thermal vibration unfolds hydrogen/ionic bonds",
                        sliderVariable: "Reaction Temperature (°C)",
                        physicalAnchor: "Raw potato (active catalase) vs boiled potato (denatured active site)"
                    ),
                    MechanismTermMapping(
                        id: "c4-ph",
                        symbolOrTerm: "pH Ionisation",
                        biologicalMeaning: "H⁺/OH⁻ concentration alters charged amino acid R-groups in the active site",
                        sliderVariable: "Solution pH (1.5 to 9.0)",
                        physicalAnchor: "Stomach pepsin (pH 2) vs salivary amylase (pH 7) vs lipase (pH 8)"
                    )
                ]
            )
        case 5:
            return PhenomenonToMechanismBridge(
                chapterNumber: 5,
                title: "Endothermic Photosynthesis, Carbon Fixation & Limiting Factors",
                observablePhenomenon: "Van Helmont's willow tree gained 74.5 kg while its dry soil lost only 57 g, and the massive banyan trees at Horniman Circle build tonnes of solid wood out of invisible Mumbai air.",
                ahaMechanismInvariant: "Chlorophyll absorbs red and blue photons to split water and fix atmospheric CO₂ gas into glucose; the overall rate is governed by whichever required input (light, CO₂, or temperature) is in shortest supply.",
                principleOrEquationDisplay: "6CO₂ + 6H₂O --(light, chlorophyll)--> C₆H₁₂O₆ + 6O₂     (Light Intensity I ∝ 1 ÷ d²)",
                termMappings: [
                    MechanismTermMapping(
                        id: "c5-co2",
                        symbolOrTerm: "6CO₂ (Gas → Biomass)",
                        biologicalMeaning: "Carbon atoms entering through open stomata to build cellulose and starch",
                        sliderVariable: "Atmospheric CO₂ Concentration",
                        physicalAnchor: "Palisade mesophyll chloroplasts fixing carbon via RuBisCO"
                    ),
                    MechanismTermMapping(
                        id: "c5-light",
                        symbolOrTerm: "I ∝ 1 ÷ d²",
                        biologicalMeaning: "Photon flux driving water photolysis; halving lamp distance quadruples intensity",
                        sliderVariable: "Lamp Distance d & Wavelength λ",
                        physicalAnchor: "Pondweed (Elodea) oxygen bubble rate under red/blue vs green light"
                    ),
                    MechanismTermMapping(
                        id: "c5-xylem",
                        symbolOrTerm: "Transpiration Pull",
                        biologicalMeaning: "Evaporation from spongy mesophyll pulls a continuous cohesive water column up xylem",
                        sliderVariable: "Stomatal Aperture & Humidity",
                        physicalAnchor: "Lignified xylem vessels vs living phloem sieve tubes"
                    )
                ]
            )
        case 6:
            return PhenomenonToMechanismBridge(
                chapterNumber: 6,
                title: "Aerobic Mitochondrial ATP Yield vs Anaerobic Fermentation",
                observablePhenomenon: "Warm idli batter puffs up with CO₂ overnight without oxygen, while a sprinter climbing Kanheri Caves feels muscle burn and pants heavily at the top to repay an oxygen debt.",
                ahaMechanismInvariant: "Complete oxidation of glucose with oxygen inside mitochondria yields ~15× more ATP per glucose than anaerobic glycolysis in the cytosol, which leaves energy locked in lactate or ethanol.",
                principleOrEquationDisplay: "Aerobic: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O (~32 ATP)  |  Anaerobic: C₆H₁₂O₆ → 2 Lactate (2 ATP)",
                termMappings: [
                    MechanismTermMapping(
                        id: "c6-o2",
                        symbolOrTerm: "O₂ Terminal Acceptor",
                        biologicalMeaning: "Oxygen accepts electrons on mitochondrial cristae so proton pumps spin ATP synthase",
                        sliderVariable: "Cellular Oxygen Supply",
                        physicalAnchor: "Folded inner mitochondrial membrane (cristae) in muscle cells"
                    ),
                    MechanismTermMapping(
                        id: "c6-lactate",
                        symbolOrTerm: "Lactate & O₂ Debt",
                        biologicalMeaning: "Temporary anaerobic byproduct in muscle; extra post-sprint O₂ oxidises it in the liver",
                        sliderVariable: "Sprint Power Demand vs O₂ Delivery",
                        physicalAnchor: "Heavy breathing after a 200 m race to clear blood lactate"
                    ),
                    MechanismTermMapping(
                        id: "c6-yeast",
                        symbolOrTerm: "Ethanol + CO₂",
                        biologicalMeaning: "Microbial fermentation pathway in yeast and flooded plant roots",
                        sliderVariable: "Kitchen Fermentation Temperature",
                        physicalAnchor: "Rising idli/bread dough (CO₂ bubbles) and brewing"
                    )
                ]
            )
        case 7:
            return PhenomenonToMechanismBridge(
                chapterNumber: 7,
                title: "Enzymatic Hydrolysis, Bile Emulsification & Villi Absorption",
                observablePhenomenon: "A bite of buttered vada pav contains insoluble starch, protein, and fat globules far too large to cross a cell membrane, yet within two hours their monomers circulate in your blood.",
                ahaMechanismInvariant: "Bile salts physically emulsify fat drops to multiply surface area 1,000×, specific hydrolases (amylase, protease, lipase) cleave polymers into soluble monomers, and microvilli absorb them into capillaries and lacteals.",
                principleOrEquationDisplay: "Starch --amylase/maltase--> Glucose  |  Protein --protease--> Amino Acids  |  Lipid --bile+lipase--> Fatty Acids + Glycerol",
                termMappings: [
                    MechanismTermMapping(
                        id: "c7-bile",
                        symbolOrTerm: "Bile Emulsification",
                        biologicalMeaning: "Physical dispersion of hydrophobic fat globules into tiny droplets + neutralising stomach HCl",
                        sliderVariable: "Bile Salt Droplet Dispersion",
                        physicalAnchor: "Duodenum receiving liver bile + pancreatic lipase"
                    ),
                    MechanismTermMapping(
                        id: "c7-villi",
                        symbolOrTerm: "Villi Brush Border",
                        biologicalMeaning: "One-cell-thick folded epithelium with microvilli, dense capillaries, and central lacteal",
                        sliderVariable: "Villus Surface Area & Blood Flow",
                        physicalAnchor: "Ileum absorbing glucose/amino acids to hepatic portal vein"
                    ),
                    MechanismTermMapping(
                        id: "c7-rbc",
                        symbolOrTerm: "Hb + 4O₂ ⇌ Hb(O₂)₄",
                        biologicalMeaning: "Biconcave enucleated red blood cells binding oxygen reversibly in lungs and releasing it at tissues",
                        sliderVariable: "Haemoglobin & Iron Status",
                        physicalAnchor: "Blood smear: red blood cells, phagocytes, lymphocytes, platelets, plasma"
                    )
                ]
            )
        case 8:
            return PhenomenonToMechanismBridge(
                chapterNumber: 8,
                title: "Boyle's Ventilation, Double Circulation & Forearm Levers",
                observablePhenomenon: "Contracting your diaphragm pulls air into 300 million alveoli, a four-chambered heart pumps it at high pressure to your body, and your biceps pulls 4 cm from your elbow pivot to lift a textbook 32 cm away.",
                ahaMechanismInvariant: "Breathing follows Boyle's inverse pressure-volume law (↑V → ↓P), double circulation separates low-pressure lung perfusion from high-pressure systemic flow, and antagonistic muscles pull across bone levers.",
                principleOrEquationDisplay: "P_thorax · V_thorax = k   |   Q = HR × SV   |   F_biceps × d_in = F_load × d_out",
                termMappings: [
                    MechanismTermMapping(
                        id: "c8-boyle",
                        symbolOrTerm: "ΔV_thorax → −ΔP_alveoli",
                        biologicalMeaning: "Intercostal + diaphragm contraction expands chest volume, dropping lung pressure below atmospheric",
                        sliderVariable: "Diaphragm & Ribcage Excursion",
                        physicalAnchor: "Bell-jar lung model vs real ribcage and pleural membranes"
                    ),
                    MechanismTermMapping(
                        id: "c8-heart",
                        symbolOrTerm: "Left vs Right Ventricle",
                        biologicalMeaning: "Second pump (thick left ventricle) restores high systemic pressure after lung capillary drop",
                        sliderVariable: "Ventricular Wall Muscularity",
                        physicalAnchor: "Mammalian double circulation vs single-pump fish gill circuit"
                    ),
                    MechanismTermMapping(
                        id: "c8-lever",
                        symbolOrTerm: "F_biceps = F_load · (d_out ÷ d_in)",
                        biologicalMeaning: "Third-class elbow lever trades an ~8× force penalty for rapid, wide-arc hand movement",
                        sliderVariable: "Biceps Insertion Distance d_in",
                        physicalAnchor: "Antagonistic biceps (flexor) & triceps (extensor) at synovial elbow joint"
                    )
                ]
            )
        case 9:
            return PhenomenonToMechanismBridge(
                chapterNumber: 9,
                title: "Action Potentials, 20 nm Synapses & Optical Accommodation",
                observablePhenomenon: "Your fingers jerk away from a hot kitchen tawa before you consciously feel pain, and your eyes shift focus instantly from a wristwatch at 25 cm to the Bandra-Worli Sea Link on the horizon.",
                ahaMechanismInvariant: "Myelinated axons conduct electrical action potentials at ~100 m/s via saltatory conduction, chemical neurotransmitters enforce one-way flow across 20 nm synaptic clefts, and ciliary muscles reshape the eye lens.",
                principleOrEquationDisplay: "t_reflex = d_axon ÷ v_impulse + N_synapses · t_cleft     and     1 ÷ f = 1 ÷ u + 1 ÷ v",
                termMappings: [
                    MechanismTermMapping(
                        id: "c9-reflex",
                        symbolOrTerm: "Spinal Reflex Arc",
                        biologicalMeaning: "Receptor → Sensory → Relay (spinal cord) → Motor → Muscle effector bypasses slow conscious delay",
                        sliderVariable: "Myelin Insulation & Axon Speed",
                        physicalAnchor: "Withdrawal reflex from a hot pan in ~25–40 ms"
                    ),
                    MechanismTermMapping(
                        id: "c9-synapse",
                        symbolOrTerm: "Synaptic Vesicle → Receptor",
                        biologicalMeaning: "Vesicles live only in the presynaptic knob and receptors only on the postsynaptic membrane",
                        sliderVariable: "Neurotransmitter Release & Cleft Width",
                        physicalAnchor: "20 nm chemical synapse ensuring strictly unidirectional signalling"
                    ),
                    MechanismTermMapping(
                        id: "c9-eye",
                        symbolOrTerm: "Ciliary & Suspensory Lens Control",
                        biologicalMeaning: "Near object: ciliary contracts, ligaments slacken, lens fattens (shorter focal length, stronger refraction)",
                        sliderVariable: "Object Viewing Distance u",
                        physicalAnchor: "Cornea + crystalline lens focusing onto RGB retinal cone fovea"
                    )
                ]
            )
        case 10:
            return PhenomenonToMechanismBridge(
                chapterNumber: 10,
                title: "Negative Feedback Homeostasis, Nephron Filtration & Immunity",
                observablePhenomenon: "After a sweet mango lassi your blood glucose returns to ~90 mg/dL within two hours, and sweating cools you in dry May heat (50% RH) yet leaves you sweltering in a humid July monsoon (88% RH).",
                ahaMechanismInvariant: "Negative feedback sensors detect deviations from a physiological set-point and trigger antagonistic effectors (insulin vs glucagon; vasodilation + evaporative sweating; ADH aquaporins) to restore stability.",
                principleOrEquationDisplay: "Glucose ⇄ Glycogen (Insulin / Glucagon)   |   Q_cooling = m_evap · L_v   |   GFR − Reabsorption = Excretion",
                termMappings: [
                    MechanismTermMapping(
                        id: "c10-glucose",
                        symbolOrTerm: "Insulin vs Glucagon",
                        biologicalMeaning: "Pancreatic beta cells store excess glucose as liver glycogen; alpha cells mobilise it during fasting",
                        sliderVariable: "Post-Meal Blood Glucose Spike",
                        physicalAnchor: "Islets of Langerhans → hepatic portal vein → liver hepatocytes"
                    ),
                    MechanismTermMapping(
                        id: "c10-nephron",
                        symbolOrTerm: "Ultrafiltration + 100% Glucose Reabsorption",
                        biologicalMeaning: "Glomerulus filters small molecules under pressure; proximal tubule actively reclaims all glucose",
                        sliderVariable: "ADH Level & Medullary Osmolarity",
                        physicalAnchor: "Kidney nephron Bowman's capsule, PCT, Loop of Henle & collecting duct"
                    ),
                    MechanismTermMapping(
                        id: "c10-immune",
                        symbolOrTerm: "Memory Lymphocytes",
                        biologicalMeaning: "Primary infection or vaccine selects complementary B/T clones that mount a 100× faster secondary response",
                        sliderVariable: "Antigen Exposure (Primary vs Secondary)",
                        physicalAnchor: "Antibody lock-and-key binding to pathogen surface antigens"
                    )
                ]
            )
        case 11:
            return PhenomenonToMechanismBridge(
                chapterNumber: 11,
                title: "Complementary DNA Base Pairing & The Triplet Genetic Code",
                observablePhenomenon: "Every nucleated cell in Kym's body holds 2 metres of DNA with the exact same 3-billion-letter text, yet her red blood cell precursors print haemoglobin while her beta cells print insulin.",
                ahaMechanismInvariant: "Hydrogen-bonded base pairing (A=T, G≡C) preserves digital sequence fidelity, while non-overlapping 3-base mRNA codons (4³ = 64) direct ribosomes and tRNAs to assemble specific amino acid sequences.",
                principleOrEquationDisplay: "%A = %T,  %G = %C   and   DNA --transcription--> mRNA (Codons) --ribosome/tRNA--> Polypeptide",
                termMappings: [
                    MechanismTermMapping(
                        id: "c11-chargaff",
                        symbolOrTerm: "A = T (2 H-bonds), G ≡ C (3 H-bonds)",
                        biologicalMeaning: "Purine-pyrimidine complementary pairing keeps double-helix diameter constant at 2.0 nm",
                        sliderVariable: "GC Content Percentage (%)",
                        physicalAnchor: "Watson–Crick antiparallel double helix (3'→5' template strand)"
                    ),
                    MechanismTermMapping(
                        id: "c11-codon",
                        symbolOrTerm: "4³ = 64 Triplet Codons",
                        biologicalMeaning: "2-letter codons give only 4² = 16 (< 20 amino acids); 3-letter codons provide degenerate coverage + start/stop",
                        sliderVariable: "mRNA Codon Reading Frame",
                        physicalAnchor: "Khorana's synthetic poly(UC) mRNA → Ser-Leu-Ser-Leu polypeptide"
                    ),
                    MechanismTermMapping(
                        id: "c11-mutation",
                        symbolOrTerm: "GAG → GUG (Glu → Val)",
                        biologicalMeaning: "Single base substitution changes one amino acid, altering protein folding and red cell shape",
                        sliderVariable: "Point Substitution vs Frameshift",
                        physicalAnchor: "Sickle-cell beta-globin allele vs wild-type haemoglobin"
                    )
                ]
            )
        case 12:
            return PhenomenonToMechanismBridge(
                chapterNumber: 12,
                title: "Semi-Conservative Replication, Mitosis (2n→2n) & Meiosis (2n→n)",
                observablePhenomenon: "A scraped knee heals with genetically identical diploid skin cells (46 chromosomes), whereas sperm and egg cells must carry exactly 23 chromosomes so a fertilised zygote does not double to 92.",
                ahaMechanismInvariant: "DNA replicates semi-conservatively before division; one division (mitosis) yields 2 diploid clones for growth/repair, while two divisions after homologous pairing (meiosis) yield 4 unique haploid gametes.",
                principleOrEquationDisplay: "Mitosis: 2n (46) → Rep → 2 × 2n (46)   |   Meiosis: 2n (46) → Rep + 2 Divs → 4 × n (23)",
                termMappings: [
                    MechanismTermMapping(
                        id: "c12-meselson",
                        symbolOrTerm: "¹⁵N/¹⁴N Hybrid Band",
                        biologicalMeaning: "Each daughter DNA molecule conserves one parental strand and templates one new strand",
                        sliderVariable: "Replication Generations in ¹⁴N",
                        physicalAnchor: "Meselson–Stahl CsCl density-gradient centrifugation (1958)"
                    ),
                    MechanismTermMapping(
                        id: "c12-mitosis",
                        symbolOrTerm: "Sister Chromatid Separation",
                        biologicalMeaning: "Spindle fibres pull identical sister chromatids apart to maintain diploid chromosome number",
                        sliderVariable: "Cell Cycle Checkpoint & Spindle Pull",
                        physicalAnchor: "Root tip meristem and human adolescent growth spurt (Unit 7.3)"
                    ),
                    MechanismTermMapping(
                        id: "c12-meiosis",
                        symbolOrTerm: "Chiasmata + 22³ Assortment",
                        biologicalMeaning: "Crossing over in Prophase I + random orientation in Metaphase I generate >8 million gamete combinations",
                        sliderVariable: "Homologous Recombination Frequency",
                        physicalAnchor: "Anther pollen mother cells and human ovary/testis gametogenesis"
                    )
                ]
            )
        case 13:
            return PhenomenonToMechanismBridge(
                chapterNumber: 13,
                title: "Mendelian Allele Segregation, Punnett Probabilities & Pedigrees",
                observablePhenomenon: "Crossing pure-breeding purple (PP) and white (pp) pea plants yields 100% purple F₁ offspring—none pale lilac—yet self-crossing F₁ plants brings pure white flowers back at an exact 1-in-4 ratio.",
                ahaMechanismInvariant: "Traits are governed by discrete allele pairs that do not blend; gametes receive one random allele with probability 0.5, so offspring genotypes follow binomial product and sum probability rules.",
                principleOrEquationDisplay: "Aa × Aa → ¼ AA : ½ Aa : ¼ aa  (3 : 1 Dominant : Recessive)   |   P(A ∩ B) = P(A) × P(B)",
                termMappings: [
                    MechanismTermMapping(
                        id: "c13-punnett",
                        symbolOrTerm: "¼ AA : ½ Aa : ¼ aa",
                        biologicalMeaning: "Independent gamete fertilisation grid predicting expected genotype and phenotype ratios",
                        sliderVariable: "Parental Cross Genotypes",
                        physicalAnchor: "Mendel's 7,324 F₂ pea seeds (5,474 round : 1,850 wrinkled = 2.96 : 1)"
                    ),
                    MechanismTermMapping(
                        id: "c13-codom",
                        symbolOrTerm: "I^A, I^B, i (Codominance)",
                        biologicalMeaning: "Both I^A and I^B alleles express surface glycoproteins simultaneously in AB blood group",
                        sliderVariable: "Allelic Dominance Relationship",
                        physicalAnchor: "Human ABO blood group antigens on red blood cell membranes"
                    ),
                    MechanismTermMapping(
                        id: "c13-sexlink",
                        symbolOrTerm: "X^R X^r vs X^r Y",
                        biologicalMeaning: "Males have only one X chromosome (hemizygous), so a single recessive X^r allele expresses the trait",
                        sliderVariable: "Sex Chromosome Inheritance",
                        physicalAnchor: "Red-green colour vision cone genes and haemophilia pedigrees"
                    )
                ]
            )
        case 14:
            return PhenomenonToMechanismBridge(
                chapterNumber: 14,
                title: "Random Mutation, Darwinian Natural Selection & Antibiotic Resistance",
                observablePhenomenon: "When a patient stops an antibiotic course on Day 3, the infection roars back in a drug-resistant form—and in industrial soot, dark peppered moths replaced pale moths within fifty generations.",
                ahaMechanismInvariant: "Mutations arise randomly BEFORE and independently of environmental need; selection pressures eliminate susceptible individuals so survivors with heritable advantageous alleles leave more offspring.",
                principleOrEquationDisplay: "Δp = [p(1 − p)(w_R − w_S)] ÷ w̄   (Random Variation + Selection Pressure → Allele Shift)",
                termMappings: [
                    MechanismTermMapping(
                        id: "c14-luria",
                        symbolOrTerm: "Pre-Existing Random Mutant",
                        biologicalMeaning: "Resistance mutation occurs by chance during DNA replication before the antibiotic is ever added",
                        sliderVariable: "Spontaneous Mutation Rate µ",
                        physicalAnchor: "Luria & Delbrück fluctuation test & Lederberg replica plating"
                    ),
                    MechanismTermMapping(
                        id: "c14-pressure",
                        symbolOrTerm: "Selection Pressure",
                        biologicalMeaning: "Environmental filter (antibiotic, predator, Sonoran drought) that causes differential survival",
                        sliderVariable: "Antibiotic Dose / Predation Intensity",
                        physicalAnchor: "Incomplete antibiotic course leaving moderately resistant bacteria alive"
                    ),
                    MechanismTermMapping(
                        id: "c14-adapt",
                        symbolOrTerm: "Heritable Adaptation",
                        biologicalMeaning: "Survivors reproduce and pass advantageous alleles to offspring, shifting population allele frequency",
                        sliderVariable: "Generations Elapsed",
                        physicalAnchor: "Saguaro cactus spines/pleated stem & camel wide low-pressure footpads"
                    )
                ]
            )
        default:
            return PhenomenonToMechanismBridge(
                chapterNumber: 15,
                title: "Lindeman's 10% Trophic Pyramid, Biomagnification & Carbon Cycling",
                observablePhenomenon: "Sanjay Gandhi National Park (104 km²) supports tens of thousands of spotted deer and langurs but only ~40 leopards, while persistent toxins like DDT or mercury reach millions-fold higher concentrations in top predators.",
                ahaMechanismInvariant: "At each trophic step ~90% of chemical energy is lost as respiratory heat and unassimilated waste (so biomass shrinks 10× per step), whereas non-biodegradable fat-soluble toxins are retained and concentrate up the pyramid.",
                principleOrEquationDisplay: "E_n = E_0 × (0.10)^n   (Energy Shrinks)   vs   [Toxin]_n = [Toxin]_0 × BAF^n   (Toxin Magnifies)",
                termMappings: [
                    MechanismTermMapping(
                        id: "c15-tenpct",
                        symbolOrTerm: "10% Trophic Transfer",
                        biologicalMeaning: "90% of ingested energy is lost to cellular respiration (heat), movement, and egestion at each link",
                        sliderVariable: "Trophic Level Step n (1 to 4)",
                        physicalAnchor: "SGNP vegetation → chital deer → leopard energy pyramid"
                    ),
                    MechanismTermMapping(
                        id: "c15-biomag",
                        symbolOrTerm: "Bioaccumulation → Biomagnification",
                        biologicalMeaning: "Persistent non-excreted toxin stays fixed while biomass shrinks, multiplying ppm at every predator tier",
                        sliderVariable: "Toxin Persistence & Predator Intake",
                        physicalAnchor: "DDT thinning osprey eggshells & Thane Creek heavy-metal food chains (Unit 4.4)"
                    ),
                    MechanismTermMapping(
                        id: "c15-cycles",
                        symbolOrTerm: "Photosynthesis ⇌ Respiration + Decomposers",
                        biologicalMeaning: "Energy flows one way (Sun → heat sink), whereas carbon and nitrogen atoms cycle continuously",
                        sliderVariable: "Decomposer & Nitrifying Activity",
                        physicalAnchor: "Mauna Loa seasonal CO₂ oscillation & root-nodule Rhizobium nitrogen fixation"
                    )
                ]
            )
        }
    }
}

// MARK: - Brilliant-Style Bite-Sized Interactive Chapter Beats & Synchronized Read+Listen Narrator

public enum ChapterInteractiveBeatKind: String, Codable, CaseIterable, Sendable {
    case everydayHook = "everyday_hook"
    case proseInsight = "prose_insight"
    case calloutGate = "callout_gate"
    case interactiveLabAndMechanism = "interactive_lab_and_mechanism"
    case misconceptionDebate = "misconception_debate"
    case chapterSynthesis = "chapter_synthesis"

    public var badgeLabel: String {
        switch self {
        case .everydayHook: return "Step · Everyday Clue"
        case .proseInsight: return "Step · Core Idea"
        case .calloutGate: return "Step · Quick Check"
        case .interactiveLabAndMechanism: return "Step · How It Works"
        case .misconceptionDebate: return "Step · Who Is Right?"
        case .chapterSynthesis: return "Step · Chapter Summary"
        }
    }

    public var systemImage: String {
        switch self {
        case .everydayHook: return "sparkles"
        case .proseInsight: return "book.pages"
        case .calloutGate: return "checkmark.shield"
        case .interactiveLabAndMechanism: return "slider.horizontal.3"
        case .misconceptionDebate: return "bubble.left.and.bubble.right.fill"
        case .chapterSynthesis: return "seal.fill"
        }
    }
}

struct ChapterInteractiveBeat: Identifiable, Hashable, Sendable {
    let id: String
    let chapterNumber: Int
    let index: Int
    let totalBeats: Int
    let kind: ChapterInteractiveBeatKind
    let eyebrow: String
    let title: String
    let bodyMarkdown: String
    let callout: LivingWorldCallout?
    let bridge: PhenomenonToMechanismBridge?
    let debate: BiologicalDebateScenario?
    let widgetIds: [String]
    let keyTerms: [String]
    let estimatedSeconds: Int

    var requiresInteractionToAdvance: Bool {
        switch kind {
        case .calloutGate, .misconceptionDebate:
            return true
        case .everydayHook, .proseInsight, .interactiveLabAndMechanism, .chapterSynthesis:
            return false
        }
    }

    /// Clean spoken script for the SmartyMe-style Read & Listen synchronized audio narrator.
    var spokenScript: String {
        let cleanedBody = bodyMarkdown
            .replacingOccurrences(of: "==", with: "")
            .replacingOccurrences(of: "**", with: "")
            .replacingOccurrences(of: ":::scene", with: "Scene:")
            .replacingOccurrences(of: "\n", with: " ")
        if let bridge {
            return "\(title). \(bridge.observablePhenomenon) Mechanism: \(bridge.ahaMechanismInvariant) Formal principle: \(bridge.principleOrEquationDisplay)."
        }
        if let debate {
            return "\(title). \(debate.mumbaiContextPrompt)"
        }
        if let callout {
            return "\(title). \(cleanedBody) Check question: \(callout.body)"
        }
        return "\(title). \(cleanedBody)"
    }
}

enum ChapterInteractiveBeatEngine {
    /// Decomposes any Living World chapter into bite-sized Brilliant/SmartyMe interactive beats.
    static func beats(for chapter: LivingWorldChapter) -> [ChapterInteractiveBeat] {
        var rawBeats: [(
            kind: ChapterInteractiveBeatKind,
            eyebrow: String,
            title: String,
            body: String,
            callout: LivingWorldCallout?,
            bridge: PhenomenonToMechanismBridge?,
            debate: BiologicalDebateScenario?,
            widgets: [String],
            terms: [String],
            seconds: Int
        )] = []

        // 1. Everyday Phenomenon Hook Beat
        let predictCallout = chapter.callouts.first(where: { $0.kind == "predict" })
        rawBeats.append((
            kind: .everydayHook,
            eyebrow: "Chapter \(chapter.number) · Opening Clue",
            title: chapter.title,
            body: chapter.hookSummary.isEmpty ? chapter.subtitle : chapter.hookSummary,
            callout: predictCallout,
            bridge: nil,
            debate: nil,
            widgets: [],
            terms: Array(chapter.keyTerms.prefix(4)),
            seconds: 90
        ))

        // 2. Interleave sections with active check callouts so Kym never reads >1 screen without doing
        let nonPredictCallouts = chapter.callouts.filter { $0.kind != "predict" }
        for (secIdx, section) in chapter.sections.enumerated() {
            rawBeats.append((
                kind: .proseInsight,
                eyebrow: "Section \(secIdx + 1) of \(chapter.sections.count)",
                title: section.heading,
                body: section.excerpt,
                callout: nil,
                bridge: nil,
                debate: nil,
                widgets: secIdx == 0 ? Array(chapter.widgets.prefix(1)) : [],
                terms: [],
                seconds: 110
            ))

            if secIdx < nonPredictCallouts.count {
                let gateCallout = nonPredictCallouts[secIdx]
                rawBeats.append((
                    kind: .calloutGate,
                    eyebrow: "Quick Check · \(gateCallout.badgeText)",
                    title: gateCallout.title,
                    body: "Write your prediction or answer below to unlock the next step.",
                    callout: gateCallout,
                    bridge: nil,
                    debate: nil,
                    widgets: [],
                    terms: [],
                    seconds: 95
                ))
            }
        }

        // 3. Everyday Clue -> Cell Mechanism -> Key Rule Bridge Beat
        let bridge = PhenomenonToMechanismBridge.bridge(forChapter: chapter.number)
        rawBeats.append((
            kind: .interactiveLabAndMechanism,
            eyebrow: "How It Works · Clue to Rule",
            title: bridge.title,
            body: bridge.ahaMechanismInvariant,
            callout: nil,
            bridge: bridge,
            debate: nil,
            widgets: chapter.widgets,
            terms: Array(chapter.keyTerms.prefix(6)),
            seconds: 150
        ))

        // 4. Peer Misconception Debate Beat ("Who Is Right & Why?")
        let debate = BiologicalDebateCatalog.scenario(forChapter: chapter.number)
        rawBeats.append((
            kind: .misconceptionDebate,
            eyebrow: "Who Is Right & Why?",
            title: debate.title,
            body: debate.mumbaiContextPrompt,
            callout: nil,
            bridge: nil,
            debate: debate,
            widgets: [],
            terms: [],
            seconds: 120
        ))

        // 5. Chapter Summary & Recall Beat
        let recallCallout = chapter.callouts.last(where: { $0.kind == "recall" || $0.kind == "school" }) ?? chapter.callouts.last
        rawBeats.append((
            kind: .chapterSynthesis,
            eyebrow: "Chapter \(chapter.number) · Key Takeaways",
            title: "Bringing It Together: \(chapter.title)",
            body: "Key idea: \(bridge.ahaMechanismInvariant)\n\nKey equation: \(bridge.principleOrEquationDisplay)",
            callout: recallCallout,
            bridge: nil,
            debate: nil,
            widgets: [],
            terms: chapter.keyTerms,
            seconds: 90
        ))

        let total = rawBeats.count
        return rawBeats.enumerated().map { idx, item in
            ChapterInteractiveBeat(
                id: "ch\(chapter.number)-beat-\(idx + 1)",
                chapterNumber: chapter.number,
                index: idx,
                totalBeats: total,
                kind: item.kind,
                eyebrow: item.eyebrow,
                title: item.title,
                bodyMarkdown: item.body,
                callout: item.callout,
                bridge: item.bridge,
                debate: item.debate,
                widgetIds: item.widgets,
                keyTerms: item.terms,
                estimatedSeconds: item.seconds
            )
        }
    }
}

/// SmartyMe-style synchronized Read & Listen audio narrator for chapter beats and 5-shot Watch tours.
@MainActor
final class ChapterAudioNarrator: ObservableObject {
    @Published private(set) var isPlaying: Bool = false
    @Published private(set) var activeBeatId: String? = nil
    @Published private(set) var activeWatchStepIndex: Int = 0
    @Published var playbackSpeedMultiplier: Double = 1.0

    static let supportedSpeeds: [Double] = [1.0, 1.25, 1.5]
    private let synthesizer = AVSpeechSynthesizer()
    let allowsHardwareSpeech: Bool

    init(allowsHardwareSpeech: Bool = true) {
        self.allowsHardwareSpeech = allowsHardwareSpeech
    }

    func cycleSpeed(restartingIfPlaying beat: ChapterInteractiveBeat? = nil) {
        if let idx = Self.supportedSpeeds.firstIndex(of: playbackSpeedMultiplier) {
            playbackSpeedMultiplier = Self.supportedSpeeds[(idx + 1) % Self.supportedSpeeds.count]
        } else {
            playbackSpeedMultiplier = 1.0
        }
        if isPlaying, let beat {
            speak(beat: beat)
        }
    }

    func togglePlayPause(for beat: ChapterInteractiveBeat) {
        if isPlaying && activeBeatId == beat.id {
            stop()
        } else {
            speak(beat: beat)
        }
    }

    func speak(beat: ChapterInteractiveBeat) {
        if allowsHardwareSpeech && synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        activeBeatId = beat.id
        isPlaying = true

        guard allowsHardwareSpeech else { return }
        let utterance = AVSpeechUtterance(string: beat.spokenScript)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-IN")
            ?? AVSpeechSynthesisVoice(language: "en-GB")
            ?? AVSpeechSynthesisVoice(language: "en-US")
        let baseRate = AVSpeechUtteranceDefaultSpeechRate
        utterance.rate = min(
            AVSpeechUtteranceMaximumSpeechRate,
            max(AVSpeechUtteranceMinimumSpeechRate, baseRate * Float(playbackSpeedMultiplier))
        )
        utterance.pitchMultiplier = 1.02
        synthesizer.speak(utterance)
    }

    func advanceWatchStep(totalSteps: Int, caption: String) {
        guard totalSteps > 0 else { return }
        activeWatchStepIndex = (activeWatchStepIndex + 1) % totalSteps
        guard allowsHardwareSpeech else { return }
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        let utterance = AVSpeechUtterance(string: caption)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-IN") ?? AVSpeechSynthesisVoice(language: "en-GB")
        utterance.rate = AVSpeechUtteranceDefaultSpeechRate * Float(playbackSpeedMultiplier)
        synthesizer.speak(utterance)
    }

    func stop() {
        if allowsHardwareSpeech && synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        isPlaying = false
        activeBeatId = nil
    }
}

// MARK: - SmartyMe-Style Branching Peer Debates ("Who Is Right & Why?")

public struct BiologicalDebateChoice: Identifiable, Hashable, Sendable {
    public let id: String
    public let speakerName: String
    public let claim: String
    public let isCorrect: Bool
    public let socraticRebuttal: String
    public let invariantTakeaway: String

    public init(
        id: String,
        speakerName: String,
        claim: String,
        isCorrect: Bool,
        socraticRebuttal: String,
        invariantTakeaway: String
    ) {
        self.id = id
        self.speakerName = speakerName
        self.claim = claim
        self.isCorrect = isCorrect
        self.socraticRebuttal = socraticRebuttal
        self.invariantTakeaway = invariantTakeaway
    }
}

public struct BiologicalDebateScenario: Identifiable, Hashable, Sendable {
    public let id: String
    public let chapterNumber: Int
    public let schoolUnitNumber: Int
    public let topicCode: String
    public let title: String
    public let mumbaiContextPrompt: String
    public let choices: [BiologicalDebateChoice]

    public init(
        id: String,
        chapterNumber: Int,
        schoolUnitNumber: Int,
        topicCode: String,
        title: String,
        mumbaiContextPrompt: String,
        choices: [BiologicalDebateChoice]
    ) {
        self.id = id
        self.chapterNumber = chapterNumber
        self.schoolUnitNumber = schoolUnitNumber
        self.topicCode = topicCode
        self.title = title
        self.mumbaiContextPrompt = mumbaiContextPrompt
        self.choices = choices
    }
}

public enum BiologicalDebateEngine {
    public static func evaluate(
        scenario: BiologicalDebateScenario,
        choiceId: String
    ) -> BiologicalDebateChoice? {
        scenario.choices.first(where: { $0.id == choiceId })
    }
}

public enum BiologicalDebateCatalog {
    public static func scenario(forChapter chapterNumber: Int) -> BiologicalDebateScenario {
        allScenarios.first(where: { $0.chapterNumber == chapterNumber }) ?? allScenarios[0]
    }

    public static func scenario(forSchoolUnit unitNumber: Int) -> BiologicalDebateScenario {
        allScenarios.first(where: { $0.schoolUnitNumber == unitNumber }) ?? allScenarios[0]
    }

    public static let allScenarios: [BiologicalDebateScenario] = [
        // Ch 0
        BiologicalDebateScenario(
            id: "debate-ch00-redi-gauze",
            chapterNumber: 0,
            schoolUnitNumber: 2,
            topicCode: "2.3",
            title: "Redi's Gauze Jar vs Spontaneous Generation",
            mumbaiContextPrompt: "Aarav and Zoya inspect three jars of raw fish in a warm Mumbai lab: Open, Sealed with wax, and Covered with fine muslin gauze. Maggots appear only on the open meat, while tiny eggs sit on top of the gauze. Why did Redi add the third gauze-covered jar?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch00-aarav",
                    speakerName: "Aarav",
                    claim: "The sealed jar already proved everything; the gauze jar was just a backup in case the wax melted in July heat.",
                    isCorrect: false,
                    socraticRebuttal: "Critics of the wax-sealed jar argued that sealing blocked fresh air ('vital force') needed for spontaneous generation. A sealed jar changed TWO variables at once: flies AND air.",
                    invariantTakeaway: "A valid controlled experiment changes only one independent variable (access of flies) while keeping air supply constant."
                ),
                BiologicalDebateChoice(
                    id: "ch00-zoya",
                    speakerName: "Zoya",
                    claim: "The gauze let fresh air circulate freely while blocking adult flies—so air was held constant as a control variable, proving maggots come only from fly eggs.",
                    isCorrect: true,
                    socraticRebuttal: "Spot on! By letting air in through the mesh while stopping flies, Redi isolated a single independent variable (fly contact) and refuted the 'missing air' objection.",
                    invariantTakeaway: "Control variables (temperature, meat type, fresh air access) must be kept identical so only the independent variable explains the result."
                ),
                BiologicalDebateChoice(
                    id: "ch00-kabir",
                    speakerName: "Kabir",
                    claim: "The gauze chemically sterilised the meat so bacteria and maggots could not grow inside the jar.",
                    isCorrect: false,
                    socraticRebuttal: "The meat inside the gauze jar still rotted and smelled foul from bacteria! Muslin gauze only blocks macroscopic insects like blowflies, not microscopic bacteria.",
                    invariantTakeaway: "Redi disproved macroscopic spontaneous generation of maggots; Pasteur's swan-neck flasks later disproved microbial spontaneous generation."
                )
            ]
        ),
        // Ch 1
        BiologicalDebateScenario(
            id: "debate-ch01-germinating-peas",
            chapterNumber: 1,
            schoolUnitNumber: 1,
            topicCode: "1.4",
            title: "The Warm Thermos of Germinating Moong Beans",
            mumbaiContextPrompt: "In a dark Mumbai school cupboard, Flask A holds live soaked moong beans and Flask B holds boiled dead moong beans in surface disinfectant. After 48 hours in total darkness, Flask A is 6 °C warmer than Flask B. Who explains why?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch01-aarav",
                    speakerName: "Aarav",
                    claim: "The live beans in Flask A are photosynthesising rapidly to grow roots, and photosynthesis creates heat energy.",
                    isCorrect: false,
                    socraticRebuttal: "Two traps here: (1) the cupboard is pitch dark and seeds underground have no light for photosynthesis, and (2) photosynthesis is endothermic (absorbs light energy).",
                    invariantTakeaway: "Germinating seeds in the dark rely on aerobic respiration of stored food reserves, not photosynthesis."
                ),
                BiologicalDebateChoice(
                    id: "ch01-zoya",
                    speakerName: "Zoya",
                    claim: "The live hydrated embryos in Flask A carry out exothermic aerobic respiration in their mitochondria, releasing energy from glucose as ATP and heat.",
                    isCorrect: true,
                    socraticRebuttal: "Exact Cambridge mark-scheme reasoning! Water imbibition reactivates enzymes; aerobic respiration (glucose + oxygen → carbon dioxide + water) releases energy, some as measurable heat.",
                    invariantTakeaway: "Respiration is an exothermic chemical reaction in all living cells that RELEASES (never 'creates' or 'makes') energy from glucose."
                ),
                BiologicalDebateChoice(
                    id: "ch01-kabir",
                    speakerName: "Kabir",
                    claim: "Soaking dry seeds in water causes friction as the seed coats stretch, which heats Flask A by 6 °C.",
                    isCorrect: false,
                    socraticRebuttal: "The boiled seeds in Flask B were also soaked in water, yet Flask B did not stay warm because boiling denatured its respiratory enzymes.",
                    invariantTakeaway: "A boiled-seed control isolates living metabolic enzyme activity from purely physical hydration."
                )
            ]
        ),
        // Ch 2
        BiologicalDebateScenario(
            id: "debate-ch02-paneer-sav",
            chapterNumber: 2,
            schoolUnitNumber: 1,
            topicCode: "1.2",
            title: "Why Isn't a Human One Giant 50 kg Cell?",
            mumbaiContextPrompt: "Kym soaks a 0.5 cm paneer cube and a 2.0 cm paneer cube in turmeric dye for 15 minutes. When sliced open, the 0.5 cm cube is yellow right to the centre, while the 2.0 cm cube has a 2 mm yellow rim and a white core. Why?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch02-aarav",
                    speakerName: "Aarav",
                    claim: "Turmeric dye molecules diffuse much more slowly inside a 2.0 cm cube than inside a 0.5 cm cube.",
                    isCorrect: false,
                    socraticRebuttal: "Look at the rim thickness: the dye crept inward by the exact same speed (~2 mm in 15 minutes) in both cubes!",
                    invariantTakeaway: "Diffusion speed per millimetre is unchanged; what changes is the distance to the centre and the surface-area-to-volume ratio."
                ),
                BiologicalDebateChoice(
                    id: "ch02-zoya",
                    speakerName: "Zoya",
                    claim: "Diffusion crept 2 mm into both, but as side length L quadrupled, volume grew 64× while surface area grew only 16×—so SA:V (6/L) dropped 4× and diffusion cannot reach the deep core in time.",
                    isCorrect: true,
                    socraticRebuttal: "Brilliant! Because SA:V = 6 ÷ L falls from 12 cm⁻¹ (for L = 0.5 cm) to 3 cm⁻¹ (for L = 2 cm), a giant cell would starve and suffocate at its centre.",
                    invariantTakeaway: "Multicellular organisms are built of trillions of microscopic cells (plus folded exchange surfaces) to keep diffusion distances tiny and SA:V high."
                ),
                BiologicalDebateChoice(
                    id: "ch02-kabir",
                    speakerName: "Kabir",
                    claim: "The outer paneer cells have rigid cellulose cell walls that block dye from going deeper than 2 mm.",
                    isCorrect: false,
                    socraticRebuttal: "First, paneer is milk protein (animal origin, no cellulose cell walls); second, even plant cellulose cell walls are freely permeable to water and small solutes.",
                    invariantTakeaway: "Animal cells never have cell walls, and the diffusion bottleneck in large volumes is geometric (SA:V = 6/L)."
                )
            ]
        ),
        // Ch 3
        BiologicalDebateScenario(
            id: "debate-ch03-equilibrium-motion",
            chapterNumber: 3,
            schoolUnitNumber: 3,
            topicCode: "3.7",
            title: "Do Molecules Stop Moving at Equilibrium?",
            mumbaiContextPrompt: "A potato cylinder sits in an isotonic 0.30 mol dm⁻³ sucrose solution at 30 °C. After an hour, its mass is completely unchanged (0.0% change). What are the water molecules doing across the cell membranes right now?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch03-aarav",
                    speakerName: "Aarav",
                    claim: "Because the concentrations are equal on both sides, osmosis has finished and water molecules have stopped crossing the membrane.",
                    isCorrect: false,
                    socraticRebuttal: "This is the #1 physics-biology misconception (58% of students fall for it)! At 30 °C (303 K), every water molecule still has high thermal kinetic energy and bounces constantly.",
                    invariantTakeaway: "Molecules never stop moving above absolute zero; equilibrium is dynamic, not static."
                ),
                BiologicalDebateChoice(
                    id: "ch03-zoya",
                    speakerName: "Zoya",
                    claim: "Water molecules continue crossing the membrane randomly in both directions at high speed, but the rate of water entering equals the rate leaving, so NET movement is zero.",
                    isCorrect: true,
                    socraticRebuttal: "Exact mechanistic truth! Individual particles move randomly; dynamic equilibrium means equal opposing fluxes (J_in = J_out), so net mass change is zero.",
                    invariantTakeaway: "At isotonic equilibrium, water potential is equal on both sides and net osmosis is zero while bidirectional molecular motion continues."
                ),
                BiologicalDebateChoice(
                    id: "ch03-kabir",
                    speakerName: "Kabir",
                    claim: "Water molecules sense that the potato cell is happy and choose not to enter so the cell does not burst.",
                    isCorrect: false,
                    socraticRebuttal: "Molecules have no brains or wishes (avoid teleological/anthropocentric wording!). Furthermore, plant cells have a rigid cellulose cell wall that prevents bursting (turgor).",
                    invariantTakeaway: "Osmosis is driven purely by statistical collisions and water potential gradients, never by molecular 'wants'."
                )
            ]
        ),
        // Ch 4
        BiologicalDebateScenario(
            id: "debate-ch04-boiled-enzyme",
            chapterNumber: 4,
            schoolUnitNumber: 7,
            topicCode: "7.1",
            title: "Did Boiling 'Kill' the Potato Catalase Enzyme?",
            mumbaiContextPrompt: "In a school practical, boiling a cube of potato stops it from fizzing in hydrogen peroxide. In her lab book, Meera writes: 'At 100 °C the catalase enzyme died.' Why will a Cambridge examiner deduct the mark?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch04-aarav",
                    speakerName: "Aarav",
                    claim: "Meera is right—enzymes are microscopic living workers inside cells, so boiling water kills them just like bacteria.",
                    isCorrect: false,
                    socraticRebuttal: "Cambridge examiners explicitly penalise 'the enzyme is killed/dies'! An enzyme is a single globular protein molecule, not a living cell or organism—it was never alive.",
                    invariantTakeaway: "Cells and bacteria can be killed; protein molecules (enzymes and antibodies) are non-living and can only be denatured."
                ),
                BiologicalDebateChoice(
                    id: "ch04-zoya",
                    speakerName: "Zoya",
                    claim: "Enzymes are non-living protein molecules; high thermal kinetic energy breaks weak hydrogen and ionic bonds, irreversibly unfolding the 3D active site (denaturation) so the substrate no longer fits.",
                    isCorrect: true,
                    socraticRebuttal: "100% full-marks answer! You named the protein nature, the broken bonds, the loss of 3D active-site complementarity (**denaturation**), and inability to form the enzyme-substrate complex.",
                    invariantTakeaway: "Above optimum temperature, enzymes DENATURE: their active site changes shape permanently so the substrate can no longer bind."
                ),
                BiologicalDebateChoice(
                    id: "ch04-kabir",
                    speakerName: "Kabir",
                    claim: "Boiling evaporated the enzyme molecules out of the potato into the steam.",
                    isCorrect: false,
                    socraticRebuttal: "Catalase is a huge protein macromolecule (~240,000 Da)—it does not evaporate with water steam; it coagulates (clumps) in place like cooked egg white.",
                    invariantTakeaway: "Denatured proteins remain in the tissue as unfolded, inactive polypeptide chains."
                )
            ]
        ),
        // Ch 5
        BiologicalDebateScenario(
            id: "debate-ch05-banyan-mass",
            chapterNumber: 5,
            schoolUnitNumber: 2,
            topicCode: "2.4",
            title: "Where Did the 100-Tonne Horniman Circle Banyan Tree Come From?",
            mumbaiContextPrompt: "Standing under a giant banyan tree in Mumbai, Rohan asks: 'Where did almost all the dry solid mass (wood, bark, cellulose) of this giant tree come from as it grew from a tiny seed?'",
            choices: [
                BiologicalDebateChoice(
                    id: "ch05-aarav",
                    speakerName: "Aarav",
                    claim: "The roots sucked up rich brown soil and humus from the ground and turned that soil into wood.",
                    isCorrect: false,
                    socraticRebuttal: "Van Helmont disproved this in 1648! While his willow tree gained 74.5 kg, the dry mass of the pot's soil lost only 57 grams (mineral ions). If trees ate soil, giant craters would form under every tree!",
                    invariantTakeaway: "Soil supplies only water and trace mineral ions (nitrates, magnesium)—less than 2% of a tree's dry mass."
                ),
                BiologicalDebateChoice(
                    id: "ch05-zoya",
                    speakerName: "Zoya",
                    claim: "Almost all of the tree's dry carbon mass came from invisible carbon dioxide gas (CO₂) diffusing through leaf stomata from the air, combined with hydrogen from water during photosynthesis.",
                    isCorrect: true,
                    socraticRebuttal: "Mind-blowing and completely true! By 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, every carbon atom in cellulose wood was once a CO₂ molecule floating in Mumbai's air.",
                    invariantTakeaway: "Plant dry biomass is solidified atmospheric CO₂ gas fixed by chloroplasts using light energy."
                ),
                BiologicalDebateChoice(
                    id: "ch05-kabir",
                    speakerName: "Kabir",
                    claim: "Sunlight photons have mass and solidify directly into glucose inside the green chloroplasts.",
                    isCorrect: false,
                    socraticRebuttal: "Light provides the energy for the endothermic reaction, not the atoms! Matter is conserved: carbon and oxygen atoms in glucose come from CO₂, and hydrogen comes from H₂O.",
                    invariantTakeaway: "Light is an energy transfer that drives chemical bond rearrangement; mass comes from CO₂ and H₂O atoms."
                )
            ]
        ),
        // Ch 6
        BiologicalDebateScenario(
            id: "debate-ch06-breathing-vs-respiration",
            chapterNumber: 6,
            schoolUnitNumber: 1,
            topicCode: "1.3",
            title: "Breathing vs Cellular Respiration (The Classic Unit 1 Trap)",
            mumbaiContextPrompt: "In a Cambridge Science 8 test, a question asks: 'Define respiration and state where it occurs.' Compare these three student answers:",
            choices: [
                BiologicalDebateChoice(
                    id: "ch06-aarav",
                    speakerName: "Aarav",
                    claim: "Respiration is breathing oxygen into the lungs and breathing carbon dioxide out of the nose.",
                    isCorrect: false,
                    socraticRebuttal: "Examiner red alert! Breathing (ventilation) is mechanical movement of air into and out of the lungs; plants and bacteria have no lungs yet they respire 24 hours a day.",
                    invariantTakeaway: "Never equate breathing (lung ventilation) with respiration (cellular chemical reaction)."
                ),
                BiologicalDebateChoice(
                    id: "ch06-zoya",
                    speakerName: "Zoya",
                    claim: "Respiration is an exothermic chemical reaction inside the mitochondria of all living cells where glucose reacts with oxygen to release energy (for growth and movement), forming carbon dioxide and water.",
                    isCorrect: true,
                    socraticRebuttal: "Full marks! You distinguished cellular chemistry from lung ventilation, named mitochondria in all living cells, and wrote 'releases energy' instead of the forbidden 'makes/creates energy'.",
                    invariantTakeaway: "Aerobic respiration (glucose + oxygen → carbon dioxide + water) occurs in mitochondria of all living cells and releases energy."
                ),
                BiologicalDebateChoice(
                    id: "ch06-kabir",
                    speakerName: "Kabir",
                    claim: "Respiration is how animal cells create brand-new energy out of oxygen, while plants only photosynthesise and never respire.",
                    isCorrect: false,
                    socraticRebuttal: "Double misconception! First, energy cannot be created (Law of Conservation of Energy)—it is released from chemical bonds in glucose. Second, plant cells respire continuously day and night!",
                    invariantTakeaway: "Both plants and animals respire 24/7; energy is transferred/released from glucose, never created."
                )
            ]
        ),
        // Ch 7
        BiologicalDebateScenario(
            id: "debate-ch07-bile-emulsification",
            chapterNumber: 7,
            schoolUnitNumber: 7,
            topicCode: "7.1",
            title: "Is Bile a Digestive Enzyme?",
            mumbaiContextPrompt: "After eating buttered pav, green-yellow bile from the gall bladder enters the duodenum alongside pancreatic juice. How does bile speed up fat digestion?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch07-aarav",
                    speakerName: "Aarav",
                    claim: "Bile is a powerful lipid enzyme made by the liver that chemically breaks fat molecules into fatty acids and glycerol.",
                    isCorrect: false,
                    socraticRebuttal: "Classic exam trap! Bile contains ZERO enzymes and breaks zero covalent ester bonds—it cannot chemically convert triglycerides into fatty acids.",
                    invariantTakeaway: "Bile is an alkaline fluid of bile salts (not an enzyme); pancreatic lipase is the enzyme that chemically digests fat."
                ),
                BiologicalDebateChoice(
                    id: "ch07-zoya",
                    speakerName: "Zoya",
                    claim: "Bile is not an enzyme; it physically emulsifies large fat globules into tiny droplets to greatly increase surface area for pancreatic lipase, and neutralises acidic stomach chyme.",
                    isCorrect: true,
                    socraticRebuttal: "Spot on! Emulsification is physical dispersion (increasing surface area ~1,000×), while alkaline hydrogencarbonate in bile raises pH to ~8 so pancreatic lipase works at its optimum.",
                    invariantTakeaway: "Bile emulsifies fats (physical surface-area boost) + neutralises stomach acid; lipase performs chemical hydrolysis."
                ),
                BiologicalDebateChoice(
                    id: "ch07-kabir",
                    speakerName: "Kabir",
                    claim: "Bile lowers the pH of the small intestine to pH 2 so stomach pepsin can digest fat.",
                    isCorrect: false,
                    socraticRebuttal: "Pepsin only digests proteins in the acidic stomach, and small-intestine enzymes require alkaline conditions (pH ~8), which bile provides by neutralising stomach HCl.",
                    invariantTakeaway: "Stomach = acidic (pH 2, pepsin); duodenum = alkaline (pH 8, bile + pancreatic amylase/protease/lipase)."
                )
            ]
        ),
        // Ch 8
        BiologicalDebateScenario(
            id: "debate-ch08-antagonistic-muscles",
            chapterNumber: 8,
            schoolUnitNumber: 3,
            topicCode: "3.4",
            title: "Why Can't One Single Muscle Both Bend and Straighten Your Elbow?",
            mumbaiContextPrompt: "In Unit 7.4 & Unit 3.4, Kym bends her forearm upward to lift a cricket ball and then straightens her arm back down. Why does the elbow hinge joint require BOTH a biceps and a triceps muscle?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch08-aarav",
                    speakerName: "Aarav",
                    claim: "The biceps contracts to pull the forearm up, and then the biceps pushes the radius bone back down to straighten the arm.",
                    isCorrect: false,
                    socraticRebuttal: "Try pushing a heavy door open with a piece of string—it just goes slack! Skeletal muscle fibres can only generate tension by contracting (pulling); a relaxing muscle cannot push.",
                    invariantTakeaway: "Muscles can only pull when they contract; they can never push."
                ),
                BiologicalDebateChoice(
                    id: "ch08-zoya",
                    speakerName: "Zoya",
                    claim: "Because muscles can only pull when they contract and cannot push, two antagonistic muscles are needed on opposite sides of the elbow pivot: biceps contracts (triceps relaxes) to flex, and triceps contracts (biceps relaxes) to extend.",
                    isCorrect: true,
                    socraticRebuttal: "Textbook-perfect! That is the exact 3-part mark-scheme chain for Unit 7.4: muscles only pull (cannot push) → antagonistic pair required → opposite contraction/relaxation roles.",
                    invariantTakeaway: "Antagonistic muscle pairs pull bones in opposite directions across a synovial joint via inelastic tendons."
                ),
                BiologicalDebateChoice(
                    id: "ch08-kabir",
                    speakerName: "Kabir",
                    claim: "Ligaments contract to pull the arm straight while tendons lubricate the joint cavity.",
                    isCorrect: false,
                    socraticRebuttal: "You swapped connective tissues! Tendons attach muscle to bone; ligaments hold bone to bone; synovial fluid (and cartilage) lubricates the joint. Neither tendons nor ligaments can contract.",
                    invariantTakeaway: "Tendon = muscle to bone (transmits pull); Ligament = bone to bone (stabilises joint); Synovial fluid = lubrication."
                )
            ]
        ),
        // Ch 9
        BiologicalDebateScenario(
            id: "debate-ch09-green-leaf-light",
            chapterNumber: 9,
            schoolUnitNumber: 6,
            topicCode: "6.4",
            title: "Why Do Plant Leaves Look Green & Starve Under Green Light?",
            mumbaiContextPrompt: "Connecting Unit 6.4 (Colours of light) and Chapter 5/9: Kym shines pure red light (660 nm), pure blue light (450 nm), and pure green light (530 nm) of equal brightness onto pondweed (Elodea). Under green light, oxygen bubbles almost stop! Why?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch09-aarav",
                    speakerName: "Aarav",
                    claim: "Leaves are green because chlorophyll loves green light and absorbs 100% of green wavelengths, which overheats the chloroplast.",
                    isCorrect: false,
                    socraticRebuttal: "If a pigment absorbed 100% of green light, no green light would bounce off it into your eyes—the leaf would look black under green light!",
                    invariantTakeaway: "An object's perceived colour is the wavelength of light it REFLECTS into our retinal cone cells, not the wavelength it absorbs."
                ),
                BiologicalDebateChoice(
                    id: "ch09-zoya",
                    speakerName: "Zoya",
                    claim: "Chlorophyll absorbs red and blue light strongly to drive photosynthesis, but reflects and transmits most green light into our eyes' M-cones—so pure green light provides very little absorbed energy for water splitting.",
                    isCorrect: true,
                    socraticRebuttal: "Brilliant synthesis of physics (Unit 6.4) and biology (Ch 5 & Ch 9)! Reflected green photons stimulate our green retinal cones instead of exciting electrons in photosystems.",
                    invariantTakeaway: "Chlorophyll's absorption spectrum peaks in blue and red and dips in green, matching the action spectrum of photosynthesis."
                ),
                BiologicalDebateChoice(
                    id: "ch09-kabir",
                    speakerName: "Kabir",
                    claim: "Green light causes the stomata on the pondweed to close permanently so oxygen gets trapped inside.",
                    isCorrect: false,
                    socraticRebuttal: "Even with dissolved hydrogencarbonate available, isolated chloroplasts produce far less O₂ in green light because chlorophyll's molecular structure reflects green photons.",
                    invariantTakeaway: "Photosynthetic rate follows the pigment absorption spectrum (high in blue/red, lowest in green)."
                )
            ]
        ),
        // Ch 10
        BiologicalDebateScenario(
            id: "debate-ch10-monsoon-sweating",
            chapterNumber: 10,
            schoolUnitNumber: 7,
            topicCode: "7.2",
            title: "Sweating on Marine Drive: Dry May (38 °C) vs Humid July Monsoon (32 °C)",
            mumbaiContextPrompt: "On a breezy afternoon in May (38 °C, 45% humidity) Kym walks along Marine Drive and feels her skin cool down as she sweats. On a humid July day (32 °C, 90% humidity), sweat pours down her face in droplets yet she feels much hotter. Why?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch10-aarav",
                    speakerName: "Aarav",
                    claim: "In July her sweat glands get blocked by monsoon rain, so warm blood stays trapped deep in her core.",
                    isCorrect: false,
                    socraticRebuttal: "Notice she is pouring with liquid sweat in July! Her sweat glands and skin arterioles (vasodilation) are working flat out.",
                    invariantTakeaway: "Merely secreting liquid water onto the skin surface removes almost no heat if the water just drips off."
                ),
                BiologicalDebateChoice(
                    id: "ch10-zoya",
                    speakerName: "Zoya",
                    claim: "Cooling requires EVAPORATION of water from skin, which absorbs latent heat of vaporisation from blood; at 90% relative humidity the air is nearly saturated with water vapour, so sweat drips off instead of evaporating.",
                    isCorrect: true,
                    socraticRebuttal: "First-principles physics + physiology! Turning liquid water into vapour breaks hydrogen bonds (2,420 J per gram of evaporated sweat). High humidity flattens the vapour concentration gradient.",
                    invariantTakeaway: "Thermoregulatory cooling by sweat depends on the rate of evaporation (latent heat removal), which slows sharply in high humidity."
                ),
                BiologicalDebateChoice(
                    id: "ch10-kabir",
                    speakerName: "Kabir",
                    claim: "During vasodilation, skin capillaries physically move upwards through the dermis to touch the outside air.",
                    isCorrect: false,
                    socraticRebuttal: "Classic IGCSE examiner trap! Capillaries have no muscle walls and NEVER move closer to the skin surface; instead, muscular arterioles supplying surface capillaries dilate (widen) so more blood flows through them.",
                    invariantTakeaway: "In vasodilation, arterioles widen to increase blood flow through existing surface capillaries; vessels never move."
                )
            ]
        ),
        // Ch 11
        BiologicalDebateScenario(
            id: "debate-ch11-gene-expression",
            chapterNumber: 11,
            schoolUnitNumber: 7,
            topicCode: "7.3",
            title: "Same DNA Library, Different Cellular Machines",
            mumbaiContextPrompt: "A salivary gland cell in Kym's mouth and a beta cell in her pancreas both descended by mitosis from the same zygote and contain the exact same 46 chromosomes. Why does the salivary cell make amylase while the beta cell makes insulin?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch11-aarav",
                    speakerName: "Aarav",
                    claim: "As the embryo grows, salivary cells snip out and destroy the insulin gene, while pancreas cells destroy the amylase gene.",
                    isCorrect: false,
                    socraticRebuttal: "Cloning experiments (like Gurdon's frog nuclei and Dolly the sheep) proved that differentiated cells still retain the complete genome!",
                    invariantTakeaway: "Differentiated somatic cells keep the entire DNA genome intact; genes are not deleted during specialisation."
                ),
                BiologicalDebateChoice(
                    id: "ch11-zoya",
                    speakerName: "Zoya",
                    claim: "Both cells keep all their genes, but differential gene expression switches on transcription of only specific genes into mRNA in each cell type (amylase in salivary cells, insulin in beta cells).",
                    isCorrect: true,
                    socraticRebuttal: "Exactly! Think of the genome as a complete cookbook in every kitchen: each specialised cell opens and transcribes only the recipes (mRNA transcripts) needed for its role.",
                    invariantTakeaway: "Cell specialisation results from selective gene expression (transcription of specific mRNAs), not loss of DNA."
                ),
                BiologicalDebateChoice(
                    id: "ch11-kabir",
                    speakerName: "Kabir",
                    claim: "Ribosomes in the pancreas read the exact same mRNA codons using a different genetic code table than ribosomes in the mouth.",
                    isCorrect: false,
                    socraticRebuttal: "The triplet genetic code is nearly universal across all cells and organisms (which is why human insulin genes work inside engineered bacteria!).",
                    invariantTakeaway: "Ribosomes use the same universal codon table; different proteins come from transcribing different mRNA molecules."
                )
            ]
        ),
        // Ch 12
        BiologicalDebateScenario(
            id: "debate-ch12-mitosis-meiosis",
            chapterNumber: 12,
            schoolUnitNumber: 7,
            topicCode: "7.3",
            title: "Why Must Gametes Be Haploid (n = 23) While Growth Uses Mitosis (2n = 46)?",
            mumbaiContextPrompt: "When Kym grows taller during her adolescent growth spurt (Unit 7.3), her bone and muscle cells divide by mitosis. Why can't human sperm and egg cells also be produced by mitosis?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch12-aarav",
                    speakerName: "Aarav",
                    claim: "If gametes were made by mitosis (46 chromosomes each), fertilisation would double the chromosome number every generation (46 + 46 = 92 → 184 → 368)!",
                    isCorrect: true,
                    socraticRebuttal: "Spot on! Because fertilisation fuses two gametes, meiosis must halve the chromosome number from diploid (2n = 46) to haploid (n = 23) so the zygote restores 2n = 46.",
                    invariantTakeaway: "Mitosis maintains 2n → 2n for genetically identical growth and tissue repair; meiosis halves 2n → n for sexual gametes and shuffles alleles."
                ),
                BiologicalDebateChoice(
                    id: "ch12-zoya",
                    speakerName: "Zoya",
                    claim: "Mitosis is too slow to make gametes, whereas meiosis skips DNA replication so it finishes twice as fast.",
                    isCorrect: false,
                    socraticRebuttal: "Careful! Both mitosis and meiosis are preceded by S-phase DNA replication; meiosis takes one replication followed by TWO nuclear divisions (Meiosis I & II).",
                    invariantTakeaway: "DNA replicates once before both mitosis (1 division → 2 diploid cells) and meiosis (2 divisions → 4 haploid cells)."
                ),
                BiologicalDebateChoice(
                    id: "ch12-kabir",
                    speakerName: "Kabir",
                    claim: "Human body cells have 23 chromosomes and double to 46 only when someone reaches adulthood.",
                    isCorrect: false,
                    socraticRebuttal: "Every nucleated somatic cell from the fertilised zygote onward is diploid (2n = 46 in humans); growth increases cell NUMBER by mitosis, not chromosome count per cell.",
                    invariantTakeaway: "Organism growth occurs by mitotic cell division (increasing cell count) and cell enlargement."
                )
            ]
        ),
        // Ch 13
        BiologicalDebateScenario(
            id: "debate-ch13-mendel-coin-fallacy",
            chapterNumber: 13,
            schoolUnitNumber: 4,
            topicCode: "4.1",
            title: "The Gambler's Fallacy in Mendel's Pea Patch",
            mumbaiContextPrompt: "Two heterozygous pea plants (Tt × Tt, where Tall T is dominant over dwarf t) are crossed. The first three seeds grown from the cross all turn out to be dwarf (tt)! What is the probability that the 4th seed will be Tall?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch13-aarav",
                    speakerName: "Aarav",
                    claim: "100% certain! Because the Punnett square has 3 Tall and 1 dwarf, and we already got the dwarf one, the next three must be Tall.",
                    isCorrect: false,
                    socraticRebuttal: "That's the Gambler's Fallacy! Pollen grains and ovules have no memory of previous seeds; Punnett squares show independent probabilities, not a fixed 4-ticket raffle bag.",
                    invariantTakeaway: "Each fertilisation is an independent probability event unaffected by previous offspring."
                ),
                BiologicalDebateChoice(
                    id: "ch13-zoya",
                    speakerName: "Zoya",
                    claim: "Still exactly 75% (3/4)! Each new fertilisation independently combines random T or t gametes, so every seed has a 3/4 chance of being Tall (TT or Tt) and 1/4 chance of being dwarf (tt).",
                    isCorrect: true,
                    socraticRebuttal: "Crystal-clear probabilistic reasoning! Just as flipping 3 tails in a row leaves the 4th coin flip at 50%, every Tt × Tt fertilisation carries a fresh 75% dominant / 25% recessive probability.",
                    invariantTakeaway: "The 3:1 Mendelian ratio is a statistical expectation over large sample sizes (Mendel counted thousands of seeds); each individual birth is independent."
                ),
                BiologicalDebateChoice(
                    id: "ch13-kabir",
                    speakerName: "Kabir",
                    claim: "0%—having three dwarf offspring proves the dominant T alleles mutated into recessive t alleles in both parents.",
                    isCorrect: false,
                    socraticRebuttal: "Getting three recessives in a row has probability (1/4)³ = 1/64 (about 1.6%)—uncommon, but completely normal by chance when both parents are Tt carriers.",
                    invariantTakeaway: "Recessive traits can appear in clusters in small families whenever both parents are heterozygous carriers (Tt)."
                )
            ]
        ),
        // Ch 14
        BiologicalDebateScenario(
            id: "debate-ch14-antibiotic-teleology",
            chapterNumber: 14,
            schoolUnitNumber: 4,
            topicCode: "4.3",
            title: "Why Do Bacteria Become Antibiotic-Resistant?",
            mumbaiContextPrompt: "A patient takes antibiotics for a bacterial throat infection, feels better on Day 3, and stops taking the rest of the tablets. A week later, an antibiotic-resistant strain dominates. Which explanation is scientifically accurate?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch14-aarav",
                    speakerName: "Aarav",
                    claim: "When the bacteria sensed the antibiotic poisoning them, they mutated on purpose in order to develop a shield and survive.",
                    isCorrect: false,
                    socraticRebuttal: "This is the #1 evolution misconception (79% prevalence in Coley & Tanner 2015)! Bacteria cannot 'choose' or direct mutations in response to need—mutations happen randomly during DNA copying.",
                    invariantTakeaway: "Never write 'mutated in order to survive'; mutations are random and pre-exist the environmental selection pressure."
                ),
                BiologicalDebateChoice(
                    id: "ch14-zoya",
                    speakerName: "Zoya",
                    claim: "Random mutations had already created a few resistant bacteria before treatment; the partial antibiotic dose killed the susceptible majority, removing competition so the resistant survivors multiplied and passed on their resistance allele.",
                    isCorrect: true,
                    socraticRebuttal: "100% Darwinian and Luria–Delbrück accuracy! You followed the exact 4-step chain: pre-existing random variation → selection pressure (antibiotic) → differential survival → reproduction passing alleles to offspring.",
                    invariantTakeaway: "Natural selection acts on pre-existing random genetic variation; individuals do not evolve, populations shift in allele frequency across generations."
                ),
                BiologicalDebateChoice(
                    id: "ch14-kabir",
                    speakerName: "Kabir",
                    claim: "The human patient's body became resistant and immune to the antibiotic tablets.",
                    isCorrect: false,
                    socraticRebuttal: "76% of people surveyed by the WHO hold this misconception! It is the BACTERIAL population—never the human body—that becomes resistant to an antibiotic.",
                    invariantTakeaway: "Antibiotic resistance is a genetic property of bacteria (often carried on plasmids), not of the human host."
                )
            ]
        ),
        // Ch 15 (also mapped to Units 4, 5, 8, 9)
        BiologicalDebateScenario(
            id: "debate-ch15-trophic-biomagnification",
            chapterNumber: 15,
            schoolUnitNumber: 4,
            topicCode: "4.4",
            title: "Why Does Energy Shrink 90% Per Step While DDT Poison Multiplies?",
            mumbaiContextPrompt: "In Unit 4.2 & 4.4, Kym compares two pyramids for the same aquatic food chain (Algae → Zooplankton → Small Fish → Osprey): the Energy Pyramid gets 10× narrower at each step, yet the DDT Toxin Concentration Pyramid gets wider and deadlier at the top! Why?",
            choices: [
                BiologicalDebateChoice(
                    id: "ch15-aarav",
                    speakerName: "Aarav",
                    claim: "Water chemistry makes DDT multiply by cell division inside fish stomachs as it moves up the food chain.",
                    isCorrect: false,
                    socraticRebuttal: "DDT is a synthetic chemical molecule, not a living microbe—it cannot divide or reproduce! The total mass of DDT does not increase; its CONCENTRATION (ppm per kg of tissue) increases.",
                    invariantTakeaway: "Chemical toxins do not reproduce; their concentration rises because the biomass carrying them shrinks at each trophic level."
                ),
                BiologicalDebateChoice(
                    id: "ch15-zoya",
                    speakerName: "Zoya",
                    claim: "At each trophic step ~90% of food biomass/energy is respired away as heat and CO₂, but DDT is persistent (non-biodegradable) and fat-soluble (not excreted)—so one osprey inherits the combined DDT of thousands of fish into a much smaller body mass.",
                    isCorrect: true,
                    socraticRebuttal: "Masterful quantitative synthesis! Because energy/biomass shrinks by ~10× per step while persistent DDT stays trapped in lipid tissues, concentration = (fixed toxin ÷ shrinking biomass) magnifies at every predator tier.",
                    invariantTakeaway: "Bioaccumulation happens within one organism over time; biomagnification happens across trophic levels because biomass is respired while persistent toxins remain."
                ),
                BiologicalDebateChoice(
                    id: "ch15-kabir",
                    speakerName: "Kabir",
                    claim: "Food chain arrows point from the osprey down to the fish, pushing toxins toward the top predator.",
                    isCorrect: false,
                    socraticRebuttal: "Remember Unit 4.2: food chain arrows ALWAYS point from eaten to eater (Algae → Krill → Fish → Osprey), representing the direction of energy transfer.",
                    invariantTakeaway: "Arrows in food chains and webs always point in the direction of energy flow (producer → primary consumer → secondary consumer)."
                )
            ]
        )
    ]
}

// MARK: - Brilliant-Style Interactive Biological System Manipulative Sandboxes

public enum BioManipulativeKind: String, Codable, CaseIterable, Sendable {
    case fickGasExchangeDiffuser = "fick_gas_exchange_diffuser"
    case trophicEnergyAndBiomagnification = "trophic_energy_and_biomagnification"
    case metabolicNutrientAndLeverBalance = "metabolic_nutrient_and_lever_balance"

    public var title: String {
        switch self {
        case .fickGasExchangeDiffuser:
            return "Fick's Law Gas Exchange & Diffusion Sandbox"
        case .trophicEnergyAndBiomagnification:
            return "10% Trophic Energy & Biomagnification Sandbox"
        case .metabolicNutrientAndLeverBalance:
            return "Forearm Moment Lever & Metabolic Balance Sandbox"
        }
    }

    public var badgeLabel: String {
        switch self {
        case .fickGasExchangeDiffuser:
            return "Alveolar Surface Area × Gradient → O₂ Flux"
        case .trophicEnergyAndBiomagnification:
            return "Producer Energy × Transfer % → Predator Tier"
        case .metabolicNutrientAndLeverBalance:
            return "Biceps Lever Moment (F_in × d_in = F_out × d_out)"
        }
    }
}

public struct BioManipulativeSpec: Identifiable, Hashable, Sendable {
    public var id: String { "\(questionId)-\(kind.rawValue)" }
    public let questionId: String
    public let kind: BioManipulativeKind
    public let prompt: String
    public let primaryLabel: String
    public let primaryRange: ClosedRange<Double>
    public let primaryStep: Double
    public let defaultPrimary: Double
    public let primaryUnit: String
    public let secondaryLabel: String
    public let secondaryRange: ClosedRange<Double>
    public let secondaryStep: Double
    public let defaultSecondary: Double
    public let secondaryUnit: String
    public let targetInsight: String
}

public struct BioManipulativeState: Hashable, Sendable {
    public var primaryValue: Double
    public var secondaryValue: Double

    public init(primaryValue: Double, secondaryValue: Double) {
        self.primaryValue = primaryValue
        self.secondaryValue = secondaryValue
    }

    public func liveReadout(for spec: BioManipulativeSpec) -> String {
        switch spec.kind {
        case .fickGasExchangeDiffuser:
            // primary = Alveolar Area (m²), secondary = Concentration Gradient ΔP (mmHg)
            let fluxIndex = (primaryValue * secondaryValue) / 100.0
            let status = primaryValue < 35
                ? "Emphysema-like low surface area (\(Int(primaryValue)) m²) severely restricts O₂ diffusion."
                : "Healthy large surface area (\(Int(primaryValue)) m²) + steep gradient (\(Int(secondaryValue)) mmHg) drives rapid O₂ uptake."
            return String(
                format: "Alveolar Area = %.0f m² · Gradient ΔP = %.0f mmHg ⇒ Relative O₂ Diffusion Rate = %.1f units/min (%@)",
                primaryValue,
                secondaryValue,
                fluxIndex,
                status
            )
        case .trophicEnergyAndBiomagnification:
            // primary = Producer Energy (MJ), secondary = Transfer Efficiency (%)
            let eff = secondaryValue / 100.0
            let herbivore = primaryValue * eff
            let carnivore1 = herbivore * eff
            let topPredator = carnivore1 * eff
            let magnification = pow(1.0 / max(0.05, eff), 3.0)
            return String(
                format: "Producers: %.0f MJ → Herbivores: %.0f MJ → Secondary: %.1f MJ → Top Predator: %.2f MJ (at %.0f%% transfer) · Persistent Toxin Biomagnification ≈ ×%.0f",
                primaryValue,
                herbivore,
                carnivore1,
                topPredator,
                secondaryValue,
                magnification
            )
        case .metabolicNutrientAndLeverBalance:
            // primary = Hand Load Force (N), secondary = Load Distance from Elbow Pivot (cm), biceps insertion fixed at 4 cm
            let momentNm = primaryValue * (secondaryValue / 100.0)
            let bicepsForce = momentNm / 0.04
            let dailyMJ = 9.2 + (bicepsForce / 150.0) * 1.8
            return String(
                format: "Load = %.0f N at %.0f cm ⇒ Clockwise Moment = %.2f N m · Required Biceps Pull (at 4 cm pivot insertion) = %.0f N · Active Metabolic Budget ≈ %.1f MJ/day",
                primaryValue,
                secondaryValue,
                momentNm,
                bicepsForce,
                dailyMJ
            )
        }
    }
}

enum BioManipulativeEngine {
    static func spec(for question: SchoolScienceQuestion) -> BioManipulativeSpec {
        if question.unitNumber == 1 || question.topicCode.hasPrefix("1.") || question.topicCode == "7.3" {
            return BioManipulativeSpec(
                questionId: question.id,
                kind: .fickGasExchangeDiffuser,
                prompt: "Manipulate alveolar surface area and oxygen concentration gradient to test how structure governs gas exchange and aerobic respiration.",
                primaryLabel: "Active Alveolar Surface Area",
                primaryRange: 15...90,
                primaryStep: 5,
                defaultPrimary: 70,
                primaryUnit: "m²",
                secondaryLabel: "O₂ Concentration Gradient (ΔP)",
                secondaryRange: 20...100,
                secondaryStep: 5,
                defaultSecondary: 60,
                secondaryUnit: "mmHg",
                targetInsight: "Fick's Law invariant: Diffusion rate ∝ Surface Area × Concentration Gradient ÷ Wall Thickness (1 cell thick)."
            )
        } else if question.unitNumber == 4 || question.topicCode.hasPrefix("4.") {
            return BioManipulativeSpec(
                questionId: question.id,
                kind: .trophicEnergyAndBiomagnification,
                prompt: "Adjust producer biomass energy and trophic transfer efficiency to see why energy shrinks up a food chain while persistent toxins (DDT) biomagnify.",
                primaryLabel: "Producer Biomass Energy",
                primaryRange: 1000...10000,
                primaryStep: 500,
                defaultPrimary: 5000,
                primaryUnit: "MJ",
                secondaryLabel: "Trophic Energy Transfer",
                secondaryRange: 5...20,
                secondaryStep: 1,
                defaultSecondary: 10,
                secondaryUnit: "%",
                targetInsight: "90% of energy is lost as respiratory heat per trophic step, while non-biodegradable DDT stays fixed and concentrates in top predators."
            )
        } else {
            return BioManipulativeSpec(
                questionId: question.id,
                kind: .metabolicNutrientAndLeverBalance,
                prompt: "Test the forearm as a 3rd-class lever (elbow pivot, biceps attached at 4 cm) and observe how mechanical work links to cellular respiration energy needs.",
                primaryLabel: "Hand Load Weight",
                primaryRange: 4...24,
                primaryStep: 2,
                defaultPrimary: 12,
                primaryUnit: "N",
                secondaryLabel: "Load Distance from Elbow Pivot",
                secondaryRange: 16...40,
                secondaryStep: 2,
                defaultSecondary: 30,
                secondaryUnit: "cm",
                targetInsight: "Principle of Moments: F_biceps × 0.04 m = F_load × d_load. Because d_load ≫ 0.04 m, the biceps pulls with ~7.5×–10× the load force!"
            )
        }
    }
}

// MARK: - 6-Rung Metered Hint Ladder & Non-Leaking Faded Step Evaluator

public enum BioHintLadderRung: Int, Codable, CaseIterable, Identifiable, Sendable {
    case r0RestateGoal = 0
    case r1IdentifyMechanism = 1
    case r2CambridgeWatchout = 2
    case r3SubstepSkeleton = 3
    case r4PartialFill = 4
    case r5FullWorkedBridge = 5

    public var id: Int { rawValue }

    /// Rungs 0..2 are metacognitive/conceptual nudges that preserve independent proof credit;
    /// Rungs 3..5 reveal structural or worked steps and mark the attempt as assisted.
    public var preservesIndependentProof: Bool {
        rawValue <= 2
    }

    public var badgeTitle: String {
        switch self {
        case .r0RestateGoal: return "Hint 1 · What the Question Asks"
        case .r1IdentifyMechanism: return "Hint 2 · Key Biology Idea"
        case .r2CambridgeWatchout: return "Hint 3 · Exam Wording Tip"
        case .r3SubstepSkeleton: return "Step Guide · Sentence Starter (Assisted)"
        case .r4PartialFill: return "Step Guide · Key Terms (Assisted)"
        case .r5FullWorkedBridge: return "Step Guide · Full Model Answer (Assisted)"
        }
    }
}

enum BioMeteredHintLadderEngine {
    static func hintText(for rung: BioHintLadderRung, question: SchoolScienceQuestion) -> String {
        switch rung {
        case .r0RestateGoal:
            return "Command word '\(question.commandWord)' (\(question.marks) marks): you need \(question.marks) distinct causal or comparative points linked to Topic \(question.topicCode)."
        case .r1IdentifyMechanism:
            let bridge = PhenomenonToMechanismBridge.bridge(forChapter: question.linkedChapter)
            return "Underlying biological mechanism (Ch \(question.linkedChapter)): \(bridge.ahaMechanismInvariant)"
        case .r2CambridgeWatchout:
            return "Cambridge mark-scheme guardrail: use precise terminology (e.g., 'releases energy' not 'makes energy'; 'one cell thick' not 'thin cell wall'; 'denatured' not 'killed')."
        case .r3SubstepSkeleton:
            return "Scaffold template: \(question.fadedPrompt)"
        case .r4PartialFill:
            let kws = question.markSchemeKeywords.prefix(3).joined(separator: ", ")
            return "Anchor mark-scheme terms to weave into your reasoning: \(kws)."
        case .r5FullWorkedBridge:
            return question.workedExample
        }
    }
}

public struct BioFadedStepEvaluation: Equatable, Sendable {
    public let isComplete: Bool
    public let matchedSlotsCount: Int
    public let totalSlotsCount: Int
    public let socraticFeedback: String
}

public enum SocraticBioStepEvaluator {
    /// Evaluates Kym's faded-completion response without leaking the raw expected answer string.
    public static func evaluateFadedStep(
        learnerInput: String,
        expectedFadedAnswer: String,
        markSchemeKeywords: [String]
    ) -> BioFadedStepEvaluation {
        let normalizedInput = learnerInput.lowercased()
        let rawSlots = expectedFadedAnswer
            .split(separator: ";")
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() }
            .filter { !$0.isEmpty }

        guard !rawSlots.isEmpty else {
            return BioFadedStepEvaluation(
                isComplete: !normalizedInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
                matchedSlotsCount: 1,
                totalSlotsCount: 1,
                socraticFeedback: "Step recorded. Proceed to the Independent Proof stage."
            )
        }

        var matched = 0
        var firstMissingSlotIndex: Int? = nil

        for (idx, slot) in rawSlots.enumerated() {
            // Support slash-separated acceptable synonyms like "brick-red/orange" or "predators/herbivores"
            let alternatives = slot
                .split(separator: "/")
                .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
                .filter { !$0.isEmpty }
            let slotHit = alternatives.contains { alt in
                normalizedInput.contains(alt)
            }
            if slotHit {
                matched += 1
            } else if firstMissingSlotIndex == nil {
                firstMissingSlotIndex = idx + 1
            }
        }

        let isComplete = matched == rawSlots.count
        if isComplete {
            return BioFadedStepEvaluation(
                isComplete: true,
                matchedSlotsCount: matched,
                totalSlotsCount: rawSlots.count,
                socraticFeedback: "All \(rawSlots.count) faded slots verified with exact Cambridge scientific terms! You are ready for Stage 3 (Independent Proof)."
            )
        } else {
            let missingBlankNum = firstMissingSlotIndex ?? (matched + 1)
            let conceptualHint: String = {
                if let kw = markSchemeKeywords.first(where: { !normalizedInput.contains($0.lowercased()) }) {
                    let firstLetter = kw.prefix(1).uppercased()
                    return "Check Blank #\(missingBlankNum): think of the biological term starting with '\(firstLetter)…' (\(kw.count) letters)."
                }
                return "Check Blank #\(missingBlankNum): re-read the sentence around that blank and match the biological structure or process."
            }()
            return BioFadedStepEvaluation(
                isComplete: false,
                matchedSlotsCount: matched,
                totalSlotsCount: rawSlots.count,
                socraticFeedback: "Matched \(matched) of \(rawSlots.count) blanks. \(conceptualHint)"
            )
        }
    }
}

// MARK: - SmartyMe-Style 15-Minute Daily Flow Composer

public enum DailyFlowStageKind: Int, Codable, CaseIterable, Identifiable, Sendable {
    case memoryLock = 0
    case conceptDiscoveryBeat = 1
    case misconceptionAndTrapCheck = 2
    case schoolQuestionProof = 3

    public var id: Int { rawValue }

    public var title: String {
        switch self {
        case .memoryLock:
            return "1. Quick Recall"
        case .conceptDiscoveryBeat:
            return "2. Core Idea"
        case .misconceptionAndTrapCheck:
            return "3. Who Is Right?"
        case .schoolQuestionProof:
            return "4. Practice Question"
        }
    }

    public var allocatedMinutes: Int {
        switch self {
        case .memoryLock: return 3
        case .conceptDiscoveryBeat: return 4
        case .misconceptionAndTrapCheck: return 4
        case .schoolQuestionProof: return 4
        }
    }

    public var systemImage: String {
        switch self {
        case .memoryLock: return "brain.head.profile"
        case .conceptDiscoveryBeat: return "Waveform.and.magnifyingglass".lowercased() == "waveform.and.magnifyingglass" ? "sparkles" : "sparkles"
        case .misconceptionAndTrapCheck: return "bubble.left.and.bubble.right.fill"
        case .schoolQuestionProof: return "checkmark.seal.fill"
        }
    }
}

struct DailyFlowSessionPlan: Sendable {
    let dueCards: [FSRSCardRecord]
    let isWarmupReview: Bool
    let chapter: LivingWorldChapter
    let discoveryBeat: ChapterInteractiveBeat
    let bridge: PhenomenonToMechanismBridge
    let debate: BiologicalDebateScenario
    let quantitativeProblem: QuantitativeBioProblem
    let targetQuestion: SchoolScienceQuestion

    var totalMinutes: Int {
        DailyFlowStageKind.allCases.map(\.allocatedMinutes).reduce(0, +)
    }
}

enum DailyFlowSessionEngine {
    static func buildPlan(
        pack: KymBioSeedPack,
        fsrsCards: [FSRSCardRecord],
        proofs: [String: QuestionProofRecord],
        preferredChapterNumber: Int,
        now: Date = Date()
    ) -> DailyFlowSessionPlan {
        let strictlyDue = fsrsCards
            .filter { $0.dueAt <= now }
            .sorted { $0.dueAt < $1.dueAt }

        let selectedCards: [FSRSCardRecord]
        let isWarmup: Bool
        if !strictlyDue.isEmpty {
            selectedCards = Array(strictlyDue.prefix(3))
            isWarmup = false
        } else {
            selectedCards = Array(fsrsCards.sorted { $0.stability < $1.stability }.prefix(2))
            isWarmup = true
        }

        let chapter = pack.chapters.first(where: { $0.number == preferredChapterNumber })
            ?? pack.chapters.first(where: { $0.number == 6 })
            ?? pack.chapters[0]

        let beats = ChapterInteractiveBeatEngine.beats(for: chapter)
        let discoveryBeat = beats.first(where: { $0.kind == .everydayHook }) ?? beats[0]
        let bridge = PhenomenonToMechanismBridge.bridge(forChapter: chapter.number)
        let debate = BiologicalDebateCatalog.scenario(forChapter: chapter.number)

        let quantProblem = QuantitativeBioEngine.problems(forChapter: chapter.number).first
            ?? QuantitativeBioEngine.allProblems[0]

        let unprovenQuestions = pack.schoolQuestions.filter { q in
            !(proofs[q.id]?.level.isIndependentProof ?? false)
        }
        let targetQuestion = unprovenQuestions.first(where: { $0.linkedChapter == chapter.number })
            ?? unprovenQuestions.first
            ?? pack.schoolQuestions[0]

        return DailyFlowSessionPlan(
            dueCards: selectedCards,
            isWarmupReview: isWarmup,
            chapter: chapter,
            discoveryBeat: discoveryBeat,
            bridge: bridge,
            debate: debate,
            quantitativeProblem: quantProblem,
            targetQuestion: targetQuestion
        )
    }
}

// MARK: - 16-Chapter Mnemonic Flashcards, 4-Rung End-of-Chapter Synthesis Q&A & 5-Question Quick Quiz Engine

public enum ChapterFlashcardStudyMode: String, CaseIterable, Identifiable, Sendable {
    case forward = "forward"
    case reverse = "reverse"
    case clozeStage1 = "cloze_1"
    case clozeStage2 = "cloze_2"

    public var id: String { rawValue }

    public var title: String {
        switch self {
        case .forward: return "Prompt → Mechanism"
        case .reverse: return "Reverse: Clue → Concept"
        case .clozeStage1: return "Cloze Fading (Stage 1)"
        case .clozeStage2: return "Cold Cloze (Stage 2)"
        }
    }
}

public struct ChapterAtomicFlashcard: Identifiable, Codable, Equatable, Sendable {
    public let id: String
    public let chapterNumber: Int
    public let topicCode: String
    public let conceptTitle: String
    public let frontPrompt: String
    public let backAnswer: String
    public let reversePrompt: String
    public let keyTerms: [String]
}

public struct FlashcardDraftEvaluation: Equatable, Sendable {
    public let matchedKeyTerms: [String]
    public let missingKeyTerms: [String]
    public let combinedScore: Double
    public let isPass: Bool
    public let quadrant: ConfidenceVerdictQuadrant
    public let feedbackSummary: String
}

public struct ChapterEndSynthesisQuestion: Identifiable, Codable, Equatable, Sendable {
    public let id: String
    public let chapterNumber: Int
    public let rungNumber: Int
    public let rungTitle: String
    public let marks: Int
    public let prompt: String
    public let keywords: [String]
    public let modelAnswer: String
    public let transferTwinTitle: String?
    public let transferTwinPrompt: String?
    public let transferTwinAnswer: String?
}

public struct ChapterQuickQuizItem: Identifiable, Codable, Equatable, Sendable {
    public let id: String
    public let chapterNumber: Int
    public let badgeTitle: String
    public let prompt: String
    public let options: [String]
    public let correctIndex: Int
    public let diagnosticExplanation: String
}

public enum ChapterFlashcardAndSynthesisCatalog {
    public static let atomicFlashcards: [ChapterAtomicFlashcard] = [
        ChapterAtomicFlashcard(
            id: "card-ch00-resolution",
            chapterNumber: 0,
            topicCode: "0.1",
            conceptTitle: "Abbe diffraction limit & empty magnification",
            frontPrompt: "Why does visible-light microscopy hit a resolution ceiling near ~200 nm (d = 0.61 λ / NA) regardless of how much further you enlarge the image?",
            backAnswer: "Visible light wavelengths (400–700 nm) diffract around microscopic apertures; when two points sit closer than ~200 nm, their Airy diffraction discs blur together (empty magnification). Electron microscopes use shorter de Broglie electron wavelengths to resolve ~0.2 nm.",
            reversePrompt: "Name the optical principle (d = 0.61 λ / NA) explaining why enlarging a light-microscope image past ×1,500 produces a bigger blur rather than resolving 25 nm ribosomes.",
            keyTerms: ["200 nm", "wavelengths", "diffraction", "magnification", "electron"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch01-coupled-atp",
            chapterNumber: 1,
            topicCode: "1.4",
            conceptTitle: "Coupled ATP bioenergetics vs. uncoupled flame combustion",
            frontPrompt: "Both a candle flame and a germinating moong seed oxidise carbon fuel with oxygen. How does a living cell avoid releasing 100% of glucose's free energy (-2,870 kJ/mol) as uncoupled heat?",
            backAnswer: "Enzymes break down glucose across many coupled steps at 37 °C, capturing ~34% of the standard free energy by phosphorylating ADP + Pi into ~30–32 ATP molecules.",
            reversePrompt: "Name the nucleotide free-energy carrier recharged ~800 times a day that couples exergonic glucose oxidation to endergonic cellular work.",
            keyTerms: ["Enzymes", "glucose", "coupled", "ADP", "ATP"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch02-sav-ratio",
            chapterNumber: 2,
            topicCode: "1.2",
            conceptTitle: "Surface-area-to-volume ratio (SA/V = 6/L)",
            frontPrompt: "When a cubic cell's width L increases 10-fold, how do its surface area (6L²), volume (L³), and SA/V ratio change, and what constraint does this impose?",
            backAnswer: "Surface area increases 100-fold (10²) while metabolising volume increases 1,000-fold (10³), so SA/V drops to one-tenth (6/L) and diffusion time to the centre (τ ≈ L²/2D) rises 100-fold, requiring folded surfaces.",
            reversePrompt: "Name the geometric scaling ratio (6/L for a cube) that explains why large organisms are built of millions of microscopic cells and folded exchange surfaces.",
            keyTerms: ["Surface area", "volume", "one-tenth", "diffusion", "folded"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch03-turgor-plasmolysis",
            chapterNumber: 3,
            topicCode: "3.2",
            conceptTitle: "Turgor pressure vs. plasmolysis in plant cells",
            frontPrompt: "Contrast what happens to a human red blood cell and a walled plant cell when immersed in pure distilled water (high water potential).",
            backAnswer: "Water enters both by osmosis down the water-potential gradient. The red blood cell lacks a cell wall so it swells and bursts (lyses); the plant cell's inelastic cellulose wall builds opposing turgor pressure until the cell is firm (turgid) and net inflow stops.",
            reversePrompt: "Name the pressure built against an inelastic plant cell wall when water enters the vacuole by osmosis from a dilute solution.",
            keyTerms: ["osmosis", "water potential", "cell wall", "turgor", "turgid", "burst"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch04-enzyme-denaturation",
            chapterNumber: 4,
            topicCode: "7.1",
            conceptTitle: "Enzyme active-site complementarity & thermal denaturation",
            frontPrompt: "Why does heating an enzyme above 60 °C permanently abolish its catalytic rate, and why must you never write that the enzyme 'dies'?",
            backAnswer: "Enzymes are folded protein catalysts, not living cells. Excessive thermal vibration breaks intramolecular hydrogen and ionic bonds, irreversibly unfolding the 3D active site (denaturation) so the substrate is no longer complementary.",
            reversePrompt: "Name the irreversible structural change to an enzyme's 3D active site caused by extreme heat or pH breaking intramolecular bonds.",
            keyTerms: ["catalysts", "protein", "active site", "complementary", "bonds", "denaturation"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch05-photolysis-limiting",
            chapterNumber: 5,
            topicCode: "4.1",
            conceptTitle: "Water photolysis & Blackman's limiting factors in photosynthesis",
            frontPrompt: "Where does the oxygen gas (O₂) released during photosynthesis originate, and what does Blackman's Law of Limiting Factors state?",
            backAnswer: "All evolved O₂ comes from the light-driven splitting (photolysis) of water (2H₂O -> O₂ + 4H⁺ + 4e⁻) at Photosystem II in chloroplasts, while carbon mass comes from atmospheric CO₂. Blackman's Law states that the rate is governed by whichever required factor (light, CO₂, or temperature) is in shortest supply.",
            reversePrompt: "Name the light-driven reaction at Photosystem II in thylakoid membranes that splits water molecules and releases oxygen gas.",
            keyTerms: ["water", "photolysis", "chloroplasts", "Photosystem", "shortest supply"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch06-chemiosmosis-anaerobic",
            chapterNumber: 6,
            topicCode: "1.4",
            conceptTitle: "Mitochondrial chemiosmosis & human vs. yeast anaerobic pathways",
            frontPrompt: "How does the mitochondrial proton gradient drive ATP synthesis (~30–32 ATP/glucose), and how does anaerobic respiration differ between human muscle and yeast?",
            backAnswer: "Inside mitochondria, the inner-membrane electron transport chain pumps protons into the intermembrane space; protons flowing back spin rotary ATP synthase. Anaerobically (2 ATP/glucose), human muscle converts glucose to lactic acid (building an oxygen debt with no CO₂), whereas yeast ferments glucose to ethanol + carbon dioxide.",
            reversePrompt: "Name the anaerobic product formed in human skeletal muscle during vigorous sprinting that builds an oxygen debt without releasing CO₂.",
            keyTerms: ["mitochondria", "protons", "ATP synthase", "lactic acid", "oxygen debt", "ethanol"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch07-emulsification-villi",
            chapterNumber: 7,
            topicCode: "7.1",
            conceptTitle: "Bile emulsification, digestive hydrolases & villus absorption",
            frontPrompt: "Why is bile NOT an enzyme, how does it accelerate lipid digestion, and how are small-intestine villi adapted for monomer absorption?",
            backAnswer: "Bile (made in the liver, stored in the gall bladder) contains bile salts that physically emulsify fat globules into tiny droplets to increase surface area for pancreatic lipase. Villi and microvilli provide a ~30 m² surface area with a one-cell-thick epithelium over capillaries and lacteals.",
            reversePrompt: "Name the physical process by which liver bile salts break large lipid globules into micro-droplets to expand the surface area for pancreatic lipase.",
            keyTerms: ["liver", "emulsify", "surface area", "lipase", "villi", "one cell thick"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch08-double-pump-harvey",
            chapterNumber: 8,
            topicCode: "1.5",
            conceptTitle: "Harvey's closed loop & the mammalian four-chambered double pump",
            frontPrompt: "Why does a mammal need a four-chambered double circulation with a thicker left ventricle, and why does blood flow slowest in capillaries despite their tiny diameter?",
            backAnswer: "Lung capillaries drop blood pressure; returning oxygenated blood to the thick left ventricle re-pressurises it (~120 mmHg) for systemic flow while keeping right-ventricular pulmonary pressure low (~25 mmHg). Blood slows in capillaries because billions in parallel create a huge total cross-sectional area (v = Q / A_total).",
            reversePrompt: "Name the continuity relationship (v = Q / A_total) explaining why blood slows to ~0.5 mm/s inside the capillary bed to allow gas and nutrient diffusion.",
            keyTerms: ["pressure", "left ventricle", "pulmonary", "cross-sectional area", "capillaries"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch09-synapse-accommodation",
            chapterNumber: 9,
            topicCode: "7.4",
            conceptTitle: "Unidirectional chemical synapses, eye accommodation & auxin phototropism",
            frontPrompt: "Why can impulses cross a chemical synapse in one direction only, and how do the ciliary muscle and suspensory ligaments adjust to focus on a near book?",
            backAnswer: "Synaptic vesicles release neurotransmitter only from the pre-synaptic terminal and receptors sit only on the post-synaptic membrane. For near focus, the circular ciliary muscle contracts inward, slackening suspensory ligaments so the elastic lens springs into a thicker, more convex shape.",
            reversePrompt: "Name the plant hormone that accumulates on the shaded side of a shoot tip and stimulates faster cell elongation to bend the stem towards light.",
            keyTerms: ["vesicles", "neurotransmitter", "receptors", "ciliary muscle", "slackening", "convex"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch10-nephron-homeostasis",
            chapterNumber: 10,
            topicCode: "1.1",
            conceptTitle: "Glomerular ultrafiltration, selective reabsorption & negative feedback",
            frontPrompt: "How do the kidney glomerulus and proximal convoluted tubule separate waste urea from essential glucose, and how do insulin and glucagon regulate blood glucose?",
            backAnswer: "High hydrostatic pressure drives ultrafiltration of water, glucose, ions, and urea into Bowman's capsule; the proximal tubule actively reabsorbs 100% of glucose via SGLT cotransporters while leaving urea in urine. Insulin lowers blood glucose into liver glycogen; glucagon restores blood glucose from glycogen.",
            reversePrompt: "Name the two-step nephron mechanism that filters 180 L/day of plasma at the glomerulus and rescues 100% of filtered glucose in the proximal tubule.",
            keyTerms: ["ultrafiltration", "proximal tubule", "reabsorbs", "glucose", "urea", "insulin", "glucagon"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch11-dna-central-dogma",
            chapterNumber: 11,
            topicCode: "11.1",
            conceptTitle: "Semi-conservative DNA replication, Chargaff rules & Central Dogma",
            frontPrompt: "State Chargaff's complementary base-pairing rules, explain semi-conservative replication, and trace the sickle-cell mutation from DNA triplet to red blood cell.",
            backAnswer: "Adenine pairs with Thymine (2 H-bonds; %A = %T) and Guanine pairs with Cytosine (3 H-bonds; %G = %C). Each daughter DNA duplex keeps one parent template strand and one new strand. In sickle-cell (GAG -> GTG), mRNA GUG translates to hydrophobic Valine instead of Glutamate, causing deoxy-HbS fibres to polymerise.",
            reversePrompt: "Name the replication model proved by Meselson and Stahl's 15N/14N density experiment in which each daughter DNA helix retains one parental strand.",
            keyTerms: ["Adenine", "Thymine", "Guanine", "Cytosine", "template", "Valine"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch12-mitosis-meiosis",
            chapterNumber: 12,
            topicCode: "12.1",
            conceptTitle: "Mitosis (2n -> 2n) vs. Meiosis (2n -> n) & genomic equivalence",
            frontPrompt: "Contrast the daughter cells of human mitosis and meiosis, and explain why a liver cell and a retina neuron differ in shape despite having identical DNA.",
            backAnswer: "Mitosis separates sister chromatids once to yield 2 genetically identical diploid cells (2n = 46) for growth/repair. Meiosis pairs and separates homologous chromosomes (Meiosis I, with crossing over) then sister chromatids (Meiosis II) to yield 4 unique haploid gametes (n = 23). Somatic cells differ by differential gene expression.",
            reversePrompt: "Name the principle stating that every nucleated somatic cell in your body carries the complete diploid genome, differing only in which genes are transcribed.",
            keyTerms: ["diploid", "haploid", "homologous", "crossing over", "sister chromatids", "gene expression"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch13-mendel-punnett",
            chapterNumber: 13,
            topicCode: "13.1",
            conceptTitle: "Mendelian segregation (3:1), conditional carrier probability & X-linkage",
            frontPrompt: "When two heterozygous carriers (Cc × Cc) have a healthy, unaffected child, why is the probability that this healthy child is a carrier 2/3 (66.7%) rather than 1/2?",
            backAnswer: "A Cc × Cc Punnett square produces 1 CC : 2 Cc : 1 cc. Knowing the child is unaffected rules out cc, leaving 3 equally likely genotypes (1 CC and 2 Cc), so 2 out of 3 (66.7%) unaffected offspring are heterozygous carriers.",
            reversePrompt: "State the conditional probability that an unaffected child of two autosomal-recessive carrier parents (Cc × Cc) is a heterozygous carrier (Cc).",
            keyTerms: ["Punnett", "unaffected", "genotypes", "heterozygous", "carriers"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch14-selection-hardy-weinberg",
            chapterNumber: 14,
            topicCode: "14.1",
            conceptTitle: "Random pre-existing mutation, non-random selection & Hardy–Weinberg",
            frontPrompt: "Why is it wrong to say bacteria 'mutate in order to resist an antibiotic', and how do you calculate carrier frequency 2pq when q² = 0.09?",
            backAnswer: "Mutations arise randomly from replication errors before antibiotic exposure; the antibiotic acts as a selection pressure that kills susceptible cells and selects for pre-existing resistant mutants, shifting population allele frequency across generations. When q² = 0.09, q = 0.30 and p = 0.70, so heterozygous carrier frequency 2pq = 0.42 (42%).",
            reversePrompt: "Calculate the heterozygous carrier frequency (2pq) in a Hardy–Weinberg population where 9% of individuals show the recessive phenotype (q² = 0.09).",
            keyTerms: ["randomly", "pre-existing", "selection pressure", "allele frequency", "0.42", "population"]
        ),
        ChapterAtomicFlashcard(
            id: "card-ch15-trophic-biomagnification",
            chapterNumber: 15,
            topicCode: "4.4",
            conceptTitle: "10% trophic energy pyramid, eutrophication & biomagnification",
            frontPrompt: "Why does energy flow one-way (~10% per trophic step) while matter cycles, and what is the difference between bioaccumulation and biomagnification?",
            backAnswer: "At each trophic step ~90% of energy dissipates as metabolic heat via cellular respiration (Second Law of Thermodynamics), whereas decomposers recycle C and N atoms. Bioaccumulation is persistent toxin build-up within one organism over time; biomagnification is toxin concentration multiplying up trophic levels.",
            reversePrompt: "Distinguish toxin build-up within a single organism over its lifetime from increasing toxin concentration across successive trophic levels of a food chain.",
            keyTerms: ["90%", "respiration", "heat", "decomposers", "bioaccumulation", "biomagnification"]
        ),
    ]

    static func atomicCard(for card: FSRSCardRecord) -> ChapterAtomicFlashcard? {
        if let direct = atomicFlashcards.first(where: { $0.id == card.id }) {
            return direct
        }
        return atomicFlashcards.first(where: { $0.chapterNumber == card.chapterNumber })
    }

    static func keyTerms(for card: FSRSCardRecord) -> [String] {
        if let atomic = atomicFlashcards.first(where: { $0.id == card.id }) {
            return atomic.keyTerms
        }
        let tokens = card.backAnswer
            .components(separatedBy: CharacterSet.alphanumerics.inverted)
            .filter { $0.count >= 5 }
        var seen: Set<String> = []
        var result: [String] = []
        for tok in tokens {
            let low = tok.lowercased()
            if !seen.contains(low) {
                seen.insert(low)
                result.append(tok)
            }
            if result.count >= 6 { break }
        }
        return result
    }

    static func prompt(for card: FSRSCardRecord, mode: ChapterFlashcardStudyMode) -> String {
        switch mode {
        case .forward:
            return card.frontPrompt
        case .reverse:
            if let atomic = atomicFlashcards.first(where: { $0.id == card.id }) {
                return atomic.reversePrompt
            }
            let cloze = BioProgressiveDeletionComposer.render(
                text: card.backAnswer,
                keyTerms: keyTerms(for: card),
                stage: 2
            )
            return "Reverse Recall (Topic \(card.topicCode) · Ch \(card.chapterNumber)) — Identify the mechanism or question answered by:\n“\(cloze)”"
        case .clozeStage1:
            let cloze = BioProgressiveDeletionComposer.render(
                text: card.backAnswer,
                keyTerms: keyTerms(for: card),
                stage: 2
            )
            return "\(card.frontPrompt)\n\nFill in the masked key terms:\n\(cloze)"
        case .clozeStage2:
            let cloze = BioProgressiveDeletionComposer.render(
                text: card.backAnswer,
                keyTerms: keyTerms(for: card),
                stage: 4
            )
            return "\(card.frontPrompt)\n\nCold Cloze Recall:\n\(cloze)"
        }
    }

    static func evaluateDraft(
        for card: FSRSCardRecord,
        draftAnswer: String,
        confidence: LearnerConfidenceStop?
    ) -> FlashcardDraftEvaluation {
        let terms = keyTerms(for: card)
        let eval = AnswerComparison.evaluateRecall(
            spoken: draftAnswer,
            expected: card.backAnswer,
            keyTerms: terms
        )
        let ratio = terms.isEmpty ? eval.combinedScore : Double(eval.matchedKeyTerms.count) / Double(terms.count)
        let isPass = ratio >= 0.60 || eval.combinedScore >= 0.65
        let isDontKnow = draftAnswer.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && (confidence == .zero)
        let quadrant = ConfidenceVerdictQuadrant.compute(
            isPass: isPass,
            confidence: confidence,
            isDontKnow: isDontKnow
        )
        return FlashcardDraftEvaluation(
            matchedKeyTerms: eval.matchedKeyTerms,
            missingKeyTerms: eval.missingKeyTerms,
            combinedScore: eval.combinedScore,
            isPass: isPass,
            quadrant: quadrant,
            feedbackSummary: eval.feedbackSummary
        )
    }

    public static func endOfChapterQuestions(forChapter chapterNumber: Int) -> [ChapterEndSynthesisQuestion] {
        let ch = max(0, min(15, chapterNumber))
        let bridge = PhenomenonToMechanismBridge.bridge(forChapter: ch)
        let quant = QuantitativeBioEngine.problems(forChapter: ch).first ?? QuantitativeBioEngine.allProblems[ch % QuantitativeBioEngine.allProblems.count]
        let debate = BiologicalDebateCatalog.scenario(forChapter: ch)
        let atomic = atomicFlashcards.first(where: { $0.chapterNumber == ch }) ?? atomicFlashcards[0]
        let correctChoice = debate.choices.first(where: \.isCorrect) ?? debate.choices[0]
        let trapChoice = debate.choices.first(where: { !$0.isCorrect }) ?? debate.choices[0]

        return [
            ChapterEndSynthesisQuestion(
                id: "ch\(String(format: "%02d", ch))-eoc-r1",
                chapterNumber: ch,
                rungNumber: 1,
                rungTitle: "1 · Mechanism Explain-Back",
                marks: 2,
                prompt: atomic.frontPrompt,
                keywords: Array(atomic.keyTerms.prefix(4)),
                modelAnswer: atomic.backAnswer,
                transferTwinTitle: nil,
                transferTwinPrompt: nil,
                transferTwinAnswer: nil
            ),
            ChapterEndSynthesisQuestion(
                id: "ch\(String(format: "%02d", ch))-eoc-r2",
                chapterNumber: ch,
                rungNumber: 2,
                rungTitle: "2 · Quantitative & Unit Check",
                marks: 3,
                prompt: "\(quant.prompt) (Formula: \(quant.formulaDisplay); state your answer in \(quant.expectedUnit)).",
                keywords: [String(format: "%g", quant.expectedNumericValue), quant.expectedUnit],
                modelAnswer: "Using \(quant.formulaDisplay), the result is \(String(format: "%g", quant.expectedNumericValue)) \(quant.expectedUnit). Watch out for common unit slips: \(quant.traps.first?.diagnosticWhy ?? "always convert units before dividing.")",
                transferTwinTitle: nil,
                transferTwinPrompt: nil,
                transferTwinAnswer: nil
            ),
            ChapterEndSynthesisQuestion(
                id: "ch\(String(format: "%02d", ch))-eoc-r3",
                chapterNumber: ch,
                rungNumber: 3,
                rungTitle: "3 · Misconception Autopsy",
                marks: 3,
                prompt: "Spot & repair the flaw in this claim: “\(trapChoice.claim)”",
                keywords: Array(atomic.keyTerms.suffix(3)),
                modelAnswer: "\(trapChoice.socraticRebuttal) Correct mechanism: \(correctChoice.claim) (\(correctChoice.invariantTakeaway))",
                transferTwinTitle: nil,
                transferTwinPrompt: nil,
                transferTwinAnswer: nil
            ),
            ChapterEndSynthesisQuestion(
                id: "ch\(String(format: "%02d", ch))-eoc-r4",
                chapterNumber: ch,
                rungNumber: 4,
                rungTitle: "4 · Cross-Chapter & Exam Synthesis",
                marks: 4,
                prompt: "Connect the everyday observation (“\(bridge.observablePhenomenon)”) to the intracellular mechanism (“\(bridge.ahaMechanismInvariant)”) and state the governing biological rule.",
                keywords: bridge.termMappings.map(\.symbolOrTerm),
                modelAnswer: "\(bridge.ahaMechanismInvariant) (\(bridge.principleOrEquationDisplay)). Key causal chain: \(bridge.termMappings.map { "\($0.symbolOrTerm) (\($0.biologicalMeaning))" }.joined(separator: " -> ")).",
                transferTwinTitle: "New Scenario · Perturbation Probe on Chapter \(ch)",
                transferTwinPrompt: bridge.perturbationPrompt(for: bridge.termMappings[0]),
                transferTwinAnswer: bridge.perturbationExplanation(for: bridge.termMappings[0])
            ),
        ]
    }

    public static func quickQuiz(forChapter chapterNumber: Int) -> [ChapterQuickQuizItem] {
        let ch = max(0, min(15, chapterNumber))
        let debate = BiologicalDebateCatalog.scenario(forChapter: ch)
        let quant = QuantitativeBioEngine.problems(forChapter: ch).first ?? QuantitativeBioEngine.allProblems[ch % QuantitativeBioEngine.allProblems.count]
        let atomic = atomicFlashcards.first(where: { $0.chapterNumber == ch }) ?? atomicFlashcards[0]
        let prevCh = ch > 0 ? ch - 1 : 15
        let prevAtomic = atomicFlashcards.first(where: { $0.chapterNumber == prevCh }) ?? atomicFlashcards[0]
        let bridge = PhenomenonToMechanismBridge.bridge(forChapter: ch)

        let debateOpts = debate.choices.map { "\($0.speakerName): \($0.claim)" }
        let debateCorrectIdx = debate.choices.firstIndex(where: \.isCorrect) ?? 0
        let correctChoice = debate.choices[debateCorrectIdx]

        let trap0 = quant.traps.first
        let trap1 = quant.traps.dropFirst().first
        let quantOpts = [
            "\(String(format: "%g", quant.expectedNumericValue)) \(quant.expectedUnit) — applying \(quant.formulaDisplay) with consistent units.",
            "\(String(format: "%g", trap0?.buggyValue ?? (quant.expectedNumericValue * 10))) \(quant.expectedUnit) — \(trap0?.trapName ?? "unit conversion slip").",
            "\(String(format: "%g", trap1?.buggyValue ?? (quant.expectedNumericValue * 0.5))) \(quant.expectedUnit) — \(trap1?.trapName ?? "inverted ratio trap").",
        ]

        return [
            ChapterQuickQuizItem(
                id: "qq-ch\(ch)-1-debate",
                chapterNumber: ch,
                badgeTitle: "1 · Misconception Hinge",
                prompt: debate.mumbaiContextPrompt,
                options: debateOpts,
                correctIndex: debateCorrectIdx,
                diagnosticExplanation: "\(correctChoice.socraticRebuttal) Takeaway: \(correctChoice.invariantTakeaway)"
            ),
            ChapterQuickQuizItem(
                id: "qq-ch\(ch)-2-quant",
                chapterNumber: ch,
                badgeTitle: "2 · Quantitative & Unit Check",
                prompt: quant.prompt,
                options: quantOpts,
                correctIndex: 0,
                diagnosticExplanation: "Correct calculation: \(String(format: "%g", quant.expectedNumericValue)) \(quant.expectedUnit) via \(quant.formulaDisplay)."
            ),
            ChapterQuickQuizItem(
                id: "qq-ch\(ch)-3-reverse",
                chapterNumber: ch,
                badgeTitle: "3 · Reverse Concept Recall",
                prompt: atomic.reversePrompt,
                options: [
                    "\(atomic.conceptTitle) — \(atomic.backAnswer)",
                    "Passive equilibrium without energy coupling, membrane selectivity, or structural specificity.",
                    "A vitalist force operating independently of molecular collisions, gradients, or enzyme active sites.",
                ],
                correctIndex: 0,
                diagnosticExplanation: atomic.backAnswer
            ),
            ChapterQuickQuizItem(
                id: "qq-ch\(ch)-4-perturbation",
                chapterNumber: ch,
                badgeTitle: "4 · Counterfactual Perturbation",
                prompt: bridge.perturbationPrompt(for: bridge.termMappings[0]),
                options: [
                    bridge.perturbationExplanation(for: bridge.termMappings[0]),
                    "The biological system continues at 100% normal rate because adjacent organs compensate without cost.",
                    "Only external appearance changes while intracellular flux and ATP turnover remain unaffected.",
                ],
                correctIndex: 0,
                diagnosticExplanation: bridge.perturbationExplanation(for: bridge.termMappings[0])
            ),
            ChapterQuickQuizItem(
                id: "qq-ch\(ch)-5-lagged",
                chapterNumber: ch,
                badgeTitle: "5 · Spaced Recall from Chapter \(prevCh)",
                prompt: "[Spaced Retrieval · Ch \(prevCh)] \(prevAtomic.frontPrompt)",
                options: [
                    prevAtomic.backAnswer,
                    "The process runs backward spontaneously at room temperature without enzymes or gradients.",
                    "Macroscopic tissue size alone determines the outcome regardless of molecular structure.",
                ],
                correctIndex: 0,
                diagnosticExplanation: "Spaced retrieval from Chapter \(prevCh) (\(prevAtomic.conceptTitle)): \(prevAtomic.backAnswer)"
            ),
        ]
    }
}
