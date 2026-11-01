import SwiftUI

// MARK: - Biology Memory Palace Models & Pre-Seeded Mumbai/Home Loci

struct BiologyPalaceLocus: Identifiable, Codable, Equatable {
    let id: String
    var orderIndex: Int
    var stationName: String
    var sensoryHook: String
    var biologicalTargetFact: String
    var keyTerms: [String]
}

struct BiologyMemoryPalace: Identifiable, Codable, Equatable {
    let id: String
    var title: String
    var locationSetting: String
    var syllabusTag: String
    var loci: [BiologyPalaceLocus]
}

enum BiologyMemoryPalaceCatalog {
    static let defaultPalaces: [BiologyMemoryPalace] = [
        BiologyMemoryPalace(
            id: "palace-marine-drive-nutrients",
            title: "Marine Drive Promenade — The 7 Nutrients & Food Tests",
            locationSetting: "Walking north from Nariman Point along the tetrapods to Girgaum Chowpatty",
            syllabusTag: "Unit 7.1 & Ch 4",
            loci: [
                BiologyPalaceLocus(
                    id: "md-1",
                    orderIndex: 1,
                    stationName: "1. Nariman Point Corner Tetrapods",
                    sensoryHook: "A giant steaming loaf of bread and rice drizzled with amber iodine drops turning blue-black on the grey tetrapod stone.",
                    biologicalTargetFact: "Carbohydrates (starch and sugars) provide fast respiratory energy; iodine solution turns from yellow-brown to blue-black with starch, and Benedict's solution turns from blue to brick-red when heated with reducing sugars.",
                    keyTerms: ["carbohydrates", "energy", "iodine", "blue-black", "benedict", "brick-red"]
                ),
                BiologyPalaceLocus(
                    id: "md-2",
                    orderIndex: 2,
                    stationName: "2. Cricket Gymkhana Floodlights",
                    sensoryHook: "Cracked eggs and paneer blocks stacked under a violet spotlight glowing lilac.",
                    biologicalTargetFact: "Proteins build new cells for growth and repair and form enzymes and antibodies; Biuret reagent turns from blue to lilac-purple in the presence of peptide bonds.",
                    keyTerms: ["proteins", "growth", "repair", "enzymes", "biuret", "purple"]
                ),
                BiologyPalaceLocus(
                    id: "md-3",
                    orderIndex: 3,
                    stationName: "3. Art Deco Sea-Facing Balcony",
                    sensoryHook: "Golden ghee and butter coating the balcony railing like a waterproof winter jacket, shaken in ethanol to make a milky cloud.",
                    biologicalTargetFact: "Lipids (fats and oils) store concentrated long-term energy (37 kJ/g), insulate the body against heat loss, and build cell membranes; the ethanol emulsion test produces a milky-white emulsion.",
                    keyTerms: ["lipids", "energy", "insulate", "membranes", "ethanol", "milky"]
                ),
                BiologyPalaceLocus(
                    id: "md-4",
                    orderIndex: 4,
                    stationName: "4. Promenade Palm Bench",
                    sensoryHook: "Bright orange carrots (Vitamin A for night vision), citrus lemons (Vitamin C for gums/collagen), and morning sunlight (Vitamin D for bone calcium).",
                    biologicalTargetFact: "Vitamin A maintains retina vision (night blindness if deficient); Vitamin C builds skin and gum collagen (scurvy if deficient); Vitamin D helps absorb calcium for strong bones (rickets if deficient).",
                    keyTerms: ["vitamin", "vision", "scurvy", "collagen", "calcium", "rickets"]
                ),
                BiologyPalaceLocus(
                    id: "md-5",
                    orderIndex: 5,
                    stationName: "5. Sea-Wall Cast-Iron Lamp Post",
                    sensoryHook: "Chalk-white milk bottles tied to a red iron anchor pumping oxygen-rich blood.",
                    biologicalTargetFact: "Calcium mineral ions harden bones and teeth; iron mineral ions form the core of haemoglobin inside red blood cells to carry oxygen (iron deficiency causes anaemia and fatigue).",
                    keyTerms: ["calcium", "bones", "iron", "haemoglobin", "oxygen", "anaemia"]
                ),
                BiologyPalaceLocus(
                    id: "md-6",
                    orderIndex: 6,
                    stationName: "6. Chowpatty Beach Water Fountain",
                    sensoryHook: "Woven green plant-fibre ropes sweeping a glass pipe while clear water dissolves glowing crystals.",
                    biologicalTargetFact: "Dietary fibre (cellulose) provides bulk for peristalsis to prevent constipation, while water acts as the universal solvent for blood plasma, cytoplasmic reactions, and sweat cooling.",
                    keyTerms: ["fibre", "peristalsis", "constipation", "water", "solvent", "plasma"]
                )
            ]
        ),
        BiologyMemoryPalace(
            id: "palace-study-desk-breathing",
            title: "Study Desk to Balcony — Pathway of Air & Ventilation",
            locationSetting: "From your bedroom door across the study desk to the balcony breeze",
            syllabusTag: "Unit 1.1–1.3 & Ch 8",
            loci: [
                BiologyPalaceLocus(
                    id: "sd-1",
                    orderIndex: 1,
                    stationName: "1. Bedroom Doorframe & Curtain",
                    sensoryHook: "Sticky mucus ribbons and waving microscopic broom-hairs (cilia) sweeping dust upwards at the doorway.",
                    biologicalTargetFact: "Goblet cells secrete sticky mucus to trap dust and pathogens, while ciliated epithelial cells beat rhythmically to sweep mucus up to the throat.",
                    keyTerms: ["goblet", "mucus", "ciliated", "cilia", "pathogens"]
                ),
                BiologyPalaceLocus(
                    id: "sd-2",
                    orderIndex: 2,
                    stationName: "2. Desk Lamp Gooseneck",
                    sensoryHook: "C-shaped cartilage rings keeping the lamp neck open so it never collapses when you bend it.",
                    biologicalTargetFact: "The trachea (windpipe) and bronchi are reinforced with C-shaped rings of cartilage that prevent the airway from collapsing when air pressure drops during inhalation.",
                    keyTerms: ["trachea", "bronchi", "cartilage", "collapsing", "pressure"]
                ),
                BiologyPalaceLocus(
                    id: "sd-3",
                    orderIndex: 3,
                    stationName: "3. Bookshelf Accordion Folder",
                    sensoryHook: "External intercostal cables pulling the shelf ribs upwards and outwards while the desk-drawer diaphragm flattens downwards.",
                    biologicalTargetFact: "During inhalation, external intercostal muscles contract to pull the ribcage upwards and outwards, and the diaphragm muscle contracts and flattens downwards.",
                    keyTerms: ["inhalation", "intercostal", "contract", "diaphragm", "flattens"]
                ),
                BiologyPalaceLocus(
                    id: "sd-4",
                    orderIndex: 4,
                    stationName: "4. Window Glass Bell-Jar",
                    sensoryHook: "As the room expands, a giant barometer needle drops below outside sea-breeze pressure, and air rushes in through the open window.",
                    biologicalTargetFact: "Thoracic volume increases, which decreases air pressure inside the lungs below atmospheric pressure, causing air to flow down the pressure gradient into the lungs.",
                    keyTerms: ["volume", "increases", "pressure", "decreases", "atmospheric"]
                ),
                BiologyPalaceLocus(
                    id: "sd-5",
                    orderIndex: 5,
                    stationName: "5. Balcony Grapevine Cluster (Alveoli)",
                    sensoryHook: "Millions of tissue-thin soap bubbles wrapped in a single-file red capillary train.",
                    biologicalTargetFact: "Alveoli maximise diffusion rate via a huge total surface area, walls only one cell thick (squamous epithelium), a dense capillary network maintaining a steep concentration gradient, and a moist lining.",
                    keyTerms: ["alveoli", "surface", "one cell thick", "capillary", "gradient", "diffusion"]
                )
            ]
        ),
        BiologyMemoryPalace(
            id: "palace-sgnp-selection",
            title: "SGNP Banyan Trail — 6-Step Natural Selection Recipe",
            locationSetting: "Walking the Kanheri trail in Sanjay Gandhi National Park",
            syllabusTag: "Ch 14 & Unit 4",
            loci: [
                BiologyPalaceLocus(
                    id: "sg-1",
                    orderIndex: 1,
                    stationName: "1. Park Gate — Overproduction & Variation",
                    sensoryHook: "Thousands of beetles pouring through the gate with different shell thicknesses caused by random DNA mutations.",
                    biologicalTargetFact: "Organisms produce more offspring than the environment can support, and individuals in a population show genetic variation due to random mutations in alleles.",
                    keyTerms: ["offspring", "variation", "random", "mutations", "alleles"]
                ),
                BiologyPalaceLocus(
                    id: "sg-2",
                    orderIndex: 2,
                    stationName: "2. Monsoon Stream Crossing — Selection Pressure",
                    sensoryHook: "Hungry drongo birds and drought heat acting as an environmental filter along the stream.",
                    biologicalTargetFact: "Environmental selection pressures (predation, disease, drought, competition for food) create a struggle for existence.",
                    keyTerms: ["selection", "pressure", "competition", "predation", "environment"]
                ),
                BiologyPalaceLocus(
                    id: "sg-3",
                    orderIndex: 3,
                    stationName: "3. Ancient Banyan Aerial Roots — Differential Survival",
                    sensoryHook: "Camouflaged bark-coloured beetles surviving on the roots while bright beetles are eaten.",
                    biologicalTargetFact: "Individuals already possessing advantageous alleles are better adapted to survive in that environment (organisms never mutate 'in order to' adapt).",
                    keyTerms: ["advantageous", "adapted", "survive", "alleles"]
                ),
                BiologyPalaceLocus(
                    id: "sg-4",
                    orderIndex: 4,
                    stationName: "4. Kanheri Rock Steps — Reproduction & Inheritance",
                    sensoryHook: "Surviving beetles laying eggs on the warm basalt steps, passing their DNA instructions to the next generation.",
                    biologicalTargetFact: "The surviving individuals reproduce and pass their advantageous alleles on to their offspring, increasing the frequency of those alleles over many generations.",
                    keyTerms: ["reproduce", "pass", "offspring", "frequency", "generations"]
                )
            ]
        ),
        BiologyMemoryPalace(
            id: "palace-kitchen-mitosis",
            title: "Kitchen Counter — Cell Cycle & Mitosis (I-PMAT-C)",
            locationSetting: "Five stations along your kitchen counter from sink to oven",
            syllabusTag: "Ch 12 & Unit 7.3",
            loci: [
                BiologyPalaceLocus(
                    id: "kc-1",
                    orderIndex: 1,
                    stationName: "1. Kitchen Sink — Interphase (DNA Copying)",
                    sensoryHook: "Photocopying recipe scrolls and doubling mitochondrial batteries before cooking begins.",
                    biologicalTargetFact: "During Interphase (90% of the cell cycle), the cell grows, synthesises proteins, replicates its organelles, and semi-conservatively duplicates every DNA molecule into two sister chromatids.",
                    keyTerms: ["interphase", "replicates", "duplicates", "dna", "chromatids"]
                ),
                BiologyPalaceLocus(
                    id: "kc-2",
                    orderIndex: 2,
                    stationName: "2. Spice Rack — Prophase & Metaphase",
                    sensoryHook: "Thick knotted noodles condensing while the nuclear bowl dissolves, then lining up single-file along the middle chopping-board equator.",
                    biologicalTargetFact: "In Prophase chromosomes condense and the nuclear envelope breaks down; in Metaphase spindle fibres attach to centromeres and align chromosomes along the cell equator.",
                    keyTerms: ["prophase", "condense", "metaphase", "spindle", "equator"]
                ),
                BiologyPalaceLocus(
                    id: "kc-3",
                    orderIndex: 3,
                    stationName: "3. Twin Stove Burners — Anaphase & Telophase",
                    sensoryHook: "Spindle strings winching sister chromatids apart to opposite burners, then two new glass lids forming around two identical sets.",
                    biologicalTargetFact: "In Anaphase spindle fibres contract to pull sister chromatids to opposite poles; in Telophase two nuclear membranes reform, followed by Cytokinesis producing two genetically identical diploid daughter cells.",
                    keyTerms: ["anaphase", "sister chromatids", "poles", "telophase", "identical", "diploid"]
                )
            ]
        )
    ]
}

