import SwiftUI

enum KymaiaSemanticStyle {
    static var appBackground: Color { .kymaiaBackground }
    static var groupedBackground: Color { .kymaiaGroupedBackground }
    static var surface: Color { .kymaiaSurface }
    static var elevatedSurface: Color { .kymaiaElevatedSurface }
    static var primaryText: Color { .kymaiaInk }
    static var secondaryText: Color { .kymaiaMutedInk }
    static var tertiaryText: Color { .kymaiaTertiaryInk }
    static var hairline: Color { .kymaiaHairline }
    static var accent: Color { .kymaiaPrimary }
    static var success: Color { .kymaiaSuccess }
    static var warning: Color { .kymaiaWarning }
    static var destructive: Color { .kymaiaError }
    static var canvas: Color { .kymaiaCanvas }
    static var sidebar: Color { .kymaiaSidebar }
    static var paper: Color { .kymaiaPaper }
    static var paperRaised: Color { .kymaiaPaperRaised }
    static var controlFill: Color { .kymaiaControlFill }
    static var selectionFill: Color { .kymaiaSelectionFill }
    static var focusRing: Color { .kymaiaFocusRing }
    static var scrim: Color { .kymaiaScrim }

    static func phaseAccent(_ phase: RitualPhase) -> Color {
        Color.phaseColor(phase)
    }
}

extension ShapeStyle where Self == Color {
    static var kymaiaAppBackground: Color { KymaiaSemanticStyle.appBackground }
    static var kymaiaGroupedBackground: Color { KymaiaSemanticStyle.groupedBackground }
    static var kymaiaSurfaceStyle: Color { KymaiaSemanticStyle.surface }
    static var kymaiaElevatedSurface: Color { KymaiaSemanticStyle.elevatedSurface }
    static var kymaiaPrimaryText: Color { KymaiaSemanticStyle.primaryText }
    static var kymaiaAccent: Color { KymaiaSemanticStyle.accent }
    static var kymaiaSuccessStyle: Color { KymaiaSemanticStyle.success }
    static var kymaiaWarningStyle: Color { KymaiaSemanticStyle.warning }
    static var kymaiaDestructive: Color { KymaiaSemanticStyle.destructive }
}

/// Fixed corner radii inside drawn biology figures (the anatomy plate's guide contour, the
/// alveolus capillary), where the shape is part of the drawing's geometry. Everything outside a
/// figure uses `CornerRadius.*` or `StandardRadius.*`.
enum BioFigureGeometry {
    static let plateContourRadius: CGFloat = 36
    static let capillaryRadius: CGFloat = 16
    /// Radius of the convergence dot where jointly-entailing hyperedge premises meet before the target arrow.
    static let junctionDotRadius: CGFloat = 5.0
    /// Length of drawn vector callout arrowheads on the TutorCanvas overlay.
    static let arrowHeadLength: CGFloat = 10.0
    /// Height of the segmented beat progress bar in Interactive Beats mode.
    static let beatRailHeight: CGFloat = 8.0
    /// Height of the visual bar gauge inside biological manipulative sandboxes.
    static let manipulativeGaugeHeight: CGFloat = 14.0
}

// MARK: - Reusable SmartyMe & Brilliant Pedagogical Cards

/// Brilliant-style Phenomenon -> Submicroscopic Mechanism -> Formal Principle/Equation Bridge Card.
struct PhenomenonMechanismBridgeCard: View {
    let bridge: PhenomenonToMechanismBridge
    @State private var selectedTermId: String? = nil
    @State private var selectedPerturbationChoice: String? = nil

    private var activeTerm: MechanismTermMapping {
        if let id = selectedTermId, let found = bridge.termMappings.first(where: { $0.id == id }) {
            return found
        }
        return bridge.termMappings[0]
    }

    var body: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack(spacing: Spacing.xs) {
                    JournalChip(label: "Clue → Cell Mechanism → Key Rule", systemImage: "sparkles", tone: .accent)
                    JournalChip(text: "Ch \(bridge.chapterNumber)", tone: .neutral)
                    Spacer()
                }

                Text(bridge.title)
                    .font(.kymaiaCardTitle)
                    .foregroundStyle(Color.kymaiaInk)

                BioMechanismVisualTriptychView(
                    chapterNumber: bridge.chapterNumber,
                    selectedChoice: selectedPerturbationChoice
                )

