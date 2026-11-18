import SwiftUI

struct TodayHomeView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @State private var showingFSRSReviewSheet = false
    @State private var todaySpotlightWidgetId: String = "seed_flame3d"

    private var nextQuestion: SchoolScienceQuestion? {
        store.pack.schoolQuestions.first {
            !store.proofLevel(for: $0.id).isIndependentProof
        } ?? store.pack.schoolQuestions.first
    }

    private var provenQuestionsCount: Int {
        store.questionProofs.values.filter { $0.level.isIndependentProof }.count
    }

    private var dailyPlan: DailyFlowSessionPlan {
        DailyFlowSessionEngine.buildPlan(
            pack: store.pack,
            fsrsCards: store.fsrsCards,
            proofs: store.questionProofs,
            preferredChapterNumber: store.activeLivingWorldChapter
        )
    }

    var body: some View {
        JournalPage(
            title: GreetingPeriod.current().greeting(for: "Kym"),
            eyebrow: "FOLIO EDITION · MUMBAI & DELFT",
            subtitle: "Cambridge Lower Secondary Science 8 & The Living World Herbarium"
        ) {
            herbariumFolioHeroSpread
            glanceTilesRow
            dailyFlowCard
            todayLiveAtlasSpotlightSection
            DailyAtelierHumourComicCard(
                activeChapterNumber: store.activeLivingWorldChapter,
                onOpenChapter: { chNum in
                    store.activeExplorerId = nil
                    store.activeLivingWorldChapter = chNum
                    store.selectedRoom = .livingWorld
                }
            )
            if let q = nextQuestion {
                nextQuestionProofCard(q)
            }
            phenomenonMechanismSpotlightSection
            coreBiologyUnitsSection
            featuredLabsAndDiagramsSection
        }
        .sheet(isPresented: $showingFSRSReviewSheet) {
            NavigationStack {
                FSRSReviewSheetView()
                    .environmentObject(store)
            }
        }
        .sheet(isPresented: $store.showDailyFlowSheet) {
            NavigationStack {
                DailyFlowPlayerSheet()
                    .environmentObject(store)
            }
        }
        .sheet(item: $store.activePracticeQuestion) { question in
            NavigationStack {
                QuestionProofPracticeView(question: question)
                    .environmentObject(store)
            }
        }
    }

    // MARK: - Option A: Naturalist's Field Herbarium & Copperplate Folio Hero Spread

    private var herbariumFolioHeroSpread: some View {
        let forestInk = Color(red: 0.08, green: 0.17, blue: 0.13)
        let brassAccent = Color(red: 0.60, green: 0.40, blue: 0.09)
        let ragSurface = Color(red: 0.99, green: 0.98, blue: 0.95)

        return VStack(alignment: .leading, spacing: Spacing.lg) {
            ViewThatFits(in: .horizontal) {
                HStack(alignment: .center, spacing: Spacing.lg) {
                    herbariumHeroCopyColumn(forestInk: forestInk, brassAccent: brassAccent)
                        .frame(minWidth: 380, maxWidth: .infinity, alignment: .leading)
                    herbariumCopperplatePlate(forestInk: forestInk, brassAccent: brassAccent)
                        .frame(width: 260, height: 192)
                }

                VStack(alignment: .leading, spacing: Spacing.md) {
                    herbariumHeroCopyColumn(forestInk: forestInk, brassAccent: brassAccent)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    herbariumCopperplatePlate(forestInk: forestInk, brassAccent: brassAccent)
                        .frame(maxWidth: .infinity)
                        .frame(height: 176)
                }
            }

            // 4-Volume Herbarium Folio Cards (4 across on iPad, 2x2 on iPhone)
            let volumesMeta: [(num: Int, chRange: String, firstCh: Int, title: String, sub: String, stroke: Color)] = [
                (1, "VOLUME I · CH 0–3", 0, "The Nanotech City", "270× Lens · Seed vs Flame · Cells & Scale · Salty Sea", Color(red: 0.12, green: 0.37, blue: 0.27)),
                (2, "VOLUME II · CH 4–6", 4, "Molecular Locks & Sunlight", "Enzymes · Banyan Green Engine · Mitochondrial ATP", Color(red: 0.60, green: 0.40, blue: 0.09)),
                (3, "VOLUME III · CH 7–10", 7, "The Human Orchestra", "Digestion · Double Heart Pump · Nerves · Mumbai 37 °C", Color(red: 0.72, green: 0.20, blue: 0.16)),
                (4, "VOLUME IV · CH 11–15", 11, "The Four-Letter Code", "Photo 51 DNA · Mitosis · Mendel · Selection · Ecology", Color(red: 0.12, green: 0.32, blue: 0.46)),
            ]

            let columns = [
                GridItem(.adaptive(minimum: 190), spacing: Spacing.sm),
            ]

            LazyVGrid(columns: columns, spacing: Spacing.sm) {
                ForEach(volumesMeta, id: \.num) { vol in
                    Button {
                        store.activeExplorerId = nil
                        store.activeWidgetId = nil
                        store.activeLivingWorldChapter = vol.firstCh
                        store.selectedRoom = .livingWorld
                    } label: {
                        VStack(alignment: .leading, spacing: 5) {
                            HStack {
                                Text(vol.chRange)
                                    .font(.system(size: 10.5, weight: .bold, design: .monospaced))
                                    .tracking(0.6)
                                    .foregroundStyle(vol.stroke)
                                Spacer()
                                Image(systemName: "arrow.up.right")
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundStyle(vol.stroke.opacity(0.8))
                            }
                            Text(vol.title)
                                .font(.system(size: 16.5, weight: .bold, design: .serif))
                                .foregroundStyle(forestInk)
                                .lineLimit(2)
                                .minimumScaleFactor(0.85)
                                .multilineTextAlignment(.leading)
                            Text(vol.sub)
                                .font(.system(size: 12.5, weight: .regular, design: .default))
                                .foregroundStyle(Color(red: 0.28, green: 0.35, blue: 0.31))
                                .lineLimit(2)
                                .multilineTextAlignment(.leading)
                        }
                        .padding(14)
                        .frame(maxWidth: .infinity, minHeight: 88, alignment: .topLeading)
                        .background(
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .fill(ragSurface)
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .strokeBorder(vol.stroke.opacity(0.65), lineWidth: 1.4)
                        )
                    }
                    .buttonStyle(.plain)
                    .accessibilityIdentifier("today.folio.vol.\(vol.num)")
                }
            }
        }
        .padding(Spacing.lg)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color(red: 0.96, green: 0.94, blue: 0.89))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .strokeBorder(brassAccent.opacity(0.45), lineWidth: 1.4)
        )
    }

    private func herbariumHeroCopyColumn(forestInk: Color, brassAccent: Color) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("WRITTEN FOR KYM · NATURAL HISTORY & FORENSIC BIOLOGY")
                .font(.system(size: 11, weight: .bold, design: .monospaced))
                .tracking(0.6)
                .foregroundStyle(brassAccent)
                .fixedSize(horizontal: false, vertical: true)

            Text("The Living World")
                .font(.system(size: horizontalSizeClass == .compact ? 30 : 34, weight: .bold, design: .serif))
                .foregroundStyle(forestInk)
                .lineLimit(1)
                .minimumScaleFactor(0.72)

            Text("From a dry moong seed on a Malabar Hill kitchen shelf to thirty-seven trillion cooperating cells—sixteen detective investigations into how matter wakes up, steals sunlight, copies a four-letter code, and thinks.")
                .font(.system(size: 15, weight: .regular, design: .serif))
                .foregroundStyle(Color(red: 0.20, green: 0.28, blue: 0.24))
                .lineSpacing(3)
                .fixedSize(horizontal: false, vertical: true)

            FlowLayout(spacing: 10) {
                Button {
                    store.activeExplorerId = "top"
                    store.activeWidgetId = nil
                    store.selectedRoom = .livingWorld
                } label: {
                    HStack(spacing: 6) {
                        Text("Begin Chapter 0")
                        Image(systemName: "arrow.right")
                    }
                    .font(.system(size: 13.5, weight: .semibold))
                    .foregroundStyle(Color(red: 0.98, green: 0.96, blue: 0.91))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(Capsule().fill(forestInk))
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier("today.folio.begin-book")

                Button {
                    store.activeExplorerId = "x_cell"
                    store.activeWidgetId = nil
                    store.selectedRoom = .livingWorld
                } label: {
                    Text("Open 3D Cell Observatory")
                        .font(.system(size: 13.5, weight: .semibold))
                        .foregroundStyle(forestInk)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(
                            Capsule()
                                .strokeBorder(forestInk.opacity(0.65), lineWidth: 1.4)
                        )
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier("today.folio.open-cell")
            }
            .padding(.top, 4)
        }
    }

    private func herbariumCopperplatePlate(forestInk: Color, brassAccent: Color) -> some View {
        let goldStroke = Color(red: 0.82, green: 0.64, blue: 0.32)
        let emeraldGlow = Color(red: 0.20, green: 0.72, blue: 0.50)
        return ZStack {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(forestInk)
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .strokeBorder(goldStroke, lineWidth: 1.8)
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .strokeBorder(goldStroke.opacity(0.45), lineWidth: 1.0)
                .padding(5)

            Canvas { ctx, size in
                let w = size.width
                let h = size.height
                let cx = w * 0.5
                let cy = h * 0.46
                let r = min(w, h) * 0.30

                // Central double copperplate ring
                let outer = CGRect(x: cx - r, y: cy - r, width: r * 2, height: r * 2)
                let inner = outer.insetBy(dx: 5, dy: 5)
                ctx.stroke(Path(ellipseIn: outer), with: .color(goldStroke), lineWidth: 1.6)
                ctx.stroke(Path(ellipseIn: inner), with: .color(emeraldGlow.opacity(0.6)), lineWidth: 1.1)

                // Germinating seed + stem + two leaves
                let seedRect = CGRect(x: cx - 12, y: cy + r * 0.42, width: 24, height: 14)
                ctx.fill(Path(ellipseIn: seedRect), with: .color(Color(red: 0.85, green: 0.55, blue: 0.16)))
                ctx.stroke(Path(ellipseIn: seedRect), with: .color(goldStroke), lineWidth: 1.4)

                var stem = Path()
                stem.move(to: CGPoint(x: cx, y: cy + r * 0.42))
                stem.addLine(to: CGPoint(x: cx, y: cy - r * 0.45))
                ctx.stroke(stem, with: .color(emeraldGlow), lineWidth: 2.4)

                var leftLeaf = Path()
                leftLeaf.move(to: CGPoint(x: cx, y: cy + 2))
                leftLeaf.addQuadCurve(to: CGPoint(x: cx - r * 0.58, y: cy - r * 0.32), control: CGPoint(x: cx - r * 0.55, y: cy + 4))
                leftLeaf.addQuadCurve(to: CGPoint(x: cx, y: cy + 2), control: CGPoint(x: cx - r * 0.15, y: cy - r * 0.45))
                ctx.fill(leftLeaf, with: .color(emeraldGlow.opacity(0.75)))
                ctx.stroke(leftLeaf, with: .color(goldStroke), lineWidth: 1.2)

                var rightLeaf = Path()
                rightLeaf.move(to: CGPoint(x: cx, y: cy - 4))
                rightLeaf.addQuadCurve(to: CGPoint(x: cx + r * 0.58, y: cy - r * 0.42), control: CGPoint(x: cx + r * 0.55, y: cy - 2))
                rightLeaf.addQuadCurve(to: CGPoint(x: cx, y: cy - 4), control: CGPoint(x: cx + r * 0.15, y: cy - r * 0.55))
                ctx.fill(rightLeaf, with: .color(emeraldGlow.opacity(0.85)))
                ctx.stroke(rightLeaf, with: .color(goldStroke), lineWidth: 1.2)

                // 4 Corner Medallions (Mitochondrion, 270x Lens, DNA Helix, Heart)
                let corners: [(CGPoint, Color)] = [
                    (CGPoint(x: w * 0.16, y: h * 0.25), Color(red: 0.85, green: 0.55, blue: 0.16)),
                    (CGPoint(x: w * 0.84, y: h * 0.25), Color(red: 0.22, green: 0.74, blue: 0.97)),
                    (CGPoint(x: w * 0.16, y: h * 0.68), emeraldGlow),
                    (CGPoint(x: w * 0.84, y: h * 0.68), Color(red: 0.94, green: 0.38, blue: 0.38)),
                ]
                for (pt, col) in corners {
                    let mr: CGFloat = 17
                    let rect = CGRect(x: pt.x - mr, y: pt.y - mr, width: mr * 2, height: mr * 2)
                    ctx.stroke(Path(ellipseIn: rect), with: .color(col.opacity(0.85)), lineWidth: 1.4)
                    let dot = CGRect(x: pt.x - 5, y: pt.y - 5, width: 10, height: 10)
                    ctx.fill(Path(ellipseIn: dot), with: .color(col.opacity(0.45)))
                }
            }

            VStack {
                Spacer()
                Text("4 VOLUMES · 16 CHAPTERS · 118 SPECIMEN PLATES · 32 ATELIER COMICS")
                    .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                    .tracking(0.5)
                    .foregroundStyle(goldStroke.opacity(0.9))
                    .padding(.bottom, 10)
            }
        }
    }

    // MARK: - 15-Minute Daily Session Composer

    private var dailyFlowCard: some View {
        let plan = dailyPlan
        return JournalSection(title: "Today's 15-Minute Biology Plan") {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text("\(plan.totalMinutes) MIN GUIDED SESSION · \(plan.dueCards.count) CARDS READY · CH \(plan.chapter.number): \(plan.chapter.title.uppercased())")
                        .font(.system(size: 10.5, weight: .bold, design: .monospaced))
                        .tracking(0.6)
                        .foregroundStyle(Color.kymaiaPrimaryStrong)

                    Text("Four short steps: review key ideas, explore how cells work with audio, solve a 'Who is right?' puzzle, and answer one Cambridge Science 8 question.")
                        .font(.kymaiaBody)
                        .foregroundStyle(Color.kymaiaInk)

                    HStack(spacing: Spacing.sm) {
                        Button {
                            store.showDailyFlowSheet = true
                        } label: {
                            Label("Start 15-Minute Session", systemImage: "play.fill")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                        .accessibilityIdentifier("today.daily-flow.start")

                        Button {
                            store.activeExplorerId = nil
                            store.activeLivingWorldChapter = plan.chapter.number
                            store.selectedRoom = .livingWorld
                        } label: {
                            Label("Read Chapter \(plan.chapter.number)", systemImage: "book.pages.fill")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted))
                        .accessibilityIdentifier("today.daily-flow.open-beats")
                    }
                }
            }
        }
    }

    private var todayLiveAtlasSpotlightSection: some View {
        let spotlightWidgets: [(id: String, title: String, chapter: Int)] = [
            ("seed_flame3d", "Ch 1 · Candle Flame vs Seed Cell (3D ATP)", 1),
            ("redi_jars", "Ch 0 · Redi's Three-Jar Experiment", 0),
            ("alveolus_gas_exchange", "Ch 6 · Alveolus Gas Exchange", 6),
            ("antagonistic_arm_lever", "Ch 8 · Biceps & Triceps Elbow Lever", 8),
        ]
        let activeSpec = spotlightWidgets.first(where: { $0.id == todaySpotlightWidgetId }) ?? spotlightWidgets[0]
        return JournalSection(title: "Interactive 3D & 2D Biology Stage · Try It Right Here") {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    HStack(alignment: .center, spacing: Spacing.xs) {
                        Text("LIVE 3D & 2D SPECIMEN OBSERVATORY · \(activeSpec.title.uppercased())")
                            .font(.system(size: 10.5, weight: .bold, design: .monospaced))
                            .tracking(0.6)
                            .foregroundStyle(Color.kymaiaPrimaryStrong)
                        Spacer()
                        Button {
                            store.activeWidgetId = activeSpec.id
                            store.selectedRoom = .labsAtlas
                        } label: {
                            Label("Full-Screen Lab Bench", systemImage: "arrow.up.left.and.arrow.down.right")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                    }

                    FlowLayout(spacing: Spacing.xs) {
                        ForEach(spotlightWidgets, id: \.id) { item in
                            Button(item.title) {
                                todaySpotlightWidgetId = item.id
                                store.activeLivingWorldChapter = item.chapter
                            }
                            .buttonStyle(
                                JournalCapsuleButtonStyle(
                                    prominence: todaySpotlightWidgetId == item.id ? .filled : .ghost,
                                    size: .small
                                )
                            )
                        }
                    }

                    LivingWorldWebStageView(
                        chapterNumber: activeSpec.chapter,
                        targetWidgetId: activeSpec.id
                    )
                    .frame(minHeight: 420)
                    .padding(6)
                    .background(
                        RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                            .fill(Color(red: 0.04, green: 0.08, blue: 0.11))
                    )
                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                            .strokeBorder(Color.kymaiaSuccess.opacity(0.42), lineWidth: 1.4)
                    )
                }
            }
        }
    }

    private var phenomenonMechanismSpotlightSection: some View {
        let bridge = PhenomenonToMechanismBridge.bridge(forChapter: store.activeLivingWorldChapter)
        return JournalSection(title: "How It Works · Everyday Clue to Biology Rule") {
            PhenomenonMechanismBridgeCard(bridge: bridge)
        }
    }

    // MARK: - Herbarium Specimen Metric Tiles

    private var glanceTilesRow: some View {
        let forestInk = Color(red: 0.08, green: 0.17, blue: 0.13)
        let brassAccent = Color(red: 0.60, green: 0.40, blue: 0.09)
        let emeraldStroke = Color(red: 0.12, green: 0.37, blue: 0.27)
        let ragSurface = Color(red: 0.99, green: 0.98, blue: 0.95)

        return JournalCardRow {
            Button {
                store.selectedRoom = .schoolScience
            } label: {
                HStack(alignment: .top, spacing: 12) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("CAMBRIDGE SCIENCE 8 · FIELD PROOFS")
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .tracking(0.6)
                            .foregroundStyle(brassAccent)
                        Text("\(provenQuestionsCount) of \(store.pack.schoolQuestions.count) answered solo")
                            .font(.system(size: 21, weight: .bold, design: .serif).monospacedDigit())
                            .foregroundStyle(forestInk)
                        Text("Learner's Book 8 & Workbook 8 — tap to practice")
                            .font(.system(size: 12.5, weight: .regular))
                            .foregroundStyle(Color(red: 0.28, green: 0.35, blue: 0.31))
                    }
                    Spacer()
                    Image(systemName: "checkmark.seal.fill")
                        .font(.system(size: 26, weight: .semibold))
                        .foregroundStyle(brassAccent.opacity(0.85))
                }
                .padding(16)
                .frame(maxWidth: .infinity, minHeight: 104, alignment: .topLeading)
                .background(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(ragSurface)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .strokeBorder(brassAccent.opacity(0.55), lineWidth: 1.4)
                )
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Cambridge Science 8 Practice Questions")
            .accessibilityValue("\(provenQuestionsCount) of \(store.pack.schoolQuestions.count) answered solo")
            .accessibilityIdentifier("today.tile.proofs")

            Button {
                showingFSRSReviewSheet = true
            } label: {
                HStack(alignment: .top, spacing: 12) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("SPACED RECALL · HERBARIUM DECK")
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .tracking(0.6)
                            .foregroundStyle(emeraldStroke)
                        Text("\(store.dueFSRSCards.count) cards ready")
                            .font(.system(size: 21, weight: .bold, design: .serif).monospacedDigit())
                            .foregroundStyle(forestInk)
                        Text("Tap for a 3-minute active recall check")
                            .font(.system(size: 12.5, weight: .regular))
                            .foregroundStyle(Color(red: 0.28, green: 0.35, blue: 0.31))
                    }
                    Spacer()
                    Image(systemName: "rectangle.stack.fill")
                        .font(.system(size: 26, weight: .semibold))
                        .foregroundStyle(emeraldStroke.opacity(0.85))
                }
                .padding(16)
                .frame(maxWidth: .infinity, minHeight: 104, alignment: .topLeading)
                .background(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(ragSurface)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .strokeBorder(emeraldStroke.opacity(0.55), lineWidth: 1.4)
                )
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Quick Memory Cards ready")
            .accessibilityValue("\(store.dueFSRSCards.count) cards ready")
            .accessibilityIdentifier("today.tile.fsrs")
        }
    }

    // MARK: - Next Question Hero Card

    private func nextQuestionProofCard(_ question: SchoolScienceQuestion) -> some View {
        JournalSection(title: "Next question to try on your own") {
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    HStack {
                        JournalChip(text: "Unit \(question.unitNumber) · Topic \(question.topicCode)", tone: .accent)
                        JournalChip(text: question.sourceBadgeTitle, tone: .good)
                        JournalChip(text: "\(question.marks) marks", tone: .neutral)
                        Spacer()
                    }
                    Text(question.bookSection)
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Text(question.prompt)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaInk)

                    BioSpecimenPlateCanvas(
                        chapterNumber: question.linkedChapter,
                        figureId: question.linkedWidget.isEmpty ? question.id : question.linkedWidget,
                        callouts: []
                    )
                    .frame(height: 120)
                    .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                            .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                    )

                    HStack(spacing: Spacing.sm) {
                        Button {
                            store.activePracticeQuestion = question
                        } label: {
                            Label("Try this question now", systemImage: "checkmark.seal.fill")
                        }
                        .buttonStyle(BrassButtonStyle())
                        .accessibilityIdentifier("today.next-question.start")

                        Button {
                            store.activeLivingWorldChapter = question.linkedChapter
                            store.selectedRoom = .livingWorld
                        } label: {
                            Label("Read Ch \(question.linkedChapter) first", systemImage: "book.pages")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

                        if !question.linkedWidget.isEmpty {
                            Button {
                                store.activeWidgetId = question.linkedWidget
                                store.selectedRoom = .labsAtlas
                            } label: {
                                Label("Open 3D/2D Lab", systemImage: "cube.transparent")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                        }
                    }
                }
            }
        }
    }

    // MARK: - Core Biology Units (1, 4, 7)

    private var coreBiologyUnitsSection: some View {
        let bioUnits = store.pack.schoolTextbook.units(for: .biologyCore)
        return JournalSection(
            title: "Your Cambridge Science 8 Biology units",
            seeAllIdentifier: "today.see-all-units",
            seeAll: { store.selectedRoom = .schoolScience }
        ) {
            VStack(spacing: Spacing.sm) {
                ForEach(bioUnits) { unit in
                    let readiness = store.unitReadiness(for: unit)
                    Button {
                        store.selectedUnitNumber = unit.unitNumber
                        store.selectedRoom = .schoolScience
                    } label: {
                        JournalCard {
                            HStack(spacing: Spacing.md) {
                                JournalBadge(symbol: "leaf.fill", tint: .kymaiaSuccess, size: .row)
                                VStack(alignment: .leading, spacing: 2) {
                                    HStack(spacing: Spacing.xs) {
                                        Text("Unit \(unit.unitNumber): \(unit.title)")
                                            .font(.kymaiaCardTitle)
                                        if unit.isCompletedInSchool {
                                            JournalChip(text: "Ticked in book", tone: .good)
                                        } else {
                                            JournalChip(text: "Upcoming in school", tone: .accent)
                                        }
                                    }
                                    Text("Learner's Book pp. \(unit.learnersBookStartPage)–\(unit.learnersBookEndPage) · Workbook pp. \(unit.workbookStartPage)–\(unit.workbookEndPage)")
                                        .font(.kymaiaCaption.monospacedDigit())
                                        .foregroundStyle(Color.kymaiaMutedInk)
                                }
                                Spacer()
                                JournalChip(text: readiness.readinessBadgeText, tone: .neutral)
                            }
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: - Featured Labs & Diagram Recall

    private var featuredLabsAndDiagramsSection: some View {
        JournalSection(
            title: "Featured 3D simulations & Apple Pencil diagram plates",
            seeAllIdentifier: "today.see-all-labs",
            seeAll: { store.selectedRoom = .labsAtlas }
        ) {
            JournalCardRow {
                VStack(alignment: .leading, spacing: Spacing.xs) {
                    JournalChip(text: "3D Simulation · Ch 1 & Unit 1.4", tone: .accent)
                    Text("Candle Flame vs Living Seed Cell (ATP Engine)")
                        .font(.kymaiaCardTitle)
                    BioSpecimenPlateCanvas(chapterNumber: 1, figureId: "seed_flame3d", callouts: [])
                        .frame(height: 108)
                        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                        )
                    Text("Compare 1,000 °C uncoupled combustion with enzyme-coupled ATP synthesis at 28 °C.")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Button("Launch 3D Lab") {
                        store.activeWidgetId = "seed_flame3d"
                        store.selectedRoom = .labsAtlas
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                }
                .journalMiniCard()

                VStack(alignment: .leading, spacing: Spacing.xs) {
                    JournalChip(text: "Pencil Diagram Recall · Unit 7.4", tone: .good)
                    Text("Antagonistic Biceps & Triceps at the Elbow Joint")
                        .font(.kymaiaCardTitle)
                    BioSpecimenPlateCanvas(chapterNumber: 8, figureId: "plate-u7-arm-lever", callouts: [])
                        .frame(height: 108)
                        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                        )
                    Text("Practise labelling scapula, humerus, radius, ulna, tendons and antagonistic muscles.")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Button("Practise with Apple Pencil") {
                        store.activeDiagramPlateId = "plate-u7-arm-lever"
                        store.selectedRoom = .labsAtlas
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                }
                .journalMiniCard()
            }
        }
    }
}

// MARK: - FSRS Spaced Retrieval Sheet

struct FSRSReviewSheetView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dismiss) private var dismiss
    @State private var currentIndex: Int = 0
    @State private var draftAnswer: String = ""
    @State private var isRevealed: Bool = false

    private var cards: [FSRSCardRecord] {
        store.dueFSRSCards.isEmpty ? store.fsrsCards : store.dueFSRSCards
    }

    var body: some View {
        let safeIndex = min(currentIndex, max(0, cards.count - 1))
        let currentCard = cards.isEmpty ? nil : cards[safeIndex]

        JournalFocusPage(
            title: "Quick Memory Cards",
            progress: .init(step: safeIndex + 1, total: max(1, cards.count)),
            closeLabel: "Done",
            close: { dismiss() }
        ) {
            if let card = currentCard {
                HStack {
                    JournalChip(text: "Topic \(card.topicCode)", tone: .accent)
                    JournalChip(text: "Chapter \(card.chapterNumber)", tone: .neutral)
                    Spacer()
                    Text("Interval: \(String(format: "%.1f", card.stability)) d")
                        .font(.kymaiaCaption.monospacedDigit())
                        .foregroundStyle(Color.kymaiaMutedInk)
                }

                Text(card.frontPrompt)
                    .font(.kymaiaQuestion)
                    .foregroundStyle(Color.kymaiaInk)

                VStack(alignment: .leading, spacing: 4) {
                    Text("Write your answer before flipping the card:")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    WritingTextEditor(text: $draftAnswer, serif: true)
                        .learnerTextInput(.retrieval)
                        .frame(minHeight: 100)
                        .padding(Spacing.xs)
                        .background(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .fill(Color.kymaiaElevatedSurface)
                        )
                }

                if isRevealed {
                    Divider()
                    Text("Model answer")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaPrimary)
                    Text(card.backAnswer)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaInk)
                }
            } else {
                Text("All Biology retrieval cards are up to date for today.")
                    .font(.kymaiaBody)
            }
        } actions: {
            if let card = currentCard {
                if !isRevealed {
                    Button("Reveal model answer") {
                        isRevealed = true
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted))
                    .accessibilityIdentifier("fsrs.reveal")
                } else {
                    HStack(spacing: Spacing.sm) {
                        ForEach(FSRSRating.allCases, id: \.rawValue) { rating in
                            Button(rating.title) {
                                store.reviewFSRSCard(card, rating: rating)
                                draftAnswer = ""
                                isRevealed = false
                                if currentIndex + 1 < cards.count {
                                    currentIndex += 1
                                } else {
                                    dismiss()
                                }
                            }
                            .buttonStyle(
                                JournalCapsuleButtonStyle(
                                    prominence: rating == .good || rating == .easy ? .filled : .tinted,
                                    size: .small
                                )
                            )
                            .accessibilityIdentifier("fsrs.rate.\(rating.rawValue)")
                        }
                    }
                }
            }
        }
    }
}

