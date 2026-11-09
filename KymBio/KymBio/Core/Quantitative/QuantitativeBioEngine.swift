import Foundation

/// A specific numerical misconception or unit-conversion trap ("Buggy Rule") in quantitative biology.
public struct BuggyBioRuleTrap: Identifiable, Equatable, Sendable {
    public var id: String { "\(trapName)-\(buggyValue)" }
    public let trapName: String
    public let buggyValue: Double
    public let tolerance: Double
    public let diagnosticWhy: String
    public let visualFixNudge: String

    public init(
        trapName: String,
        buggyValue: Double,
        tolerance: Double = 0.05,
        diagnosticWhy: String,
        visualFixNudge: String
    ) {
        self.trapName = trapName
        self.buggyValue = buggyValue
        self.tolerance = tolerance
        self.diagnosticWhy = diagnosticWhy
        self.visualFixNudge = visualFixNudge
    }
}

public struct QuantitativeBioProblem: Identifiable, Equatable, Sendable {
    public let id: String
    public let chapterNumber: Int
    public let schoolTopic: String
    public let title: String
    public let formulaDisplay: String
    public let prompt: String
    public let expectedNumericValue: Double
    public let expectedUnit: String
    public let acceptableUnits: [String]
    public let tolerance: Double
    public let stepByStepSolution: String
    public let commonTrapHint: String
    public let traps: [BuggyBioRuleTrap]
}

public struct QuantitativeCheckOutcome: Equatable, Sendable {
    public let isCorrect: Bool
    public let numericMatched: Bool
    public let unitMatched: Bool
    public let diagnosticMessage: String
    public let matchedTrap: BuggyBioRuleTrap?

    public init(
        isCorrect: Bool,
        numericMatched: Bool,
        unitMatched: Bool,
        diagnosticMessage: String,
        matchedTrap: BuggyBioRuleTrap? = nil
    ) {
        self.isCorrect = isCorrect
        self.numericMatched = numericMatched
        self.unitMatched = unitMatched
        self.diagnosticMessage = diagnosticMessage
        self.matchedTrap = matchedTrap
    }
}

public enum QuantitativeBioEngine {
    public static func problems(forChapter chapterNumber: Int) -> [QuantitativeBioProblem] {
        let exact = allProblems.filter { $0.chapterNumber == chapterNumber }
        if !exact.isEmpty { return exact }
        return [allProblems[abs(chapterNumber) % allProblems.count]]
    }

