import AppIntents
import Foundation

struct WhatsNextInBiologyIntent: AppIntent {
    static var title: LocalizedStringResource = "What's Next in Biology & Science"
    static var description = IntentDescription("Reads your next Cambridge Science 8 Question Proof, due FSRS cards, and upcoming Biology deadline.")
    static var openAppWhenRun: Bool = false

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let snap = SystemSurfaceSnapshotStore.shared.loadSnapshot()
        let dialog = IntentDialog(
            "You have \(snap.dueCardsCount) Biology cards due for review, and \(snap.provenQuestionsCount) of \(snap.totalQuestionsCount) school questions proven. Next up is Topic \(snap.nextQuestionTopic) ahead of \(snap.nextDeadlineTitle)."
        )
        return .result(dialog: dialog)
    }
}

struct StartBiologyPracticeIntent: AppIntent {
    static var title: LocalizedStringResource = "Start Biology Question Proof"
    static var description = IntentDescription("Opens KymBio directly to your next Cambridge Science 8 Learner's Book or Workbook Question Proof.")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let snap = SystemSurfaceSnapshotStore.shared.loadSnapshot()
        let store = AppStore.shared
        store.selectedRoom = .schoolScience
        if let q = store.pack.schoolQuestions.first(where: { $0.id == snap.nextQuestionId }) {
            store.selectedUnitNumber = q.unitNumber
            store.activePracticeQuestion = q
        }
        return .result(dialog: "Opening Topic \(snap.nextQuestionTopic) in KymBio.")
    }
}

struct RunMyBiologyDayIntent: AppIntent {
    static var title: LocalizedStringResource = "Run My Biology Day"
    static var description = IntentDescription("Builds a 30-minute Biology study block combining a Living World chapter, 3D lab, and Cambridge Science 8 Question Proof.")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let store = AppStore.shared
        store.selectedRoom = .calendar
        return .result(dialog: "Here is your 30-minute Biology study plan for today.")
    }
}

struct OpenBiologyLabIntent: AppIntent {
    static var title: LocalizedStringResource = "Open 3D Biology Lab"
    static var description = IntentDescription("Opens the 3D Labs, Atlas and Specimen Diagram Recall bench in KymBio.")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        AppStore.shared.selectedRoom = .labsAtlas
        return .result(dialog: "Opening the 3D Biology Labs and Diagram Recall bench.")
    }
}

struct OpenSchoolScienceUnitIntent: AppIntent {
    static var title: LocalizedStringResource = "Open Cambridge Science 8 Unit"
    static var description = IntentDescription("Opens KymBio to your active Cambridge Lower Secondary Science 8 unit (Unit 7: Diet and growth).")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let store = AppStore.shared
        store.selectedRoom = .schoolScience
        return .result(dialog: "Opening Cambridge Science 8 Unit \(store.selectedUnitNumber) in KymBio.")
    }
}

struct OpenLivingWorldChapterIntent: AppIntent {
    static var title: LocalizedStringResource = "Open Living World Chapter"
    static var description = IntentDescription("Opens your current first-principles chapter in The Living World.")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let store = AppStore.shared
        store.selectedRoom = .livingWorld
        return .result(dialog: "Opening Chapter \(store.activeLivingWorldChapter) of The Living World.")
    }
}

struct StartCornellNoteIntent: AppIntent {
    static var title: LocalizedStringResource = "Start Biology Cornell Note"
    static var description = IntentDescription("Creates or opens a Cornell Notes page in Kym's Biology Lab Journal.")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        AppStore.shared.selectedRoom = .labJournal
        return .result(dialog: "Opening your Biology Cornell Notes and Lab Journal.")
    }
}

struct OpenBiologyVaultIntent: AppIntent {
    static var title: LocalizedStringResource = "Practice Biology Learn by Heart Vault"
    static var description = IntentDescription("Opens the Biology Learn by Heart Vault, Greek and Latin Roots, and Visual Field Guides.")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        AppStore.shared.selectedRoom = .vaultAndTips
        return .result(dialog: "Opening your Biology Learn by Heart Vault and Greek & Latin Roots.")
    }
}

