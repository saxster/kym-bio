import SwiftUI
import WidgetKit

struct KymBioWidgetEntry: TimelineEntry {
    let date: Date
    let dueCardsCount: Int
    let activeUnitTitle: String
    let readinessPercent: Int
    let nextQuestionPrompt: String
}

struct KymBioTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> KymBioWidgetEntry {
        defaultEntry()
    }

    func getSnapshot(in context: Context, completion: @escaping (KymBioWidgetEntry) -> Void) {
        completion(loadEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<KymBioWidgetEntry>) -> Void) {
        let entry = loadEntry()
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date()
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }

    private func defaultEntry() -> KymBioWidgetEntry {
        KymBioWidgetEntry(
            date: Date(),
            dueCardsCount: 4,
            activeUnitTitle: "Unit 7: Diet and growth",
            readinessPercent: 78,
            nextQuestionPrompt: "Explain why two muscles (biceps and triceps) are needed to bend and straighten the elbow joint."
        )
    }

    private func loadEntry() -> KymBioWidgetEntry {
        let snap = SystemSurfaceSnapshotStore.shared.loadSnapshot()
        let total = max(1, snap.totalQuestionsCount)
        let pct = max(50, Int((Double(snap.provenQuestionsCount) / Double(total)) * 100.0))
        return KymBioWidgetEntry(
            date: snap.updatedAt,
            dueCardsCount: snap.dueCardsCount,
            activeUnitTitle: snap.nextDeadlineTitle,
            readinessPercent: pct,
            nextQuestionPrompt: snap.nextQuestionPrompt
        )
    }
}

struct KymBioDailyGlanceWidgetView: View {
    var entry: KymBioTimelineProvider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Label("KymBio", systemImage: "leaf.fill")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(Color(red: 0.34, green: 0.25, blue: 0.68))
                Spacer()
                Text("\(entry.readinessPercent)% ready")
                    .font(.caption2.weight(.semibold))
                    .foregroundStyle(.secondary)
            }

            Text(entry.activeUnitTitle)
                .font(.subheadline.weight(.bold))
                .lineLimit(1)

            Text(entry.nextQuestionPrompt)
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(2)

            Spacer(minLength: 0)

            HStack {
                Label("\(entry.dueCardsCount) cards due", systemImage: "rectangle.stack.fill")
                    .font(.caption2.weight(.semibold))
                Spacer()
                Text("Open Ritual →")
                    .font(.caption2.weight(.bold))
                    .foregroundStyle(Color(red: 0.34, green: 0.25, blue: 0.68))
            }
        }
        .padding(12)
        .containerBackground(.fill.tertiary, for: .widget)
    }
}

@main
struct KymBioWidgetsBundle: WidgetBundle {
    var body: some Widget {
        KymBioDailyGlanceWidget()
    }
}

struct KymBioDailyGlanceWidget: Widget {
    let kind: String = "KymBioDailyGlanceWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: KymBioTimelineProvider()) { entry in
            KymBioDailyGlanceWidgetView(entry: entry)
        }
        .configurationDisplayName("KymBio Daily Study Glance")
        .description("Shows your upcoming Cambridge Science 8 unit, due FSRS memory cards, and next question proof.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
