import SwiftUI

// MARK: - TutorCanvas Co-Drawing Models & 4 Biological Visual Proof Boards

struct BiologyTutorCanvasStep: Identifiable, Codable, Equatable {
    let id: String
    let stepNumber: Int
    let title: String
    let coachNarration: String
    let learnerTaskPrompt: String
    let calloutLabels: [TutorCanvasLabel]
}

struct TutorCanvasLabel: Identifiable, Codable, Equatable {
    let id: String
    let text: String
    let normalizedX: Double
    let normalizedY: Double
}

struct BiologyTutorCanvasBoard: Identifiable, Codable, Equatable {
    let id: String
    let title: String
    let syllabusTag: String
    let steps: [BiologyTutorCanvasStep]
}

enum BiologyTutorCanvasCatalog {
    static let boards: [BiologyTutorCanvasBoard] = [
        BiologyTutorCanvasBoard(
            id: "canvas-osmosis-turgor",
            title: "1. Osmosis Water Potential & Plant Cell Turgor Vectors",
            syllabusTag: "Ch 3 & Unit 2.1",
            steps: [
                BiologyTutorCanvasStep(
                    id: "osm-1",
                    stepNumber: 1,
                    title: "Partially Permeable Membrane & Solute Asymmetry",
                    coachNarration: "Look at the vertical dashed membrane separating pure water on the left (higher water potential Ψ) from concentrated sucrose solution on the right (lower water potential Ψ).",
                    learnerTaskPrompt: "Circle the side with the higher concentration of free water molecules.",
                    calloutLabels: [
                        TutorCanvasLabel(id: "l1", text: "Dilute Side (High Ψ · Many free H2O)", normalizedX: 0.24, normalizedY: 0.22),
                        TutorCanvasLabel(id: "l2", text: "Partially Permeable Membrane", normalizedX: 0.50, normalizedY: 0.14),
                        TutorCanvasLabel(id: "l3", text: "Concentrated Sucrose (Low Ψ)", normalizedX: 0.77, normalizedY: 0.22)
                    ]
                ),
                BiologyTutorCanvasStep(
                    id: "osm-2",
                    stepNumber: 2,
                    title: "Net Water Flux Vector Across the Pore",
                    coachNarration: "Water molecules move randomly in both directions, but more free water molecules strike the membrane pores from the left than from the right.",
                    learnerTaskPrompt: "Draw a bold arrow showing the NET movement of water molecules across the membrane.",
                    calloutLabels: [
                        TutorCanvasLabel(id: "l1", text: "Dilute Side (High Ψ)", normalizedX: 0.24, normalizedY: 0.22),
                        TutorCanvasLabel(id: "l2", text: "NET H2O FLUX →", normalizedX: 0.50, normalizedY: 0.48),
                        TutorCanvasLabel(id: "l3", text: "Sucrose molecules too large for pore", normalizedX: 0.77, normalizedY: 0.65)
                    ]
                ),
                BiologyTutorCanvasStep(
                    id: "osm-3",
                    stepNumber: 3,
                    title: "Vacuole Expansion & Cell Wall Turgor Pressure",
                    coachNarration: "In a plant palisade or potato cell placed in pure water, water enters by osmosis, swelling the sap vacuole until the inelastic cellulose cell wall pushes back with equal turgor pressure.",
                    learnerTaskPrompt: "Sketch outward turgor arrows from the vacuole and inward resistance arrows from the cellulose cell wall.",
                    calloutLabels: [
                        TutorCanvasLabel(id: "l1", text: "Swollen Sap Vacuole (pushes out)", normalizedX: 0.50, normalizedY: 0.48),
                        TutorCanvasLabel(id: "l2", text: "Inelastic Cellulose Wall (prevents bursting)", normalizedX: 0.50, normalizedY: 0.82)
                    ]
                )
            ]
        ),
        BiologyTutorCanvasBoard(
            id: "canvas-elbow-moments",
            title: "2. Antagonistic Biceps/Triceps & Elbow Lever Moments",
            syllabusTag: "Unit 7.4 & Unit 3.4",
            steps: [
                BiologyTutorCanvasStep(
                    id: "elb-1",
                    stepNumber: 1,
                    title: "Hinge Joint Pivot, Effort & Load",
                    coachNarration: "Your elbow is a synovial hinge joint acting as a pivot (fulcrum). The biceps tendon attaches to the radius bone close to the elbow pivot.",
                    learnerTaskPrompt: "Label the Pivot (elbow joint) and the Load (weight held in your hand).",
                    calloutLabels: [
                        TutorCanvasLabel(id: "e1", text: "Humerus (Upper Arm)", normalizedX: 0.25, normalizedY: 0.30),
                        TutorCanvasLabel(id: "e2", text: "Elbow Hinge Pivot (Fulcrum)", normalizedX: 0.32, normalizedY: 0.68),
                        TutorCanvasLabel(id: "e3", text: "Radius & Ulna Forearm Lever", normalizedX: 0.62, normalizedY: 0.68)
                    ]
                ),
                BiologyTutorCanvasStep(
                    id: "elb-2",
                    stepNumber: 2,
                    title: "Flexion: Biceps Contracts, Triceps Relaxes",
                    coachNarration: "Muscles can only pull by contracting; they can never push. To bend (flex) the arm upwards, the biceps contracts while the antagonistic triceps relaxes.",
                    learnerTaskPrompt: "Draw an upward pull arrow on the biceps tendon and mark 'Triceps = Relaxed'.",
                    calloutLabels: [
                        TutorCanvasLabel(id: "e1", text: "Biceps CONTRACTS (Pulls Up ↑)", normalizedX: 0.38, normalizedY: 0.36),
                        TutorCanvasLabel(id: "e2", text: "Triceps RELAXES (Lengthens)", normalizedX: 0.24, normalizedY: 0.56),
                        TutorCanvasLabel(id: "e3", text: "Anticlockwise Moment = F × d", normalizedX: 0.68, normalizedY: 0.46)
                    ]
                ),
                BiologyTutorCanvasStep(
                    id: "elb-3",
                    stepNumber: 3,
                    title: "Extension: Triceps Contracts, Biceps Relaxes",
                    coachNarration: "To straighten (extend) the forearm downwards, the roles reverse: the triceps contracts behind the elbow pivot while the biceps relaxes.",
                    learnerTaskPrompt: "Draw the extension pull vector on the triceps tendon.",
                    calloutLabels: [
                        TutorCanvasLabel(id: "e1", text: "Biceps RELAXES", normalizedX: 0.38, normalizedY: 0.36),
                        TutorCanvasLabel(id: "e2", text: "Triceps CONTRACTS (Straightens Arm ↓)", normalizedX: 0.28, normalizedY: 0.78)
                    ]
                )
            ]
        ),
        BiologyTutorCanvasBoard(
            id: "canvas-alveolus-exchange",
            title: "3. Alveolus–Capillary Gas Exchange & Diffusion Vectors",
            syllabusTag: "Unit 1.2 & Ch 8.1",
            steps: [
                BiologyTutorCanvasStep(
                    id: "alv-1",
                    stepNumber: 1,
                    title: "One-Cell-Thick Squamous Wall & Moist Lining",
                    coachNarration: "An alveolus air sac is wrapped in a pulmonary capillary. Both walls are only one squamous epithelial cell thick, creating a diffusion distance under 1 micrometre.",
                    learnerTaskPrompt: "Trace the ultra-thin diffusion barrier between alveolar air and red blood cells.",
                    calloutLabels: [
                        TutorCanvasLabel(id: "a1", text: "Alveolar Air Sac (High O2, Low CO2)", normalizedX: 0.48, normalizedY: 0.28),
                        TutorCanvasLabel(id: "a2", text: "1-Cell-Thick Alveolar + Capillary Wall", normalizedX: 0.50, normalizedY: 0.56),
                        TutorCanvasLabel(id: "a3", text: "Blood Plasma + Red Blood Cells", normalizedX: 0.50, normalizedY: 0.78)
                    ]
                ),
                BiologyTutorCanvasStep(
                    id: "alv-2",
                    stepNumber: 2,
                    title: "Opposing O2 and CO2 Concentration Gradients",
                    coachNarration: "Deoxygenated blood arrives from respiring tissues high in dissolved CO2 and low in O2. Oxygen diffuses down its gradient into red blood cells (binding haemoglobin → oxyhaemoglobin), while CO2 diffuses out into the alveolus.",
                    learnerTaskPrompt: "Draw the O2 diffusion arrow into the red blood cell and the CO2 arrow up into the alveolar air.",
                    calloutLabels: [
                        TutorCanvasLabel(id: "a1", text: "O2 Diffuses Down Gradient ↓ into RBC", normalizedX: 0.34, normalizedY: 0.48),
                        TutorCanvasLabel(id: "a2", text: "CO2 Diffuses Up ↑ out of Blood Plasma", normalizedX: 0.68, normalizedY: 0.48),
                        TutorCanvasLabel(id: "a3", text: "Hb + 4 O2 → Oxyhaemoglobin", normalizedX: 0.50, normalizedY: 0.84)
                    ]
                )
            ]
        ),
        BiologyTutorCanvasBoard(
            id: "canvas-punnett-proof",
            title: "4. Monohybrid Inheritance Cross (Aa × Aa → 3:1 Ratio)",
            syllabusTag: "Ch 13 · Genetics",
            steps: [
                BiologyTutorCanvasStep(
                    id: "pun-1",
                    stepNumber: 1,
                    title: "Heterozygous Parental Genotypes & Meiotic Gametes",
                    coachNarration: "Both parents are heterozygous (Aa). During meiosis, homologous chromosomes separate so 50% of gametes carry the dominant allele (A) and 50% carry the recessive allele (a).",
                    learnerTaskPrompt: "Write the gamete alleles A and a along the top and left edges of the Punnett grid.",
                    calloutLabels: [
                        TutorCanvasLabel(id: "p1", text: "Parent 1 Gametes:   [ A ]       [ a ]", normalizedX: 0.54, normalizedY: 0.22),
                        TutorCanvasLabel(id: "p2", text: "Parent 2 [ A ]", normalizedX: 0.24, normalizedY: 0.44),
                        TutorCanvasLabel(id: "p3", text: "Parent 2 [ a ]", normalizedX: 0.24, normalizedY: 0.68)
                    ]
                ),
                BiologyTutorCanvasStep(
                    id: "pun-2",
                    stepNumber: 2,
                    title: "Offspring Genotype Ratio (1 AA : 2 Aa : 1 aa) & Phenotype (3 : 1)",
                    coachNarration: "Combining the gametes produces 25% homozygous dominant (AA), 50% heterozygous (Aa), and 25% homozygous recessive (aa)—giving a 3:1 dominant-to-recessive phenotype ratio.",
                    learnerTaskPrompt: "Fill in the four offspring boxes (AA, Aa, Aa, aa) and circle the 25% homozygous recessive box.",
                    calloutLabels: [
                        TutorCanvasLabel(id: "p1", text: "AA (25%)", normalizedX: 0.44, normalizedY: 0.44),
                        TutorCanvasLabel(id: "p2", text: "Aa (25%)", normalizedX: 0.66, normalizedY: 0.44),
                        TutorCanvasLabel(id: "p3", text: "Aa (25%)", normalizedX: 0.44, normalizedY: 0.68),
                        TutorCanvasLabel(id: "p4", text: "aa (25% Recessive)", normalizedX: 0.66, normalizedY: 0.68)
                    ]
                )
            ]
        )
    ]
}

