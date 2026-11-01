import SwiftUI

enum JournalTemplateKind: String, CaseIterable, Identifiable, Sendable {
    case cornell = "cornell"
    case labLog = "lab_log"
    case sketch = "sketch"
    case outline = "outline"
    case free = "free"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .cornell: return "Cornell notes"
        case .labLog: return "Biology lab log"
        case .sketch: return "Specimen sketch"
        case .outline: return "Outline"
        case .free: return "Free page"
        }
    }

    var defaultPaperStyle: JournalPaperStyle {
        switch self {
        case .cornell: return .cornell
        case .labLog, .sketch: return .grid
        case .outline, .free: return .lined
        }
    }
}

extension LabJournalEntryRecord {
    var parsedTemplateKind: JournalTemplateKind {
        JournalTemplateKind(rawValue: templateKind) ?? .free
    }
}

struct LabJournalHomeView: View {
    @EnvironmentObject private var store: AppStore
    @State private var isCreatingNew = false
    @State private var coverAndTestMe: Bool = false
    @State private var entryStrokes: [[CGPoint]] = []
    @State private var activeStroke: [CGPoint] = []
    @State private var safetySupportMessage: String? = nil

    private var selectedEntry: LabJournalEntryRecord? {
        store.activeJournalEntry ?? store.journalEntries.first
    }

