import Foundation
import SwiftUI
import AVFoundation
#if canImport(Speech)
import Speech
#endif

// MARK: - 1. Spoken & Written Answer Comparison (Ported & Deepened from ../kym_tutor)

struct BiologicalRecallEvaluation: Equatable {
    let similarity: Double
    let matchedKeyTerms: [String]
    let missingKeyTerms: [String]
    let combinedScore: Double
    let feedbackSummary: String
}

enum AnswerComparison {
    /// Calculates normalized Levenshtein similarity between two strings (0.0 to 1.0).
    static func similarity(_ s1: String, _ s2: String) -> Double {
        let str1 = normalizeText(s1)
        let str2 = normalizeText(s2)

        if str1 == str2 { return 1.0 }
        if str1.isEmpty || str2.isEmpty { return 0.0 }

        let distance = levenshteinDistance(str1, str2)
        let maxLength = max(str1.count, str2.count)
        return max(0.0, 1.0 - (Double(distance) / Double(maxLength)))
    }

    static func isMatch(transcript: String, expected: String, threshold: Double = 0.78) -> Bool {
        similarity(transcript, expected) >= threshold
    }

    /// Evaluates spoken or typed biological recall against expected text and required mark-scheme key terms.
    static func evaluateRecall(
        spoken: String,
        expected: String,
        keyTerms: [String] = []
    ) -> BiologicalRecallEvaluation {
        let sim = similarity(spoken, expected)
        let normalizedSpoken = normalizeText(spoken)
        let effectiveTerms: [String]
        if keyTerms.isEmpty {
            effectiveTerms = extractSignificantTerms(from: expected)
        } else {
            effectiveTerms = keyTerms
        }

        var matched: [String] = []
        var missing: [String] = []
        for term in effectiveTerms {
            let cleanTerm = normalizeText(term)
            if cleanTerm.isEmpty { continue }
            if normalizedSpoken.contains(cleanTerm) {
                matched.append(term)
            } else {
                missing.append(term)
            }
        }

        let termRatio = effectiveTerms.isEmpty
            ? sim
            : Double(matched.count) / Double(max(effectiveTerms.count, 1))
        let combined = (sim * 0.45) + (termRatio * 0.55)

        let summary: String
        if combined >= 0.82 {
            summary = "Strong recall (\(Int((combined * 100).rounded()))%). You hit the key biological terms accurately."
        } else if missing.isEmpty {
            summary = "Good conceptual match (\(Int((combined * 100).rounded()))%). Tighten your phrasing to match the full sequence."
        } else {
            summary = "Partial recall (\(Int((combined * 100).rounded()))%). Re-check these key terms: \(missing.prefix(4).joined(separator: ", "))."
        }

        return BiologicalRecallEvaluation(
            similarity: sim,
            matchedKeyTerms: matched,
            missingKeyTerms: missing,
            combinedScore: combined,
            feedbackSummary: summary
        )
    }

    private static func normalizeText(_ input: String) -> String {
        input
            .lowercased()
            .replacingOccurrences(of: "[^a-z0-9\\s]", with: " ", options: .regularExpression)
            .components(separatedBy: .whitespacesAndNewlines)
            .filter { !$0.isEmpty }
            .joined(separator: " ")
    }

    private static func extractSignificantTerms(from text: String) -> [String] {
        let stopWords: Set<String> = [
            "the", "and", "for", "that", "with", "from", "into", "this", "their",
            "they", "are", "was", "were", "have", "has", "had", "not", "but", "what",
            "when", "where", "which", "while", "through", "between", "during", "than"
        ]
        var seen = Set<String>()
        var result: [String] = []
        let words = normalizeText(text).components(separatedBy: " ")
        for word in words where word.count >= 5 && !stopWords.contains(word) {
            if seen.insert(word).inserted {
                result.append(word)
            }
        }
        return Array(result.prefix(8))
    }

    private static func levenshteinDistance(_ s1: String, _ s2: String) -> Int {
        let arr1 = Array(s1)
        let arr2 = Array(s2)
        let m = arr1.count
        let n = arr2.count

        if m == 0 { return n }
        if n == 0 { return m }

        var prev = Array(0...n)
        var curr = [Int](repeating: 0, count: n + 1)

        for i in 1...m {
            curr[0] = i
            for j in 1...n {
                if arr1[i - 1] == arr2[j - 1] {
                    curr[j] = prev[j - 1]
                } else {
                    curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])
                }
            }
            swap(&prev, &curr)
        }
        return prev[n]
    }
}

// MARK: - 2. Live Speech-to-Text Dictation Service (SFSpeechRecognizer + AVAudioEngine)

@MainActor
final class BioSpokenRecallService: ObservableObject {
    @Published var isRecording: Bool = false
    @Published var transcript: String = ""
    @Published var statusMessage: String?
    @Published var safetySupportMessage: String? = nil

    private let safetyMonitor = LiveMentorTranscriptSafetyMonitor()

