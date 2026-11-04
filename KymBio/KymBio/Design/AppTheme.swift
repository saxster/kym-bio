import Foundation

/// KymBio draws in The Standard, the design system it shares with the other subject apps and
/// apple_poem (teaching_kit `docs/STANDARD.md`).
enum AppTheme {
    /// Where an old theme of KymBio's catalogue went when The Standard replaced it: the warm paper
    /// themes become Warm, the green paper themes become Paper, Dusk becomes Dusk, and every other
    /// old id becomes Vivid, the new default.
    static let legacy: [String: String] = [
        "hearth": "sepia",
        "scholar": "sepia",
        "botanical": "parchment",
        "grove": "parchment",
        "dusk": "dark-graphite"
    ]

    /// Moves an old stored choice to its Standard theme and makes the choice the design system's
    /// theme. Call it first thing in every process that draws UI.
    static func register(defaults: UserDefaults = .standard) {
        StandardThemeStore.register(defaults: defaults, legacy: legacy)
    }

    /// The stored theme id: a Standard theme id or `system`.
    static var currentID: String {
        StandardThemeStore.storedID(in: .standard)
    }

    /// The Living World web book's own `data-theme` values are `light`, `dark` and `sepia`; this
    /// is the closest one for a Standard theme.
    static func webBookTheme(for theme: StandardTheme) -> String {
        if theme.id == StandardTheme.sepia.id { return "sepia" }
        return theme.isDark ? "dark" : "light"
    }
}
