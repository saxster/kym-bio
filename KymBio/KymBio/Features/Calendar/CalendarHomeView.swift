import Combine
import EventKit
import SwiftUI
#if canImport(ActivityKit) && os(iOS)
import ActivityKit

struct WetLabActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var stageIndex: Int
        var totalStages: Int
        var stageDescription: String
        var secondsRemaining: Int
    }
    var labTitle: String
    var topicCode: String
}
#endif

struct WetLabProtocolSpec: Identifiable, Equatable, Sendable {
    let id: String
    let title: String
    let chapterNumber: Int
    let schoolTopic: String
    let durationMinutes: Int
    let stages: [String]
    let apparatusSummary: String
}

struct CalendarHomeView: View {
    @EnvironmentObject private var store: AppStore
    @State private var newDeadlineTitle: String = ""
    @State private var newDeadlineUnits: String = "7"
    @State private var newDeadlineDate: Date = Date().addingTimeInterval(7 * 86_400)
    @State private var calendarStatusMessage: String? = nil
    @State private var importedCalendarEventTitles: [String] = []
    @State private var activeWetLab: WetLabProtocolSpec? = nil
    @State private var wetLabCurrentStage: Int = 0
    @State private var wetLabSecondsRemaining: Int = 0
    @State private var isWetLabPaused: Bool = false

    private let wetLabTicker = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    static let wetLabProtocols: [WetLabProtocolSpec] = [
        WetLabProtocolSpec(
            id: "wetlab-ch01-moong",
            title: "Ch 1 & Unit 1.4 · Germinating Moong Bean Imbibition & Heat Release",
            chapterNumber: 1,
            schoolTopic: "1.4",
            durationMinutes: 45,
            stages: [
                "Stage 1: Weigh dry moong seeds and place in Jar A (soaked at 28 °C) vs Jar B (boiled control)",
                "Stage 2: Measure water uptake and seed coat swelling after imbibition",
                "Stage 3: Record thermometer temperature rise from exothermic aerobic respiration"
            ],
            apparatusSummary: "Two small jars, 30 g moong beans, kitchen scale, thermometer, warm water"
        ),
        WetLabProtocolSpec(
            id: "wetlab-ch03-osmosis",
            title: "Ch 3 & Unit 2.2 · Potato Cylinder Osmosis Across Sucrose Concentrations",
            chapterNumber: 3,
            schoolTopic: "2.2",
            durationMinutes: 30,
            stages: [
                "Stage 1: Cut three 50 mm potato strips, blot dry, and record initial mass & length",
                "Stage 2: Immerse in pure water (0 M), isotonic (0.3 M) and concentrated salt/sugar (0.8 M) for 30 min",
                "Stage 3: Blot gently, re-weigh, calculate percentage change in mass and plot isotonic point"
            ],
            apparatusSummary: "1 large potato, ruler (mm), 3 glasses, table salt or sugar, kitchen balance"
        ),
        WetLabProtocolSpec(
            id: "wetlab-ch06-yeast",
            title: "Ch 6 & Unit 1.4 · Yeast Respiration Rate vs Temperature",
            chapterNumber: 6,
            schoolTopic: "1.4",
            durationMinutes: 25,
            stages: [
                "Stage 1: Dissolve 5 g sugar + 5 g baker's yeast in warm water (35 °C) vs cool water (15 °C)",
                "Stage 2: Stretch balloon over bottle neck and measure circumference every 5 minutes",
                "Stage 3: Bubble gas through limewater to verify CO₂ turns limewater cloudy"
            ],
            apparatusSummary: "Dried yeast, sugar, 2 small bottles, balloons, thermometer, string & ruler"
        ),
        WetLabProtocolSpec(
            id: "wetlab-ch12-curd",
            title: "Ch 12 · Lactobacillus Fermentation (Milk → Dahi / Curd)",
            chapterNumber: 12,
            schoolTopic: "7.1",
            durationMinutes: 60,
            stages: [
                "Stage 1: Warm milk to 40 °C and whisk in 1 teaspoon live starter curd (Lactobacillus)",
                "Stage 2: Incubate insulated bowl; bacteria convert lactose → lactic acid (pH drops to ~4.5)",
                "Stage 3: Observe casein protein coagulation into a firm gel network"
            ],
            apparatusSummary: "250 mL milk, 1 tsp starter dahi, thermometer, insulated bowl"
        )
    ]