    #if canImport(Speech)
    private var speechRecognizer: SFSpeechRecognizer? = SFSpeechRecognizer(locale: Locale(identifier: "en-GB")) ?? SFSpeechRecognizer()
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    #endif

    func toggleRecording(onTranscriptUpdate: @escaping (String) -> Void) {
        if isRecording {
            stopRecording()
        } else {
            startRecording(onTranscriptUpdate: onTranscriptUpdate)
        }
    }

    func startRecording(onTranscriptUpdate: @escaping (String) -> Void) {
        #if canImport(Speech)
        SFSpeechRecognizer.requestAuthorization { [weak self] authStatus in
            Task { @MainActor in
                guard let self else { return }
                guard authStatus == .authorized else {
                    self.statusMessage = "Speech recognition permission is not enabled in Settings."
                    return
                }
                self.beginAudioSession(onTranscriptUpdate: onTranscriptUpdate)
            }
        }
        #else
        statusMessage = "Live speech recognition is unavailable on this platform."
        #endif
    }

    func stopRecording() {
        #if canImport(Speech)
        if audioEngine.isRunning {
            audioEngine.stop()
            audioEngine.inputNode.removeTap(onBus: 0)
        }
        recognitionRequest?.endAudio()
        recognitionTask?.cancel()
        recognitionRequest = nil
        recognitionTask = nil
        #endif
        isRecording = false
    }

    #if canImport(Speech)
    private func beginAudioSession(onTranscriptUpdate: @escaping (String) -> Void) {
        stopRecording()
        do {
            #if os(iOS)
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.record, mode: .measurement, options: .duckOthers)
            try session.setActive(true, options: .notifyOthersOnDeactivation)
            #endif

            let request = SFSpeechAudioBufferRecognitionRequest()
            request.shouldReportPartialResults = true
            self.recognitionRequest = request

            let inputNode = audioEngine.inputNode
            let recordingFormat = inputNode.outputFormat(forBus: 0)
            inputNode.removeTap(onBus: 0)
            inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
                request.append(buffer)
            }

            audioEngine.prepare()
            try audioEngine.start()
            isRecording = true
            statusMessage = "Listening… speak your biological explanation aloud."

            recognitionTask = speechRecognizer?.recognitionTask(with: request) { [weak self] result, error in
                Task { @MainActor in
                    guard let self else { return }
                    if let result {
                        let spoken = result.bestTranscription.formattedString
                        if let safetyResolution = await self.safetyMonitor.evaluateLearnerTranscript(spoken, channel: "voice_dictation") {
                            self.stopRecording()
                            self.safetySupportMessage = safetyResolution.supportiveResponse
                            self.statusMessage = "Paused for wellbeing support."
                            return
                        }
                        self.transcript = spoken
                        onTranscriptUpdate(spoken)
                    }
                    if error != nil || (result?.isFinal == true) {
                        self.stopRecording()
                    }
                }
            }
        } catch {
            statusMessage = "Could not start microphone session: \(error.localizedDescription)"
            isRecording = false
        }
    }
    #endif
}

/// Reusable microphone capsule button for dictating answers aloud in Question Proofs, Learn by Heart, and Socratic Coach.
struct VoiceDictationButton: View {
    @Binding var text: String
    var label: String = "Speak answer"
    @StateObject private var speechService = BioSpokenRecallService()

    var body: some View {
        Button {
            speechService.toggleRecording { spoken in
                if text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                    text = spoken
                } else {
                    text = spoken
                }
            }
        } label: {
            Label(
                speechService.isRecording ? "Stop listening" : label,
                systemImage: speechService.isRecording ? "waveform.circle.fill" : "mic.fill"
            )
        }
        .buttonStyle(
            JournalCapsuleButtonStyle(
                prominence: speechService.isRecording ? .filled : .tinted,
                size: .small
            )
        )
        .accessibilityLabel(speechService.isRecording ? "Stop voice dictation" : label)
        .accessibilityIdentifier("voice-dictation.button")
        .sessionJournalSafetyAlert(message: $speechService.safetySupportMessage)
    }
}

// MARK: - 3. Live AI Budget Ledger & Grounded Gemini / OpenAI Socratic Client

struct AIBudgetSnapshot: Codable, Equatable {
    var totalRequests: Int = 0
    var totalPromptTokens: Int = 0
    var totalCompletionTokens: Int = 0
    var estimatedCostUSD: Double = 0.0
    var lastProviderUsed: String = "Local Grounded Engine"
}

@MainActor
final class KymBioLiveAIClient: ObservableObject {
    static let shared = KymBioLiveAIClient()

    private static let apiKeyStorageKey = "kymbio.gemini.apiKey"
    private static let ledgerStorageKey = "kymbio.ai.budgetLedger"

    @Published var budgetSnapshot: AIBudgetSnapshot

