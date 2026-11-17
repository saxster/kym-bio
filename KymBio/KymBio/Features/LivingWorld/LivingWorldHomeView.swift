import SwiftUI

enum LivingWorldPresentationMode: String, CaseIterable, Identifiable, Sendable {
    case interactiveBeats = "interactive_beats"
    case nativeJournal = "native_journal"
    case interactiveWebBook = "interactive_web_book"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .interactiveBeats: return "Step-by-Step Guide"
        case .nativeJournal: return "Chapter Summary & Notes"
        case .interactiveWebBook: return "Full Illustrated Book & 3D Stage"
        }
    }
}

struct LivingWorldHomeView: View {
    @EnvironmentObject private var store: AppStore
    @StateObject private var audioNarrator = ChapterAudioNarrator()
    @State private var presentationMode: LivingWorldPresentationMode = .interactiveBeats
    @State private var selectedVolumeNumber: Int = 1
    @State private var activeBeatIndexByChapter: [Int: Int] = [:]
    @State private var completedDebateChapterIds: Set<Int> = []
    @State private var predictionInputs: [String: String] = [:]
    @State private var unlockedCalloutIds: Set<String> = []

    private var activeChapter: LivingWorldChapter? {
        store.pack.chapters.first(where: { $0.number == store.activeLivingWorldChapter })
            ?? store.pack.chapters.first
    }

