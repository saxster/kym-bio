import SwiftUI

struct SchoolScienceHomeView: View {
    @EnvironmentObject private var store: AppStore
    @State private var showingPageScanner = false
    @State private var scannedPDFURL: URL?
    @State private var expandedBridgeIds: Set<String> = []
    @State private var revealedBridgeAnswers: Set<String> = []

    private var textbook: SchoolScienceTextbook {
        store.pack.schoolTextbook
    }

    private var visibleUnits: [SchoolScienceUnit] {
        textbook.units(for: store.selectedSchoolLens)
    }

    private var activeUnit: SchoolScienceUnit? {
        visibleUnits.first(where: { $0.unitNumber == store.selectedUnitNumber }) ?? visibleUnits.first
    }

    var body: some View {
        JournalPage(
            title: "School Science 8",
            subtitle: "\(textbook.title) · \(textbook.authors)"
        ) {
            lensSelectorCard
            bookOverviewBanner
            unitsSelectorSection
            if let unit = activeUnit {
                unitDetailSection(for: unit)
            }
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                StandardThemeMenu()
            }
        }
        .sheet(item: $store.activePracticeQuestion) { question in
            NavigationStack {
                QuestionProofPracticeView(question: question)
                    .environmentObject(store)
            }
        }
        .sheet(isPresented: $showingPageScanner) {
            TextbookPageScannerSheet()
                .environmentObject(store)
                #if os(macOS)
                .frame(minWidth: 760, minHeight: 620)
                #endif
        }
    }

    // MARK: - 3-Lens Filter Bar

    private var lensSelectorCard: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack {
                    JournalBadge(symbol: "line.3.horizontal.decrease.circle.fill", tint: .kymaiaPrimary, size: .row)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Cambridge Science 8 lens")
                            .font(.kymaiaCardTitle)
                            .foregroundStyle(Color.kymaiaInk)
                        Text(store.selectedSchoolLens.subtitle)
                            .font(.kymaiaCaption)
                            .foregroundStyle(Color.kymaiaMutedInk)
                    }
                    Spacer()
                    Button {
                        showingPageScanner = true
                    } label: {
                        Label("Scan or slot page", systemImage: "doc.text.viewfinder")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                    .accessibilityIdentifier("school.scan-page")
                }

                AdaptiveOptionPicker(
                    "Textbook lens",
                    selection: $store.selectedSchoolLens,
                    options: ScienceDisciplineLens.allCases,
                    titleForOption: \.title
                )
                .accessibilityIdentifier("school.lens-picker")
            }
        }
    }

    // MARK: - Textbook & Workbook Overview Banner

    private var bookOverviewBanner: some View {
        JournalCardRow {
            VStack(alignment: .leading, spacing: Spacing.xs) {
                HStack(spacing: Spacing.xs) {
                    JournalChip(text: "Learner's Book 8", tone: .accent)
                    JournalChip(text: "pp. 8–326", tone: .neutral)
                }
                Text("Topic questions, Think like a scientist investigations and Check your progress papers.")
                    .font(.kymaiaCaption)
                    .foregroundStyle(Color.kymaiaMutedInk)
            }
            .journalMiniCard()

            VStack(alignment: .leading, spacing: Spacing.xs) {
                HStack(spacing: Spacing.xs) {
                    JournalChip(text: "Workbook 8", tone: .good)
                    JournalChip(text: "pp. 2–197", tone: .neutral)
                }
                Text("Tiered Focus, Practice and Challenge exercises paired page-for-page with every topic.")
                    .font(.kymaiaCaption)
                    .foregroundStyle(Color.kymaiaMutedInk)
            }
            .journalMiniCard()
        }
    }

    // MARK: - Units Strip

    private var unitsSelectorSection: some View {
        JournalSection(title: "Units in view (\(visibleUnits.count) of 9)") {
            VStack(spacing: Spacing.sm) {
                ForEach(visibleUnits) { unit in
                    let readiness = store.unitReadiness(for: unit)
                    let isSelected = unit.unitNumber == activeUnit?.unitNumber
                    Button {
                        withKymaiaAnimation(.kymaiaQuick) {
                            store.selectedUnitNumber = unit.unitNumber
                            store.selectedTopicCode = unit.topics.first?.code
                        }
                    } label: {
                        HStack(alignment: .top, spacing: Spacing.md) {
                            JournalBadge(
                                symbol: unit.isCoreBiology ? "leaf.fill" : (unit.isBiologyBridge ? "atom" : "sparkles"),
                                tint: unit.isCoreBiology ? .kymaiaSuccess : (unit.isBiologyBridge ? .kymaiaPrimary : .kymaiaSecondary),
                                size: .row
                            )
                            VStack(alignment: .leading, spacing: 4) {
                                HStack(spacing: Spacing.xs) {
                                    Text("Unit \(unit.unitNumber): \(unit.title)")
                                        .font(.kymaiaBody.weight(.semibold))
                                        .foregroundStyle(Color.kymaiaInk)
                                    if unit.isCompletedInSchool {
                                        JournalChip(text: "Ticked in book", tone: .good)
                                    } else if unit.unitNumber == 7 {
                                        JournalChip(text: "Next in school", tone: .accent)
                                    }
                                }
                                Text("Learner's Book pp. \(unit.learnersBookStartPage)–\(unit.learnersBookEndPage) · Workbook pp. \(unit.workbookStartPage)–\(unit.workbookEndPage)")
                                    .font(.kymaiaCaption.monospacedDigit())
                                    .foregroundStyle(Color.kymaiaMutedInk)
                                Text(unit.scienceStrands.joined(separator: " · "))
                                    .font(.kymaiaCaption)
                                    .foregroundStyle(Color.kymaiaTertiaryInk)
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 4) {
                                JournalChip(
                                    text: readiness.readinessBadgeText,
                                    tone: readiness.independentProofFraction >= 0.8 ? .good : .neutral
                                )
                                Text("\(unit.topics.count) topics")
                                    .font(.kymaiaCaption.monospacedDigit())
                                    .foregroundStyle(Color.kymaiaTertiaryInk)
                            }
                        }
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
                    .accessibilityIdentifier("school.unit.\(unit.unitNumber)")
                }
            }
        }
    }

    // MARK: - Active Unit Detail (Topics + First-Principles Bridges + Question Proofs)

    @ViewBuilder
    private func unitDetailSection(for unit: SchoolScienceUnit) -> some View {
        let readiness = store.unitReadiness(for: unit)
        let unitQuestions = store.questions(forUnit: unit.unitNumber)
        let unitBridges = store.bridges(forUnit: unit.unitNumber)

        BiologyChapterExplainerBar(
            title: "Unit \(unit.unitNumber): \(unit.title)",
            segments: unit.topics.map { "\($0.code) \($0.title) (LB p. \($0.learnersBookPage), WB p. \($0.workbookPage)): \($0.summary)" },
            simplerVariant: "Core idea of Unit \(unit.unitNumber) (\(unit.title)): \(unit.scienceInContext)",
            mumbaiExample: "Cambridge Science 8 watchout for Unit \(unit.unitNumber): \(unit.topics.first?.cambridgeWatchouts.first ?? "Use exact mark-scheme vocabulary.")",
            quickCheckQuestion: unitQuestions.first?.prompt ?? "What is the central scientific mechanism tested in Unit \(unit.unitNumber) (\(unit.title))?"
        )
        .id("explainer-unit-\(unit.unitNumber)")

        JournalSection(title: "Unit \(unit.unitNumber): \(unit.title) — Three-stage readiness") {
            JournalCardRow {
                VStack(alignment: .leading, spacing: 4) {
                    Text("1. Material in")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Text("\(readiness.chaptersReadCount) of \(unit.livingWorldChapters.count) chapters read")
                        .font(.kymaiaCardTitle.monospacedDigit())
                    Text("LB pp. \(unit.learnersBookStartPage)–\(unit.learnersBookEndPage) · WB pp. \(unit.workbookStartPage)–\(unit.workbookEndPage)")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaTertiaryInk)
                }
                .journalMiniCard()

                VStack(alignment: .leading, spacing: 4) {
                    Text("2. Checked learning")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Text("\(readiness.widgetsStampedCount) lab stamps · \(Int(readiness.averageBKTMastery * 100))% skill")
                        .font(.kymaiaCardTitle.monospacedDigit())
                    Text("\(readiness.questionsAssistedCount) guided attempts")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaTertiaryInk)
                }
                .journalMiniCard()

                VStack(alignment: .leading, spacing: 4) {
                    Text("3. Independent proof")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Text("\(readiness.questionsProvenCount + readiness.questionsSecureCount) of \(readiness.questionsTotal) proven")
                        .font(.kymaiaCardTitle.monospacedDigit())
                    Text("\(readiness.questionsSecureCount) secure across 2+ days")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaTertiaryInk)
                }
                .journalMiniCard()
            }
        }

        JournalSection(title: "Sub-topics in Unit \(unit.unitNumber)") {
            VStack(spacing: Spacing.md) {
                ForEach(unit.topics) { topic in
                    topicCard(topic, in: unit)
                }
            }
        }

        if !unitBridges.isEmpty {
            JournalSection(title: "First-principles Chemistry & Physics bridges") {
                VStack(spacing: Spacing.md) {
                    ForEach(unitBridges) { bridge in
                        bridgeCard(bridge)
                    }
                }
            }
        }

        JournalSection(title: "Learner's Book & Workbook Question Proofs (\(unitQuestions.count))") {
            if unitQuestions.isEmpty {
                JournalEmptyState(
                    title: "Questions for this unit live in the sibling Science app",
                    systemImage: "arrow.up.forward.app",
                    message: "This unit is part of the general Chemistry or Physics strand. Switch to Unit 1, 2, 3, 4 or 7 for Biology & Bridge question proofs."
                )
            } else {
                VStack(spacing: Spacing.md) {
                    ForEach(unitQuestions) { question in
                        questionProofRowCard(question)
                    }
                }
            }
        }
    }

    private func topicCard(_ topic: SchoolScienceTopic, in unit: SchoolScienceUnit) -> some View {
        let skill = store.bktSkills[topic.code]
        return JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: Spacing.xs) {
                            Text("\(topic.code) \(topic.title)")
                                .font(.kymaiaCardTitle)
                                .foregroundStyle(Color.kymaiaInk)
                            JournalChip(text: "LB p. \(topic.learnersBookPage)", tone: .accent)
                            JournalChip(text: "WB p. \(topic.workbookPage)", tone: .good)
                        }
                        Text(topic.summary)
                            .font(.kymaiaBody)
                            .foregroundStyle(Color.kymaiaMutedInk)
                    }
                    Spacer()
                    if let skill {
                        JournalChip(
                            text: "\(Int(skill.pLearned * 100))% mastery",
                            tone: skill.pLearned >= 0.8 ? .good : .neutral
                        )
                    }
                }

                if !topic.cambridgeWatchouts.isEmpty {
                    VStack(alignment: .leading, spacing: 4) {
                        Label("Cambridge mark-scheme wording watchouts", systemImage: "checkmark.shield.fill")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaPrimary)
                        ForEach(topic.cambridgeWatchouts, id: \.self) { watchout in
                            Text("• \(watchout)")
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaInk)
                        }
                    }
                    .padding(Spacing.sm)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                            .fill(Color.kymaiaElevatedSurface)
                    )
                }

                FlowLayout(spacing: Spacing.xs) {
                    ForEach(topic.livingWorldChapters, id: \.self) { chNum in
                        if let ch = store.pack.chapters.first(where: { $0.number == chNum }) {
                            Button {
                                store.activeLivingWorldChapter = chNum
                                store.selectedRoom = .livingWorld
                            } label: {
                                Label("Read Ch \(chNum): \(ch.title)", systemImage: "book.pages")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            .accessibilityIdentifier("school.topic.\(topic.code).open-ch\(chNum)")
                        }
                    }

                    ForEach(topic.linkedWidgets, id: \.self) { wId in
                        Button {
                            store.activeWidgetId = wId
                            store.selectedRoom = .labsAtlas
                        } label: {
                            Label("Open Lab: \(wId.replacingOccurrences(of: "_", with: " "))", systemImage: "cube.transparent")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                        .accessibilityIdentifier("school.topic.\(topic.code).open-widget.\(wId)")
                    }
                }
            }
        }
    }

    private func bridgeCard(_ bridge: CrossDisciplinaryBridge) -> some View {
        let isRevealed = revealedBridgeAnswers.contains(bridge.id)
        return JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack {
                    JournalBadge(
                        symbol: bridge.badgeSymbol,
                        tint: bridge.isChemistry ? .kymaiaPrimary : .kymaiaSecondary,
                        size: .row
                    )
                    VStack(alignment: .leading, spacing: 2) {
                        HStack(spacing: Spacing.xs) {
                            JournalChip(text: bridge.sourceBook, tone: .accent)
                            JournalChip(text: bridge.sourceRef, tone: .neutral)
                        }
                        Text(bridge.title)
                            .font(.kymaiaCardTitle)
                            .foregroundStyle(Color.kymaiaInk)
                    }
                    Spacer()
                }

                Text(bridge.summary)
                    .font(.kymaiaBody)
                    .foregroundStyle(Color.kymaiaInk)

                Text(bridge.keyEquation)
                    .font(.kymaiaMonospaced)
                    .foregroundStyle(Color.kymaiaPrimary)
                    .padding(Spacing.sm)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                            .fill(Color.kymaiaElevatedSurface)
                    )

                VStack(alignment: .leading, spacing: Spacing.xs) {
                    Text("First-principles check: \(bridge.microCheckQuestion)")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaInk)

                    if isRevealed {
                        Text(bridge.microCheckAnswer)
                            .font(.kymaiaCaption)
                            .foregroundStyle(Color.kymaiaSuccess)
                            .padding(.top, 2)
                    }

                    HStack(spacing: Spacing.sm) {
                        Button(isRevealed ? "Hide answer" : "Check first-principles answer") {
                            if isRevealed {
                                revealedBridgeAnswers.remove(bridge.id)
                            } else {
                                revealedBridgeAnswers.insert(bridge.id)
                            }
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        .accessibilityIdentifier("school.bridge.\(bridge.id).toggle")

                        if let chNum = bridge.livingWorldChapters.first {
                            Button {
                                store.activeLivingWorldChapter = chNum
                                store.selectedRoom = .livingWorld
                            } label: {
                                Label("Living World Ch \(chNum)", systemImage: "leaf")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                        }
                    }
                }
            }
        }
    }

    private func questionProofRowCard(_ question: SchoolScienceQuestion) -> some View {
        let level = store.proofLevel(for: question.id)
        let tone: JournalChip.Tone = {
            switch level {
            case .secure, .proven: return .good
            case .assisted, .shaky: return .warn
            case .unseen: return .neutral
            }
        }()

        return JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack {
                    JournalChip(text: "Topic \(question.topicCode)", tone: .accent)
                    JournalChip(text: question.sourceBadgeTitle, tone: .neutral)
                    JournalChip(text: "\(question.marks) marks", tone: .neutral)
                    Spacer()
                    JournalChip(text: level.displayTitle, tone: tone)
                }

                Text(question.bookSection)
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaMutedInk)

                Text(question.prompt)
                    .font(.kymaiaSerifProse)
                    .foregroundStyle(Color.kymaiaInk)

                HStack(spacing: Spacing.sm) {
                    Button {
                        store.activePracticeQuestion = question
                    } label: {
                        Label(
                            level.isIndependentProof ? "Practise again for spaced proof" : "Start Question Proof",
                            systemImage: "Checkmark.seal.fill".lowercased()
                        )
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                    .accessibilityIdentifier("school.question.\(question.id).start")

                    Button {
                        store.activeLivingWorldChapter = question.linkedChapter
                        store.selectedRoom = .livingWorld
                    } label: {
                        Label("Ch \(question.linkedChapter)", systemImage: "book.pages")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))

                    if !question.linkedWidget.isEmpty {
                        Button {
                            store.activeWidgetId = question.linkedWidget
                            store.selectedRoom = .labsAtlas
                        } label: {
                            Label("Open 3D/2D Lab", systemImage: "cube.transparent")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                    }
                }
            }
        }
    }
}
