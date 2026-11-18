import SwiftUI

// MARK: - 6-Character Repertory Cast & Malabar Hill Atelier Humour Bible

enum BioComicCharacter: String, CaseIterable, Identifiable, Sendable {
    case kym = "kym"
    case dash = "dash"
    case barnaby = "barnaby"
    case pip = "pip"
    case bento = "bento"
    case clara = "clara"

    var id: String { rawValue }

    static func resolve(_ raw: String) -> BioComicCharacter {
        let lower = raw.lowercased()
        if lower.contains("barnaby") { return .barnaby }
        if lower.contains("dash") { return .dash }
        if lower.contains("pip") || lower.contains("zeta") { return .pip }
        if lower.contains("bento") { return .bento }
        if lower.contains("clara") { return .clara }
        return .kym
    }

    var displayName: String {
        switch self {
        case .kym: return "Kym"
        case .dash: return "Dash"
        case .barnaby: return "Director Barnaby"
        case .pip: return "Dr. Zeta & Pip"
        case .bento: return "Master Bento"
        case .clara: return "Clara"
        }
    }

    var roleBadge: String {
        switch self {
        case .kym: return "10× Lens Investigator"
        case .dash: return "Shortcut Sprinter"
        case .barnaby: return "Chief Jargon Officer"
        case .pip: return "1 µm Field Observers"
        case .bento: return "Atelier Workbench"
        case .clara: return "Field Archivist"
        }
    }

    var initials: String {
        switch self {
        case .kym: return "KY"
        case .dash: return "DA"
        case .barnaby: return "DB"
        case .pip: return "ZP"
        case .bento: return "MB"
        case .clara: return "CL"
        }
    }

    var tint: Color {
        switch self {
        case .kym: return .kymaiaPrimary
        case .dash, .barnaby: return .kymaiaError
        case .pip, .bento: return .kymaiaWarning
        case .clara: return .kymaiaSuccess
        }
    }
}

struct BioDailyHumourGag: Identifiable, Sendable {
    let id: String
    let chapterNumber: Int
    let title: String
    let dateline: String
    let setupSpeaker: BioComicCharacter
    let setupSpeech: String
    let punchlineSpeaker: BioComicCharacter
    let punchlineSpeech: String
    let biologyRuleTakeaway: String

    static let allGags: [BioDailyHumourGag] = [
        BioDailyHumourGag(
            id: "gag-ch00",
            chapterNumber: 0,
            title: "The Sub-Committee on Spontaneous Weevils",
            dateline: "Malabar Hill Kitchen & Florence, 1668",
            setupSpeaker: .barnaby,
            setupSpeech: "The flour tin was sealed for a month and now has beetles! I have drafted a memo declaring that warm chapati flour spontaneously manufactures insects.",
            punchlineSpeaker: .kym,
            punchlineSpeech: "Look through this 10× lens at the microscopic egg plug a mother rice weevil drilled into the grain before it left the mill, Barnaby. One coin in the Jargon Jar.",
            biologyRuleTakeaway: "Controlled experiments change one variable at a time (Redi's gauze jar kept air constant while blocking adult flies)."
        ),
        BioDailyHumourGag(
            id: "gag-ch01",
            chapterNumber: 1,
            title: "Why Your Lunch Doesn't Burst Into Flames",
            dateline: "Malabar Hill Atelier · Thermos Bench",
            setupSpeaker: .dash,
            setupSpeech: "Respiration has the exact same chemical equation as burning glucose in a candle flame! Stand back, Kym—these soaking moong sprouts are about to hit 1,000 °C!",
            punchlineSpeaker: .pip,
            punchlineSpeech: "Reporting live from inside the mitochondrion at 28 °C: enzymes are cashing the glucose energy out in 32 small ATP coins instead of one giant fireball.",
            biologyRuleTakeaway: "Respiration releases energy from glucose stepwise via enzymes into ATP (never write 'energy is created or produced')."
        ),
        BioDailyHumourGag(
            id: "gag-ch02",
            chapterNumber: 2,
            title: "Director Barnaby's Giant Single-Celled Monster",
            dateline: "Crawford Market Paneer Scale, Mumbai",
            setupSpeaker: .barnaby,
            setupSpeech: "Why bother with 37 trillion tiny cells? To cut administrative overhead, I propose scaling one amoeba up to the size of a double-decker BEST bus!",
            punchlineSpeaker: .bento,
            punchlineSpeech: "When length scales by 1,000×, surface area grows by 1,000,000× but volume grows by 1,000,000,000× (SA:V = 6/L). Your giant amoeba's centre starves of oxygen in 4 seconds.",
            biologyRuleTakeaway: "Surface-area-to-volume ratio (SA:V = 6/L) falls as size increases, forcing large organisms to be multicellular with folded exchange surfaces."
        ),
        BioDailyHumourGag(
            id: "gag-ch03",
            chapterNumber: 3,
            title: "Traffic Control at the Cell Membrane",
            dateline: "Carter Road Mangroves, Mumbai",
            setupSpeaker: .barnaby,
            setupSpeech: "Who told these water molecules to march into the cucumber slice? Where is their tiny molecular GPS?",
            punchlineSpeaker: .pip,
            punchlineSpeech: "No GPS, Director—every molecule bounces randomly at 37 °C. More free water molecules bounce in from the dilute side than bounce out from the salty side.",
            biologyRuleTakeaway: "Osmosis is net movement of water from higher water potential (dilute) to lower water potential (concentrated) across a partially permeable membrane."
        ),
        BioDailyHumourGag(
            id: "gag-ch04",
            chapterNumber: 4,
            title: "The Crime of 'Killing' an Enzyme",
            dateline: "Committee Room 4B · Exam Wording Desk",
            setupSpeaker: .dash,
            setupSpeech: "We boiled the catalase at 80 °C and the bubbles stopped—so the heat killed the enzyme!",
            punchlineSpeaker: .clara,
            punchlineSpeech: "Two coins in the jar, Dash. A protein was never alive to be killed: thermal jostling snapped its weak bonds and unfolded its active site—it is denatured.",
            biologyRuleTakeaway: "High temperature or extreme pH denatures an enzyme by unfolding its 3D active site so the substrate no longer fits."
        ),
        BioDailyHumourGag(
            id: "gag-ch05",
            chapterNumber: 5,
            title: "Where Does a Banyan Tree's Weight Come From?",
            dateline: "Hanging Gardens, Malabar Hill",
            setupSpeaker: .barnaby,
            setupSpeech: "This 5-tonne banyan tree obviously ate 5 tonnes of garden soil! Why else would the pot look so busy?",
            punchlineSpeaker: .kym,
            punchlineSpeech: "Van Helmont weighed the dry soil before and after 5 years: the tree gained 74 kg while the soil lost only 57 grams. The tree wove its wood out of invisible CO₂ gas and water.",
            biologyRuleTakeaway: "Photosynthesis fixes carbon from atmospheric CO₂ and hydrogen from H₂O using light energy captured by chlorophyll."
        ),
        BioDailyHumourGag(
            id: "gag-ch06",
            chapterNumber: 6,
            title: "Breathing Is Not Respiration",
            dateline: "Marine Drive Jogging Track, Mumbai",
            setupSpeaker: .barnaby,
            setupSpeech: "Inhale, exhale—behold my world-class cellular respiration!",
            punchlineSpeaker: .clara,
            punchlineSpeech: "That is mechanical ventilation of your lungs using Boyle's Law, Barnaby. Cellular respiration is the chemical reaction inside your mitochondria.",
            biologyRuleTakeaway: "Breathing ventilates the alveoli via diaphragm/intercostal volume changes; respiration oxidises glucose inside cells."
        ),
        BioDailyHumourGag(
            id: "gag-ch07",
            chapterNumber: 7,
            title: "Why Red Blood Cells Evicted Their Own Nucleus",
            dateline: "Microscope Bench · ×400 Smear",
            setupSpeaker: .dash,
            setupSpeech: "Look at these red blood cells—they forgot their nuclei and got squashed in the middle like vadai!",
            punchlineSpeaker: .pip,
            punchlineSpeech: "Evicting the nucleus packs in 270 million haemoglobin molecules, and the biconcave dimple puts every oxygen molecule within 1 µm of the cell membrane.",
            biologyRuleTakeaway: "Red blood cells lack a nucleus to maximise haemoglobin space and have a biconcave shape for a high SA:V diffusion ratio."
        ),
        BioDailyHumourGag(
            id: "gag-ch08",
            chapterNumber: 8,
            title: "Why Your Biceps Refuses to Push",
            dateline: "Atelier Biomechanics Bench",
            setupSpeaker: .barnaby,
            setupSpeech: "I have instructed my biceps muscle to push my forearm back down so my triceps can take the afternoon off.",
            punchlineSpeaker: .bento,
            punchlineSpeech: "Actin-myosin fibres are ropes, not hydraulic rods, Barnaby—pulling a rope straightens it, pushing a rope just makes a loop. Every joint needs an antagonistic pair.",
            biologyRuleTakeaway: "Muscles only pull when they contract; bending the elbow contracts the biceps (triceps relaxes), straightening reverses them."
        ),
    ]