    public static let allProblems: [QuantitativeBioProblem] = [
        QuantitativeBioProblem(
            id: "qbio-01-magnification",
            chapterNumber: 0,
            schoolTopic: "6.2",
            title: "Microscope Magnification & µm Conversion",
            formulaDisplay: "M = I ÷ A   (1 mm = 1,000 µm)",
            prompt: "A palisade mesophyll cell measures 45 mm in a photomicrograph taken at a magnification of ×900. Calculate the actual length A of the cell in micrometres (µm).",
            expectedNumericValue: 50.0,
            expectedUnit: "µm",
            acceptableUnits: ["µm", "um", "micrometres", "micrometers"],
            tolerance: 0.1,
            stepByStepSolution: "1. Convert image size I to micrometres: 45 mm × 1,000 µm/mm = 45,000 µm.\n2. Rearrange M = I ÷ A to give A = I ÷ M.\n3. A = 45,000 µm ÷ 900 = 50 µm.",
            commonTrapHint: "Did you remember to convert 45 mm into 45,000 µm before dividing by ×900?",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Forgot mm → µm Conversion (×1,000)",
                    buggyValue: 0.05,
                    tolerance: 0.005,
                    diagnosticWhy: "You divided 45 mm by 900 to get 0.05 mm, but forgot to multiply by 1,000 to convert millimetres into micrometres (µm).",
                    visualFixNudge: "1 mm contains 1,000 µm: convert 45 mm → 45,000 µm first, then divide by 900."
                ),
                BuggyBioRuleTrap(
                    trapName: "Inverted Formula (M ÷ I instead of I ÷ M)",
                    buggyValue: 20.0,
                    tolerance: 0.2,
                    diagnosticWhy: "You divided magnification by image size (900 ÷ 45 = 20) instead of dividing image size (in µm) by magnification.",
                    visualFixNudge: "Use the I-A-M triangle: Actual size A = Image I ÷ Magnification M = 45,000 µm ÷ 900."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-02-atp-yield",
            chapterNumber: 1,
            schoolTopic: "1.4",
            title: "Aerobic vs Anaerobic ATP Stoichiometry",
            formulaDisplay: "Aerobic ≈ 30 ATP / glucose   vs   Anaerobic = 2 ATP / glucose",
            prompt: "During a sprint, a muscle cell oxidises 4 molecules of glucose aerobically in its mitochondria and ferments 10 molecules of glucose anaerobically in its cytoplasm. Using 30 ATP per aerobic glucose and 2 ATP per anaerobic glucose, calculate the total number of ATP molecules regenerated.",
            expectedNumericValue: 140.0,
            expectedUnit: "ATP",
            acceptableUnits: ["atp", "molecules", ""],
            tolerance: 0.1,
            stepByStepSolution: "1. Aerobic ATP = 4 glucose × 30 ATP/glucose = 120 ATP.\n2. Anaerobic ATP = 10 glucose × 2 ATP/glucose = 20 ATP.\n3. Total = 120 + 20 = 140 ATP.",
            commonTrapHint: "Multiply aerobic glucose by 30 ATP and anaerobic glucose by 2 ATP, then add them together.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Applied Aerobic Yield (30 ATP) to All 14 Glucose Molecules",
                    buggyValue: 420.0,
                    tolerance: 0.5,
                    diagnosticWhy: "You multiplied all 14 glucose molecules by 30 ATP (14 × 30 = 420), forgetting that the 10 anaerobic glucose molecules yield only 2 ATP each.",
                    visualFixNudge: "Split the budget: 4 aerobic × 30 ATP (mitochondria) + 10 anaerobic × 2 ATP (cytosol)."
                ),
                BuggyBioRuleTrap(
                    trapName: "Swapped Aerobic and Anaerobic Multipliers",
                    buggyValue: 308.0,
                    tolerance: 0.5,
                    diagnosticWhy: "You multiplied the 10 anaerobic glucose by 30 and the 4 aerobic glucose by 2 (300 + 8 = 308).",
                    visualFixNudge: "Aerobic respiration in mitochondria yields 30 ATP/glucose; anaerobic glycolysis yields only 2 ATP/glucose."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-03-sa-to-v",
            chapterNumber: 2,
            schoolTopic: "1.2",
            title: "Surface-Area-to-Volume Ratio of a Cuboidal Cell",
            formulaDisplay: "SA = 6L² ,  V = L³  ⇒  SA : V = 6 ÷ L",
            prompt: "Calculate the surface-area-to-volume ratio (in µm⁻¹) of a cuboidal bacterial cell of side length L = 2.0 µm.",
            expectedNumericValue: 3.0,
            expectedUnit: "µm⁻¹",
            acceptableUnits: ["µm⁻¹", "um^-1", ":1", ""],
            tolerance: 0.05,
            stepByStepSolution: "1. Surface area SA = 6 × (2.0 µm)² = 24 µm².\n2. Volume V = (2.0 µm)³ = 8.0 µm³.\n3. SA ÷ V = 24 ÷ 8.0 = 3.0 µm⁻¹ (or 3:1).",
            commonTrapHint: "For a cube of side L, SA = 6L² and V = L³, so SA/V simplifies to 6 ÷ L.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Stopped at Surface Area (24 µm²) Without Dividing by Volume",
                    buggyValue: 24.0,
                    tolerance: 0.1,
                    diagnosticWhy: "You calculated the total surface area of the 6 faces (6 × 2² = 24 µm²) but forgot to divide by the volume (2³ = 8 µm³).",
                    visualFixNudge: "Divide SA (24 µm²) by V (8 µm³) to get the ratio SA:V = 3.0 µm⁻¹."
                ),
                BuggyBioRuleTrap(
                    trapName: "Inverted Ratio (V ÷ SA instead of SA ÷ V)",
                    buggyValue: 0.33,
                    tolerance: 0.02,
                    diagnosticWhy: "You divided volume by surface area (8 ÷ 24 = 0.33) instead of surface area by volume.",
                    visualFixNudge: "SA:V is always Surface Area (6L²) ÷ Volume (L³) = 6 ÷ L = 6 ÷ 2.0 = 3.0."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-04-fick-diffusion",
            chapterNumber: 3,
            schoolTopic: "1.2",
            title: "Fick's Law Alveolar Barrier Thickening",
            formulaDisplay: "Rate ∝ (Surface Area × ΔC) ÷ Thickness Δx",
            prompt: "A healthy alveolus has a diffusion barrier thickness of 0.5 µm and transfers oxygen at 240 mL/min. During fluid build-up (oedema), the barrier thickness increases to 2.0 µm while surface area and concentration gradient stay constant. Calculate the new oxygen diffusion rate in mL/min.",
            expectedNumericValue: 60.0,
            expectedUnit: "mL/min",
            acceptableUnits: ["ml/min", "cm3/min", ""],
            tolerance: 0.5,
            stepByStepSolution: "1. Barrier thickness increases from 0.5 µm to 2.0 µm, which is a factor of 2.0 ÷ 0.5 = 4× thicker.\n2. By Fick's Law, diffusion rate is inversely proportional to thickness: 240 mL/min ÷ 4 = 60 mL/min.",
            commonTrapHint: "When diffusion distance quadruples (0.5 µm → 2.0 µm), the rate of diffusion is divided by 4.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Divided by Final Thickness (2.0) Instead of Thickness Ratio (4×)",
                    buggyValue: 120.0,
                    tolerance: 0.5,
                    diagnosticWhy: "You divided 240 by 2.0 instead of finding how many times thicker the barrier became (2.0 µm ÷ 0.5 µm = 4× thicker).",
                    visualFixNudge: "Compare the new thickness to the original: 2.0 µm is 4× thicker than 0.5 µm, so divide 240 mL/min by 4."
                ),
                BuggyBioRuleTrap(
                    trapName: "Treated Thickness as Directly Proportional (×4)",
                    buggyValue: 960.0,
                    tolerance: 1.0,
                    diagnosticWhy: "You multiplied 240 × 4 = 960, assuming a thicker barrier speeds up diffusion! A thicker wall slows gas exchange down.",
                    visualFixNudge: "Thickness Δx sits in the denominator of Fick's Law: quadrupling Δx divides diffusion rate by 4."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-05-osmosis-mass",
            chapterNumber: 3,
            schoolTopic: "2.2",
            title: "Potato Cylinder Osmosis Percentage Mass Change",
            formulaDisplay: "% Δm = ((m_final - m_initial) ÷ m_initial) × 100%",
            prompt: "A potato cylinder has an initial mass of 2.50 g. After 30 minutes in distilled water, its blotted mass is 2.85 g. Calculate the percentage change in mass (%).",
            expectedNumericValue: 14.0,
            expectedUnit: "%",
            acceptableUnits: ["%", "percent"],
            tolerance: 0.1,
            stepByStepSolution: "1. Change in mass Δm = 2.85 g - 2.50 g = +0.35 g.\n2. Percentage change = (0.35 ÷ 2.50) × 100% = +14.0%.",
            commonTrapHint: "Always divide the change in mass (2.85 - 2.50 = 0.35 g) by the INITIAL mass (2.50 g), not the final mass.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Divided by Final Mass (2.85 g) Instead of Initial Mass (2.50 g)",
                    buggyValue: 12.28,
                    tolerance: 0.15,
                    diagnosticWhy: "You divided the mass gain (0.35 g) by the final mass (2.85 g) instead of the starting mass (2.50 g).",
                    visualFixNudge: "Percentage change is always anchored to the INITIAL baseline mass: (0.35 ÷ 2.50) × 100% = 14.0%."
                ),
                BuggyBioRuleTrap(
                    trapName: "Reported Raw Mass Change (0.35 g) Instead of Percentage",
                    buggyValue: 0.35,
                    tolerance: 0.01,
                    diagnosticWhy: "0.35 g is the absolute change in mass (Δm), not the percentage change in mass.",
                    visualFixNudge: "Divide 0.35 g by initial mass 2.50 g and multiply by 100%."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-06-enzyme-q10",
            chapterNumber: 4,
            schoolTopic: "1.4",
            title: "Enzyme Q₁₀ Temperature Coefficient",
            formulaDisplay: "R₂ = R₁ × Q₁₀^((T₂ - T₁)/10)",
            prompt: "An amylase reaction digests starch at a rate of 4.5 mg/min at 17 °C. Given Q₁₀ = 2.0 between 17 °C and 37 °C, calculate the reaction rate (in mg/min) at human body temperature (37 °C).",
            expectedNumericValue: 18.0,
            expectedUnit: "mg/min",
            acceptableUnits: ["mg/min", ""],
            tolerance: 0.1,
            stepByStepSolution: "1. Temperature rise ΔT = 37 °C - 17 °C = 20 °C (two 10 °C intervals).\n2. Rate doubles for each 10 °C rise: R₂ = 4.5 × 2² = 4.5 × 4 = 18.0 mg/min.",
            commonTrapHint: "From 17 °C to 37 °C is a 20 °C increase — that means two 10 °C doublings (×4), not ×2.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Single Doubling (×2) Instead of Two 10 °C Doublings (×4)",
                    buggyValue: 9.0,
                    tolerance: 0.1,
                    diagnosticWhy: "You doubled 4.5 mg/min once to 9.0 mg/min (which is the rate at 27 °C), but 37 °C is TWO 10 °C steps above 17 °C.",
                    visualFixNudge: "Step 1 (17 °C → 27 °C): 4.5 × 2 = 9.0. Step 2 (27 °C → 37 °C): 9.0 × 2 = 18.0 mg/min."
                ),
                BuggyBioRuleTrap(
                    trapName: "Added Q₁₀ Instead of Multiplying",
                    buggyValue: 8.5,
                    tolerance: 0.1,
                    diagnosticWhy: "You added 2 + 2 = 4 to 4.5 instead of multiplying the rate by 2² = 4.",
                    visualFixNudge: "Q₁₀ = 2 is a multiplicative factor per 10 °C: multiply 4.5 × 4 = 18.0."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-07-light-inverse-square",
            chapterNumber: 5,
            schoolTopic: "6.4",
            title: "Inverse-Square Law of Light on Pondweed",
            formulaDisplay: "I₂ ÷ I₁ = (d₁ ÷ d₂)²",
            prompt: "A lamp placed 10 cm from Elodea pondweed produces 64 oxygen bubbles per minute. If the lamp is moved back to 20 cm (and light is the limiting factor), how many bubbles per minute are produced?",
            expectedNumericValue: 16.0,
            expectedUnit: "bubbles/min",
            acceptableUnits: ["bubbles/min", "bpm", "bubbles", ""],
            tolerance: 0.5,
            stepByStepSolution: "1. Distance doubles from 10 cm to 20 cm (d₂ = 2 d₁).\n2. By the inverse-square law, light intensity falls to (1/2)² = 1/4.\n3. Bubble rate = 64 ÷ 4 = 16 bubbles/min.",
            commonTrapHint: "Light spreads out in 2D area as distance increases, so doubling the distance divides intensity by 2² = 4.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Linear Halving (÷2) Instead of Inverse-Square (÷2² = ÷4)",
                    buggyValue: 32.0,
                    tolerance: 0.5,
                    diagnosticWhy: "You halved 64 to 32 assuming light intensity drops linearly with distance (1/d), but light spreads over a sphere of area 4πd² (1/d²).",
                    visualFixNudge: "Doubling distance spreads photons over 2 × 2 = 4 times the area, so divide 64 by 4 = 16."
                ),
                BuggyBioRuleTrap(
                    trapName: "Multiplied by 4 Instead of Dividing",
                    buggyValue: 256.0,
                    tolerance: 1.0,
                    diagnosticWhy: "Moving the lamp further away (10 cm → 20 cm) makes the light dimmer, not 4× brighter!",
                    visualFixNudge: "At 20 cm the pondweed receives 1/4 of the light intensity: 64 ÷ 4 = 16 bubbles/min."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-08-chromatography-rf",
            chapterNumber: 5,
            schoolTopic: "2.4",
            title: "Paper Chromatography Rf Value of Leaf Pigments",
            formulaDisplay: "Rf = distance moved by pigment spot ÷ distance moved by solvent front",
            prompt: "On a spinach leaf chromatogram (Unit 2.4), the solvent front travels 8.0 cm above the pencil baseline, and the green chlorophyll a spot travels 4.8 cm above the baseline. Calculate the Rf value of chlorophyll a.",
            expectedNumericValue: 0.60,
            expectedUnit: "",
            acceptableUnits: ["", "rf"],
            tolerance: 0.02,
            stepByStepSolution: "1. Rf = d_spot ÷ d_solvent = 4.8 cm ÷ 8.0 cm = 0.60.\n2. Because cm ÷ cm cancels out, Rf has no units and is always between 0 and 1.",
            commonTrapHint: "Divide the pigment spot distance (4.8 cm) by the solvent front distance (8.0 cm). Rf is always less than 1.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Inverted Ratio (Solvent ÷ Spot = 1.67 > 1.0)",
                    buggyValue: 1.67,
                    tolerance: 0.03,
                    diagnosticWhy: "You divided the solvent front by the spot distance (8.0 ÷ 4.8 = 1.67). Because no pigment can travel higher than the solvent front, Rf can never exceed 1.0!",
                    visualFixNudge: "Always put the smaller pigment distance in the numerator: Rf = 4.8 cm ÷ 8.0 cm = 0.60."
                ),
                BuggyBioRuleTrap(
                    trapName: "Subtracted Distances (8.0 − 4.8 = 3.2) Instead of Dividing",
                    buggyValue: 3.2,
                    tolerance: 0.05,
                    diagnosticWhy: "You subtracted 8.0 − 4.8 = 3.2 cm, which is the gap below the solvent front, not the retardation factor ratio Rf.",
                    visualFixNudge: "Rf is a dimensionless fraction: divide 4.8 by 8.0 = 0.60."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-09-minute-ventilation",
            chapterNumber: 6,
            schoolTopic: "1.3",
            title: "Pulmonary Minute Ventilation",
            formulaDisplay: "Minute Ventilation = Tidal Volume × Breathing Rate",
            prompt: "During brisk exercise (Unit 1.3), Kym breathes 24 times per minute and inhales a tidal volume of 1.25 L of air per breath. Calculate her pulmonary minute ventilation in L/min.",
            expectedNumericValue: 30.0,
            expectedUnit: "L/min",
            acceptableUnits: ["l/min", "dm3/min", "l"],
            tolerance: 0.2,
            stepByStepSolution: "1. Minute ventilation = 1.25 L/breath × 24 breaths/min = 30.0 L/min.",
            commonTrapHint: "Multiply tidal volume per breath (1.25 L) by breaths per minute (24).",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Divided Breathing Rate by Tidal Volume (24 ÷ 1.25)",
                    buggyValue: 19.2,
                    tolerance: 0.1,
                    diagnosticWhy: "You divided 24 by 1.25 instead of multiplying volume per breath by breaths per minute.",
                    visualFixNudge: "Each of the 24 breaths brings in 1.25 L: multiply 24 × 1.25 = 30.0 L/min."
                ),
                BuggyBioRuleTrap(
                    trapName: "Added Instead of Multiplying (24 + 1.25)",
                    buggyValue: 25.25,
                    tolerance: 0.1,
                    diagnosticWhy: "You added 24 + 1.25 = 25.25; check the units: (L / breath) × (breaths / min) = L/min.",
                    visualFixNudge: "Multiply 1.25 L × 24 breaths/min = 30.0 L/min."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-10-cardiac-output",
            chapterNumber: 7,
            schoolTopic: "1.5",
            title: "Cardiac Output from Heart Rate & Stroke Volume",
            formulaDisplay: "Cardiac Output Q = Heart Rate (HR) × Stroke Volume (SV)",
            prompt: "A resting athlete has a heart rate of 60 beats/min and a left ventricular stroke volume of 85 mL/beat. Calculate the cardiac output in L/min.",
            expectedNumericValue: 5.1,
            expectedUnit: "L/min",
            acceptableUnits: ["l/min", "dm3/min"],
            tolerance: 0.05,
            stepByStepSolution: "1. Q in mL/min = 60 beats/min × 85 mL/beat = 5,100 mL/min.\n2. Convert mL to L (÷ 1,000): 5,100 ÷ 1,000 = 5.1 L/min.",
            commonTrapHint: "60 × 85 gives 5,100 mL/min — divide by 1,000 to express the answer in L/min (5.1 L/min).",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Left Cardiac Output in mL/min (5,100) Instead of L/min",
                    buggyValue: 5100.0,
                    tolerance: 5.0,
                    diagnosticWhy: "5,100 is the correct volume in mL/min, but the question asks for litres per minute (L/min).",
                    visualFixNudge: "Divide 5,100 mL/min by 1,000 mL/L to get 5.1 L/min."
                ),
                BuggyBioRuleTrap(
                    trapName: "Added HR + SV (60 + 85 = 145)",
                    buggyValue: 145.0,
                    tolerance: 0.5,
                    diagnosticWhy: "You added 60 + 85 instead of multiplying beats/min by mL/beat.",
                    visualFixNudge: "Multiply 60 beats/min × 0.085 L/beat = 5.1 L/min."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-11-forearm-lever",
            chapterNumber: 8,
            schoolTopic: "7.4",
            title: "Biceps Antagonistic Lever Moment at the Elbow",
            formulaDisplay: "F_biceps × d_in = F_load × d_out   (Unit 3.4 & 7.4)",
            prompt: "A student holds a 16 N dumbbell in her hand 28 cm from her elbow hinge joint. Her biceps tendon attaches to the radius 4.0 cm from the elbow pivot. Calculate the upward pulling force (in N) exerted by her biceps muscle.",
            expectedNumericValue: 112.0,
            expectedUnit: "N",
            acceptableUnits: ["n", "newtons"],
            tolerance: 0.5,
            stepByStepSolution: "1. Clockwise moment of dumbbell = 16 N × 28 cm = 448 N cm.\n2. Anticlockwise moment of biceps = F_biceps × 4.0 cm = 448 N cm.\n3. F_biceps = 448 ÷ 4.0 = 112 N.",
            commonTrapHint: "Set F_biceps × 4.0 cm = 16 N × 28 cm, so F_biceps = (16 × 28) ÷ 4.0.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Stopped at Moment (448 N cm) Without Dividing by 4.0 cm",
                    buggyValue: 448.0,
                    tolerance: 0.5,
                    diagnosticWhy: "448 N cm is the turning moment of the dumbbell about the elbow, not the force exerted by the biceps muscle.",
                    visualFixNudge: "Divide the clockwise moment (448 N cm) by the biceps insertion distance (4.0 cm) to get 112 N."
                ),
                BuggyBioRuleTrap(
                    trapName: "Assumed 1:1 Force Balance (16 N) Ignoring Lever Ratio",
                    buggyValue: 16.0,
                    tolerance: 0.2,
                    diagnosticWhy: "Because the hand is 7× further from the elbow pivot than the biceps tendon (28 cm vs 4 cm), the biceps must pull with 7× the dumbbell's weight!",
                    visualFixNudge: "Multiply 16 N × (28 cm ÷ 4.0 cm) = 16 × 7 = 112 N."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-12-camel-pressure",
            chapterNumber: 14,
            schoolTopic: "4.1",
            title: "Camel Footpad Pressure on Desert Sand",
            formulaDisplay: "Pressure P = Force ÷ Area   (Unit 3.5 & 4.1)",
            prompt: "A desert camel weighs 4,800 N and stands on all four feet. Each wide footpad has an area of 300 cm². Calculate the pressure exerted on the sand in N/cm².",
            expectedNumericValue: 4.0,
            expectedUnit: "N/cm²",
            acceptableUnits: ["n/cm2", "n/cm²", ""],
            tolerance: 0.1,
            stepByStepSolution: "1. Total area of all 4 feet = 4 × 300 cm² = 1,200 cm².\n2. Pressure P = Force ÷ Total Area = 4,800 N ÷ 1,200 cm² = 4.0 N/cm².",
            commonTrapHint: "Remember the camel stands on ALL FOUR feet: total area = 4 × 300 cm² = 1,200 cm².",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Single-Foot Area Trap (Divided by 300 cm² Instead of 4 × 300 cm²)",
                    buggyValue: 16.0,
                    tolerance: 0.1,
                    diagnosticWhy: "You divided 4,800 N by 300 cm² (one foot), forgetting that the camel distributes its weight across all FOUR feet (1,200 cm²)!",
                    visualFixNudge: "Multiply 300 cm² × 4 feet = 1,200 cm², then divide 4,800 N ÷ 1,200 cm² = 4.0 N/cm²."
                ),
                BuggyBioRuleTrap(
                    trapName: "Inverted Pressure Formula (Area ÷ Force)",
                    buggyValue: 0.25,
                    tolerance: 0.02,
                    diagnosticWhy: "You divided area by force (1,200 ÷ 4,800 = 0.25) instead of Force ÷ Area.",
                    visualFixNudge: "Pressure = Force ÷ Total Area = 4,800 N ÷ 1,200 cm² = 4.0 N/cm²."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-13-reflex-latency",
            chapterNumber: 9,
            schoolTopic: "3.2",
            title: "Spinal Reflex Arc Conduction & Synaptic Delay",
            formulaDisplay: "t_total = (d_path ÷ v_impulse) + (n_synapses × t_synapse)",
            prompt: "A pain impulse travels 0.80 m from fingertip to spinal cord and 0.80 m back to the biceps muscle at a speed of 80 m/s, crossing 2 synapses in the spinal cord that each add a 1.5 ms chemical diffusion delay. Calculate the total reflex time in milliseconds (ms).",
            expectedNumericValue: 23.0,
            expectedUnit: "ms",
            acceptableUnits: ["ms", "milliseconds"],
            tolerance: 0.2,
            stepByStepSolution: "1. Total neurone conduction distance = 0.80 m + 0.80 m = 1.60 m.\n2. Conduction time = 1.60 m ÷ 80 m/s = 0.020 s = 20 ms.\n3. Synaptic delay = 2 synapses × 1.5 ms = 3.0 ms.\n4. Total reflex time = 20 ms + 3.0 ms = 23.0 ms.",
            commonTrapHint: "Convert 0.020 seconds into 20 milliseconds (×1,000), then add 2 × 1.5 ms = 3 ms for the two synapses.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "One-Way Distance Trap (Used 0.80 m Instead of Round-Trip 1.60 m)",
                    buggyValue: 13.0,
                    tolerance: 0.2,
                    diagnosticWhy: "You calculated conduction time for only 0.80 m (10 ms + 3 ms = 13 ms), forgetting the motor neurone journey 0.80 m back to the biceps!",
                    visualFixNudge: "A reflex arc travels 0.80 m IN (sensory) + 0.80 m OUT (motor) = 1.60 m (20 ms) + 3 ms synaptic delay = 23 ms."
                ),
                BuggyBioRuleTrap(
                    trapName: "Forgot Synaptic Chemical Diffusion Delay (20 ms Only)",
                    buggyValue: 20.0,
                    tolerance: 0.2,
                    diagnosticWhy: "20 ms is the electrical axon conduction time, but you forgot to add the 2 × 1.5 ms = 3.0 ms delay across the two spinal synapses.",
                    visualFixNudge: "Add 20 ms (axon conduction) + 3 ms (two synaptic clefts) = 23.0 ms."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-14-diet-energy",
            chapterNumber: 4,
            schoolTopic: "7.2",
            title: "Balanced Diet Macronutrient Energy Calculation",
            formulaDisplay: "Carbohydrate = 17 kJ/g ,  Protein = 17 kJ/g ,  Fat = 37 kJ/g",
            prompt: "A school lunch provides 60 g of carbohydrate, 20 g of protein, and 10 g of fat. Using 17 kJ/g for carbohydrate and protein and 37 kJ/g for fat, calculate the total energy content in kilojoules (kJ).",
            expectedNumericValue: 1730.0,
            expectedUnit: "kJ",
            acceptableUnits: ["kj", "kilojoules"],
            tolerance: 1.0,
            stepByStepSolution: "1. Carbohydrate energy = 60 g × 17 kJ/g = 1,020 kJ.\n2. Protein energy = 20 g × 17 kJ/g = 340 kJ.\n3. Fat energy = 10 g × 37 kJ/g = 370 kJ.\n4. Total energy = 1,020 + 340 + 370 = 1,730 kJ (1.73 MJ).",
            commonTrapHint: "Fat stores more than twice as much energy per gram (37 kJ/g) as carbohydrate or protein (17 kJ/g).",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Used 17 kJ/g for Fat Instead of 37 kJ/g",
                    buggyValue: 1530.0,
                    tolerance: 1.0,
                    diagnosticWhy: "You multiplied all 90 g of food by 17 kJ/g (90 × 17 = 1,530 kJ), forgetting that fat has a much higher energy density (37 kJ/g).",
                    visualFixNudge: "Calculate fat separately: (60 + 20) × 17 kJ/g + (10 × 37 kJ/g) = 1,360 + 370 = 1,730 kJ."
                ),
                BuggyBioRuleTrap(
                    trapName: "Reported in Megajoules (1.73 MJ) Instead of Kilojoules (1,730 kJ)",
                    buggyValue: 1.73,
                    tolerance: 0.02,
                    diagnosticWhy: "1.73 is the energy in megajoules (MJ), whereas the question asks for kilojoules (kJ).",
                    visualFixNudge: "1 MJ = 1,000 kJ, so write 1730 kJ."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-15-mendel-punnett",
            chapterNumber: 13,
            schoolTopic: "7.3",
            title: "Mendelian Heterozygous Cross Probability",
            formulaDisplay: "Aa × Aa  ⇒  1 AA : 2 Aa : 1 aa  (25% recessive)",
            prompt: "In pea plants, tall stem (T) is dominant over dwarf stem (t). Two heterozygous tall plants (Tt × Tt) are crossed and produce 240 offspring seeds. How many offspring plants are expected to be dwarf (tt)?",
            expectedNumericValue: 60.0,
            expectedUnit: "plants",
            acceptableUnits: ["plants", "seeds", ""],
            tolerance: 0.5,
            stepByStepSolution: "1. Punnett square for Tt × Tt gives genotypes: 1/4 TT, 2/4 Tt, 1/4 tt.\n2. Only homozygous recessive (tt = 1/4 = 25%) are dwarf.\n3. Expected dwarf plants = 240 × (1/4) = 60 plants.",
            commonTrapHint: "In a Tt × Tt cross, 3/4 (180) are tall and 1/4 (60) are dwarf.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Calculated Dominant Tall Offspring (3/4 = 180) Instead of Dwarf (1/4 = 60)",
                    buggyValue: 180.0,
                    tolerance: 0.5,
                    diagnosticWhy: "180 (3/4 of 240) is the expected number of TALL plants (TT and Tt), whereas the question asks for recessive DWARF (tt) plants.",
                    visualFixNudge: "Only 1 out of 4 squares in the Tt × Tt Punnett grid is tt: 240 ÷ 4 = 60."
                ),
                BuggyBioRuleTrap(
                    trapName: "Assumed 50:50 Split (120) in a Heterozygous Cross",
                    buggyValue: 120.0,
                    tolerance: 0.5,
                    diagnosticWhy: "A 50:50 ratio (120) occurs in a test cross (Tt × tt), not when two heterozygotes (Tt × Tt) are crossed.",
                    visualFixNudge: "In Tt × Tt, both TT (1/4) and Tt (2/4) are tall (3/4 total), leaving 1/4 (60) dwarf."
                )
            ]
        ),
        QuantitativeBioProblem(
            id: "qbio-16-biomagnification",
            chapterNumber: 15,
            schoolTopic: "4.4",
            title: "Trophic Biomagnification Factor & Energy Pyramid",
            formulaDisplay: "BMF = C_predator ÷ C_water   (Unit 4.4 Bioaccumulation)",
            prompt: "In a lake ecosystem (Unit 4.4), water contains 0.000002 ppm of DDT, and fish-eating ospreys at the top of the food chain contain 10 ppm of DDT in their tissues. By how many millions of times (× 10⁶) has the DDT concentration been magnified from the water to the osprey?",
            expectedNumericValue: 5.0,
            expectedUnit: "million",
            acceptableUnits: ["million", "×10^6", ""],
            tolerance: 0.1,
            stepByStepSolution: "1. Biomagnification factor = 10 ppm ÷ 0.000002 ppm = 5,000,000 = 5 million times (5 × 10⁶).",
            commonTrapHint: "Divide 10 by 0.000002 (2 × 10⁻⁶) to get 5,000,000, which is 5 million times.",
            traps: [
                BuggyBioRuleTrap(
                    trapName: "Multiplied Instead of Dividing (10 × 2 = 20)",
                    buggyValue: 20.0,
                    tolerance: 0.2,
                    diagnosticWhy: "You multiplied 10 × 2 instead of dividing 10 by 2 × 10⁻⁶.",
                    visualFixNudge: "10 ÷ (2 × 10⁻⁶) = (10 ÷ 2) × 10⁶ = 5 million times."
                ),
                BuggyBioRuleTrap(
                    trapName: "Decimal Place Slip (Off by 10× → 0.5 or 50)",
                    buggyValue: 0.5,
                    tolerance: 0.05,
                    diagnosticWhy: "Count the six decimal places in 0.000002 (= 2 × 10⁻⁶): 1 ÷ 0.000002 is 500,000 (0.5 million), so 10 ÷ 0.000002 is 5.0 million.",
                    visualFixNudge: "10 ppm ÷ 0.000002 ppm = 5,000,000 = 5.0 million."
                )
            ]
        ),
    ]

    public static func evaluate(problem: QuantitativeBioProblem, rawInput: String) -> QuantitativeCheckOutcome {
        let trimmed = rawInput.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else {
            return QuantitativeCheckOutcome(
                isCorrect: false,
                numericMatched: false,
                unitMatched: false,
                diagnosticMessage: "Enter your calculated number and unit."
            )
        }

        // Extract leading numeric token
        let pattern = #"[-+]?[0-9]*\.?[0-9]+"#
        guard let range = trimmed.range(of: pattern, options: .regularExpression),
              let value = Double(trimmed[range]) else {
            return QuantitativeCheckOutcome(
                isCorrect: false,
                numericMatched: false,
                unitMatched: false,
                diagnosticMessage: "Could not read a number in your answer. Write a number such as \(problem.expectedNumericValue) \(problem.expectedUnit)."
            )
        }

        let unitPart = trimmed[range.upperBound...]
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .lowercased()

        let numericDiff = abs(value - problem.expectedNumericValue)
        let numericMatched = numericDiff <= problem.tolerance

        let unitMatched: Bool
        if problem.expectedUnit.isEmpty || problem.acceptableUnits.contains("") {
            unitMatched = true
        } else {
            unitMatched = problem.acceptableUnits.contains(unitPart) || unitPart.isEmpty
        }

        if numericMatched && unitMatched {
            return QuantitativeCheckOutcome(
                isCorrect: true,
                numericMatched: true,
                unitMatched: true,
                diagnosticMessage: "Exact match: \(problem.expectedNumericValue) \(problem.expectedUnit).",
                matchedTrap: nil
            )
        }

        // Check specific Buggy-Rule Traps first
        if let trap = problem.traps.first(where: { abs(value - $0.buggyValue) <= $0.tolerance }) {
            return QuantitativeCheckOutcome(
                isCorrect: false,
                numericMatched: false,
                unitMatched: unitMatched,
                diagnosticMessage: "Trap spotted (\(trap.trapName)): \(trap.diagnosticWhy) Fix: \(trap.visualFixNudge)",
                matchedTrap: trap
            )
        }

        // Check common power-of-10 unit conversion slips (e.g. off by 1000x)
        let offBy1000 = abs(value * 1000.0 - problem.expectedNumericValue) <= problem.tolerance * 10
            || abs(value / 1000.0 - problem.expectedNumericValue) <= problem.tolerance

        if offBy1000 {
            return QuantitativeCheckOutcome(
                isCorrect: false,
                numericMatched: false,
                unitMatched: unitMatched,
                diagnosticMessage: "Your digits are right, but you are off by a factor of 1,000 (check mm ↔ µm or mL ↔ L conversion). \(problem.commonTrapHint)",
                matchedTrap: nil
            )
        } else {
            return QuantitativeCheckOutcome(
                isCorrect: false,
                numericMatched: numericMatched,
                unitMatched: unitMatched,
                diagnosticMessage: problem.commonTrapHint,
                matchedTrap: nil
            )
        }
    }
}
