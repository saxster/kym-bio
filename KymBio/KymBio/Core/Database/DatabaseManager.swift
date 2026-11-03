import Foundation
import GRDB

// MARK: - Question Proof Level (from KymaiaTutor)

enum QuestionProofLevel: String, Codable, CaseIterable, Sendable {
    case unseen
    case assisted       // Used hint, worked example, or faded completion
    case shaky          // Attempted independently but missed mark-scheme keywords
    case proven         // Answered independently on the current day
    case secure         // Proven across 2+ spaced calendar days

    var displayTitle: String {
        switch self {
        case .unseen: return "Not tried yet"
        case .assisted: return "Assisted practice"
        case .shaky: return "Needs another try"
        case .proven: return "Proven today"
        case .secure: return "Secure across days"
        }
    }

    var isIndependentProof: Bool {
        self == .proven || self == .secure
    }
}

// MARK: - GRDB Records

struct QuestionProofRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "question_proofs"

    var id: String                  // questionId
    var unitNumber: Int
    var topicCode: String
    var proofLevel: String          // QuestionProofLevel.rawValue
    var independentPassDays: Int
    var lastIndependentPassDayKey: String?
    var lastAttemptAt: Date
    var lastAnswerText: String
    var lastUsedAssistance: Bool
    var matchedKeywordsCSV: String
    var missingKeywordsCSV: String

    var level: QuestionProofLevel {
        QuestionProofLevel(rawValue: proofLevel) ?? .unseen
    }
}

struct FSRSCardRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "fsrs_cards"

    var id: String
    var topicCode: String
    var chapterNumber: Int
    var frontPrompt: String
    var backAnswer: String
    var stability: Double
    var difficulty: Double
    var elapsedDays: Double
    var scheduledDays: Double
    var reps: Int
    var lapses: Int
    var state: Int                  // 0=new, 1=learning, 2=review, 3=relearning
    var dueAt: Date
    var lastReviewAt: Date?
}

struct BKTSkillRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "bkt_skills"

    var id: String                  // topicCode or chapterId
    var title: String
    var pLearned: Double
    var pTransit: Double
    var pSlip: Double
    var pGuess: Double
    var independentEvidenceCount: Int
    var assistedEvidenceCount: Int
    var updatedAt: Date
}

struct LabJournalEntryRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "lab_journal_entries"

    var id: String
    var title: String
    var templateKind: String        // free, cornell, outline, sketch, lab_log
    var paperStyle: String          // blank, lined, grid, dots, cornell
    var linkedTopicCode: String?
    var linkedChapterNumber: Int?
    var linkedWidgetId: String?
    var cueColumnText: String
    var bodyNotesText: String
    var summaryText: String
    var hypothesisText: String
    var independentVarText: String
    var dependentVarText: String
    var controlVarsText: String
    var drawingData: Data?
    var snapshotPNGData: Data?
    var createdAt: Date
    var updatedAt: Date
}

struct ScratchpadRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "question_scratchpads"

    var id: String                  // questionId + "::attempt::" + attemptNumber
    var questionId: String
    var attemptNumber: Int
    var paperStyle: String
    var stampKind: String?          // punnett_2x2, punnett_4x4, magnification_triangle, results_table
    var drawingData: Data
    var previewPNGData: Data
    var strokeCount: Int
    var updatedAt: Date
}

struct DiagramRecallAttemptRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "diagram_recall_attempts"

    var id: String
    var plateId: String
    var mode: String                // label_only, ghost_scaffold, blank_recall
    var correctCalloutsCount: Int
    var totalCalloutsCount: Int
    var drawingData: Data?
    var selfScore: Int              // 1..5
    var completedAt: Date
}

struct WidgetChallengeStampRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "widget_challenge_stamps"

    var id: String                  // widgetId
    var chapterNumber: Int
    var earnedAt: Date
    var readoutSnapshot: String
}

struct ChapterReadingProgressRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "chapter_reading_progress"

    var id: String                  // ch00..ch15
    var chapterNumber: Int
    var readFraction: Double
    var predictionsCompleted: Int
    var checksCompleted: Int
    var updatedAt: Date
}