    static func gag(forChapter chapterNumber: Int) -> BioDailyHumourGag {
        if let match = allGags.first(where: { $0.chapterNumber == chapterNumber }) {
            return match
        }
        return allGags[abs(chapterNumber) % allGags.count]
    }
}

// MARK: - 1. Daily Atelier Humour & Ligne-Claire Comic Card (For Today Page)

struct DailyAtelierHumourComicCard: View {
    let activeChapterNumber: Int
    var onOpenChapter: ((Int) -> Void)? = nil

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @State private var selectedChapterOverride: Int? = nil
    @State private var showRulePunchline: Bool = true

    private var currentGag: BioDailyHumourGag {
        BioDailyHumourGag.gag(forChapter: selectedChapterOverride ?? activeChapterNumber)
    }

    var body: some View {
        let gag = currentGag
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack(alignment: .center, spacing: Spacing.xs) {
                    Text("OPENING DISPATCH · MALABAR HILL ATELIER · CH \(gag.chapterNumber)")
                        .font(.system(size: 10.5, weight: .bold, design: .monospaced))
                        .tracking(0.6)
                        .foregroundStyle(Color.kymaiaPrimaryStrong)
                    Spacer()
                    Button {
                        let currentIdx = BioDailyHumourGag.allGags.firstIndex(where: { $0.id == gag.id }) ?? 0
                        let nextIdx = (currentIdx + 1) % BioDailyHumourGag.allGags.count
                        selectedChapterOverride = BioDailyHumourGag.allGags[nextIdx].chapterNumber
                    } label: {
                        Label("Next Strip", systemImage: "arrow.triangle.2.circlepath")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                    .accessibilityIdentifier("today.comic.next")
                }

                Text(gag.title)
                    .font(.kymaiaTitle3)
                    .foregroundStyle(Color.kymaiaInk)

                // Two-Panel Ligne-Claire Diptych: side-by-side on iPad/macOS, stacked on compact iPhone
                if horizontalSizeClass == .compact {
                    VStack(spacing: Spacing.md) {
                        comicPanelBox(
                            panelNumber: 1,
                            kicker: "Panel 1 · The Tempting Shortcut",
                            character: gag.setupSpeaker,
                            speech: gag.setupSpeech,
                            chapterNumber: gag.chapterNumber,
                            isResolution: false
                        )
                        comicPanelBox(
                            panelNumber: 2,
                            kicker: "Panel 2 · Reality Strikes Back",
                            character: gag.punchlineSpeaker,
                            speech: gag.punchlineSpeech,
                            chapterNumber: gag.chapterNumber,
                            isResolution: true
                        )
                    }
                } else {
                    HStack(alignment: .top, spacing: Spacing.md) {
                        comicPanelBox(
                            panelNumber: 1,
                            kicker: "Panel 1 · The Tempting Shortcut",
                            character: gag.setupSpeaker,
                            speech: gag.setupSpeech,
                            chapterNumber: gag.chapterNumber,
                            isResolution: false
                        )
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)

                        comicPanelBox(
                            panelNumber: 2,
                            kicker: "Panel 2 · Reality Strikes Back",
                            character: gag.punchlineSpeaker,
                            speech: gag.punchlineSpeech,
                            chapterNumber: gag.chapterNumber,
                            isResolution: true
                        )
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                    }
                }

                HStack(spacing: Spacing.sm) {
                    Image(systemName: "pin.fill")
                        .foregroundStyle(Color.kymaiaSuccess)
                    Text(gag.biologyRuleTakeaway)
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaInk)
                    Spacer()
                    if let onOpenChapter {
                        Button("Open Ch \(gag.chapterNumber) →") {
                            onOpenChapter(gag.chapterNumber)
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                    }
                }
                .padding(Spacing.sm)
                .background(
                    RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                        .fill(Color.kymaiaSuccess.opacity(0.10))
                )
            }
        }
    }

    private func comicPanelBox(
        panelNumber: Int,
        kicker: String,
        character: BioComicCharacter,
        speech: String,
        chapterNumber: Int,
        isResolution: Bool
    ) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: Spacing.xs) {
                Text("\(panelNumber)")
                    .font(.kymaiaCaption.weight(.bold).monospacedDigit())
                    .foregroundStyle(Color.kymaiaSurface)
                    .frame(width: 20, height: 20)
                    .background(RoundedRectangle(cornerRadius: 4).fill(Color.kymaiaInk))
                Text(kicker)
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaInk)
                Spacer()
            }
            .padding(.horizontal, Spacing.sm)
            .padding(.vertical, 6)
            .background(Color.kymaiaWarning.opacity(0.14))

            BioComicPanelIllustrationView(
                character: character,
                chapterNumber: chapterNumber,
                isResolution: isResolution
            )
            .frame(height: 118)

            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(character.initials)
                        .font(.kymaiaCaption2.weight(.bold).monospacedDigit())
                        .foregroundStyle(Color.kymaiaInk)
                        .frame(width: 22, height: 22)
                        .background(Circle().fill(character.tint.opacity(0.20)))
                        .overlay(Circle().strokeBorder(character.tint, lineWidth: 1.2))
                    Text(character.displayName)
                        .font(.kymaiaCaption.weight(.bold))
                        .foregroundStyle(character.tint)
                    Text("· \(character.roleBadge)")
                        .font(.kymaiaCaption2)
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Spacer()
                }
                Text("\"\(speech)\"")
                    .font(.kymaiaBody)
                    .italic()
                    .foregroundStyle(Color.kymaiaInk)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(Spacing.sm)
            .background(Color.kymaiaSurface)
        }
        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                .strokeBorder(Color.kymaiaInk.opacity(0.65), lineWidth: 1.4)
        )
    }
}

// MARK: - 2. Full Chapter Ligne-Claire Comic Strip Card (For Living World Beats & Journal Reader)

struct BioComicStripCardView: View {
    let strip: LivingWorldComicStrip
    let chapterNumber: Int
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass

    var body: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack(spacing: Spacing.xs) {
                    JournalChip(
                        label: strip.roleLabel,
                        systemImage: "book.pages.fill",
                        tone: strip.role == "closer" ? .good : .accent
                    )
                    JournalChip(text: strip.dateline, tone: .neutral)
                    Spacer()
                }

                Text(strip.title)
                    .font(.kymaiaTitle3)
                    .foregroundStyle(Color.kymaiaInk)

