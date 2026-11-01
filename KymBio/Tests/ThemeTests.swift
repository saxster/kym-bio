import XCTest
@testable import KymBio

final class ThemeTests: XCTestCase {
    func testDefaultThemeIsAppleJournal() {
        XCTAssertEqual(CuratedColorScheme.defaultScheme, .journal)
        XCTAssertEqual(CuratedColorScheme.allCases.count, 8)
        XCTAssertTrue(CuratedColorScheme.allCases.contains(.botanical))
        XCTAssertTrue(CuratedColorScheme.allCases.contains(.monsoon))
    }

    func testAllEightThemesMeetWCAGContrastStandards() {
        for scheme in CuratedColorScheme.allCases {
            let p = scheme.palette
            let n = p.neutrals

            // Primary ink on background and card surface >= 7.0:1 (WCAG AAA)
            XCTAssertGreaterThanOrEqual(
                n.ink.light.contrastRatio(with: p.background.light), 7.0,
                "\(scheme.rawValue) light ink vs background failed AAA"
            )
            XCTAssertGreaterThanOrEqual(
                n.ink.light.contrastRatio(with: n.surface.light), 7.0,
                "\(scheme.rawValue) light ink vs surface failed AAA"
            )
            XCTAssertGreaterThanOrEqual(
                n.ink.dark.contrastRatio(with: p.background.dark), 7.0,
                "\(scheme.rawValue) dark ink vs background failed AAA"
            )
            XCTAssertGreaterThanOrEqual(
                n.ink.dark.contrastRatio(with: n.surface.dark), 7.0,
                "\(scheme.rawValue) dark ink vs surface failed AAA"
            )

            // Muted & tertiary ink on surface >= 4.5:1 (WCAG AA)
            XCTAssertGreaterThanOrEqual(
                n.mutedInk.light.contrastRatio(with: n.surface.light), 4.5,
                "\(scheme.rawValue) light mutedInk vs surface failed AA"
            )
            XCTAssertGreaterThanOrEqual(
                n.tertiaryInk.light.contrastRatio(with: n.surface.light), 4.5,
                "\(scheme.rawValue) light tertiaryInk vs surface failed AA"
            )
            XCTAssertGreaterThanOrEqual(
                n.mutedInk.dark.contrastRatio(with: n.surface.dark), 4.5,
                "\(scheme.rawValue) dark mutedInk vs surface failed AA"
            )
            XCTAssertGreaterThanOrEqual(
                n.tertiaryInk.dark.contrastRatio(with: n.surface.dark), 4.5,
                "\(scheme.rawValue) dark tertiaryInk vs surface failed AA"
            )

            // Primary & secondary accents on surface >= 4.5:1 (WCAG AA)
            XCTAssertGreaterThanOrEqual(
                p.primary.light.contrastRatio(with: n.surface.light), 4.5,
                "\(scheme.rawValue) light primary vs surface failed AA"
            )
            XCTAssertGreaterThanOrEqual(
                p.secondary.light.contrastRatio(with: n.surface.light), 4.5,
                "\(scheme.rawValue) light secondary vs surface failed AA"
            )
            XCTAssertGreaterThanOrEqual(
                p.primary.dark.contrastRatio(with: n.surface.dark), 4.5,
                "\(scheme.rawValue) dark primary vs surface failed AA"
            )
            XCTAssertGreaterThanOrEqual(
                p.secondary.dark.contrastRatio(with: n.surface.dark), 4.5,
                "\(scheme.rawValue) dark secondary vs surface failed AA"
            )
        }
    }
}