struct SchoolDeadlineRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "school_deadlines"

    var id: String
    var title: String
    var unitNumbersCSV: String      // e.g. "1,4,7"
    var dueAt: Date
    var kind: String                // unit_test, practical, workbook_due
    var notes: String
}

public struct CapturedTextbookPageRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    public static let databaseTableName = "captured_textbook_pages"

    public var id: String
    public var topicId: String
    public var bookType: String     // learners_book or workbook
    public var pageNumber: Int
    public var ocrText: String
    public var capturedAt: Date
}

struct CalloutResponseRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "callout_responses"

    var id: String                  // calloutId
    var chapterNumber: Int
    var responseText: String
    var isUnlocked: Bool
    var updatedAt: Date
}

struct KBChapterRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "kb_chapters"

    var id: String
    var chapterNumber: Int
    var volumeNumber: Int
    var title: String
    var hookSummary: String
    var keyTermsCSV: String
}

struct KBSchoolTopicRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "kb_school_topics"

    var id: String
    var unitNumber: Int
    var code: String
    var title: String
    var learnersBookPage: Int
    var workbookPage: Int
    var summary: String
    var watchoutsText: String
}

struct KBMisconceptionRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "kb_misconceptions"

    var id: String
    var topic: String
    var details: String
}

struct KBSchoolWordingRecord: Codable, FetchableRecord, PersistableRecord, Identifiable, Equatable, Sendable {
    static let databaseTableName = "kb_school_wording"

    var id: String
    var topicAndChapter: String
    var firstPrinciples: String
    var cambridgeWording: String
    var examinerTrap: String
}

// MARK: - 3-Database GRDB Manager (KB + State + Mnemosyne + Shared Science Spine)

final class DatabaseManager: Sendable {
    static let shared = DatabaseManager()

    let kbPool: DatabaseWriter
    let statePool: DatabaseWriter
    let mnemosynePool: DatabaseWriter

    init(inMemory: Bool = false) {
        if inMemory {
            let kb = try! DatabaseQueue()
            let state = try! DatabaseQueue()
            let mnem = try! DatabaseQueue()
            self.kbPool = kb
            self.statePool = state
            self.mnemosynePool = mnem
        } else {
            let baseDir = Self.resolveDatabaseDirectory()
            try? FileManager.default.createDirectory(at: baseDir, withIntermediateDirectories: true)
            let kbURL = baseDir.appendingPathComponent("kb.sqlite")
            let stateURL = baseDir.appendingPathComponent("state.sqlite")
            let mnemURL = baseDir.appendingPathComponent("mnemosyne.sqlite")
            self.kbPool = try! DatabasePool(path: kbURL.path)
            self.statePool = try! DatabasePool(path: stateURL.path)
            self.mnemosynePool = try! DatabasePool(path: mnemURL.path)
        }

        try! Self.migrateKB(kbPool)
        try! Self.migrateState(statePool)
        try! Self.migrateMnemosyne(mnemosynePool)
        try! seedInitialDataIfNeeded()
    }