// MARK: - Biology Memory Palace Studio View

struct BiologyMemoryPalaceView: View {
    @State private var palaces: [BiologyMemoryPalace] = BiologyMemoryPalaceCatalog.defaultPalaces
    @State private var selectedPalaceID: String = "palace-marine-drive-nutrients"
    @State private var isGuidedWalkActive: Bool = false
    @State private var currentWalkIndex: Int = 0
    @State private var spokenOrTypedRecall: String = ""
    @State private var walkRevealed: Bool = false
    @State private var lastEvaluation: BiologicalRecallEvaluation?

    @State private var newStationName: String = ""
    @State private var newSensoryHook: String = ""
    @State private var newBiologicalFact: String = ""

    private static let customPalacesKey = "kymbio.palaces.saved"

    private var activePalace: BiologyMemoryPalace {
        palaces.first(where: { $0.id == selectedPalaceID }) ?? palaces[0]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.md) {
            // Palace selector chips + Guided Walk toggle
            HStack(spacing: Spacing.xs) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: Spacing.xs) {
                        ForEach(palaces) { palace in
                            JournalChip(
                                palace.title,
                                systemImage: "building.columns.fill",
                                isSelected: palace.id == selectedPalaceID
                            ) {
                                selectedPalaceID = palace.id
                                currentWalkIndex = 0
                                resetWalkStep()
                            }
                        }
                    }
                }

                Spacer()

                Button {
                    isGuidedWalkActive.toggle()
                    currentWalkIndex = 0
                    resetWalkStep()
                } label: {
                    Label(
                        isGuidedWalkActive ? "Exit guided walk" : "Start guided walk",
                        systemImage: isGuidedWalkActive ? "xmark.circle" : "figure.walk.motion"
                    )
                }
                .buttonStyle(
                    JournalCapsuleButtonStyle(
                        prominence: isGuidedWalkActive ? .filled : .tinted,
                        size: .small
                    )
                )
                .accessibilityIdentifier("memory-palace.toggle-walk")
            }

            if isGuidedWalkActive {
                guidedWalkSection(for: activePalace)
            } else {
                lociOverviewSection(for: activePalace)
            }
        }
        .onAppear {
            if let data = UserDefaults.standard.data(forKey: Self.customPalacesKey),
               let decoded = try? JSONDecoder().decode([BiologyMemoryPalace].self, from: data),
               !decoded.isEmpty {
                palaces = decoded
            }
        }
    }

    // MARK: - Guided Walk Recall Mode

    @ViewBuilder
    private func guidedWalkSection(for palace: BiologyMemoryPalace) -> some View {
        let safeIndex = min(max(currentWalkIndex, 0), max(palace.loci.count - 1, 0))
        let locus = palace.loci[safeIndex]

        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.md) {
                HStack {
                    JournalChip("Station \(safeIndex + 1) of \(palace.loci.count)", systemImage: "mappin.and.ellipse", tone: .accent)
                    Text(palace.title)
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaMutedInk)
                    Spacer()
                    JournalChip(palace.syllabusTag, tone: .neutral)
                }

                Text(locus.stationName)
                    .font(.kymaiaTitle3)
                    .foregroundStyle(Color.kymaiaInk)

                VStack(alignment: .leading, spacing: Spacing.xs) {
                    Label("Sensory locus cue (visualise this place before retrieving the biology):", systemImage: "eye.fill")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaPrimary)
                    Text(locus.sensoryHook)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaInk)
                        .padding(Spacing.sm)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .fill(Color.kymaiaElevatedSurface)
                        )
                }

                VStack(alignment: .leading, spacing: Spacing.xs) {
                    HStack {
                        Text("Speak or type the biological mechanism stored at this station")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaMutedInk)
                        Spacer()
                        VoiceDictationButton(text: $spokenOrTypedRecall, label: "Speak recall")
                    }

                    WritingTextEditor(text: $spokenOrTypedRecall, serif: true)
                        .learnerTextInput(.retrieval)
                        .frame(minHeight: 96)
                        .padding(Spacing.xs)
                        .background(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .fill(Color.kymaiaElevatedSurface)
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .strokeBorder(Color.kymaiaControlBorder, lineWidth: 1)
                        )
                }

                HStack(spacing: Spacing.sm) {
                    Button {
                        lastEvaluation = AnswerComparison.evaluateRecall(
                            spoken: spokenOrTypedRecall,
                            expected: locus.biologicalTargetFact,
                            keyTerms: locus.keyTerms
                        )
                        walkRevealed = true
                    } label: {
                        Label("Check station recall", systemImage: "checkmark.seal.fill")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .regular))

                    if safeIndex > 0 {
                        Button("Previous station") {
                            currentWalkIndex -= 1
                            resetWalkStep()
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .regular))
                    }

                    Spacer()

                    if safeIndex + 1 < palace.loci.count {
                        Button {
                            currentWalkIndex += 1
                            resetWalkStep()
                        } label: {
                            Label("Next station", systemImage: "arrow.right")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .regular))
                    }
                }

                if walkRevealed {
                    Divider()
                    if let eval = lastEvaluation {
                        VStack(alignment: .leading, spacing: Spacing.xs) {
                            Text(eval.feedbackSummary)
                                .font(.kymaiaBody.weight(.semibold))
                                .foregroundStyle(eval.combinedScore >= 0.75 ? Color.kymaiaSuccess : Color.kymaiaWarning)

                            if !eval.matchedKeyTerms.isEmpty {
                                Text("Matched terms: \(eval.matchedKeyTerms.joined(separator: " · "))")
                                    .font(.kymaiaCaption)
                                    .foregroundStyle(Color.kymaiaSuccess)
                            }
                            if !eval.missingKeyTerms.isEmpty {
                                Text("Terms to reinforce: \(eval.missingKeyTerms.joined(separator: " · "))")
                                    .font(.kymaiaCaption)
                                    .foregroundStyle(Color.kymaiaWarning)
                            }
                        }
                    }

                    VStack(alignment: .leading, spacing: 4) {
                        Text("Canonical biological anchor at this station:")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaMutedInk)
                        Text(locus.biologicalTargetFact)
                            .font(.kymaiaSerifProse)
                            .foregroundStyle(Color.kymaiaInk)
                    }
                }
            }
        }
    }

    // MARK: - Loci Overview & Builder Mode

    @ViewBuilder
    private func lociOverviewSection(for palace: BiologyMemoryPalace) -> some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.xs) {
                HStack {
                    JournalChip(palace.syllabusTag, systemImage: "mappin.circle.fill", tone: .accent)
                    Text(palace.title)
                        .font(.kymaiaSubheadline)
                        .foregroundStyle(Color.kymaiaInk)
                    Spacer()
                    Text("\(palace.loci.count) stations")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaMutedInk)
                }
                Text(palace.locationSetting)
                    .font(.kymaiaCaption)
                    .foregroundStyle(Color.kymaiaSecondaryInk)
            }
        }

        ForEach(palace.loci) { locus in
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.xs) {
                    HStack {
                        Text(locus.stationName)
                            .font(.kymaiaSubheadline)
                            .foregroundStyle(Color.kymaiaInk)
                        Spacer()
                        Button {
                            currentWalkIndex = max(0, locus.orderIndex - 1)
                            isGuidedWalkActive = true
                            resetWalkStep()
                        } label: {
                            Label("Test from here", systemImage: "figure.walk")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                    }

                    Label(locus.sensoryHook, systemImage: "sparkles")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaPrimary)

                    Text(locus.biologicalTargetFact)
                        .font(.kymaiaSerifProse)
                        .foregroundStyle(Color.kymaiaSecondaryInk)

                    FlowLayout(spacing: 6) {
                        ForEach(locus.keyTerms, id: \.self) { term in
                            JournalChip(term, tone: .neutral)
                        }
                    }
                }
            }
        }

        // Add Custom Locus Station
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                Label("Add a new spatial locus station to '\(palace.title)'", systemImage: "plus.circle.fill")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaPrimary)

                TextField("Physical landmark (e.g., 7. Balcony Hibiscus Pot)", text: $newStationName)
                    .learnerTextInput(.reflection)
                    .textFieldStyle(.roundedBorder)

                TextField("Vivid sensory hook (what bizarre action do you see there?)", text: $newSensoryHook)
                    .learnerTextInput(.reflection)
                    .textFieldStyle(.roundedBorder)

                HStack(spacing: Spacing.sm) {
                    TextField("Exact biological fact to anchor at this station", text: $newBiologicalFact)
                        .learnerTextInput(.reflection)
                        .textFieldStyle(.roundedBorder)

                    Button {
                        appendStation()
                    } label: {
                        Label("Add station", systemImage: "plus")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                    .disabled(
                        newStationName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ||
                        newBiologicalFact.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                    )
                }
            }
        }
    }

    private func resetWalkStep() {
        spokenOrTypedRecall = ""
        walkRevealed = false
        lastEvaluation = nil
    }

    private func appendStation() {
        guard let idx = palaces.firstIndex(where: { $0.id == selectedPalaceID }) else { return }
        let nextOrder = palaces[idx].loci.count + 1
        let newLocus = BiologyPalaceLocus(
            id: "custom-\(UUID().uuidString.prefix(8))",
            orderIndex: nextOrder,
            stationName: newStationName.trimmingCharacters(in: .whitespacesAndNewlines),
            sensoryHook: newSensoryHook.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                ? "Vivid anchor at \(newStationName)"
                : newSensoryHook.trimmingCharacters(in: .whitespacesAndNewlines),
            biologicalTargetFact: newBiologicalFact.trimmingCharacters(in: .whitespacesAndNewlines),
            keyTerms: []
        )
        palaces[idx].loci.append(newLocus)
        newStationName = ""
        newSensoryHook = ""
        newBiologicalFact = ""
        if let encoded = try? JSONEncoder().encode(palaces) {
            UserDefaults.standard.set(encoded, forKey: Self.customPalacesKey)
        }
    }
}
