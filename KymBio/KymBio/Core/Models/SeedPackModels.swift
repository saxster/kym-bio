import Foundation

// MARK: - Seed Pack Root

struct KymBioSeedPack: Codable, Sendable {
    let schemaVersion: Int
    let packId: String
    let generatedBy: String
    let volumes: [LivingWorldVolume]
    let chapters: [LivingWorldChapter]
    let explorers: [LivingWorldExplorer]
    let atlasLessons: [AtlasLesson]
    let widgets: [InteractiveWidgetSpec]
    let crossDisciplinaryBridges: [CrossDisciplinaryBridge]
    let schoolTextbook: SchoolScienceTextbook
    let schoolQuestions: [SchoolScienceQuestion]
    let diagramPlates: [DiagramRecallPlate]
    var misconceptions: [MisconceptionBriefEntry] = []
    var schoolWordingEntries: [SchoolWordingBridgeEntry] = []

    enum CodingKeys: String, CodingKey {
        case schemaVersion, packId, generatedBy, volumes, chapters, explorers, atlasLessons, widgets
        case crossDisciplinaryBridges, schoolTextbook, schoolQuestions, diagramPlates
        case misconceptions, schoolWordingEntries
    }

    init(
        schemaVersion: Int,
        packId: String,
        generatedBy: String,
        volumes: [LivingWorldVolume],
        chapters: [LivingWorldChapter],
        explorers: [LivingWorldExplorer],
        atlasLessons: [AtlasLesson],
        widgets: [InteractiveWidgetSpec],
        crossDisciplinaryBridges: [CrossDisciplinaryBridge],
        schoolTextbook: SchoolScienceTextbook,
        schoolQuestions: [SchoolScienceQuestion],
        diagramPlates: [DiagramRecallPlate],
        misconceptions: [MisconceptionBriefEntry] = [],
        schoolWordingEntries: [SchoolWordingBridgeEntry] = []
    ) {
        self.schemaVersion = schemaVersion
        self.packId = packId
        self.generatedBy = generatedBy
        self.volumes = volumes
        self.chapters = chapters
        self.explorers = explorers
        self.atlasLessons = atlasLessons
        self.widgets = widgets
        self.crossDisciplinaryBridges = crossDisciplinaryBridges
        self.schoolTextbook = schoolTextbook
        self.schoolQuestions = schoolQuestions
        self.diagramPlates = diagramPlates
        self.misconceptions = misconceptions
        self.schoolWordingEntries = schoolWordingEntries
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        schemaVersion = try c.decode(Int.self, forKey: .schemaVersion)
        packId = try c.decode(String.self, forKey: .packId)
        generatedBy = try c.decode(String.self, forKey: .generatedBy)
        volumes = try c.decode([LivingWorldVolume].self, forKey: .volumes)
        chapters = try c.decode([LivingWorldChapter].self, forKey: .chapters)
        explorers = try c.decode([LivingWorldExplorer].self, forKey: .explorers)
        atlasLessons = try c.decode([AtlasLesson].self, forKey: .atlasLessons)
        widgets = try c.decode([InteractiveWidgetSpec].self, forKey: .widgets)
        crossDisciplinaryBridges = try c.decode([CrossDisciplinaryBridge].self, forKey: .crossDisciplinaryBridges)
        schoolTextbook = try c.decode(SchoolScienceTextbook.self, forKey: .schoolTextbook)
        schoolQuestions = try c.decode([SchoolScienceQuestion].self, forKey: .schoolQuestions)
        diagramPlates = try c.decode([DiagramRecallPlate].self, forKey: .diagramPlates)
        misconceptions = (try? c.decode([MisconceptionBriefEntry].self, forKey: .misconceptions)) ?? []
        schoolWordingEntries = (try? c.decode([SchoolWordingBridgeEntry].self, forKey: .schoolWordingEntries)) ?? []
    }
}

struct MisconceptionBriefEntry: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let topic: String
    let details: String
}

struct SchoolWordingBridgeEntry: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let topicAndChapter: String
    let firstPrinciples: String
    let cambridgeWording: String
    let examinerTrap: String
}

// MARK: - The Living World (16 Chapters, 4 Volumes, Explorers, Atlas, Widgets)

