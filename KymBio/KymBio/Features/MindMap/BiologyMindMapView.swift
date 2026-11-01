import SwiftUI

// MARK: - Biology Concept Graph Models & Testable Engine

enum BiologyConceptDomain: String, CaseIterable, Codable, Identifiable {
    case livingWorld = "Living World"
    case cambridgeBio = "Cambridge Bio (1, 4, 7)"
    case physicsChemBridge = "Chem & Physics Bridges"
    case customNote = "Your Custom Nodes"

    var id: String { rawValue }

    var symbolName: String {
        switch self {
        case .livingWorld: return "leaf.fill"
        case .cambridgeBio: return "book.closed.fill"
        case .physicsChemBridge: return "atom"
        case .customNote: return "pencil.and.outline"
        }
    }
}

struct BiologyConceptNode: Identifiable, Codable, Equatable {
    let id: String
    var title: String
    var subtitle: String
    var domain: BiologyConceptDomain
    var linkedChapterID: String?
    var linkedTopicID: String?
    var normalizedX: Double
    var normalizedY: Double
    var keyMechanismSummary: String
}

struct BiologyConceptEdge: Identifiable, Codable, Equatable {
    var id: String { "\(fromNodeID)->\(toNodeID)" }
    let fromNodeID: String
    let toNodeID: String
    let causalRelationLabel: String
}

enum BiologyConceptGraphEngine {
    static let defaultNodes: [BiologyConceptNode] = [
        BiologyConceptNode(
            id: "node-ch02-cells",
            title: "Ch 2 · Cells & SA:V Ratio",
            subtitle: "Compartments & membranes",
            domain: .livingWorld,
            linkedChapterID: "ch02",
            linkedTopicID: "1.2",
            normalizedX: 0.22,
            normalizedY: 0.20,
            keyMechanismSummary: "As cell radius doubles, surface-area-to-volume ratio halves (SA/V = 6/L), forcing large organisms to fold surfaces (alveoli, villi, cristae)."
        ),
        BiologyConceptNode(
            id: "node-ch03-osmosis",
            title: "Ch 3 · Diffusion & Osmosis",
            subtitle: "Water potential & turgor",
            domain: .livingWorld,
            linkedChapterID: "ch03",
            linkedTopicID: "1.2",
            normalizedX: 0.48,
            normalizedY: 0.16,
            keyMechanismSummary: "Net movement of water molecules from higher water potential (dilute solution) to lower water potential (concentrated solution) across a partially permeable membrane."
        ),
        BiologyConceptNode(
            id: "node-bridge-pressure",
            title: "Unit 3.6 & 3.7 · Gas Pressure & Particle Motion",
            subtitle: "Physics Bridge",
            domain: .physicsChemBridge,
            linkedChapterID: "ch08",
            linkedTopicID: "3.6",
            normalizedX: 0.78,
            normalizedY: 0.20,
            keyMechanismSummary: "Increasing thoracic volume lowers air pressure inside the lungs below atmospheric pressure (P ∝ 1/V); random thermal motion drives alveolar diffusion."
        ),
        BiologyConceptNode(
            id: "node-u1-respiration",
            title: "Unit 1 · Respiration & Gas Exchange",
            subtitle: "Cambridge Science 8 (1.1–1.5)",
            domain: .cambridgeBio,
            linkedChapterID: "ch06",
            linkedTopicID: "1.4",
            normalizedX: 0.74,
            normalizedY: 0.48,
            keyMechanismSummary: "Breathing ventilates the alveoli by volume/pressure changes; aerobic respiration is the exothermic chemical reaction inside mitochondria releasing energy from glucose."
        ),
        BiologyConceptNode(
            id: "node-ch04-enzymes",
            title: "Ch 4 · Biomolecules & Enzymes",
            subtitle: "Biological catalysts",
            domain: .livingWorld,
            linkedChapterID: "ch04",
            linkedTopicID: "7.1",
            normalizedX: 0.20,
            normalizedY: 0.50,
            keyMechanismSummary: "Enzymes lower activation energy via complementary active-site geometry; extreme temperature or pH denatures the active site irreversibly."
        ),
        BiologyConceptNode(
            id: "node-u7-diet",
            title: "Unit 7 · Diet, Growth & Moving the Body",
            subtitle: "Cambridge Science 8 (7.1–7.4)",
            domain: .cambridgeBio,
            linkedChapterID: "ch07",
            linkedTopicID: "7.1",
            normalizedX: 0.48,
            normalizedY: 0.50,
            keyMechanismSummary: "Digestion hydrolyses polymers into soluble monomers absorbed across villi; antagonistic muscle pairs (biceps/triceps) pull on bones across synovial joints."
        ),
        BiologyConceptNode(
            id: "node-bridge-enthalpy",
            title: "Unit 8.1 & 8.2 · Exothermic & Endothermic",
            subtitle: "Chemistry Bridge",
            domain: .physicsChemBridge,
            linkedChapterID: "ch06",
            linkedTopicID: "8.1",
            normalizedX: 0.82,
            normalizedY: 0.78,
            keyMechanismSummary: "Cellular respiration is exothermic (releases energy to make ATP and warm blood); photosynthesis is endothermic (traps light energy in C–H/C–C bonds)."
        ),
        BiologyConceptNode(
            id: "node-ch05-photosynthesis",
            title: "Ch 5 · Photosynthesis & Carbon Fixation",
            subtitle: "Chloroplast energy capture",
            domain: .livingWorld,
            linkedChapterID: "ch05",
            linkedTopicID: "4.1",
            normalizedX: 0.24,
            normalizedY: 0.80,
            keyMechanismSummary: "Chlorophyll absorbs red and blue wavelengths to split water and reduce atmospheric CO2 into glucose, building plant biomass primarily from air and water."
        ),
        BiologyConceptNode(
            id: "node-u4-ecosystems",
            title: "Unit 4 & Ch 14–15 · Ecosystems & Selection",
            subtitle: "Trophic webs & bioaccumulation",
            domain: .cambridgeBio,
            linkedChapterID: "ch15",
            linkedTopicID: "4.4",
            normalizedX: 0.52,
            normalizedY: 0.82,
            keyMechanismSummary: "Only ~10% of biomass energy transfers up each trophic level because ~90% is lost as respiratory heat and detritus; persistent toxins bioaccumulate in apex predators."
        )
    ]