    private static func resolveDatabaseDirectory() -> URL {
        // Only the iPad build holds the app-group entitlement. macOS returns a group path even without it,
        // and then refuses the database there (SQLite error 23, authorization denied) unless the app was
        // started from a terminal, so the Mac build keeps its data in Application Support.
        #if os(iOS)
        if let groupURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.com.kymaia.science") {
            return groupURL.appendingPathComponent("KymBioDB", isDirectory: true)
        }
        #endif
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        return appSupport.appendingPathComponent("KymBio", isDirectory: true)
    }

    private static func migrateKB(_ writer: DatabaseWriter) throws {
        var migrator = DatabaseMigrator()
        migrator.registerMigration("v1_kb") { db in
            try db.create(table: "kb_metadata", ifNotExists: true) { t in
                t.primaryKey("key", .text)
                t.column("value", .text).notNull()
            }
            try db.create(table: KBChapterRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("chapterNumber", .integer).notNull()
                t.column("volumeNumber", .integer).notNull()
                t.column("title", .text).notNull()
                t.column("hookSummary", .text).notNull()
                t.column("keyTermsCSV", .text).notNull()
            }
            try db.create(table: KBSchoolTopicRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("unitNumber", .integer).notNull()
                t.column("code", .text).notNull()
                t.column("title", .text).notNull()
                t.column("learnersBookPage", .integer).notNull()
                t.column("workbookPage", .integer).notNull()
                t.column("summary", .text).notNull()
                t.column("watchoutsText", .text).notNull()
            }
            try db.create(table: KBMisconceptionRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("topic", .text).notNull()
                t.column("details", .text).notNull()
            }
            try db.create(table: KBSchoolWordingRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("topicAndChapter", .text).notNull()
                t.column("firstPrinciples", .text).notNull()
                t.column("cambridgeWording", .text).notNull()
                t.column("examinerTrap", .text).notNull()
            }
        }
        try migrator.migrate(writer)
    }

    private static func migrateState(_ writer: DatabaseWriter) throws {
        var migrator = DatabaseMigrator()
        migrator.registerMigration("v1_state") { db in
            try db.create(table: QuestionProofRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("unitNumber", .integer).notNull()
                t.column("topicCode", .text).notNull()
                t.column("proofLevel", .text).notNull()
                t.column("independentPassDays", .integer).notNull().defaults(to: 0)
                t.column("lastIndependentPassDayKey", .text)
                t.column("lastAttemptAt", .datetime).notNull()
                t.column("lastAnswerText", .text).notNull()
                t.column("lastUsedAssistance", .boolean).notNull()
                t.column("matchedKeywordsCSV", .text).notNull()
                t.column("missingKeywordsCSV", .text).notNull()
            }

            try db.create(table: FSRSCardRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("topicCode", .text).notNull()
                t.column("chapterNumber", .integer).notNull()
                t.column("frontPrompt", .text).notNull()
                t.column("backAnswer", .text).notNull()
                t.column("stability", .double).notNull()
                t.column("difficulty", .double).notNull()
                t.column("elapsedDays", .double).notNull()
                t.column("scheduledDays", .double).notNull()
                t.column("reps", .integer).notNull()
                t.column("lapses", .integer).notNull()
                t.column("state", .integer).notNull()
                t.column("dueAt", .datetime).notNull()
                t.column("lastReviewAt", .datetime)
            }

            try db.create(table: BKTSkillRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("title", .text).notNull()
                t.column("pLearned", .double).notNull()
                t.column("pTransit", .double).notNull()
                t.column("pSlip", .double).notNull()
                t.column("pGuess", .double).notNull()
                t.column("independentEvidenceCount", .integer).notNull()
                t.column("assistedEvidenceCount", .integer).notNull()
                t.column("updatedAt", .datetime).notNull()
            }

            try db.create(table: WidgetChallengeStampRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("chapterNumber", .integer).notNull()
                t.column("earnedAt", .datetime).notNull()
                t.column("readoutSnapshot", .text).notNull()
            }

            try db.create(table: ChapterReadingProgressRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("chapterNumber", .integer).notNull()
                t.column("readFraction", .double).notNull()
                t.column("predictionsCompleted", .integer).notNull()
                t.column("checksCompleted", .integer).notNull()
                t.column("updatedAt", .datetime).notNull()
            }

            try db.create(table: SchoolDeadlineRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("title", .text).notNull()
                t.column("unitNumbersCSV", .text).notNull()
                t.column("dueAt", .datetime).notNull()
                t.column("kind", .text).notNull()
                t.column("notes", .text).notNull()
            }

            try db.create(table: CapturedTextbookPageRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("topicId", .text).notNull()
                t.column("bookType", .text).notNull()
                t.column("pageNumber", .integer).notNull()
                t.column("ocrText", .text).notNull()
                t.column("capturedAt", .datetime).notNull()
            }

            try db.create(table: CalloutResponseRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("chapterNumber", .integer).notNull()
                t.column("responseText", .text).notNull()
                t.column("isUnlocked", .boolean).notNull()
                t.column("updatedAt", .datetime).notNull()
            }
        }
        try migrator.migrate(writer)
    }

    private static func migrateMnemosyne(_ writer: DatabaseWriter) throws {
        var migrator = DatabaseMigrator()
        migrator.registerMigration("v1_mnemosyne") { db in
            try db.create(table: LabJournalEntryRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("title", .text).notNull()
                t.column("templateKind", .text).notNull()
                t.column("paperStyle", .text).notNull()
                t.column("linkedTopicCode", .text)
                t.column("linkedChapterNumber", .integer)
                t.column("linkedWidgetId", .text)
                t.column("cueColumnText", .text).notNull()
                t.column("bodyNotesText", .text).notNull()
                t.column("summaryText", .text).notNull()
                t.column("hypothesisText", .text).notNull()
                t.column("independentVarText", .text).notNull()
                t.column("dependentVarText", .text).notNull()
                t.column("controlVarsText", .text).notNull()
                t.column("drawingData", .blob)
                t.column("snapshotPNGData", .blob)
                t.column("createdAt", .datetime).notNull()
                t.column("updatedAt", .datetime).notNull()
            }

            try db.create(table: ScratchpadRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("questionId", .text).notNull()
                t.column("attemptNumber", .integer).notNull()
                t.column("paperStyle", .text).notNull()
                t.column("stampKind", .text)
                t.column("drawingData", .blob).notNull()
                t.column("previewPNGData", .blob).notNull()
                t.column("strokeCount", .integer).notNull()
                t.column("updatedAt", .datetime).notNull()
            }

            try db.create(table: DiagramRecallAttemptRecord.databaseTableName, ifNotExists: true) { t in
                t.primaryKey("id", .text)
                t.column("plateId", .text).notNull()
                t.column("mode", .text).notNull()
                t.column("correctCalloutsCount", .integer).notNull()
                t.column("totalCalloutsCount", .integer).notNull()
                t.column("drawingData", .blob)
                t.column("selfScore", .integer).notNull()
                t.column("completedAt", .datetime).notNull()
            }
        }
        try migrator.migrate(writer)
    }

    func seedInitialDataIfNeeded() throws {
        let pack = SeedPackLoader.shared
        let now = Date()

        try kbPool.write { db in
            let existingKBChapters = try KBChapterRecord.fetchCount(db)
            if existingKBChapters == 0 {
                for ch in pack.chapters {
                    let rec = KBChapterRecord(
                        id: ch.id,
                        chapterNumber: ch.number,
                        volumeNumber: ch.volumeNumber,
                        title: ch.title,
                        hookSummary: ch.hookSummary,
                        keyTermsCSV: ch.keyTerms.joined(separator: ", ")
                    )
                    try rec.save(db)
                }
                for unit in pack.schoolTextbook.units {
                    for topic in unit.topics {
                        let rec = KBSchoolTopicRecord(
                            id: topic.id,
                            unitNumber: unit.unitNumber,
                            code: topic.code,
                            title: topic.title,
                            learnersBookPage: topic.learnersBookPage,
                            workbookPage: topic.workbookPage,
                            summary: topic.summary,
                            watchoutsText: topic.cambridgeWatchouts.joined(separator: " | ")
                        )
                        try rec.save(db)
                    }
                }
                for m in pack.misconceptions {
                    try KBMisconceptionRecord(id: m.id, topic: m.topic, details: m.details).save(db)
                }
                for sw in pack.schoolWordingEntries {
                    try KBSchoolWordingRecord(
                        id: sw.id,
                        topicAndChapter: sw.topicAndChapter,
                        firstPrinciples: sw.firstPrinciples,
                        cambridgeWording: sw.cambridgeWording,
                        examinerTrap: sw.examinerTrap
                    ).save(db)
                }
            }
        }

        try statePool.write { db in
            let existingCards = try FSRSCardRecord.fetchCount(db)
            if existingCards == 0 {
                for q in pack.schoolQuestions {
                    let card = FSRSCardRecord(
                        id: "card-\(q.id)",
                        topicCode: q.topicCode,
                        chapterNumber: q.linkedChapter,
                        frontPrompt: q.prompt,
                        backAnswer: q.modelAnswer,
                        stability: 1.8,
                        difficulty: 4.5,
                        elapsedDays: 0,
                        scheduledDays: 1,
                        reps: 0,
                        lapses: 0,
                        state: 0,
                        dueAt: now,
                        lastReviewAt: nil
                    )
                    try card.save(db)
                }
            }

            let existingSkills = try BKTSkillRecord.fetchCount(db)
            if existingSkills == 0 {
                for unit in pack.schoolTextbook.units {
                    for topic in unit.topics {
                        let initialPLearned = unit.isCompletedInSchool ? 0.55 : 0.25
                        let skill = BKTSkillRecord(
                            id: topic.code,
                            title: "\(topic.code) \(topic.title)",
                            pLearned: initialPLearned,
                            pTransit: 0.18,
                            pSlip: 0.10,
                            pGuess: 0.15,
                            independentEvidenceCount: 0,
                            assistedEvidenceCount: 0,
                            updatedAt: now
                        )
                        try skill.save(db)
                    }
                }
            }

            let existingDeadlines = try SchoolDeadlineRecord.fetchCount(db)
            if existingDeadlines == 0 {
                let cal = Calendar.current
                let unit7Check = SchoolDeadlineRecord(
                    id: "deadline-u7-diet-growth",
                    title: "Unit 7: Diet and growth — Topic & Workbook proof",
                    unitNumbersCSV: "7",
                    dueAt: cal.date(byAdding: .day, value: 6, to: now) ?? now,
                    kind: "unit_test",
                    notes: "Nutrients (7.1), Balanced diet (7.2), Growth & smoking (7.3) and Moving the body (7.4) — LB pp. 233–262, WB pp. 134–158."
                )
                let bioRevision = SchoolDeadlineRecord(
                    id: "deadline-bio-checkpoint",
                    title: "Biology Checkpoint Revision (Units 1, 4 & 7)",
                    unitNumbersCSV: "1,4,7",
                    dueAt: cal.date(byAdding: .day, value: 14, to: now) ?? now,
                    kind: "unit_test",
                    notes: "Spaced retrieval across Unit 1 Respiration, Unit 4 Ecosystems and Unit 7 Diet and growth."
                )
                try unit7Check.save(db)
                try bioRevision.save(db)
            }
        }

        try mnemosynePool.write { db in
            let existingEntries = try LabJournalEntryRecord.fetchCount(db)
            if existingEntries == 0 {
                let starter = LabJournalEntryRecord(
                    id: "journal-starter-u1-respiration",
                    title: "Unit 1.4 & Ch 1 — Why germinating moong beans release heat",
                    templateKind: "cornell",
                    paperStyle: "cornell",
                    linkedTopicCode: "1.4",
                    linkedChapterNumber: 1,
                    linkedWidgetId: "monsoon_imbibition",
                    cueColumnText: "1. Word equation for aerobic respiration?\n2. Why does Cambridge forbid 'energy is made'?\n3. Why did Boiled Flask B stay cool?",
                    bodyNotesText: "• Word equation: glucose + oxygen → carbon dioxide + water.\n• Energy is RELEASED from chemical bonds in glucose inside mitochondria (never created from nothing).\n• Germinating peas in Flask A respire rapidly for cell division; some energy transfers as heat.\n• Boiling denatures respiratory enzymes in Flask B so no respiration happens.",
                    summaryText: "Aerobic respiration in mitochondria oxidises glucose with oxygen to release energy for cellular work and heat; denatured enzymes in boiled seeds stop the reaction.",
                    hypothesisText: "",
                    independentVarText: "",
                    dependentVarText: "",
                    controlVarsText: "",
                    drawingData: nil,
                    snapshotPNGData: nil,
                    createdAt: now,
                    updatedAt: now
                )
                try starter.save(db)
            }
        }
    }
}
