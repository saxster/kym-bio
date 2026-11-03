// KymBio additions to the shared KymTutorAI types: the default learner context and the
// biology picker label.

extension AIRequestContext {
    static let generalLearnerTutoring = AIRequestContext(
        feature: "general",
        audience: .learner,
        interaction: .tutoringDialogue
    )
}

extension TutorGuidanceStyle {
    /// KymBio's picker label (British spelling of "Practise").
    var label: String {
        switch self {
        case .adaptive:
            return "Adapt to me"
        case .askMeQuestions:
            return "Ask me questions"
        case .hintFirst:
            return "Give me a hint"
        case .explainDirectly:
            return "Explain directly"
        case .practiceTogether:
            return "Practise with me"
        }
    }
}
