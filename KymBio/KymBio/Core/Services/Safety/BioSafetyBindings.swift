// KymBio's integration over the shared KymTutorAI SafetyEscalationService: the live spoken
// transcript monitor and the session/journal safety alert.

import Foundation
import SwiftUI

// MARK: - Live Spoken Transcript Safety Monitor

struct LiveMentorTranscriptSafetyResolution: Sendable, Equatable {
    let concern: SafetyEscalationService.Concern
    let supportiveResponse: String
}

/// Evaluates user and model transcripts from spoken recall or live voice mentoring on-device.
/// When a child-safety concern is detected in the learner's speech, it returns a supportive
/// response, fires the parent notification, and signals the caller to suppress AI continuation.
actor LiveMentorTranscriptSafetyMonitor {
    private let safetyEscalation: SafetyEscalationService
    private let region: SafetyEscalationService.Region
    private var escalatedCategories: Set<SafetyEscalationService.Category> = []
    private(set) var lastDevelopmentalViolations: [DevelopmentalPolicyViolation] = []

    init(
        safetyEscalation: SafetyEscalationService = SafetyEscalationService(),
        region: SafetyEscalationService.Region = .current()
    ) {
        self.safetyEscalation = safetyEscalation
        self.region = region
    }

    func evaluateLearnerTranscript(
        _ text: String,
        channel: String = "spoken_recall"
    ) async -> LiveMentorTranscriptSafetyResolution? {
        guard let concern = safetyEscalation.scan(text) else {
            return nil
        }

        if escalatedCategories.insert(concern.category).inserted {
            await safetyEscalation.escalate(concern, channel: channel)
        }

        let response = safetyEscalation.supportiveResponse(for: concern, region: region)
        return LiveMentorTranscriptSafetyResolution(
            concern: concern,
            supportiveResponse: response
        )
    }

    func evaluateModelTranscript(_ text: String) -> DevelopmentalValidationResult {
        let result = DevelopmentalResponseValidator.validate(text)
        if !result.isValid {
            lastDevelopmentalViolations = result.violations
        }
        return result
    }

    func reset() {
        escalatedCategories.removeAll()
        lastDevelopmentalViolations.removeAll()
    }
}

// MARK: - Session & Journal Safety Alert ViewModifier

struct SessionJournalSafetyAlertModifier: ViewModifier {
    @Binding var safetySupportMessage: String?

    private var isPresented: Binding<Bool> {
        Binding(
            get: { safetySupportMessage != nil },
            set: { if !$0 { safetySupportMessage = nil } }
        )
    }

    func body(content: Content) -> some View {
        content.alert("Please talk to a trusted adult", isPresented: isPresented) {
            Button("OK") {
                safetySupportMessage = nil
            }
        } message: {
            Text(safetySupportMessage ?? "")
        }
    }
}

extension View {
    func sessionJournalSafetyAlert(message: Binding<String?>) -> some View {
        modifier(SessionJournalSafetyAlertModifier(safetySupportMessage: message))
    }
}
