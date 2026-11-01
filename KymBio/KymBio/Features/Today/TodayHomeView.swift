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

    var body: some View {
        JournalPage(
            title: GreetingPeriod.current().greeting(for: "Kym"),
            subtitle: "8th-grade Biology · Cambridge Lower Secondary Science 8 & The Living World"
        ) {
            glanceTilesRow
            if let q = nextQuestion {
                nextQuestionProofCard(q)
            }
            coreBiologyUnitsSection
            featuredLabsAndDiagramsSection
            ThemeGallerySection()
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                ThemePickerMenu()
            }
        }
        .sheet(isPresented: $showingFSRSReviewSheet) {
            NavigationStack {
                FSRSReviewSheetView()
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
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
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
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
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
