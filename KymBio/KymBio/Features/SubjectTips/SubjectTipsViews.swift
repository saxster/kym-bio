import SwiftUI

enum SubjectTipsPackLoader {
    static func load(subject: SubjectTipSubject = .biology) -> [SubjectTip] {
        let filename = subject.packFileName.replacingOccurrences(of: ".json", with: "")
        var candidates: [URL?] = [
            Bundle.main.url(forResource: filename, withExtension: "json", subdirectory: "ContentPacks"),
            Bundle.main.url(forResource: filename, withExtension: "json")
        ]
        #if SWIFT_PACKAGE
        candidates.append(Bundle.module.url(forResource: filename, withExtension: "json", subdirectory: "ContentPacks"))
        candidates.append(Bundle.module.url(forResource: filename, withExtension: "json"))
        #endif
        for candidate in candidates {
            if let url = candidate,
               let data = try? Data(contentsOf: url),
               let pack = try? JSONDecoder().decode(SubjectTipsPack.self, from: data) {
                return pack.tips
            }
        }
        return []
    }
}

struct SubjectTipsLibrarySection: Identifiable, Equatable {
    let strand: String
    let tips: [SubjectTip]
    var id: String { strand }

    static func sections(_ tips: [SubjectTip], query: String, savedOnly: Bool, saved: Set<String>) -> [Self] {
        let needle = query.trimmingCharacters(in: .whitespacesAndNewlines)
        let matching = tips.filter { tip in
            let passesSaved = !savedOnly || saved.contains(tip.id)
            let passesQuery = needle.isEmpty || "\(tip.title) \(tip.summary) \(tip.strand)".localizedCaseInsensitiveContains(needle)
            return passesSaved && passesQuery
        }
        var order: [String] = []
        for tip in matching where !order.contains(tip.strand) { order.append(tip.strand) }
        return order.map { strand in Self(strand: strand, tips: matching.filter { $0.strand == strand }) }
    }
}

struct SubjectTipsLibraryView: View {
    @AppStorage("kymbio.subjectTips.savedIds") private var savedIdsRaw: String = ""
    @State private var selectedSubject: SubjectTipSubject = .biology
    @State private var tips: [SubjectTip] = []
    @State private var query = ""
    @State private var selectedStrand: String?
    @State private var savedOnly = false
    @State private var selectedTip: SubjectTip?

    init(initialSubject: SubjectTipSubject = .biology) {
        _selectedSubject = State(initialValue: initialSubject)
    }

    private var savedSet: Set<String> {
        Set(savedIdsRaw.split(separator: ",").map(String.init))
    }

    private var allStrands: [String] {
        var order: [String] = []
        for tip in tips where !order.contains(tip.strand) { order.append(tip.strand) }
        return order
    }

    private var sections: [SubjectTipsLibrarySection] {
        let base = SubjectTipsLibrarySection.sections(tips, query: query, savedOnly: savedOnly, saved: savedSet)
        guard let selectedStrand else { return base }
        return base.filter { $0.strand == selectedStrand }
    }

    var body: some View {
        JournalPage(
            title: "\(selectedSubject.name) visual field guide",
            subtitle: "Predict what will happen, test the interactive controls, then explain why in your own words."
        ) {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text("SCIENCE FIELD GUIDE LENS")
                        .font(.kymaiaEyebrow)
                        .foregroundStyle(Color.kymaiaMutedInk)
                    HStack(spacing: Spacing.sm) {
                        ForEach([SubjectTipSubject.biology, .chemistry, .physics], id: \.self) { subject in
                            Button {
                                selectedSubject = subject
                                selectedStrand = nil
                                tips = SubjectTipsPackLoader.load(subject: subject)
                            } label: {
                                Label(
                                    subject == .biology ? "Biology Core" : "\(subject.name) Bridges",
                                    systemImage: subject.symbol
                                )
                            }
                            .buttonStyle(KymaiaOptionButtonStyle(isSelected: selectedSubject == subject))
                        }
                    }

                    Toggle("Show saved tips only", isOn: $savedOnly)
                        .font(.kymaiaBody)
                        .tint(Color.kymaiaPrimary)

                    if allStrands.count > 1 {
                        FlowLayout(spacing: Spacing.xs) {
                            Button("All strands (\(tips.count))") { selectedStrand = nil }
                                .buttonStyle(KymaiaOptionButtonStyle(isSelected: selectedStrand == nil))
                            ForEach(allStrands, id: \.self) { strand in
                                let count = tips.filter { $0.strand == strand }.count
                                Button("\(strand) (\(count))") {
                                    selectedStrand = selectedStrand == strand ? nil : strand
                                }
                                .buttonStyle(KymaiaOptionButtonStyle(isSelected: selectedStrand == strand))
                            }
                        }
                    }
                }
            }

