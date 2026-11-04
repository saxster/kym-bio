import XCTest
@testable import KymBio

/// The Standard replaced KymBio's own theme catalogue; its contrast is tested in teaching_kit.
final class ThemeTests: XCTestCase {
    func testEveryOldThemeChoiceMovesToAStandardTheme() throws {
        let oldIDs = ["journal", "botanical", "monsoon", "sketchbook", "hearth", "scholar", "grove", "dusk", "not-a-theme"]
        let suite = "KymBioTests.theme.\(UUID().uuidString)"
        let defaults = try XCTUnwrap(UserDefaults(suiteName: suite))
        defer { defaults.removePersistentDomain(forName: suite) }
        let key = StandardThemeStore.subjectAppStorageKey
        let expected = [
            "hearth": "sepia", "scholar": "sepia",
            "botanical": "parchment", "grove": "parchment",
            "dusk": "dark-graphite"
        ]
        for oldID in oldIDs {
            defaults.set(oldID, forKey: key)
            AppTheme.register(defaults: defaults)
            XCTAssertEqual(defaults.string(forKey: key), expected[oldID] ?? "vivid", oldID)
        }
        defaults.removeObject(forKey: key)
        AppTheme.register(defaults: defaults)
        XCTAssertNil(defaults.string(forKey: key), "a learner who never chose keeps no stored choice")
        XCTAssertEqual(StandardThemeStore.storedID(in: defaults), "vivid", "and gets Vivid, the default")
        AppTheme.register()
    }

    func testAStandardChoiceSurvivesRegistration() throws {
        let suite = "KymBioTests.theme.\(UUID().uuidString)"
        let defaults = try XCTUnwrap(UserDefaults(suiteName: suite))
        defer { defaults.removePersistentDomain(forName: suite) }
        let key = StandardThemeStore.subjectAppStorageKey
        for id in [StandardTheme.systemID] + StandardTheme.all.map(\.id) {
            defaults.set(id, forKey: key)
            AppTheme.register(defaults: defaults)
            XCTAssertEqual(defaults.string(forKey: key), id)
        }
        AppTheme.register()
    }

    func testTheWebBookGetsAThemeNameItKnows() {
        let known: Set<String> = ["light", "dark", "sepia"]
        for theme in StandardTheme.all {
            XCTAssertTrue(known.contains(AppTheme.webBookTheme(for: theme)), theme.id)
        }
        XCTAssertEqual(AppTheme.webBookTheme(for: .sepia), "sepia")
        XCTAssertEqual(AppTheme.webBookTheme(for: .parchment), "light")
        XCTAssertEqual(AppTheme.webBookTheme(for: .darkGraphite), "dark")
        XCTAssertEqual(AppTheme.webBookTheme(for: .vivid), "dark")
    }
}