                VStack(alignment: .leading, spacing: Spacing.xs) {
                    Label("1. What you notice in everyday life", systemImage: "eye.fill")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaPrimary)
                    Text(bridge.observablePhenomenon)
                        .font(.kymaiaBody)
                        .foregroundStyle(Color.kymaiaInk)
                }
                .padding(Spacing.sm)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(
                    RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                        .fill(Color.kymaiaElevatedSurface)
                )

                VStack(alignment: .leading, spacing: Spacing.xs) {
                    Label("2. What happens inside the cells", systemImage: "atom")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaSuccess)
                    Text(bridge.ahaMechanismInvariant)
                        .font(.kymaiaBody)
                        .foregroundStyle(Color.kymaiaInk)
                }
                .padding(Spacing.sm)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(
                    RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                        .fill(Color.kymaiaSuccess.opacity(0.10))
                )

                VStack(alignment: .leading, spacing: Spacing.xs) {
                    Label("3. Key rule & equation (tap any part to test 'What if?')", systemImage: "function")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Text(bridge.principleOrEquationDisplay)
                        .font(.kymaiaMonospaced)
                        .foregroundStyle(Color.kymaiaPrimaryStrong)
                        .padding(Spacing.sm)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .fill(Color.kymaiaSelectionFill)
                        )
                }

                FlowLayout(spacing: Spacing.xs) {
                    ForEach(bridge.termMappings) { mapping in
                        let isSelected = activeTerm.id == mapping.id
                        Button {
                            selectedTermId = mapping.id
                            selectedPerturbationChoice = nil
                        } label: {
                            HStack(spacing: 4) {
                                Image(systemName: "hand.tap.fill")
                                Text(mapping.symbolOrTerm)
                            }
                        }
                        .buttonStyle(
                            JournalCapsuleButtonStyle(
                                prominence: isSelected ? .filled : .tinted,
                                size: .small
                            )
                        )
                        .accessibilityIdentifier("bridge.term.\(mapping.id)")
                    }
                }

                VStack(alignment: .leading, spacing: Spacing.xs) {
                    HStack {
                        Text(activeTerm.symbolOrTerm)
                            .font(.kymaiaCaption.weight(.bold))
                            .foregroundStyle(Color.kymaiaPrimaryStrong)
                        Text("· What you can change: \(activeTerm.sliderVariable)")
                            .font(.kymaiaCaption)
                            .foregroundStyle(Color.kymaiaMutedInk)
                    }
                    Text(activeTerm.biologicalMeaning)
                        .font(.kymaiaBody)
                        .foregroundStyle(Color.kymaiaInk)
                    Text("Real-world example: \(activeTerm.physicalAnchor)")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaTertiaryInk)

                    Divider()

                    Text(bridge.perturbationPrompt(for: activeTerm))
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaInk)

                    FlowLayout(spacing: Spacing.xs) {
                        ForEach(["Goes up", "Goes down", "Balances out"], id: \.self) { option in
                            Button(option) {
                                selectedPerturbationChoice = option
                            }
                            .buttonStyle(
                                JournalCapsuleButtonStyle(
                                    prominence: selectedPerturbationChoice == option ? .filled : .ghost,
                                    size: .small
                                )
                            )
                        }
                    }

                    if let choice = selectedPerturbationChoice {
                        Text("Your prediction (\(choice)): \(bridge.perturbationExplanation(for: activeTerm))")
                            .font(.kymaiaCaption)
                            .foregroundStyle(Color.kymaiaSuccess)
                            .padding(.top, 2)
                    }
                }
                .padding(Spacing.md)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(
                    RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                        .fill(Color.kymaiaElevatedSurface)
                )
            }
        }
    }
}

/// SmartyMe-style Branching Peer Biological Debate Card ("Who Is Right & Why?").
struct BiologicalDebateCardView: View {
    let scenario: BiologicalDebateScenario
    var onCompleted: ((Bool) -> Void)? = nil

    @State private var selectedChoiceId: String? = nil

    var body: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack(spacing: Spacing.xs) {
                    JournalChip(
                        label: "Who Is Right & Why?",
                        systemImage: "bubble.left.and.bubble.right.fill",
                        tone: .accent
                    )
                    JournalChip(text: "Ch \(scenario.chapterNumber) · Topic \(scenario.topicCode)", tone: .neutral)
                    Spacer()
                }