// MARK: - 15-Minute Daily Flow Player Sheet

struct DailyFlowPlayerSheet: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dismiss) private var dismiss

    @StateObject private var narrator = ChapterAudioNarrator()
    @State private var currentStage: DailyFlowStageKind = .memoryLock
    @State private var cardIndex: Int = 0
    @State private var isCardRevealed: Bool = false
    @State private var cardDraft: String = ""
    @State private var debateCompleted: Bool = false
    @State private var quantInput: String = ""
    @State private var quantOutcome: QuantitativeCheckOutcome? = nil

    private var plan: DailyFlowSessionPlan {
        DailyFlowSessionEngine.buildPlan(
            pack: store.pack,
            fsrsCards: store.fsrsCards,
            proofs: store.questionProofs,
            preferredChapterNumber: store.activeLivingWorldChapter
        )
    }

    var body: some View {
        JournalPage(
            title: "15-Minute Daily Biology Flow",
            eyebrow: "\(currentStage.title) · \(currentStage.allocatedMinutes) min",
            subtitle: "Chapter \(plan.chapter.number): \(plan.chapter.title)"
        ) {
            stageSelectorBar

            switch currentStage {
            case .memoryLock:
                memoryLockStageView
            case .conceptDiscoveryBeat:
                conceptDiscoveryStageView
            case .misconceptionAndTrapCheck:
                misconceptionAndTrapStageView
            case .schoolQuestionProof:
                schoolQuestionProofStageView
            }
        }
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("Close") {
                    narrator.stop()
                    dismiss()
                }
            }
        }
        .onDisappear {
            narrator.stop()
        }
    }

    private var stageSelectorBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: Spacing.xs) {
                ForEach(DailyFlowStageKind.allCases) { stage in
                    Button {
                        currentStage = stage
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: stage.systemImage)
                            Text("\(stage.title) (\(stage.allocatedMinutes)m)")
                        }
                    }
                    .buttonStyle(
                        JournalCapsuleButtonStyle(
                            prominence: currentStage == stage ? .filled : .tinted,
                            size: .small
                        )
                    )
                    .accessibilityIdentifier("daily-flow.stage.\(stage.rawValue)")
                }
            }
        }
    }

    @ViewBuilder
    private var memoryLockStageView: some View {
        let cards = plan.dueCards
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack {
                    JournalChip(
                        text: plan.isWarmupReview ? "Warm-up Cards" : "Cards to Review",
                        tone: .accent
                    )
                    if !cards.isEmpty {
                        JournalChip(
                            text: "Card \(min(cardIndex + 1, cards.count)) of \(cards.count)",
                            tone: .neutral
                        )
                    }
                    Spacer()
                }

                if cardIndex < cards.count {
                    let card = cards[cardIndex]
                    Text(card.frontPrompt)
                        .font(.kymaiaCardTitle)
                        .foregroundStyle(Color.kymaiaInk)

                    TextEditor(text: $cardDraft)
                        .font(.kymaiaBody)
                        .learnerTextInput(.retrieval)
                        .frame(minHeight: 80)
                        .padding(Spacing.xs)
                        .background(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .fill(Color.kymaiaElevatedSurface)
                        )

                    if !isCardRevealed {
                        Button("Reveal Model Answer") {
                            isCardRevealed = true
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted))
                    } else {
                        Text(card.backAnswer)
                            .font(.kymaiaSerifProse)
                            .foregroundStyle(Color.kymaiaInk)
                            .padding(Spacing.sm)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                    .fill(Color.kymaiaElevatedSurface)
                            )

                        HStack(spacing: Spacing.sm) {
                            ForEach(FSRSRating.allCases, id: \.rawValue) { rating in
                                Button(rating.title) {
                                    store.reviewFSRSCard(card, rating: rating)
                                    cardDraft = ""
                                    isCardRevealed = false
                                    if cardIndex + 1 < cards.count {
                                        cardIndex += 1
                                    } else {
                                        currentStage = .conceptDiscoveryBeat
                                    }
                                }
                                .buttonStyle(
                                    JournalCapsuleButtonStyle(
                                        prominence: rating == .good || rating == .easy ? .filled : .tinted,
                                        size: .small
                                    )
                                )
                            }
                        }
                    }
                } else {
                    Text("Memory lock complete for today! Advance to Stage 2: Concept Discovery Beat.")
                        .font(.kymaiaBody)
                        .foregroundStyle(Color.kymaiaSuccess)
                    Button("Continue to Stage 2 · Concept Discovery Beat") {
                        currentStage = .conceptDiscoveryBeat
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                }
            }
        }
    }

    @ViewBuilder
    private var conceptDiscoveryStageView: some View {
        let beat = plan.discoveryBeat
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack {
                    JournalChip(label: beat.kind.badgeLabel, systemImage: beat.kind.systemImage, tone: .accent)
                    Spacer()
                    Button {
                        narrator.togglePlayPause(for: beat)
                    } label: {
                        Label(
                            narrator.isPlaying && narrator.activeBeatId == beat.id ? "Pause Audio" : "Read & Listen",
                            systemImage: narrator.isPlaying && narrator.activeBeatId == beat.id ? "pause.circle.fill" : "speaker.wave.2.fill"
                        )
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))

                    Button("\(String(format: "%.2gx", narrator.playbackSpeedMultiplier))") {
                        narrator.cycleSpeed(restartingIfPlaying: beat)
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                }

                Text(beat.title)
                    .font(.kymaiaCardTitle)
                    .foregroundStyle(Color.kymaiaInk)

                BioSpecimenPlateCanvas(
                    chapterNumber: plan.chapter.number,
                    figureId: beat.widgetIds.first ?? beat.id,
                    callouts: []
                )
                .frame(height: 140)
                .clipShape(RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                        .strokeBorder(Color.kymaiaHairline, lineWidth: 1)
                )

                Text(beat.bodyMarkdown)
                    .font(.kymaiaSerifProse)
                    .foregroundStyle(Color.kymaiaInk)
            }
        }

        PhenomenonMechanismBridgeCard(bridge: plan.bridge)

        HStack {
            Spacer()
            Button {
                narrator.stop()
                currentStage = .misconceptionAndTrapCheck
            } label: {
                Label("Continue to Stage 3 · Peer Debate & Trap Check", systemImage: "arrow.right")
            }
            .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
        }
    }

    @ViewBuilder
    private var misconceptionAndTrapStageView: some View {
        BiologicalDebateCardView(scenario: plan.debate) { _ in
            debateCompleted = true
        }

        let problem = plan.quantitativeProblem
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack {
                    JournalChip(label: "Quantitative Trap Check", systemImage: "function", tone: .accent)
                    JournalChip(text: "Topic \(problem.schoolTopic)", tone: .neutral)
                    Spacer()
                }

                Text(problem.title)
                    .font(.kymaiaCardTitle)
                    .foregroundStyle(Color.kymaiaInk)

                Text(problem.formulaDisplay)
                    .font(.kymaiaMonospaced)
                    .foregroundStyle(Color.kymaiaPrimaryStrong)

                Text(problem.prompt)
                    .font(.kymaiaBody)
                    .foregroundStyle(Color.kymaiaInk)

                HStack(spacing: Spacing.sm) {
                    TextField("Enter number (\(problem.expectedUnit))", text: $quantInput)
                        .textFieldStyle(.roundedBorder)
                        .font(.kymaiaMonospaced)
                        .learnerTextInput(.retrieval)

                    Button("Check Calculation") {
                        quantOutcome = QuantitativeBioEngine.evaluate(problem: problem, rawInput: quantInput)
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                }

                if let outcome = quantOutcome {
                    if let trap = outcome.matchedTrap {
                        BuggyBioTrapBanner(trap: trap)
                    } else {
                        Text(outcome.diagnosticMessage)
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(outcome.isCorrect ? Color.kymaiaSuccess : Color.kymaiaWarning)
                    }
                }

                HStack {
                    Spacer()
                    Button {
                        currentStage = .schoolQuestionProof
                    } label: {
                        Label("Continue to Stage 4 · Cambridge Question Proof", systemImage: "arrow.right")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                }
            }
        }
    }

    @ViewBuilder
    private var schoolQuestionProofStageView: some View {
        let q = plan.targetQuestion
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack(spacing: Spacing.xs) {
                    JournalChip(text: "Unit \(q.unitNumber) · Topic \(q.topicCode)", tone: .accent)
                    JournalChip(text: q.bookSection, tone: .neutral)
                    JournalChip(text: "\(q.marks) marks", tone: .good)
                    Spacer()
                }

                Text(q.prompt)
                    .font(.kymaiaSerifProse)
                    .foregroundStyle(Color.kymaiaInk)

                HStack(spacing: Spacing.sm) {
                    Button {
                        narrator.stop()
                        dismiss()
                        store.activePracticeQuestion = q
                    } label: {
                        Label("Launch Full 3-Stage Question Proof", systemImage: "checkmark.seal.fill")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled))
                    .accessibilityIdentifier("daily-flow.launch-proof")

                    Button {
                        narrator.stop()
                        dismiss()
                    } label: {
                        Text("Finish Flow")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost))
                }
            }
        }
    }
}
