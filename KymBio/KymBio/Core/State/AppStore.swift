import Combine
import Foundation
import GRDB
import SwiftUI

enum AppRoom: String, CaseIterable, Identifiable, Sendable {
    case today = "today"
    case livingWorld = "living_world"
    case schoolScience = "school_science"
    case labsAtlas = "labs_atlas"
    case vaultAndTips = "vault_and_tips"
    case labJournal = "lab_journal"
    case coach = "coach"
    case calendar = "calendar"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .today: return "Today"
        case .livingWorld: return "The Living World"
        case .schoolScience: return "School Science 8"
        case .labsAtlas: return "3D Labs & Atlas"
        case .vaultAndTips: return "Vault & Field Guides"
        case .labJournal: return "Lab Journal"
        case .coach: return "Biology Coach"
        case .calendar: return "Calendar"
        }
    }

    var subtitle: String {
        switch self {
        case .today: return "Daily briefing, next question proof and due cards"
        case .livingWorld: return "16 narrative chapters, 4 volumes & 4 explorers"
        case .schoolScience: return "Cambridge Learner's Book 8 & Workbook 8"
        case .labsAtlas: return "117 3D Atlas lessons, 47 simulations & diagram recall"
        case .vaultAndTips: return "Learn by Heart, Greek/Latin roots & visual field guides"
        case .labJournal: return "Cornell notes, wet-lab logs & Apple Pencil sketches"
        case .coach: return "Socratic AI tutor grounded in your textbook & labs"
        case .calendar: return "Science tests, study blocks & wet-lab timers"
        }
    }

    var symbol: String {
        switch self {
        case .today: return "sun.max.fill"
        case .livingWorld: return "leaf.fill"
        case .schoolScience: return "book.closed.fill"
        case .labsAtlas: return "cube.transparent.fill"
        case .vaultAndTips: return "sparkles.rectangle.stack.fill"
        case .labJournal: return "pencil.and.scribble"
        case .coach: return "bubble.left.and.text.bubble.right.fill"
        case .calendar: return "calendar"
        }
    }
}

@MainActor
final class AppStore: ObservableObject {
    static let shared = AppStore()

    let pack: KymBioSeedPack
    let db: DatabaseManager

    // MARK: - Navigation & Filter State
    @Published var selectedRoom: AppRoom = .today
    @Published var selectedSchoolLens: ScienceDisciplineLens = .biologyCore
    @Published var selectedUnitNumber: Int = 7 // Upcoming Unit 7: Diet and growth
    @Published var selectedTopicCode: String? = "7.1"
    @Published var activeLivingWorldChapter: Int = 1
    @Published var activeWidgetId: String? = nil
    @Published var activeExplorerId: String? = nil
    @Published var activeDiagramPlateId: String? = nil
    @Published var activePracticeQuestion: SchoolScienceQuestion? = nil
    @Published var activeJournalEntry: LabJournalEntryRecord? = nil
    @Published var syllabusBoard: String = "0893" // Cambridge 0893 default

    // MARK: - Journal Muddiest-Point Privacy Lease (Ported from ../kym_tutor)
    // Coach never reads private Lab Journal entries unless Kym explicitly shares a muddiest point.
    @Published private(set) var sharedMuddiestPointContext: String? = nil

    func shareJournalMuddiestPointWithCoach(_ note: String) {
        let trimmed = note.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        sharedMuddiestPointContext = trimmed
        selectedRoom = .coach
    }

    func clearJournalPrivateContext() {
        sharedMuddiestPointContext = nil
    }

    // MARK: - Persisted Learner State
    @Published private(set) var questionProofs: [String: QuestionProofRecord] = [:]
    @Published private(set) var fsrsCards: [FSRSCardRecord] = []
    @Published private(set) var bktSkills: [String: BKTSkillRecord] = [:]
    @Published private(set) var journalEntries: [LabJournalEntryRecord] = []
    @Published private(set) var diagramAttempts: [DiagramRecallAttemptRecord] = []
    @Published private(set) var widgetStamps: [String: WidgetChallengeStampRecord] = [:]
    @Published private(set) var readingProgress: [Int: ChapterReadingProgressRecord] = [:]
    @Published private(set) var deadlines: [SchoolDeadlineRecord] = []
    @Published private(set) var calloutResponses: [String: CalloutResponseRecord] = [:]