                Text(scenario.title)
                    .font(.kymaiaCardTitle)
                    .foregroundStyle(Color.kymaiaInk)

                Text(scenario.mumbaiContextPrompt)
                    .font(.kymaiaSerifProse)
                    .foregroundStyle(Color.kymaiaInk)

                HStack(spacing: Spacing.sm) {
                    BioComicPanelIllustrationView(
                        character: .dash,
                        chapterNumber: scenario.chapterNumber,
                        isResolution: false
                    )
                    .frame(height: 84)
                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                            .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                    )

                    BioComicPanelIllustrationView(
                        character: .kym,
                        chapterNumber: scenario.chapterNumber,
                        isResolution: true
                    )
                    .frame(height: 84)
                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                            .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                    )
                }

                VStack(spacing: Spacing.sm) {
                    ForEach(scenario.choices) { choice in
                        let isSelected = selectedChoiceId == choice.id
                        Button {
                            selectedChoiceId = choice.id
                            onCompleted?(choice.isCorrect)
                        } label: {
                            HStack(alignment: .top, spacing: Spacing.sm) {
                                Image(
                                    systemName: isSelected
                                        ? (choice.isCorrect ? "checkmark.circle.fill" : "exclamationmark.triangle.fill")
                                        : "person.wave.2.fill"
                                )
                                .foregroundStyle(
                                    isSelected
                                        ? (choice.isCorrect ? Color.kymaiaSuccess : Color.kymaiaWarning)
                                        : Color.kymaiaPrimary
                                )
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(choice.speakerName)
                                        .font(.kymaiaCaption.weight(.bold))
                                        .foregroundStyle(Color.kymaiaPrimaryStrong)
                                    Text("\"\(choice.claim)\"")
                                        .font(.kymaiaBody)
                                        .foregroundStyle(Color.kymaiaInk)
                                        .multilineTextAlignment(.leading)
                                }
                                Spacer()
                            }
                            .padding(Spacing.md)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .fill(isSelected ? Color.kymaiaSelectionFill : Color.kymaiaElevatedSurface)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .strokeBorder(
                                        isSelected
                                            ? (choice.isCorrect ? Color.kymaiaSuccess : Color.kymaiaWarning)
                                            : Color.kymaiaHairline,
                                        lineWidth: isSelected ? 2 : 1
                                    )
                            )
                        }
                        .buttonStyle(.plain)
                        .accessibilityIdentifier("debate.choice.\(choice.id)")
                    }
                }

                if let selectedId = selectedChoiceId,
                   let chosen = BiologicalDebateEngine.evaluate(scenario: scenario, choiceId: selectedId) {
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        HStack {
                            Image(systemName: chosen.isCorrect ? "checkmark.seal.fill" : "lightbulb.fill")
                                .foregroundStyle(chosen.isCorrect ? Color.kymaiaSuccess : Color.kymaiaWarning)
                            Text(
                                chosen.isCorrect
                                    ? "\(chosen.speakerName) is right — Here's why"
                                    : "Why \(chosen.speakerName)'s idea is a common mix-up"
                            )
                            .font(.kymaiaCaption.weight(.bold))
                            .foregroundStyle(chosen.isCorrect ? Color.kymaiaSuccess : Color.kymaiaWarning)
                        }

                        Text(chosen.socraticRebuttal)
                            .font(.kymaiaBody)
                            .foregroundStyle(Color.kymaiaInk)

                        Text("Key takeaway: \(chosen.invariantTakeaway)")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaPrimaryStrong)
                            .padding(.top, 2)
                    }
                    .padding(Spacing.md)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                            .fill(
                                (chosen.isCorrect ? Color.kymaiaSuccess : Color.kymaiaWarning)
                                    .opacity(0.12)
                            )
                    )
                }
            }
        }
    }
}

/// Brilliant-style Interactive Biological System Manipulative Sandbox Card.
struct BioManipulativeSandboxCard: View {
    let spec: BioManipulativeSpec
    var onStampReadout: ((String) -> Void)? = nil

    @State private var primaryValue: Double
    @State private var secondaryValue: Double

    init(spec: BioManipulativeSpec, onStampReadout: ((String) -> Void)? = nil) {
        self.spec = spec
        self.onStampReadout = onStampReadout
        _primaryValue = State(initialValue: spec.defaultPrimary)
        _secondaryValue = State(initialValue: spec.defaultSecondary)
    }

