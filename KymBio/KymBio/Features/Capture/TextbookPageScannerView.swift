import PDFKit
import SwiftUI
import Vision

// MARK: - OCR Page Number & Sub-Topic Resolver

public enum CambridgeBookKind: String, CaseIterable, Codable, Identifiable, Sendable {
    case learnersBook = "learners_book"
    case workbook = "workbook"

    public var id: String { rawValue }

    public var displayTitle: String {
        switch self {
        case .learnersBook: return "Learner's Book 8"
        case .workbook: return "Workbook 8"
        }
    }
}

public struct ScannedPageResolution: Equatable, Sendable {
    public var detectedBookKind: CambridgeBookKind
    public var detectedBookType: String { detectedBookKind.rawValue }
    public var detectedPageNumber: Int?
    public var matchedUnitNumber: Int?
    public var matchedTopicId: String?
    public var matchedTopicCode: String?
    public var matchedTopicTitle: String?
    public var extractedText: String
}

enum CambridgePageAutoSlotter {
    /// Resolves OCR text + optional user-provided page/book hint to an exact Cambridge Science 8 sub-topic.
    static func resolve(
        ocrText: String,
        bookTypeHint: String = CambridgeBookKind.learnersBook.rawValue,
        manualPageOverride: Int? = nil,
        units: [SchoolScienceUnit]
    ) -> ScannedPageResolution {
        let lower = ocrText.lowercased()
        let detectedBook: CambridgeBookKind
        if lower.contains("workbook") || lower.contains("focus") && lower.contains("practice") && lower.contains("challenge") {
            detectedBook = .workbook
        } else {
            detectedBook = CambridgeBookKind(rawValue: bookTypeHint) ?? .learnersBook
        }

        let pageNumber = manualPageOverride ?? detectPageNumber(in: ocrText)
        guard let page = pageNumber else {
            return ScannedPageResolution(
                detectedBookKind: detectedBook,
                detectedPageNumber: nil,
                matchedUnitNumber: nil,
                matchedTopicId: nil,
                matchedTopicCode: nil,
                matchedTopicTitle: nil,
                extractedText: ocrText
            )
        }

        // Find the closest matching unit and sub-topic for this page number
        for unit in units {
            let rangeMatch: Bool
            if detectedBook == .workbook {
                rangeMatch = page >= unit.workbookStartPage && page <= unit.workbookEndPage
            } else {
                rangeMatch = page >= unit.learnersBookStartPage && page <= unit.learnersBookEndPage
            }
            guard rangeMatch else { continue }

            let sortedTopics = unit.topics.sorted {
                let p0 = detectedBook == .workbook ? $0.workbookPage : $0.learnersBookPage
                let p1 = detectedBook == .workbook ? $1.workbookPage : $1.learnersBookPage
                return p0 < p1
            }

            var bestTopic = sortedTopics.first
            for topic in sortedTopics {
                let topicStart = detectedBook == .workbook ? topic.workbookPage : topic.learnersBookPage
                if topicStart <= page {
                    bestTopic = topic
                }
            }

            return ScannedPageResolution(
                detectedBookKind: detectedBook,
                detectedPageNumber: page,
                matchedUnitNumber: unit.unitNumber,
                matchedTopicId: bestTopic?.id,
                matchedTopicCode: bestTopic?.code,
                matchedTopicTitle: bestTopic?.title,
                extractedText: ocrText
            )
        }

        return ScannedPageResolution(
            detectedBookKind: detectedBook,
            detectedPageNumber: page,
            matchedUnitNumber: nil,
            matchedTopicId: nil,
            matchedTopicCode: nil,
            matchedTopicTitle: nil,
            extractedText: ocrText
        )
    }

    public static func detectPageNumber(in text: String) -> Int? {
        let lines = text.components(separatedBy: .newlines)
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
            .filter { !$0.isEmpty }
        // Check first 3 lines and last 3 lines where headers/footers live in Cambridge Science 8
        let candidates = Array(lines.prefix(3)) + Array(lines.suffix(3))
        for line in candidates {
            let tokens = line.components(separatedBy: CharacterSet.decimalDigits.inverted).filter { !$0.isEmpty }
            for token in tokens {
                if let num = Int(token), (2...326).contains(num) {
                    return num
                }
            }
        }
        return nil
    }