    init(db: DatabaseManager = .shared, pack: KymBioSeedPack = SeedPackLoader.shared) {
        self.db = db
        self.pack = pack
        reloadAllState()
        consumeSharedInboxItems()
    }

    func reloadAllState() {
        do {
            try db.statePool.read { conn in
                let proofs = try QuestionProofRecord.fetchAll(conn)
                self.questionProofs = Dictionary(uniqueKeysWithValues: proofs.map { ($0.id, $0) })

                self.fsrsCards = try FSRSCardRecord
                    .order(Column("dueAt").asc)
                    .fetchAll(conn)

                let skills = try BKTSkillRecord.fetchAll(conn)
                self.bktSkills = Dictionary(uniqueKeysWithValues: skills.map { ($0.id, $0) })

                let stamps = try WidgetChallengeStampRecord.fetchAll(conn)
                self.widgetStamps = Dictionary(uniqueKeysWithValues: stamps.map { ($0.id, $0) })

                let progress = try ChapterReadingProgressRecord.fetchAll(conn)
                self.readingProgress = Dictionary(uniqueKeysWithValues: progress.map { ($0.chapterNumber, $0) })

                self.deadlines = try SchoolDeadlineRecord
                    .order(Column("dueAt").asc)
                    .fetchAll(conn)

                let responses = try CalloutResponseRecord.fetchAll(conn)
                self.calloutResponses = Dictionary(uniqueKeysWithValues: responses.map { ($0.id, $0) })
            }

            try db.mnemosynePool.read { conn in
                self.journalEntries = try LabJournalEntryRecord
                    .order(Column("updatedAt").desc)
                    .fetchAll(conn)

                self.diagramAttempts = try DiagramRecallAttemptRecord
                    .order(Column("completedAt").desc)
                    .fetchAll(conn)
            }

            SystemSurfaceSnapshotStore.shared.publishSnapshot(from: self)
        } catch {
            print("Failed to reload KymBio state: \(error)")
        }
    }

    // MARK: - Computed Queries

    var dueFSRSCards: [FSRSCardRecord] {
        let now = Date()
        return fsrsCards.filter { $0.dueAt <= now }
    }

    func unitReadiness(for unit: SchoolScienceUnit) -> UnitReadinessSnapshot {
        ReadinessService.snapshot(
            for: unit,
            pack: pack,
            proofs: Array(questionProofs.values),
            skills: Array(bktSkills.values),
            stamps: Array(widgetStamps.values),
            readingProgress: Array(readingProgress.values)
        )
    }

    func proofLevel(for questionId: String) -> QuestionProofLevel {
        questionProofs[questionId]?.level ?? .unseen
    }

    func questions(forUnit unitNumber: Int, topicCode: String? = nil) -> [SchoolScienceQuestion] {
        pack.schoolQuestions.filter { q in
            q.unitNumber == unitNumber && (topicCode == nil || q.topicCode == topicCode)
        }
    }

    func bridges(forTopic topicCode: String) -> [CrossDisciplinaryBridge] {
        pack.crossDisciplinaryBridges.filter { $0.schoolTopics.contains(topicCode) }
    }

    func bridges(forUnit unitNumber: Int) -> [CrossDisciplinaryBridge] {
        guard let unit = pack.schoolTextbook.units.first(where: { $0.unitNumber == unitNumber }) else {
            return []
        }
        let ids = Set(unit.bridgeIds)
        return pack.crossDisciplinaryBridges.filter { ids.contains($0.id) }
    }

    // MARK: - Mutations