    static let defaultEdges: [BiologyConceptEdge] = [
        BiologyConceptEdge(
            fromNodeID: "node-ch02-cells",
            toNodeID: "node-ch03-osmosis",
            causalRelationLabel: "SA:V governs membrane flux rate"
        ),
        BiologyConceptEdge(
            fromNodeID: "node-ch03-osmosis",
            toNodeID: "node-u1-respiration",
            causalRelationLabel: "steep concentration gradient drives O2/CO2 diffusion"
        ),
        BiologyConceptEdge(
            fromNodeID: "node-bridge-pressure",
            toNodeID: "node-u1-respiration",
            causalRelationLabel: "diaphragm increases V -> lowers P -> air flows in"
        ),
        BiologyConceptEdge(
            fromNodeID: "node-ch04-enzymes",
            toNodeID: "node-u7-diet",
            causalRelationLabel: "amylase, protease & lipase catalyse digestion"
        ),
        BiologyConceptEdge(
            fromNodeID: "node-u7-diet",
            toNodeID: "node-u1-respiration",
            causalRelationLabel: "absorbed glucose delivered via hepatic portal vein & blood plasma"
        ),
        BiologyConceptEdge(
            fromNodeID: "node-bridge-enthalpy",
            toNodeID: "node-u1-respiration",
            causalRelationLabel: "exothermic bond oxidation powers mitochondrial ATP"
        ),
        BiologyConceptEdge(
            fromNodeID: "node-ch05-photosynthesis",
            toNodeID: "node-u1-respiration",
            causalRelationLabel: "produces glucose + O2 reactants for aerobic respiration"
        ),
        BiologyConceptEdge(
            fromNodeID: "node-ch05-photosynthesis",
            toNodeID: "node-u4-ecosystems",
            causalRelationLabel: "primary producers fix carbon at base of food web"
        ),
        BiologyConceptEdge(
            fromNodeID: "node-u1-respiration",
            toNodeID: "node-u4-ecosystems",
            causalRelationLabel: "90% respiratory heat loss explains 10% trophic pyramid"
        )
    ]