                if horizontalSizeClass == .compact {
                    VStack(spacing: Spacing.sm) {
                        ForEach(strip.panels) { panel in
                            stripPanelView(panel)
                        }
                    }
                } else {
                    HStack(alignment: .top, spacing: Spacing.sm) {
                        ForEach(strip.panels) { panel in
                            stripPanelView(panel)
                                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                        }
                    }
                }
            }
        }
    }

    private func stripPanelView(_ panel: LivingWorldComicPanel) -> some View {
        let character = BioComicCharacter.resolve(panel.characterId.isEmpty ? panel.speakerName : panel.characterId)
        return VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top, spacing: 6) {
                Text("\(panel.panelNumber)")
                    .font(.kymaiaCaption2.weight(.bold).monospacedDigit())
                    .foregroundStyle(Color.kymaiaSurface)
                    .frame(width: 18, height: 18)
                    .background(RoundedRectangle(cornerRadius: 4).fill(Color.kymaiaInk))
                Text(panel.caption)
                    .font(.kymaiaCaption)
                    .foregroundStyle(Color.kymaiaInk)
                    .fixedSize(horizontal: false, vertical: true)
                Spacer(minLength: 0)
            }
            .padding(Spacing.xs)
            .background(Color.kymaiaWarning.opacity(0.14))

            BioComicPanelIllustrationView(
                character: character,
                chapterNumber: chapterNumber,
                isResolution: panel.panelNumber > 1
            )
            .frame(height: 104)

            if !panel.speech.isEmpty {
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 5) {
                        Text(character.initials)
                            .font(.kymaiaCaption2.weight(.bold).monospacedDigit())
                            .foregroundStyle(Color.kymaiaInk)
                            .frame(width: 20, height: 20)
                            .background(Circle().fill(character.tint.opacity(0.20)))
                            .overlay(Circle().strokeBorder(character.tint, lineWidth: 1.2))
                        Text(panel.speakerName)
                            .font(.kymaiaCaption2.weight(.bold))
                            .foregroundStyle(character.tint)
                        Spacer()
                        Text(panel.basisLabel)
                            .font(.kymaiaCaption2)
                            .foregroundStyle(Color.kymaiaMutedInk)
                    }
                    Text("\"\(panel.speech)\"")
                        .font(.kymaiaCaption)
                        .italic()
                        .foregroundStyle(Color.kymaiaInk)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(Spacing.xs)
                .background(Color.kymaiaSurface)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                .strokeBorder(Color.kymaiaInk.opacity(0.55), lineWidth: 1.2)
        )
    }
}

// MARK: - 3. Ligne-Claire Character + Biological Mechanism Panel Canvas

struct BioComicPanelIllustrationView: View {
    let character: BioComicCharacter
    let chapterNumber: Int
    let isResolution: Bool

