import SwiftUI

// MARK: - Physiological Box Breathing & Vagus-Nerve Reset (Grounded in Unit 1.3 & Ch 8/9)

enum PhysiologicalBreathingPhase: Int, CaseIterable, Identifiable {
    case inhale = 0
    case holdFull = 1
    case exhale = 2
    case holdEmpty = 3

    var id: Int { rawValue }

    var title: String {
        switch self {
        case .inhale: return "Inhale (4 s)"
        case .holdFull: return "Alveolar Hold (4 s)"
        case .exhale: return "Slow Exhale (4 s)"
        case .holdEmpty: return "Rest & Reset (4 s)"
        }
    }

    var physiologicalMechanism: String {
        switch self {
        case .inhale:
            return "Unit 1.3 Mechanism: External intercostals contract (ribs move up & out) and diaphragm contracts & flattens -> thoracic volume increases -> lung pressure drops below atmospheric pressure."
        case .holdFull:
            return "Unit 1.2 Mechanism: Steep concentration gradient drives O2 across the 1-cell-thick alveolar wall into red blood cells to form bright red oxyhaemoglobin."
        case .exhale:
            return "Ch 9 Vagus Nerve Reflex: Diaphragm relaxes into a dome -> thoracic volume decreases -> slow exhalation activates the vagus nerve to slow your sinoatrial node heart rate."
        case .holdEmpty:
            return "Homeostasis Reset: Prefrontal cortex oxygen delivery stabilises while sympathetic adrenaline clears."
        }
    }

    var targetScale: CGFloat {
        switch self {
        case .inhale, .holdFull: return 1.0
        case .exhale, .holdEmpty: return 0.56
        }
    }
}

struct BiologyBreathingStudioView: View {
    @State private var isRunning: Bool = false
    @State private var phase: PhysiologicalBreathingPhase = .inhale
    @State private var secondsInPhase: Int = 4
    @State private var completedCycles: Int = 0

    var body: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack {
                    JournalChip("Unit 1.3 Thoracic Mechanics & Ch 9 Vagus Reflex", systemImage: "lungs.fill", tone: .accent)
                    Spacer()
                    if completedCycles > 0 {
                        JournalChip("\(completedCycles) cycle\(completedCycles == 1 ? "" : "s") completed", systemImage: "checkmark.circle.fill", tone: .success)
                    }
                }

                Text("Physiological Box Breathing & Diaphragm Reset")
                    .font(.kymaiaTitle3)
                    .foregroundStyle(Color.kymaiaInk)

                Text("Experience Unit 1.3 (Breathing) in your own thorax before a hard proof or test. Watch how your diaphragm, ribcage volume, and vagus nerve calm your heart rate in 4-second phases.")
                    .font(.kymaiaBody)
                    .foregroundStyle(Color.kymaiaSecondaryInk)

                HStack(spacing: Spacing.lg) {
                    // Animated Thoracic / Alveolar Expansion Ring
                    ZStack {
                        Circle()
                            .strokeBorder(Color.kymaiaPrimary.opacity(0.22), lineWidth: 8)
                            .frame(width: 148, height: 148)

                        Circle()
                            .fill(Color.kymaiaPrimary.opacity(0.18))
                            .frame(width: 140, height: 140)
                            .scaleEffect(isRunning ? phase.targetScale : 0.68)
                            .animation(.easeInOut(duration: 1.0), value: phase)

                        VStack(spacing: 2) {
                            Image(systemName: "lungs.fill")
                                .font(.title2)
                                .foregroundStyle(Color.kymaiaPrimary)
                            Text(isRunning ? phase.title : "Ready")
                                .font(.kymaiaCaption.weight(.semibold))
                                .foregroundStyle(Color.kymaiaInk)
                            if isRunning {
                                Text("\(secondsInPhase)s")
                                    .font(.kymaiaTitle2.monospacedDigit())
                                    .foregroundStyle(Color.kymaiaPrimaryStrong)
                            }
                        }
                    }

                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        Text(phase.title)
                            .font(.kymaiaSubheadline)
                            .foregroundStyle(Color.kymaiaPrimary)

                        Text(phase.physiologicalMechanism)
                            .font(.kymaiaSerifProse)
                            .foregroundStyle(Color.kymaiaInk)

                        HStack(spacing: Spacing.sm) {
                            Button {
                                isRunning.toggle()
                                if isRunning {
                                    phase = .inhale
                                    secondsInPhase = 4
                                }
                            } label: {
                                Label(
                                    isRunning ? "Pause breathing guide" : "Start 4-4-4-4 breathing cycle",
                                    systemImage: isRunning ? "pause.fill" : "play.fill"
                                )
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .regular))
                            .accessibilityIdentifier("breathing.toggle")
                        }
                    }
                }
            }
        }
        .task(id: isRunning) {
            guard isRunning else { return }
            while !Task.isCancelled && isRunning {
                try? await Task.sleep(for: .seconds(1))
                guard !Task.isCancelled && isRunning else { break }
                if secondsInPhase > 1 {
                    secondsInPhase -= 1
                } else {
                    secondsInPhase = 4
                    let nextRaw = (phase.rawValue + 1) % PhysiologicalBreathingPhase.allCases.count
                    if nextRaw == 0 {
                        completedCycles += 1
                    }
                    phase = PhysiologicalBreathingPhase(rawValue: nextRaw) ?? .inhale
                }
            }
        }
    }
}

/// Gentle frustration-reset banner displayed in `QuestionProofPracticeView` when a learner hits repeated shaky attempts.
struct BiologyFrustrationInterventionBanner: View {
    let consecutiveShakyCount: Int
    var onStepBackToWorkedExample: () -> Void
    var onOpenBreathingSheet: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            HStack(spacing: Spacing.xs) {
                Image(systemName: "lungs.fill")
                    .foregroundStyle(Color.kymaiaPrimary)
                Text("Pause and reset your working memory (\(consecutiveShakyCount) tricky attempts in a row)")
                    .font(.kymaiaSubheadline)
                    .foregroundStyle(Color.kymaiaInk)
                Spacer()
            }

            Text("When a biological chain has four or five steps, trying to force it from memory while frustrated floods working memory. Take one slow diaphragm breath or step back to the worked example first.")
                .font(.kymaiaBody)
                .foregroundStyle(Color.kymaiaSecondaryInk)

            HStack(spacing: Spacing.sm) {
                Button {
                    onStepBackToWorkedExample()
                } label: {
                    Label("Step back to worked example", systemImage: "lightbulb.fill")
                }
                .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))

                Button {
                    onOpenBreathingSheet()
                } label: {
                    Label("30s diaphragm breath reset", systemImage: "wind")
                }
                .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
            }
        }
        .padding(Spacing.md)
        .background(
            RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                .fill(Color.kymaiaPrimary.opacity(0.10))
        )
        .overlay(
            RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                .strokeBorder(Color.kymaiaPrimary.opacity(0.35), lineWidth: 1)
        )
    }
}
