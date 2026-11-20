import XCTest
@testable import KymBio

final class PhETUpgradeTests: XCTestCase {
    func testWidgetsHaveRealChaptersAndPhETCapabilities() throws {
        let pack = SeedPackLoader.shared
        XCTAssertEqual(pack.widgets.count, 47)

        let chapters = Set(pack.widgets.map(\.chapter))
        XCTAssertGreaterThanOrEqual(chapters.count, 14, "Widgets must map to their actual chapters (0–15)")

        let diff = try XCTUnwrap(pack.widgets.first(where: { $0.id == "diffusion_membrane" }))
        XCTAssertEqual(diff.chapter, 3)
        XCTAssertTrue(diff.hasSonification)
        XCTAssertTrue(diff.hasDataTable)
        XCTAssertTrue(diff.hasDirectManipulation)
        XCTAssertNotNil(diff.realPlateId)

        let withRealPlates = pack.widgets.filter { $0.realPlateId != nil }
        XCTAssertGreaterThanOrEqual(withRealPlates.count, 30)

        for ch15Id in ["ecosystem_trophic_lab", "nutrient_cycles_eutrophication", "biotech_fermenter_plasmid_lab"] {
            let w = try XCTUnwrap(pack.widgets.first(where: { $0.id == ch15Id }))
            XCTAssertEqual(w.watchSteps.count, 5, "Expected 5 Watch Tour steps on double-quoted \(ch15Id)")
        }

        let osm = try XCTUnwrap(pack.widgets.first(where: { $0.id == "osmosis_cells" }))
        XCTAssertTrue(osm.is3D, "osmosis_cells mounts a 3D WebGL stage")

        for w in pack.widgets {
            XCTAssertFalse(w.facilitatorPredictPrompt.isEmpty, "Missing facilitatorPredictPrompt on \(w.id)")
        }
    }

    @MainActor
    func testFreezeWidgetIntoLabLogPersistsSnapshotAndTrials() throws {
        let pack = SeedPackLoader.shared
        let db = DatabaseManager(inMemory: true)
        let store = AppStore(db: db, pack: pack)
        let diff = try XCTUnwrap(pack.widgets.first(where: { $0.id == "diffusion_membrane" }))

        let dummyPNG = Data([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
        let trialsMD = "| # | Regime |\n| --- | --- |\n| 1 | Simple bilayer |"

        let entry = store.freezeWidgetIntoLabLog(
            widget: diff,
            readout: "L 55 vs R 45",
            trialsMarkdown: trialsMD,
            snapshotPNGData: dummyPNG
        )

        XCTAssertEqual(entry.snapshotPNGData, dummyPNG)
        XCTAssertEqual(entry.linkedChapterNumber, 3)
        XCTAssertTrue(entry.bodyNotesText.contains("Simple bilayer"))
        XCTAssertEqual(store.journalEntries.first(where: { $0.id == entry.id })?.snapshotPNGData, dummyPNG)
    }

    func testInteractiveWidgetSpecCodableRoundTripAndLegacyDecodingProperty() throws {
        // Backward compatibility: legacy v1 payload lacking all 9 enriched keys
        let legacyJSON = """
        {
          "id": "legacy_osmosis",
          "title": "Legacy Osmosis",
          "chapter": 3,
          "is3D": false,
          "challengePrompt": "Observe turgor vs plasmolysis",
          "cutaway": "Water moves down water potential",
          "idealised": "Qualitative shape envelope",
          "watchSteps": []
        }
        """
        let legacyData = try XCTUnwrap(legacyJSON.data(using: .utf8))
        let decodedLegacy = try JSONDecoder().decode(InteractiveWidgetSpec.self, from: legacyData)
        XCTAssertNil(decodedLegacy.realPlateId)
        XCTAssertFalse(decodedLegacy.hasSonification)
        XCTAssertFalse(decodedLegacy.hasDataTable)
        XCTAssertFalse(decodedLegacy.hasDirectManipulation)
        XCTAssertTrue(decodedLegacy.cambridgeUnits.isEmpty)
        XCTAssertEqual(decodedLegacy.facilitatorPredictPrompt, "")

        // Strict type-mismatch rejection (never swallow malformed JSON types)
        let badTypeJSON = """
        {
          "id": "bad_type",
          "title": "Bad Type",
          "chapter": 3,
          "is3D": false,
          "challengePrompt": "Test",
          "cutaway": "Test",
          "idealised": "Test",
          "watchSteps": [],
          "hasSonification": "yes"
        }
        """
        let badData = try XCTUnwrap(badTypeJSON.data(using: .utf8))
        XCTAssertThrowsError(try JSONDecoder().decode(InteractiveWidgetSpec.self, from: badData)) { err in
            XCTAssertTrue(err is DecodingError)
        }

        // Property round-trip across boundary integers, Unicode, empty & populated collections
        let encoder = JSONEncoder()
        let decoder = JSONDecoder()
        let boundaryChapters = [-1, 0, 1, 3, 15, 999]
        let sampleTexts = ["", "O₂ & CO₂ flux — Na⁺/K⁺", "C₆H₁₂O₆ → 2 C₂H₅OH", "mV / µm"]

        for idx in 0..<60 {
            let chapter = boundaryChapters[idx % boundaryChapters.count]
            let label = sampleTexts[idx % sampleTexts.count]
            let spec = InteractiveWidgetSpec(
                id: "prop_\(idx)",
                title: "Widget \(idx) \(label)",
                chapter: chapter,
                is3D: idx % 2 == 0,
                challengePrompt: label,
                cutaway: label,
                idealised: label,
                watchSteps: idx % 3 == 0 ? [] : [WidgetWatchStep(title: "S1 \(label)", caption: label)],
                realPlateId: idx % 4 == 0 ? nil : "plate_\(idx)",
                hasSonification: idx % 2 == 1,
                hasDataTable: idx % 3 == 1,
                hasDirectManipulation: idx % 5 == 0,
                cambridgeUnits: idx % 2 == 0 ? [] : [1, (idx % 9) + 1],
                relatedBridgeIds: idx % 3 == 0 ? [] : ["bridge-\(idx)"],
                facilitatorPredictPrompt: label,
                facilitatorTrap: label,
                facilitatorConceptQuestion: label
            )
            let encoded = try encoder.encode(spec)
            let decoded = try decoder.decode(InteractiveWidgetSpec.self, from: encoded)
            XCTAssertEqual(decoded, spec, "Round-trip mismatch at iteration \(idx)")
        }
    }

    @MainActor
    func testLabStampAndTelemetryIdempotency() {
        let pack = SeedPackLoader.shared
        let db = DatabaseManager(inMemory: true)
        let store = AppStore(db: db, pack: pack)

        store.earnWidgetChallengeStamp(widgetId: "diffusion_membrane", chapterNumber: 3, readout: "Run 1")
        let countAfterFirst = store.widgetStamps.count
        store.earnWidgetChallengeStamp(widgetId: "diffusion_membrane", chapterNumber: 3, readout: "Run 2")
        XCTAssertEqual(store.widgetStamps.count, countAfterFirst)
        XCTAssertNotNil(store.widgetStamps["diffusion_membrane"])

        store.shareLabTelemetryWithCoach("Left 55% vs Right 45%")
        XCTAssertEqual(store.activeLabTelemetryContext, "Left 55% vs Right 45%")
        store.shareLabTelemetryWithCoach("Left 55% vs Right 45%")
        XCTAssertEqual(store.activeLabTelemetryContext, "Left 55% vs Right 45%")

        store.clearLabTelemetryContext()
        XCTAssertNil(store.activeLabTelemetryContext)
    }
}