    var body: some View {
        Canvas { ctx, size in
            let w = size.width
            let h = size.height
            let ink = Color.kymaiaInk
            let faint = Color.kymaiaHairline
            let blue = Color.kymaiaPrimary
            let green = Color.kymaiaSuccess
            let amber = Color.kymaiaWarning
            let red = Color.kymaiaError

            // 1. Risograph dot backdrop
            var gx: CGFloat = 12
            while gx < w {
                var gy: CGFloat = 10
                while gy < h * 0.78 {
                    ctx.fill(Path(ellipseIn: CGRect(x: gx, y: gy, width: 1.6, height: 1.6)), with: .color(faint))
                    gy += 14
                }
                gx += 14
            }

            // 2. Teak workbench floor band & 45° cross-hatching
            let floorY = h * 0.78
            let benchBand = CGRect(x: 0, y: floorY, width: w, height: h - floorY)
            ctx.fill(Path(benchBand), with: .color(amber.opacity(0.14)))
            var floor = Path()
            floor.move(to: CGPoint(x: w * 0.03, y: floorY))
            floor.addLine(to: CGPoint(x: w * 0.97, y: floorY))
            ctx.stroke(floor, with: .color(ink.opacity(0.75)), lineWidth: 1.8)

            var hx: CGFloat = w * 0.06
            while hx < w * 0.94 {
                var hatch = Path()
                hatch.move(to: CGPoint(x: hx, y: floorY))
                hatch.addLine(to: CGPoint(x: hx - 7, y: min(h - 2, floorY + 10)))
                ctx.stroke(hatch, with: .color(faint), lineWidth: 1)
                hx += 12
            }

            // 3. Left: Solid Ligne-Claire Character Bust & Signature Instrument (Option C Riso/Atelier)
            let charX = w * 0.20
            let headR: CGFloat = min(h * 0.165, 19.0)
            let headCenter = CGPoint(x: charX, y: floorY - headR * 2.55)
            let skinColor = Color(red: 0.95, green: 0.82, blue: 0.67)
            let outlineColor = Color(red: 0.09, green: 0.15, blue: 0.12)

            let coatColor: Color = {
                switch character {
                case .kym: return Color(red: 0.12, green: 0.37, blue: 0.27)
                case .barnaby: return Color(red: 0.60, green: 0.11, blue: 0.11)
                case .dash: return Color(red: 0.92, green: 0.35, blue: 0.05)
                case .pip: return Color(red: 0.01, green: 0.52, blue: 0.78)
                case .bento: return Color(red: 0.71, green: 0.33, blue: 0.04)
                case .clara: return Color(red: 0.18, green: 0.42, blue: 0.31)
                }
            }()

            // Solid shoulders / coat silhouette
            var coat = Path()
            coat.move(to: CGPoint(x: charX - headR * 1.38, y: floorY))
            coat.addQuadCurve(
                to: CGPoint(x: charX - headR * 0.98, y: floorY - headR * 1.75),
                control: CGPoint(x: charX - headR * 1.38, y: floorY - headR * 1.35)
            )
            coat.addLine(to: CGPoint(x: charX + headR * 0.98, y: floorY - headR * 1.75))
            coat.addQuadCurve(
                to: CGPoint(x: charX + headR * 1.38, y: floorY),
                control: CGPoint(x: charX + headR * 1.38, y: floorY - headR * 1.35)
            )
            coat.closeSubpath()
            ctx.fill(coat, with: .color(coatColor))
            ctx.stroke(coat, with: .color(outlineColor), lineWidth: 1.8)

            // Crisp white shirt collar V-cut
            var lapel = Path()
            lapel.move(to: CGPoint(x: charX - headR * 0.38, y: floorY - headR * 1.75))
            lapel.addLine(to: CGPoint(x: charX, y: floorY - headR * 0.95))
            lapel.addLine(to: CGPoint(x: charX + headR * 0.38, y: floorY - headR * 1.75))
            lapel.closeSubpath()
            ctx.fill(lapel, with: .color(Color(red: 0.99, green: 0.98, blue: 0.94)))
            ctx.stroke(lapel, with: .color(outlineColor), lineWidth: 1.4)

            // Warm skin head circle
            let headRect = CGRect(
                x: headCenter.x - headR,
                y: headCenter.y - headR,
                width: headR * 2,
                height: headR * 2
            )
            ctx.fill(Path(ellipseIn: headRect), with: .color(skinColor))
            ctx.stroke(Path(ellipseIn: headRect), with: .color(outlineColor), lineWidth: 1.8)

            // Character-specific hair, spectacles, facial hair, and signature instrument
            switch character {
            case .kym:
                // Ponytail + hair cap + round spectacles + 10x brass loupe
                let ponytail = CGRect(x: headCenter.x - headR * 1.42, y: headCenter.y - headR * 0.35, width: headR * 0.55, height: headR * 0.55)
                ctx.fill(Path(ellipseIn: ponytail), with: .color(outlineColor))
                var hair = Path()
                hair.move(to: CGPoint(x: headCenter.x - headR * 0.95, y: headCenter.y - headR * 0.25))
                hair.addQuadCurve(
                    to: CGPoint(x: headCenter.x + headR * 0.95, y: headCenter.y - headR * 0.25),
                    control: CGPoint(x: headCenter.x, y: headCenter.y - headR * 1.55)
                )
                ctx.fill(hair, with: .color(outlineColor))
                let leftLens = CGRect(x: headCenter.x - headR * 0.58, y: headCenter.y - headR * 0.25, width: headR * 0.48, height: headR * 0.48)
                let rightLens = CGRect(x: headCenter.x + headR * 0.10, y: headCenter.y - headR * 0.25, width: headR * 0.48, height: headR * 0.48)
                ctx.fill(Path(ellipseIn: leftLens), with: .color(.white.opacity(0.65)))
                ctx.fill(Path(ellipseIn: rightLens), with: .color(.white.opacity(0.65)))
                ctx.stroke(Path(ellipseIn: leftLens), with: .color(outlineColor), lineWidth: 1.4)
                ctx.stroke(Path(ellipseIn: rightLens), with: .color(outlineColor), lineWidth: 1.4)
                let loupe = CGRect(x: charX + headR * 1.15, y: floorY - headR * 2.55, width: headR * 0.95, height: headR * 0.95)
                ctx.fill(Path(ellipseIn: loupe), with: .color(blue.opacity(0.25)))
                ctx.stroke(Path(ellipseIn: loupe), with: .color(amber), lineWidth: 2.2)
            case .barnaby:
                // Pince-nez + walrus moustache + brass coat buttons + wooden pointer
                let leftLens = CGRect(x: headCenter.x - headR * 0.58, y: headCenter.y - headR * 0.25, width: headR * 0.46, height: headR * 0.46)
                let rightLens = CGRect(x: headCenter.x + headR * 0.12, y: headCenter.y - headR * 0.25, width: headR * 0.46, height: headR * 0.46)
                ctx.fill(Path(ellipseIn: leftLens), with: .color(.white.opacity(0.75)))
                ctx.fill(Path(ellipseIn: rightLens), with: .color(.white.opacity(0.75)))
                ctx.stroke(Path(ellipseIn: leftLens), with: .color(outlineColor), lineWidth: 1.4)
                ctx.stroke(Path(ellipseIn: rightLens), with: .color(outlineColor), lineWidth: 1.4)
                var moustache = Path()
                moustache.move(to: CGPoint(x: headCenter.x - headR * 0.55, y: headCenter.y + headR * 0.35))
                moustache.addQuadCurve(
                    to: CGPoint(x: headCenter.x + headR * 0.55, y: headCenter.y + headR * 0.35),
                    control: CGPoint(x: headCenter.x, y: headCenter.y + headR * 0.05)
                )
                ctx.stroke(moustache, with: .color(outlineColor), lineWidth: 2.6)
                var pointer = Path()
                pointer.move(to: CGPoint(x: charX + headR * 0.95, y: floorY - headR * 0.85))
                pointer.addLine(to: CGPoint(x: charX + headR * 2.15, y: floorY - headR * 2.15))
                ctx.stroke(pointer, with: .color(amber), lineWidth: 2.6)
            case .dash:
                // Wind-swept spiky hair + lightning stripe + stopwatch
                var spikes = Path()
                spikes.move(to: CGPoint(x: headCenter.x - headR * 0.85, y: headCenter.y - headR * 0.45))
                spikes.addLine(to: CGPoint(x: headCenter.x - headR * 0.35, y: headCenter.y - headR * 1.45))
                spikes.addLine(to: CGPoint(x: headCenter.x + headR * 0.05, y: headCenter.y - headR * 0.85))
                spikes.addLine(to: CGPoint(x: headCenter.x + headR * 0.55, y: headCenter.y - headR * 1.40))
                spikes.addLine(to: CGPoint(x: headCenter.x + headR * 0.85, y: headCenter.y - headR * 0.45))
                spikes.closeSubpath()
                ctx.fill(spikes, with: .color(outlineColor))
                var lever = Path()
                lever.move(to: CGPoint(x: charX + headR * 1.25, y: floorY))
                lever.addLine(to: CGPoint(x: charX + headR * 1.85, y: floorY - headR * 2.05))
                ctx.stroke(lever, with: .color(red), lineWidth: 2.5)
                let knob = CGRect(x: charX + headR * 1.65, y: floorY - headR * 2.30, width: 8, height: 8)
                ctx.fill(Path(ellipseIn: knob), with: .color(red))
            case .pip:
                // 1 µm diving reticle bubble + pith helmet
                let bubble = CGRect(x: headCenter.x - headR * 1.65, y: headCenter.y - headR * 1.45, width: headR * 3.3, height: headR * 3.3)
                ctx.stroke(Path(ellipseIn: bubble), with: .color(green.opacity(0.65)), style: StrokeStyle(lineWidth: 1.5, dash: [4, 3]))
                var helmet = Path()
                helmet.move(to: CGPoint(x: headCenter.x - headR * 1.05, y: headCenter.y - headR * 0.35))
                helmet.addQuadCurve(
                    to: CGPoint(x: headCenter.x + headR * 1.05, y: headCenter.y - headR * 0.35),
                    control: CGPoint(x: headCenter.x, y: headCenter.y - headR * 1.45)
                )
                helmet.closeSubpath()
                ctx.fill(helmet, with: .color(amber))
                ctx.stroke(helmet, with: .color(outlineColor), lineWidth: 1.5)
            case .bento:
                // Square spectacles + craftsman apron + balance beam
                let sqL = CGRect(x: headCenter.x - headR * 0.58, y: headCenter.y - headR * 0.22, width: headR * 0.48, height: headR * 0.36)
                let sqR = CGRect(x: headCenter.x + headR * 0.10, y: headCenter.y - headR * 0.22, width: headR * 0.48, height: headR * 0.36)
                ctx.fill(Path(sqL), with: .color(.white.opacity(0.75)))
                ctx.fill(Path(sqR), with: .color(.white.opacity(0.75)))
                ctx.stroke(Path(sqL), with: .color(outlineColor), lineWidth: 1.4)
                ctx.stroke(Path(sqR), with: .color(outlineColor), lineWidth: 1.4)
                var beam = Path()
                beam.move(to: CGPoint(x: charX + headR * 1.05, y: floorY - headR * 1.85))
                beam.addLine(to: CGPoint(x: charX + headR * 2.15, y: floorY - headR * 1.85))
                beam.move(to: CGPoint(x: charX + headR * 1.60, y: floorY - headR * 2.10))
                beam.addLine(to: CGPoint(x: charX + headR * 1.60, y: floorY - headR * 0.50))
                ctx.stroke(beam, with: .color(amber), lineWidth: 2.0)
            case .clara:
                // Botanical sun hat + field notebook
                var brim = Path()
                brim.move(to: CGPoint(x: headCenter.x - headR * 1.25, y: headCenter.y - headR * 0.45))
                brim.addQuadCurve(
                    to: CGPoint(x: headCenter.x + headR * 1.25, y: headCenter.y - headR * 0.45),
                    control: CGPoint(x: headCenter.x, y: headCenter.y - headR * 1.20)
                )
                ctx.fill(brim, with: .color(amber))
                ctx.stroke(brim, with: .color(outlineColor), lineWidth: 1.6)
            }

            // Eyes & smile
            ctx.fill(
                Path(ellipseIn: CGRect(x: headCenter.x - headR * 0.38, y: headCenter.y - 2, width: 3.0, height: 3.0)),
                with: .color(outlineColor)
            )
            ctx.fill(
                Path(ellipseIn: CGRect(x: headCenter.x + headR * 0.20, y: headCenter.y - 2, width: 3.0, height: 3.0)),
                with: .color(outlineColor)
            )
            var mouth = Path()
            mouth.move(to: CGPoint(x: headCenter.x - 4, y: headCenter.y + headR * 0.34))
            mouth.addQuadCurve(
                to: CGPoint(x: headCenter.x + 4, y: headCenter.y + headR * 0.34),
                control: CGPoint(x: headCenter.x, y: headCenter.y + headR * (isResolution ? 0.58 : 0.22))
            )
            ctx.stroke(mouth, with: .color(outlineColor), lineWidth: 1.4)

            // 4. Right: Framed Herbarium Specimen Card on the Workbench + Biological Mechanism
            let cardRect = CGRect(
                x: w * 0.43,
                y: h * 0.10,
                width: w * 0.51,
                height: floorY - h * 0.10
            )
            ctx.fill(Path(roundedRect: cardRect, cornerRadius: 8), with: .color(Color.kymaiaSurface))
            ctx.stroke(
                Path(roundedRect: cardRect, cornerRadius: 8),
                with: .color(isResolution ? green.opacity(0.75) : amber.opacity(0.65)),
                lineWidth: 1.6
            )
            let innerRect = cardRect.insetBy(dx: 3.5, dy: 3.5)
            ctx.stroke(
                Path(roundedRect: innerRect, cornerRadius: 5.5),
                with: .color(faint),
                style: StrokeStyle(lineWidth: 1.0, dash: [3, 2])
            )

            let mechCenter = CGPoint(x: cardRect.midX, y: cardRect.midY)
            let mechR = min(cardRect.width * 0.36, cardRect.height * 0.42)
            BioChapterDiagramArtist.drawChapterMotif(
                in: &ctx,
                center: mechCenter,
                radius: mechR,
                chapterNumber: chapterNumber,
                highlightResolution: isResolution,
                ink: ink,
                blue: blue,
                amber: amber,
                red: red,
                green: green
            )
        }
        .background(Color.kymaiaElevatedSurface.opacity(0.55))
    }
}