            if sections.isEmpty {
                JournalEmptyState(
                    title: savedOnly ? "No saved tips yet" : "No tips match",
                    systemImage: savedOnly ? "bookmark" : "magnifyingglass",
                    message: savedOnly ? "Bookmark any field guide tip to keep it handy here." : "Try a different search word."
                )
            } else {
                ForEach(sections) { section in
                    JournalSection(title: section.strand) {
                        ForEach(section.tips) { tip in
                            tipCard(tip)
                        }
                    }
                }
            }
        }
        .searchable(text: $query, prompt: "Find a \(selectedSubject.rawValue) demonstration")
        .onAppear {
            if tips.isEmpty {
                tips = SubjectTipsPackLoader.load(subject: selectedSubject)
            }
        }
        .sheet(item: $selectedTip) { tip in
            NavigationStack {
                SubjectTipDetailView(
                    tip: tip,
                    isSaved: savedSet.contains(tip.id),
                    onToggleSave: { toggleSaved(tip.id) }
                )
            }
            #if os(macOS)
            .frame(minWidth: 780, minHeight: 640)
            #endif
        }
    }

    private func toggleSaved(_ id: String) {
        var next = savedSet
        if next.contains(id) {
            next.remove(id)
        } else {
            next.insert(id)
        }
        savedIdsRaw = next.sorted().joined(separator: ",")
    }

    private func tipCard(_ tip: SubjectTip) -> some View {
        let isSaved = savedSet.contains(tip.id)
        return JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack {
                    JournalChip(
                        label: tip.visual.kind.activity,
                        systemImage: tip.visual.kind.symbol,
                        tone: .accent
                    )
                    JournalChip(label: tip.strand, systemImage: tip.subject.symbol, tone: .neutral)
                    Spacer()
                    Button {
                        toggleSaved(tip.id)
                    } label: {
                        Image(systemName: isSaved ? "bookmark.fill" : "bookmark")
                            .foregroundStyle(isSaved ? Color.kymaiaPrimary : Color.kymaiaMutedInk)
                    }
                    .buttonStyle(.plain)
                }

                Text(tip.title)
                    .font(.kymaiaCardTitle)
                    .foregroundStyle(Color.kymaiaInk)

                Text(tip.summary)
                    .font(.kymaiaBody)
                    .foregroundStyle(Color.kymaiaSecondaryInk)

                HStack {
                    Text("Syllabus: \(tip.syllabusRefs.joined(separator: " · "))")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Spacer()
                    Button {
                        selectedTip = tip
                    } label: {
                        Label("Open interactive tip", systemImage: "slider.horizontal.3")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                }
            }
        }
    }
}

struct SubjectTipDetailView: View {
    let tip: SubjectTip
    let isSaved: Bool
    let onToggleSave: () -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var reading: SubjectTipReading

    init(tip: SubjectTip, isSaved: Bool, onToggleSave: @escaping () -> Void) {
        self.tip = tip
        self.isSaved = isSaved
        self.onToggleSave = onToggleSave
        var initial = SubjectTipReading()
        initial.isSaved = isSaved
        initial.visualState = SubjectTipVisualLogic.initialState(for: tip.visual)
        _reading = State(initialValue: initial)
    }

