// SafetyEscalationService - On-device child-safety crisis detection for learner free-text and spoken inputs.
// Faithfully ported from ../kym_tutor/KymaiaTutor/KymaiaTutor/Core/Services/Safety/SafetyEscalationService.swift,
// LiveMentorTranscriptSafetyMonitor.swift, and SessionJournalSafetyAlert.swift.

import Foundation
import SwiftUI
import UserNotifications
import os.log

struct SafetyEscalationService: Sendable {
    enum Category: String, Sendable, CaseIterable {
        case suicidalIdeation = "suicidal_ideation"
        case selfHarm = "self_harm"
        case abuseDisclosure = "abuse_disclosure"
        case eatingDisorder = "eating_disorder"
        case acuteDistress = "acute_distress"

        var parentAlertSummary: String {
            switch self {
            case .suicidalIdeation, .selfHarm:
                return "She wrote something that may indicate thoughts of hurting herself. Please check in with her right away."
            case .abuseDisclosure:
                return "She wrote something that may indicate she feels unsafe or hurt by someone. Please check in with her right away."
            case .eatingDisorder:
                return "She wrote something that may indicate distress around food or her body. Please check in with her gently."
            case .acuteDistress:
                return "She wrote something that suggests she is feeling overwhelmed or in distress. Please check in with her."
            }
        }
    }

    struct Concern: Sendable, Equatable {
        let category: Category
        let matchedPhrase: String
    }

    enum Region: Sendable {
        case india
        case unitedStates

        static var current: Region {
            let code = Locale.current.region?.identifier.uppercased() ?? "IN"
            return code == "US" ? .unitedStates : .india
        }
    }

    // Phrases are matched against normalized (lowercased, punctuation-stripped, whitespace-collapsed) text.
    // Ordered by priority so the most urgent category wins if multiple match.
    private static let patterns: [(Category, [String])] = [
        (
            .suicidalIdeation,
            [
                "want to die",
                "wanna die",
                "wish i was dead",
                "wish i were dead",
                "kill myself",
                "end my life",
                "better off without me",
                "better off dead",
                "dont want to be alive",
                "dont want to live",
                "no reason to live"
            ]
        ),
        (
            .selfHarm,
            [
                "hurt myself",
                "hurting myself",
                "cut myself",
                "cutting myself",
                "harm myself",
                "hit myself on purpose",
                "burn myself"
            ]
        ),
        (
            .abuseDisclosure,
            [
                "someone is hurting me",
                "hits me at home",
                "beats me",
                "touched me in a bad way",
                "told me not to tell",
                "scared to go home",
                "unsafe at home",
                "afraid of my"
            ]
        ),
        (
            .eatingDisorder,
            [
                "starving myself",
                "starve myself",
                "make myself throw up",
                "making myself throw up",
                "hate my body so much",
                "stop eating so i"
            ]
        ),
        (
            .acuteDistress,
            [
                "i hate myself",
                "everyone hates me",
                "nobody cares about me",
                "cant take this anymore",
                "cant do this anymore",
                "having a panic attack",
                "cant breathe i am scared"
            ]
        )
    ]

    /// Pure on-device scan. Returns the highest-priority concern found, or `nil`.
    func scan(_ text: String) -> Concern? {
        let normalized = Self.normalize(text)
        guard !normalized.isEmpty else { return nil }

        for (category, phrases) in Self.patterns {
            for phrase in phrases where Self.containsPhrase(normalized, phrase: phrase) {
                return Concern(category: category, matchedPhrase: phrase)
            }
        }
        return nil
    }

    /// Warm, age-appropriate response shown to Kym instead of any AI or study reply.
    func supportiveResponse(for concern: Concern, region: Region = .current) -> String {
        let helplineLine: String
        switch region {
        case .india:
            helplineLine = "If you cannot reach a trusted adult right now and need immediate help, you or an adult with you can call 112 (Emergency) or Childline at 1098."
        case .unitedStates:
            helplineLine = "If you cannot reach a trusted adult right now and need immediate help, you can call or text 988, or call 911."
        }

        return """
        What you just shared sounds really hard, and you do not have to carry it alone. We are pausing the lesson right now because how you are doing matters much more than schoolwork.

        Please talk to your mum, your dad, or another adult you trust right now and tell them how you are feeling.

        \(helplineLine)
        """
    }

    /// Fires a local parent notification on the device and logs the category (never the raw child text).
    func escalate(_ concern: Concern, channel: String) async {
        let logger = Logger(subsystem: "com.kymaia.kymbio", category: "SafetyEscalation")
        logger.error("Safety escalation triggered [category=\(concern.category.rawValue, privacy: .public), channel=\(channel, privacy: .public)]")

        // Guard against CLI xctest runner where Bundle.main has no .app bundle proxy
        guard Bundle.main.bundleIdentifier != nil,
              Bundle.main.bundleURL.pathExtension == "app" else {
            return
        }

        let center = UNUserNotificationCenter.current()
        let content = UNMutableNotificationContent()
        content.title = "Please check in with your child"
        content.body = concern.category.parentAlertSummary
        content.sound = .default
        content.interruptionLevel = .timeSensitive

        let request = UNNotificationRequest(
            identifier: "safety.escalation.\(UUID().uuidString)",
            content: content,
            trigger: nil
        )
        try? await center.add(request)
    }

    private static func normalize(_ text: String) -> String {
        let lowered = text
            .lowercased()
            .replacingOccurrences(of: "['’‘ʼ]", with: "", options: .regularExpression)
        let stripped = lowered.unicodeScalars.map { scalar -> Character in
            if CharacterSet.alphanumerics.contains(scalar) || CharacterSet.whitespacesAndNewlines.contains(scalar) {
                return Character(scalar)
            }
            return " "
        }
        return String(stripped)
            .split(whereSeparator: \.isWhitespace)
            .joined(separator: " ")
    }

    private static func containsPhrase(_ normalizedText: String, phrase: String) -> Bool {
        let paddedText = " " + normalizedText + " "
        let paddedPhrase = " " + phrase + " "
        return paddedText.contains(paddedPhrase)
    }
}

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
        region: SafetyEscalationService.Region = .current
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
        if !result.isCompliant {
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