    /// Returns direct neighbor nodes and connecting edges for a given `nodeID`.
    static func neighborhood(
        for nodeID: String,
        nodes: [BiologyConceptNode],
        edges: [BiologyConceptEdge]
    ) -> (neighbors: [BiologyConceptNode], incidentEdges: [BiologyConceptEdge]) {
        let incident = edges.filter { $0.fromNodeID == nodeID || $0.toNodeID == nodeID }
        let neighborIDs = Set(incident.map { $0.fromNodeID == nodeID ? $0.toNodeID : $0.fromNodeID })
        let neighborNodes = nodes.filter { neighborIDs.contains($0.id) }
        return (neighborNodes, incident)
    }

    /// Breadth-first causal path finder between any two concept nodes.
    static func shortestCausalPath(
        from startID: String,
        to targetID: String,
        edges: [BiologyConceptEdge]
    ) -> [String] {
        if startID == targetID { return [startID] }
        var adjacency: [String: [String]] = [:]
        for edge in edges {
            adjacency[edge.fromNodeID, default: []].append(edge.toNodeID)
            adjacency[edge.toNodeID, default: []].append(edge.fromNodeID)
        }

        var queue: [[String]] = [[startID]]
        var visited: Set<String> = [startID]

        while !queue.isEmpty {
            let path = queue.removeFirst()
            guard let last = path.last else { continue }
            for next in adjacency[last, default: []] where !visited.contains(next) {
                let nextPath = path + [next]
                if next == targetID {
                    return nextPath
                }
                visited.insert(next)
                queue.append(nextPath)
            }
        }
        return []
    }
}

// MARK: - Interactive Biology Concept Mind-Map View

struct BiologyMindMapView: View {
    @EnvironmentObject private var store: AppStore
    @State private var nodes: [BiologyConceptNode] = BiologyConceptGraphEngine.defaultNodes
    @State private var edges: [BiologyConceptEdge] = BiologyConceptGraphEngine.defaultEdges
    @State private var selectedNodeID: String = "node-u1-respiration"
    @State private var selectedDomainFilter: BiologyConceptDomain?
    @State private var zoomScale: CGFloat = 1.0
    @State private var newCustomTitle: String = ""
    @State private var newCustomMechanism: String = ""
    @State private var newEdgeRelation: String = "connects mechanistically to"

    private static let customNodesKey = "kymbio.mindmap.customNodes"
    private static let customEdgesKey = "kymbio.mindmap.customEdges"

    private var visibleNodes: [BiologyConceptNode] {
        guard let filter = selectedDomainFilter else { return nodes }
        return nodes.filter { $0.domain == filter || $0.id == selectedNodeID }
    }