struct OpenQuantitativeBioBenchIntent: AppIntent {
    static var title: LocalizedStringResource = "Open Quantitative Biology Bench"
    static var description = IntentDescription("Opens the Socratic Biology Coach and 16-template Quantitative Biology calculation bench.")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        AppStore.shared.selectedRoom = .coach
        return .result(dialog: "Opening the Socratic Biology Coach and Quantitative Bench.")
    }
}

struct StartTodayBiologyRitualIntent: AppIntent {
    static var title: LocalizedStringResource = "Start Today's Biology Ritual"
    static var description = IntentDescription("Opens the 6-phase Daily Biology Ritual and FSRS spaced-memory deck.")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        AppStore.shared.selectedRoom = .today
        return .result(dialog: "Starting today's 6-phase Biology ritual.")
    }
}

struct KymBioShortcutsProvider: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: WhatsNextInBiologyIntent(),
            phrases: [
                "What's next in Biology in \(.applicationName)",
                "What's next in Science in \(.applicationName)",
                "Check my Biology readiness in \(.applicationName)"
            ],
            shortTitle: "What's Next in Biology",
            systemImageName: "leaf.fill"
        )
        AppShortcut(
            intent: StartBiologyPracticeIntent(),
            phrases: [
                "Practise Biology in \(.applicationName)",
                "Start Science 8 practice in \(.applicationName)",
                "Test me on Biology in \(.applicationName)"
            ],
            shortTitle: "Practise Biology",
            systemImageName: "checkmark.seal.fill"
        )
        AppShortcut(
            intent: RunMyBiologyDayIntent(),
            phrases: [
                "Run my Biology day in \(.applicationName)",
                "Plan my Science revision in \(.applicationName)"
            ],
            shortTitle: "Run My Day",
            systemImageName: "calendar.badge.clock"
        )
        AppShortcut(
            intent: OpenBiologyLabIntent(),
            phrases: [
                "Open 3D Biology lab in \(.applicationName)",
                "Practise Biology diagrams in \(.applicationName)"
            ],
            shortTitle: "3D Labs & Diagrams",
            systemImageName: "cube.transparent.fill"
        )
        AppShortcut(
            intent: OpenSchoolScienceUnitIntent(),
            phrases: [
                "Open School Science textbook in \(.applicationName)",
                "Open Cambridge Science 8 in \(.applicationName)"
            ],
            shortTitle: "School Science 8",
            systemImageName: "book.closed.fill"
        )
        AppShortcut(
            intent: OpenLivingWorldChapterIntent(),
            phrases: [
                "Read The Living World in \(.applicationName)",
                "Open Biology chapter in \(.applicationName)"
            ],
            shortTitle: "The Living World",
            systemImageName: "sparkles.tv.fill"
        )
        AppShortcut(
            intent: StartCornellNoteIntent(),
            phrases: [
                "Start a Biology Cornell note in \(.applicationName)",
                "Open my Biology Lab Journal in \(.applicationName)"
            ],
            shortTitle: "Cornell Notes & Lab Log",
            systemImageName: "pencil.and.scribble"
        )
        AppShortcut(
            intent: OpenBiologyVaultIntent(),
            phrases: [
                "Open Biology Learn by Heart Vault in \(.applicationName)",
                "Practise Greek and Latin biology roots in \(.applicationName)"
            ],
            shortTitle: "Vault & Roots",
            systemImageName: "sparkles.rectangle.stack.fill"
        )
        AppShortcut(
            intent: OpenQuantitativeBioBenchIntent(),
            phrases: [
                "Open Quantitative Biology bench in \(.applicationName)",
                "Ask the Biology Coach in \(.applicationName)"
            ],
            shortTitle: "Coach & Quant Bench",
            systemImageName: "bubble.left.and.text.bubble.right.fill"
        )
        AppShortcut(
            intent: StartTodayBiologyRitualIntent(),
            phrases: [
                "Start today's Biology ritual in \(.applicationName)",
                "Review my due Biology cards in \(.applicationName)"
            ],
            shortTitle: "Today's Ritual",
            systemImageName: "sun.max.fill"
        )
    }
}
