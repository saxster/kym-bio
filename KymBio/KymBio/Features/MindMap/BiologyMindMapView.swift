import SwiftUI

// MARK: - Biology Concept Graph Models & Testable Engine

public enum BiologyConceptDomain: String, CaseIterable, Codable, Identifiable, Sendable {
    case livingWorld = "Living World"
    case cambridgeBio = "Cambridge Bio (1, 4, 7)"
    case physicsChemBridge = "Chem & Physics Bridges"
    case customNote = "Your Custom Nodes"

    public var id: String { rawValue }

    public var symbolName: String {
        switch self {
        case .livingWorld: return "leaf.fill"
        case .cambridgeBio: return "book.closed.fill"
        case .physicsChemBridge: return "atom"
        case .customNote: return "pencil.and.outline"
        }
    }
}

public struct ConceptProvenanceAnchor: Codable, Equatable, Sendable {
    public let sourceKind: String   // "chapter" | "scanned_page" | "journal_note"
    public let sourceId: String
    public let excerpt: String

    public init(sourceKind: String, sourceId: String, excerpt: String) {
        self.sourceKind = sourceKind
        self.sourceId = sourceId
        self.excerpt = excerpt
    }
}

public struct BiologyConceptNode: Identifiable, Codable, Equatable, Sendable {
    public let id: String
    public var title: String
    public var subtitle: String
    public var domain: BiologyConceptDomain
    public var linkedChapterID: String?
    public var linkedTopicID: String?
    public var normalizedX: Double
    public var normalizedY: Double
    public var keyMechanismSummary: String
    public var provenanceAnchors: [ConceptProvenanceAnchor]

    public init(
        id: String,
        title: String,
        subtitle: String,
        domain: BiologyConceptDomain,
        linkedChapterID: String? = nil,
        linkedTopicID: String? = nil,
        normalizedX: Double,
        normalizedY: Double,
        keyMechanismSummary: String,
        provenanceAnchors: [ConceptProvenanceAnchor] = []
    ) {
        self.id = id
        self.title = title
        self.subtitle = subtitle
        self.domain = domain
        self.linkedChapterID = linkedChapterID
        self.linkedTopicID = linkedTopicID
        self.normalizedX = normalizedX
        self.normalizedY = normalizedY
        self.keyMechanismSummary = keyMechanismSummary
        self.provenanceAnchors = provenanceAnchors
    }

    enum CodingKeys: String, CodingKey {
        case id, title, subtitle, domain, linkedChapterID, linkedTopicID
        case normalizedX, normalizedY, keyMechanismSummary, provenanceAnchors
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decode(String.self, forKey: .id)
        title = try c.decode(String.self, forKey: .title)
        subtitle = try c.decode(String.self, forKey: .subtitle)
        domain = try c.decode(BiologyConceptDomain.self, forKey: .domain)
        linkedChapterID = try c.decodeIfPresent(String.self, forKey: .linkedChapterID)
        linkedTopicID = try c.decodeIfPresent(String.self, forKey: .linkedTopicID)
        normalizedX = try c.decode(Double.self, forKey: .normalizedX)
        normalizedY = try c.decode(Double.self, forKey: .normalizedY)
        keyMechanismSummary = try c.decode(String.self, forKey: .keyMechanismSummary)
        provenanceAnchors = (try? c.decode([ConceptProvenanceAnchor].self, forKey: .provenanceAnchors)) ?? []
    }
}

public struct BiologyConceptEdge: Identifiable, Codable, Equatable, Sendable {
    public var id: String { "\(fromNodeIDs.joined(separator: "+"))->\(toNodeID)" }
    public let fromNodeIDs: [String]
    public var fromNodeID: String { fromNodeIDs.first ?? "" }
    public let toNodeID: String
    public let causalRelationLabel: String
    public let isJointEntailment: Bool

    public init(
        fromNodeID: String,
        toNodeID: String,
        causalRelationLabel: String,
        isJointEntailment: Bool = false
    ) {
        self.fromNodeIDs = [fromNodeID]
        self.toNodeID = toNodeID
        self.causalRelationLabel = causalRelationLabel
        self.isJointEntailment = isJointEntailment
    }