    private var selectedNode: BiologyConceptNode? {
        nodes.first(where: { $0.id == selectedNodeID }) ?? nodes.first
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.md) {
            // Domain filter bar + zoom controls
            HStack(spacing: Spacing.xs) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: Spacing.xs) {
                        JournalChip(
                            "All domains (\(nodes.count))",
                            systemImage: "circle.hexagongrid.fill",
                            isSelected: selectedDomainFilter == nil
                        ) {
                            selectedDomainFilter = nil
                        }
                        ForEach(BiologyConceptDomain.allCases) { domain in
                            JournalChip(
                                domain.rawValue,
                                systemImage: domain.symbolName,
                                isSelected: selectedDomainFilter == domain
                            ) {
                                selectedDomainFilter = domain
                            }
                        }
                    }
                }

                Spacer()

                HStack(spacing: 4) {
                    Button {
                        zoomScale = max(0.75, zoomScale - 0.15)
                    } label: {
                        Image(systemName: "minus.magnifyingglass")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                    .accessibilityLabel("Zoom out concept map")

                    Button {
                        zoomScale = 1.0
                    } label: {
                        Text("\(Int(zoomScale * 100))%")
                            .font(.kymaiaCaption.monospacedDigit())
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))

                    Button {
                        zoomScale = min(1.45, zoomScale + 0.15)
                    } label: {
                        Image(systemName: "plus.magnifyingglass")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                    .accessibilityLabel("Zoom in concept map")
                }
            }

            // Interactive Causal Concept Graph Canvas
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    HStack {
                        Label("Interactive Biology & Science 8 Causal Concept Graph", systemImage: "point.3.connected.trianglepath.dotted")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaPrimary)
                        Spacer()
                        Text("Tap any node to inspect its causal links and open its chapter or school unit")
                            .font(.kymaiaCaption)
                            .foregroundStyle(Color.kymaiaMutedInk)
                    }

                    GeometryReader { geo in
                        let width = max(geo.size.width * zoomScale, 560)
                        let height = max(360 * zoomScale, 360)

                        ScrollView([.horizontal, .vertical], showsIndicators: true) {
                            ZStack(alignment: .topLeading) {
                                // Edges canvas
                                Canvas { context, size in
                                    for edge in edges {
                                        guard let fromNode = visibleNodes.first(where: { $0.id == edge.fromNodeID }),
                                              let toNode = visibleNodes.first(where: { $0.id == edge.toNodeID }) else {
                                            continue
                                        }
                                        let p1 = CGPoint(x: fromNode.normalizedX * size.width, y: fromNode.normalizedY * size.height)
                                        let p2 = CGPoint(x: toNode.normalizedX * size.width, y: toNode.normalizedY * size.height)

                                        let isHighlighted = (edge.fromNodeID == selectedNodeID || edge.toNodeID == selectedNodeID)
                                        var path = Path()
                                        path.move(to: p1)
                                        path.addLine(to: p2)

                                        context.stroke(
                                            path,
                                            with: .color(isHighlighted ? Color.kymaiaPrimary : Color.kymaiaControlBorder),
                                            style: StrokeStyle(
                                                lineWidth: isHighlighted ? 2.6 : 1.3,
                                                dash: isHighlighted ? [] : [5, 4]
                                            )
                                        )
                                    }
                                }
                                .frame(width: width, height: height)

                                // Nodes overlay
                                ForEach(visibleNodes) { node in
                                    let isSelected = node.id == selectedNodeID
                                    let isNeighbor = edges.contains {
                                        ($0.fromNodeID == selectedNodeID && $0.toNodeID == node.id) ||
                                        ($0.toNodeID == selectedNodeID && $0.fromNodeID == node.id)
                                    }

                                    Button {
                                        withAnimation(.easeInOut(duration: 0.18)) {
                                            selectedNodeID = node.id
                                        }
                                    } label: {
                                        VStack(alignment: .leading, spacing: 2) {
                                            HStack(spacing: 4) {
                                                Image(systemName: node.domain.symbolName)
                                                    .font(.kymaiaCaption)
                                                Text(node.title)
                                                    .font(.kymaiaCaption.weight(.semibold))
                                                    .lineLimit(2)
                                            }
                                            Text(node.subtitle)
                                                .font(.kymaiaCaption2)
                                                .foregroundStyle(isSelected ? Color.white.opacity(0.88) : Color.kymaiaMutedInk)
                                                .lineLimit(1)
                                        }
                                        .padding(.horizontal, Spacing.sm)
                                        .padding(.vertical, Spacing.xs)
                                        .frame(width: 176, alignment: .leading)
                                        .foregroundStyle(isSelected ? Color.white : Color.kymaiaInk)
                                        .background(
                                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                                .fill(isSelected ? Color.kymaiaPrimary : Color.kymaiaSurface)
                                        )
                                        .overlay(
                                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                                .strokeBorder(
                                                    isSelected
                                                        ? Color.kymaiaPrimaryStrong
                                                        : (isNeighbor ? Color.kymaiaPrimary : Color.kymaiaControlBorder),
                                                    lineWidth: isSelected || isNeighbor ? 2 : 1
                                                )
                                        )
                                    }
                                    .buttonStyle(.plain)
                                    .position(
                                        x: node.normalizedX * width,
                                        y: node.normalizedY * height
                                    )
                                    .accessibilityIdentifier("mindmap.node.\(node.id)")
                                }
                            }
                            .frame(width: width, height: height)
                        }
                    }
                    .frame(height: 370)
                    .background(
                        RoundedRectangle(cornerRadius: CornerRadius.medium, style: .continuous)
                            .fill(Color.kymaiaElevatedSurface)
                    )
                }
            }

            // Selected Node Inspector & Causal Neighborhood
            if let current = selectedNode {
                let neighborhood = BiologyConceptGraphEngine.neighborhood(for: current.id, nodes: nodes, edges: edges)
                JournalCard {
                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        HStack {
                            JournalChip(current.domain.rawValue, systemImage: current.domain.symbolName, tone: .accent)
                            Text(current.title)
                                .font(.kymaiaSubheadline)
                                .foregroundStyle(Color.kymaiaInk)
                            Spacer()
                            if let chapterID = current.linkedChapterID {
                                Button {
                                    if let ch = Int(chapterID.replacingOccurrences(of: "ch", with: "")) {
                                        store.activeLivingWorldChapter = ch
                                    }
                                    store.selectedRoom = .livingWorld
                                } label: {
                                    Label("Open \(chapterID.uppercased())", systemImage: "book.pages")
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            }
                            if let topicID = current.linkedTopicID {
                                Button {
                                    store.selectedTopicCode = topicID
                                    if let firstDigit = topicID.split(separator: ".").first, let u = Int(firstDigit) {
                                        store.selectedUnitNumber = u
                                    }
                                    store.selectedRoom = .schoolScience
                                } label: {
                                    Label("Topic \(topicID)", systemImage: "graduationcap")
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                            }
                        }

                        Text(current.keyMechanismSummary)
                            .font(.kymaiaSerifProse)
                            .foregroundStyle(Color.kymaiaSecondaryInk)

                        Divider()

                        Text("Causal connections (\(neighborhood.incidentEdges.count))")
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(Color.kymaiaMutedInk)

                        ForEach(neighborhood.incidentEdges) { edge in
                            let otherID = edge.fromNodeID == current.id ? edge.toNodeID : edge.fromNodeID
                            let otherTitle = nodes.first(where: { $0.id == otherID })?.title ?? otherID
                            HStack(spacing: Spacing.xs) {
                                Image(systemName: edge.fromNodeID == current.id ? "arrow.right.circle.fill" : "arrow.left.circle.fill")
                                    .foregroundStyle(Color.kymaiaPrimary)
                                Text(edge.causalRelationLabel)
                                    .font(.kymaiaCaption.weight(.semibold))
                                    .foregroundStyle(Color.kymaiaInk)
                                Text("·")
                                    .foregroundStyle(Color.kymaiaMutedInk)
                                Button(otherTitle) {
                                    selectedNodeID = otherID
                                }
                                .buttonStyle(.plain)
                                .font(.kymaiaCaption)
                                .foregroundStyle(Color.kymaiaPrimary)
                            }
                        }
                    }
                }
            }

            // Add Custom Concept Node Connected to Selected Node
            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Label("Pin your own concept node linked to '\(selectedNode?.title ?? "current node")'", systemImage: "plus.circle.fill")
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaPrimary)

                    HStack(spacing: Spacing.sm) {
                        TextField("Concept title (e.g., Mangrove salt glands)", text: $newCustomTitle)
                            .learnerTextInput(.reflection)
                            .textFieldStyle(.roundedBorder)
                        TextField("Causal link (e.g., actively excretes NaCl via ATP)", text: $newEdgeRelation)
                            .learnerTextInput(.reflection)
                            .textFieldStyle(.roundedBorder)
                    }

                    HStack(spacing: Spacing.sm) {
                        TextField("One-sentence mechanism explanation", text: $newCustomMechanism)
                            .learnerTextInput(.reflection)
                            .textFieldStyle(.roundedBorder)

                        Button {
                            addCustomNode()
                        } label: {
                            Label("Add node", systemImage: "plus")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                        .disabled(newCustomTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                    }
                }
            }
        }
        .onAppear {
            loadPersistedCustomGraph()
        }
    }

    private func addCustomNode() {
        let trimmedTitle = newCustomTitle.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedTitle.isEmpty else { return }

        let anchor = selectedNode ?? nodes.first
        let jitterX = min(0.88, max(0.14, (anchor?.normalizedX ?? 0.5) + Double.random(in: -0.16...0.16)))
        let jitterY = min(0.88, max(0.14, (anchor?.normalizedY ?? 0.5) + Double.random(in: -0.16...0.16)))

        let newNode = BiologyConceptNode(
            id: "custom-\(UUID().uuidString.prefix(8))",
            title: trimmedTitle,
            subtitle: "Your custom link",
            domain: .customNote,
            linkedChapterID: anchor?.linkedChapterID,
            linkedTopicID: anchor?.linkedTopicID,
            normalizedX: jitterX,
            normalizedY: jitterY,
            keyMechanismSummary: newCustomMechanism.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                ? "Custom concept linked to \(anchor?.title ?? "Biology")."
                : newCustomMechanism.trimmingCharacters(in: .whitespacesAndNewlines)
        )
        nodes.append(newNode)
        if let anchor {
            let edge = BiologyConceptEdge(
                fromNodeID: anchor.id,
                toNodeID: newNode.id,
                causalRelationLabel: newEdgeRelation.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                    ? "connects mechanistically to"
                    : newEdgeRelation.trimmingCharacters(in: .whitespacesAndNewlines)
            )
            edges.append(edge)
        }
        selectedNodeID = newNode.id
        newCustomTitle = ""
        newCustomMechanism = ""
        savePersistedCustomGraph()
    }

    private func loadPersistedCustomGraph() {
        let customNodes: [BiologyConceptNode] = (try? JSONDecoder().decode(
            [BiologyConceptNode].self,
            from: UserDefaults.standard.data(forKey: Self.customNodesKey) ?? Data()
        )) ?? []
        let customEdges: [BiologyConceptEdge] = (try? JSONDecoder().decode(
            [BiologyConceptEdge].self,
            from: UserDefaults.standard.data(forKey: Self.customEdgesKey) ?? Data()
        )) ?? []
        nodes = BiologyConceptGraphEngine.defaultNodes + customNodes
        edges = BiologyConceptGraphEngine.defaultEdges + customEdges
    }

    private func savePersistedCustomGraph() {
        let defaultNodeIDs = Set(BiologyConceptGraphEngine.defaultNodes.map(\.id))
        let customNodes = nodes.filter { !defaultNodeIDs.contains($0.id) }
        let defaultEdgeIDs = Set(BiologyConceptGraphEngine.defaultEdges.map(\.id))
        let customEdges = edges.filter { !defaultEdgeIDs.contains($0.id) }

        if let nData = try? JSONEncoder().encode(customNodes) {
            UserDefaults.standard.set(nData, forKey: Self.customNodesKey)
        }
        if let eData = try? JSONEncoder().encode(customEdges) {
            UserDefaults.standard.set(eData, forKey: Self.customEdgesKey)
        }
    }
}