struct LivingWorldVolume: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let number: Int
    let title: String
    let chapters: [Int]
}

struct LivingWorldChapter: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let number: Int
    let volumeNumber: Int
    let volumeTitle: String
    let title: String
    let subtitle: String
    let hookSummary: String
    let sections: [LivingWorldSection]
    let callouts: [LivingWorldCallout]
    let keyTerms: [String]
    let widgets: [String]
}

struct LivingWorldSection: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let heading: String
    let excerpt: String
}

struct LivingWorldCallout: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let kind: String      // predict, check, recall, careful, school, home, case
    let title: String
    let body: String

    var badgeText: String {
        switch kind {
        case "predict": return "Predict first"
        case "check": return "Check understanding"
        case "recall": return "Recall"
        case "careful": return "Common trap"
        case "school": return "School syllabus wording"
        case "home": return "Try at home"
        case "case": return "Case study"
        default: return kind.capitalized
        }
    }

    var symbolName: String {
        switch kind {
        case "predict": return "sparkles"
        case "check": return "checkmark.seal"
        case "recall": return "arrow.counterclockwise"
        case "careful": return "exclamationmark.triangle"
        case "school": return "graduationcap"
        case "home": return "house"
        case "case": return "stethoscope"
        default: return "bookmark"
        }
    }
}

struct LivingWorldExplorer: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let title: String
    let subtitle: String
    let symbol: String
    let linkedChapters: [Int]
    let summary: String
}

struct AtlasLesson: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let widget: String
    let title: String
    let chapter: Int
    let figure: String
    let question: String
    let explanation: String
    let limits: String
    let sources: [String]
    let stories: [String]
}

struct InteractiveWidgetSpec: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let title: String
    let chapter: Int
    let is3D: Bool
    let challengePrompt: String
    let cutaway: String
    let idealised: String
    let watchSteps: [WidgetWatchStep]
}

struct WidgetWatchStep: Codable, Equatable, Sendable {
    let title: String
    let caption: String
}

// MARK: - Cross-Disciplinary First-Principles Bridges (KymChem & KymPhysics)

struct CrossDisciplinaryBridge: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let discipline: String // "chemistry" | "physics"
    let sourceBook: String
    let sourceRef: String
    let deepLink: String
    let title: String
    let schoolTopics: [String]
    let livingWorldChapters: [Int]
    let summary: String
    let keyEquation: String
    let microCheckQuestion: String
    let microCheckAnswer: String

    var isChemistry: Bool { discipline == "chemistry" }

    var badgeSymbol: String {
        isChemistry ? "atom" : "gyroscope"
    }
}

// MARK: - School Textbook: Cambridge Lower Secondary Science 8 (Learner's Book & Workbook)

enum ScienceDisciplineLens: String, CaseIterable, Identifiable, Sendable {
    case biologyCore = "core_biology"
    case biologyPlusBridges = "biology_plus_bridges"
    case allNineUnits = "all_nine_units"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .biologyCore:
            return "Biology units (1, 4, 7)"
        case .biologyPlusBridges:
            return "Biology + Chem/Phys bridges"
        case .allNineUnits:
            return "All 9 Science units"
        }
    }

    var subtitle: String {
        switch self {
        case .biologyCore:
            return "Focused on Unit 1 Respiration, Unit 4 Ecosystems and Unit 7 Diet and growth"
        case .biologyPlusBridges:
            return "Includes dissolving, chromatography, turning forces, gas pressure, light and energetics"
        case .allNineUnits:
            return "Complete Cambridge Lower Secondary Science 8 Learner's Book and Workbook table of contents"
        }
    }
}

struct SchoolScienceTextbook: Codable, Equatable, Sendable {
    let id: String
    let title: String
    let authors: String
    let publisher: String
    let curriculumCode: String
    let learnersBookTotalPages: Int
    let workbookTotalPages: Int
    let units: [SchoolScienceUnit]

    func units(for lens: ScienceDisciplineLens) -> [SchoolScienceUnit] {
        switch lens {
        case .biologyCore:
            return units.filter { $0.discipline == "core_biology" }
        case .biologyPlusBridges:
            return units.filter { $0.discipline == "core_biology" || $0.discipline == "biology_bridge" }
        case .allNineUnits:
            return units
        }
    }
}