    public init(
        fromNodeIDs: [String],
        toNodeID: String,
        causalRelationLabel: String,
        isJointEntailment: Bool = true
    ) {
        self.fromNodeIDs = fromNodeIDs.isEmpty ? [""] : fromNodeIDs
        self.toNodeID = toNodeID
        self.causalRelationLabel = causalRelationLabel
        self.isJointEntailment = isJointEntailment && fromNodeIDs.count > 1
    }

    enum CodingKeys: String, CodingKey {
        case fromNodeIDs, fromNodeID, toNodeID, causalRelationLabel, isJointEntailment
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        if let multi = try? c.decode([String].self, forKey: .fromNodeIDs), !multi.isEmpty {
            fromNodeIDs = multi
        } else if let single = try? c.decode(String.self, forKey: .fromNodeID) {
            fromNodeIDs = [single]
        } else {
            fromNodeIDs = []
        }
        toNodeID = try c.decode(String.self, forKey: .toNodeID)
        causalRelationLabel = try c.decode(String.self, forKey: .causalRelationLabel)
        isJointEntailment = (try? c.decode(Bool.self, forKey: .isJointEntailment)) ?? (fromNodeIDs.count > 1)
    }

    public func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(fromNodeIDs, forKey: .fromNodeIDs)
        try c.encode(fromNodeID, forKey: .fromNodeID)
        try c.encode(toNodeID, forKey: .toNodeID)
        try c.encode(causalRelationLabel, forKey: .causalRelationLabel)
        try c.encode(isJointEntailment, forKey: .isJointEntailment)
    }
}

