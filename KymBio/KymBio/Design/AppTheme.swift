import Foundation
import SwiftUI

/// Portable reading typography, spacing, and line-length options inspired by `../book_learn_ios`
/// (`packages/domain/src/typography.ts`, `readingProfiles.ts`, and `ReaderSettingsSheet.tsx`).
enum KymBioReadingFace: String, CaseIterable, Identifiable, Sendable {
    case literata = "literata"
    case georgia = "georgia"
    case sans = "sans"
    case mono = "mono"

    var id: String { rawValue }

    var label: String {
        switch self {
        case .literata: return "Literata · Book Serif"
        case .georgia: return "New York · Editorial Serif"
        case .sans: return "San Francisco · Clean Sans"
        case .mono: return "JetBrains · System Mono"
        }
    }

    var shortLabel: String {
        switch self {
        case .literata: return "Literata"
        case .georgia: return "New York"
        case .sans: return "Sans"
        case .mono: return "Mono"
        }
    }

    var fontDesign: Font.Design {
        switch self {
        case .literata, .georgia: return .serif
        case .sans: return .default
        case .mono: return .monospaced
        }
    }
}

enum KymBioLineSpacing: String, CaseIterable, Identifiable, Sendable {
    case compact = "compact"
    case comfortable = "comfortable"
    case spacious = "spacious"

    var id: String { rawValue }

    var label: String {
        switch self {
        case .compact: return "Compact"
        case .comfortable: return "Comfortable"
        case .spacious: return "Spacious"
        }
    }

    var swiftUILineSpacing: CGFloat {
        switch self {
        case .compact: return 2
        case .comfortable: return 5
        case .spacious: return 9
        }
    }

    var webLineHeight: String {
        switch self {
        case .compact: return "1.48"
        case .comfortable: return "1.65"
        case .spacious: return "1.92"
        }
    }
}

enum KymBioReadingWidth: String, CaseIterable, Identifiable, Sendable {
    case narrow = "narrow"
    case normal = "normal"
    case wide = "wide"

    var id: String { rawValue }

    var label: String {
        switch self {
        case .narrow: return "Narrow"
        case .normal: return "Normal"
        case .wide: return "Wide"
        }
    }

    var pageMaxWidth: CGFloat {
        switch self {
        case .narrow: return 600
        case .normal: return 720
        case .wide: return 880
        }
    }

    var webMeasure: String {
        switch self {
        case .narrow: return "31rem"
        case .normal: return "36rem"
        case .wide: return "43rem"
        }
    }
}

enum KymBioReadingProfile: String, CaseIterable, Identifiable, Sendable {
    case read = "read"
    case study = "study"
    case evening = "evening"

    var id: String { rawValue }

    var label: String {
        switch self {
        case .read: return "Read"
        case .study: return "Study"
        case .evening: return "Evening"
        }
    }

    var subtitle: String {
        switch self {
        case .read: return "Literata · 18 pt · Comfortable · Parchment"
        case .study: return "New York · 20 pt · Narrow column · Warm"
        case .evening: return "Literata · 20 pt · Spacious · Night"
        }
    }
}

struct KymBioAppearanceSettingsSheet: View {
    @Environment(\.standardTheme) private var theme
    @Environment(\.dismiss) private var dismiss
    @AppStorage("kymbio.reader.face") private var rawFace: String = KymBioReadingFace.literata.rawValue
    @AppStorage("kymbio.reader.sizeStep") private var sizeStep: Int = 1
    @AppStorage("kymbio.reader.lineSpacing") private var rawSpacing: String = KymBioLineSpacing.comfortable.rawValue
    @AppStorage("kymbio.reader.lineWidth") private var rawWidth: String = KymBioReadingWidth.normal.rawValue

    let appName: String
    var showsDone: Bool = true

    private var selectedFace: KymBioReadingFace {
        KymBioReadingFace(rawValue: rawFace) ?? .literata
    }

    private var selectedSpacing: KymBioLineSpacing {
        KymBioLineSpacing(rawValue: rawSpacing) ?? .comfortable
    }