// MARK: - 4. 3-Panel Visual Triptych for PhenomenonMechanismBridgeCard

struct BioMechanismVisualTriptychView: View {
    let chapterNumber: Int
    let selectedChoice: String?

    var body: some View {
        ViewThatFits(in: .horizontal) {
            HStack(spacing: Spacing.sm) {
                triptychTile(
                    stepLabel: "1. Everyday Clue",
                    caption: "Macro observation",
                    mode: .macroClue
                )
                triptychTile(
                    stepLabel: "2. Inside the Cell",
                    caption: "1 µm cutaway",
                    mode: .cellCutaway
                )
                triptychTile(
                    stepLabel: "3. Live Rule Curve",
                    caption: selectedChoice ?? "Tap 'What if?' below",
                    mode: .ruleCurve
                )
            }
            VStack(spacing: Spacing.xs) {
                HStack(spacing: Spacing.xs) {
                    triptychTile(stepLabel: "1. Everyday Clue", caption: "Macro clue", mode: .macroClue)
                    triptychTile(stepLabel: "2. Inside the Cell", caption: "1 µm view", mode: .cellCutaway)
                }
                triptychTile(stepLabel: "3. Live Rule Curve", caption: selectedChoice ?? "Tap 'What if?' below", mode: .ruleCurve)
            }
        }
    }

    private enum TriptychMode {
        case macroClue
        case cellCutaway
        case ruleCurve
    }

    private func triptychTile(stepLabel: String, caption: String, mode: TriptychMode) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(stepLabel)
                    .font(.kymaiaCaption2.weight(.bold))
                    .foregroundStyle(Color.kymaiaPrimaryStrong)
                Spacer()
                Text(caption)
                    .font(.kymaiaCaption2)
                    .foregroundStyle(Color.kymaiaMutedInk)
                    .lineLimit(1)
            }
            Canvas { ctx, size in
                let w = size.width
                let h = size.height
                let c = CGPoint(x: w * 0.5, y: h * 0.52)
                let r = min(w, h) * 0.34
                switch mode {
                case .macroClue:
                    BioChapterDiagramArtist.drawChapterMotif(
                        in: &ctx,
                        center: c,
                        radius: r,
                        chapterNumber: chapterNumber,
                        highlightResolution: false,
                        ink: .kymaiaInk,
                        blue: .kymaiaPrimary,
                        amber: .kymaiaWarning,
                        red: .kymaiaError,
                        green: .kymaiaSuccess
                    )
                case .cellCutaway:
                    BioChapterDiagramArtist.drawChapterMotif(
                        in: &ctx,
                        center: c,
                        radius: r,
                        chapterNumber: chapterNumber,
                        highlightResolution: true,
                        ink: .kymaiaInk,
                        blue: .kymaiaPrimary,
                        amber: .kymaiaWarning,
                        red: .kymaiaError,
                        green: .kymaiaSuccess
                    )
                case .ruleCurve:
                    // Axes
                    var axes = Path()
                    axes.move(to: CGPoint(x: w * 0.14, y: h * 0.16))
                    axes.addLine(to: CGPoint(x: w * 0.14, y: h * 0.84))
                    axes.addLine(to: CGPoint(x: w * 0.88, y: h * 0.84))
                    ctx.stroke(axes, with: .color(.kymaiaInk.opacity(0.6)), lineWidth: 1.5)

                    // Baseline dashed curve
                    var base = Path()
                    base.move(to: CGPoint(x: w * 0.16, y: h * 0.72))
                    base.addQuadCurve(to: CGPoint(x: w * 0.84, y: h * 0.34), control: CGPoint(x: w * 0.48, y: h * 0.46))
                    ctx.stroke(base, with: .color(.kymaiaMutedInk.opacity(0.45)), style: StrokeStyle(lineWidth: 1.5, dash: [4, 3]))

                    // Active perturbed curve
                    var active = Path()
                    let strokeCol: Color
                    if selectedChoice == "Goes down" {
                        strokeCol = .kymaiaError
                        active.move(to: CGPoint(x: w * 0.16, y: h * 0.32))
                        active.addQuadCurve(to: CGPoint(x: w * 0.84, y: h * 0.78), control: CGPoint(x: w * 0.48, y: h * 0.68))
                    } else if selectedChoice == "Balances out" {
                        strokeCol = .kymaiaWarning
                        active.move(to: CGPoint(x: w * 0.16, y: h * 0.74))
                        active.addCurve(
                            to: CGPoint(x: w * 0.84, y: h * 0.48),
                            control1: CGPoint(x: w * 0.36, y: h * 0.24),
                            control2: CGPoint(x: w * 0.62, y: h * 0.48)
                        )
                    } else {
                        strokeCol = .kymaiaSuccess
                        active.move(to: CGPoint(x: w * 0.16, y: h * 0.78))
                        active.addQuadCurve(to: CGPoint(x: w * 0.84, y: h * 0.18), control: CGPoint(x: w * 0.46, y: h * 0.30))
                    }
                    ctx.stroke(active, with: .color(strokeCol), style: StrokeStyle(lineWidth: 2.6, lineCap: .round))
                }
            }
            .frame(height: 86)
            .background(
                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                    .fill(Color.kymaiaSurface)
            )
            .overlay(
                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                    .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
            )
        }
        .padding(Spacing.xs)
        .frame(maxWidth: .infinity)
        .background(
            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                .fill(Color.kymaiaElevatedSurface)
        )
    }
}

// MARK: - 5. Inline Chapter Figure & Visual Plate Card (For Living World & School Units)

struct BioChapterVisualPlateCard: View {
    let chapterNumber: Int
    let figureTitle: String
    let caption: String
    var widgetId: String? = nil
    var onOpen3DStage: (() -> Void)? = nil

    var body: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack(spacing: Spacing.xs) {
                    JournalChip(
                        label: "Dual-Coded Figure · Ch \(chapterNumber)",
                        systemImage: "eye.circle.fill",
                        tone: .accent
                    )
                    Text(figureTitle)
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaInk)
                    Spacer()
                    if let onOpen3DStage {
                        Button {
                            onOpen3DStage()
                        } label: {
                            Label("Interact in 3D", systemImage: "cube.transparent.fill")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                    }
                }

