import SwiftUI

// The small pieces every Journal card is built from, so all cards share one style: a coloured
// badge, the eyebrow above a title, a quiet footer with a "more" menu, chips, and a capsule
// button. First drawn for Today.

/// The small rounded square that marks a subject or a kind of work.
struct JournalBadge: View {
    enum Size {
        /// Beside caption text: an eyebrow or a card footer.
        case small
        /// Beside body text: a `JournalRow`'s icon.
        case row
    }

    let symbol: String
    let tint: Color
    var size: Size = .small
    @ScaledMetric(relativeTo: .subheadline) private var smallSide: CGFloat = 18
    @ScaledMetric(relativeTo: .body) private var rowSide: CGFloat = 26

    var body: some View {
        let side = size == .small ? smallSide : rowSide
        RoundedRectangle(cornerRadius: size == .small ? CornerRadius.micro + 1 : CornerRadius.small - 1, style: .continuous)
            .fill(tint)
            .frame(width: side, height: side)
            .overlay {
                Image(systemName: symbol)
                    .resizable()
                    .scaledToFit()
                    .fontWeight(size == .small ? .bold : .semibold)
                    .foregroundStyle(Color.kymaiaTileInk)
                    .padding(side * (size == .small ? 0.22 : 0.24))
            }
            .accessibilityHidden(true)
    }
}

/// The line above a small card's title: a badge and what the card is.
struct JournalEyebrow: View {
    let symbol: String
    let tint: Color
    let text: String

    var body: some View {
        HStack(spacing: Spacing.xs + 2) {
            JournalBadge(symbol: symbol, tint: tint)
            Text(text)
                .font(.kymaiaCaption.weight(.semibold))
                .foregroundStyle(Color.kymaiaMutedInk)
        }
    }
}

/// A card's quiet last row: a hairline, the badge, where it comes from, and a "more" menu.
struct JournalCardFooter<MenuItems: View>: View {
    let symbol: String
    let tint: Color
    let text: String
    let menuLabel: String
    let menuIdentifier: String
    @ViewBuilder let menu: MenuItems

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            Rectangle()
                .fill(Color.kymaiaHairline)
                .frame(height: StrokeWidth.thin)
                .accessibilityHidden(true)
            HStack(spacing: Spacing.sm) {
                JournalBadge(symbol: symbol, tint: tint)
                Text(text)
                    .font(.kymaiaCaption)
                    .foregroundStyle(Color.kymaiaTertiaryInk)
                    .fixedSize(horizontal: false, vertical: true)
                Spacer(minLength: Spacing.sm)
                Menu {
                    menu
                } label: {
                    Image(systemName: "ellipsis")
                        .font(.kymaiaCaption.weight(.bold))
                        .foregroundStyle(Color.kymaiaTertiaryInk)
                        .frame(width: Theme.Dimension.minimumTarget, height: Theme.Dimension.minimumTarget)
                        .contentShape(Rectangle())
                }
                .menuIndicator(.hidden)
                .buttonStyle(.plain)
                .padding(.vertical, -Spacing.sm)
                .padding(.trailing, -Spacing.sm)
                .accessibilityLabel(menuLabel)
                .accessibilityIdentifier(menuIdentifier)
            }
        }
    }
}

/// A small tinted capsule: a time estimate or a fact about the work.
struct JournalChip: View {
    /// What the chip's colour adds to its words. The words always carry the meaning on their own.
    enum Tone: Equatable, Sendable {
        /// A fact about the work: the accent on the selection fill.
        case accent
        /// Not started, or not ready yet: muted ink on the quiet control fill.
        case muted
        /// Done or proven: the success colour on a wash of itself.
        case success
        /// Warning or guided assistance state.
        case warn

        static var good: Tone { .success }
        static var neutral: Tone { .muted }
    }

    let text: String
    var systemImage: String? = nil
    var tone: Tone = .accent
    var isSelected: Bool = false
    var action: (() -> Void)? = nil

    init(text: String, tone: Tone = .accent) {
        self.text = text
        self.systemImage = nil
        self.tone = tone
    }

    init(label: String, systemImage: String? = nil, tone: Tone = .accent) {
        self.text = label
        self.systemImage = systemImage
        self.tone = tone
    }

    init(_ text: String, systemImage: String? = nil, tone: Tone = .accent) {
        self.text = text
        self.systemImage = systemImage
        self.tone = tone
    }

    init(_ text: String, systemImage: String? = nil, isSelected: Bool, action: @escaping () -> Void) {
        self.text = text
        self.systemImage = systemImage
        self.tone = isSelected ? .accent : .muted
        self.isSelected = isSelected
        self.action = action
    }

    var body: some View {
        if let action {
            Button(action: action) {
                chipContent
            }
            .buttonStyle(.plain)
        } else {
            chipContent
        }
    }

    private var chipContent: some View {
        let shape = RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
        return HStack(alignment: .firstTextBaseline, spacing: 5) {
            if let systemImage {
                Image(systemName: systemImage)
                    .font(.kymaiaCaption)
                    .imageScale(.small)
            }
            Text(text)
                .font(.kymaiaCaption.weight(.semibold))
                .fixedSize(horizontal: false, vertical: true)
        }
        .foregroundStyle(isFilter ? (isSelected ? Color.kymaiaBackground : Color.kymaiaInk) : foreground)
        .padding(.horizontal, Spacing.sm + 2)
        .padding(.vertical, Spacing.xs + 1)
        .background(shape.fill(isFilter ? (isSelected ? Color.kymaiaInk : Color.clear) : Color.kymaiaSurface))
        .overlay(
            shape.strokeBorder(
                isFilter
                    ? (isSelected ? Color.clear : Color.kymaiaControlBorder)
                    : Color.kymaiaHairline,
                lineWidth: 1
            )
        )
        .contentShape(shape)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }

    /// A chip with an action is a filter. It draws The Standard's ink inversion (solid ink with
    /// page-coloured text when chosen, a hairline outline otherwise), like `StandardFilterChip`,
    /// because the accent marks the learning work, not navigation.
    private var isFilter: Bool { action != nil }

    private var foreground: Color {
        switch tone {
        case .accent: return Color.kymaiaPrimaryStrong
        case .muted: return Color.kymaiaMutedInk
        case .success: return Color.kymaiaSuccess
        case .warn: return Color.kymaiaWarning
        }
    }
}

/// Editorial print hairline rule (modeled after `learn_language` `PolyglotRule`: 1pt hairline, preferred over nested boxes).
struct EditorialRule: View {
    var body: some View {
        Rectangle()
            .fill(Color.kymaiaHairline)
            .frame(height: 1)
            .accessibilityHidden(true)
    }
}

/// Editorial choice button for aligned multi-option grids (modeled after `learn_language` `EditorialChoice` & `polyglotSelectionInversion`):
/// - Every cell fills its grid column (`maxWidth: .infinity`, `minHeight: 44`) so all choices align on left and right edges.
/// - Active choice uses solid ink inversion (`Color.kymaiaInk` ground, `Color.kymaiaBackground` text).
/// - Inactive choice uses crisp `4pt` (`CornerRadius.micro`) corners and a `1pt` `Color.kymaiaControlBorder` outline on paper ground (zero muddy shaded wash).
struct EditorialAlignedChoiceButton: View {
    let title: String
    var subtitle: String? = nil
    var systemImage: String? = nil
    let isSelected: Bool
    var identifier: String = ""
    let action: () -> Void

    var body: some View {
        let shape = RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
        Button(action: action) {
            HStack(alignment: .firstTextBaseline, spacing: Spacing.xs + 2) {
                if let systemImage {
                    Image(systemName: systemImage)
                        .font(.kymaiaCaption.weight(.semibold))
                        .imageScale(.small)
                        .opacity(isSelected ? 0.95 : 0.78)
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.kymaiaControlLabel)
                        .fixedSize(horizontal: false, vertical: true)
                    if let subtitle, !subtitle.isEmpty {
                        Text(subtitle)
                            .font(.kymaiaCaption)
                            .opacity(0.82)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                if isSelected {
                    Image(systemName: "checkmark")
                        .font(.kymaiaCaption.weight(.bold))
                        .imageScale(.small)
                        .accessibilityHidden(true)
                }
            }
            .multilineTextAlignment(.leading)
            .padding(.horizontal, Spacing.sm + 4)
            .padding(.vertical, Spacing.xs + 3)
            .frame(maxWidth: .infinity, minHeight: Theme.Dimension.minimumTarget, maxHeight: .infinity, alignment: .leading)
            .foregroundStyle(isSelected ? Color.kymaiaBackground : Color.kymaiaInk)
            .background(shape.fill(isSelected ? Color.kymaiaInk : Color.clear))
            .overlay(
                shape.strokeBorder(isSelected ? Color.clear : Color.kymaiaControlBorder, lineWidth: 1)
            )
            .contentShape(shape)
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected ? [.isSelected, .isButton] : .isButton)
        .accessibilityIdentifier(identifier)
    }
}

/// A card's primary or secondary action modeled after `learn_language`'s `PolyglotCapsuleButtonStyle`:
/// - Crisp `4pt` (`CornerRadius.micro`) corners instead of bloated `Capsule()` ovals.
/// - `.filled`: solid ink inversion (`Color.kymaiaInk` fill, `Color.kymaiaBackground` text).
/// - `.tinted` / `.ghost`: crisp `1pt` `Color.kymaiaControlBorder` outline on clear/surface ground, zero muddy shaded fill.
struct JournalCapsuleButtonStyle: ButtonStyle {
    enum Prominence: Equatable, Sendable {
        case filled
        case tinted
        case ghost
    }

    enum Size: Equatable, Sendable {
        case regular
        case small
    }

    var prominence: Prominence = .filled
    var size: Size = .regular
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        let shape = RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
        let filled = prominence == .filled && isEnabled
        return configuration.label
            .labelStyle(EditorialBaselineLabelStyle())
            .font(size == .small ? .kymaiaCaption.weight(.semibold) : .kymaiaControlLabel)
            .fixedSize(horizontal: false, vertical: true)
            .foregroundStyle(!isEnabled ? Color.kymaiaMutedInk : (filled ? Color.kymaiaBackground : Color.kymaiaInk))
            .padding(.horizontal, size == .small ? Spacing.sm + 4 : Spacing.md + 2)
            .padding(.vertical, size == .small ? Spacing.xs + 3 : Spacing.sm)
            .frame(minHeight: Theme.Dimension.minimumTarget)
            .background(shape.fill(filled ? Color.kymaiaInk : (configuration.isPressed ? Color.kymaiaControlFill : Color.clear)))
            .overlay(
                shape.strokeBorder(
                    filled ? Color.clear : Color.kymaiaControlBorder,
                    style: StrokeStyle(lineWidth: 1, dash: isEnabled ? [] : [3, 3])
                )
            )
            .contentShape(shape)
            .opacity(isEnabled && configuration.isPressed ? 0.76 : 1.0)
    }
}

/// Icon and title on one baseline, the icon a step quieter (ported from `learn_language` `EditorialLabelStyle`).
struct EditorialBaselineLabelStyle: LabelStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 6) {
            configuration.icon.imageScale(.small).opacity(0.85)
            configuration.title
        }
    }
}
