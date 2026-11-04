import SwiftUI
#if os(iOS)
import PencilKit
#endif

// MARK: - Interactive Audio Chapter Explainer Bar

struct BiologyChapterExplainerBar: View {
    let title: String
    let segments: [String]
    let simplerVariant: String
    let mumbaiExample: String
    let quickCheckQuestion: String

    @ObservedObject private var speaker = BioSpeechSynthesizer.shared
    @State private var currentSegmentIndex: Int = 0
    @State private var activeInterruptText: String?

    init(
        title: String,
        segments: [String],
        simplerVariant: String,
        mumbaiExample: String,
        quickCheckQuestion: String
    ) {
        self.title = title
        self.segments = segments.isEmpty ? ["Let us walk through \(title) from first principles."] : segments
        self.simplerVariant = simplerVariant
        self.mumbaiExample = mumbaiExample
        self.quickCheckQuestion = quickCheckQuestion
    }

    private var activeText: String {
        if let activeInterruptText { return activeInterruptText }
        let safeIdx = min(max(currentSegmentIndex, 0), segments.count - 1)
        return segments[safeIdx]
    }

    var body: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack {
                    Label("Audio Explainer · Segment \(currentSegmentIndex + 1) of \(segments.count)", systemImage: "waveform")
                        .font(.kymaiaEyebrow)
                        .foregroundStyle(Color.kymaiaPrimaryStrong)
                    Spacer()
                    Button {
                        if speaker.isSpeaking {
                            speaker.stop()
                        } else {
                            speaker.speak(activeText)
                        }
                    } label: {
                        Label(speaker.isSpeaking ? "Stop audio" : "Listen to segment", systemImage: speaker.isSpeaking ? "stop.fill" : "play.fill")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))

                    if currentSegmentIndex + 1 < segments.count {
                        Button {
                            activeInterruptText = nil
                            currentSegmentIndex += 1
                            speaker.speak(segments[currentSegmentIndex])
                        } label: {
                            Label("Next segment", systemImage: "forward.end.fill")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                    }
                }

                Text(activeText)
                    .font(.kymaiaSerifProse)
                    .foregroundStyle(Color.kymaiaInk)
                    .fixedSize(horizontal: false, vertical: true)

                // Learner Interrupt Buttons (just like ChapterExplainerPlayer in kym_tutor)
                FlowLayout(spacing: Spacing.xs) {
                    Button {
                        activeInterruptText = simplerVariant
                        speaker.speak(simplerVariant)
                    } label: {
                        Label("Say that simpler", systemImage: "sparkles")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

                    Button {
                        activeInterruptText = mumbaiExample
                        speaker.speak(mumbaiExample)
                    } label: {
                        Label("Mumbai example", systemImage: "mappin.and.ellipse")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

                    Button {
                        activeInterruptText = quickCheckQuestion
                        speaker.speak(quickCheckQuestion)
                    } label: {
                        Label("Quiz me on this", systemImage: "questionmark.bubble")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

                    if activeInterruptText != nil {
                        Button("Back to main script") {
                            activeInterruptText = nil
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                    }
                }
            }
        }
    }
}

// MARK: - Full-Screen Apple Pencil Screen Annotator Overlay (TutorCanvas)

struct FullScreenPencilAnnotatorOverlay: View {
    @EnvironmentObject private var store: AppStore
    @Binding var isPresented: Bool
    @State private var strokes: [[CGPoint]] = []
    @State private var currentStroke: [CGPoint] = []
    @State private var annotationNote: String = ""
    @State private var savedBanner: String?

    init(isPresented: Binding<Bool>) {
        self._isPresented = isPresented
    }