    @discardableResult
    func submitQuestionAttempt(
        question: SchoolScienceQuestion,
        answerText: String,
        usedAssistance: Bool,
        now: Date = Date()
    ) -> QuestionEvaluationResult {
        let existing = questionProofs[question.id]
        let (evaluation, record) = QuestionProofService.evaluateAndRecord(
            question: question,
            answerText: answerText,
            usedAssistance: usedAssistance,
            existingProof: existing,
            now: now
        )

        do {
            try db.statePool.write { conn in
                try record.save(conn)
                if let skill = try BKTSkillRecord.fetchOne(conn, key: question.topicCode) {
                    let updatedSkill = BKTEngine.update(
                        skill: skill,
                        isCorrect: evaluation.isPass,
                        usedAssistance: usedAssistance,
                        now: now
                    )
                    try updatedSkill.save(conn)
                }
            }
            reloadAllState()
        } catch {
            print("Failed to save question proof: \(error)")
        }
        return evaluation
    }

    func reviewFSRSCard(_ card: FSRSCardRecord, rating: FSRSRating, now: Date = Date()) {
        let updated = FSRSScheduler.schedule(card: card, rating: rating, now: now)
        do {
            try db.statePool.write { conn in
                try updated.save(conn)
                if let skill = try BKTSkillRecord.fetchOne(conn, key: card.topicCode) {
                    let updatedSkill = BKTEngine.update(
                        skill: skill,
                        isCorrect: rating.rawValue >= 3,
                        usedAssistance: false,
                        now: now
                    )
                    try updatedSkill.save(conn)
                }
            }
            reloadAllState()
        } catch {
            print("Failed to update FSRS card: \(error)")
        }
    }

    func earnWidgetChallengeStamp(widgetId: String, chapterNumber: Int, readout: String) {
        let stamp = WidgetChallengeStampRecord(
            id: widgetId,
            chapterNumber: chapterNumber,
            earnedAt: Date(),
            readoutSnapshot: readout
        )
        do {
            try db.statePool.write { conn in
                try stamp.save(conn)
            }
            reloadAllState()
        } catch {
            print("Failed to save widget stamp: \(error)")
        }
    }

    func updateChapterProgress(chapterNumber: Int, fraction: Double, addPrediction: Bool = false, addCheck: Bool = false) {
        let id = String(format: "ch%02d", chapterNumber)
        let current = readingProgress[chapterNumber] ?? ChapterReadingProgressRecord(
            id: id,
            chapterNumber: chapterNumber,
            readFraction: 0,
            predictionsCompleted: 0,
            checksCompleted: 0,
            updatedAt: Date()
        )
        let updated = ChapterReadingProgressRecord(
            id: id,
            chapterNumber: chapterNumber,
            readFraction: max(current.readFraction, min(1.0, fraction)),
            predictionsCompleted: current.predictionsCompleted + (addPrediction ? 1 : 0),
            checksCompleted: current.checksCompleted + (addCheck ? 1 : 0),
            updatedAt: Date()
        )
        do {
            try db.statePool.write { conn in
                try updated.save(conn)
            }
            reloadAllState()
        } catch {
            print("Failed to save chapter progress: \(error)")
        }
    }

    func saveJournalEntry(_ entry: LabJournalEntryRecord) {
        var mutable = entry
        mutable.updatedAt = Date()
        do {
            try db.mnemosynePool.write { conn in
                try mutable.save(conn)
            }
            reloadAllState()
        } catch {
            print("Failed to save journal entry: \(error)")
        }
    }

    func freezeWidgetIntoLabLog(
        widget: InteractiveWidgetSpec,
        readout: String,
        snapshotPNGData: Data? = nil
    ) -> LabJournalEntryRecord {
        let now = Date()
        let entry = LabJournalEntryRecord(
            id: "lablog-\(widget.id)-\(Int(now.timeIntervalSince1970))",
            title: "Lab Log: \(widget.title) (Ch \(widget.chapter))",
            templateKind: "lab_log",
            paperStyle: "grid",
            linkedTopicCode: nil,
            linkedChapterNumber: widget.chapter,
            linkedWidgetId: widget.id,
            cueColumnText: "Challenge:\n\(widget.challengePrompt)",
            bodyNotesText: "Live readout:\n\(readout)\n\nSubmicroscopic cutaway:\n\(widget.cutaway)",
            summaryText: "Model scope note: \(widget.idealised)",
            hypothesisText: widget.challengePrompt,
            independentVarText: "Slider parameter adjusted in \(widget.title)",
            dependentVarText: "Measured biological response in \(widget.title)",
            controlVarsText: "Temperature, pH and baseline conditions held constant",
            drawingData: nil,
            snapshotPNGData: snapshotPNGData,
            createdAt: now,
            updatedAt: now
        )
        saveJournalEntry(entry)
        activeJournalEntry = entry
        selectedRoom = .labJournal
        return entry
    }

