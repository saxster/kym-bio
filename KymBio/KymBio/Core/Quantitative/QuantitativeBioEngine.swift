import Foundation

struct QuantitativeBioProblem: Identifiable, Equatable, Sendable {
    let id: String
    let chapterNumber: Int
    let schoolTopic: String
    let title: String
    let formulaDisplay: String
    let prompt: String
    let expectedNumericValue: Double
    let expectedUnit: String
    let acceptableUnits: [String]
    let tolerance: Double
    let stepByStepSolution: String
    let commonTrapHint: String
}

struct QuantitativeCheckOutcome: Equatable, Sendable {
    let isCorrect: Bool
    let numericMatched: Bool
    let unitMatched: Bool
    let diagnosticMessage: String
}

enum QuantitativeBioEngine {
    static let allProblems: [QuantitativeBioProblem] = [
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
            commonTrapHint: "Did you remember to convert 45 mm into 45,000 µm before dividing by ×900?"
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
            commonTrapHint: "Multiply aerobic glucose by 30 ATP and anaerobic glucose by 2 ATP, then add them together."
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
            commonTrapHint: "For a cube of side L, SA = 6L² and V = L³, so SA/V simplifies to 6 ÷ L."
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
            commonTrapHint: "When diffusion distance quadruples (0.5 µm → 2.0 µm), the rate of diffusion is divided by 4."
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
            commonTrapHint: "Always divide the change in mass (2.85 - 2.50 = 0.35 g) by the INITIAL mass (2.50 g), not the final mass."
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
            commonTrapHint: "From 17 °C to 37 °C is a 20 °C increase — that means two 10 °C doublings (×4), not ×2."
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
            commonTrapHint: "Light spreads out in 2D area as distance increases, so doubling the distance divides intensity by 2² = 4."
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
            commonTrapHint: "Divide the pigment spot distance (4.8 cm) by the solvent front distance (8.0 cm). Rf is always less than 1."
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
            commonTrapHint: "Multiply tidal volume per breath (1.25 L) by breaths per minute (24)."
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
            commonTrapHint: "60 × 85 gives 5,100 mL/min — divide by 1,000 to express the answer in L/min (5.1 L/min)."
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
            commonTrapHint: "Set F_biceps × 4.0 cm = 16 N × 28 cm, so F_biceps = (16 × 28) ÷ 4.0."
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
            commonTrapHint: "Remember the camel stands on ALL FOUR feet: total area = 4 × 300 cm² = 1,200 cm²."
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
            commonTrapHint: "Convert 0.020 seconds into 20 milliseconds (×1,000), then add 2 × 1.5 ms = 3 ms for the two synapses."
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
            commonTrapHint: "Fat stores more than twice as much energy per gram (37 kJ/g) as carbohydrate or protein (17 kJ/g)."
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
            commonTrapHint: "In a Tt × Tt cross, 3/4 (180) are tall and 1/4 (60) are dwarf."
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
            commonTrapHint: "Divide 10 by 0.000002 (2 × 10⁻⁶) to get 5,000,000, which is 5 million times."
        ),
    ]

    static func evaluate(problem: QuantitativeBioProblem, rawInput: String) -> QuantitativeCheckOutcome {
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

        // Check common power-of-10 unit conversion slips (e.g. off by 1000x)
        let offBy1000 = abs(value * 1000.0 - problem.expectedNumericValue) <= problem.tolerance * 10
            || abs(value / 1000.0 - problem.expectedNumericValue) <= problem.tolerance

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
                diagnosticMessage: "Exact match: \(problem.expectedNumericValue) \(problem.expectedUnit)."
            )
        } else if offBy1000 {
            return QuantitativeCheckOutcome(
                isCorrect: false,
                numericMatched: false,
                unitMatched: unitMatched,
                diagnosticMessage: "Your digits are right, but you are off by a factor of 1,000 (check mm ↔ µm or mL ↔ L conversion). \(problem.commonTrapHint)"
            )
        } else {
            return QuantitativeCheckOutcome(
                isCorrect: false,
                numericMatched: numericMatched,
                unitMatched: unitMatched,
                diagnosticMessage: problem.commonTrapHint
            )
        }
    }
}
