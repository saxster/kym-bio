import SwiftUI

enum LabsAtlasBenchMode: String, CaseIterable, Identifiable, Sendable {
    case simulations = "simulations"
    case diagramRecall = "diagram_recall"
    case atlasLessons = "atlas_lessons"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .simulations: return "47 Interactive Simulations"
        case .diagramRecall: return "Pencil Diagram Recall (24 Plates)"
        case .atlasLessons: return "117 3D Atlas Lessons"
        }
    }
}

enum DiagramFadingTier: String, CaseIterable, Identifiable, Sendable {
    case labelOnly = "label_only"
    case ghostScaffold = "ghost_scaffold"
    case blankRecall = "blank_recall"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .labelOnly: return "1. Full diagram"
        case .ghostScaffold: return "2. Light outline"
        case .blankRecall: return "3. Draw from memory"
        }
    }
}

private enum WidgetFacetFilter: String, CaseIterable, Identifiable {
    case all
    case unstamped
    case stamped
    case threeD
    case dataLab
    case audio
    case specimen
    case unit1
    case unit4
    case unit7

    var id: String { rawValue }

    var title: String {
        switch self {
        case .all: return "All"
        case .unstamped: return "Unstamped"
        case .stamped: return "Stamped"
        case .threeD: return "3D WebGL"
        case .dataLab: return "Data Lab"
        case .audio: return "Audio"
        case .specimen: return "Real Microscopy"
        case .unit1: return "Bio Unit 1"
        case .unit4: return "Bio Unit 4"
        case .unit7: return "Bio Unit 7"
        }
    }
}

struct LabsAtlasHomeView: View {
    @EnvironmentObject private var store: AppStore
    @State private var benchMode: LabsAtlasBenchMode = .simulations
    @State private var selectedChapterFilter: Int? = nil
    @State private var selectedFacet: WidgetFacetFilter = .all
    @State private var activeWatchStepIndex: Int = 0
    @State private var showCutaway: Bool = false
    @State private var showSpecimen: Bool = false
    @State private var showFacilitatorGuide: Bool = false
    @State private var pendingWebCommand: LivingWorldWebCommand? = nil
    @State private var latestLiveReadout: String = ""
    @State private var awaitingFreezeWidget: InteractiveWidgetSpec? = nil
    @State private var selectedBridge: CrossDisciplinaryBridge? = nil
    @State private var revealBridgeAnswer: Bool = false
    @State private var selectedAtlasLessonId: String? = nil

    // Diagram Recall State
    @State private var selectedFadingTier: DiagramFadingTier = .labelOnly
    @State private var calloutInputs: [String: String] = [:]
    @State private var showMasterPlateOverlay: Bool = false
    @State private var pencilStrokes: [[CGPoint]] = []
    @State private var activePencilStroke: [CGPoint] = []
    @State private var lastDiagramScoreMessage: String? = nil

    private var activeWidget: InteractiveWidgetSpec? {
        if let id = store.activeWidgetId,
           let match = filteredWidgets.first(where: { $0.id == id }) {
            return match
        }
        return filteredWidgets.first
    }

    private var filteredWidgets: [InteractiveWidgetSpec] {
        store.pack.widgets.filter { w in
            if let ch = selectedChapterFilter, w.chapter != ch {
                return false
            }
            switch selectedFacet {
            case .all: return true
            case .unstamped: return store.widgetStamps[w.id] == nil
            case .stamped: return store.widgetStamps[w.id] != nil
            case .threeD: return w.is3D
            case .dataLab: return w.hasDataTable
            case .audio: return w.hasSonification
            case .specimen: return w.realPlateId != nil
            case .unit1: return w.cambridgeUnits.contains(1)
            case .unit4: return w.cambridgeUnits.contains(4)
            case .unit7: return w.cambridgeUnits.contains(7)
            }
        }
    }

    private var filteredAtlasLessons: [AtlasLesson] {
        guard let ch = selectedChapterFilter else { return store.pack.atlasLessons }
        return store.pack.atlasLessons.filter { $0.chapter == ch }
    }

    private var activePlate: DiagramRecallPlate? {
        if let id = store.activeDiagramPlateId,
           let match = store.pack.diagramPlates.first(where: { $0.id == id }) {
            return match
        }
        return store.pack.diagramPlates.first
    }