    var body: some View {
        JournalReaderPage(title: tip.subject.title) {
            HStack {
                JournalEyebrow(symbol: tip.subject.symbol, tint: Color.kymaiaPrimary, text: tip.strand)
                Spacer()
                Button {
                    onToggleSave()
                    reading.isSaved.toggle()
                } label: {
                    Label(
                        reading.isSaved ? "Saved" : "Save tip",
                        systemImage: reading.isSaved ? "bookmark.fill" : "bookmark"
                    )
                }
                .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

                Button("Done") { dismiss() }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
            }

            Text(tip.title)
                .font(.kymaiaPageTitle)
                .foregroundStyle(Color.kymaiaInk)

            Text(tip.summary)
                .font(.kymaiaSerifProse)
                .foregroundStyle(Color.kymaiaSecondaryInk)

            stageHeader
            stageContent

            if reading.stage != .predict {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Divider().overlay(Color.kymaiaHairline)
                    Text("When it helps")
                        .font(.kymaiaTitle3)
                        .foregroundStyle(Color.kymaiaInk)
                    Text(tip.whenToUse)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaInk)

                    Text("Watch for this")
                        .font(.kymaiaTitle3)
                        .foregroundStyle(Color.kymaiaInk)
                    Text(tip.watchFor)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaInk)

                    SubjectTipGoDeeper(goDeeper: tip.goDeeper)
                }
            }
            SubjectTipSources(tip: tip)
        }
    }

    private var stageHeader: some View {
        VStack(alignment: .leading, spacing: Spacing.xs) {
            Text(reading.stage.progress)
                .font(.kymaiaEyebrow)
                .textCase(.uppercase)
                .foregroundStyle(Color.kymaiaMutedInk)
            HStack(spacing: Spacing.xs) {
                ForEach(SubjectTipStage.allCases, id: \.self) { stage in
                    Capsule()
                        .fill(stage.rawValue <= reading.stage.rawValue ? Color.kymaiaPrimary : Color.kymaiaControlFill)
                        .frame(height: 4)
                }
            }
            FlowLayout(spacing: Spacing.xs) {
                ForEach(SubjectTipStage.allCases, id: \.self) { item in
                    let label = ["1. Predict", "2. Explore", "3. Explain", "4. Practise"][item.rawValue]
                    Button(label) { reading.stage = item }
                        .buttonStyle(KymaiaOptionButtonStyle(isSelected: reading.stage == item))
                }
            }
        }
    }

    @ViewBuilder
    private var stageContent: some View {
        switch reading.stage {
        case .predict:
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text(tip.prediction)
                        .font(.kymaiaSerifPrompt)
                    TextField("Write your prediction before testing the controls...", text: $reading.prediction, axis: .vertical)
                        .textFieldStyle(.roundedBorder)
                        .learnerTextInput(.retrieval)
                    HStack {
                        Button("Explore the demonstration") {
                            reading.stage = .explore
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))

                        Button("I'm not sure yet") {
                            if reading.prediction.isEmpty {
                                reading.prediction = "I'm not sure yet"
                            }
                            reading.stage = .explore
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost))
                    }
                }
            }
        case .explore:
            if !reading.prediction.isEmpty {
                JournalCard {
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Text("YOUR PREDICTION")
                            .font(.kymaiaEyebrow)
                            .foregroundStyle(Color.kymaiaMutedInk)
                        Text(reading.prediction)
                            .font(.kymaiaBody)
                    }
                }
            }
            JournalCard {
                SubjectTipVisualView(visual: tip.visual, state: $reading.visualState)
            }
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text("Why it works")
                        .font(.kymaiaTitle3)
                    Text(tip.why)
                        .font(.kymaiaSerifProse)
                    Button("Continue to explain") {
                        reading.stage = .explain
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                }
            }
        case .explain:
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text(tip.explainPrompt)
                        .font(.kymaiaSerifPrompt)
                    TextField("Explain the mechanism in your own words...", text: $reading.explanation, axis: .vertical)
                        .textFieldStyle(.roundedBorder)
                        .learnerTextInput(.retrieval)
                    HStack {
                        Button("Continue to practise") {
                            reading.stage = .practise
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                        Button("Back to demonstration") {
                            reading.stage = .explore
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost))
                    }
                }
            }
        case .practise:
            SubjectTipPracticeList(questions: tip.practice, revealed: $reading.revealedPractice)
        }
    }
}