    var configuredAPIKey: String {
        get {
            if let envKey = ProcessInfo.processInfo.environment["GEMINI_API_KEY"], !envKey.isEmpty {
                return envKey
            }
            return UserDefaults.standard.string(forKey: Self.apiKeyStorageKey) ?? ""
        }
        set {
            UserDefaults.standard.set(newValue.trimmingCharacters(in: .whitespacesAndNewlines), forKey: Self.apiKeyStorageKey)
            objectWillChange.send()
        }
    }

    var hasLiveAPIKey: Bool {
        !configuredAPIKey.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private init() {
        if let data = UserDefaults.standard.data(forKey: Self.ledgerStorageKey),
           let decoded = try? JSONDecoder().decode(AIBudgetSnapshot.self, from: data) {
            self.budgetSnapshot = decoded
        } else {
            self.budgetSnapshot = AIBudgetSnapshot()
        }
    }

    private func persistLedger() {
        if let data = try? JSONEncoder().encode(budgetSnapshot) {
            UserDefaults.standard.set(data, forKey: Self.ledgerStorageKey)
        }
    }

    /// Generates a grounded Socratic Biology response using Gemini (`gemini-2.5-flash`) when an API key is configured,
    /// or returns `nil` so the caller falls back cleanly to the deterministic local curriculum engine.
    func generateGroundedSocraticReply(
        studentPrompt: String,
        activeChapterContext: String,
        misconceptionContext: String,
        schoolWordingContext: String,
        persona: TutorPersona = .marieCurie,
        guidanceStyle: TutorGuidanceStyle = .adaptive,
        mentorIntent: MentorIntent = .learn,
        conversationMode: ConversationMode = .openChat,
        sharedMuddiestPoint: String? = nil
    ) async -> String? {
        // Never send crisis text (in either studentPrompt or sharedMuddiestPoint) to an external AI provider
        let safety = SafetyEscalationService()
        if safety.scan(studentPrompt) != nil {
            return nil
        }
        if let muddy = sharedMuddiestPoint, safety.scan(muddy) != nil {
            return nil
        }

        let key = configuredAPIKey.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !key.isEmpty else { return nil }

        guard let url = URL(string: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\(key)") else {
            return nil
        }

        let effectiveGuidance = MotivationalDialoguePolicy.resolvedStyle(
            requested: guidanceStyle,
            learnerText: studentPrompt
        )
        let soul = BundledAgentSoulCatalog.soulDocument(for: persona)
        let dialogueMode = MotivationalDialoguePolicy.supportMode(
            for: effectiveGuidance,
            learnerText: studentPrompt,
            prefersSocratic: soul.decisionParameters.preferSocratic
        )

        let systemInstruction = ChatResponseComposer.buildSystemPrompt(
            persona: persona,
            guidanceStyle: effectiveGuidance,
            dialogueMode: dialogueMode,
            mentorIntent: mentorIntent,
            conversationMode: conversationMode,
            activeChapterContext: activeChapterContext,
            misconceptionContext: misconceptionContext,
            schoolWordingContext: schoolWordingContext,
            sharedMuddiestPoint: sharedMuddiestPoint
        )

        let payload: [String: Any] = [
            "system_instruction": [
                "parts": [["text": systemInstruction]]
            ],
            "contents": [
                [
                    "role": "user",
                    "parts": [["text": studentPrompt]]
                ]
            ],
            "generationConfig": [
                "temperature": 0.35,
                "maxOutputTokens": 650
            ]
        ]

        guard let bodyData = try? JSONSerialization.data(withJSONObject: payload) else {
            return nil
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 14
        request.httpBody = bodyData

        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
                return nil
            }
            guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let candidates = json["candidates"] as? [[String: Any]],
                  let content = candidates.first?["content"] as? [String: Any],
                  let parts = content["parts"] as? [[String: Any]],
                  let text = parts.first?["text"] as? String else {
                return nil
            }

            let promptEst = max(1, (systemInstruction.count + studentPrompt.count) / 4)
            let completionEst = max(1, text.count / 4)
            budgetSnapshot.totalRequests += 1
            budgetSnapshot.totalPromptTokens += promptEst
            budgetSnapshot.totalCompletionTokens += completionEst
            budgetSnapshot.estimatedCostUSD += (Double(promptEst) * 0.00000015) + (Double(completionEst) * 0.0000006)
            budgetSnapshot.lastProviderUsed = "Gemini 2.5 Flash (\(persona.name))"
            persistLedger()

            let rawTrimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
            let validation = DevelopmentalResponseValidator.validate(rawTrimmed)
            let safeText = validation.isValid ? rawTrimmed : DevelopmentalResponseValidator.safeFallback

            return ChatResponseComposer.enforceStructuredLessonIfNeeded(
                rawResponse: safeText,
                query: studentPrompt,
                conversationMode: conversationMode,
                persona: persona,
                topicTag: activeChapterContext
            )
        } catch {
            return nil
        }
    }

    func recordLocalFallbackCall() {
        budgetSnapshot.totalRequests += 1
        budgetSnapshot.lastProviderUsed = "Local Grounded Biology Engine"
        persistLedger()
    }
}
