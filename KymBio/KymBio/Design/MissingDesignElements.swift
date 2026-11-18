import SwiftUI

// MARK: - Missing Colors
extension Color {
    public static var kymaiaSecondaryInk: Color { Color.kymaiaMutedInk }
    public static var masteryLearning: Color { Color.kymaiaPrimary }
    public static let masteryNew = Color.kymaiaMutedInk
    public static var kymaiaReward: Color { Color.kymaiaSecondary }
    public static var kymaiaRewardBackground: Color { Color.kymaiaSecondary.opacity(0.14) }
    public static var statStreak: Color { Color.kymaiaPrimary }
    public static let kymaiaIdentityBackground = Color.kymaiaLive.opacity(0.12)
    public static let statMastered = Color.kymaiaSuccess
    public static var therapeuticBackground: Color { Color.kymaiaBackground }
    public static let therapeuticText = Color.kymaiaInk
    public static var kymaiaCuriosityBackground: Color { Color.kymaiaPrimary.opacity(0.12) }
    public static let statDue = Color.kymaiaError
    
    static func phaseColor(_ phase: RitualPhase) -> Color {
        switch phase {
        case .identityPrime:
            return Color.kymaiaLive
        case .warmRetrieval, .breakthrough:
            return Color.kymaiaPrimary
        case .struggleZone:
            return Color.kymaiaError
        case .curiosityHook:
            return Color.kymaiaSecondary
        case .reflection:
            return Color.kymaiaSuccess
        case .complete:
            return Color.kymaiaSuccess
        }
    }
}

extension Font {
    public static let kymaiaSerifBody = Font.body
    public static let kymaiaSubheadline = Font.subheadline
    public static var kymaiaCardTitle: Font { .kymaiaHeadline }
    public static var kymaiaTitle2: Font {
        .system(.title2, design: KymaiaThemeRuntime.current.style.headingFace.design).weight(.bold)
    }
    public static var kymaiaTitle3: Font {
        .system(.title3, design: KymaiaThemeRuntime.current.style.headingFace.design).weight(.semibold)
    }
    public static var kymaiaCaption2: Font { .caption2 }
    public static var kymaiaMonospaced: Font { .system(.footnote, design: .monospaced) }
}

extension StrokeWidth {
    public static let thin: CGFloat = 0.5
    public static let hairline: CGFloat = 0.25
}

// MARK: - Missing Styles
public struct KymaiaSecondaryButtonStyle: ButtonStyle {
    public init() {}
    public func makeBody(configuration: Configuration) -> some View {
        let shape = RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
        return configuration.label
            .padding()
            .frame(minHeight: 44)
            .contentShape(shape)
            .background(Color.kymaiaSurface.opacity(configuration.isPressed ? 0.85 : 1.0))
            .foregroundColor(.kymaiaInk)
            .overlay(
                shape.strokeBorder(Color.kymaiaControlBorder, lineWidth: StrokeWidth.thin)
            )
            .clipShape(shape)
            .kymaiaPointerHighlight(shape)
            .scaleEffect(configuration.isPressed ? 0.99 : 1.0)
    }
}

public typealias JournalFilterChipStyle = KymaiaOptionButtonStyle

public struct KymaiaOptionButtonStyle: ButtonStyle {
    var isSelected: Bool
    var isCorrect: Bool?

    public func makeBody(configuration: Configuration) -> some View {
        let shape = RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
        return configuration.label
            .padding()
            .frame(minHeight: 44)
            .contentShape(shape)
            .background(isSelected ? (isCorrect == true ? Color.kymaiaSuccess : Color.kymaiaInk) : Color.kymaiaSurface)
            .foregroundColor(isSelected ? Color.kymaiaBackground : Color.kymaiaInk)
            .overlay(
                shape.strokeBorder(isSelected ? Color.kymaiaInk : Color.kymaiaControlBorder, lineWidth: StrokeWidth.thin)
            )
            .clipShape(shape)
            .kymaiaPointerHighlight(shape)
            .scaleEffect(configuration.isPressed ? 0.99 : 1.0)
    }
}

public struct KymaiaCardStyleModifier: ViewModifier {
    public func body(content: Content) -> some View {
        let shape = RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
        return content
            .padding()
            .background(Color.kymaiaSurface)
            .clipShape(shape)
            .overlay(
                shape.strokeBorder(Color.kymaiaHairline, lineWidth: StrokeWidth.thin)
            )
    }
}

extension View {
    public func kymaiaCardStyle() -> some View {
        self.modifier(KymaiaCardStyleModifier())
    }
}

public struct KymaiaPrimaryButtonStyle: ButtonStyle {
    public init() {}
    public func makeBody(configuration: Configuration) -> some View {
        let shape = RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
        return configuration.label
            .padding()
            .frame(minHeight: 44)
            .contentShape(shape)
            .background(Color.kymaiaInk.opacity(configuration.isPressed ? 0.82 : 1))
            .foregroundColor(Color.kymaiaBackground)
            .overlay(
                shape.strokeBorder(Color.kymaiaInk, lineWidth: StrokeWidth.thin)
            )
            .clipShape(shape)
            .kymaiaPointerHighlight(shape)
            .scaleEffect(configuration.isPressed ? 0.99 : 1.0)
    }
}

public struct SessionGhostButtonStyle: ButtonStyle {
    public init() {}
    public func makeBody(configuration: Configuration) -> some View {
        let shape = RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
        return configuration.label
            .font(.kymaiaControlLabel)
            .padding(.horizontal, Spacing.md)
            .padding(.vertical, Spacing.xs)
            .frame(minHeight: 36)
            .background(Color.kymaiaSurface.opacity(configuration.isPressed ? 0.9 : 0.6))
            .foregroundStyle(Color.kymaiaInk)
            .overlay(
                shape.strokeBorder(Color.kymaiaControlBorder, lineWidth: StrokeWidth.thin)
            )
            .clipShape(shape)
            .scaleEffect(configuration.isPressed ? 0.99 : 1.0)
    }
}