    public static func recognizeText(from imageData: Data) -> String {
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        let handler = VNImageRequestHandler(data: imageData, options: [:])
        try? handler.perform([request])
        let observations = request.results ?? []
        return observations.compactMap { $0.topCandidates(1).first?.string }.joined(separator: "\n")
    }
}

// MARK: - Textbook & Workbook Page Scanner Sheet

struct TextbookPageScannerSheet: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dismiss) private var dismiss

    @State private var bookKind: CambridgeBookKind = .learnersBook
    @State private var pageInput: String = "233"
    @State private var ocrText: String = ""
    @State private var statusMessage: String?
    @State private var capturedPages: [CapturedTextbookPageRecord] = []
    #if os(iOS)
    @State private var showCameraScanner: Bool = false
    #endif

    init() {}

    private var currentResolution: ScannedPageResolution {
        CambridgePageAutoSlotter.resolve(
            ocrText: ocrText,
            bookTypeHint: bookKind.rawValue,
            manualPageOverride: Int(pageInput.trimmingCharacters(in: .whitespaces)),
            units: store.seedPack.schoolTextbook.units
        )
    }

    var body: some View {
        JournalFocusPage(
            title: "Scan or slot a textbook page",
            progress: nil,
            closeLabel: "Done",
            close: { dismiss() }
        ) {
            scannerControlsCard
            capturedPagesSection
        }
        .onAppear {
            capturedPages = store.fetchCapturedPages()
        }
        #if os(iOS)
        .sheet(isPresented: $showCameraScanner) {
            DocumentScannerSheet(
                onComplete: { result in
                    showCameraScanner = false
                    switch result {
                    case .success(let pdfURL):
                        if let pdf = PDFDocument(url: pdfURL), let text = pdf.string, !text.isEmpty {
                            ocrText = text
                            if let detectedPage = CambridgePageAutoSlotter.detectPageNumber(in: text) {
                                pageInput = "\(detectedPage)"
                            }
                        } else {
                            statusMessage = "Scanned PDF saved: \(pdfURL.lastPathComponent)"
                        }
                    case .failure(let error):
                        statusMessage = error.localizedDescription
                    }
                },
                onCancel: { showCameraScanner = false }
            )
        }
        #endif
    }

    private var scannerControlsCard: some View {
        let res = currentResolution
        return JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                Text("CAMBRIDGE SCIENCE 8 PAGE AUTO-SLOTTER")
                    .font(.kymaiaEyebrow)
                    .foregroundStyle(Color.kymaiaPrimaryStrong)

                Text("Snap any page from your Learner's Book 8 (pp. 8–326) or Workbook 8 (pp. 2–197). KymBio reads the page number and question text with Vision OCR and slots it into the exact sub-topic.")
                    .font(.kymaiaBody)
                    .foregroundStyle(Color.kymaiaSecondaryInk)

                HStack(spacing: Spacing.md) {
                    Picker("Book", selection: $bookKind) {
                        ForEach(CambridgeBookKind.allCases) { kind in
                            Text(kind.displayTitle).tag(kind)
                        }
                    }
                    .pickerStyle(.segmented)
                    .frame(maxWidth: 340)

                    HStack(spacing: Spacing.xs) {
                        Text("Page:")
                            .font(.kymaiaBody.weight(.semibold))
                        TextField("e.g. 233", text: $pageInput)
                            .learnerTextInput(.reflection)
                            .textFieldStyle(.roundedBorder)
                            .frame(width: 90)
                    }

                    #if os(iOS)
                    if DocumentScannerSupport.isSupported {
                        Button {
                            showCameraScanner = true
                        } label: {
                            Label("Scan with iPad camera", systemImage: "camera.viewfinder")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                    }
                    #endif
                }

                HStack(spacing: Spacing.sm) {
                    Image(systemName: res.matchedTopicCode != nil ? "checkmark.circle.fill" : "questionmark.circle")
                        .foregroundStyle(res.matchedTopicCode != nil ? Color.kymaiaSuccess : Color.kymaiaWarning)
                    if let code = res.matchedTopicCode, let title = res.matchedTopicTitle, let unitNum = res.matchedUnitNumber {
                        Text("Auto-slotted to Unit \(unitNum) · \(code) \(title) (\(res.detectedBookType == "workbook" ? "Workbook" : "Learner's Book") p. \(res.detectedPageNumber ?? 0))")
                            .font(.kymaiaBody.weight(.semibold))
                            .foregroundStyle(Color.kymaiaInk)
                    } else {
                        Text("Enter a page between 8–326 (Learner's Book) or 2–197 (Workbook) to auto-slot.")
                            .font(.kymaiaBody)
                            .foregroundStyle(Color.kymaiaSecondaryInk)
                    }
                }
                .padding(Spacing.sm)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(
                    RoundedRectangle(cornerRadius: CornerRadius.small)
                        .fill(Color.kymaiaSelectionFill.opacity(0.6))
                )

                VStack(alignment: .leading, spacing: Spacing.xs) {
                    Text("EXTRACTED PAGE TEXT / END-OF-TOPIC QUESTIONS")
                        .font(.kymaiaEyebrow)
                        .foregroundStyle(Color.kymaiaMutedInk)
                    TextEditor(text: $ocrText)
                        .learnerTextInput(.reflection)
                        .font(.kymaiaBody)
                        .frame(minHeight: 110)
                        .padding(Spacing.xs)
                        .background(
                            RoundedRectangle(cornerRadius: CornerRadius.small)
                                .stroke(Color.kymaiaControlBorder, lineWidth: 1)
                        )
                }

                HStack(spacing: Spacing.sm) {
                    Button {
                        saveCapturedPage(andCreateNote: false)
                    } label: {
                        Label("Save page to sub-topic", systemImage: "tray.and.arrow.down.fill")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))

                    Button {
                        saveCapturedPage(andCreateNote: true)
                    } label: {
                        Label("Save & open in Cornell Notes", systemImage: "note.text.badge.plus")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted))
                }

                if let statusMessage {
                    Text(statusMessage)
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaSuccess)
                }
            }
        }
    }

    @ViewBuilder
    private var capturedPagesSection: some View {
        if !capturedPages.isEmpty {
            JournalSection(title: "Captured textbook & workbook pages (\(capturedPages.count))") {
                ForEach(capturedPages) { page in
                    JournalCard {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                HStack(spacing: Spacing.xs) {
                                    JournalChip(
                                        label: page.bookType == "workbook" ? "Workbook p. \(page.pageNumber)" : "Learner's Book p. \(page.pageNumber)",
                                        systemImage: "doc.text.viewfinder",
                                        tone: .accent
                                    )
                                    JournalChip(text: page.topicId, tone: .neutral)
                                }
                                if !page.ocrText.isEmpty {
                                    Text(page.ocrText)
                                        .font(.kymaiaCaption)
                                        .foregroundStyle(Color.kymaiaSecondaryInk)
                                        .lineLimit(2)
                                }
                            }
                            Spacer()
                        }
                    }
                }
            }
        }
    }

    private func saveCapturedPage(andCreateNote: Bool) {
        let res = currentResolution
        let pageNum = res.detectedPageNumber ?? 233
        let topicId = res.matchedTopicId ?? "sci8-7.1"
        store.saveCapturedTextbookPage(
            topicId: topicId,
            bookType: res.detectedBookType,
            pageNumber: pageNum,
            ocrText: ocrText
        )
        capturedPages = store.fetchCapturedPages()
        statusMessage = "Saved \(res.detectedBookType == "workbook" ? "Workbook" : "Learner's Book") p. \(pageNum) into \(res.matchedTopicCode ?? topicId)."

        if andCreateNote {
            store.createJournalEntry(
                title: "\(res.detectedBookType == "workbook" ? "Workbook" : "Learner's Book") p. \(pageNum) · \(res.matchedTopicTitle ?? "Notes")",
                templateKind: "cornell",
                paperStyle: "cornell",
                linkedChapter: nil,
                linkedUnit: res.matchedUnitNumber ?? 7,
                cuesText: "Key questions from p. \(pageNum)",
                bodyText: ocrText,
                summaryText: ""
            )
            store.selectedRoom = .labJournal
            dismiss()
        }
    }
}