struct SchoolScienceUnit: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let unitNumber: Int
    let title: String
    let discipline: String // "core_biology" | "biology_bridge" | "sibling_science"
    let scienceStrands: [String]
    let twsStrands: [String]
    let scienceInContext: String
    let learnersBookStartPage: Int
    let learnersBookEndPage: Int
    let workbookStartPage: Int
    let workbookEndPage: Int
    let isCompletedInSchool: Bool
    let livingWorldChapters: [Int]
    let bridgeIds: [String]
    let topics: [SchoolScienceTopic]

    var isCoreBiology: Bool { discipline == "core_biology" }
    var isBiologyBridge: Bool { discipline == "biology_bridge" }

    var disciplineBadgeLabel: String {
        switch discipline {
        case "core_biology": return "Core Biology"
        case "biology_bridge": return "Bio + Chem/Phys Bridge"
        default: return "General Science"
        }
    }
}

struct SchoolScienceTopic: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let code: String
    let title: String
    let learnersBookPage: Int
    let workbookPage: Int
    let discipline: String
    let livingWorldChapters: [Int]
    let linkedWidgets: [String]
    let bridgeIds: [String]
    let summary: String
    let cambridgeWatchouts: [String]
}

struct SchoolScienceQuestion: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let unitNumber: Int
    let topicCode: String
    let sourceBook: String      // "learners_book" | "workbook"
    let bookSection: String
    let tier: String            // "Focus" | "Practice" | "Challenge"
    let commandWord: String
    let marks: Int
    let prompt: String
    let workedExample: String
    let fadedPrompt: String
    let fadedAnswer: String
    let modelAnswer: String
    let markSchemeKeywords: [String]
    let linkedChapter: Int
    let linkedWidget: String

    var sourceBadgeTitle: String {
        sourceBook == "workbook" ? "Workbook · \(tier)" : "Learner's Book"
    }
}

// MARK: - Specimen & School Diagram Recall Plates

struct DiagramRecallPlate: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let title: String
    let sourceRef: String
    let unitNumber: Int
    let chapter: Int
    let figureId: String
    let aspectRatio: Double
    let callouts: [DiagramCalloutPin]
}

struct DiagramCalloutPin: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let label: String
    let x: Double
    let y: Double
    let hint: String
}

// MARK: - Seed Pack Loader

enum SeedPackLoader {
    static let shared: KymBioSeedPack = {
        do {
            return try loadFromBundle()
        } catch {
            return fallbackPack()
        }
    }()

    static func loadFromBundle() throws -> KymBioSeedPack {
        let candidateURLs: [URL?] = [
            Bundle.main.url(forResource: "kymbio-seed-pack", withExtension: "json", subdirectory: "ContentPacks"),
            Bundle.main.url(forResource: "kymbio-seed-pack", withExtension: "json"),
            URL(fileURLWithPath: "/Users/amarsukhi/src/MyCode/kym_bio/KymBio/KymBio/Resources/ContentPacks/kymbio-seed-pack.json")
        ]
        for case let url? in candidateURLs where FileManager.default.fileExists(atPath: url.path) {
            let data = try Data(contentsOf: url)
            return try JSONDecoder().decode(KymBioSeedPack.self, from: data)
        }
        throw CocoaError(.fileNoSuchFile)
    }

    static func fallbackPack() -> KymBioSeedPack {
        KymBioSeedPack(
            schemaVersion: 1,
            packId: "fallback",
            generatedBy: "fallback",
            volumes: [],
            chapters: [],
            explorers: [],
            atlasLessons: [],
            widgets: [],
            crossDisciplinaryBridges: [],
            schoolTextbook: SchoolScienceTextbook(
                id: "cambridge-science-8-2ed",
                title: "Cambridge Lower Secondary Science 8",
                authors: "Mary Jones, Diane Fellowes-Freeman & Michael Smyth",
                publisher: "Cambridge University Press",
                curriculumCode: "0893",
                learnersBookTotalPages: 326,
                workbookTotalPages: 197,
                units: []
            ),
            schoolQuestions: [],
            diagramPlates: []
        )
    }
}
