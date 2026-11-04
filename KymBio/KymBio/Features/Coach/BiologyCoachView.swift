import SwiftUI

struct CoachMessage: Identifiable, Equatable, Sendable {
    let id = UUID()
    let isCoach: Bool
    let text: String
    let contextTag: String?
    var personaName: String? = nil
    var councilApproved: Bool = true
}

enum CoachTabMode: String, CaseIterable, Identifiable, Sendable {
    case socraticChat = "socratic_chat"
    case tutorCanvas = "tutor_canvas"
    case quantitativeBench = "quantitative_bench"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .socraticChat: return "Socratic Biology Coach"
        case .tutorCanvas: return "Co-Drawing Proof Board"
        case .quantitativeBench: return "Quantitative Biology Bench (16 Templates)"
        }
    }
}

struct BiologyCoachView: View {
    @EnvironmentObject private var store: AppStore
    @ObservedObject private var liveAIClient = KymBioLiveAIClient.shared
    @State private var tabMode: CoachTabMode = .socraticChat
    @State private var selectedPersona: TutorPersona = .marieCurie
    @State private var selectedGuidanceStyle: TutorGuidanceStyle = .adaptive
    @State private var selectedIntent: MentorIntent = .learn
    @State private var selectedConversationMode: ConversationMode = .openChat
    @State private var inputPrompt: String = ""
    @State private var isGeneratingReply: Bool = false
    @State private var showAPIKeySheet: Bool = false
    @State private var showConstitutionSheet: Bool = false
    @State private var apiKeyDraft: String = ""
    @State private var safetySupportMessage: String? = nil
    @State private var messages: [CoachMessage] = [
        CoachMessage(
            isCoach: true,
            text: "Hello Kym. I am an AI biology tutor grounded in your Cambridge Lower Secondary Science 8 Learner's Book, Workbook and The Living World. Choose a mentor persona above — or switch to Sparky if you want to teach me! You can ask for a Socratic question, a hint, or say 'just explain' anytime for a direct step-by-step explanation.",
            contextTag: "AI tutor · Grounded in Science 8 & The Living World",
            personaName: "Marie Curie"
        )
    ]

    // Quantitative bench state
    @State private var selectedQuantProblemId: String = QuantitativeBioEngine.allProblems.first?.id ?? "qbio-01-magnification"
    @State private var quantInput: String = ""
    @State private var quantOutcome: QuantitativeCheckOutcome? = nil
    @State private var showQuantWorkedSolution: Bool = false

    private var activeQuantProblem: QuantitativeBioProblem {
        QuantitativeBioEngine.allProblems.first(where: { $0.id == selectedQuantProblemId })
            ?? QuantitativeBioEngine.allProblems[0]
    }