    func saveScratchpad(
        questionId: String,
        attemptNumber: Int,
        paperStyle: String,
        stampKind: String?,
        drawingData: Data,
        previewPNGData: Data,
        strokeCount: Int
    ) {
        let record = ScratchpadRecord(
            id: "\(questionId)::attempt::\(attemptNumber)",
            questionId: questionId,
            attemptNumber: attemptNumber,
            paperStyle: paperStyle,
            stampKind: stampKind,
            drawingData: drawingData,
            previewPNGData: previewPNGData,
            strokeCount: strokeCount,
            updatedAt: Date()
        )
        do {
            try db.mnemosynePool.write { conn in
                try record.save(conn)
            }
        } catch {
            print("Failed to save scratchpad: \(error)")
        }
    }

    func fetchScratchpad(questionId: String, attemptNumber: Int) -> ScratchpadRecord? {
        let id = "\(questionId)::attempt::\(attemptNumber)"
        return try? db.mnemosynePool.read { conn in
            try ScratchpadRecord.fetchOne(conn, key: id)
        }
    }

    func recordDiagramRecall(
        plate: DiagramRecallPlate,
        mode: String,
        correctCount: Int,
        selfScore: Int,
        drawingData: Data? = nil
    ) {
        let record = DiagramRecallAttemptRecord(
            id: UUID().uuidString,
            plateId: plate.id,
            mode: mode,
            correctCalloutsCount: correctCount,
            totalCalloutsCount: plate.callouts.count,
            drawingData: drawingData,
            selfScore: selfScore,
            completedAt: Date()
        )
        do {
            try db.mnemosynePool.write { conn in
                try record.save(conn)
            }
            reloadAllState()
        } catch {
            print("Failed to save diagram recall attempt: \(error)")
        }
    }

    func addDeadline(title: String, unitNumbersCSV: String, dueAt: Date, kind: String, notes: String) {
        let record = SchoolDeadlineRecord(
            id: UUID().uuidString,
            title: title,
            unitNumbersCSV: unitNumbersCSV,
            dueAt: dueAt,
            kind: kind,
            notes: notes
        )
        do {
            try db.statePool.write { conn in
                try record.save(conn)
            }
            reloadAllState()
        } catch {
            print("Failed to save deadline: \(error)")
        }
    }

    // MARK: - Captured Textbook Pages & Convenience Helpers

    var seedPack: KymBioSeedPack { pack }
    var activeTheme: CuratedColorScheme { CuratedColorScheme.current }
    var disciplineLens: ScienceDisciplineLens { selectedSchoolLens }
    var questionProofStates: [String: QuestionProofRecord] { questionProofs }
    var overallReadinessScore: Double {
        guard !bktSkills.isEmpty else { return 0.72 }
        let sum = bktSkills.values.reduce(0.0) { $0 + $1.pLearned }
        return sum / Double(bktSkills.count)
    }

    func saveCapturedTextbookPage(topicId: String, bookType: String, pageNumber: Int, ocrText: String) {
        let record = CapturedTextbookPageRecord(
            id: UUID().uuidString,
            topicId: topicId,
            bookType: bookType,
            pageNumber: pageNumber,
            ocrText: ocrText,
            capturedAt: Date()
        )
        do {
            try db.statePool.write { conn in
                try record.save(conn)
            }
        } catch {
            print("Failed to save captured page: \(error)")
        }
    }

