import SwiftUI

enum LivingWorldPresentationMode: String, CaseIterable, Identifiable, Sendable {
    case nativeJournal = "native_journal"
    case interactiveWebBook = "interactive_web_book"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .nativeJournal: return "Journal Study Reader"
        case .interactiveWebBook: return "Full Interactive Book & 3D Stage"
        }
    }
}

struct LivingWorldHomeView: View {
    @EnvironmentObject private var store: AppStore
    @State private var presentationMode: LivingWorldPresentationMode = .nativeJournal
    @State private var selectedVolumeNumber: Int = 1
    @State private var predictionInputs: [String: String] = [:]
    @State private var unlockedCalloutIds: Set<String> = []

    private var activeChapter: LivingWorldChapter? {
        store.pack.chapters.first(where: { $0.number == store.activeLivingWorldChapter })
            ?? store.pack.chapters.first
    }

    var body: some View {
        JournalPage(
            title: "The Living World",
            subtitle: "First-principles biology across 4 volumes, 16 chapters and 4 interactive explorers"
        ) {
            modeAndExplorersSection
            volumeAndChapterPickerSection
            if presentationMode == .interactiveWebBook {
                interactiveWebStageCard
            } else if let chapter = activeChapter {
                nativeChapterReaderSection(for: chapter)
            }
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                StandardThemeMenu()
            }
        }
        .onChange(of: store.activeLivingWorldChapter) { _, newChapter in
            if let ch = store.pack.chapters.first(where: { $0.number == newChapter }) {
                selectedVolumeNumber = ch.volumeNumber
            }
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
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                    .accessibilityIdentifier("living-world.open-web-workbench")
                }

                Text("Chapter \(chapter.number) — \(chapter.title)")
                    .font(.kymaiaPageTitle)
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
                                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))

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
                    Text("Commit your prediction or answer in your own words before revealing the discussion:")
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
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                } else {
                    if !currentText.isEmpty {
                        Text("Your committed prediction: \(currentText)")
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