    private var state: BioManipulativeState {
        BioManipulativeState(primaryValue: primaryValue, secondaryValue: secondaryValue)
    }

    private var normalizedFillFraction: Double {
        let pNorm = (primaryValue - spec.primaryRange.lowerBound)
            / max(1.0, spec.primaryRange.upperBound - spec.primaryRange.lowerBound)
        let sNorm = (secondaryValue - spec.secondaryRange.lowerBound)
            / max(1.0, spec.secondaryRange.upperBound - spec.secondaryRange.lowerBound)
        return min(1.0, max(0.08, (pNorm + sNorm) / 2.0))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            HStack(spacing: Spacing.xs) {
                JournalChip(
                    label: spec.kind.title,
                    systemImage: "slider.horizontal.3",
                    tone: .accent
                )
                JournalChip(text: spec.kind.badgeLabel, tone: .neutral)
                Spacer()
            }

            Text(spec.prompt)
                .font(.kymaiaCaption)
                .foregroundStyle(Color.kymaiaMutedInk)

            BioSpecimenPlateCanvas(
                chapterNumber: max(0, Int(spec.questionId.filter(\.isNumber).prefix(1)) ?? 1),
                figureId: spec.questionId,
                callouts: []
            )
            .frame(height: 112)
            .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                    .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
            )

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text("\(spec.primaryLabel): \(Int(primaryValue)) \(spec.primaryUnit)")
                        .font(.kymaiaCaption.weight(.semibold).monospacedDigit())
                    Spacer()
                }
                Slider(
                    value: $primaryValue,
                    in: spec.primaryRange,
                    step: spec.primaryStep
                )
                .tint(Color.kymaiaPrimary)
            }

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text("\(spec.secondaryLabel): \(Int(secondaryValue)) \(spec.secondaryUnit)")
                        .font(.kymaiaCaption.weight(.semibold).monospacedDigit())
                    Spacer()
                }
                Slider(
                    value: $secondaryValue,
                    in: spec.secondaryRange,
                    step: spec.secondaryStep
                )
                .tint(Color.kymaiaSecondary)
            }

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
                        .fill(Color.kymaiaControlFill)
                    RoundedRectangle(cornerRadius: CornerRadius.micro, style: .continuous)
                        .fill(Color.kymaiaPrimary)
                        .frame(width: geo.size.width * normalizedFillFraction)
                }
            }
            .frame(height: BioFigureGeometry.manipulativeGaugeHeight)

            Text(state.liveReadout(for: spec))
                .font(.kymaiaMonospaced)
                .foregroundStyle(Color.kymaiaInk)
                .padding(Spacing.sm)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(
                    RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                        .fill(Color.kymaiaSurface)
                )

            HStack {
                Text(spec.targetInsight)
                    .font(.kymaiaCaption)
                    .foregroundStyle(Color.kymaiaMutedInk)
                Spacer()
                if let onStampReadout {
                    Button {
                        onStampReadout(state.liveReadout(for: spec))
                    } label: {
                        Label("Stamp Readout to Answer", systemImage: "plus.bubble.fill")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                    .accessibilityIdentifier("manipulative.stamp.\(spec.questionId)")
                }
            }
        }
        .padding(Spacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                .fill(Color.kymaiaElevatedSurface)
        )
    }
}

/// Non-punitive causal diagnostic banner when a learner's calculation hits a known BuggyBioRuleTrap.
struct BuggyBioTrapBanner: View {
    let trap: BuggyBioRuleTrap

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.xs) {
            HStack(spacing: Spacing.xs) {
                Image(systemName: "exclamationmark.magnifyingglass")
                    .foregroundStyle(Color.kymaiaWarning)
                Text("Common Mix-Up · \(trap.trapName)")
                    .font(.kymaiaCaption.weight(.bold))
                    .foregroundStyle(Color.kymaiaWarning)
            }
            Text("Why this number appeared: \(trap.diagnosticWhy)")
                .font(.kymaiaBody)
                .foregroundStyle(Color.kymaiaInk)
            Text("How to fix it: \(trap.visualFixNudge)")
                .font(.kymaiaCaption.weight(.semibold))
                .foregroundStyle(Color.kymaiaPrimaryStrong)
        }
        .padding(Spacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                .fill(Color.kymaiaWarning.opacity(0.14))
        )
        .overlay(
            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                .strokeBorder(Color.kymaiaWarning, lineWidth: 1)
        )
    }
}