    var body: some View {
        JournalPage(
            title: "The Living World",
            eyebrow: "Story textbook",
            subtitle: "First-principles biology across 4 volumes, 16 chapters and 4 interactive explorers"
        ) {
            modeAndExplorersSection
            volumeAndChapterPickerSection
            switch presentationMode {
            case .interactiveBeats:
                if let chapter = activeChapter {
                    interactiveBeatsChapterView(chapter)
                }
            case .nativeJournal:
                if let chapter = activeChapter {
                    nativeChapterReaderSection(for: chapter)
                }
            case .interactiveWebBook:
                interactiveWebStageCard
            }
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                StandardThemeMenu()
            }
        }
        .onChange(of: store.activeLivingWorldChapter) { _, newChapter in
            audioNarrator.stop()
            if let ch = store.pack.chapters.first(where: { $0.number == newChapter }) {
                selectedVolumeNumber = ch.volumeNumber
            }
        }
        .onDisappear {
            audioNarrator.stop()
        }
    }

    // MARK: - Mode Switcher & 4 Front-Matter Explorers

    private var modeAndExplorersSection: some View {
        VStack(alignment: .leading, spacing: Spacing.md) {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    HStack {
                        JournalBadge(symbol: "leaf.fill", tint: .kymaiaSuccess, size: .row)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Reading & simulation mode")
                                .font(.kymaiaCardTitle)
                                .foregroundStyle(Color.kymaiaInk)
                            Text("Switch anytime between the structured Journal study reader and the full interactive HTML5/Three.js book.")
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaMutedInk)
                        }
                        Spacer()
                    }
                    AdaptiveOptionPicker(
                        "Reading mode",
                        selection: $presentationMode,
                        options: LivingWorldPresentationMode.allCases,
                        titleForOption: \.title
                    )
                    .accessibilityIdentifier("living-world.mode-picker")
                }
            }

            JournalSection(title: "4 Front-matter interactive explorers") {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: JournalLayout.cardRowSpacing) {
                        ForEach(store.pack.explorers) { explorer in
                            Button {
                                store.activeExplorerId = explorer.id
                                presentationMode = .interactiveWebBook
                            } label: {
                                VStack(alignment: .leading, spacing: Spacing.xs) {
                                    HStack {
                                        JournalBadge(symbol: explorer.symbol, tint: .kymaiaPrimary, size: .row)
                                        Spacer()
                                        JournalChip(text: "Interactive", tone: .accent)
                                    }
                                    Text(explorer.title)
                                        .font(.kymaiaCardTitle)
                                        .foregroundStyle(Color.kymaiaInk)
                                    Text(explorer.subtitle)
                                        .font(.kymaiaCaption)
                                        .foregroundStyle(Color.kymaiaMutedInk)
                                        .lineLimit(2)
                                }
                                .frame(width: 248, alignment: .topLeading)
                                .kymaiaPaperCard(padding: Spacing.md)
                            }
                            .buttonStyle(.plain)
                            .accessibilityIdentifier("living-world.explorer.\(explorer.id)")
                        }
                    }
                }
            }
        }
    }

    // MARK: - Volume & Chapter Selector

    private var volumeAndChapterPickerSection: some View {
        JournalSection(title: "Volumes & chapters (Ch 0 – Ch 15)") {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: Spacing.xs) {
                        ForEach(store.pack.volumes) { vol in
                            Button {
                                selectedVolumeNumber = vol.number
                                if let firstCh = vol.chapters.first {
                                    store.activeLivingWorldChapter = firstCh
                                }
                            } label: {
                                Text(vol.title)
                            }
                            .buttonStyle(
                                JournalCapsuleButtonStyle(
                                    prominence: selectedVolumeNumber == vol.number ? .filled : .tinted,
                                    size: .small
                                )
                            )
                            .accessibilityIdentifier("living-world.volume.\(vol.number)")
                        }
                    }
                }

                let chaptersInVol = store.pack.chapters.filter { $0.volumeNumber == selectedVolumeNumber }
                FlowLayout(spacing: Spacing.xs) {
                    ForEach(chaptersInVol) { ch in
                        let isSelected = ch.number == store.activeLivingWorldChapter
                        Button {
                            store.activeLivingWorldChapter = ch.number
                            store.activeExplorerId = nil
                            store.updateChapterProgress(chapterNumber: ch.number, fraction: 0.6)
                        } label: {
                            Text("Ch \(ch.number): \(ch.title)")
                        }
                        .buttonStyle(
                            JournalCapsuleButtonStyle(
                                prominence: isSelected ? .filled : .ghost,
                                size: .small
                            )
                        )
                        .accessibilityIdentifier("living-world.chapter.\(ch.number)")
                    }
                }
            }
        }
    }

    // MARK: - Full Interactive Web Stage

    private var interactiveWebStageCard: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack {
                    Text(
                        store.activeExplorerId != nil
                            ? "Explorer: \(store.activeExplorerId ?? "")"
                            : "Interactive Book · Chapter \(store.activeLivingWorldChapter)"
                    )
                    .font(.kymaiaCardTitle)
                    Spacer()
                    Button("Back to Journal Reader") {
                        presentationMode = .nativeJournal
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                }

                LivingWorldWebStageView(
                    chapterNumber: store.activeLivingWorldChapter,
                    targetWidgetId: store.activeWidgetId,
                    targetExplorerId: store.activeExplorerId
                )
                .frame(minHeight: 680)
                .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                        .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                )
            }
        }
    }

    // MARK: - Native Journal Chapter Reader

    @ViewBuilder
    private func nativeChapterReaderSection(for chapter: LivingWorldChapter) -> some View {
        let chapterWidgets = store.pack.widgets.filter { $0.chapter == chapter.number }
        let chapterAtlas = store.pack.atlasLessons.filter { $0.chapter == chapter.number }
        let linkedSchoolUnits = store.pack.schoolTextbook.units.filter {
            $0.livingWorldChapters.contains(chapter.number)
        }

        BiologyChapterExplainerBar(
            title: "Chapter \(chapter.number): \(chapter.title)",
            segments: [
                chapter.hookSummary.isEmpty ? "Chapter \(chapter.number): \(chapter.title)" : chapter.hookSummary
            ] + chapter.sections.prefix(3).map { "\($0.heading): \($0.excerpt)" },
            simplerVariant: "In plain words: \(chapter.title) shows how molecules and cells follow physical and chemical rules to keep a living organism running.",
            mumbaiExample: "Think of Mumbai during the monsoon: every cell in a banyan tree along Marine Drive or in your own lungs relies on the exact mechanisms in Chapter \(chapter.number) (\(chapter.title)).",
            quickCheckQuestion: chapter.callouts.first(where: { $0.kind == "check" || $0.kind == "predict" })?.body
                ?? "Can you explain the central mechanism of Chapter \(chapter.number) (\(chapter.title)) using two key terms from this chapter?"
        )
        .id("explainer-ch-\(chapter.number)")

        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack {
                    JournalChip(text: chapter.volumeTitle, tone: .accent)
                    JournalChip(text: "Chapter \(chapter.number)", tone: .good)
                    Spacer()
                    Button {
                        presentationMode = .interactiveWebBook
                    } label: {
                        Label("Open interactive 3D workbench", systemImage: "cube.transparent.fill")
                    }
                    .buttonStyle(BrassButtonStyle())
                    .accessibilityIdentifier("living-world.open-web-workbench")
                }

                Text("Chapter \(chapter.number) — \(chapter.title)")
                    .font(.kymaiaTitle2)
                    .foregroundStyle(Color.kymaiaInk)

                if !chapter.hookSummary.isEmpty {
                    Text(chapter.hookSummary)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaInk)
                }

                if !linkedSchoolUnits.isEmpty {
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Text("Bridges directly to your Cambridge Science 8 textbook:")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaMutedInk)
                        FlowLayout(spacing: Spacing.xs) {
                            ForEach(linkedSchoolUnits) { u in
                                Button {
                                    store.selectedUnitNumber = u.unitNumber
                                    store.selectedRoom = .schoolScience
                                } label: {
                                    Label("Unit \(u.unitNumber): \(u.title) (LB p. \(u.learnersBookStartPage))", systemImage: "book.closed")
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            }
                        }
                    }
                }

                if !chapter.keyTerms.isEmpty {
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Text("Key vocabulary in this chapter")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaMutedInk)
                        FlowLayout(spacing: 6) {
                            ForEach(chapter.keyTerms, id: \.self) { term in
                                JournalChip(text: term, tone: .neutral)
                            }
                        }
                    }
                }
            }
        }

        // Sections
        JournalSection(title: "Sections in Chapter \(chapter.number) (\(chapter.sections.count))") {
            VStack(spacing: Spacing.md) {
                ForEach(chapter.sections) { sec in
                    JournalCard {
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            Text(sec.heading)
                                .font(.kymaiaTitle3)
                                .foregroundStyle(Color.kymaiaInk)
                            Text(sec.excerpt)
                                .font(.kymaiaSerifProse)
                                .foregroundStyle(Color.kymaiaInk)
                        }
                    }
                }
            }
        }

        // Callouts (Predict, Check, Careful, School, Home)
        if !chapter.callouts.isEmpty {
            JournalSection(title: "Predictions, checks, misconception traps & school syllabus bridges") {
                VStack(spacing: Spacing.md) {
                    ForEach(chapter.callouts) { callout in
                        calloutCard(callout, chapterNumber: chapter.number)
                    }
                }
            }
        }

        // Chapter Interactive Widgets & 3D Atlas Lessons
        if !chapterWidgets.isEmpty || !chapterAtlas.isEmpty {
            JournalSection(title: "Interactive simulations (\(chapterWidgets.count)) & 3D Atlas lessons (\(chapterAtlas.count))") {
                VStack(spacing: Spacing.md) {
                    ForEach(chapterWidgets) { widget in
                        JournalCard {
                            VStack(alignment: .leading, spacing: Spacing.sm) {
                                HStack {
                                    JournalChip(text: widget.is3D ? "3D Simulation" : "Interactive Lab", tone: .accent)
                                    if store.widgetStamps[widget.id] != nil {
                                        JournalChip(label: "Stamped", systemImage: "checkmark.seal.fill", tone: .good)
                                    }
                                    Spacer()
                                }
                                Text(widget.title)
                                    .font(.kymaiaCardTitle)
                                Text(widget.challengePrompt)
                                    .font(.kymaiaBody)
                                    .foregroundStyle(Color.kymaiaMutedInk)
                                HStack(spacing: Spacing.sm) {
                                    Button {
                                        store.activeWidgetId = widget.id
                                        store.selectedRoom = .labsAtlas
                                    } label: {
                                        Label("Open in 3D Labs Bench", systemImage: "cube.transparent")
                                    }
                                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

                                    Button {
                                        _ = store.freezeWidgetIntoLabLog(
                                            widget: widget,
                                            readout: "Frozen from Chapter \(chapter.number): \(chapter.title)"
                                        )
                                    } label: {
                                        Label("Freeze & Sketch in Lab Log", systemImage: "pencil.and.scribble")
                                    }
                                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                                }
                            }
                        }
                    }
                }
            }
        }

        // Everyday Clue -> Inside the Cell -> Key Rule Bridge
        JournalSection(title: "How It Works · Everyday Clue to Biology Rule") {
            PhenomenonMechanismBridgeCard(bridge: PhenomenonToMechanismBridge.bridge(forChapter: chapter.number))
        }

        // Peer Biological Debate ("Who Is Right & Why?")
        JournalSection(title: "Who Is Right & Why?") {
            BiologicalDebateCardView(scenario: BiologicalDebateCatalog.scenario(forChapter: chapter.number)) { _ in
                completedDebateChapterIds.insert(chapter.number)
            }
        }
    }

    // MARK: - Step-by-Step Interactive Guide Mode

    @ViewBuilder
    private func interactiveBeatsChapterView(_ chapter: LivingWorldChapter) -> some View {
        let beats = ChapterInteractiveBeatEngine.beats(for: chapter)
        let currentIndex = min(max(0, activeBeatIndexByChapter[chapter.number] ?? 0), max(0, beats.count - 1))
        let currentBeat = beats[currentIndex]
        let isBeatGateSatisfied = isBeatUnlocked(currentBeat, chapterNumber: chapter.number)

        JournalSection(title: "Chapter \(chapter.number): \(chapter.title) · Step \(currentIndex + 1) of \(beats.count)") {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    // Top Read & Listen bar + Step counter
                    HStack(spacing: Spacing.xs) {
                        JournalChip(
                            label: currentBeat.kind.badgeLabel,
                            systemImage: currentBeat.kind.systemImage,
                            tone: .accent
                        )
                        JournalChip(
                            text: "Step \(currentIndex + 1) / \(beats.count) · ~\(max(1, currentBeat.estimatedSeconds / 60))m",
                            tone: .neutral
                        )
                        Spacer()
                        Button {
                            audioNarrator.togglePlayPause(for: currentBeat)
                        } label: {
                            Label(
                                audioNarrator.isPlaying && audioNarrator.activeBeatId == currentBeat.id
                                    ? "Pause"
                                    : "Read & Listen",
                                systemImage: audioNarrator.isPlaying && audioNarrator.activeBeatId == currentBeat.id
                                    ? "pause.circle.fill"
                                    : "speaker.wave.2.fill"
                            )
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        .accessibilityIdentifier("living-world.beat.audio-toggle")

                        Button("\(String(format: "%.2gx", audioNarrator.playbackSpeedMultiplier))") {
                            audioNarrator.cycleSpeed(restartingIfPlaying: currentBeat)
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                        .accessibilityIdentifier("living-world.beat.audio-speed")
                    }

                    // Segmented Step Progress Rail
                    HStack(spacing: Spacing.xs) {
                        ForEach(beats) { beat in
                            Button {
                                audioNarrator.stop()
                                activeBeatIndexByChapter[chapter.number] = beat.index
                            } label: {
                                RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
                                    .fill(
                                        beat.index < currentIndex
                                            ? Color.kymaiaSuccess
                                            : (beat.index == currentIndex ? Color.kymaiaPrimary : Color.kymaiaControlFill)
                                    )
                                    .frame(height: BioFigureGeometry.beatRailHeight)
                            }
                            .buttonStyle(.plain)
                            .accessibilityLabel("Step \(beat.index + 1): \(beat.title)")
                        }
                    }

                    Text(currentBeat.eyebrow)
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaMutedInk)

                    Text(currentBeat.title)
                        .font(.kymaiaTitle3)
                        .foregroundStyle(Color.kymaiaInk)

                    if currentBeat.kind != .interactiveLabAndMechanism && currentBeat.kind != .misconceptionDebate {
                        Text(currentBeat.bodyMarkdown)
                            .font(.kymaiaSerifProse)
                            .foregroundStyle(Color.kymaiaInk)
                    }

                    if !currentBeat.keyTerms.isEmpty {
                        FlowLayout(spacing: Spacing.xs) {
                            ForEach(currentBeat.keyTerms, id: \.self) { term in
                                JournalChip(text: term, tone: .accent)
                            }
                        }
                    }

                    if !currentBeat.widgetIds.isEmpty {
                        FlowLayout(spacing: Spacing.xs) {
                            ForEach(currentBeat.widgetIds, id: \.self) { wid in
                                Button {
                                    store.activeWidgetId = wid
                                    store.selectedRoom = .labsAtlas
                                } label: {
                                    Label("Launch Lab: \(wid.replacingOccurrences(of: "_", with: " "))", systemImage: "cube.transparent")
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            }
                        }
                    }

                    // Prev / Next Beat Navigation
                    HStack(spacing: Spacing.sm) {
                        Button {
                            audioNarrator.stop()
                            if currentIndex > 0 {
                                activeBeatIndexByChapter[chapter.number] = currentIndex - 1
                            }
                        } label: {
                            Label("Previous Beat", systemImage: "chevron.left")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                        .disabled(currentIndex == 0)

                        Spacer()

                        if !isBeatGateSatisfied {
                            JournalChip(
                                label: "Complete check below to unlock next beat",
                                systemImage: "lock.fill",
                                tone: .warn
                            )
                        }

                        Button {
                            audioNarrator.stop()
                            if currentIndex + 1 < beats.count {
                                activeBeatIndexByChapter[chapter.number] = currentIndex + 1
                                let newFraction = Double(currentIndex + 2) / Double(beats.count)
                                store.updateChapterProgress(
                                    chapterNumber: chapter.number,
                                    fraction: newFraction,
                                    addPrediction: false,
                                    addCheck: false
                                )
                            } else {
                                store.updateChapterProgress(
                                    chapterNumber: chapter.number,
                                    fraction: 1.0,
                                    addPrediction: false,
                                    addCheck: true
                                )
                            }
                        } label: {
                            Label(
                                currentIndex + 1 < beats.count ? "Next Beat" : "Complete Chapter \(chapter.number)",
                                systemImage: currentIndex + 1 < beats.count ? "chevron.right" : "checkmark.seal.fill"
                            )
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                        .disabled(!isBeatGateSatisfied)
                        .accessibilityIdentifier("living-world.beat.next")
                    }
                }
            }

            if let callout = currentBeat.callout {
                calloutCard(callout, chapterNumber: chapter.number)
            }

            if let bridge = currentBeat.bridge {
                PhenomenonMechanismBridgeCard(bridge: bridge)
            }

            if let debate = currentBeat.debate {
                BiologicalDebateCardView(scenario: debate) { _ in
                    completedDebateChapterIds.insert(chapter.number)
                }
            }
        }
    }

    private func isBeatUnlocked(_ beat: ChapterInteractiveBeat, chapterNumber: Int) -> Bool {
        guard beat.requiresInteractionToAdvance else { return true }
        switch beat.kind {
        case .calloutGate:
            guard let callout = beat.callout else { return true }
            if callout.kind != "predict" && callout.kind != "check" {
                return true
            }
            return (store.calloutResponses[callout.id]?.isUnlocked == true)
                || unlockedCalloutIds.contains(callout.id)
        case .misconceptionDebate:
            return completedDebateChapterIds.contains(chapterNumber)
        default:
            return true
        }
    }

    private func calloutCard(_ callout: LivingWorldCallout, chapterNumber: Int) -> some View {
        let isGate = (callout.kind == "predict" || callout.kind == "check")
        let persisted = store.calloutResponses[callout.id]
        let isUnlocked = (persisted?.isUnlocked == true) || unlockedCalloutIds.contains(callout.id)
        let currentText = predictionInputs[callout.id] ?? persisted?.responseText ?? ""
        let tone: JournalChip.Tone = {
            switch callout.kind {
            case "careful": return .warn
            case "school", "check": return .good
            default: return .accent
            }
        }()

        let parts: (question: String, reveal: String?) = {
            if let range = callout.body.range(of: "\n\nWhat happens: ") {
                return (String(callout.body[..<range.lowerBound]), String(callout.body[range.upperBound...]))
            }
            if let range = callout.body.range(of: "\n\nAnswer: ") {
                return (String(callout.body[..<range.lowerBound]), String(callout.body[range.upperBound...]))
            }
            return (callout.body, nil)
        }()

        return JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack {
                    Label(callout.badgeText, systemImage: callout.symbolName)
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaPrimary)
                    Spacer()
                    JournalChip(text: callout.title, tone: tone)
                }

                if isGate && !isUnlocked {
                    Text(parts.question)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaInk)

                    Text("Write your prediction or answer before revealing the explanation:")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaMutedInk)
                    TextField(
                        "Type your prediction or explanation…",
                        text: Binding(
                            get: { currentText },
                            set: { predictionInputs[callout.id] = $0 }
                        )
                    )
                    .learnerTextInput(.retrieval)
                    .textFieldStyle(.roundedBorder)

                    Button("Commit & reveal") {
                        unlockedCalloutIds.insert(callout.id)
                        store.saveCalloutResponse(
                            calloutId: callout.id,
                            chapterNumber: chapterNumber,
                            responseText: currentText,
                            isUnlocked: true
                        )
                        store.updateChapterProgress(
                            chapterNumber: chapterNumber,
                            fraction: 0.85,
                            addPrediction: callout.kind == "predict",
                            addCheck: callout.kind == "check"
                        )
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                } else {
                    if !currentText.isEmpty {
                        Text("Your prediction: \(currentText)")
                            .font(.kymaiaCaption)
                            .foregroundStyle(Color.kymaiaPrimary)
                    }
                    Text(callout.body)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaInk)
                }
            }
        }
    }
}