    func fetchCapturedPages() -> [CapturedTextbookPageRecord] {
        (try? db.statePool.read { conn in
            try CapturedTextbookPageRecord.order(Column("capturedAt").desc).fetchAll(conn)
        }) ?? []
    }

    func saveCalloutResponse(calloutId: String, chapterNumber: Int, responseText: String, isUnlocked: Bool) {
        let record = CalloutResponseRecord(
            id: calloutId,
            chapterNumber: chapterNumber,
            responseText: responseText,
            isUnlocked: isUnlocked,
            updatedAt: Date()
        )
        do {
            try db.statePool.write { conn in
                try record.save(conn)
            }
            reloadAllState()
        } catch {
            print("Failed to save callout response: \(error)")
        }
    }

    /// Imports shared notes, links, or image clips from KymBioShareExtension (`group.com.kymaia.science`) into the Lab Journal.
    func consumeSharedInboxItems() {
        let defaults = UserDefaults(suiteName: "group.com.kymaia.science") ?? .standard
        guard let sharedTexts = defaults.stringArray(forKey: "kymbio.sharedInbox.texts"), !sharedTexts.isEmpty else {
            return
        }
        defaults.removeObject(forKey: "kymbio.sharedInbox.texts")
        for item in sharedTexts {
            let trimmed = item.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !trimmed.isEmpty else { continue }
            createJournalEntry(
                title: "Shared to KymBio: \(String(trimmed.prefix(40)))",
                templateKind: JournalTemplateKind.cornell.rawValue,
                paperStyle: JournalPaperStyle.cornell.rawValue,
                linkedChapter: activeLivingWorldChapter,
                linkedUnit: selectedUnitNumber,
                cuesText: "Shared study snippet / diagram note",
                bodyText: trimmed,
                summaryText: "Imported via Send to KymBio Share Extension"
            )
        }
    }

    func createJournalEntry(
        title: String,
        templateKind: String,
        paperStyle: String,
        linkedChapter: Int?,
        linkedUnit: Int?,
        cuesText: String,
        bodyText: String,
        summaryText: String,
        drawingData: Data? = nil
    ) {
        let now = Date()
        let entry = LabJournalEntryRecord(
            id: UUID().uuidString,
            title: title,
            templateKind: templateKind,
            paperStyle: paperStyle,
            linkedTopicCode: linkedUnit.map { "\($0).1" },
            linkedChapterNumber: linkedChapter,
            linkedWidgetId: nil,
            cueColumnText: cuesText,
            bodyNotesText: bodyText,
            summaryText: summaryText,
            hypothesisText: "",
            independentVarText: "",
            dependentVarText: "",
            controlVarsText: "",
            drawingData: drawingData,
            snapshotPNGData: nil,
            createdAt: now,
            updatedAt: now
        )
        saveJournalEntry(entry)
        activeJournalEntry = entry
    }

    // MARK: - Deep Link Routing (kymbio://chapter/ch06, kymbio://unit/7, kymbio://widget/seed_flame3d)

    func openDeepLink(_ url: URL) {
        guard url.scheme?.lowercased() == "kymbio" else { return }
        let host = url.host?.lowercased() ?? ""
        let pathPart = url.pathComponents.dropFirst().first ?? ""

        switch host {
        case "chapter":
            let digits = pathPart.replacingOccurrences(of: "ch", with: "")
            if let ch = Int(digits) {
                activeLivingWorldChapter = ch
                selectedRoom = .livingWorld
            }
        case "unit":
            if let u = Int(pathPart) {
                selectedUnitNumber = u
                selectedRoom = .schoolScience
            }
        case "topic":
            selectedTopicCode = pathPart
            if let firstDigit = pathPart.split(separator: ".").first, let u = Int(firstDigit) {
                selectedUnitNumber = u
            }
            selectedRoom = .schoolScience
        case "widget":
            activeWidgetId = pathPart
            selectedRoom = .labsAtlas
        case "plate":
            activeDiagramPlateId = pathPart
            selectedRoom = .labsAtlas
        default:
            break
        }
    }
}
