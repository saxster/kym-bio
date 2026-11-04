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
        case .labelOnly: return "1. Label callouts"
        case .ghostScaffold: return "2. Ghost scaffold (25%)"
        case .blankRecall: return "3. Blank recall"
        }
    }
}

struct LabsAtlasHomeView: View {
    @EnvironmentObject private var store: AppStore
    @State private var benchMode: LabsAtlasBenchMode = .simulations
    @State private var selectedChapterFilter: Int? = nil
    @State private var activeWatchStepIndex: Int = 0
    @State private var showCutaway: Bool = false

    // Diagram Recall State
    @State private var selectedFadingTier: DiagramFadingTier = .labelOnly
    @State private var calloutInputs: [String: String] = [:]
    @State private var showMasterPlateOverlay: Bool = false
    @State private var pencilStrokes: [[CGPoint]] = []
    @State private var activePencilStroke: [CGPoint] = []
    @State private var lastDiagramScoreMessage: String? = nil

    private var activeWidget: InteractiveWidgetSpec? {
        if let id = store.activeWidgetId,
           let match = store.pack.widgets.first(where: { $0.id == id }) {
            return match
        }
        return filteredWidgets.first ?? store.pack.widgets.first
    }

    private var filteredWidgets: [InteractiveWidgetSpec] {
        guard let ch = selectedChapterFilter else { return store.pack.widgets }
        return store.pack.widgets.filter { $0.chapter == ch }
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
            subtitle: "47 interactive simulations, 117 3D Atlas lessons and 12 Apple Pencil specimen plates"
        ) {
            modeSelectorCard
            chapterFilterStrip

            switch benchMode {
            case .simulations:
                simulationsBenchSection
            case .diagramRecall:
                diagramRecallBenchSection
            case .atlasLessons:
                atlasLessonsSection
            }
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                StandardThemeMenu()
            }
        }
        .onAppear {
            if store.activeDiagramPlateId != nil {
                benchMode = .diagramRecall
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

    // MARK: - 1. 47 Interactive Simulations Bench

    @ViewBuilder
    private var simulationsBenchSection: some View {
        if let widget = activeWidget {
            JournalSection(title: "Active simulation · \(widget.title) (Chapter \(widget.chapter))") {
                JournalCard {
                    VStack(alignment: .leading, spacing: Spacing.md) {
                        HStack {
                            JournalChip(text: widget.is3D ? "3D WebGL Stage" : "Interactive 2D Lab", tone: .accent)
                            JournalChip(text: "Chapter \(widget.chapter)", tone: .neutral)
                            if store.widgetStamps[widget.id] != nil {
                                JournalChip(label: "Challenge stamped", systemImage: "checkmark.seal.fill", tone: .good)
                            }
                            Spacer()
                            Button {
                                _ = store.freezeWidgetIntoLabLog(
                                    widget: widget,
                                    readout: "Watch step \(activeWatchStepIndex + 1) · \(widget.challengePrompt)"
                                )
                            } label: {
                                Label("Freeze & Sketch in Lab Log", systemImage: "pencil.and.scribble")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            .accessibilityIdentifier("labs.widget.freeze-sketch")
                        }

                        // Challenge banner
                        if !widget.challengePrompt.isEmpty {
                            VStack(alignment: .leading, spacing: Spacing.xs) {
                                Label("Goal-directed micro-challenge", systemImage: "flag.checkered")
                                    .font(.kymaiaCaption.weight(.semibold))
                                    .foregroundStyle(Color.kymaiaPrimary)
                                Text(widget.challengePrompt)
                                    .font(.kymaiaBody)
                                    .foregroundStyle(Color.kymaiaInk)
                                Button {
                                    store.earnWidgetChallengeStamp(
                                        widgetId: widget.id,
                                        chapterNumber: widget.chapter,
                                        readout: "Verified challenge in \(widget.title)"
                                    )
                                } label: {
                                    Label(
                                        store.widgetStamps[widget.id] != nil ? "Challenge stamped" : "Mark challenge completed",
                                        systemImage: "checkmark.seal.fill"
                                    )
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                                .accessibilityIdentifier("labs.widget.stamp")
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
                            targetWidgetId: widget.id
                        )
                        .frame(minHeight: 480)
                        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                                .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                        )

                        // 5-Shot Choreographed Watch Tour
                        if !widget.watchSteps.isEmpty {
                            VStack(alignment: .leading, spacing: Spacing.xs) {
                                Text("5-Shot Choreographed Watch Tour")
                                    .font(.kymaiaCaption.weight(.semibold))
                                    .foregroundStyle(Color.kymaiaMutedInk)
                                FlowLayout(spacing: Spacing.xs) {
                                    ForEach(Array(widget.watchSteps.enumerated()), id: \.offset) { idx, step in
                                        Button(step.title) {
                                            activeWatchStepIndex = idx
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

                        // Cutaway & Model Honesty Footnote
                        HStack(spacing: Spacing.sm) {
                            Button(showCutaway ? "Hide submicroscopic cutaway" : "Inspect submicroscopic cutaway") {
                                showCutaway.toggle()
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                        }

                        if showCutaway && !widget.cutaway.isEmpty {
                            VStack(alignment: .leading, spacing: 4) {
                                Label("Inside the mechanism (submicroscopic cutaway)", systemImage: "magnifyingglass.circle.fill")
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

                        if !widget.idealised.isEmpty {
                            Text("What the model simplifies: \(widget.idealised)")
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaTertiaryInk)
                        }
                    }
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
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: store.widgetStamps[w.id] != nil ? "checkmark.seal.fill" : (w.is3D ? "cube.fill" : "slider.horizontal.3"))
                            Text("Ch \(w.chapter) · \(w.title)")
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
        Canvas { context, canvasSize in
            let center = CGPoint(x: canvasSize.width * 0.5, y: canvasSize.height * 0.5)
            // Draw clean anatomical guide contours connecting callout regions
            let outerRect = CGRect(
                x: canvasSize.width * 0.14,
                y: canvasSize.height * 0.10,
                width: canvasSize.width * 0.72,
                height: canvasSize.height * 0.80
            )
            let contour = RoundedRectangle(cornerRadius: BioFigureGeometry.plateContourRadius, style: .continuous).path(in: outerRect)
            context.stroke(contour, with: .color(Color.kymaiaMutedInk), style: StrokeStyle(lineWidth: 2, dash: [6, 4]))

            for pin in plate.callouts {
                let pt = CGPoint(x: pin.x * canvasSize.width, y: pin.y * canvasSize.height)
                var leader = Path()
                leader.move(to: center)
                leader.addQuadCurve(
                    to: pt,
                    control: CGPoint(x: (center.x + pt.x) * 0.5, y: min(center.y, pt.y) - 18)
                )
                context.stroke(leader, with: .color(Color.kymaiaSecondary.opacity(0.65)), lineWidth: 1.5)
            }
        }
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
        JournalSection(title: "3D Atlas Lessons (\(filteredAtlasLessons.count) of \(store.pack.atlasLessons.count))") {
            VStack(spacing: Spacing.md) {
                ForEach(filteredAtlasLessons) { lesson in
                    JournalCard {
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            HStack {
                                JournalChip(text: "Chapter \(lesson.chapter)", tone: .accent)
                                JournalChip(text: lesson.id, tone: .neutral)
                                Spacer()
                            }
                            Text(lesson.title)
                                .font(.kymaiaCardTitle)
                                .foregroundStyle(Color.kymaiaInk)
                            Text(lesson.question)
                                .font(.kymaiaBody.weight(.semibold))
                                .foregroundStyle(Color.kymaiaPrimary)
                            Text(lesson.explanation)
                                .font(.kymaiaSerifProse)
                                .foregroundStyle(Color.kymaiaInk)
                            if !lesson.limits.isEmpty {
                                Text("Model limits: \(lesson.limits)")
                                    .font(.kymaiaCaption)
                                    .foregroundStyle(Color.kymaiaTertiaryInk)
                            }
                            HStack {
                                Button {
                                    store.activeLivingWorldChapter = lesson.chapter
                                    store.selectedRoom = .livingWorld
                                } label: {
                                    Label("Open Chapter \(lesson.chapter) 3D Atlas", systemImage: "cube.transparent")
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