    var body: some View {
        JournalPage(
            title: "3D Labs, Atlas & Diagram Recall",
            eyebrow: "Labs and atlas",
            subtitle: "47 interactive simulations, 117 3D Atlas lessons and 24 Apple Pencil specimen plates"
        ) {
            modeSelectorCard
            chapterFilterStrip
            if benchMode == .simulations {
                widgetFacetFilterStrip
            }

            switch benchMode {
            case .simulations:
                simulationsBenchSection
            case .diagramRecall:
                diagramRecallBenchSection
            case .atlasLessons:
                atlasLessonsSection
            }
        }
        .onAppear {
            if store.activeDiagramPlateId != nil {
                benchMode = .diagramRecall
            }
        }
        .sheet(item: $selectedBridge) { bridge in
            bridgeDetailSheet(bridge)
        }
    }

    @ViewBuilder
    private func bridgeDetailSheet(_ bridge: CrossDisciplinaryBridge) -> some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    JournalChip(text: "\(bridge.discipline.capitalized) · \(bridge.sourceRef)", tone: .accent)
                    Text(bridge.title)
                        .font(.kymaiaCardTitle)
                        .foregroundStyle(Color.kymaiaInk)
                    Text(bridge.summary)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaInk)
                    if !bridge.keyEquation.isEmpty {
                        Text(bridge.keyEquation)
                            .font(.kymaiaCaption.monospaced())
                            .foregroundStyle(Color.kymaiaPrimary)
                            .padding(Spacing.sm)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .fill(Color.kymaiaElevatedSurface)
                            )
                    }
                    if !bridge.microCheckQuestion.isEmpty {
                        VStack(alignment: .leading, spacing: Spacing.xs) {
                            Label("Bridge check", systemImage: "questionmark.circle")
                                .font(.kymaiaCaption.weight(.semibold))
                                .foregroundStyle(Color.kymaiaPrimary)
                            Text(bridge.microCheckQuestion)
                                .font(.kymaiaBody)
                                .foregroundStyle(Color.kymaiaInk)
                            Button(revealBridgeAnswer ? "Hide answer" : "Check reasoning") {
                                revealBridgeAnswer.toggle()
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            if revealBridgeAnswer && !bridge.microCheckAnswer.isEmpty {
                                Text(bridge.microCheckAnswer)
                                    .font(.kymaiaSerifProse)
                                    .foregroundStyle(Color.kymaiaInk)
                            }
                        }
                    }
                }
                .padding(Spacing.lg)
            }
            .background(Color.kymaiaBackground)
            .navigationTitle(bridge.sourceBook)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { selectedBridge = nil }
                }
            }
        }
    }

    private var modeSelectorCard: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack {
                    JournalBadge(symbol: "cube.transparent.fill", tint: .kymaiaPrimary, size: .row)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Laboratory bench mode")
                            .font(.kymaiaCardTitle)
                        Text("\(store.widgetStamps.count) of \(store.pack.widgets.count) simulation challenges stamped · \(store.diagramAttempts.count) diagram recall sessions")
                            .font(.kymaiaCaption.monospacedDigit())
                            .foregroundStyle(Color.kymaiaMutedInk)
                    }
                    Spacer()
                }
                AdaptiveOptionPicker(
                    "Bench mode",
                    selection: $benchMode,
                    options: LabsAtlasBenchMode.allCases,
                    titleForOption: \.title
                )
                .accessibilityIdentifier("labs.mode-picker")
            }
        }
    }

    private var chapterFilterStrip: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: Spacing.xs) {
                Button("All chapters (0–15)") {
                    selectedChapterFilter = nil
                }
                .buttonStyle(
                    JournalCapsuleButtonStyle(
                        prominence: selectedChapterFilter == nil ? .filled : .tinted,
                        size: .small
                    )
                )

                ForEach(store.pack.chapters) { ch in
                    Button("Ch \(ch.number): \(ch.title)") {
                        selectedChapterFilter = ch.number
                    }
                    .buttonStyle(
                        JournalCapsuleButtonStyle(
                            prominence: selectedChapterFilter == ch.number ? .filled : .ghost,
                            size: .small
                        )
                    )
                }
            }
        }
    }

    private var widgetFacetFilterStrip: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: Spacing.xs) {
                ForEach(WidgetFacetFilter.allCases) { facet in
                    JournalChip(facet.title, isSelected: selectedFacet == facet) {
                        selectedFacet = facet
                    }
                    .accessibilityIdentifier("labs.facet.\(facet.rawValue)")
                }
            }
        }
    }

    // MARK: - 1. 47 Interactive Simulations Bench

    @ViewBuilder
    private var simulationsBenchSection: some View {
        if let widget = activeWidget {
            let relatedBridges = store.pack.crossDisciplinaryBridges.filter {
                widget.relatedBridgeIds.contains($0.id)
            }
            JournalSection(title: "Active simulation · \(widget.title) (Chapter \(widget.chapter))") {
                JournalCard {
                    VStack(alignment: .leading, spacing: Spacing.md) {
                        HStack(spacing: Spacing.xs) {
                            JournalChip(text: widget.is3D ? "3D WebGL Stage" : "Interactive 2D Lab", tone: .accent)
                            JournalChip(text: "Chapter \(widget.chapter)", tone: .neutral)
                            if store.widgetStamps[widget.id] != nil {
                                JournalChip(label: "Challenge stamped", systemImage: "checkmark.seal.fill", tone: .good)
                            }
                            Spacer()
                            Button {
                                pendingWebCommand = LivingWorldWebCommand(kind: .reset)
                                activeWatchStepIndex = 0
                                showCutaway = false
                                showSpecimen = false
                                latestLiveReadout = ""
                            } label: {
                                Label("Reset Lab", systemImage: "arrow.counterclockwise")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                            .accessibilityIdentifier("labs.widget.reset")

                            Button {
                                awaitingFreezeWidget = widget
                                pendingWebCommand = LivingWorldWebCommand(kind: .captureSnapshot)
                            } label: {
                                Label("Freeze & Sketch in Lab Log", systemImage: "pencil.and.scribble")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            .accessibilityIdentifier("labs.widget.freeze-sketch")
                        }

                        // Challenge banner
                        if !widget.challengePrompt.isEmpty {
                            VStack(alignment: .leading, spacing: Spacing.xs) {
                                Label("Lab challenge", systemImage: "flag.checkered")
                                    .font(.kymaiaCaption.weight(.semibold))
                                    .foregroundStyle(Color.kymaiaPrimary)
                                Text(widget.challengePrompt)
                                    .font(.kymaiaBody)
                                    .foregroundStyle(Color.kymaiaInk)
                                HStack(spacing: Spacing.xs) {
                                    JournalChip(
                                        label: store.widgetStamps[widget.id] != nil
                                            ? "Challenge verified in simulation"
                                            : "Complete the challenge in the live lab below to earn stamp",
                                        systemImage: store.widgetStamps[widget.id] != nil ? "checkmark.seal.fill" : "flask.fill",
                                        tone: store.widgetStamps[widget.id] != nil ? .good : .neutral
                                    )
                                    .accessibilityIdentifier("labs.widget.stamp")

                                    Spacer()

                                    Button {
                                        let fallbackReadout = latestLiveReadout.isEmpty ? widget.challengePrompt : latestLiveReadout
                                        store.shareLabTelemetryWithCoach("Active simulation: \(widget.title) (Ch \(widget.chapter)). Latest readout: \(fallbackReadout)")
                                    } label: {
                                        Label("Discuss this run with Coach", systemImage: "bubble.left.and.text.bubble.right.fill")
                                    }
                                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                                    .accessibilityIdentifier("labs.widget.discuss-coach")
                                }
                            }
                            .padding(Spacing.md)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .fill(Color.kymaiaElevatedSurface)
                            )
                        }

                        // Live Web Stage
                        LivingWorldWebStageView(
                            chapterNumber: widget.chapter,
                            targetWidgetId: widget.id,
                            pendingCommand: pendingWebCommand,
                            onTelemetryEvent: { wid, summary in
                                if wid == widget.id && !summary.isEmpty {
                                    latestLiveReadout = summary
                                }
                            },
                            onSnapshotCaptured: { payload in
                                let target = awaitingFreezeWidget ?? widget
                                awaitingFreezeWidget = nil
                                let resolvedReadout: String
                                if !payload.readout.isEmpty {
                                    resolvedReadout = payload.readout
                                } else if !latestLiveReadout.isEmpty {
                                    resolvedReadout = latestLiveReadout
                                } else {
                                    resolvedReadout = "Watch step \(activeWatchStepIndex + 1) · \(target.challengePrompt)"
                                }
                                _ = store.freezeWidgetIntoLabLog(
                                    widget: target,
                                    readout: resolvedReadout,
                                    trialsMarkdown: payload.trialsMarkdown,
                                    snapshotPNGData: payload.pngData
                                )
                            }
                        )
                        .frame(minHeight: 480)
                        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                                .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                        )

                        if !latestLiveReadout.isEmpty {
                            HStack(alignment: .top, spacing: Spacing.xs) {
                                Image(systemName: "waveform.path.ecg")
                                    .foregroundStyle(Color.kymaiaPrimary)
                                Text(latestLiveReadout)
                                    .font(.kymaiaCaption)
                                    .foregroundStyle(Color.kymaiaInk)
                                    .lineLimit(3)
                            }
                            .padding(Spacing.xs)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .fill(Color.kymaiaElevatedSurface)
                            )
                        }

                        // Guided Watch Tour
                        if !widget.watchSteps.isEmpty {
                            VStack(alignment: .leading, spacing: Spacing.xs) {
                                Text("Guided Step-by-Step Tour")
                                    .font(.kymaiaCaption.weight(.semibold))
                                    .foregroundStyle(Color.kymaiaMutedInk)
                                FlowLayout(spacing: Spacing.xs) {
                                    ForEach(Array(widget.watchSteps.enumerated()), id: \.offset) { idx, step in
                                        Button(step.title) {
                                            activeWatchStepIndex = idx
                                            pendingWebCommand = LivingWorldWebCommand(kind: .applyWatchStep(idx))
                                        }
                                        .buttonStyle(
                                            JournalCapsuleButtonStyle(
                                                prominence: activeWatchStepIndex == idx ? .filled : .tinted,
                                                size: .small
                                            )
                                        )
                                    }
                                }
                                let clampedIdx = min(activeWatchStepIndex, widget.watchSteps.count - 1)
                                Text(widget.watchSteps[clampedIdx].caption)
                                    .font(.kymaiaSerifProse)
                                    .foregroundStyle(Color.kymaiaInk)
                                    .padding(.top, 4)
                            }
                        }

                        // Cutaway, Real Specimen & Model Honesty Footnote
                        FlowLayout(spacing: Spacing.xs) {
                            Button(showCutaway ? "Hide cell-scale view" : "Look inside at the cell & molecule scale") {
                                showCutaway.toggle()
                                pendingWebCommand = LivingWorldWebCommand(kind: .setCutaway(showCutaway))
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: showCutaway ? .filled : .ghost, size: .small))

                            if widget.realPlateId != nil {
                                Button {
                                    showSpecimen.toggle()
                                    pendingWebCommand = LivingWorldWebCommand(kind: .setSpecimen(showSpecimen))
                                } label: {
                                    Label(showSpecimen ? "Hide real specimen plate" : "Real specimen", systemImage: "camera.macro")
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: showSpecimen ? .filled : .tinted, size: .small))
                                .accessibilityIdentifier("labs.widget.specimen")
                            }
                        }

                        if showCutaway && !widget.cutaway.isEmpty {
                            VStack(alignment: .leading, spacing: 4) {
                                Label("Inside the cells & molecules", systemImage: "magnifyingglass.circle.fill")
                                    .font(.kymaiaCaption.weight(.semibold))
                                    .foregroundStyle(Color.kymaiaPrimary)
                                Text(widget.cutaway)
                                    .font(.kymaiaBody)
                                    .foregroundStyle(Color.kymaiaInk)
                            }
                            .padding(Spacing.sm)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .fill(Color.kymaiaElevatedSurface)
                            )
                        }

                        if !relatedBridges.isEmpty {
                            VStack(alignment: .leading, spacing: Spacing.xs) {
                                Label("Related Cross-Disciplinary Bridges (tap to explore)", systemImage: "point.3.connected.trianglepath.dotted")
                                    .font(.kymaiaCaption.weight(.semibold))
                                    .foregroundStyle(Color.kymaiaMutedInk)
                                FlowLayout(spacing: Spacing.xs) {
                                    ForEach(relatedBridges) { bridge in
                                        Button {
                                            revealBridgeAnswer = false
                                            selectedBridge = bridge
                                        } label: {
                                            JournalChip(text: "\(bridge.discipline.capitalized): \(bridge.title)", tone: .accent)
                                        }
                                        .buttonStyle(.plain)
                                    }
                                }
                            }
                        }

                        if !widget.facilitatorPredictPrompt.isEmpty || !widget.facilitatorTrap.isEmpty || !widget.facilitatorConceptQuestion.isEmpty {
                            DisclosureGroup("Parent / Teacher Facilitation Guide (ILD)", isExpanded: $showFacilitatorGuide) {
                                VStack(alignment: .leading, spacing: Spacing.xs) {
                                    if !widget.facilitatorPredictPrompt.isEmpty {
                                        Text("Predict before touching: \(widget.facilitatorPredictPrompt)")
                                            .font(.kymaiaBody)
                                            .foregroundStyle(Color.kymaiaInk)
                                    }
                                    if !widget.facilitatorTrap.isEmpty {
                                        Text("Common exam trap: \(widget.facilitatorTrap)")
                                            .font(.kymaiaBody)
                                            .foregroundStyle(Color.kymaiaMutedInk)
                                    }
                                    if !widget.facilitatorConceptQuestion.isEmpty {
                                        Text("Concept question: \(widget.facilitatorConceptQuestion)")
                                            .font(.kymaiaSerifProse)
                                            .foregroundStyle(Color.kymaiaInk)
                                    }
                                }
                                .padding(.top, Spacing.xs)
                            }
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaPrimary)
                        }

                        if !widget.idealised.isEmpty {
                            Text("What the model simplifies: \(widget.idealised)")
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaTertiaryInk)
                        }
                    }
                }
            }
        } else {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text("No simulations match this chapter and facet filter.")
                        .font(.kymaiaBody)
                        .foregroundStyle(Color.kymaiaInk)
                    Button("Clear filters") {
                        selectedChapterFilter = nil
                        selectedFacet = .all
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                }
            }
        }

        JournalSection(title: "All simulations (\(filteredWidgets.count))") {
            FlowLayout(spacing: Spacing.xs) {
                ForEach(filteredWidgets) { w in
                    let isSelected = w.id == activeWidget?.id
                    Button {
                        store.activeWidgetId = w.id
                        activeWatchStepIndex = 0
                        showCutaway = false
                        showSpecimen = false
                        latestLiveReadout = ""
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: store.widgetStamps[w.id] != nil ? "checkmark.seal.fill" : (w.is3D ? "cube.fill" : "slider.horizontal.3"))
                            Text("Ch \(w.chapter) · \(w.title)")
                            if w.hasSonification {
                                Image(systemName: "waveform")
                            }
                            if w.hasDataTable {
                                Image(systemName: "tablecells")
                            }
                            if w.realPlateId != nil {
                                Image(systemName: "camera.macro")
                            }
                        }
                    }
                    .buttonStyle(
                        JournalCapsuleButtonStyle(
                            prominence: isSelected ? .filled : .tinted,
                            size: .small
                        )
                    )
                    .accessibilityIdentifier("labs.select-widget.\(w.id)")
                }
            }
        }
    }

    // MARK: - 2. Apple Pencil Specimen & School Diagram Recall (12 Plates)

    @ViewBuilder
    private var diagramRecallBenchSection: some View {
        JournalSection(title: "Select a Cambridge Science 8 or Living World specimen plate") {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: Spacing.xs) {
                    ForEach(store.pack.diagramPlates) { plate in
                        let isSelected = plate.id == activePlate?.id
                        Button {
                            store.activeDiagramPlateId = plate.id
                            calloutInputs.removeAll()
                            pencilStrokes.removeAll()
                            lastDiagramScoreMessage = nil
                        } label: {
                            Text("Unit \(plate.unitNumber) · \(plate.title)")
                        }
                        .buttonStyle(
                            JournalCapsuleButtonStyle(
                                prominence: isSelected ? .filled : .tinted,
                                size: .small
                            )
                        )
                        .accessibilityIdentifier("labs.plate.\(plate.id)")
                    }
                }
            }
        }

        if let plate = activePlate {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(plate.title)
                                .font(.kymaiaCardTitle)
                            Text(plate.sourceRef)
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaMutedInk)
                        }
                        Spacer()
                        Toggle("Show Master Plate", isOn: $showMasterPlateOverlay)
                            .toggleStyle(.button)
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            .accessibilityIdentifier("labs.plate.toggle-master")
                    }

                    AdaptiveOptionPicker(
                        "Fading scaffold tier",
                        selection: $selectedFadingTier,
                        options: DiagramFadingTier.allCases,
                        titleForOption: \.title
                    )
                    .accessibilityIdentifier("labs.plate.tier-picker")

                    // Interactive Apple Pencil Specimen Canvas + Callout Pins
                    JournalPaperSheet(style: .grid, minHeight: 340) {
                        GeometryReader { geo in
                            ZStack {
                                // Structural schematic lines (visible in Label Only, 25% in Ghost, or when Master Overlay is on)
                                if selectedFadingTier != .blankRecall || showMasterPlateOverlay {
                                    specimenSchematicOverlay(plate: plate, size: geo.size)
                                        .opacity(
                                            showMasterPlateOverlay
                                                ? 0.85
                                                : (selectedFadingTier == .ghostScaffold ? 0.25 : 0.70)
                                        )
                                }

                                // Learner's Apple Pencil / touch strokes
                                JournalInkCanvasView(
                                    strokes: $pencilStrokes,
                                    activeStroke: $activePencilStroke,
                                    strokeColor: Color.kymaiaPrimary,
                                    lineWidth: 2.5
                                )

                                // Numbered Callout Pins
                                ForEach(Array(plate.callouts.enumerated()), id: \.element.id) { idx, pin in
                                    let px = pin.x * geo.size.width
                                    let py = pin.y * geo.size.height
                                    VStack(spacing: 2) {
                                        Text("\(idx + 1)")
                                            .font(.kymaiaCaption.weight(.bold).monospacedDigit())
                                            .foregroundStyle(Color.kymaiaBackground)
                                            .frame(width: 24, height: 24)
                                            .background(Circle().fill(Color.kymaiaPrimary))
                                        if showMasterPlateOverlay {
                                            Text(pin.label)
                                                .font(.kymaiaCaption2.weight(.semibold))
                                                .padding(.horizontal, 6)
                                                .padding(.vertical, 2)
                                                .background(
                                                    Capsule().fill(Color.kymaiaSurface.opacity(0.94))
                                                )
                                        }
                                    }
                                    .position(x: px, y: py)
                                }
                            }
                        }
                        .frame(minHeight: 340)
                    }

                    // Callout Label Retrieval List
                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        Text("Label each numbered structure from memory (Writing Tools & autocorrect disabled):")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaMutedInk)

                        ForEach(Array(plate.callouts.enumerated()), id: \.element.id) { idx, pin in
                            VStack(alignment: .leading, spacing: 4) {
                                HStack(spacing: Spacing.sm) {
                                    Text("#\(idx + 1)")
                                        .font(.kymaiaCaption.weight(.bold).monospacedDigit())
                                        .foregroundStyle(Color.kymaiaPrimary)
                                        .frame(width: 28, alignment: .leading)
                                    TextField(
                                        pin.hint,
                                        text: Binding(
                                            get: { calloutInputs[pin.id] ?? "" },
                                            set: { calloutInputs[pin.id] = $0 }
                                        )
                                    )
                                    .learnerTextInput(.retrieval)
                                    .textFieldStyle(.roundedBorder)
                                    .accessibilityIdentifier("labs.plate.callout.\(pin.id)")
                                }
                                if showMasterPlateOverlay {
                                    Text("Master label: \(pin.label)")
                                        .font(.kymaiaCaption)
                                        .foregroundStyle(Color.kymaiaSuccess)
                                        .padding(.leading, 36)
                                }
                            }
                        }
                    }

                    if let msg = lastDiagramScoreMessage {
                        Text(msg)
                            .font(.kymaiaBody.weight(.semibold))
                            .foregroundStyle(Color.kymaiaSuccess)
                    }

                    HStack(spacing: Spacing.sm) {
                        Button {
                            gradeAndRecordPlate(plate)
                        } label: {
                            Label("Check labels & record Diagram Recall", systemImage: "checkmark.seal.fill")
                        }
                        .buttonStyle(BrassButtonStyle())
                        .accessibilityIdentifier("labs.plate.grade")

                        Button {
                            pencilStrokes.removeAll()
                            activePencilStroke.removeAll()
                            calloutInputs.removeAll()
                            showMasterPlateOverlay = false
                            lastDiagramScoreMessage = nil
                        } label: {
                            Label("Reset canvas", systemImage: "arrow.counterclockwise")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost))
                    }
                }
            }
            .onAppear {
                if let latest = store.diagramAttempts.first(where: { $0.plateId == plate.id }),
                   let data = latest.drawingData {
                    pencilStrokes = JournalInkDrawingCodec.decode(data: data)
                }
            }
            .onChange(of: plate.id) { _, newId in
                activePencilStroke.removeAll()
                if let latest = store.diagramAttempts.first(where: { $0.plateId == newId }),
                   let data = latest.drawingData {
                    pencilStrokes = JournalInkDrawingCodec.decode(data: data)
                } else {
                    pencilStrokes.removeAll()
                }
            }
        }
    }

    private func specimenSchematicOverlay(plate: DiagramRecallPlate, size: CGSize) -> some View {
        BioSpecimenPlateCanvas(
            chapterNumber: plate.chapter,
            figureId: plate.figureId,
            callouts: plate.callouts
        )
    }

    private func gradeAndRecordPlate(_ plate: DiagramRecallPlate) {
        var matched = 0
        for pin in plate.callouts {
            let input = (calloutInputs[pin.id] ?? "").lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
            let targetWords = pin.label.lowercased().split(whereSeparator: { !$0.isLetter })
            if !input.isEmpty, let primaryWord = targetWords.first, input.contains(primaryWord) {
                matched += 1
            }
        }
        showMasterPlateOverlay = true
        let score = max(1, min(5, Int(round((Double(matched) / Double(max(1, plate.callouts.count))) * 5.0))))
        let encodedStrokes = JournalInkDrawingCodec.encode(strokes: pencilStrokes)
        store.recordDiagramRecall(
            plate: plate,
            mode: selectedFadingTier.rawValue,
            correctCount: matched,
            selfScore: score,
            drawingData: encodedStrokes
        )
        lastDiagramScoreMessage = "Matched \(matched) of \(plate.callouts.count) anatomical callouts (\(selectedFadingTier.title)). Master labels revealed above."
    }

    // MARK: - 3. 117 3D Atlas Lessons

    private var atlasLessonsSection: some View {
        let activeLesson = filteredAtlasLessons.first(where: { $0.id == selectedAtlasLessonId }) ?? filteredAtlasLessons.first
        let activeLessonChapter = activeLesson?.chapter ?? selectedChapterFilter ?? store.activeLivingWorldChapter
        return VStack(alignment: .leading, spacing: Spacing.md) {
            JournalSection(title: "Live 3D Atlas Stage · Chapter \(activeLessonChapter)") {
                JournalCard {
                    LivingWorldWebStageView(
                        chapterNumber: activeLessonChapter,
                        targetWidgetId: activeLesson?.id
                    )
                    .frame(minHeight: 420)
                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                            .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                    )
                }
            }

            JournalSection(title: "3D Atlas Lessons (\(filteredAtlasLessons.count) of \(store.pack.atlasLessons.count))") {
                VStack(spacing: Spacing.md) {
                    ForEach(filteredAtlasLessons) { lesson in
                        JournalCard {
                            VStack(alignment: .leading, spacing: Spacing.sm) {
                                HStack {
                                    JournalChip(text: "Chapter \(lesson.chapter)", tone: .accent)
                                    JournalChip(text: "3D Lesson", tone: .neutral)
                                    Spacer()
                                }
                                HStack(alignment: .top, spacing: Spacing.md) {
                                    BioSpecimenPlateCanvas(
                                        chapterNumber: lesson.chapter,
                                        figureId: lesson.figure,
                                        callouts: []
                                    )
                                    .frame(width: 120, height: 88)
                                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                            .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                                    )

                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(lesson.title)
                                            .font(.kymaiaCardTitle)
                                            .foregroundStyle(Color.kymaiaInk)
                                        Text(lesson.question)
                                            .font(.kymaiaBody.weight(.semibold))
                                            .foregroundStyle(Color.kymaiaPrimary)
                                        Text(lesson.explanation)
                                            .font(.kymaiaSerifProse)
                                            .foregroundStyle(Color.kymaiaInk)
                                    }
                                }
                                if !lesson.limits.isEmpty {
                                    Text("Model limits: \(lesson.limits)")
                                        .font(.kymaiaCaption)
                                        .foregroundStyle(Color.kymaiaTertiaryInk)
                                }
                                HStack {
                                    Button {
                                        selectedChapterFilter = lesson.chapter
                                        selectedAtlasLessonId = lesson.id
                                        store.activeLivingWorldChapter = lesson.chapter
                                        store.activeWidgetId = lesson.widget
                                    } label: {
                                        Label("Focus in 3D Stage Above", systemImage: "cube.transparent")
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
}