    var body: some View {
        JournalPage(
            title: "Biology Coach & Quantitative Bench",
            subtitle: "Socratic AI biology tutor · Grounded in your Cambridge Science 8 textbook and The Living World (AI tutor, not a person)",
            column: .conversation
        ) {
            modePickerCard
            if let sharedMuddy = store.sharedMuddiestPointContext {
                sharedMuddiestPointBanner(sharedMuddy)
            }
            switch tabMode {
            case .socraticChat:
                socraticCoachSection
            case .tutorCanvas:
                BiologyTutorCanvasView()
            case .quantitativeBench:
                quantitativeBenchSection
            }
        }
        .sessionJournalSafetyAlert(message: $safetySupportMessage)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                StandardThemeMenu()
            }
        }
        .sheet(isPresented: $showAPIKeySheet) {
            NavigationStack {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text("Configure an optional Gemini API key (`GEMINI_API_KEY`) for live cloud Socratic tutoring. When blank or offline, KymBio automatically uses its grounded local Cambridge Science 8 & Living World engine.")
                        .font(.kymaiaBody)
                        .foregroundStyle(Color.kymaiaSecondaryInk)

                    SecureField("Paste Gemini API key (optional)", text: $apiKeyDraft)
                        .learnerTextInput(.reflection)
                        .textFieldStyle(.roundedBorder)

                    HStack {
                        JournalChip("Calls: \(liveAIClient.budgetSnapshot.totalRequests)", tone: .neutral)
                        JournalChip("Provider: \(liveAIClient.budgetSnapshot.lastProviderUsed)", tone: .accent)
                    }

                    Spacer()
                }
                .padding(Spacing.lg)
                .background(Color.kymaiaBackground)
                .navigationTitle("AI Tutor Engine & Budget")
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") { showAPIKeySheet = false }
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Save") {
                            liveAIClient.configuredAPIKey = apiKeyDraft
                            showAPIKeySheet = false
                        }
                    }
                }
            }
            .frame(minWidth: 420, minHeight: 260)
        }
        .sheet(isPresented: $showConstitutionSheet) {
            NavigationStack {
                ScrollView {
                    VStack(alignment: .leading, spacing: Spacing.md) {
                        HStack {
                            JournalChip("Version \(TutorConstitution.version)", systemImage: "shield.checkered", tone: .good)
                            JournalChip("SHA-256: \(String(TutorConstitution.policyHash.prefix(12)))", tone: .neutral)
                            Spacer()
                        }
                        Text(
                            ChatSafetyDirectives.block(
                                soulDocument: BundledAgentSoulCatalog.soulDocument(for: selectedPersona),
                                guidanceStyle: selectedGuidanceStyle,
                                dialogueMode: .socratic
                            )
                        )
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaInk)
                    }
                    .padding(Spacing.lg)
                }
                .background(Color.kymaiaBackground)
                .navigationTitle("AI Constitution & Soul Document")
                .toolbar {
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Done") { showConstitutionSheet = false }
                    }
                }
            }
            .frame(minWidth: 540, minHeight: 480)
        }
    }

    private func sharedMuddiestPointBanner(_ note: String) -> some View {
        JournalCard {
            HStack(alignment: .top, spacing: Spacing.sm) {
                JournalBadge(symbol: "lock.open.display", tint: .kymaiaPrimary, size: .row)
                VStack(alignment: .leading, spacing: 2) {
                    Text("Shared muddiest point from your Lab Journal")
                        .font(.kymaiaCardTitle)
                    Text(note)
                        .font(.kymaiaBody)
                        .foregroundStyle(Color.kymaiaInk)
                    Text("Your Lab Journal is private by default. Coach can only see this note because you chose to share it.")
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaMutedInk)
                }
                Spacer()
                Button("Clear shared note") {
                    store.clearJournalPrivateContext()
                }
                .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                .accessibilityIdentifier("coach.clear-muddiest-point")
            }
        }
    }

    private var modePickerCard: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack {
                    JournalBadge(symbol: "bubble.left.and.text.bubble.right.fill", tint: .kymaiaPrimary, size: .row)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Active study context: Unit \(store.selectedUnitNumber) · Living World Ch \(store.activeLivingWorldChapter)")
                            .font(.kymaiaCardTitle)
                        Text("AI tutor, not a person. Governed by the KymBio AI Constitution (\(TutorConstitution.version)) — you are always in charge of pace and support mode.")
                            .font(.kymaiaCaption)
                            .foregroundStyle(Color.kymaiaMutedInk)
                    }
                    Spacer()
                    Button {
                        showConstitutionSheet = true
                    } label: {
                        Label("Constitution & Soul", systemImage: "shield.checkered")
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                    .accessibilityIdentifier("coach.constitution-button")

                    Button {
                        apiKeyDraft = liveAIClient.configuredAPIKey
                        showAPIKeySheet = true
                    } label: {
                        Label(
                            liveAIClient.hasLiveAPIKey ? "Gemini Live Ready" : "Local Grounded Engine",
                            systemImage: liveAIClient.hasLiveAPIKey ? "sparkles" : "cpu"
                        )
                    }
                    .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                }
                AdaptiveOptionPicker(
                    "Coach mode",
                    selection: $tabMode,
                    options: CoachTabMode.allCases,
                    titleForOption: \.title
                )
                .accessibilityIdentifier("coach.mode-picker")
            }
        }
    }

    // MARK: - 1. Socratic Biology Coach

    private var socraticCoachSection: some View {
        VStack(alignment: .leading, spacing: Spacing.md) {
            mentorControlsCard

            JournalSection(title: "Quick Socratic prompts for your active topics") {
                FlowLayout(spacing: Spacing.xs) {
                    socraticStarterChip("Why must I say 'energy is released' instead of 'made' in Unit 1.4?")
                    socraticStarterChip("Test me on the 3 components of tobacco smoke in Unit 7.3")
                    socraticStarterChip("Why do biceps and triceps work as an antagonistic pair in Unit 7.4?")
                    socraticStarterChip("How does bioaccumulation differ from biomagnification in Unit 4.4?")
                    socraticStarterChip("Check my wording on red blood cell adaptations in Unit 1.5")
                    socraticStarterChip("Just explain anaerobic respiration in humans vs yeast directly")
                }
            }

            JournalSection(title: "Conversation") {
                VStack(spacing: Spacing.sm) {
                    ForEach(messages) { msg in
                        JournalCard {
                            VStack(alignment: .leading, spacing: Spacing.xs) {
                                HStack {
                                    JournalChip(
                                        text: msg.isCoach ? "\(msg.personaName ?? selectedPersona.name) (AI tutor)" : "You",
                                        tone: msg.isCoach ? .accent : .good
                                    )
                                    if let tag = msg.contextTag {
                                        JournalChip(text: tag, tone: .neutral)
                                    }
                                    if msg.isCoach && msg.councilApproved {
                                        JournalChip("Council verified", systemImage: "checkmark.shield.fill", tone: .good)
                                    }
                                    Spacer()
                                }
                                Text(msg.text)
                                    .font(.kymaiaSerifProse)
                                    .foregroundStyle(Color.kymaiaInk)
                            }
                        }
                    }

                    JournalCard {
                        HStack(spacing: Spacing.sm) {
                            TextField("Ask a biology question, teach Sparky, or say 'just explain'…", text: $inputPrompt)
                                .learnerTextInput(.retrieval)
                                .textFieldStyle(.roundedBorder)
                                .accessibilityIdentifier("coach.input")
                            VoiceDictationButton(text: $inputPrompt, label: "Speak")
                            Button {
                                sendUserMessage(inputPrompt)
                                inputPrompt = ""
                            } label: {
                                Label(isGeneratingReply ? "Thinking…" : "Send", systemImage: "arrow.up.circle.fill")
                            }
                            .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                            .disabled(isGeneratingReply || inputPrompt.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                            .accessibilityIdentifier("coach.send")

                            if let lastCoach = messages.last(where: { $0.isCoach }) {
                                Button {
                                    BioSpeechSynthesizer.shared.speak(lastCoach.text)
                                } label: {
                                    Label("Read aloud", systemImage: "speaker.wave.2.fill")
                                }
                                .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
                            }
                        }
                    }
                }
            }
        }
    }

    private var mentorControlsCard: some View {
        JournalCard {
            VStack(alignment: .leading, spacing: Spacing.sm) {
                HStack {
                    Label("Mentor Persona & Guidance Controls", systemImage: selectedPersona.sfSymbolName)
                        .font(.kymaiaCaption.weight(.semibold))
                        .foregroundStyle(Color.kymaiaPrimary)
                    Spacer()
                    Text(selectedPersona.tagline)
                        .font(.kymaiaCaption)
                        .foregroundStyle(Color.kymaiaMutedInk)
                }

                FlowLayout(spacing: Spacing.xs) {
                    ForEach(TutorPersona.allCases) { persona in
                        Button {
                            selectedPersona = persona
                        } label: {
                            Label(persona.name, systemImage: persona.sfSymbolName)
                        }
                        .buttonStyle(
                            JournalCapsuleButtonStyle(
                                prominence: selectedPersona == persona ? .filled : .tinted,
                                size: .small
                            )
                        )
                        .accessibilityIdentifier("coach.persona.\(persona.rawValue)")
                    }
                }

                Divider()

                HStack(spacing: Spacing.md) {
                    AdaptiveOptionPicker(
                        "Support style",
                        selection: $selectedGuidanceStyle,
                        options: TutorGuidanceStyle.allCases,
                        titleForOption: \.label
                    )
                    .accessibilityIdentifier("coach.guidance-picker")

                    AdaptiveOptionPicker(
                        "Intent",
                        selection: $selectedIntent,
                        options: MentorIntent.allCases,
                        titleForOption: \.label
                    )
                    .accessibilityIdentifier("coach.intent-picker")

                    AdaptiveOptionPicker(
                        "Format",
                        selection: $selectedConversationMode,
                        options: ConversationMode.allCases,
                        titleForOption: \.label
                    )
                    .accessibilityIdentifier("coach.format-picker")
                }
            }
        }
    }

    private func socraticStarterChip(_ prompt: String) -> some View {
        Button(prompt) {
            sendUserMessage(prompt)
        }
        .buttonStyle(JournalCapsuleButtonStyle(prominence: .tinted, size: .small))
    }

    private func sendUserMessage(_ raw: String) {
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        messages.append(CoachMessage(isCoach: false, text: trimmed, contextTag: "Unit \(store.selectedUnitNumber)"))

        // 1. On-Device Child-Safety Crisis Gate (runs BEFORE any local or external AI call)
        let safetyService = SafetyEscalationService()
        if let concern = safetyService.scan(trimmed) {
            let supportText = safetyService.supportiveResponse(for: concern)
            safetySupportMessage = supportText
            messages.append(
                CoachMessage(
                    isCoach: true,
                    text: supportText,
                    contextTag: "Safety & Wellbeing Support · Lesson Paused",
                    personaName: "Care Support",
                    councilApproved: true
                )
            )
            Task {
                safetyService.escalate(concern, channel: "biology_coach")
            }
            return
        }

        // 2. Honour immediate learner opt-out ("just explain", "stop asking", etc.)
        let resolvedStyle = MotivationalDialoguePolicy.resolvedStyle(
            requested: selectedGuidanceStyle,
            learnerText: trimmed
        )
        if resolvedStyle != selectedGuidanceStyle {
            selectedGuidanceStyle = resolvedStyle
        }

        if liveAIClient.hasLiveAPIKey {
            isGeneratingReply = true
            let activeCh = store.pack.chapters.first(where: { $0.number == store.activeLivingWorldChapter })
            let chContext = "Unit \(store.selectedUnitNumber), Ch \(store.activeLivingWorldChapter) (\(activeCh?.title ?? "The Living World"))"
            let misContext = store.pack.misconceptions.prefix(3).map { "\($0.topic): \($0.details)" }.joined(separator: " | ")
            let swContext = store.pack.schoolWordingEntries.prefix(4).map { "\($0.topicAndChapter): \($0.cambridgeWording)" }.joined(separator: " | ")
            let personaSnapshot = selectedPersona
            let guidanceSnapshot = resolvedStyle
            let intentSnapshot = selectedIntent
            let modeSnapshot = selectedConversationMode
            let muddySnapshot = store.sharedMuddiestPointContext

            Task { @MainActor in
                defer { isGeneratingReply = false }
                if let cloudText = await liveAIClient.generateGroundedSocraticReply(
                    studentPrompt: trimmed,
                    activeChapterContext: chContext,
                    misconceptionContext: misContext,
                    schoolWordingContext: swContext,
                    persona: personaSnapshot,
                    guidanceStyle: guidanceSnapshot,
                    mentorIntent: intentSnapshot,
                    conversationMode: modeSnapshot,
                    sharedMuddiestPoint: muddySnapshot
                ) {
                    let council = AdversarialCouncil.reviewExplanation(
                        artifactId: "cloud-\(UUID().uuidString)",
                        content: cloudText
                    )
                    messages.append(
                        CoachMessage(
                            isCoach: true,
                            text: cloudText,
                            contextTag: "Gemini 2.5 Flash · \(personaSnapshot.name) · \(guidanceSnapshot.label)",
                            personaName: personaSnapshot.name,
                            councilApproved: council.approved
                        )
                    )
                } else {
                    liveAIClient.recordLocalFallbackCall()
                    messages.append(generateGroundedSocraticReply(for: trimmed, style: guidanceSnapshot))
                }
            }
        } else {
            liveAIClient.recordLocalFallbackCall()
            let reply = generateGroundedSocraticReply(for: trimmed, style: resolvedStyle)
            messages.append(reply)
        }
    }

    private func generateGroundedSocraticReply(for query: String, style: TutorGuidanceStyle) -> CoachMessage {
        let q = query.lowercased()
        let effectiveStyle = MotivationalDialoguePolicy.resolvedStyle(requested: style, learnerText: query)
        let isFrictionTurn = effectiveStyle != .explainDirectly
            && MotivationalDialoguePolicy.detectFriction(in: query)

        // Motivational support mode if Kym expresses academic frustration ("too hard", "i'm stuck", "i give up"),
        // in every style except a direct explanation
        if isFrictionTurn {
            let text = """
            It is completely normal to feel stuck when a biology mechanism has several moving parts — every scientist hits moments like this. You are in charge of how we tackle it next:
            1. **One tiny step together:** We look only at the main structure in Unit \(store.selectedUnitNumber).
            2. **Direct worked explanation:** I explain the full mechanism clearly from start to finish with zero questions.
            3. **Breathing & Reset:** Take a 60-second physiological sigh break in the Vault & Field Guides room.
            Which option feels best right now?
            """
            return finalizeLocalCoachMessage(
                rawText: text,
                query: query,
                tag: "Autonomy-Supportive Coaching · Unit \(store.selectedUnitNumber)"
            )
        }

        // Reverse-Tutor Sparky mode (Protege Effect)
        if selectedPersona == .sparky && style != .explainDirectly {
            let sparkyReply: String
            if q.contains("energy") || q.contains("respiration") || q.contains("1.4") {
                sparkyReply = "Ooh, thank you for teaching me, Teacher! Wait — my robot circuits got a little confused: I wrote in my notebook that 'mitochondria MAKE energy during respiration'. Why did my Cambridge Science 8 examiner cross out the word 'make'? Where does the energy actually come from?!"
            } else if q.contains("blood") || q.contains("artery") || q.contains("1.5") {
                sparkyReply = "Wow, you know SO much about blood vessels! Hold on — is breathing the exact same thing as cellular respiration? They both use oxygen, right, Teacher? Can you explain the difference so I don't mix them up?"
            } else {
                sparkyReply = "Oh!! My circuits are whirring! Wait, can you explain that step one more time like I'm an 8-year-old robot? What is the main structure involved in Unit \(store.selectedUnitNumber), and what happens if that structure is blocked?"
            }
            return finalizeLocalCoachMessage(
                rawText: sparkyReply,
                query: query,
                tag: "Sparky Reverse Tutor · Protege Effect"
            )
        }

        // Friendly Challenger Fact-Checker mode
        if selectedPersona == .factChecker && style != .explainDirectly {
            let fcReply = "Hmm, interesting claim — let's inspect it together! Does that rule still hold in an edge case — for example, when oxygen runs out during a 100 m sprint (anaerobic respiration), or in a mature red blood cell that has lost its nucleus? How would you defend or refine your claim?"
            return finalizeLocalCoachMessage(
                rawText: fcReply,
                query: query,
                tag: "Fact-Checker · Claim & Defend"
            )
        }

        // Core grounded biology answers
        let coreText: String
        let tag: String
        if q.contains("energy") && (q.contains("made") || q.contains("produced") || q.contains("1.4") || q.contains("respiration")) {
            coreText = "In Cambridge Science 8 (Unit 1.4, LB p. 25), energy cannot be created or destroyed (conservation of energy). Chemical potential energy is already stored in the bonds of glucose. When glucose reacts with oxygen inside mitochondria, that energy is RELEASED (transferred to ATP and thermal energy). Try writing the full word equation for aerobic respiration and state what happens to the energy."
            tag = "Unit 1.4 · Cambridge Wording Watchout"
        } else if q.contains("anaerobic") || q.contains("yeast") || q.contains("lactic") {
            coreText = "Direct comparison of anaerobic respiration (Unit 1.4 & Ch 1):\n• In human muscle cells (vigorous sprint): `glucose → lactic acid` (releases a small amount of energy quickly without oxygen; lactic acid causes cramp and requires an oxygen debt after exercise).\n• In yeast / microorganisms (fermentation): `glucose → ethanol + carbon dioxide` (the CO₂ gas bubbles make bread dough rise)."
            tag = "Unit 1.4 · Direct Comparison"
        } else if q.contains("smoke") || q.contains("smoking") || q.contains("7.3") || q.contains("tar") || q.contains("nicotine") {
            coreText = "Let's separate the three components of tobacco smoke in Unit 7.3 (LB p. 250, WB p. 144) so you never mix them up on a test:\n1. Carbon monoxide binds irreversibly to haemoglobin in red blood cells so they carry less oxygen.\n2. Tar paralyses the cilia in the trachea and bronchi and contains carcinogens that cause lung cancer.\n3. Nicotine is the addictive chemical that narrows blood vessels and raises heart rate."
            tag = "Unit 7.3 · Smoking & Health"
        } else if q.contains("biceps") || q.contains("triceps") || q.contains("antagonistic") || q.contains("7.4") || q.contains("muscle") {
            coreText = "Think about a rope: can you push a heavy box with a flexible rope, or can a rope only pull when under tension? Skeletal muscle fibres work the same way — they can only pull a bone when they contract; they cannot push when they relax. At the elbow hinge joint (Unit 7.4, LB p. 254): to bend the arm, the biceps contracts (pulls radius upward) while the triceps relaxes; to straighten the arm, the triceps contracts while the biceps relaxes."
            tag = "Unit 7.4 & Bridge 3.4 · Antagonistic Levers"
        } else if q.contains("bioaccumulation") || q.contains("biomagnification") || q.contains("ddt") || q.contains("4.4") {
            coreText = "Great Unit 4.4 question (LB p. 142, WB p. 82). Two key ideas to distinguish:\n• Bioaccumulation happens WITHIN one organism over its lifetime because the toxin (like DDT or mercury) is persistent (does not break down) and is not excreted.\n• Biomagnification happens ALONG a food chain because each predator eats many prey from the trophic level below, concentrating all their stored toxin into a smaller biomass."
            tag = "Unit 4.4 · Ecosystems"
        } else if q.contains("red blood") || q.contains("1.5") || q.contains("haemoglobin") {
            coreText = "In Unit 1.5 (LB p. 31), Cambridge mark schemes award 1 mark for the structural feature and 1 mark for HOW it helps oxygen transport:\n• Feature 1: Packed with haemoglobin → binds reversibly with oxygen to form oxyhaemoglobin.\n• Feature 2: No nucleus → leaves more space inside the cell for haemoglobin molecules.\n• Feature 3: Biconcave disc shape → large surface-area-to-volume ratio for rapid diffusion of oxygen in and out."
            tag = "Unit 1.5 · Blood"
        } else {
            let queryTokens = q.split(whereSeparator: { !$0.isLetter && !$0.isNumber }).map(String.init).filter { $0.count >= 3 }
            if let sw = store.pack.schoolWordingEntries.first(where: { entry in
                let hay = "\(entry.topicAndChapter) \(entry.cambridgeWording) \(entry.examinerTrap)".lowercased()
                return queryTokens.contains(where: { hay.contains($0) })
            }) {
                coreText = "First-principles mechanism (\(sw.topicAndChapter)):\n\(sw.firstPrinciples)\n\nCambridge mark-scheme wording:\n\(sw.cambridgeWording)\n\nExaminer trap to watch out for:\n\(sw.examinerTrap)"
                tag = sw.topicAndChapter
            } else if let mis = store.pack.misconceptions.first(where: { entry in
                let hay = "\(entry.topic) \(entry.details)".lowercased()
                return queryTokens.contains(where: { hay.contains($0) })
            }) {
                let closing = style == .explainDirectly
                    ? "Direct takeaway: Always state the physical or chemical mechanism (diffusion gradient, enzyme active site, or natural selection) rather than teleological ('in order to') wording."
                    : "How would you explain the physical or chemical mechanism without using teleological ('in order to') wording?"
                coreText = "Research brief on \(mis.topic):\n\(mis.details)\n\n\(closing)"
                tag = "Misconception Research Brief"
            } else if let matchedTopic = store.pack.schoolTextbook.units.flatMap(\.topics).first(where: { t in
                let hay = "\(t.code) \(t.title) \(t.summary)".lowercased()
                return queryTokens.contains(where: { hay.contains($0) })
            }) {
                let watchout = matchedTopic.cambridgeWatchouts.first ?? "Use precise Cambridge scientific terminology."
                let closing = style == .explainDirectly
                    ? "Step-by-step summary: Identify the biological structure, state the physical/chemical gradient, and apply the Cambridge watchout above."
                    : "Try stating the cause-and-effect chain in your own words."
                coreText = "Topic \(matchedTopic.code) (\(matchedTopic.title), LB p. \(matchedTopic.learnersBookPage), WB p. \(matchedTopic.workbookPage)):\n\(matchedTopic.summary)\n\nCambridge watchout: \(watchout)\n\n\(closing)"
                tag = "Topic \(matchedTopic.code)"
            } else {
                let activeCh = store.pack.chapters.first(where: { $0.number == store.activeLivingWorldChapter })
                if style == .explainDirectly {
                    coreText = "Direct explanation for Chapter \(store.activeLivingWorldChapter) (\(activeCh?.title ?? "The Living World")) and Cambridge Science 8 Unit \(store.selectedUnitNumber):\n1. Identify the primary biological structure (such as the partially permeable cell membrane, alveolus-capillary barrier, or antagonistic muscle pair).\n2. Trace the physical or chemical gradient (water potential, gas concentration, or lever moment).\n3. State the resulting biological process using exact Cambridge 0893 verbs (such as 'diffuses down a concentration gradient' or 'energy is released from glucose')."
                } else {
                    coreText = "Let's connect your question to Chapter \(store.activeLivingWorldChapter) (\(activeCh?.title ?? "The Living World")) and Cambridge Science 8 Unit \(store.selectedUnitNumber). First, what is the main structure or variable involved, and what direction does the concentration, pressure, or energy gradient point?"
                }
                tag = "Ch \(store.activeLivingWorldChapter) · \(selectedPersona.name)"
            }
        }

        return finalizeLocalCoachMessage(rawText: coreText, query: query, tag: tag)
    }

    private func finalizeLocalCoachMessage(rawText: String, query: String, tag: String) -> CoachMessage {
        let validation = DevelopmentalResponseValidator.validate(rawText)
        let safeText = validation.isValid ? rawText : DevelopmentalResponseValidator.safeFallback
        let formatted = ChatResponseComposer.enforceStructuredLessonIfNeeded(
            rawResponse: safeText,
            query: query,
            conversationMode: selectedConversationMode,
            persona: selectedPersona,
            topicTag: tag
        )
        let council = AdversarialCouncil.reviewExplanation(
            artifactId: "local-\(UUID().uuidString)",
            content: formatted
        )
        return CoachMessage(
            isCoach: true,
            text: formatted,
            contextTag: "\(tag) · \(selectedGuidanceStyle.label)",
            personaName: selectedPersona.name,
            councilApproved: council.approved
        )
    }

    // MARK: - 2. 16-Template Wolfram-Audited Quantitative Biology Bench

    private var quantitativeBenchSection: some View {
        VStack(alignment: .leading, spacing: Spacing.md) {
            JournalSection(title: "16 Quantitative Biology Templates (Ch 0–15 & Science 8 Units 1–7)") {
                FlowLayout(spacing: Spacing.xs) {
                    ForEach(QuantitativeBioEngine.allProblems) { prob in
                        let isSelected = prob.id == activeQuantProblem.id
                        Button {
                            selectedQuantProblemId = prob.id
                            quantInput = ""
                            quantOutcome = nil
                            showQuantWorkedSolution = false
                        } label: {
                            Text("Ch \(prob.chapterNumber) · \(prob.title)")
                        }
                        .buttonStyle(
                            JournalCapsuleButtonStyle(
                                prominence: isSelected ? .filled : .tinted,
                                size: .small
                            )
                        )
                        .accessibilityIdentifier("coach.quant.\(prob.id)")
                    }
                }
            }

            JournalCard {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    HStack {
                        JournalChip(text: "Chapter \(activeQuantProblem.chapterNumber)", tone: .accent)
                        JournalChip(text: "Science 8 Topic \(activeQuantProblem.schoolTopic)", tone: .good)
                        Spacer()
                    }

                    Text(activeQuantProblem.title)
                        .font(.kymaiaCardTitle)

                    Text(activeQuantProblem.formulaDisplay)
                        .font(.kymaiaMonospaced)
                        .foregroundStyle(Color.kymaiaPrimary)
                        .padding(Spacing.sm)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(
                            RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                                .fill(Color.kymaiaElevatedSurface)
                        )

                    Text(activeQuantProblem.prompt)
                        .font(.kymaiaQuestion)
                        .foregroundStyle(Color.kymaiaInk)

                    HStack(spacing: Spacing.sm) {
                        TextField(
                            "Enter value and unit (e.g. \(Int(activeQuantProblem.expectedNumericValue)) \(activeQuantProblem.expectedUnit))",
                            text: $quantInput
                        )
                        .learnerTextInput(.retrieval)
                        .textFieldStyle(.roundedBorder)
                        .accessibilityIdentifier("coach.quant.input")

                        Button {
                            quantOutcome = QuantitativeBioEngine.evaluate(
                                problem: activeQuantProblem,
                                rawInput: quantInput
                            )
                        } label: {
                            Label("Verify answer", systemImage: "checkmark.circle.fill")
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .filled, size: .small))
                        .accessibilityIdentifier("coach.quant.verify")

                        Button(showQuantWorkedSolution ? "Hide steps" : "Show worked steps") {
                            showQuantWorkedSolution.toggle()
                        }
                        .buttonStyle(JournalCapsuleButtonStyle(prominence: .ghost, size: .small))
                    }

                    if let outcome = quantOutcome {
                        HStack {
                            JournalChip(
                                label: outcome.isCorrect ? "Exact match" : "Check units / steps",
                                systemImage: outcome.isCorrect ? "checkmark.seal.fill" : "exclamationmark.triangle.fill",
                                tone: outcome.isCorrect ? .good : .warn
                            )
                            Text(outcome.diagnosticMessage)
                                .font(.kymaiaBody)
                                .foregroundStyle(outcome.isCorrect ? Color.kymaiaSuccess : Color.kymaiaInk)
                        }
                    }

                    if showQuantWorkedSolution {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Step-by-step derivation")
                                .font(.kymaiaCaption.weight(.semibold))
                                .foregroundStyle(Color.kymaiaPrimary)
                            Text(activeQuantProblem.stepByStepSolution)
                                .font(.kymaiaSerifProse)
                                .foregroundStyle(Color.kymaiaInk)
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
    }
}