// MARK: - BiologyTutorCanvasView (Co-Drawing Coach + Learner Whiteboard)

struct BiologyTutorCanvasView: View {
    @EnvironmentObject private var store: AppStore
    @State private var selectedBoardID: String = BiologyTutorCanvasCatalog.boards[0].id
    @State private var currentStepIndex: Int = 0
    @State private var strokes: [[CGPoint]] = []
    @State private var activeStroke: [CGPoint] = []
    @State private var savedStatusText: String?

    private var activeBoard: BiologyTutorCanvasBoard {
        BiologyTutorCanvasCatalog.boards.first(where: { $0.id == selectedBoardID }) ?? BiologyTutorCanvasCatalog.boards[0]
    }

    private var activeStep: BiologyTutorCanvasStep {
        let idx = min(max(currentStepIndex, 0), max(activeBoard.steps.count - 1, 0))
        return activeBoard.steps[idx]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.md) {
            // Board selector strip
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: Spacing.xs) {
                    ForEach(BiologyTutorCanvasCatalog.boards) { board in
                        JournalChip(
                            board.title,
                            systemImage: "rectangle.and.pencil.and.ellipsis",
                            isSelected: board.id == selectedBoardID
                        ) {
                            selectedBoardID = board.id
                            currentStepIndex = 0
                            loadStrokesForBoard(board.id)
                        }
                    }
                }
            }

            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    HStack {
                        JournalChip(activeBoard.syllabusTag, systemImage: "person.2.wave.2.fill", tone: .accent)
                        Text("Step \(activeStep.stepNumber) of \(activeBoard.steps.count) · \(activeStep.title)")
                            .font(.kymaiaSubheadline)
                            .foregroundStyle(Color.kymaiaInk)
                        Spacer()

                        Button("Clear ink") {
                            strokes.removeAll()
                            activeStroke.removeAll()
                            persistStrokesForBoard(activeBoard.id, data: nil)
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))

                        Button {
                            freezeCoDrawingToLabJournal()
                        } label: {
                            Label("Save to Lab Journal", systemImage: "book.pages")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                    }

                    Text(activeStep.coachNarration)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaSecondaryInk)

                    HStack(spacing: Spacing.xs) {
                        Image(systemName: "pencil.tip.crop.circle.badge.plus")
                            .foregroundStyle(Color.kymaiaPrimary)
                        Text("Your co-drawing task: \(activeStep.learnerTaskPrompt)")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaPrimary)
                    }

                    // Co-Drawing Whiteboard Surface
                    JournalPaperSheet(style: .dotGrid, minHeight: 280) {
                        GeometryReader { geo in
                            ZStack(alignment: .topLeading) {
                                // Coach schematic vector layer
                                Canvas { context, size in
                                    drawCoachSchematic(for: activeBoard.id, stepNumber: activeStep.stepNumber, in: &context, size: size)
                                }

                                // Coach callout labels
                                ForEach(activeStep.calloutLabels) { label in
                                    Text(label.text)
                                        .font(.kymaiaCaption.weight(.semibold))
                                        .foregroundStyle(Color.kymaiaPrimaryStrong)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(
                                            Capsule()
                                                .fill(Color.kymaiaSurface.opacity(0.92))
                                                .overlay(
                                                    Capsule().strokeBorder(Color.kymaiaPrimary.opacity(0.45), lineWidth: 1)
                                                )
                                        )
                                        .position(
                                            x: label.normalizedX * geo.size.width,
                                            y: label.normalizedY * geo.size.height
                                        )
                                }

                                // Learner Apple Pencil ink layer on the same canvas
                                JournalInkCanvasView(
                                    strokes: $strokes,
                                    activeStroke: $activeStroke,
                                    strokeColor: Color.kymaiaInk,
                                    lineWidth: 2.8,
                                    onStrokesCommitted: { _, encoded in
                                        persistStrokesForBoard(activeBoard.id, data: encoded)
                                    }
                                )
                            }
                        }
                        .frame(minHeight: 280)
                    }

                    // Step navigation bar
                    HStack {
                        Button {
                            if currentStepIndex > 0 { currentStepIndex -= 1 }
                        } label: {
                            Label("Previous step", systemImage: "chevron.left")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                        .disabled(currentStepIndex == 0)

                        Spacer()

                        if let status = savedStatusText {
                            Text(status)
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaSuccess)
                        }

                        Spacer()

                        Button {
                            if currentStepIndex + 1 < activeBoard.steps.count {
                                currentStepIndex += 1
                            }
                        } label: {
                            Label("Next step", systemImage: "chevron.right")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                        .disabled(currentStepIndex + 1 >= activeBoard.steps.count)
                    }
                }
            }
        }
        .onAppear {
            loadStrokesForBoard(activeBoard.id)
        }
    }

    private func drawCoachSchematic(
        for boardID: String,
        stepNumber: Int,
        in context: inout GraphicsContext,
        size: CGSize
    ) {
        let strokeColor = Color.kymaiaPrimary.opacity(0.55)
        switch boardID {
        case "canvas-osmosis-turgor":
            // Dashed membrane down the centre
            var membrane = Path()
            membrane.move(to: CGPoint(x: size.width * 0.5, y: 24))
            membrane.addLine(to: CGPoint(x: size.width * 0.5, y: size.height - 24))
            context.stroke(membrane, with: .color(strokeColor), style: StrokeStyle(lineWidth: 2.5, dash: [7, 6]))
            if stepNumber >= 2 {
                var arrow = Path()
                arrow.move(to: CGPoint(x: size.width * 0.34, y: size.height * 0.56))
                arrow.addLine(to: CGPoint(x: size.width * 0.66, y: size.height * 0.56))
                context.stroke(arrow, with: .color(Color.kymaiaSuccess), lineWidth: 3.0)
            }

        case "canvas-elbow-moments":
            var bones = Path()
            let pivot = CGPoint(x: size.width * 0.32, y: size.height * 0.62)
            bones.move(to: CGPoint(x: size.width * 0.25, y: size.height * 0.18))
            bones.addLine(to: pivot)
            bones.addLine(to: CGPoint(x: size.width * 0.78, y: size.height * 0.62))
            context.stroke(bones, with: .color(strokeColor), lineWidth: 4.0)

        case "canvas-alveolus-exchange":
            let alveolusRect = CGRect(x: size.width * 0.28, y: size.height * 0.14, width: size.width * 0.44, height: size.height * 0.38)
            context.stroke(Path(ellipseIn: alveolusRect), with: .color(strokeColor), lineWidth: 2.5)
            let capRect = CGRect(x: size.width * 0.20, y: size.height * 0.62, width: size.width * 0.60, height: size.height * 0.22)
            context.stroke(Path(roundedRect: capRect, cornerRadius: BioFigureGeometry.capillaryRadius), with: .color(Color.kymaiaError.opacity(0.55)), lineWidth: 2.5)

        default:
            // Punnett 2x2 grid
            let boxW = size.width * 0.22
            let boxH = size.height * 0.22
            let originX = size.width * 0.33
            let originY = size.height * 0.33
            for r in 0..<2 {
                for c in 0..<2 {
                    let rect = CGRect(x: originX + CGFloat(c) * boxW, y: originY + CGFloat(r) * boxH, width: boxW, height: boxH)
                    context.stroke(Path(rect), with: .color(strokeColor), lineWidth: 2.0)
                }
            }
        }
    }

    private func storageKey(for boardID: String) -> String {
        "kymbio.tutorcanvas.strokes.\(boardID)"
    }

    private func loadStrokesForBoard(_ boardID: String) {
        let data = UserDefaults.standard.data(forKey: storageKey(for: boardID))
        strokes = JournalInkDrawingCodec.decode(data: data)
        activeStroke.removeAll()
        savedStatusText = nil
    }

    private func persistStrokesForBoard(_ boardID: String, data: Data?) {
        UserDefaults.standard.set(data, forKey: storageKey(for: boardID))
    }

    private func freezeCoDrawingToLabJournal() {
        let encoded = JournalInkDrawingCodec.encode(strokes: strokes)
        store.createJournalEntry(
            title: "Co-Drawing Proof: \(activeBoard.title)",
            templateKind: JournalTemplateKind.sketch.rawValue,
            paperStyle: JournalPaperStyle.dotGrid.rawValue,
            linkedChapter: store.activeLivingWorldChapter,
            linkedUnit: store.selectedUnitNumber,
            cuesText: activeStep.title,
            bodyText: activeStep.coachNarration,
            summaryText: activeStep.learnerTaskPrompt,
            drawingData: encoded
        )
        savedStatusText = "Saved co-drawing to your Lab Journal!"
    }
}
