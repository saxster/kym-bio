import CoreSpotlight
import Foundation
import UniformTypeIdentifiers

struct SystemSurfaceSnapshot: Codable, Equatable, Sendable {
    let dueCardsCount: Int
    let nextQuestionId: String
    let nextQuestionTopic: String
    let nextQuestionPrompt: String
    let nextDeadlineTitle: String
    let nextDeadlineDueAt: Date
    let provenQuestionsCount: Int
    let totalQuestionsCount: Int
    let updatedAt: Date
}

final class SystemSurfaceSnapshotStore: Sendable {
    static let shared = SystemSurfaceSnapshotStore()
    static let snapshotKey = "kymbio.systemSurfaceSnapshot"

    #if !KYMBIO_WIDGET_EXTENSION
    @MainActor
    func publishSnapshot(from store: AppStore) {
        let dueCount = store.dueFSRSCards.count
        let nextQuestion = store.pack.schoolQuestions.first { q in
            !store.proofLevel(for: q.id).isIndependentProof
        } ?? store.pack.schoolQuestions.first

        let nextDeadline = store.deadlines.first
        let provenCount = store.questionProofs.values.filter { $0.level.isIndependentProof }.count

        let snap = SystemSurfaceSnapshot(
            dueCardsCount: dueCount,
            nextQuestionId: nextQuestion?.id ?? "q-u7-7.1-lb",
            nextQuestionTopic: nextQuestion?.topicCode ?? "7.1",
            nextQuestionPrompt: nextQuestion?.prompt ?? "Review Unit 7.1 Nutrients and food tests.",
            nextDeadlineTitle: nextDeadline?.title ?? "Unit 7: Diet and growth",
            nextDeadlineDueAt: nextDeadline?.dueAt ?? Date().addingTimeInterval(6 * 86_400),
            provenQuestionsCount: provenCount,
            totalQuestionsCount: store.pack.schoolQuestions.count,
            updatedAt: Date()
        )

        if let data = try? JSONEncoder().encode(snap) {
            UserDefaults.standard.set(data, forKey: Self.snapshotKey)
            if let groupDefaults = UserDefaults(suiteName: "group.com.kymaia.science") {
                groupDefaults.set(data, forKey: Self.snapshotKey)
            }
        }
    }
    #endif

    func loadSnapshot() -> SystemSurfaceSnapshot {
        let defaults = UserDefaults(suiteName: "group.com.kymaia.science") ?? .standard
        if let data = defaults.data(forKey: Self.snapshotKey) ?? UserDefaults.standard.data(forKey: Self.snapshotKey),
           let decoded = try? JSONDecoder().decode(SystemSurfaceSnapshot.self, from: data) {
            return decoded
        }
        return SystemSurfaceSnapshot(
            dueCardsCount: 15,
            nextQuestionId: "q-u7-7.1-lb",
            nextQuestionTopic: "7.1",
            nextQuestionPrompt: "Describe how you would test food for starch and reducing sugar, and explain iron deficiency.",
            nextDeadlineTitle: "Unit 7: Diet and growth — Topic & Workbook proof",
            nextDeadlineDueAt: Date().addingTimeInterval(6 * 86_400),
            provenQuestionsCount: 0,
            totalQuestionsCount: 15,
            updatedAt: Date()
        )
    }

    #if !KYMBIO_WIDGET_EXTENSION
    /// Indexes all 16 Living World chapters and 44 Cambridge Science 8 sub-topics into CoreSpotlight.
    func indexContentInSpotlight(pack: KymBioSeedPack) {
        guard CSSearchableIndex.isIndexingAvailable() else { return }
        var items: [CSSearchableItem] = []

        for ch in pack.chapters {
            let attr = CSSearchableItemAttributeSet(contentType: UTType.text)
            attr.title = "Chapter \(ch.number): \(ch.title) — The Living World"
            attr.contentDescription = ch.hookSummary
            attr.keywords = ch.keyTerms + ["Biology", "Living World", "Chapter \(ch.number)"]
            items.append(
                CSSearchableItem(
                    uniqueIdentifier: "kymbio://chapter/ch\(String(format: "%02d", ch.number))",
                    domainIdentifier: "com.kymaia.bio.chapters",
                    attributeSet: attr
                )
            )
        }

        for unit in pack.schoolTextbook.units {
            for topic in unit.topics {
                let attr = CSSearchableItemAttributeSet(contentType: UTType.text)
                attr.title = "Science 8 Topic \(topic.code): \(topic.title) (LB p. \(topic.learnersBookPage), WB p. \(topic.workbookPage))"
                attr.contentDescription = topic.summary
                attr.keywords = ["Cambridge Science 8", "Unit \(unit.unitNumber)", topic.code, topic.title]
                items.append(
                    CSSearchableItem(
                        uniqueIdentifier: "kymbio://topic/\(topic.code)",
                        domainIdentifier: "com.kymaia.bio.school",
                        attributeSet: attr
                    )
                )
            }
        }

        CSSearchableIndex.default().indexSearchableItems(items, completionHandler: nil)
    }
    #endif
}