    private var selectedWidth: KymBioReadingWidth {
        KymBioReadingWidth(rawValue: rawWidth) ?? .normal
    }

    private var pointSizeLabel: Int {
        switch sizeStep {
        case 0: return 16
        case 1: return 18
        case 2: return 20
        default: return 23
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Spacing.lg) {
                EditorialHeader(
                    eyebrow: "SETTINGS · TEXT & APPEARANCE",
                    title: "Reading Typography & Theme",
                    subtitle: "Choose a reading profile, typeface, text size, line spacing, column width, and paper colour for \(appName)."
                )

                // 1. Reading Profiles (from ../book_learn_ios)
                VStack(alignment: .leading, spacing: Spacing.xs) {
                    Text("READING PROFILES")
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    HStack(spacing: Spacing.sm) {
                        ForEach(KymBioReadingProfile.allCases) { profile in
                            Button {
                                applyProfile(profile)
                            } label: {
                                VStack(alignment: .leading, spacing: 3) {
                                    Text(profile.label)
                                        .font(.system(size: 15, weight: .bold, design: .serif))
                                        .foregroundStyle(Color.kymaiaInk)
                                    Text(profile.subtitle)
                                        .font(.system(size: 11))
                                        .foregroundStyle(Color.kymaiaMutedInk)
                                        .lineLimit(2)
                                        .multilineTextAlignment(.leading)
                                }
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .topLeading)
                                .background(
                                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                                        .fill(Color.kymaiaSurface)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                                        .strokeBorder(Color.kymaiaControlBorder, lineWidth: 1)
                                )
                            }
                            .buttonStyle(.plain)
                            .accessibilityIdentifier("settings.profile.\(profile.rawValue)")
                        }
                    }
                }

                // 2. Typeface + Live Typeface & Spacing Preview Card
                VStack(alignment: .leading, spacing: Spacing.xs) {
                    Text("TYPEFACE")
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Picker("Typeface", selection: $rawFace) {
                        ForEach(KymBioReadingFace.allCases) { face in
                            Text(face.shortLabel).tag(face.rawValue)
                        }
                    }
                    .pickerStyle(.segmented)
                    .accessibilityIdentifier("settings.typeface")

                    VStack(alignment: .leading, spacing: 6) {
                        Text("LIVE SPECIMEN PREVIEW · \(selectedFace.label.uppercased()) · \(pointSizeLabel) PT")
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .foregroundStyle(Color.kymaiaPrimaryStrong)
                        Text("Every living cell is a walled city whose border guards—phospholipid membranes and protein channels—decide which molecules may cross.")
                            .font(.system(size: CGFloat(pointSizeLabel), weight: .regular, design: selectedFace.fontDesign))
                            .lineSpacing(selectedSpacing.swiftUILineSpacing)
                            .foregroundStyle(Color.kymaiaInk)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .padding(14)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: 12, style: .continuous)
                            .fill(Color.kymaiaSurface)
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 12, style: .continuous)
                            .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                    )
                }

                // 3. Text Size (A- / A+ + 4 steps)
                VStack(alignment: .leading, spacing: Spacing.xs) {
                    HStack {
                        Text("TEXT SIZE")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundStyle(Color.kymaiaMutedInk)
                        Spacer()
                        Text("\(pointSizeLabel) pt")
                            .font(.system(size: 12, weight: .semibold, design: .monospaced))
                            .foregroundStyle(Color.kymaiaInk)
                    }
                    HStack(spacing: Spacing.sm) {
                        Button {
                            sizeStep = max(0, sizeStep - 1)
                        } label: {
                            Text("A−")
                                .font(.system(size: 15, weight: .bold))
                                .frame(minWidth: 56, minHeight: 38)
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        .disabled(sizeStep <= 0)
                        .accessibilityIdentifier("settings.size.smaller")

                        Picker("Text size", selection: $sizeStep) {
                            Text("Smaller").tag(0)
                            Text("Normal").tag(1)
                            Text("Larger").tag(2)
                            Text("Largest").tag(3)
                        }
                        .pickerStyle(.segmented)

                        Button {
                            sizeStep = min(3, sizeStep + 1)
                        } label: {
                            Text("A+")
                                .font(.system(size: 17, weight: .bold))
                                .frame(minWidth: 56, minHeight: 38)
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        .disabled(sizeStep >= 3)
                        .accessibilityIdentifier("settings.size.larger")
                    }
                }

                // 4. Line Spacing & Line Length (from ../book_learn_ios)
                HStack(alignment: .top, spacing: Spacing.md) {
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Text("LINE SPACING")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundStyle(Color.kymaiaMutedInk)
                        Picker("Line spacing", selection: $rawSpacing) {
                            ForEach(KymBioLineSpacing.allCases) { sp in
                                Text(sp.label).tag(sp.rawValue)
                            }
                        }
                        .pickerStyle(.segmented)
                        .accessibilityIdentifier("settings.line-spacing")
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Text("LINE LENGTH")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundStyle(Color.kymaiaMutedInk)
                        Picker("Line length", selection: $rawWidth) {
                            ForEach(KymBioReadingWidth.allCases) { wd in
                                Text(wd.label).tag(wd.rawValue)
                            }
                        }
                        .pickerStyle(.segmented)
                        .accessibilityIdentifier("settings.line-width")
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }

                // 5. Colour Themes
                VStack(alignment: .leading, spacing: Spacing.xs) {
                    Text("PAPER & INK COLOURS")
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    StandardThemeGallery()
                }

                // 6. 1-on-1 Full-Duplex Voice Tutor & ElevenLabs British Voice (en-GB) API Keys
                BookKitVoiceAndTutorSettingsCard(initiallyUnlocked: true) { geminiKey, elevenKey in
                    KymBioLiveAIClient.shared.configuredAPIKey = geminiKey
                    KymBioLiveAIClient.shared.configuredElevenLabsKey = elevenKey
                    KymBioLiveAIClient.shared.refreshCredentialsFromFamilyKeychain()
                }

                Button("Reset to Herbarium Defaults") {
                    applyProfile(.read)
                }
                .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                .accessibilityIdentifier("settings.reset")
            }
            .padding(Spacing.xl)
            .frame(maxWidth: 760, alignment: .leading)
        }
        .frame(minWidth: 440, minHeight: 540)
        .background(theme.bg)
        .toolbar {
            if showsDone {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private func applyProfile(_ profile: KymBioReadingProfile) {
        switch profile {
        case .read:
            rawFace = KymBioReadingFace.literata.rawValue
            sizeStep = 1
            rawSpacing = KymBioLineSpacing.comfortable.rawValue
            rawWidth = KymBioReadingWidth.normal.rawValue
            UserDefaults.standard.set(StandardTheme.parchment.id, forKey: StandardThemeStore.subjectAppStorageKey)
        case .study:
            rawFace = KymBioReadingFace.georgia.rawValue
            sizeStep = 2
            rawSpacing = KymBioLineSpacing.comfortable.rawValue
            rawWidth = KymBioReadingWidth.narrow.rawValue
            UserDefaults.standard.set(StandardTheme.sepia.id, forKey: StandardThemeStore.subjectAppStorageKey)
        case .evening:
            rawFace = KymBioReadingFace.literata.rawValue
            sizeStep = 2
            rawSpacing = KymBioLineSpacing.spacious.rawValue
            rawWidth = KymBioReadingWidth.normal.rawValue
            UserDefaults.standard.set(StandardTheme.darkGraphite.id, forKey: StandardThemeStore.subjectAppStorageKey)
        }
    }
}

struct KymBioSettingsButton: View {
    @State private var isPresented = false
    let appName: String

    var body: some View {
        Button {
            isPresented = true
        } label: {
            Label("Settings & Typography", systemImage: "gearshape")
        }
        .help("Settings: typography, spacing, and colour theme")
        .accessibilityIdentifier("toolbar.settings")
        .sheet(isPresented: $isPresented) {
            NavigationStack {
                KymBioAppearanceSettingsSheet(appName: appName, showsDone: true)
            }
            .standardThemeHost(rebuildsOnThemeChange: false)
        }
    }
}

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
