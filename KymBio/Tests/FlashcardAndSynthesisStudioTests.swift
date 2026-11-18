import XCTest
@testable import KymBio

final class FlashcardAndSynthesisStudioTests: XCTestCase {
    @MainActor
    func testSixteenChapterFlashcardsFourRungSynthesisAndFiveQuestionQuickQuiz() throws {
        XCTAssertEqual(ChapterFlashcardAndSynthesisCatalog.atomicFlashcards.count, 16)
        let db = DatabaseManager(inMemory: true)
        let store = AppStore(db: db)
        let coveredChapters = Set(store.fsrsCards.map(\.chapterNumber))
        XCTAssertEqual(coveredChapters, Set(0...15), "All 16 chapters Ch 0–15 must be seeded into FSRS flashcards")

        for ch in 0...15 {
            guard let atomic = ChapterFlashcardAndSynthesisCatalog.atomicFlashcards.first(where: { $0.chapterNumber == ch }),
                  let fsrsCard = store.fsrsCards.first(where: { $0.id == atomic.id }) else {
                XCTFail("Missing atomic FSRS flashcard for Ch \(ch)")
                continue
            }

            // 1. All 4 study modes (Forward, Reverse, Cloze 1, Cloze 2)
            for mode in ChapterFlashcardStudyMode.allCases {
                let renderedPrompt = ChapterFlashcardAndSynthesisCatalog.prompt(for: fsrsCard, mode: mode)
                XCTAssertFalse(renderedPrompt.isEmpty)
                if mode == .clozeStage1 || mode == .clozeStage2 {
                    XCTAssertTrue(renderedPrompt.contains("_"), "Expected cloze underscores for Ch \(ch) in \(mode)")
                }
            }

            // 2. Pre-flip draft evaluation & 4-quadrant calibration
            let passEval = ChapterFlashcardAndSynthesisCatalog.evaluateDraft(
                for: fsrsCard,
                draftAnswer: fsrsCard.backAnswer,
                confidence: .high
            )
            XCTAssertTrue(passEval.isPass)
            XCTAssertEqual(passEval.quadrant, .solidMastery)
            XCTAssertFalse(passEval.matchedKeyTerms.isEmpty)

            let misconceptionEval = ChapterFlashcardAndSynthesisCatalog.evaluateDraft(
                for: fsrsCard,
                draftAnswer: "Unrelated random guess without mechanism",
                confidence: .certain
            )
            XCTAssertFalse(misconceptionEval.isPass)
            XCTAssertEqual(misconceptionEval.quadrant, .committedMisconception)

            // 3. 4-Rung End-of-Chapter Synthesis Q&A + Transfer Twin on Rung 4
            let rungs = ChapterFlashcardAndSynthesisCatalog.endOfChapterQuestions(forChapter: ch)
            XCTAssertEqual(rungs.count, 4, "Expected 4 synthesis rungs for Ch \(ch)")
            XCTAssertEqual(rungs.map(\.rungNumber), [1, 2, 3, 4])
            XCTAssertNotNil(rungs[3].transferTwinPrompt, "Rung 4 in Ch \(ch) must include an isomorphic Transfer Twin")
            XCTAssertNotNil(rungs[3].transferTwinAnswer)

            // 4. 5-Question Interleaved Checkpoint Quick Quiz
            let quiz = ChapterFlashcardAndSynthesisCatalog.quickQuiz(forChapter: ch)
            XCTAssertEqual(quiz.count, 5, "Expected 5 interleaved quick-quiz items for Ch \(ch)")
            for item in quiz {
                XCTAssertGreaterThanOrEqual(item.options.count, 3)
                XCTAssertTrue(item.options.indices.contains(item.correctIndex))
                XCTAssertFalse(item.diagnosticExplanation.isEmpty)
            }
        }
    }
}
