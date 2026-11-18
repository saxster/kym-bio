import XCTest
import SwiftUI
@testable import KymBio

final class VoiceCoachAndSettingsTests: XCTestCase {
    @MainActor
    func testFullDuplexVoiceTutorAndElevenLabsSettingsIntegration() throws {
        // 1. Verify hermetic family keychain round-trip for Gemini Live Full-Duplex & ElevenLabs British English keys
        let isolatedKeychain = KymLiveFamilyKeychain(useInMemoryStoreForTesting: true)
        XCTAssertNil(isolatedKeychain.loadGeminiAPIKey())
        XCTAssertNil(isolatedKeychain.loadElevenLabsAPIKey())

        try isolatedKeychain.saveAPIKey("AIzaSyTestGeminiLiveDuplexKey", provider: "gemini")
        try isolatedKeychain.saveElevenLabsAPIKey("xi_test_elevenlabs_british_key")
        try isolatedKeychain.savePreferredVoiceProviderMode(.geminiLiveHybridElevenLabs)
        try isolatedKeychain.savePreferredBritishVoiceID("charlotte_oxford")
        try isolatedKeychain.savePreferredLiveModelTier(.extendedThinking)
        try isolatedKeychain.savePreferredThinkingTier(.deep)

        XCTAssertEqual(isolatedKeychain.loadGeminiAPIKey(), "AIzaSyTestGeminiLiveDuplexKey")
        XCTAssertEqual(isolatedKeychain.loadElevenLabsAPIKey(), "xi_test_elevenlabs_british_key")
        XCTAssertEqual(isolatedKeychain.loadPreferredVoiceProviderMode(), .geminiLiveHybridElevenLabs)
        XCTAssertEqual(isolatedKeychain.loadPreferredBritishVoiceID(), "charlotte_oxford")
        XCTAssertEqual(isolatedKeychain.loadPreferredLiveModelTier(), .extendedThinking)
        XCTAssertEqual(isolatedKeychain.loadPreferredThinkingTier(), .deep)

        // 2. Verify ElevenLabs 24kHz PCM streaming request construction for British English (en-GB) preset
        let charlotte = KymLiveBritishVoiceCatalog.preset(forID: "charlotte_oxford")
        XCTAssertEqual(charlotte.localeIdentifier, "en-GB")
        XCTAssertEqual(charlotte.geminiLiveVoiceName, "Aoede")
        let req = try KymLiveElevenLabsClient.buildStreamingPCM24kRequest(
            apiKey: "xi_test_elevenlabs_british_key",
            voiceID: charlotte.elevenLabsVoiceID,
            text: "Energy is released from glucose inside mitochondria."
        )
        XCTAssertEqual(req.value(forHTTPHeaderField: "xi-api-key"), "xi_test_elevenlabs_british_key")
        XCTAssertTrue(req.url?.absoluteString.contains("output_format=pcm_24000") == true)

        // 3. Verify KymBioFullDuplexTutorController thinking-hold and stop lifecycle
        let controller = KymBioFullDuplexTutorController()
        XCTAssertFalse(controller.isLiveCallActive)
        XCTAssertFalse(controller.isThinkingHoldActive)
        controller.toggleThinkingHold()
        XCTAssertTrue(controller.isThinkingHoldActive)
        controller.stopLiveSession()
        XCTAssertFalse(controller.isLiveCallActive)
        XCTAssertFalse(controller.isThinkingHoldActive)
    }

    @MainActor
    func testEditorialControlsAndAlignedChoiceTokens() throws {
        // Verify editorial 4pt corner token and aligned choice components construct cleanly
        XCTAssertEqual(CornerRadius.micro, 4)
        XCTAssertEqual(TutorPersona.allCases.count, 6)
        XCTAssertEqual(CoachSessionPhase.allCases.count, 4)

        let alignedChoice = EditorialAlignedChoiceButton(
            title: "Marie Curie",
            systemImage: "atom",
            isSelected: true,
            identifier: "coach.persona.marie_curie"
        ) {}
        let rule = EditorialRule()
        XCTAssertNotNil(alignedChoice)
        XCTAssertNotNil(rule)
    }
}