    var body: some View {
        JournalPage(
            title: "Lab Journal & Cornell Notes",
            subtitle: "Cornell cue-testing, scientific enquiry lab logs and Apple Pencil specimen sketches (private by default)",
            floatingAction: JournalAction(
                title: "New journal page",
                systemImage: "plus",
                hint: "Create a new Cornell page, Biology Lab Log or Specimen Sketch",
                identifier: "journal.new-page",
                action: { createBlankEntry(kind: .cornell) }
            )
        ) {
            templateQuickCreateBar
            entriesListSection
            if let entry = selectedEntry {
                activeEntryEditorSection(entry)
            }
        }
        .sessionJournalSafetyAlert(message: $safetySupportMessage)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                ThemePickerMenu()
            }
        }
    }

    private func saveAndScanJournalEntry(_ entry: LabJournalEntryRecord, latestFieldText: String) {
        store.activeJournalEntry = entry
        store.saveJournalEntry(entry)
        let safetyService = SafetyEscalationService()
        if let concern = safetyService.scan(latestFieldText) {
            safetySupportMessage = safetyService.supportiveResponse(for: concern)
            Task {
                await safetyService.escalate(concern, channel: "lab_journal")
            }
        }
    }

    private var templateQuickCreateBar: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                Text("Start a new page from a biology template")
                    .font(.kymaiaCardTitle)
                FlowLayout(spacing: Spacing.xs) {
                    ForEach(JournalTemplateKind.allCases) { kind in
                        Button {
                            createBlankEntry(kind: kind)
                        } label: {
                            Label("New \(kind.title)", systemImage: "doc.badge.plus")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        .accessibilityIdentifier("journal.create.\(kind.rawValue)")
                    }
                }
            }
        }
    }

    private var entriesListSection: some View {
        JournalSection(title: "Saved Lab Journal pages (\(store.journalEntries.count))") {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: JournalLayout.cardRowSpacing) {
                    ForEach(store.journalEntries) { entry in
                        let isSelected = entry.id == selectedEntry?.id
                        Button {
                            store.activeJournalEntry = entry
                            coverAndTestMe = false
                            entryStrokes = JournalInkDrawingCodec.decode(data: entry.drawingData)
                            activeStroke.removeAll()
                        } label: {
                            VStack(alignment: .leading, spacing: Spacing.xs) {
                                HStack {
                                    JournalChip(text: entry.parsedTemplateKind.title, tone: .accent)
                                    if let code = entry.linkedTopicCode {
                                        JournalChip(text: "Topic \(code)", tone: .good)
                                    }
                                    Spacer()
                                }
                                Text(entry.title)
                                    .font(.kymaiaCardTitle)
                                    .foregroundStyle(Color.kymaiaInk)
                                    .lineLimit(2)
                                Text(entry.summaryText.isEmpty ? entry.bodyNotesText : entry.summaryText)
                                    .font(.kymaiaCaption)
                                    .foregroundStyle(Color.kymaiaMutedInk)
                                    .lineLimit(2)
                            }
                            .frame(width: 260, alignment: .topLeading)
                            .padding(Spacing.md)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                                    .fill(isSelected ? Color.kymaiaSelectionFill : Color.kymaiaSurface)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                                    .strokeBorder(isSelected ? Color.kymaiaPrimary : Color.kymaiaHairline, lineWidth: isSelected ? 2 : 1)
                            )
                        }
                        .buttonStyle(.plain)
                        .accessibilityIdentifier("journal.entry.\(entry.id)")
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func activeEntryEditorSection(_ entry: LabJournalEntryRecord) -> some View {
        let paperStyle = JournalPaperStyle(rawValue: entry.paperStyle) ?? .cornell

        JournalSection(title: "Active page · \(entry.title)") {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    HStack {
                        TextField(
                            "Page title",
                            text: Binding(
                                get: { entry.title },
                                set: { newTitle in
                                    var updated = entry
                                    updated.title = newTitle
                                    store.activeJournalEntry = updated
                                    store.saveJournalEntry(updated)
                                }
                            )
                        )
                        .learnerTextInput(.reflection)
                        .font(.kymaiaTitle3)

                        Spacer()

                        Button {
                            let muddy = entry.summaryText.isEmpty ? entry.bodyNotesText : entry.summaryText
                            store.shareJournalMuddiestPointWithCoach("\(entry.title): \(muddy)")
                        } label: {
                            Label("Share muddiest point with Coach", systemImage: "bubble.left.and.text.bubble.right.fill")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        .accessibilityIdentifier("journal.share-muddiest-point")

                        if entry.parsedTemplateKind == .cornell {
                            Button {
                                withKymaiaAnimation(.kymaiaQuick) {
                                    coverAndTestMe.toggle()
                                }
                            } label: {
                                Label(
                                    coverAndTestMe ? "Show notes" : "Cover and test me",
                                    systemImage: coverAndTestMe ? "eye.fill" : "eye.slash.fill"
                                )
                            }
                            .buttonStyle(
                                JournalCapsuleButtonStyle(
                                    prominence: coverAndTestMe ? .filled : .tinted,
                                    size: .small
                                )
                            )
                            .accessibilityIdentifier("journal.cornell.cover-toggle")
                        }
                    }

                    // Paper style picker
                    HStack(spacing: Spacing.xs) {
                        Text("Paper ruling:")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaMutedInk)
                        ForEach(JournalPaperStyle.allCases) { style in
                            Button(style.label) {
                                var updated = entry
                                updated.paperStyle = style.rawValue
                                store.activeJournalEntry = updated
                                store.saveJournalEntry(updated)
                            }
                            .buttonStyle(
                                JournalCapsuleButtonStyle(
                                    prominence: paperStyle == style ? .filled : .ghost,
                                    size: .small
                                )
                            )
                        }
                    }

                    if entry.parsedTemplateKind == .cornell {
                        // Read mode uses JournalCornellReader when Cover & Test Me is active
                        if coverAndTestMe {
                            JournalCornellReader(
                                cues: entry.cueColumnText,
                                notes: entry.bodyNotesText,
                                summary: entry.summaryText,
                                minHeight: 280
                            )
                        } else {
                            JournalPaperSheet(style: .cornell, minHeight: 300) {
                                VStack(alignment: .leading, spacing: Spacing.md) {
                                    HStack(alignment: .top, spacing: Spacing.md) {
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text("Cue questions (left column)")
                                                .font(.kymaiaCaption.weight(.semibold))
                                                .foregroundStyle(Color.kymaiaPrimary)
                                            WritingTextEditor(
                                                text: Binding(
                                                    get: { entry.cueColumnText },
                                                    set: { val in
                                                        var u = entry
                                                        u.cueColumnText = val
                                                        saveAndScanJournalEntry(u, latestFieldText: val)
                                                    }
                                                ),
                                                serif: true
                                            )
                                            .learnerTextInput(.reflection)
                                            .frame(minHeight: 160)
                                        }
                                        .frame(maxWidth: 220)

                                        VStack(alignment: .leading, spacing: 4) {
                                            Text("Main biology notes & definitions (right column)")
                                                .font(.kymaiaCaption.weight(.semibold))
                                                .foregroundStyle(Color.kymaiaPrimary)
                                            WritingTextEditor(
                                                text: Binding(
                                                    get: { entry.bodyNotesText },
                                                    set: { val in
                                                        var u = entry
                                                        u.bodyNotesText = val
                                                        saveAndScanJournalEntry(u, latestFieldText: val)
                                                    }
                                                ),
                                                serif: true
                                            )
                                            .learnerTextInput(.reflection)
                                            .frame(minHeight: 160)
                                        }
                                    }

                                    Divider()
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("Bottom summary in your own words")
                                            .font(.kymaiaCaption.weight(.semibold))
                                            .foregroundStyle(Color.kymaiaPrimary)
                                        TextField(
                                            "Summarise the core mechanism in one or two sentences…",
                                            text: Binding(
                                                get: { entry.summaryText },
                                                set: { val in
                                                    var u = entry
                                                    u.summaryText = val
                                                    saveAndScanJournalEntry(u, latestFieldText: val)
                                                }
                                            )
                                        )
                                        .learnerTextInput(.reflection)
                                        .textFieldStyle(.roundedBorder)
                                    }
                                }
                                .padding(Spacing.md)
                            }
                        }
                    } else if entry.parsedTemplateKind == .labLog {
                        // Scientific Enquiry Biology Lab Log
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            Text("Scientific Enquiry Variables (Thinking and Working Scientifically)")
                                .font(.kymaiaCaption.weight(.semibold))
                                .foregroundStyle(Color.kymaiaPrimary)

                            Grid(alignment: .leading, horizontalSpacing: Spacing.md, verticalSpacing: Spacing.xs) {
                                GridRow {
                                    Text("Hypothesis:").font(.kymaiaCaption.weight(.semibold))
                                    TextField("What do you predict and why?", text: Binding(
                                        get: { entry.hypothesisText },
                                        set: { v in var u = entry; u.hypothesisText = v; store.activeJournalEntry = u; store.saveJournalEntry(u) }
                                    ))
                                    .learnerTextInput(.reflection)
                                    .textFieldStyle(.roundedBorder)
                                }
                                GridRow {
                                    Text("Independent var:").font(.kymaiaCaption.weight(.semibold))
                                    TextField("Variable you change", text: Binding(
                                        get: { entry.independentVarText },
                                        set: { v in var u = entry; u.independentVarText = v; store.activeJournalEntry = u; store.saveJournalEntry(u) }
                                    ))
                                    .learnerTextInput(.reflection)
                                    .textFieldStyle(.roundedBorder)
                                }
                                GridRow {
                                    Text("Dependent var:").font(.kymaiaCaption.weight(.semibold))
                                    TextField("Variable you measure (with units)", text: Binding(
                                        get: { entry.dependentVarText },
                                        set: { v in var u = entry; u.dependentVarText = v; store.activeJournalEntry = u; store.saveJournalEntry(u) }
                                    ))
                                    .learnerTextInput(.reflection)
                                    .textFieldStyle(.roundedBorder)
                                }
                                GridRow {
                                    Text("Control vars:").font(.kymaiaCaption.weight(.semibold))
                                    TextField("Variables kept constant for a fair test", text: Binding(
                                        get: { entry.controlVarsText },
                                        set: { v in var u = entry; u.controlVarsText = v; store.activeJournalEntry = u; store.saveJournalEntry(u) }
                                    ))
                                    .learnerTextInput(.reflection)
                                    .textFieldStyle(.roundedBorder)
                                }
                            }
                        }
                    }

                    // Apple Pencil Sketch & Apparatus Canvas on JournalPaperSheet
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        HStack {
                            Label("Apple Pencil specimen & apparatus sketch surface", systemImage: "pencil.tip.crop.circle")
                                .font(.kymaiaCaption.weight(.semibold))
                                .foregroundStyle(Color.kymaiaMutedInk)
                            Spacer()
                            Button("Clear ink") {
                                entryStrokes.removeAll()
                                activeStroke.removeAll()
                                var u = entry
                                u.drawingData = nil
                                store.activeJournalEntry = u
                                store.saveJournalEntry(u)
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                        }

                        JournalPaperSheet(style: paperStyle, minHeight: 220) {
                            ZStack(alignment: .topLeading) {
                                if !entry.bodyNotesText.isEmpty && entry.parsedTemplateKind != .cornell {
                                    Text(entry.bodyNotesText)
                                        .font(.kymaiaSerifProse)
                                        .foregroundStyle(Color.kymaiaMutedInk)
                                        .padding(Spacing.md)
                                }
                                JournalInkCanvasView(
                                    strokes: $entryStrokes,
                                    activeStroke: $activeStroke,
                                    strokeColor: Color.kymaiaInk,
                                    lineWidth: 2.5,
                                    onStrokesCommitted: { _, encoded in
                                        var u = entry
                                        u.drawingData = encoded
                                        store.activeJournalEntry = u
                                        store.saveJournalEntry(u)
                                    },
                                    onTextConverted: { recognized in
                                        var u = entry
                                        if u.bodyNotesText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                                            u.bodyNotesText = recognized
                                        } else {
                                            u.bodyNotesText += "\n" + recognized
                                        }
                                        store.activeJournalEntry = u
                                        store.saveJournalEntry(u)
                                    }
                                )
                                .frame(minHeight: 220)
                            }
                        }
                    }
                }
            }
            .onAppear {
                entryStrokes = JournalInkDrawingCodec.decode(data: entry.drawingData)
            }
            .onChange(of: entry.id) { _, _ in
                entryStrokes = JournalInkDrawingCodec.decode(data: entry.drawingData)
                activeStroke.removeAll()
            }
        }
    }

    private func createBlankEntry(kind: JournalTemplateKind) {
        let now = Date()
        let entry = LabJournalEntryRecord(
            id: "journal-\(kind.rawValue)-\(Int(now.timeIntervalSince1970))",
            title: "New \(kind.title) — Unit \(store.selectedUnitNumber)",
            templateKind: kind.rawValue,
            paperStyle: kind.defaultPaperStyle.rawValue,
            linkedTopicCode: store.selectedTopicCode,
            linkedChapterNumber: store.activeLivingWorldChapter,
            linkedWidgetId: store.activeWidgetId,
            cueColumnText: "1. What is the key structure?\n2. What is the exact Cambridge mark-scheme wording?",
            bodyNotesText: "",
            summaryText: "",
            hypothesisText: "",
            independentVarText: "",
            dependentVarText: "",
            controlVarsText: "",
            drawingData: nil,
            snapshotPNGData: nil,
            createdAt: now,
            updatedAt: now
        )
        store.saveJournalEntry(entry)
        store.activeJournalEntry = entry
        coverAndTestMe = false
    }
}
