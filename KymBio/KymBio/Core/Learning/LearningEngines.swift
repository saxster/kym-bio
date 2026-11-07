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
        case .solidMastery: return "Solid Mastery"
        case .fragileGuess: return "Fragile Guess — Needs Reinforcement"
        case .honestGap: return "Honest Gap — Clean Slate"
        case .committedMisconception: return "High-Priority Misconception"
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
            transferContextTitle: "Fresh Transfer Context · Topic \(question.topicCode)",
            prompt: "[Transfer Twin — Fresh Organism/Setup] Apply the exact same mechanism from Topic \(question.topicCode) to a new laboratory observation: \(question.prompt)",
            markSchemeKeywords: question.markSchemeKeywords,
            modelAnswer: question.modelAnswer
        )
    }

    private static let curatedTwins: [String: SchoolScienceTransferTwin] = [
        "q-u1-1.1-lb": SchoolScienceTransferTwin(
            id: "q-u1-1.1-lb-twin",
            parentQuestionId: "q-u1-1.1-lb",
            transferContextTitle: "Transfer Twin · Dusty Marathon Runner Airways",
            prompt: "During a dusty cross-country run in Mumbai, an athlete inhales air through the nose. Trace the path of an oxygen molecule to an alveolus and explain how cartilage in the trachea and cilia + mucus in the bronchi protect the lungs during heavy breathing.",
            markSchemeKeywords: ["trachea", "bronchus", "bronchiole", "cartilage", "collapse", "mucus", "cilia"],
            modelAnswer: "Air travels down the trachea, into a bronchus, through smaller bronchioles to an alveolus. C-shaped rings of cartilage support the trachea so it does not collapse when air pressure drops during deep inhalation. Goblet cells secrete sticky mucus that traps dust and bacteria, and cilia beat rhythmically to sweep the mucus up to the throat."
        ),
        "q-u1-1.2-wb": SchoolScienceTransferTwin(
            id: "q-u1-1.2-wb-twin",
            parentQuestionId: "q-u1-1.2-wb",
            transferContextTitle: "Transfer Twin · High-Altitude Mountain Goose Alveoli",
            prompt: "A bar-headed goose flying over the Himalayas relies on rapid gas exchange in its lungs. Explain three structural adaptations of an alveolus and its surrounding blood supply that maximise the rate of oxygen diffusion into the blood.",
            markSchemeKeywords: ["surface area", "one cell thick", "short distance", "concentration gradient", "capillaries", "diffusion"],
            modelAnswer: "Millions of alveoli provide a huge total surface area for diffusion. Both the alveolus wall and capillary wall are one cell thick, giving a very short distance for diffusion. A dense network of blood capillaries and continuous ventilation maintain a steep concentration gradient."
        ),
        "q-u1-1.3-lb": SchoolScienceTransferTwin(
            id: "q-u1-1.3-lb-twin",
            parentQuestionId: "q-u1-1.3-lb",
            transferContextTitle: "Transfer Twin · Swimmer Taking a Deep Breath Before Diving",
            prompt: "Before diving into a pool, a swimmer takes a deep breath in. Describe and explain the exact sequence of actions in the intercostal muscles, ribcage, and diaphragm that causes air to rush into the lungs.",
            markSchemeKeywords: ["intercostal", "contract", "diaphragm", "flattens", "volume increases", "pressure decreases"],
            modelAnswer: "The external intercostal muscles contract to pull the ribcage upwards and outwards, while the diaphragm muscle contracts and flattens downwards. Consequently, thorax volume increases and air pressure inside the lungs decreases below atmospheric pressure, forcing air in."
        ),
        "q-u1-1.4-wb": SchoolScienceTransferTwin(
            id: "q-u1-1.4-wb-twin",
            parentQuestionId: "q-u1-1.4-wb",
            transferContextTitle: "Transfer Twin · Germinating Chickpea Vacuum Flasks",
            prompt: "Two insulated vacuum flasks are set up in a school lab: Jar X holds live germinating chickpeas washed in mild disinfectant; Jar Y holds boiled dead chickpeas washed in disinfectant. Write the word equation for aerobic respiration and explain why Jar X is 5 °C warmer than Jar Y after two days.",
            markSchemeKeywords: ["glucose", "oxygen", "carbon dioxide", "water", "releases energy", "heat", "mitochondria"],
            modelAnswer: "Word equation: glucose + oxygen -> carbon dioxide + water. Live germinating chickpeas carry out aerobic respiration inside their mitochondria, which releases energy from glucose; part of that energy transfers to the surroundings as heat. Boiled chickpeas have denatured enzymes so no respiration occurs."
        ),
        "q-u1-1.5-cyp": SchoolScienceTransferTwin(
            id: "q-u1-1.5-cyp-twin",
            parentQuestionId: "q-u1-1.5-cyp",
            transferContextTitle: "Transfer Twin · Sprinter Blood Smear Comparison",
            prompt: "A sports physiologist examines a stained blood smear from a 400 m sprinter. State two visible structural differences between red blood cells and white blood cells, and explain how each red blood cell adaptation speeds up oxygen delivery to working muscle fibres.",
            markSchemeKeywords: ["no nucleus", "haemoglobin", "biconcave", "surface area", "white blood cell", "oxyhaemoglobin"],
            modelAnswer: "Red blood cells have no nucleus (unlike a white blood cell), leaving more space to pack in haemoglobin molecules that bind oxygen to form oxyhaemoglobin. Their biconcave disc shape gives a large surface area to volume ratio for rapid oxygen diffusion."
        ),
        "q-u2-2.4-wb": SchoolScienceTransferTwin(
            id: "q-u2-2.4-wb-twin",
            parentQuestionId: "q-u2-2.4-wb",
            transferContextTitle: "Transfer Twin · Red Hibiscus Petal Chromatography",
            prompt: "A student extracts pigments from crushed red hibiscus petals and sets up a paper chromatogram. Explain (a) why the origin line is drawn with a graphite pencil instead of a ballpoint pen, and (b) why the solvent in the chromatography tank must sit below the origin spot.",
            markSchemeKeywords: ["insoluble", "dissolve", "ink", "solvent", "below"],
            modelAnswer: "(a) Graphite is insoluble in the solvent, whereas pen ink would dissolve and travel up the paper, ruining the chromatogram. (b) The solvent level must start below the spot so the petal pigments do not dissolve directly into the pool of solvent at the bottom."
        ),
        "q-u3-3.4-wb": SchoolScienceTransferTwin(
            id: "q-u3-3.4-wb-twin",
            parentQuestionId: "q-u3-3.4-wb",
            transferContextTitle: "Transfer Twin · Holding a Lab Microscope on the Palm",
            prompt: "Treating the forearm as a lever with the elbow joint as the pivot: a student holds a 12 N portable microscope in her palm 0.30 m from the elbow pivot. Her biceps tendon attaches to the radius 0.04 m from the pivot. Calculate the moment of the load and the upward force exerted by the biceps to keep the forearm level.",
            markSchemeKeywords: ["3.6", "90", "moment", "pivot"],
            modelAnswer: "Clockwise moment about the elbow pivot = 12 N x 0.30 m = 3.6 N m. For equilibrium, anticlockwise moment = 3.6 N m = biceps force x 0.04 m, so upward biceps force = 3.6 / 0.04 = 90 N."
        ),
        "q-u4-4.1-lb": SchoolScienceTransferTwin(
            id: "q-u4-4.1-lb-twin",
            parentQuestionId: "q-u4-4.1-lb",
            transferContextTitle: "Transfer Twin · Namib Desert Barrel Succulent Adaptations",
            prompt: "Explain how three structural adaptations of a spiny desert barrel cactus allow it to collect water, conserve water, and survive in an arid desert ecosystem.",
            markSchemeKeywords: ["roots", "store water", "stem", "spines", "surface area", "herbivores"],
            modelAnswer: "Wide, shallow roots absorb rainwater rapidly before it evaporates. A thick fleshy green stem can store water and carry out photosynthesis. Leaves are reduced to sharp spines, reducing the surface area for water loss by transpiration and deterring thirsty herbivores."
        ),
        "q-u4-4.2-wb": SchoolScienceTransferTwin(
            id: "q-u4-4.2-wb-twin",
            parentQuestionId: "q-u4-4.2-wb",
            transferContextTitle: "Transfer Twin · Barents Sea Pack-Ice Food Web",
            prompt: "In a polar marine food chain (under-ice algae -> copepods -> polar cod -> ringed seals -> polar bears), state what the arrows represent and explain how rapid loss of summer sea ice alters the seal and polar bear populations.",
            markSchemeKeywords: ["energy transfer", "algae", "producer", "habitat", "seals", "decrease"],
            modelAnswer: "The arrows represent the direction of energy transfer through the food chain. Under-ice algae are the primary producer; losing sea ice destroys their habitat and hunting platforms, causing krill/fish and seals to decline so the polar bear population will decrease."
        ),
        "q-u4-4.3-lb": SchoolScienceTransferTwin(
            id: "q-u4-4.3-lb-twin",
            parentQuestionId: "q-u4-4.3-lb",
            transferContextTitle: "Transfer Twin · Invasive African Grass in Arid Scrubland",
            prompt: "An introduced African pasture grass invades a dry desert reserve populated by slow-growing native cacti. Explain why the invasive grass multiplies unchecked and how it causes native cactus numbers to fall.",
            markSchemeKeywords: ["predators", "herbivores", "outcompetes", "water", "minerals", "fire", "native"],
            modelAnswer: "The invasive grass has no natural predators or specialist herbivores in the new desert, so it outcompetes native seedlings for scarce water and soil minerals. Its dense dry mats fuel frequent brush fire cycles that kill native cacti not adapted to fire."
        ),
        "q-u4-4.4-cyp": SchoolScienceTransferTwin(
            id: "q-u4-4.4-cyp-twin",
            parentQuestionId: "q-u4-4.4-cyp",
            transferContextTitle: "Transfer Twin · Mercury & PCB Amplification in an Estuary",
            prompt: "Trace amounts of a persistent organochlorine pesticide enter a coastal estuary (plankton -> minnows -> mullet -> sea eagles). Using the terms bioaccumulation and biomagnification, explain why sea eagles accumulate lethal toxin concentrations while the water tests almost clean.",
            markSchemeKeywords: ["persistent", "break down", "excreted", "bioaccumulation", "biomagnification", "concentration increases", "trophic"],
            modelAnswer: "The pesticide is persistent: it does not break down and cannot be excreted, so it builds up inside individual organisms over time (bioaccumulation). Because each predator eats many prey from the lower level, the toxin concentration increases at each trophic level (biomagnification)."
        ),
        "q-u7-7.1-lb": SchoolScienceTransferTwin(
            id: "q-u7-7.1-lb-twin",
            parentQuestionId: "q-u7-7.1-lb",
            transferContextTitle: "Transfer Twin · Hospital Nutrition Lab & Anaemia Check",
            prompt: "(a) Describe the reagents and positive colour changes used to test a crushed biscuit suspension for (i) starch and (ii) reducing sugar. (b) Explain why an endurance runner with severe dietary iron deficiency feels exhausted during exercise.",
            markSchemeKeywords: ["iodine", "blue-black", "Benedict", "heat", "brick-red", "haemoglobin", "oxygen", "respiration"],
            modelAnswer: "(a)(i) Add iodine solution; starch turns it blue-black. (ii) Add Benedict's solution and heat in a water bath; reducing sugar turns it brick-red. (b) Iron is needed to make haemoglobin in red blood cells; less haemoglobin transports less oxygen to muscles for aerobic respiration."
        ),
        "q-u7-7.2-wb": SchoolScienceTransferTwin(
            id: "q-u7-7.2-wb-twin",
            parentQuestionId: "q-u7-7.2-wb",
            transferContextTitle: "Transfer Twin · Adolescent Growth Spurt & Maternal Nutrition",
            prompt: "Compare the daily nutritional needs of a growing 13-year-old athlete and an expectant mother. Explain (a) why both require extra dietary protein and calcium, and (b) why total daily energy intake must rise during pregnancy.",
            markSchemeKeywords: ["protein", "new cells", "growth", "calcium", "bones", "fetus", "respiration"],
            modelAnswer: "(a) Protein is required to build new cells and tissues for growth, and calcium is required to mineralise growing bones and teeth. (b) During pregnancy, extra energy from respiration is needed to support the developing fetus and carry the mother's increased body mass."
        ),
        "q-u7-7.3-lb": SchoolScienceTransferTwin(
            id: "q-u7-7.3-lb-twin",
            parentQuestionId: "q-u7-7.3-lb",
            transferContextTitle: "Transfer Twin · Maternal Smoking & Airway Pathology",
            prompt: "Cigarette smoke delivers carbon monoxide and tar to the lungs. Explain the biological mechanisms by which (a) carbon monoxide restricts fetal growth during pregnancy, and (b) tar damages gas exchange and airway clearance.",
            markSchemeKeywords: ["carbon monoxide", "haemoglobin", "less oxygen", "respiration", "tar", "cilia", "mucus", "alveoli", "surface area"],
            modelAnswer: "(a) Carbon monoxide binds irreversibly to haemoglobin, so red blood cells carry less oxygen to the fetus for aerobic respiration and cell growth. (b) Tar paralyses cilia so mucus builds up, and chronic coughing breaks down alveoli walls, reducing the surface area for gas exchange."
        ),
        "q-u7-7.4-cyp": SchoolScienceTransferTwin(
            id: "q-u7-7.4-cyp-twin",
            parentQuestionId: "q-u7-7.4-cyp",
            transferContextTitle: "Transfer Twin · Rowing Stroke Elbow Biomechanics",
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
