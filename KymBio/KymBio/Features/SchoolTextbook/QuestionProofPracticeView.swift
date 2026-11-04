import SwiftUI
#if canImport(PencilKit)
import PencilKit
#endif

enum QuestionScaffoldStage: String, CaseIterable, Identifiable, Sendable {
    case independent = "independent"
    case faded = "faded"
    case workedExample = "worked_example"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .independent: return "Independent proof"
        case .faded: return "Faded completion"
        case .workedExample: return "Worked example"
        }
    }
}

enum BiologyScratchpadStamp: String, CaseIterable, Identifiable, Sendable {
    case punnett2x2 = "punnett_2x2"
    case punnett4x4 = "punnett_4x4"
    case magnificationTriangle = "magnification_triangle"
    case resultsTable = "results_table"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .punnett2x2: return "Punnett 2×2"
        case .punnett4x4: return "Dihybrid 4×4"
        case .magnificationTriangle: return "M = I ÷ A"
        case .resultsTable: return "Results table"
        }
    }

    var symbol: String {
        switch self {
        case .punnett2x2, .punnett4x4: return "square.grid.2x2"
        case .magnificationTriangle: return "triangle"
        case .resultsTable: return "tablecells"
        }
    }
}

struct QuestionProofPracticeView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dismiss) private var dismiss

    let question: SchoolScienceQuestion

    @State private var stage: QuestionScaffoldStage = .independent
    @State private var usedAssistanceThisAttempt = false
    @State private var attemptNumber: Int = 1
    @State private var answerText: String = ""
    @State private var fadedInput: String = ""
    @State private var evaluation: QuestionEvaluationResult? = nil
    @State private var showScratchpad: Bool = true
    @State private var selectedPaperStyle: JournalPaperStyle = .grid
    @State private var activeStamp: BiologyScratchpadStamp? = nil
    @State private var scratchpadStrokePoints: [[CGPoint]] = []
    @State private var activeScratchpadStroke: [CGPoint] = []
    @State private var consecutiveShakyCount: Int = 0
    @State private var showBreathingSheet: Bool = false
    @State private var safetySupportMessage: String? = nil

    var body: some View {
        JournalFocusPage(
            title: "Topic \(question.topicCode) · \(question.sourceBadgeTitle)",
            progress: .init(step: stageStepIndex, total: 3),
            closeLabel: "Close",
            close: { dismiss() }
        ) {
            headerSection
            if consecutiveShakyCount >= 2 {
                BiologyFrustrationInterventionBanner(
                    consecutiveShakyCount: consecutiveShakyCount,
                    onStepBackToWorkedExample: {
                        stage = .workedExample
                        usedAssistanceThisAttempt = true
                        consecutiveShakyCount = 0
                    },
                    onOpenBreathingSheet: {
                        showBreathingSheet = true
                    }
                )
            }
            promptSection
            scaffoldContentSection
            scratchpadSection
            if let evaluation {
                evaluationSection(evaluation)
            }
        } actions: {
            HStack(spacing: Spacing.sm) {
                if usedAssistanceThisAttempt || evaluation != nil {
                    Button {
                        startFreshIndependentAttempt()
                    } label: {
                        Label("Start fresh independent attempt", systemImage: "arrow.counterclockwise")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted))
                    .accessibilityIdentifier("question-proof.fresh-attempt")
                }

                Button {
                    submitAttempt()
                } label: {
                    Label(
                        usedAssistanceThisAttempt ? "Check guided answer" : "Submit independent proof",
                        systemImage: "checkmark.seal.fill"
                    )
                }
                .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                .disabled(answerText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                .accessibilityIdentifier("question-proof.submit")
            }
        }
        .onChange(of: stage) { _, newStage in
            if newStage != .independent {
                usedAssistanceThisAttempt = true
            }
        }
        .sessionJournalSafetyAlert(message: $safetySupportMessage)
        .sheet(isPresented: $showBreathingSheet) {
            NavigationStack {
                ScrollView {
                    BiologyBreathingStudioView()
                        .padding(Spacing.md)
                }
                .background(Color.kymaiaBackground)
                .navigationTitle("Diaphragm & vagus reset")
                .toolbar {
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Done") { showBreathingSheet = false }
                    }
                }
            }
        }
    }

    private var stageStepIndex: Int {
        switch stage {
        case .workedExample: return 1
        case .faded: return 2
        case .independent: return 3
        }
    }

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            HStack(spacing: Spacing.xs) {
                JournalChip(text: question.bookSection, tone: .accent)
                JournalChip(text: "\(question.commandWord) · \(question.marks) marks", tone: .neutral)
                Spacer()
                JournalChip(
                    text: usedAssistanceThisAttempt ? "Guided mode (honest)" : "Independent proof mode",
                    tone: usedAssistanceThisAttempt ? .warn : .good
                )
            }

            AdaptiveOptionPicker(
                "Support level",
                selection: $stage,
                options: QuestionScaffoldStage.allCases,
                titleForOption: \.title
            )
            .accessibilityIdentifier("question-proof.stage-picker")
        }
    }

    private var promptSection: some View {
        VStack(alignment: .leading, spacing: Spacing.xs) {
            Text("Question")
                .font(.kymaiaCaption.weight(.semibold))
                .foregroundStyle(Color.kymaiaMutedInk)
            Text(question.prompt)
                .font(.kymaiaQuestion)
                .foregroundStyle(Color.kymaiaInk)
        }
    }

    @ViewBuilder
    private var scaffoldContentSection: some View {
        switch stage {
        case .workedExample:
            VStack(alignment: .leading, spacing: Spacing.sm) {
                Label("Worked example (viewing this marks the current attempt as guided)", systemImage: "lightbulb.fill")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaPrimary)
                Text(question.workedExample)
                    .font(.kymaiaSerifProse)
                    .foregroundStyle(Color.kymaiaInk)
                    .padding(Spacing.md)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                            .fill(Color.kymaiaElevatedSurface)
                    )
                answerComposer(label: "Practise writing the explanation in your own words")
            }

        case .faded:
            VStack(alignment: .leading, spacing: Spacing.sm) {
                Label("Faded completion (fill in the missing mark-scheme terms)", systemImage: "square.and.pencil")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaPrimary)
                Text(question.fadedPrompt)
                    .font(.kymaiaSerifProse)
                    .foregroundStyle(Color.kymaiaInk)
                    .padding(Spacing.md)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                            .fill(Color.kymaiaElevatedSurface)
                    )
                Text("Expected missing terms: \(question.fadedAnswer)")
                    .font(.kymaiaCaption)
                    .foregroundStyle(Color.kymaiaMutedInk)
                answerComposer(label: "Write out the complete answer")
            }

        case .independent:
            answerComposer(
                label: usedAssistanceThisAttempt
                    ? "Your answer (currently marked as guided — tap 'Start fresh independent attempt' below to prove without hints)"
                    : "Your independent answer (Writing Tools & autocorrect disabled so the retrieval is yours)"
            )
        }
    }

    private func answerComposer(label: String) -> some View {
        VStack(alignment: .leading, spacing: Spacing.xs) {
            HStack {
                Text(label)
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaMutedInk)
                Spacer()
                VoiceDictationButton(text: $answerText, label: "Speak answer")
            }
            WritingTextEditor(text: $answerText, serif: true)
                .learnerTextInput(.retrieval)
                .frame(minHeight: 130)
                .padding(Spacing.sm)
                .background(
                    RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                        .fill(Color.kymaiaElevatedSurface)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                        .strokeBorder(Color.kymaiaControlBorder, lineWidth: 1)
                )
                .accessibilityLabel("Your biology answer")
                .accessibilityIdentifier("question-proof.answer-input")
        }
    }

    // MARK: - Apple Pencil Biology Scratchpad

    private var scratchpadSection: some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            HStack {
                Label("Apple Pencil working & diagram scratchpad (Attempt #\(attemptNumber))", systemImage: "pencil.and.outline")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaInk)
                Spacer()
                Button(showScratchpad ? "Hide paper" : "Show paper") {
                    showScratchpad.toggle()
                }
                .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                .accessibilityIdentifier("question-proof.toggle-scratchpad")
            }

            if showScratchpad {
                FlowLayout(spacing: Spacing.xs) {
                    ForEach(BiologyScratchpadStamp.allCases) { stamp in
                        Button {
                            activeStamp = (activeStamp == stamp) ? nil : stamp
                        } label: {
                            Label(stamp.title, systemImage: stamp.symbol)
                        }
                        .buttonStyle(
                            JournalCapsuleButtonStyle(
                                prominence: activeStamp == stamp ? .filled : .tinted,
                                size: .small
                            )
                        )
                        .accessibilityIdentifier("scratchpad.stamp.\(stamp.rawValue)")
                    }

                    Button {
                        scratchpadStrokePoints.removeAll()
                        activeScratchpadStroke.removeAll()
                        activeStamp = nil
                        persistCurrentScratchpad()
                    } label: {
                        Label("Clear ink", systemImage: "trash")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                    .accessibilityIdentifier("scratchpad.clear")
                }

                JournalPaperSheet(style: selectedPaperStyle, minHeight: 220) {
                    ZStack(alignment: .topLeading) {
                        if let stamp = activeStamp {
                            stampOverlayView(stamp)
                                .padding(Spacing.md)
                        }

                        JournalInkCanvasView(
                            strokes: $scratchpadStrokePoints,
                            activeStroke: $activeScratchpadStroke,
                            strokeColor: Color.kymaiaInk,
                            lineWidth: 2.5,
                            onStrokesCommitted: { _, _ in
                                persistCurrentScratchpad()
                            },
                            onTextConverted: { recognized in
                                if answerText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                                    answerText = recognized
                                } else {
                                    answerText += "\n" + recognized
                                }
                            }
                        )
                        .frame(minHeight: 220)
                        .accessibilityLabel("Biology working paper canvas")
                        .accessibilityIdentifier("question-proof.scratchpad-canvas")
                    }
                }
            }
        }
        .onAppear {
            loadScratchpadForCurrentAttempt()
        }
        .onChange(of: question.id) { _, _ in
            loadScratchpadForCurrentAttempt()
        }
    }

    @ViewBuilder
    private func stampOverlayView(_ stamp: BiologyScratchpadStamp) -> some View {
        switch stamp {
        case .punnett2x2:
            VStack(alignment: .leading, spacing: 4) {
                Text("Punnett Square (2×2 Monohybrid)")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaPrimary)
                Grid(horizontalSpacing: 1, verticalSpacing: 1) {
                    GridRow {
                        Text("Gametes").frame(width: 68, height: 34)
                        Text("A").frame(width: 68, height: 34)
                        Text("a").frame(width: 68, height: 34)
                    }
                    GridRow {
                        Text("A").frame(width: 68, height: 34)
                        Rectangle().strokeBorder(Color.kymaiaPrimary, lineWidth: 1).frame(width: 68, height: 34)
                        Rectangle().strokeBorder(Color.kymaiaPrimary, lineWidth: 1).frame(width: 68, height: 34)
                    }
                    GridRow {
                        Text("a").frame(width: 68, height: 34)
                        Rectangle().strokeBorder(Color.kymaiaPrimary, lineWidth: 1).frame(width: 68, height: 34)
                        Rectangle().strokeBorder(Color.kymaiaPrimary, lineWidth: 1).frame(width: 68, height: 34)
                    }
                }
                .font(.kymaiaMonospaced)
            }
        case .punnett4x4:
            VStack(alignment: .leading, spacing: 4) {
                Text("Dihybrid Cross (4×4 Grid — 9:3:3:1)")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaPrimary)
                Grid(horizontalSpacing: 2, verticalSpacing: 2) {
                    ForEach(0..<4, id: \.self) { _ in
                        GridRow {
                            ForEach(0..<4, id: \.self) { _ in
                                Rectangle()
                                    .strokeBorder(Color.kymaiaPrimary.opacity(0.6), lineWidth: 1)
                                    .frame(width: 48, height: 32)
                            }
                        }
                    }
                }
            }
        case .magnificationTriangle:
            VStack(alignment: .leading, spacing: 4) {
                Text("Magnification Formula Triangle: M = I ÷ A  (1 mm = 1,000 µm)")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaPrimary)
                HStack(spacing: Spacing.md) {
                    Text("I (Image size)")
                        .padding(Spacing.xs)
                        .overlay(RoundedRectangle(cornerRadius: CornerRadius.small).stroke(Color.kymaiaPrimary))
                    Text("÷")
                    Text("A (Actual size) × M (Magnification)")
                        .padding(Spacing.xs)
                        .overlay(RoundedRectangle(cornerRadius: CornerRadius.small).stroke(Color.kymaiaPrimary))
                }
                .font(.kymaiaMonospaced)
            }
        case .resultsTable:
            VStack(alignment: .leading, spacing: 4) {
                Text("Scientific Enquiry Table")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaPrimary)
                HStack(spacing: 0) {
                    Text("Independent var (unit)")
                        .padding(6)
                        .frame(maxWidth: .infinity)
                        .border(Color.kymaiaPrimary.opacity(0.6))
                    Text("Trial 1")
                        .padding(6)
                        .frame(width: 72)
                        .border(Color.kymaiaPrimary.opacity(0.6))
                    Text("Trial 2")
                        .padding(6)
                        .frame(width: 72)
                        .border(Color.kymaiaPrimary.opacity(0.6))
                    Text("Mean")
                        .padding(6)
                        .frame(width: 72)
                        .border(Color.kymaiaPrimary.opacity(0.6))
                }
                .font(.kymaiaCaption)
            }
        }
    }

    private func evaluationSection(_ eval: QuestionEvaluationResult) -> some View {
        QuietPanel {
            HStack {
                JournalChip(
                    text: eval.resultingProofLevel.displayTitle,
                    tone: eval.resultingProofLevel.isIndependentProof ? .good : .warn
                )
                Text("\(eval.matchedKeywords.count) of \(question.markSchemeKeywords.count) mark-scheme ideas matched")
                    .font(.kymaiaCaption.monospacedDigit())
                    .foregroundStyle(Color.kymaiaMutedInk)
            }

            Text(eval.feedbackSummary)
                .font(.kymaiaBody)
                .foregroundStyle(Color.kymaiaInk)

            if !eval.matchedKeywords.isEmpty {
                Text("Included: \(eval.matchedKeywords.joined(separator: ", "))")
                    .font(.kymaiaCaption)
                    .foregroundStyle(Color.kymaiaSuccess)
            }
            if !eval.missingKeywords.isEmpty {
                Text("Still to include: \(eval.missingKeywords.joined(separator: ", "))")
                    .font(.kymaiaCaption)
                    .foregroundStyle(Color.kymaiaWarning)
            }

            Divider()
            Text("Cambridge model answer")
                .font(.kymaiaCaption.weight(.semibold))
                .foregroundStyle(Color.kymaiaMutedInk)
            Text(question.modelAnswer)
                .font(.kymaiaSerifProse)
                .foregroundStyle(Color.kymaiaInk)
        }
    }

    private func submitAttempt() {
        let safetyService = SafetyEscalationService()
        if let concern = safetyService.scan(answerText) {
            safetySupportMessage = safetyService.supportiveResponse(for: concern)
            Task {
                await safetyService.escalate(concern, channel: "question_proof")
            }
            return
        }

        persistCurrentScratchpad()
        let result = store.submitQuestionAttempt(
            question: question,
            answerText: answerText,
            usedAssistance: usedAssistanceThisAttempt
        )
        evaluation = result
        if !result.isPass {
            consecutiveShakyCount += 1
        } else {
            consecutiveShakyCount = 0
        }
        // Revealing the model answer after submission counts as assistance if she edits the same attempt
        usedAssistanceThisAttempt = true
    }

    private func startFreshIndependentAttempt() {
        attemptNumber += 1
        stage = .independent
        usedAssistanceThisAttempt = false
        answerText = ""
        evaluation = nil
        scratchpadStrokePoints.removeAll()
        activeScratchpadStroke.removeAll()
        activeStamp = nil
        loadScratchpadForCurrentAttempt()
    }

    private func loadScratchpadForCurrentAttempt() {
        if let existing = store.fetchScratchpad(questionId: question.id, attemptNumber: attemptNumber) {
            scratchpadStrokePoints = JournalInkDrawingCodec.decode(data: existing.drawingData)
            if let style = JournalPaperStyle(rawValue: existing.paperStyle) {
                selectedPaperStyle = style
            }
            if let stampRaw = existing.stampKind, let stamp = BiologyScratchpadStamp(rawValue: stampRaw) {
                activeStamp = stamp
            }
        } else {
            scratchpadStrokePoints.removeAll()
        }
        activeScratchpadStroke.removeAll()
    }

    private func persistCurrentScratchpad() {
        let nonEmptyStrokes = scratchpadStrokePoints.filter { !$0.isEmpty }
        let encoded = JournalInkDrawingCodec.encode(strokes: nonEmptyStrokes) ?? Data()
        store.saveScratchpad(
            questionId: question.id,
            attemptNumber: attemptNumber,
            paperStyle: selectedPaperStyle.rawValue,
            stampKind: activeStamp?.rawValue,
            drawingData: encoded,
            previewPNGData: Data(),
            strokeCount: nonEmptyStrokes.count
        )
    }
}