                BioSpecimenPlateCanvas(
                    chapterNumber: chapterNumber,
                    figureId: widgetId ?? figureTitle,
                    callouts: []
                )
                .frame(height: 156)
                .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                        .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                )

                Text(caption)
                    .font(.kymaiaCaption)
                    .foregroundStyle(Color.kymaiaMutedInk)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}

// MARK: - 6. Detailed Anatomical & Cellular Specimen Plate Canvas (Replaces Empty Dashed Box)

struct BioSpecimenPlateCanvas: View {
    let chapterNumber: Int
    let figureId: String
    let callouts: [DiagramCalloutPin]

    var body: some View {
        ZStack {
            Canvas { ctx, size in
                let w = size.width
                let h = size.height
                let center = CGPoint(x: w * 0.5, y: h * 0.5)
                let radius = min(w * 0.28, h * 0.44)
                let ink = Color.kymaiaInk
                let blue = Color.kymaiaPrimary
                let amber = Color.kymaiaWarning
                let red = Color.kymaiaError
                let green = Color.kymaiaSuccess

                // Herbarium copperplate double frame + subtle laboratory grid
                let outerFrame = CGRect(x: 6, y: 6, width: w - 12, height: h - 12)
                let innerFrame = outerFrame.insetBy(dx: 4, dy: 4)
                ctx.stroke(Path(roundedRect: outerFrame, cornerRadius: 8), with: .color(amber.opacity(0.55)), lineWidth: 1.4)
                ctx.stroke(Path(roundedRect: innerFrame, cornerRadius: 6), with: .color(amber.opacity(0.28)), lineWidth: 0.9)

                var gx: CGFloat = 18
                while gx < w - 14 {
                    var gy: CGFloat = 18
                    while gy < h - 14 {
                        ctx.fill(
                            Path(ellipseIn: CGRect(x: gx, y: gy, width: 1.5, height: 1.5)),
                            with: .color(Color.kymaiaHairline)
                        )
                        gy += 18
                    }
                    gx += 18
                }

                // Left & right comparative specimen medallions so wide iPad plates feel richly populated
                let leftCenter = CGPoint(x: w * 0.22, y: h * 0.52)
                let rightCenter = CGPoint(x: w * 0.78, y: h * 0.52)
                let sideRadius = min(w * 0.14, h * 0.32)

                let leftRing = CGRect(x: leftCenter.x - sideRadius, y: leftCenter.y - sideRadius, width: sideRadius * 2, height: sideRadius * 2)
                ctx.fill(Path(ellipseIn: leftRing), with: .color(amber.opacity(0.08)))
                ctx.stroke(Path(ellipseIn: leftRing), with: .color(amber.opacity(0.45)), style: StrokeStyle(lineWidth: 1.2, dash: [4, 3]))

                BioChapterDiagramArtist.drawChapterMotif(
                    in: &ctx,
                    center: leftCenter,
                    radius: sideRadius * 0.85,
                    chapterNumber: chapterNumber,
                    highlightResolution: false,
                    ink: ink,
                    blue: blue,
                    amber: amber,
                    red: red,
                    green: green
                )

                let rightRing = CGRect(x: rightCenter.x - sideRadius, y: rightCenter.y - sideRadius, width: sideRadius * 2, height: sideRadius * 2)
                ctx.fill(Path(ellipseIn: rightRing), with: .color(green.opacity(0.09)))
                ctx.stroke(Path(ellipseIn: rightRing), with: .color(green.opacity(0.55)), lineWidth: 1.3)

                BioChapterDiagramArtist.drawChapterMotif(
                    in: &ctx,
                    center: rightCenter,
                    radius: sideRadius * 0.85,
                    chapterNumber: max(0, (chapterNumber + 1) % 16),
                    highlightResolution: true,
                    ink: ink,
                    blue: blue,
                    amber: amber,
                    red: red,
                    green: green
                )

                // Connecting flow arrows to central specimen
                var leftArrow = Path()
                leftArrow.move(to: CGPoint(x: leftCenter.x + sideRadius + 6, y: center.y))
                leftArrow.addLine(to: CGPoint(x: center.x - radius - 10, y: center.y))
                ctx.stroke(leftArrow, with: .color(amber.opacity(0.65)), style: StrokeStyle(lineWidth: 1.5, dash: [4, 3]))

                var rightArrow = Path()
                rightArrow.move(to: CGPoint(x: center.x + radius + 10, y: center.y))
                rightArrow.addLine(to: CGPoint(x: rightCenter.x - sideRadius - 6, y: center.y))
                ctx.stroke(rightArrow, with: .color(green.opacity(0.65)), style: StrokeStyle(lineWidth: 1.5, dash: [4, 3]))

                // Central primary specimen plate
                let centerRing = CGRect(x: center.x - radius * 1.12, y: center.y - radius * 1.05, width: radius * 2.24, height: radius * 2.10)
                ctx.fill(Path(roundedRect: centerRing, cornerRadius: 12), with: .color(blue.opacity(0.06)))
                ctx.stroke(Path(roundedRect: centerRing, cornerRadius: 12), with: .color(blue.opacity(0.45)), lineWidth: 1.4)

                BioChapterDiagramArtist.drawChapterMotif(
                    in: &ctx,
                    center: center,
                    radius: radius,
                    chapterNumber: chapterNumber,
                    highlightResolution: true,
                    ink: ink,
                    blue: blue,
                    amber: amber,
                    red: red,
                    green: green
                )

                // Draw leader lines from anatomical loci to numbered callout pins
                for pin in callouts {
                    let pt = CGPoint(x: pin.x * w, y: pin.y * h)
                    let anchor = CGPoint(
                        x: center.x + (pt.x - center.x) * 0.38,
                        y: center.y + (pt.y - center.y) * 0.38
                    )
                    var leader = Path()
                    leader.move(to: anchor)
                    leader.addLine(to: pt)
                    ctx.stroke(leader, with: .color(blue.opacity(0.65)), style: StrokeStyle(lineWidth: 1.4, dash: [4, 3]))
                    ctx.fill(
                        Path(ellipseIn: CGRect(x: anchor.x - 3, y: anchor.y - 3, width: 6, height: 6)),
                        with: .color(red)
                    )
                }
            }

            VStack {
                HStack {
                    Text("PLATE CH.\(chapterNumber) · COMPARATIVE SPECIMEN")
                        .font(.system(size: 9.5, weight: .bold, design: .monospaced))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Spacer()
                    Text("SCALE · 10 µm — 1 mm")
                        .font(.system(size: 9.5, weight: .bold, design: .monospaced))
                        .foregroundStyle(Color.kymaiaPrimaryStrong)
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                Spacer()
            }
        }
        .background(Color.kymaiaSurface)
    }
}

// MARK: - 7. Shared Vector Biological Motif Renderer Across All 16 Chapters

enum BioChapterDiagramArtist {
    static func drawChapterMotif(
        in ctx: inout GraphicsContext,
        center: CGPoint,
        radius r: CGFloat,
        chapterNumber: Int,
        highlightResolution: Bool,
        ink: Color,
        blue: Color,
        amber: Color,
        red: Color,
        green: Color
    ) {
        let cx = center.x
        let cy = center.y

        switch chapterNumber % 16 {
        case 0:
            // Redi's 3 Jars & Swan-Neck Flask
            for (idx, offset) in [(-r * 1.05, "Open"), (CGFloat(0), "Sealed"), (r * 1.05, "Gauze")].enumerated() {
                let jx = cx + offset.0
                let jar = CGRect(x: jx - r * 0.36, y: cy - r * 0.45, width: r * 0.72, height: r * 0.95)
                ctx.fill(Path(roundedRect: jar, cornerRadius: 5), with: .color(blue.opacity(0.10)))
                ctx.stroke(Path(roundedRect: jar, cornerRadius: 5), with: .color(ink), lineWidth: 1.6)
                let meat = CGRect(x: jx - r * 0.24, y: jar.maxY - r * 0.24, width: r * 0.48, height: r * 0.18)
                ctx.fill(Path(roundedRect: meat, cornerRadius: 3), with: .color(red.opacity(0.65)))
                if idx == 1 {
                    let lid = CGRect(x: jar.minX - 2, y: jar.minY - 5, width: jar.width + 4, height: 6)
                    ctx.fill(Path(roundedRect: lid, cornerRadius: 2), with: .color(amber))
                } else if idx == 2 {
                    var gauze = Path()
                    gauze.move(to: CGPoint(x: jar.minX - 3, y: jar.minY))
                    gauze.addLine(to: CGPoint(x: jar.maxX + 3, y: jar.minY))
                    ctx.stroke(gauze, with: .color(green), style: StrokeStyle(lineWidth: 2.5, dash: [3, 2]))
                }
            }

        case 1:
            // Candle Flame (1,000 °C) vs Germinating Seed Cell (28 °C ATP Rotor)
            let flameX = cx - r * 0.75
            var flame = Path()
            flame.move(to: CGPoint(x: flameX, y: cy - r * 0.65))
            flame.addQuadCurve(to: CGPoint(x: flameX, y: cy + r * 0.45), control: CGPoint(x: flameX - r * 0.55, y: cy))
            flame.addQuadCurve(to: CGPoint(x: flameX, y: cy - r * 0.65), control: CGPoint(x: flameX + r * 0.55, y: cy))
            ctx.fill(flame, with: .color(red.opacity(0.30)))
            ctx.stroke(flame, with: .color(red), lineWidth: 1.8)

            let seedX = cx + r * 0.68
            let seedRect = CGRect(x: seedX - r * 0.65, y: cy - r * 0.48, width: r * 1.3, height: r * 0.96)
            ctx.fill(Path(ellipseIn: seedRect), with: .color(green.opacity(0.22)))
            ctx.stroke(Path(ellipseIn: seedRect), with: .color(green), lineWidth: 2)
            let rotor = CGRect(x: seedX - r * 0.25, y: cy - r * 0.25, width: r * 0.5, height: r * 0.5)
            ctx.fill(Path(ellipseIn: rotor), with: .color(amber))
            ctx.stroke(Path(ellipseIn: rotor), with: .color(ink), lineWidth: 1.5)

        case 2:
            // Plant / Animal Cell Ultrastructure & SA:V Cubes
            let outerWall = CGRect(x: cx - r * 1.15, y: cy - r * 0.72, width: r * 2.3, height: r * 1.44)
            ctx.fill(Path(roundedRect: outerWall, cornerRadius: 12), with: .color(green.opacity(0.16)))
            ctx.stroke(Path(roundedRect: outerWall, cornerRadius: 12), with: .color(green), lineWidth: 2.2)
            let vacuole = CGRect(x: cx - r * 0.35, y: cy - r * 0.42, width: r * 0.95, height: r * 0.84)
            ctx.fill(Path(roundedRect: vacuole, cornerRadius: 8), with: .color(blue.opacity(0.18)))
            ctx.stroke(Path(roundedRect: vacuole, cornerRadius: 8), with: .color(blue), lineWidth: 1.5)
            let nucleus = CGRect(x: cx - r * 0.92, y: cy - r * 0.32, width: r * 0.46, height: r * 0.46)
            ctx.fill(Path(ellipseIn: nucleus), with: .color(amber))
            ctx.stroke(Path(ellipseIn: nucleus), with: .color(ink), lineWidth: 1.6)

        case 3:
            // Osmosis & Partially Permeable Membrane
            var mem = Path()
            mem.move(to: CGPoint(x: cx, y: cy - r * 0.82))
            mem.addLine(to: CGPoint(x: cx, y: cy + r * 0.82))
            ctx.stroke(mem, with: .color(amber), style: StrokeStyle(lineWidth: 2.6, dash: [5, 4]))
            for dy in [-r * 0.45, CGFloat(0), r * 0.45] {
                let wDot = CGRect(x: cx - r * 0.68, y: cy + dy - 5, width: 10, height: 10)
                ctx.fill(Path(ellipseIn: wDot), with: .color(blue))
                let sDot = CGRect(x: cx + r * 0.48, y: cy + dy - 8, width: 16, height: 16)
                ctx.fill(Path(ellipseIn: sDot), with: .color(red.opacity(0.75)))
            }
            var flux = Path()
            flux.move(to: CGPoint(x: cx - r * 0.42, y: cy))
            flux.addLine(to: CGPoint(x: cx + r * 0.28, y: cy))
            ctx.stroke(flux, with: .color(blue), style: StrokeStyle(lineWidth: 2.6, lineCap: .round))

        case 4:
            // Enzyme Active Site Lock & Key + Denaturation
            let enz = CGRect(x: cx - r * 0.95, y: cy - r * 0.62, width: r * 1.25, height: r * 1.24)
            ctx.fill(Path(ellipseIn: enz), with: .color(amber.opacity(0.28)))
            ctx.stroke(Path(ellipseIn: enz), with: .color(ink), lineWidth: 1.8)
            let sub = CGRect(x: cx + r * 0.08, y: cy - r * 0.34, width: r * 0.68, height: r * 0.68)
            ctx.fill(Path(roundedRect: sub, cornerRadius: 6), with: .color(highlightResolution ? green : blue))
            ctx.stroke(Path(roundedRect: sub, cornerRadius: 6), with: .color(ink), lineWidth: 1.6)

        case 5:
            // Chloroplast Grana Stacks & Leaf Layers
            let chlo = CGRect(x: cx - r * 1.15, y: cy - r * 0.68, width: r * 2.3, height: r * 1.36)
            ctx.fill(Path(ellipseIn: chlo), with: .color(green.opacity(0.18)))
            ctx.stroke(Path(ellipseIn: chlo), with: .color(green), lineWidth: 2)
            for gx in [-r * 0.55, CGFloat(0), r * 0.55] {
                for gy in [-r * 0.28, CGFloat(0), r * 0.28] {
                    let disc = CGRect(x: cx + gx - r * 0.22, y: cy + gy - r * 0.09, width: r * 0.44, height: r * 0.18)
                    ctx.fill(Path(roundedRect: disc, cornerRadius: 4), with: .color(green.opacity(0.75)))
                    ctx.stroke(Path(roundedRect: disc, cornerRadius: 4), with: .color(ink), lineWidth: 1.1)
                }
            }

        case 6:
            // Alveolus Sac & Surrounding Capillary Gas Exchange
            let alv = CGRect(x: cx - r * 0.72, y: cy - r * 0.72, width: r * 1.44, height: r * 1.44)
            ctx.fill(Path(ellipseIn: alv), with: .color(blue.opacity(0.14)))
            ctx.stroke(Path(ellipseIn: alv), with: .color(ink), lineWidth: 1.8)
            var cap = Path()
            cap.addArc(center: center, radius: r * 0.94, startAngle: .degrees(20), endAngle: .degrees(340), clockwise: false)
            ctx.stroke(cap, with: .color(red), style: StrokeStyle(lineWidth: 5, lineCap: .round))

        case 7:
            // Red Blood Cell Biconcave Disc & Vascular Xylem/Phloem
            let rbc = CGRect(x: cx - r * 0.95, y: cy - r * 0.55, width: r * 1.9, height: r * 1.1)
            ctx.fill(Path(ellipseIn: rbc), with: .color(red.opacity(0.32)))
            ctx.stroke(Path(ellipseIn: rbc), with: .color(red), lineWidth: 2.2)
            let dimple = CGRect(x: cx - r * 0.42, y: cy - r * 0.22, width: r * 0.84, height: r * 0.44)
            ctx.fill(Path(ellipseIn: dimple), with: .color(red.opacity(0.15)))
            ctx.stroke(Path(ellipseIn: dimple), with: .color(ink.opacity(0.5)), lineWidth: 1.2)

        case 8:
            // Antagonistic Biceps / Triceps Elbow Third-Class Lever
            let pivot = CGPoint(x: cx - r * 0.65, y: cy + r * 0.25)
            var humerus = Path()
            humerus.move(to: CGPoint(x: pivot.x - r * 0.15, y: cy - r * 0.75))
            humerus.addLine(to: pivot)
            var radiusBone = Path()
            radiusBone.move(to: pivot)
            radiusBone.addLine(to: CGPoint(x: cx + r * 0.95, y: pivot.y))
            ctx.stroke(humerus, with: .color(ink), style: StrokeStyle(lineWidth: 4, lineCap: .round))
            ctx.stroke(radiusBone, with: .color(ink), style: StrokeStyle(lineWidth: 4, lineCap: .round))
            // Biceps pull arrow
            var biceps = Path()
            biceps.move(to: CGPoint(x: pivot.x + r * 0.28, y: pivot.y))
            biceps.addLine(to: CGPoint(x: pivot.x + r * 0.08, y: cy - r * 0.55))
            ctx.stroke(biceps, with: .color(red), style: StrokeStyle(lineWidth: 3, lineCap: .round))
            // Hand load
            let load = CGRect(x: cx + r * 0.72, y: pivot.y - r * 0.36, width: r * 0.36, height: r * 0.36)
            ctx.fill(Path(ellipseIn: load), with: .color(blue))
            ctx.fill(Path(ellipseIn: CGRect(x: pivot.x - 5, y: pivot.y - 5, width: 10, height: 10)), with: .color(amber))

        case 9:
            // Eye Lens Refraction & Neuron Synapse
            let eye = CGRect(x: cx - r * 0.9, y: cy - r * 0.72, width: r * 1.8, height: r * 1.44)
            ctx.fill(Path(ellipseIn: eye), with: .color(blue.opacity(0.12)))
            ctx.stroke(Path(ellipseIn: eye), with: .color(ink), lineWidth: 1.8)
            let lens = CGRect(x: cx - r * 0.58, y: cy - r * 0.42, width: r * 0.28, height: r * 0.84)
            ctx.fill(Path(ellipseIn: lens), with: .color(amber.opacity(0.45)))
            ctx.stroke(Path(ellipseIn: lens), with: .color(blue), lineWidth: 1.8)
            var ray1 = Path()
            ray1.move(to: CGPoint(x: cx - r * 1.15, y: cy - r * 0.28))
            ray1.addLine(to: CGPoint(x: cx - r * 0.44, y: cy - r * 0.28))
            ray1.addLine(to: CGPoint(x: cx + r * 0.86, y: cy))
            ctx.stroke(ray1, with: .color(red), lineWidth: 1.8)

        case 10:
            // Kidney Nephron Glomerulus & Loop of Henle
            let bowman = CGRect(x: cx - r * 0.95, y: cy - r * 0.65, width: r * 0.65, height: r * 0.65)
            ctx.fill(Path(ellipseIn: bowman), with: .color(red.opacity(0.24)))
            ctx.stroke(Path(ellipseIn: bowman), with: .color(red), lineWidth: 2)
            var tubule = Path()
            tubule.move(to: CGPoint(x: bowman.maxX, y: bowman.midY))
            tubule.addLine(to: CGPoint(x: cx + r * 0.25, y: bowman.midY))
            tubule.addLine(to: CGPoint(x: cx + r * 0.25, y: cy + r * 0.68))
            tubule.addLine(to: CGPoint(x: cx + r * 0.55, y: cy + r * 0.68))
            tubule.addLine(to: CGPoint(x: cx + r * 0.55, y: cy - r * 0.55))
            ctx.stroke(tubule, with: .color(amber), style: StrokeStyle(lineWidth: 2.6, lineJoin: .round))

        case 11, 12:
            // DNA Double Helix & Chromosome Spindle
            var s1 = Path()
            var s2 = Path()
            let startX = cx - r * 1.05
            let span = r * 2.1
            s1.move(to: CGPoint(x: startX, y: cy - r * 0.42))
            s1.addCurve(
                to: CGPoint(x: startX + span, y: cy - r * 0.42),
                control1: CGPoint(x: cx - r * 0.3, y: cy + r * 0.75),
                control2: CGPoint(x: cx + r * 0.3, y: cy - r * 0.75)
            )
            s2.move(to: CGPoint(x: startX, y: cy + r * 0.42))
            s2.addCurve(
                to: CGPoint(x: startX + span, y: cy + r * 0.42),
                control1: CGPoint(x: cx - r * 0.3, y: cy - r * 0.75),
                control2: CGPoint(x: cx + r * 0.3, y: cy + r * 0.75)
            )
            ctx.stroke(s1, with: .color(blue), style: StrokeStyle(lineWidth: 2.6, lineCap: .round))
            ctx.stroke(s2, with: .color(red), style: StrokeStyle(lineWidth: 2.6, lineCap: .round))

        case 13:
            // Mendel 2×2 Punnett Grid (3:1 Ratio)
            let gridRect = CGRect(x: cx - r * 0.75, y: cy - r * 0.68, width: r * 1.5, height: r * 1.36)
            ctx.fill(Path(roundedRect: gridRect, cornerRadius: 6), with: .color(green.opacity(0.16)))
            ctx.stroke(Path(roundedRect: gridRect, cornerRadius: 6), with: .color(ink), lineWidth: 1.8)
            let q4 = CGRect(x: cx, y: cy, width: r * 0.75, height: r * 0.68)
            ctx.fill(Path(roundedRect: q4, cornerRadius: 4), with: .color(amber.opacity(0.45)))
            var mid = Path()
            mid.move(to: CGPoint(x: cx, y: gridRect.minY))
            mid.addLine(to: CGPoint(x: cx, y: gridRect.maxY))
            mid.move(to: CGPoint(x: gridRect.minX, y: cy))
            mid.addLine(to: CGPoint(x: gridRect.maxX, y: cy))
            ctx.stroke(mid, with: .color(ink), lineWidth: 1.4)

        case 14:
            // Natural Selection Population Shift
            for (idx, dx) in [(-r * 0.78, blue), (-r * 0.26, blue), (r * 0.26, red), (r * 0.78, red)].enumerated() {
                let orb = CGRect(x: cx + dx.0 - r * 0.20, y: cy - r * 0.20, width: r * 0.40, height: r * 0.40)
                ctx.fill(Path(ellipseIn: orb), with: .color(dx.1.opacity(idx >= 2 ? 0.85 : 0.28)))
                ctx.stroke(Path(ellipseIn: orb), with: .color(ink), lineWidth: 1.5)
            }

        default:
            // Trophic 10% Energy Pyramid (Ch 15)
            for (level, frac, col) in [(CGFloat(0), CGFloat(1.0), green), (CGFloat(1), CGFloat(0.66), amber), (CGFloat(2), CGFloat(0.34), red)] {
                let wBar = r * 2.1 * frac
                let yBar = cy + r * 0.36 - level * (r * 0.42)
                let rect = CGRect(x: cx - wBar * 0.5, y: yBar, width: wBar, height: r * 0.34)
                ctx.fill(Path(roundedRect: rect, cornerRadius: 4), with: .color(col.opacity(0.35)))
                ctx.stroke(Path(roundedRect: rect, cornerRadius: 4), with: .color(ink), lineWidth: 1.5)
            }
        }
    }
}