    var body: some View {
        ZStack(alignment: .top) {
            GeometryReader { geo in
                ZStack {
                    Color.black.opacity(0.04)
                        .ignoresSafeArea()
                        .gesture(
                            DragGesture(minimumDistance: 0)
                                .onChanged { value in
                                    currentStroke.append(value.location)
                                }
                                .onEnded { _ in
                                    if !currentStroke.isEmpty {
                                        strokes.append(currentStroke)
                                        currentStroke = []
                                    }
                                }
                        )

                    Canvas { context, _ in
                        for stroke in strokes + [currentStroke] {
                            guard let first = stroke.first else { continue }
                            var path = Path()
                            path.move(to: first)
                            for pt in stroke.dropFirst() {
                                path.addLine(to: pt)
                            }
                            context.stroke(path, with: .color(Color.kymaiaPrimaryStrong), lineWidth: 3.5)
                        }
                    }
                    .allowsHitTesting(false)
                }
            }

            // Floating Top Annotation Toolbar
            HStack(spacing: Spacing.sm) {
                Label("Apple Pencil Screen Annotator", systemImage: "pencil.tip.crop.circle.badge.plus")
                    .font(.kymaiaSubheadline.weight(.semibold))
                    .foregroundStyle(Color.kymaiaInk)

                TextField("Tag this annotation...", text: $annotationNote)
                    .learnerTextInput(.reflection)
                    .textFieldStyle(.roundedBorder)
                    .frame(maxWidth: 240)

                Button {
                    strokes = []
                    currentStroke = []
                } label: {
                    Label("Clear ink", systemImage: "trash")
                }
                .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

                Button {
                    saveAnnotationToLabJournal()
                } label: {
                    Label("Save to Lab Journal", systemImage: "square.and.arrow.down.fill")
                }
                .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))

                Button {
                    isPresented = false
                } label: {
                    Label("Close", systemImage: "xmark.circle.fill")
                }
                .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
            }
            .padding(.horizontal, Spacing.md)
            .padding(.vertical, Spacing.sm)
            .background(
                Capsule()
                    .fill(Color.kymaiaSurface)
                    .shadow(color: .black.opacity(0.12), radius: 10, y: 4)
            )
            .padding(.top, Spacing.md)

            if let savedBanner {
                Text(savedBanner)
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.white)
                    .padding(.horizontal, Spacing.md)
                    .padding(.vertical, Spacing.xs)
                    .background(Capsule().fill(Color.kymaiaSuccess))
                    .padding(.top, 76)
            }
        }
    }

    private func saveAnnotationToLabJournal() {
        let strokePayload = try? JSONEncoder().encode(strokes.map { $0.map { [Double($0.x), Double($0.y)] } })
        store.createJournalEntry(
            title: annotationNote.isEmpty ? "Annotated Screen (\(store.selectedRoom.rawValue))" : annotationNote,
            templateKind: "sketch",
            paperStyle: "grid",
            linkedChapter: nil,
            linkedUnit: 7,
            cuesText: "Screen annotation from \(store.selectedRoom.rawValue)",
            bodyText: "Saved \(strokes.count) Apple Pencil ink strokes.",
            summaryText: annotationNote,
            drawingData: strokePayload
        )
        savedBanner = "Saved screen annotation to Lab Journal."
    }
}

// MARK: - Metacognition Error-Attribution Log & .kymbiobackup Archive Handoff

public enum BiologyErrorSlipCategory: String, Codable, CaseIterable, Sendable {
    case mechanismGap = "First-Principles Mechanism Gap"
    case cambridgeWording = "Cambridge Mark-Scheme Wording Slip"
    case unitConversion = "Unit Conversion / Quantitative Slip"
    case diagramReading = "Specimen Diagram / Graph Axis Slip"

    public var symbol: String {
        switch self {
        case .mechanismGap: return "gearshape.2"
        case .cambridgeWording: return "text.badge.checkmark"
        case .unitConversion: return "ruler"
        case .diagramReading: return "viewfinder"
        }
    }

    public var coachingFix: String {
        switch self {
        case .mechanismGap:
            return "Open the linked 3D Simulation and step through the 5-shot Watch Tour before re-attempting."
        case .cambridgeWording:
            return "Send the exact phrase to the Learn by Heart Vault and practise Stage 3 progressive deletion."
        case .unitConversion:
            return "Write the unit conversion factor (1 mm = 1000 um) on the first line of your Pencil scratchpad."
        case .diagramReading:
            return "Run a Blind Callout Pinning pass in the Specimen Diagram Recall Studio."
        }
    }
}

public struct MetacognitionErrorEntry: Identifiable, Codable, Equatable, Sendable {
    public var id: String
    public var unitOrChapter: String
    public var category: BiologyErrorSlipCategory
    public var whatIWWrote: String
    public var markSchemeCorrection: String
    public var createdAt: Date
}

public struct KymBioBackupArchive: Codable, Sendable {
    public var exportedAt: Date
    public var learnerName: String
    public var activeThemeId: String
    public var disciplineLens: String
    public var journalEntriesCount: Int
    public var provenQuestionsCount: Int
    public var errorLogEntries: [MetacognitionErrorEntry]
}