public enum BiologyConceptGraphEngine {
    public static var nodes: [BiologyConceptNode] { defaultNodes }
    public static var edges: [BiologyConceptEdge] { defaultEdges }
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
        ),
        BiologyConceptEdge(
            fromNodeIDs: ["node-u7-diet", "node-ch03-osmosis"],
            toNodeID: "node-u1-respiration",
            causalRelationLabel: "jointly supply absorbed glucose + diffused O2 to mitochondria",
            isJointEntailment: true
        )
    ]

    /// Returns direct neighbor nodes and connecting edges for a given `nodeID` (including multi-premise hyperedges).
    public static func neighborhood(
        for nodeID: String,
        nodes: [BiologyConceptNode],
        edges: [BiologyConceptEdge]
    ) -> (neighbors: [BiologyConceptNode], incidentEdges: [BiologyConceptEdge]) {
        let incident = edges.filter { $0.fromNodeIDs.contains(nodeID) || $0.toNodeID == nodeID }
        var neighborIDs: Set<String> = []
        for edge in incident {
            if edge.toNodeID == nodeID {
                neighborIDs.formUnion(edge.fromNodeIDs)
            } else {
                neighborIDs.insert(edge.toNodeID)
                neighborIDs.formUnion(edge.fromNodeIDs.filter { $0 != nodeID })
            }
        }
        let neighborNodes = nodes.filter { neighborIDs.contains($0.id) }
        return (neighborNodes, incident)
    }

    /// Breadth-first causal path finder between any two concept nodes.
    public static func shortestCausalPath(
        from startID: String,
        to targetID: String,
        edges: [BiologyConceptEdge]
    ) -> [String] {
        if startID == targetID { return [startID] }
        var adjacency: [String: [String]] = [:]
        for edge in edges {
            for fromID in edge.fromNodeIDs {
                adjacency[fromID, default: []].append(edge.toNodeID)
                adjacency[edge.toNodeID, default: []].append(fromID)
            }
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

    /// Ancestry-cover transitive reduction: removes single-premise shortcut edges `A -> C` when a directed path `A -> ... -> C` of length >= 2 already exists, while preserving jointly-entailing hyperedges.
    public static func simplifyRedundantEdges(edges: [BiologyConceptEdge]) -> [BiologyConceptEdge] {
        var directedAdj: [String: Set<String>] = [:]
        for edge in edges {
            for fromID in edge.fromNodeIDs {
                directedAdj[fromID, default: []].insert(edge.toNodeID)
            }
        }

        func hasAlternateDirectedPath(from start: String, to target: String) -> Bool {
            var queue: [(node: String, depth: Int)] = [(start, 0)]
            var visited: Set<String> = [start]
            while !queue.isEmpty {
                let current = queue.removeFirst()
                for next in directedAdj[current.node, default: []] {
                    if current.depth == 0 && next == target {
                        continue // skip the direct edge under test
                    }
                    if next == target && current.depth >= 1 {
                        return true
                    }
                    if !visited.contains(next) {
                        visited.insert(next)
                        queue.append((next, current.depth + 1))
                    }
                }
            }
            return false
        }

        return edges.filter { edge in
            if edge.isJointEntailment && edge.fromNodeIDs.count > 1 {
                return true
            }
            guard let singleFrom = edge.fromNodeIDs.first else { return false }
            return !hasAlternateDirectedPath(from: singleFrom, to: edge.toNodeID)
        }
    }
}

// MARK: - 3-Stage Grounded Concept Graph Extraction Engine (Workstream 4)

public struct GraphExtractionAuditResult: Equatable, Sendable {
    public let candidateNodes: [BiologyConceptNode]
    public let candidateEdges: [BiologyConceptEdge]
    public let mergedNodeIDs: [String: String] // duplicateCandidateID -> canonicalNodeID
    public let resultingNodes: [BiologyConceptNode]
    public let resultingEdges: [BiologyConceptEdge]
}

public enum BiologyGraphExtractionEngine {
    /// Runs the 3-stage pipeline:
    /// Stage 1 (Extractor): extracts atomic biological concepts & causal links from source text.
    /// Stage 2 (Identity Auditor): detects and merges synonymous/duplicate nodes against existing graph nodes.
    /// Stage 3 (Deterministic Merger): appends new nodes with provenance anchors, redirects merged edges, and runs `simplifyRedundantEdges`.
    public static func extractAndMerge(
        sourceText: String,
        sourceKind: String,
        sourceId: String,
        linkedChapterID: String? = nil,
        linkedTopicID: String? = nil,
        existingNodes: [BiologyConceptNode],
        existingEdges: [BiologyConceptEdge]
    ) -> GraphExtractionAuditResult {
        let anchor = ConceptProvenanceAnchor(
            sourceKind: sourceKind,
            sourceId: sourceId,
            excerpt: String(sourceText.trimmingCharacters(in: .whitespacesAndNewlines).prefix(160))
        )

        // Stage 1: Extract candidate concepts from text sentences/clauses
        let rawCandidates = stage1ExtractCandidates(
            from: sourceText,
            anchor: anchor,
            linkedChapterID: linkedChapterID,
            linkedTopicID: linkedTopicID
        )

        // Stage 2: Audit candidate identities against existing nodes (same-identity vs distinct)
        var mergedMap: [String: String] = [:]
        var updatedNodes = existingNodes
        var newNodes: [BiologyConceptNode] = []

        for candidate in rawCandidates.nodes {
            if let matchIdx = updatedNodes.firstIndex(where: { isSameConceptIdentity($0, candidate) }) {
                let canonicalID = updatedNodes[matchIdx].id
                mergedMap[candidate.id] = canonicalID
                if !updatedNodes[matchIdx].provenanceAnchors.contains(anchor) {
                    updatedNodes[matchIdx].provenanceAnchors.append(anchor)
                }
            } else {
                newNodes.append(candidate)
                updatedNodes.append(candidate)
            }
        }

        // Stage 3: Deterministic Merge + Hyperedge / Transitive Reduction
        var combinedEdges = existingEdges
        for edge in rawCandidates.edges {
            let resolvedFrom = edge.fromNodeIDs.map { mergedMap[$0] ?? $0 }
            let resolvedTo = mergedMap[edge.toNodeID] ?? edge.toNodeID
            guard !resolvedFrom.contains(resolvedTo) else { continue }
            let remapped = BiologyConceptEdge(
                fromNodeIDs: Array(NSOrderedSet(array: resolvedFrom)).compactMap { $0 as? String },
                toNodeID: resolvedTo,
                causalRelationLabel: edge.causalRelationLabel,
                isJointEntailment: edge.isJointEntailment
            )
            if !combinedEdges.contains(where: { $0.id == remapped.id }) {
                combinedEdges.append(remapped)
            }
        }

        let simplifiedEdges = BiologyConceptGraphEngine.simplifyRedundantEdges(edges: combinedEdges)
        return GraphExtractionAuditResult(
            candidateNodes: rawCandidates.nodes,
            candidateEdges: rawCandidates.edges,
            mergedNodeIDs: mergedMap,
            resultingNodes: updatedNodes,
            resultingEdges: simplifiedEdges
        )
    }

    private static func stage1ExtractCandidates(
        from text: String,
        anchor: ConceptProvenanceAnchor,
        linkedChapterID: String?,
        linkedTopicID: String?
    ) -> (nodes: [BiologyConceptNode], edges: [BiologyConceptEdge]) {
        let lower = text.lowercased()
        var extractedNodes: [BiologyConceptNode] = []
        var extractedEdges: [BiologyConceptEdge] = []

        let conceptLexicon: [(key: String, title: String, subtitle: String, summary: String, domain: BiologyConceptDomain)] = [
            ("respiration", "Unit 1 · Respiration & Gas Exchange", "Aerobic & anaerobic ATP release", "Cellular oxidation of glucose in mitochondria releasing energy.", .cambridgeBio),
            ("osmosis", "Ch 3 · Diffusion & Osmosis", "Water potential gradient", "Net movement of water across a partially permeable membrane.", .livingWorld),
            ("enzyme", "Ch 4 · Biomolecules & Enzymes", "Active-site catalysis", "Biological catalysts that lower activation energy and denature at extreme pH/temperature.", .livingWorld),
            ("photosynthesis", "Ch 5 · Photosynthesis & Carbon Fixation", "Endothermic light capture", "Chloroplasts trap light energy to reduce CO2 and water into glucose and oxygen.", .livingWorld),
            ("bioaccumulation", "Unit 4.4 · Bioaccumulation & Biomagnification", "Persistent trophic toxins", "Persistent toxins build up within organisms and magnify up food chains.", .cambridgeBio),
            ("haemoglobin", "Unit 1.5 · Haemoglobin & Red Blood Cells", "Reversible oxygen transport", "Biconcave anucleate red blood cells carry oxygen as oxyhaemoglobin.", .cambridgeBio),
            ("antagonistic", "Unit 7.4 · Antagonistic Muscle Pairs", "Biceps & triceps levers", "Muscles only pull when contracting, working in opposing pairs across synovial joints.", .cambridgeBio)
        ]

        for (idx, item) in conceptLexicon.enumerated() where lower.contains(item.key) {
            let angle = Double(idx) * 0.9
            let node = BiologyConceptNode(
                id: "extracted-\(item.key)",
                title: item.title,
                subtitle: item.subtitle,
                domain: item.domain,
                linkedChapterID: linkedChapterID,
                linkedTopicID: linkedTopicID,
                normalizedX: min(0.86, max(0.14, 0.50 + 0.28 * cos(angle))),
                normalizedY: min(0.86, max(0.14, 0.50 + 0.28 * sin(angle))),
                keyMechanismSummary: item.summary,
                provenanceAnchors: [anchor]
            )
            extractedNodes.append(node)
        }

        if extractedNodes.isEmpty {
            let cleanTitle = String(text.trimmingCharacters(in: .whitespacesAndNewlines).prefix(38))
            let fallbackNode = BiologyConceptNode(
                id: "extracted-\( abs(cleanTitle.hashValue) % 100_000 )",
                title: cleanTitle.isEmpty ? "Extracted Biology Concept" : cleanTitle,
                subtitle: "Extracted from \(anchor.sourceKind)",
                domain: .customNote,
                linkedChapterID: linkedChapterID,
                linkedTopicID: linkedTopicID,
                normalizedX: 0.55,
                normalizedY: 0.45,
                keyMechanismSummary: anchor.excerpt,
                provenanceAnchors: [anchor]
            )
            extractedNodes.append(fallbackNode)
        }

        if extractedNodes.count >= 2 {
            for i in 0..<(extractedNodes.count - 1) {
                extractedEdges.append(
                    BiologyConceptEdge(
                        fromNodeID: extractedNodes[i].id,
                        toNodeID: extractedNodes[i + 1].id,
                        causalRelationLabel: "mechanistically supports"
                    )
                )
            }
        }
        return (extractedNodes, extractedEdges)
    }

    private static func isSameConceptIdentity(_ existing: BiologyConceptNode, _ candidate: BiologyConceptNode) -> Bool {
        let eTitle = existing.title.lowercased()
        let cTitle = candidate.title.lowercased()
        if eTitle == cTitle { return true }
        let sharedKeywords = ["respiration", "osmosis", "enzymes", "photosynthesis", "ecosystems", "diet"]
        for kw in sharedKeywords {
            if eTitle.contains(kw) && cTitle.contains(kw) {
                return true
            }
        }
        return false
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
                                // Edges & jointly-entailing hyperedges canvas
                                Canvas { context, size in
                                    for edge in edges {
                                        guard let toNode = visibleNodes.first(where: { $0.id == edge.toNodeID }) else {
                                            continue
                                        }
                                        let fromNodes = edge.fromNodeIDs.compactMap { id in
                                            visibleNodes.first(where: { $0.id == id })
                                        }
                                        guard !fromNodes.isEmpty else { continue }

                                        let pTarget = CGPoint(x: toNode.normalizedX * size.width, y: toNode.normalizedY * size.height)
                                        let isHighlighted = edge.fromNodeIDs.contains(selectedNodeID) || edge.toNodeID == selectedNodeID
                                        let strokeColor = isHighlighted ? Color.kymaiaPrimary : Color.kymaiaControlBorder

                                        if edge.isJointEntailment && fromNodes.count > 1 {
                                            let avgX = fromNodes.map { $0.normalizedX * size.width }.reduce(0, +) / CGFloat(fromNodes.count)
                                            let avgY = fromNodes.map { $0.normalizedY * size.height }.reduce(0, +) / CGFloat(fromNodes.count)
                                            let junction = CGPoint(
                                                x: (avgX + pTarget.x) * 0.5,
                                                y: (avgY + pTarget.y) * 0.5
                                            )
                                            for fn in fromNodes {
                                                let pPremise = CGPoint(x: fn.normalizedX * size.width, y: fn.normalizedY * size.height)
                                                var branch = Path()
                                                branch.move(to: pPremise)
                                                branch.addLine(to: junction)
                                                context.stroke(
                                                    branch,
                                                    with: .color(strokeColor),
                                                    style: StrokeStyle(lineWidth: isHighlighted ? 2.2 : 1.3)
                                                )
                                            }
                                            var stem = Path()
                                            stem.move(to: junction)
                                            stem.addLine(to: pTarget)
                                            context.stroke(
                                                stem,
                                                with: .color(strokeColor),
                                                style: StrokeStyle(lineWidth: isHighlighted ? 2.8 : 1.6)
                                            )
                                            let r = BioFigureGeometry.junctionDotRadius
                                            let dotRect = CGRect(x: junction.x - r, y: junction.y - r, width: r * 2, height: r * 2)
                                            context.fill(Path(ellipseIn: dotRect), with: .color(Color.kymaiaPrimaryStrong))
                                        } else if let fromNode = fromNodes.first {
                                            let p1 = CGPoint(x: fromNode.normalizedX * size.width, y: fromNode.normalizedY * size.height)
                                            var path = Path()
                                            path.move(to: p1)
                                            path.addLine(to: pTarget)

                                            context.stroke(
                                                path,
                                                with: .color(strokeColor),
                                                style: StrokeStyle(
                                                    lineWidth: isHighlighted ? 2.6 : 1.3,
                                                    dash: isHighlighted ? [] : [5, 4]
                                                )
                                            )
                                        }
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
                                        withKymaiaAnimation(StandardMotion.snappy) {
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
                                                .foregroundStyle(isSelected ? Color.kymaiaBackground.opacity(0.88) : Color.kymaiaMutedInk)
                                                .lineLimit(1)
                                        }
                                        .padding(.horizontal, Spacing.sm)
                                        .padding(.vertical, Spacing.xs)
                                        .frame(width: 176, alignment: .leading)
                                        .foregroundStyle(isSelected ? Color.kymaiaBackground : Color.kymaiaInk)
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

                        Button {
                            edges = BiologyConceptGraphEngine.simplifyRedundantEdges(edges: edges)
                            savePersistedCustomGraph()
                        } label: {
                            Label("Simplify redundant links", systemImage: "wand.and.stars")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                        .accessibilityIdentifier("mindmap.simplify-edges")
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