    var body: some View {
        JournalPage(
            title: "Calendar, Run My Day & Wet Labs",
            subtitle: "Science 8 exam planner, 30-minute daily study blocks and kitchen wet-lab timers"
        ) {
            runMyDaySection
            deadlinesSection
            wetLabsSection
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                ThemePickerMenu()
            }
        }
    }

    // MARK: - Run My Day (30-Minute Interleaved Study Block)

    private var runMyDaySection: some View {
        let nextQuestion = store.pack.schoolQuestions.first {
            !store.proofLevel(for: $0.id).isIndependentProof
        } ?? store.pack.schoolQuestions.first

        return JournalSection(title: "Run My Day — Today's 30-minute Biology study block") {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    HStack {
                        JournalBadge(symbol: "calendar.badge.clock", tint: .kymaiaPrimary, size: .row)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("30-minute interleaved Biology block")
                                .font(.kymaiaCardTitle)
                            Text("Combines first-principles reading, an interactive 3D/2D lab, and an independent Cambridge Science 8 Question Proof.")
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaMutedInk)
                        }
                        Spacer()
                        Button {
                            exportStudyBlockToAppleCalendar(question: nextQuestion)
                        } label: {
                            Label("Add to Apple Calendar", systemImage: "calendar.badge.plus")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                        .accessibilityIdentifier("calendar.export-eventkit")

                        Button {
                            syncUpcomingAppleCalendarEvents()
                        } label: {
                            Label("Read school calendar", systemImage: "arrow.triangle.2.circlepath")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        .accessibilityIdentifier("calendar.import-eventkit")
                    }

                    if let msg = calendarStatusMessage {
                        Text(msg)
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaSuccess)
                    }

                    if !importedCalendarEventTitles.isEmpty {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Upcoming Apple Calendar events (next 14 days):")
                                .font(.kymaiaCaption.weight(.semibold))
                                .foregroundStyle(Color.kymaiaPrimary)
                            ForEach(importedCalendarEventTitles, id: \.self) { evTitle in
                                Text("• \(evTitle)")
                                    .font(.kymaiaCaption)
                                    .foregroundStyle(Color.kymaiaMutedInk)
                            }
                        }
                    }

                    JournalCardRow {
                        VStack(alignment: .leading, spacing: 4) {
                            JournalChip(text: "Step 1 · 10 min", tone: .accent)
                            Text("Read Ch \(nextQuestion?.linkedChapter ?? 4) in The Living World")
                                .font(.kymaiaBody.weight(.semibold))
                            Text("Commit predictions before revealing explanations.")
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaMutedInk)
                            Button("Open Chapter") {
                                store.activeLivingWorldChapter = nextQuestion?.linkedChapter ?? 4
                                store.selectedRoom = .livingWorld
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        }
                        .journalMiniCard()

                        VStack(alignment: .leading, spacing: 4) {
                            JournalChip(text: "Step 2 · 8 min", tone: .good)
                            Text("Run Lab: \(nextQuestion?.linkedWidget.replacingOccurrences(of: "_", with: " ") ?? "food tests bench")")
                                .font(.kymaiaBody.weight(.semibold))
                            Text("Complete the micro-challenge and inspect the cutaway.")
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaMutedInk)
                            Button("Open 3D/2D Lab") {
                                store.activeWidgetId = nextQuestion?.linkedWidget
                                store.selectedRoom = .labsAtlas
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        }
                        .journalMiniCard()

                        VStack(alignment: .leading, spacing: 4) {
                            JournalChip(text: "Step 3 · 12 min", tone: .warn)
                            Text("Prove Topic \(nextQuestion?.topicCode ?? "7.1") without hints")
                                .font(.kymaiaBody.weight(.semibold))
                            Text("\(store.dueFSRSCards.count) FSRS cards due after proof.")
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaMutedInk)
                            Button("Start Question Proof") {
                                store.activePracticeQuestion = nextQuestion
                                store.selectedRoom = .schoolScience
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                        }
                        .journalMiniCard()
                    }
                }
            }
        }
    }

    // MARK: - School Science 8 Deadlines

    private var deadlinesSection: some View {
        JournalSection(title: "Upcoming Cambridge Science 8 tests & workbook deadlines") {
            VStack(spacing: Spacing.md) {
                ForEach(store.deadlines) { deadline in
                    JournalCard {
                        HStack(alignment: .top, spacing: Spacing.md) {
                            JournalBadge(symbol: "flag.fill", tint: .kymaiaSecondary, size: .row)
                            VStack(alignment: .leading, spacing: 4) {
                                HStack(spacing: Spacing.xs) {
                                    Text(deadline.title)
                                        .font(.kymaiaCardTitle)
                                    JournalChip(text: "Units \(deadline.unitNumbersCSV)", tone: .accent)
                                }
                                Text(deadline.notes)
                                    .font(.kymaiaCaption)
                                    .foregroundStyle(Color.kymaiaMutedInk)
                            }
                            Spacer()
                            Text(deadline.dueAt, style: .date)
                                .font(.kymaiaCaption.monospacedDigit())
                                .foregroundStyle(Color.kymaiaPrimary)
                        }
                    }
                }

                JournalCard {
                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        Text("Add a school test or Workbook due date")
                            .font(.kymaiaCardTitle)
                        HStack(spacing: Spacing.sm) {
                            TextField("e.g. Unit 7 Diet and growth test", text: $newDeadlineTitle)
                                .learnerTextInput(.reflection)
                                .textFieldStyle(.roundedBorder)
                            TextField("Units (e.g. 7 or 1,4,7)", text: $newDeadlineUnits)
                                .learnerTextInput(.reflection)
                                .frame(maxWidth: 140)
                                .textFieldStyle(.roundedBorder)
                            DatePicker("Due", selection: $newDeadlineDate, displayedComponents: .date)
                                .labelsHidden()
                            Button("Save deadline") {
                                guard !newDeadlineTitle.trimmingCharacters(in: .whitespaces).isEmpty else { return }
                                store.addDeadline(
                                    title: newDeadlineTitle,
                                    unitNumbersCSV: newDeadlineUnits,
                                    dueAt: newDeadlineDate,
                                    kind: "unit_test",
                                    notes: "Added from Calendar room"
                                )
                                newDeadlineTitle = ""
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            .accessibilityIdentifier("calendar.add-deadline")
                        }
                    }
                }
            }
        }
    }

    // MARK: - Kitchen Wet-Lab Multi-Stage Timers

    private var wetLabsSection: some View {
        JournalSection(title: "Try-at-home kitchen wet-lab timers & protocols") {
            if let active = activeWetLab {
                JournalCard {
                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        HStack {
                            JournalChip(text: "Active Wet Lab · Stage \(wetLabCurrentStage + 1) of \(active.stages.count)", tone: .good)
                            JournalChip(
                                label: String(format: "%02d:%02d remaining", wetLabSecondsRemaining / 60, wetLabSecondsRemaining % 60),
                                systemImage: isWetLabPaused ? "pause.circle.fill" : "timer",
                                tone: .accent
                            )
                            Spacer()
                            Button(isWetLabPaused ? "Resume" : "Pause") {
                                isWetLabPaused.toggle()
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            Button("End timer") {
                                activeWetLab = nil
                                wetLabSecondsRemaining = 0
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                        }
                        Text(active.title)
                            .font(.kymaiaCardTitle)
                        Text(active.stages[min(wetLabCurrentStage, active.stages.count - 1)])
                            .font(.kymaiaSerifProse)
                            .foregroundStyle(Color.kymaiaPrimary)
                        HStack(spacing: Spacing.sm) {
                            if wetLabCurrentStage + 1 < active.stages.count {
                                Button("Advance to Stage \(wetLabCurrentStage + 2)") {
                                    wetLabCurrentStage += 1
                                    let stageDurationSeconds = max(60, (active.durationMinutes * 60) / max(1, active.stages.count))
                                    wetLabSecondsRemaining = stageDurationSeconds
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                            }
                            Button("Record observations in Lab Journal") {
                                store.selectedRoom = .labJournal
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        }
                    }
                }
                .onReceive(wetLabTicker) { _ in
                    guard activeWetLab != nil, !isWetLabPaused else { return }
                    if wetLabSecondsRemaining > 0 {
                        wetLabSecondsRemaining -= 1
                    } else if let lab = activeWetLab, wetLabCurrentStage + 1 < lab.stages.count {
                        wetLabCurrentStage += 1
                        wetLabSecondsRemaining = max(60, (lab.durationMinutes * 60) / max(1, lab.stages.count))
                    }
                }
            }

            VStack(spacing: Spacing.md) {
                ForEach(Self.wetLabProtocols) { lab in
                    JournalCard {
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            HStack {
                                JournalChip(text: "Ch \(lab.chapterNumber) · Topic \(lab.schoolTopic)", tone: .accent)
                                JournalChip(text: "\(lab.durationMinutes) min", tone: .neutral)
                                Spacer()
                            }
                            Text(lab.title)
                                .font(.kymaiaCardTitle)
                            Text("Apparatus: \(lab.apparatusSummary)")
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaMutedInk)
                            ForEach(lab.stages, id: \.self) { st in
                                Text("• \(st)")
                                    .font(.kymaiaCaption)
                                    .foregroundStyle(Color.kymaiaInk)
                            }
                            Button {
                                activeWetLab = lab
                                wetLabCurrentStage = 0
                                isWetLabPaused = false
                                wetLabSecondsRemaining = max(60, (lab.durationMinutes * 60) / max(1, lab.stages.count))
                            } label: {
                                Label("Start multi-stage wet-lab timer", systemImage: "timer")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            .accessibilityIdentifier("calendar.wetlab.\(lab.id)")
                        }
                    }
                }
            }
        }
    }

    private func syncUpcomingAppleCalendarEvents() {
        let eventStore = EKEventStore()
        Task { @MainActor in
            do {
                let granted: Bool
                if #available(iOS 17.0, macOS 14.0, *) {
                    granted = try await eventStore.requestFullAccessToEvents()
                } else {
                    granted = try await eventStore.requestAccess(to: .event)
                }
                guard granted else {
                    calendarStatusMessage = "Calendar read permission was not granted."
                    return
                }
                let now = Date()
                let twoWeeks = now.addingTimeInterval(14 * 86_400)
                let predicate = eventStore.predicateForEvents(withStart: now, end: twoWeeks, calendars: nil)
                let events = eventStore.events(matching: predicate).prefix(5)
                importedCalendarEventTitles = events.map { "\($0.title ?? "Event") (\($0.startDate.formatted(date: .abbreviated, time: .shortened)))" }
                calendarStatusMessage = "Read \(importedCalendarEventTitles.count) upcoming event(s) from your Apple Calendar."
            } catch {
                calendarStatusMessage = "Could not read Apple Calendar: \(error.localizedDescription)"
            }
        }
    }

    private func exportStudyBlockToAppleCalendar(question: SchoolScienceQuestion?) {
        let eventStore = EKEventStore()
        Task { @MainActor in
            do {
                let granted: Bool
                if #available(iOS 17.0, macOS 14.0, *) {
                    granted = try await eventStore.requestFullAccessToEvents()
                } else {
                    granted = try await eventStore.requestAccess(to: .event)
                }
                guard granted else {
                    calendarStatusMessage = "Calendar permission was not granted. Enable Calendar access in System Settings to write study blocks."
                    return
                }
                let event = EKEvent(eventStore: eventStore)
                event.title = "KymBio · 30-min Biology Study Block (Topic \(question?.topicCode ?? "7.1"))"
                event.startDate = Date().addingTimeInterval(300)
                event.endDate = Date().addingTimeInterval(300 + 1800)
                event.notes = "10 min Living World Ch \(question?.linkedChapter ?? 4) + 8 min 3D Lab + 12 min Cambridge Science 8 Question Proof."
                event.calendar = eventStore.defaultCalendarForNewEvents
                try eventStore.save(event, span: .thisEvent)
                calendarStatusMessage = "Saved 30-minute Biology study block to your Apple Calendar."
            } catch {
                calendarStatusMessage = "Could not save to Apple Calendar: \(error.localizedDescription)"
            }
        }
    }
}
