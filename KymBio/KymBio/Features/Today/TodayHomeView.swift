import SwiftUI

struct TodayHomeView: View {
    @EnvironmentObject private var store: AppStore
    @State private var showingFSRSReviewSheet = false

    private var nextQuestion: SchoolScienceQuestion? {
        store.pack.schoolQuestions.first {
            !store.proofLevel(for: $0.id).isIndependentProof
        } ?? store.pack.schoolQuestions.first
    }

    private var provenQuestionsCount: Int {
        store.questionProofs.values.filter { $0.level.isIndependentProof }.count
    }

    private var dailyPlan: DailyFlowSessionPlan {
        DailyFlowSessionEngine.buildPlan(
            pack: store.pack,
            fsrsCards: store.fsrsCards,
            proofs: store.questionProofs,
            preferredChapterNumber: store.activeLivingWorldChapter
        )
    }

    var body: some View {
        JournalPage(
            title: GreetingPeriod.current().greeting(for: "Kym"),
            eyebrow: "Today",
            subtitle: "8th-grade Biology · Cambridge Lower Secondary Science 8 & The Living World"
        ) {
            glanceTilesRow
            dailyFlowCard
            if let q = nextQuestion {
                nextQuestionProofCard(q)
            }
            phenomenonMechanismSpotlightSection
            coreBiologyUnitsSection
            featuredLabsAndDiagramsSection
            JournalSection(title: "Appearance") {
                StandardThemeGallery()
            }
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                StandardThemeMenu()
            }
        }
        .sheet(isPresented: $showingFSRSReviewSheet) {
            NavigationStack {
                FSRSReviewSheetView()
                    .environmentObject(store)
            }
        }
        .sheet(isPresented: $store.showDailyFlowSheet) {
            NavigationStack {
                DailyFlowPlayerSheet()
                    .environmentObject(store)
            }
        }
        .sheet(item: $store.activePracticeQuestion) { question in
            NavigationStack {
                QuestionProofPracticeView(question: question)
                    .environmentObject(store)
            }
        }
    }

    // MARK: - 15-Minute Daily Flow Composer (SmartyMe + Brilliant Loop)

    private var dailyFlowCard: some View {
        let plan = dailyPlan
        return JournalSection(title: "15-Minute Daily Biology Flow") {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    HStack(spacing: Spacing.xs) {
                        JournalChip(
                            label: "\(plan.totalMinutes) min guided loop",
                            systemImage: "Bolt.heart.fill".lowercased(),
                            tone: .accent
                        )
                        JournalChip(
                            text: plan.isWarmupReview
                                ? "\(plan.dueCards.count) warm-up cards"
                                : "\(plan.dueCards.count) due cards",
                            tone: .good
                        )
                        JournalChip(
                            text: "Ch \(plan.chapter.number): \(plan.chapter.title)",
                            tone: .neutral
                        )
                        Spacer()
                    }

                    Text("Four bite-sized beats: lock in memory, unpack one submicroscopic mechanism with Read & Listen audio, win a peer biological debate, and prove one Cambridge Science 8 question.")
                        .font(.kymaiaBody)
                        .foregroundStyle(Color.kymaiaInk)

                    FlowLayout(spacing: Spacing.xs) {
                        ForEach(DailyFlowStageKind.allCases) { stage in
                            JournalChip(
                                label: "\(stage.title) (\(stage.allocatedMinutes)m)",
                                systemImage: stage.systemImage,
                                tone: .neutral
                            )
                        }
                    }

                    HStack(spacing: Spacing.sm) {
                        Button {
                            store.showDailyFlowSheet = true
                        } label: {
                            Label("Start 15-Minute Daily Flow", systemImage: "play.fill")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                        .accessibilityIdentifier("today.daily-flow.start")

                        Button {
                            store.activeLivingWorldChapter = plan.chapter.number
                            store.selectedRoom = .livingWorld
                        } label: {
                            Label("Open Chapter \(plan.chapter.number) Beats", systemImage: "sparkles")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted))
                        .accessibilityIdentifier("today.daily-flow.open-beats")
                    }
                }
            }
        }
    }

    private var phenomenonMechanismSpotlightSection: some View {
        let bridge = PhenomenonToMechanismBridge.bridge(forChapter: store.activeLivingWorldChapter)
        return JournalSection(title: "Phenomenon → Mechanism → Law Spotlight") {
            PhenomenonMechanismBridgeCard(bridge: bridge)
        }
    }

    // MARK: - Glance Tiles

    private var glanceTilesRow: some View {
        JournalCardRow {
            JournalGlanceTile(
                tone: .accent,
                watermark: "checkmark.seal.fill",
                action: {
                    store.selectedRoom = .schoolScience
                }
            ) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("School Science 8 Proofs")
                        .font(.kymaiaCaption.weight(.semibold))
                    Text("\(provenQuestionsCount) of \(store.pack.schoolQuestions.count) proven")
                        .font(.kymaiaTitle2.weight(.bold).monospacedDigit())
                    Text("Learner's Book 8 & Workbook 8")
                        .font(.kymaiaCaption)
                }
            }
            .accessibilityLabel("School Science 8 Question Proofs")
            .accessibilityValue("\(provenQuestionsCount) of \(store.pack.schoolQuestions.count) proven")
            .accessibilityIdentifier("today.tile.proofs")

            JournalGlanceTile(
                tone: .calm,
                watermark: "rectangle.stack.fill",
                action: {
                    showingFSRSReviewSheet = true
                }
            ) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Spaced Retrieval (FSRS)")
                        .font(.kymaiaCaption.weight(.semibold))
                    Text("\(store.dueFSRSCards.count) cards due")
                        .font(.kymaiaTitle2.weight(.bold).monospacedDigit())
                    Text("Tap to run a 3-minute retrieval set")
                        .font(.kymaiaCaption)
                }
            }
            .accessibilityLabel("Spaced Retrieval cards due")
            .accessibilityValue("\(store.dueFSRSCards.count) cards due")
            .accessibilityIdentifier("today.tile.fsrs")
        }
    }

    // MARK: - Next Question Proof Hero Card

    private func nextQuestionProofCard(_ question: SchoolScienceQuestion) -> some View {
        JournalSection(title: "Next up for independent proof") {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    HStack {
                        JournalChip(text: "Unit \(question.unitNumber) · Topic \(question.topicCode)", tone: .accent)
                        JournalChip(text: question.sourceBadgeTitle, tone: .good)
                        JournalChip(text: "\(question.marks) marks", tone: .neutral)
                        Spacer()
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
                            Label("Prove this question now", systemImage: "checkmark.seal.fill")
                        }
                        .buttonStyle(BrassButtonStyle())
                        .accessibilityIdentifier("today.next-question.start")

                        Button {
                            store.activeLivingWorldChapter = question.linkedChapter
                            store.selectedRoom = .livingWorld
                        } label: {
                            Label("Read Ch \(question.linkedChapter) first", systemImage: "book.pages")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

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

    // MARK: - Core Biology Units (1, 4, 7)

    private var coreBiologyUnitsSection: some View {
        let bioUnits = store.pack.schoolTextbook.units(for: .biologyCore)
        return JournalSection(
            title: "Your Cambridge Science 8 Biology units",
            seeAllIdentifier: "today.see-all-units",
            seeAll: { store.selectedRoom = .schoolScience }
        ) {
            VStack(spacing: Spacing.sm) {
                ForEach(bioUnits) { unit in
                    let readiness = store.unitReadiness(for: unit)
                    Button {
                        store.selectedUnitNumber = unit.unitNumber
                        store.selectedRoom = .schoolScience
                    } label: {
                        JournalCard {
                            HStack(spacing: Spacing.md) {
                                JournalBadge(symbol: "leaf.fill", tint: .kymaiaSuccess, size: .row)
                                VStack(alignment: .leading, spacing: 2) {
                                    HStack(spacing: Spacing.xs) {
                                        Text("Unit \(unit.unitNumber): \(unit.title)")
                                            .font(.kymaiaCardTitle)
                                        if unit.isCompletedInSchool {
                                            JournalChip(text: "Ticked in book", tone: .good)
                                        } else {
                                            JournalChip(text: "Upcoming in school", tone: .accent)
                                        }
                                    }
                                    Text("Learner's Book pp. \(unit.learnersBookStartPage)–\(unit.learnersBookEndPage) · Workbook pp. \(unit.workbookStartPage)–\(unit.workbookEndPage)")
                                        .font(.kymaiaCaption.monospacedDigit())
                                        .foregroundStyle(Color.kymaiaMutedInk)
                                }
                                Spacer()
                                JournalChip(text: readiness.readinessBadgeText, tone: .neutral)
                            }
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: - Featured Labs & Diagram Recall

    private var featuredLabsAndDiagramsSection: some View {
        JournalSection(
            title: "Featured 3D simulations & Apple Pencil diagram plates",
            seeAllIdentifier: "today.see-all-labs",
            seeAll: { store.selectedRoom = .labsAtlas }
        ) {
            JournalCardRow {
                VStack(alignment: .leading, spacing: Spacing.xs) {
                    JournalChip(text: "3D Simulation · Ch 1 & Unit 1.4", tone: .accent)
                    Text("Candle Flame vs Living Seed Cell (ATP Engine)")
                        .font(.kymaiaCardTitle)
                    Text("Compare 1,000 °C uncoupled combustion with enzyme-coupled ATP synthesis at 28 °C.")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Button("Launch 3D Lab") {
                        store.activeWidgetId = "seed_flame3d"
                        store.selectedRoom = .labsAtlas
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                }
                .journalMiniCard()

                VStack(alignment: .leading, spacing: Spacing.xs) {
                    JournalChip(text: "Pencil Diagram Recall · Unit 7.4", tone: .good)
                    Text("Antagonistic Biceps & Triceps at the Elbow Joint")
                        .font(.kymaiaCardTitle)
                    Text("Practise labelling scapula, humerus, radius, ulna, tendons and antagonistic muscles.")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Button("Practise with Apple Pencil") {
                        store.activeDiagramPlateId = "plate-u7-arm-lever"
                        store.selectedRoom = .labsAtlas
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                }
                .journalMiniCard()
            }
        }
    }
}

// MARK: - FSRS Spaced Retrieval Sheet

struct FSRSReviewSheetView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dismiss) private var dismiss
    @State private var currentIndex: Int = 0
    @State private var draftAnswer: String = ""
    @State private var isRevealed: Bool = false

    private var cards: [FSRSCardRecord] {
        store.dueFSRSCards.isEmpty ? store.fsrsCards : store.dueFSRSCards
    }

    var body: some View {
        let safeIndex = min(currentIndex, max(0, cards.count - 1))
        let currentCard = cards.isEmpty ? nil : cards[safeIndex]

        JournalFocusPage(
            title: "Spaced Retrieval (FSRS)",
            progress: .init(step: safeIndex + 1, total: max(1, cards.count)),
            closeLabel: "Done",
            close: { dismiss() }
        ) {
            if let card = currentCard {
                HStack {
                    JournalChip(text: "Topic \(card.topicCode)", tone: .accent)
                    JournalChip(text: "Chapter \(card.chapterNumber)", tone: .neutral)
                    Spacer()
                    Text("Stability: \(String(format: "%.1f", card.stability)) d")
                        .font(.kymaiaCaption.monospacedDigit())
                        .foregroundStyle(Color.kymaiaMutedInk)
                }

                Text(card.frontPrompt)
                    .font(.kymaiaQuestion)
                    .foregroundStyle(Color.kymaiaInk)

                VStack(alignment: .leading, spacing: 4) {
                    Text("Write your answer before flipping the card:")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    WritingTextEditor(text: $draftAnswer, serif: true)
                        .learnerTextInput(.retrieval)
                        .frame(minHeight: 100)
                        .padding(Spacing.xs)
                        .background(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .fill(Color.kymaiaElevatedSurface)
                        )
                }

                if isRevealed {
                    Divider()
                    Text("Model answer")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaPrimary)
                    Text(card.backAnswer)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaInk)
                }
            } else {
                Text("All Biology retrieval cards are up to date for today.")
                    .font(.kymaiaBody)
            }
        } actions: {
            if let card = currentCard {
                if !isRevealed {
                    Button("Reveal model answer") {
                        isRevealed = true
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted))
                    .accessibilityIdentifier("fsrs.reveal")
                } else {
                    HStack(spacing: Spacing.sm) {
                        ForEach(FSRSRating.allCases, id: \.rawValue) { rating in
                            Button(rating.title) {
                                store.reviewFSRSCard(card, rating: rating)
                                draftAnswer = ""
                                isRevealed = false
                                if currentIndex + 1 < cards.count {
                                    currentIndex += 1
                                } else {
                                    dismiss()
                                }
                            }
                            .buttonStyle(
                                JournalCapsuleButtonStyle(
                                    prominence: rating == .good || rating == .easy ? .filled : .tinted,
                                    size: .small
                                )
                            )
                            .accessibilityIdentifier("fsrs.rate.\(rating.rawValue)")
                        }
                    }
                }
            }
        }
    }
}

// MARK: - 15-Minute Daily Flow Player Sheet

struct DailyFlowPlayerSheet: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dismiss) private var dismiss

    @StateObject private var narrator = ChapterAudioNarrator()
    @State private var currentStage: DailyFlowStageKind = .memoryLock
    @State private var cardIndex: Int = 0
    @State private var isCardRevealed: Bool = false
    @State private var cardDraft: String = ""
    @State private var debateCompleted: Bool = false
    @State private var quantInput: String = ""
    @State private var quantOutcome: QuantitativeCheckOutcome? = nil

    private var plan: DailyFlowSessionPlan {
        DailyFlowSessionEngine.buildPlan(
            pack: store.pack,
            fsrsCards: store.fsrsCards,
            proofs: store.questionProofs,
            preferredChapterNumber: store.activeLivingWorldChapter
        )
    }

    var body: some View {
        JournalPage(
            title: "15-Minute Daily Biology Flow",
            eyebrow: "\(currentStage.title) · \(currentStage.allocatedMinutes) min",
            subtitle: "Chapter \(plan.chapter.number): \(plan.chapter.title)"
        ) {
            stageSelectorBar

            switch currentStage {
            case .memoryLock:
                memoryLockStageView
            case .conceptDiscoveryBeat:
                conceptDiscoveryStageView
            case .misconceptionAndTrapCheck:
                misconceptionAndTrapStageView
            case .schoolQuestionProof:
                schoolQuestionProofStageView
            }
        }
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("Close") {
                    narrator.stop()
                    dismiss()
                }
            }
        }
        .onDisappear {
            narrator.stop()
        }
    }

    private var stageSelectorBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: Spacing.xs) {
                ForEach(DailyFlowStageKind.allCases) { stage in
                    Button {
                        currentStage = stage
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: stage.systemImage)
                            Text("\(stage.title) (\(stage.allocatedMinutes)m)")
                        }
                    }
                    .buttonStyle(
                        JournalCapsuleButtonStyle(
                            prominence: currentStage == stage ? .filled : .tinted,
                            size: .small
                        )
                    )
                    .accessibilityIdentifier("daily-flow.stage.\(stage.rawValue)")
                }
            }
        }
    }

    @ViewBuilder
    private var memoryLockStageView: some View {
        let cards = plan.dueCards
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack {
                    JournalChip(
                        text: plan.isWarmupReview ? "Warm-up Retrieval" : "Due FSRS v5 Retrieval",
                        tone: .accent
                    )
                    if !cards.isEmpty {
                        JournalChip(
                            text: "Card \(min(cardIndex + 1, cards.count)) of \(cards.count)",
                            tone: .neutral
                        )
                    }
                    Spacer()
                }

                if cardIndex < cards.count {
                    let card = cards[cardIndex]
                    Text(card.frontPrompt)
                        .font(.kymaiaCardTitle)
                        .foregroundStyle(Color.kymaiaInk)

                    TextEditor(text: $cardDraft)
                        .font(.kymaiaBody)
                        .learnerTextInput(.retrieval)
                        .frame(minHeight: 80)
                        .padding(Spacing.xs)
                        .background(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .fill(Color.kymaiaElevatedSurface)
                        )

                    if !isCardRevealed {
                        Button("Reveal Model Answer") {
                            isCardRevealed = true
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted))
                    } else {
                        Text(card.backAnswer)
                            .font(.kymaiaSerifProse)
                            .foregroundStyle(Color.kymaiaInk)
                            .padding(Spacing.sm)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .fill(Color.kymaiaElevatedSurface)
                            )

                        HStack(spacing: Spacing.sm) {
                            ForEach(FSRSRating.allCases, id: \.rawValue) { rating in
                                Button(rating.title) {
                                    store.reviewFSRSCard(card, rating: rating)
                                    cardDraft = ""
                                    isCardRevealed = false
                                    if cardIndex + 1 < cards.count {
                                        cardIndex += 1
                                    } else {
                                        currentStage = .conceptDiscoveryBeat
                                    }
                                }
                                .buttonStyle(
                                    JournalCapsuleButtonStyle(
                                        prominence: rating == .good || rating == .easy ? .filled : .tinted,
                                        size: .small
                                    )
                                )
                            }
                        }
                    }
                } else {
                    Text("Memory lock complete for today! Advance to Stage 2: Concept Discovery Beat.")
                        .font(.kymaiaBody)
                        .foregroundStyle(Color.kymaiaSuccess)
                    Button("Continue to Stage 2 · Concept Discovery Beat") {
                        currentStage = .conceptDiscoveryBeat
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                }
            }
        }
    }

    @ViewBuilder
    private var conceptDiscoveryStageView: some View {
        let beat = plan.discoveryBeat
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack {
                    JournalChip(label: beat.kind.badgeLabel, systemImage: beat.kind.systemImage, tone: .accent)
                    Spacer()
                    Button {
                        narrator.togglePlayPause(for: beat)
                    } label: {
                        Label(
                            narrator.isPlaying && narrator.activeBeatId == beat.id ? "Pause Audio" : "Read & Listen",
                            systemImage: narrator.isPlaying && narrator.activeBeatId == beat.id ? "pause.circle.fill" : "speaker.wave.2.fill"
                        )
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

                    Button("\(String(format: "%.2gx", narrator.playbackSpeedMultiplier))") {
                        narrator.cycleSpeed(restartingIfPlaying: beat)
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                }

                Text(beat.title)
                    .font(.kymaiaCardTitle)
                    .foregroundStyle(Color.kymaiaInk)

                Text(beat.bodyMarkdown)
                    .font(.kymaiaSerifProse)
                    .foregroundStyle(Color.kymaiaInk)
            }
        }

        PhenomenonMechanismBridgeCard(bridge: plan.bridge)

        HStack {
            Spacer()
            Button {
                narrator.stop()
                currentStage = .misconceptionAndTrapCheck
            } label: {
                Label("Continue to Stage 3 · Peer Debate & Trap Check", systemImage: "arrow.right")
            }
            .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
        }
    }

    @ViewBuilder
    private var misconceptionAndTrapStageView: some View {
        BiologicalDebateCardView(scenario: plan.debate) { _ in
            debateCompleted = true
        }

        let problem = plan.quantitativeProblem
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack {
                    JournalChip(label: "Quantitative Trap Check", systemImage: "function", tone: .accent)
                    JournalChip(text: "Topic \(problem.schoolTopic)", tone: .neutral)
                    Spacer()
                }

                Text(problem.title)
                    .font(.kymaiaCardTitle)
                    .foregroundStyle(Color.kymaiaInk)

                Text(problem.formulaDisplay)
                    .font(.kymaiaMonospaced)
                    .foregroundStyle(Color.kymaiaPrimaryStrong)

                Text(problem.prompt)
                    .font(.kymaiaBody)
                    .foregroundStyle(Color.kymaiaInk)

                HStack(spacing: Spacing.sm) {
                    TextField("Enter number (\(problem.expectedUnit))", text: $quantInput)
                        .textFieldStyle(.roundedBorder)
                        .font(.kymaiaMonospaced)
                        .learnerTextInput(.retrieval)

                    Button("Check Calculation") {
                        quantOutcome = QuantitativeBioEngine.evaluate(problem: problem, rawInput: quantInput)
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                }

                if let outcome = quantOutcome {
                    if let trap = outcome.matchedTrap {
                        BuggyBioTrapBanner(trap: trap)
                    } else {
                        Text(outcome.diagnosticMessage)
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(outcome.isCorrect ? Color.kymaiaSuccess : Color.kymaiaWarning)
                    }
                }

                HStack {
                    Spacer()
                    Button {
                        currentStage = .schoolQuestionProof
                    } label: {
                        Label("Continue to Stage 4 · Cambridge Question Proof", systemImage: "arrow.right")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                }
            }
        }
    }

    @ViewBuilder
    private var schoolQuestionProofStageView: some View {
        let q = plan.targetQuestion
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack(spacing: Spacing.xs) {
                    JournalChip(text: "Unit \(q.unitNumber) · Topic \(q.topicCode)", tone: .accent)
                    JournalChip(text: q.bookSection, tone: .neutral)
                    JournalChip(text: "\(q.marks) marks", tone: .good)
                    Spacer()
                }

                Text(q.prompt)
                    .font(.kymaiaSerifProse)
                    .foregroundStyle(Color.kymaiaInk)

                HStack(spacing: Spacing.sm) {
                    Button {
                        narrator.stop()
                        dismiss()
                        store.activePracticeQuestion = q
                    } label: {
                        Label("Launch Full 3-Stage Question Proof", systemImage: "checkmark.seal.fill")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                    .accessibilityIdentifier("daily-flow.launch-proof")

                    Button {
                        narrator.stop()
                        dismiss()
                    } label: {
                        Text("Finish Flow")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost))
                }
            }
        }
    }
}