struct MetacognitionAndBackupSheet: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dismiss) private var dismiss

    @AppStorage("kymbio.metacognition.entries") private var errorEntriesJSON: String = "[]"
    @State private var selectedCategory: BiologyErrorSlipCategory = .cambridgeWording
    @State private var unitOrChapter: String = "Unit 7.1 · Ch 3"
    @State private var whatIWrote: String = ""
    @State private var markSchemeCorrection: String = ""
    @State private var exportedBackupJSON: String = ""

    init() {}

    private var entries: [MetacognitionErrorEntry] {
        guard let data = errorEntriesJSON.data(using: .utf8),
              let decoded = try? JSONDecoder().decode([MetacognitionErrorEntry].self, from: data) else {
            return Self.defaultEntries
        }
        return decoded.isEmpty ? Self.defaultEntries : decoded
    }

    private static let defaultEntries: [MetacognitionErrorEntry] = [
        MetacognitionErrorEntry(
            id: "err-seed-1",
            unitOrChapter: "Unit 1.4 Respiration",
            category: .cambridgeWording,
            whatIWWrote: "Mitochondria produce energy during aerobic respiration.",
            markSchemeCorrection: "Mitochondria release energy from glucose during aerobic respiration (energy cannot be created or produced).",
            createdAt: Date()
        ),
        MetacognitionErrorEntry(
            id: "err-seed-2",
            unitOrChapter: "Ch 2 Cell Microscopy",
            category: .unitConversion,
            whatIWWrote: "Divided image size in mm (30 mm) directly by actual size in um (15 um).",
            markSchemeCorrection: "Convert 30 mm -> 30,000 um first so both values share the same unit before M = I / A.",
            createdAt: Date()
        )
    ]

    var body: some View {
        JournalFocusPage(
            title: "Metacognition error log & study archive",
            progress: nil,
            closeLabel: "Done",
            close: { dismiss() }
        ) {
            // 1. Parent / Mentor Readiness Overview
            JournalSection(title: "1. Cambridge Science 8 & Living World readiness snapshot") {
                JournalCardRow {
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Label("Overall readiness", systemImage: "chart.bar.fill")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaPrimary)
                        Text("\(Int(store.overallReadinessScore * 100))%")
                            .font(.kymaiaTitle3)
                            .foregroundStyle(Color.kymaiaInk)
                        Text("BKT + FSRS + proofs")
                            .font(.kymaiaCaption2)
                            .foregroundStyle(Color.kymaiaMutedInk)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .journalMiniCard()

                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Label("Proven questions", systemImage: "checkmark.seal.fill")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaSuccess)
                        Text("\(store.questionProofStates.values.filter { $0.level == .proven || $0.level == .secure }.count)")
                            .font(.kymaiaTitle3)
                            .foregroundStyle(Color.kymaiaInk)
                        Text("Independent proofs")
                            .font(.kymaiaCaption2)
                            .foregroundStyle(Color.kymaiaMutedInk)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .journalMiniCard()

                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Label("Lab journal pages", systemImage: "book.pages")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaSecondary)
                        Text("\(store.journalEntries.count)")
                            .font(.kymaiaTitle3)
                            .foregroundStyle(Color.kymaiaInk)
                        Text("Cornell & sketches")
                            .font(.kymaiaCaption2)
                            .foregroundStyle(Color.kymaiaMutedInk)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .journalMiniCard()
                }
            }

            // 1B. Physiological Box Breathing & Diaphragm Reset
            JournalSection(title: "Pre-session diaphragm & vagus-nerve reset (Unit 1.3 & Ch 9)") {
                BiologyBreathingStudioView()
            }

            // 2. Log a new error slip
            JournalSection(title: "2. Diagnose a mistake (turn every lost mark into a rule)") {
                JournalCard {
                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        Picker("Slip category", selection: $selectedCategory) {
                            ForEach(BiologyErrorSlipCategory.allCases, id: \.self) { cat in
                                Text(cat.rawValue).tag(cat)
                            }
                        }
                        .pickerStyle(.menu)

                        Text("Recommended fix: \(selectedCategory.coachingFix)")
                            .font(.kymaiaCaption)
                            .foregroundStyle(Color.kymaiaPrimaryStrong)

                        TextField("Unit or Chapter (e.g. Unit 7.1 Nutrients)", text: $unitOrChapter)
                            .learnerTextInput(.reflection)
                            .textFieldStyle(.roundedBorder)

                        TextField("What I initially wrote or thought...", text: $whatIWrote, axis: .vertical)
                            .textFieldStyle(.roundedBorder)
                            .learnerTextInput(.retrieval)

                        TextField("Exact Cambridge mark-scheme or first-principles correction...", text: $markSchemeCorrection, axis: .vertical)
                            .textFieldStyle(.roundedBorder)
                            .learnerTextInput(.retrieval)

                        Button {
                            appendEntry()
                        } label: {
                            Label("Add to error log", systemImage: "plus.circle.fill")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                        .disabled(whatIWrote.isEmpty || markSchemeCorrection.isEmpty)
                    }
                }
            }

            // 3. Recorded Error Log
            JournalSection(title: "3. Your biology error-attribution log (\(entries.count))") {
                ForEach(entries) { item in
                    JournalCard {
                        VStack(alignment: .leading, spacing: Spacing.xs) {
                            HStack {
                                JournalChip(label: item.category.rawValue, systemImage: item.category.symbol, tone: .warn)
                                JournalChip(text: item.unitOrChapter, tone: .neutral)
                                Spacer()
                            }
                            Text("Slip: \(item.whatIWWrote)")
                                .font(.kymaiaBody)
                                .foregroundStyle(Color.kymaiaSecondaryInk)
                            Text("Correction: \(item.markSchemeCorrection)")
                                .font(.kymaiaBody.weight(.semibold))
                                .foregroundStyle(Color.kymaiaPrimaryStrong)
                        }
                    }
                }
            }

            // 4. Portable .kymbiobackup Export
            JournalSection(title: "4. Portable .kymbiobackup handoff (Mac <-> iPad)") {
                JournalCard {
                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        Text("Export a complete snapshot of your progress, proofs, Lab Journal entries, and Metacognition error log for device-to-device transfer.")
                            .font(.kymaiaBody)
                            .foregroundStyle(Color.kymaiaSecondaryInk)

                        HStack(spacing: Spacing.sm) {
                            Button {
                                generateBackupSnapshot()
                            } label: {
                                Label("Generate .kymbiobackup snapshot", systemImage: "externaldrive.fill.badge.checkmark")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))

                            if !exportedBackupJSON.isEmpty {
                                ShareLink(
                                    item: exportedBackupJSON,
                                    subject: Text("KymBio Study Archive (.kymbiobackup)"),
                                    message: Text("Kym's Cambridge Science 8 & The Living World study snapshot")
                                ) {
                                    Label("Share / AirDrop .kymbiobackup", systemImage: "square.and.arrow.up")
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            }
                        }

                        if !exportedBackupJSON.isEmpty {
                            Text(exportedBackupJSON)
                                .font(.kymaiaMonospaced)
                                .padding(Spacing.sm)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(
                                    RoundedRectangle(cornerRadius: CornerRadius.small)
                                        .fill(Color.kymaiaBackground)
                                )
                        }
                    }
                }
            }
        }
    }

    private func appendEntry() {
        var current = entries
        let fresh = MetacognitionErrorEntry(
            id: UUID().uuidString,
            unitOrChapter: unitOrChapter,
            category: selectedCategory,
            whatIWWrote: whatIWrote,
            markSchemeCorrection: markSchemeCorrection,
            createdAt: Date()
        )
        current.insert(fresh, at: 0)
        if let data = try? JSONEncoder().encode(current),
           let str = String(data: data, encoding: .utf8) {
            errorEntriesJSON = str
        }
        whatIWrote = ""
        markSchemeCorrection = ""
    }

    private func generateBackupSnapshot() {
        let archive = KymBioBackupArchive(
            exportedAt: Date(),
            learnerName: "Kym",
            activeThemeId: store.activeThemeID,
            disciplineLens: store.disciplineLens.rawValue,
            journalEntriesCount: store.journalEntries.count,
            provenQuestionsCount: store.questionProofStates.values.filter { $0.level == .proven || $0.level == .secure }.count,
            errorLogEntries: entries
        )
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601
        if let data = try? encoder.encode(archive),
           let str = String(data: data, encoding: .utf8) {
            exportedBackupJSON = str
        }
    }
}
