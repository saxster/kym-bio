"""Chapter 10 original SVG plates — Holding the Line in a Mumbai Summer (Homeostasis, Excretion & Immunity)."""
from figs_core import Fig, figure

ARROW_KIND = {"e": "electron", "p": "proton", "g": "green", "ink": "ink"}


def heading(f: Fig, title: str, sub: str) -> None:
    f.text(320, 22, title, "t b", "middle", 12.5)
    f.text(320, 40, sub, "t m", "middle", 9.5)


def txt(f: Fig, x: float, y: float, s: str, cls: str = "t", size: float = 9.0, anchor: str = "middle") -> None:
    f.text(x, y, s, cls, anchor, size)


def arr(f: Fig, x1: float, y1: float, x2: float, y2: float, k: str = "ink") -> None:
    f.arrow(x1, y1, x2, y2, ARROW_KIND.get(k, k), width=1.8)


def box(f: Fig, x: float, y: float, w: float, h: float, rows, cls: str = "plate", size: float = 9.0) -> None:
    f.rect(x, y, w, h, cls, rx=8)
    for dy, s, tcls in rows:
        f.text(x + w / 2, y + dy, s, tcls, "middle", size)


@figure
def c10_negative_feedback_glucose() -> str:
    f = Fig(640, 620, "Negative feedback around a set point: pancreas and liver control of blood glucose concentration")
    heading(
        f,
        "10.1  Negative feedback around a set point: insulin, glucagon and the liver",
        "Corrective hormone signals from the pancreas oppose rises and falls so blood glucose stays near 4.0–5.5 mmol/L",
    )

    # Central set-point bar
    box(
        f,
        185,
        192,
        270,
        54,
        [
            (21, "SET POINT: Normal blood glucose", "t b"),
            (40, "4.0–5.5 mmol/L (72–99 mg/dL) in plasma", "t m"),
        ],
        "plate",
        9.2,
    )

    # TOP LOOP: High blood glucose (After mango / aamras meal)
    box(
        f,
        20,
        62,
        185,
        102,
        [
            (20, "1A. Stimulus: Glucose rises", "t b e"),
            (39, "Sweet mango / carb meal absorbed", "t s"),
            (56, "via hepatic portal vein (8.5 mmol/L)", "t s"),
            (73, "Receptor: Pancreas islets", "t b"),
            (90, "detect glucose above set point", "t m"),
        ],
        "wash-e",
        8.8,
    )
    arr(f, 205, 112, 232, 112, "e")

    box(
        f,
        234,
        62,
        172,
        102,
        [
            (20, "2A. Coordinator: Pancreas", "t b e"),
            (39, "Beta cells secrete INSULIN", "t b"),
            (57, "into blood plasma; glucagon", "t s"),
            (74, "secretion is suppressed", "t s"),
            (91, "Travels in blood to liver & muscle", "t m"),
        ],
        "plate",
        8.8,
    )
    arr(f, 406, 112, 433, 112, "e")

    box(
        f,
        435,
        62,
        185,
        102,
        [
            (20, "3A. Effector: Liver & muscle", "t b e"),
            (39, "Cells take up more glucose;", "t s"),
            (56, "respire more glucose;", "t s"),
            (73, "convert GLUCOSE → GLYCOGEN", "t b"),
            (90, "Blood glucose falls to set point", "t g"),
        ],
        "wash-e",
        8.8,
    )

    # Return and departure arrows for top loop (routed outside text boxes)
    arr(f, 185, 206, 112, 166, "e")
    arr(f, 528, 166, 455, 206, "e")

    # BOTTOM LOOP: Low blood glucose (Fasting / exercise)
    box(
        f,
        20,
        282,
        185,
        102,
        [
            (20, "1B. Stimulus: Glucose falls", "t b p"),
            (39, "Overnight fast or cricket match", "t s"),
            (56, "uses plasma glucose (3.4 mmol/L)", "t s"),
            (73, "Receptor: Pancreas islets", "t b"),
            (90, "detect glucose below set point", "t m"),
        ],
        "wash-p",
        8.8,
    )
    arr(f, 205, 332, 232, 332, "p")

    box(
        f,
        234,
        282,
        172,
        102,
        [
            (20, "2B. Coordinator: Pancreas", "t b p"),
            (39, "Alpha cells secrete GLUCAGON", "t b"),
            (57, "into blood plasma; insulin", "t s"),
            (74, "secretion is suppressed", "t s"),
            (91, "Travels in blood to liver cells", "t m"),
        ],
        "plate",
        8.8,
    )
    arr(f, 406, 332, 433, 332, "p")

    box(
        f,
        435,
        282,
        185,
        102,
        [
            (20, "3B. Effector: Liver cells", "t b p"),
            (39, "Enzymes break down stored", "t s"),
            (56, "GLYCOGEN → GLUCOSE", "t b"),
            (73, "Glucose released into hepatic vein", "t s"),
            (90, "Blood glucose rises to set point", "t g"),
        ],
        "wash-p",
        8.8,
    )

    # Departure and return arrows for bottom loop
    arr(f, 185, 234, 112, 280, "p")
    arr(f, 528, 280, 455, 234, "p")

    # Bottom panel: 24-hour oscillation trace vs Type 1 diabetes / Positive feedback contrast
    f.rect(20, 404, 385, 198, "plate", rx=8)
    txt(f, 212, 424, "Why negative feedback oscillates gently around the set point", "t b", 9.8)
    txt(f, 212, 441, "Blood glucose (mmol/L) over 6 hours after a mango meal", "t m", 8.5)

    # Plot axes inside left bottom panel
    f.line(68, 456, 68, 560, "ax")
    f.line(68, 560, 385, 560, "ax")
    txt(f, 44, 466, "16.0", "t m", 8)
    txt(f, 44, 496, "9.0", "t m", 8)
    txt(f, 44, 524, "5.0", "t b g", 8)
    txt(f, 44, 552, "3.0", "t m", 8)

    # Set point dashed line at y=524
    f.line(68, 524, 382, 524, "ln r")
    txt(f, 342, 517, "Set point (5.0)", "t g", 8)

    # Untreated Type 1 diabetes curve (upper purple curve)
    f.path("M 68 482 C 110 462, 165 458, 225 462 C 285 465, 335 468, 380 470", "ln p")
    txt(f, 245, 455, "Untreated Type 1 diabetes (no insulin)", "t b p", 8)

    # Healthy negative feedback oscillating curve (orange/green curve)
    f.path("M 68 524 C 95 524, 115 488, 145 488 C 175 488, 205 536, 238 536 C 270 536, 305 518, 380 524", "ln e")
    txt(f, 145, 481, "Insulin wave", "t e", 8)
    txt(f, 238, 549, "Glucagon wave", "t p", 8)

    txt(f, 85, 575, "0 h (Meal)", "t m", 8)
    txt(f, 180, 575, "2 h", "t m", 8)
    txt(f, 275, 575, "4 h", "t m", 8)
    txt(f, 365, 575, "6 h", "t m", 8)
    txt(f, 212, 593, "Correction always opposes the latest drift from 5.0 mmol/L", "t s", 8.5)

    # Right bottom summary card: Negative vs Positive feedback & Type 1 diabetes
    box(
        f,
        415,
        404,
        205,
        198,
        [
            (22, "Key 0610 Distinctions", "t b"),
            (44, "1. Negative feedback:", "t b g"),
            (61, "Response opposes the stimulus", "t s"),
            (77, "to return toward the set point.", "t s"),
            (98, "2. Positive feedback:", "t b p"),
            (115, "Response amplifies the change", "t s"),
            (131, "(not homeostatic stability).", "t s"),
            (152, "3. Type 1 diabetes care:", "t b e"),
            (169, "Blood glucose tests + injected", "t s"),
            (185, "insulin + planned meals/exercise.", "t s"),
        ],
        "wash-n",
        8.4,
    )

    return f.svg()


@figure
def c10_skin_thermoregulation() -> str:
    f = Fig(640, 630, "Mammalian skin structure and thermoregulation: vasodilation and sweating vs vasoconstriction and shivering")
    heading(
        f,
        "10.2  Mammalian skin and brain-controlled thermoregulation (set point 37.0 °C)",
        "Hypothalamus receptors coordinate sweat glands, skeletal muscles, hair erector muscles and skin arterioles",
    )

    # Top central Brain / Hypothalamus coordinator box
    box(
        f,
        150,
        56,
        340,
        62,
        [
            (20, "Control Centre: BRAIN (Hypothalamus at 37.0 °C set point)", "t b"),
            (39, "Compares blood temperature + impulses from skin sensory neurones", "t s"),
            (55, "Sends motor nerve impulses to skin arterioles, sweat glands & muscles", "t m"),
        ],
        "plate",
        8.8,
    )
    arr(f, 220, 118, 160, 140, "e")
    arr(f, 420, 118, 480, 140, "p")

    # LEFT PANEL: HOT (38 °C Mumbai street)
    f.rect(20, 142, 292, 372, "wash-e", rx=8)
    txt(f, 166, 162, "TOO HOT (Core > 37.0 °C · Dadar 38 °C)", "t b e", 9.8)
    txt(f, 166, 179, "Goal: Maximise thermal energy transfer to air", "t m", 8.5)

    # Skin layers inside Left panel
    f.rect(34, 212, 264, 34, "plate", rx=4)
    f.rect(34, 246, 264, 138, "plate", rx=4)
    f.rect(34, 384, 264, 42, "wash-n", rx=4)
    txt(f, 72, 232, "Epidermis", "t b", 8.3)
    txt(f, 68, 266, "Dermis", "t b", 8.3)
    txt(f, 98, 409, "Fatty tissue (insulation)", "t m", 8.3)

    # Flat hair & relaxed erector muscle (Left)
    f.line(118, 240, 165, 196, "ln")
    f.line(95, 258, 128, 232, "ln r")
    txt(f, 95, 198, "Hair lies flat", "t s", 8)
    txt(f, 92, 284, "Relaxed erector", "t m", 8)

    # Active sweat gland, duct and evaporating droplets (Left)
    f.circle(172, 342, 14, "wash-e")
    f.line(172, 328, 172, 212, "ln e")
    f.circle(164, 205, 2.8, "pt-e")
    f.circle(172, 202, 2.8, "pt-e")
    f.circle(180, 206, 2.8, "pt-e")
    txt(f, 232, 190, "Sweat evaporates (2,420 J/g)", "t b e", 8)
    txt(f, 172, 370, "Sweat gland active", "t e", 8)

    # Vasodilated arteriole & wide capillary loop flow (Left)
    f.line(238, 382, 238, 310, "ln e")
    f.line(246, 382, 246, 310, "ln e")
    f.path("M 242 310 C 232 252, 272 252, 262 310", "ln e")
    f.line(262, 310, 262, 382, "ln p")
    f.line(246, 336, 262, 336, "ln r")
    txt(f, 246, 236, "Dense blood flow in", "t b e", 8)
    txt(f, 246, 250, "surface capillary loop", "t e", 8)
    txt(f, 204, 302, "Wide arteriole", "t b e", 7.8)

    # Left bottom summary bullets
    txt(f, 166, 444, "1. Arteriole VASODILATION: smooth muscle relaxes;", "t b e", 8.4)
    txt(f, 166, 460, "more warm blood flows through surface capillaries.", "t s", 8.4)
    txt(f, 166, 478, "2. SWEATING increases: evaporation removes latent", "t b e", 8.4)
    txt(f, 166, 494, "heat from skin; hair erector muscles relax.", "t s", 8.4)

    # RIGHT PANEL: COLD (15 °C air-conditioned room / winter night)
    f.rect(328, 142, 292, 372, "wash-p", rx=8)
    txt(f, 474, 162, "TOO COLD (Core < 37.0 °C · Cold room 15 °C)", "t b p", 9.8)
    txt(f, 474, 179, "Goal: Conserve core warmth & generate heat", "t m", 8.5)

    # Skin layers inside Right panel
    f.rect(342, 212, 264, 34, "plate", rx=4)
    f.rect(342, 246, 264, 138, "plate", rx=4)
    f.rect(342, 384, 264, 42, "wash-n", rx=4)
    txt(f, 380, 232, "Epidermis", "t b", 8.3)
    txt(f, 376, 266, "Dermis", "t b", 8.3)
    txt(f, 412, 409, "Fatty tissue (insulator)", "t m", 8.3)

    # Upright hair & contracted erector muscle + receptor/sensory neurone (Right)
    f.line(426, 242, 430, 188, "ln")
    f.line(398, 262, 426, 232, "ln p")
    txt(f, 384, 198, "Hair stood up", "t b p", 8)
    txt(f, 392, 282, "Contracted erector", "t p", 8)

    # Receptor & sensory neurone labelled clearly in dermis
    f.circle(476, 264, 6, "pt-p")
    f.line(476, 270, 476, 352, "ln p")
    txt(f, 476, 252, "Skin receptor", "t b", 8)
    txt(f, 476, 368, "Sensory neurone", "t m", 8)

    # Inactive sweat gland
    f.circle(432, 342, 12, "plate")
    f.line(432, 330, 432, 212, "ln r")
    txt(f, 412, 368, "No sweat", "t m", 8)

    # Vasoconstricted arteriole & narrow capillary loop flow (Right)
    f.line(548, 382, 548, 310, "ln p")
    f.path("M 548 310 C 540 256, 574 256, 568 310", "ln r")
    f.line(568, 310, 568, 382, "ln p")
    f.line(548, 336, 568, 336, "ln p")
    txt(f, 554, 236, "Little blood in", "t b p", 8)
    txt(f, 554, 250, "surface capillaries", "t p", 8)
    txt(f, 514, 302, "Narrow arteriole", "t b p", 7.8)
    txt(f, 514, 340, "Shunt open", "t s", 7.5)

    # Right bottom summary bullets
    txt(f, 474, 444, "1. Arteriole VASOCONSTRICTION: smooth muscle contracts;", "t b p", 8.4)
    txt(f, 474, 460, "less blood enters surface capillaries, reducing heat loss.", "t s", 8.4)
    txt(f, 474, 478, "2. SHIVERING in muscles respires glucose to release heat;", "t b p", 8.4)
    txt(f, 474, 494, "sweat stops; upright hairs trap insulating still air.", "t s", 8.4)

    # Bottom wide Examiner Caution banner (0610 14.4.8 trap)
    box(
        f,
        20,
        526,
        600,
        82,
        [
            (20, "Cambridge 0610 Examiner Rule: Arterioles change diameter — capillaries NEVER move", "t b e"),
            (39, "Capillaries stay fixed in place in the dermis and have one-cell-thick walls with no muscle layer.", "t s"),
            (57, "During vasodilation or vasoconstriction, smooth muscle in the ARTERIOLES supplying the skin capillaries", "t b"),
            (74, "relaxes or contracts, changing how much warm blood flows through the fixed surface capillary loops.", "t m"),
        ],
        "plate",
        8.6,
    )

    return f.svg()


@figure
def c10_mumbai_heat_balance() -> str:
    f = Fig(640, 600, "Thermal energy balance in a Mumbai summer: dry heat transfer, evaporative cooling and relative humidity")
    heading(
        f,
        "10.3  Why 38 °C feels survivable in dry inland air yet dangerous in 80% Mumbai humidity",
        "When air is at or above skin temperature (37 °C), evaporation of sweat is the body's only cooling route",
    )

    # Top physics equation bar linking to Book 2 Chapter 8
    box(
        f,
        20,
        56,
        600,
        64,
        [
            (20, "Book 2 (The Moving World, Ch 8) Physics Link: Latent Heat of Vaporisation of Sweat", "t b"),
            (40, "Evaporating 1 g of sweat at 37 °C removes Lᵥ ≈ 2,420 J (2.42 kJ) of thermal energy from the skin.", "t s"),
            (56, "Dripping sweat that falls onto the pavement without evaporating removes 0 J of latent heat.", "t b e"),
        ],
        "wash-n",
        8.8,
    )

    # Three environment columns (Walking at 180 W metabolic heat generation)
    box(
        f,
        20,
        134,
        190,
        290,
        [
            (22, "A. Cool Room (22 °C)", "t b g"),
            (40, "Relative humidity: 50%", "t m"),
            (58, "Wet-bulb floor: 15.4 °C", "t s"),
            (84, "Metabolic heat made:", "t b"),
            (102, "+180 W (walking)", "t s"),
            (128, "Dry transfer (rad/conv):", "t b g"),
            (146, "−145 W lost to cooler air", "t g"),
            (172, "Evaporative cooling:", "t b"),
            (190, "−35 W (gentle evaporation)", "t s"),
            (218, "Net core heat storage:", "t b g"),
            (236, "0 W → Core steady at 37.0 °C", "t g"),
            (262, "Skin stays dry and cool;", "t m"),
            (278, "dry radiation/convection works.", "t m"),
        ],
        "plate",
        8.6,
    )

    box(
        f,
        225,
        134,
        190,
        290,
        [
            (22, "B. Dry Inland (38 °C)", "t b e"),
            (40, "Relative humidity: 20%", "t m"),
            (58, "Wet-bulb floor: 21.0 °C", "t s"),
            (84, "Metabolic heat made:", "t b"),
            (102, "+180 W (walking)", "t s"),
            (128, "Dry transfer (38 °C > skin):", "t b p"),
            (146, "+45 W GAINED from hot air", "t p"),
            (172, "Evaporative cooling:", "t b e"),
            (190, "−225 W (~335 g/h evaporated)", "t e"),
            (218, "Net core heat storage:", "t b g"),
            (236, "0 W → Core held at 37.0 °C", "t g"),
            (262, "Dry air accepts vapour fast;", "t m"),
            (278, "water intake must replace sweat.", "t m"),
        ],
        "wash-e",
        8.6,
    )

    box(
        f,
        430,
        134,
        190,
        290,
        [
            (22, "C. Humid Coast (38 °C)", "t b p"),
            (40, "Relative humidity: 80%", "t m"),
            (58, "Wet-bulb floor: 34.8 °C", "t s"),
            (84, "Metabolic heat made:", "t b"),
            (102, "+180 W (walking)", "t s"),
            (128, "Dry transfer (38 °C > skin):", "t b p"),
            (146, "+45 W GAINED from hot air", "t p"),
            (172, "Max evaporation into damp air:", "t b p"),
            (190, "Only −95 W (rest drips off)", "t p"),
            (218, "Uncompensated heat gain:", "t b p"),
            (236, "+130 W → Core climbs > 38.5 °C", "t p"),
            (262, "High vapour pressure slows escape;", "t m"),
            (278, "shade, fan & water are vital.", "t m"),
        ],
        "wash-p",
        8.6,
    )

    # Bottom enzyme denaturation curve (linking Chapter 4 to Chapter 10)
    f.rect(20, 438, 600, 146, "plate", rx=8)
    txt(f, 320, 458, "Why a 3–5 °C rise in core temperature is a medical emergency (Chapter 4 Enzyme Link)", "t b", 9.8)

    # Left mini-axis for enzyme rate vs temperature
    f.line(68, 474, 68, 554, "ax")
    f.line(68, 554, 330, 554, "ax")
    f.path("M 75 544 C 130 532, 185 504, 232 480 C 254 470, 270 492, 292 552", "ln e")
    f.line(232, 474, 232, 554, "ln r")
    txt(f, 218, 569, "37 °C (Optimum)", "t b g", 8)
    txt(f, 102, 569, "25 °C", "t m", 8)
    txt(f, 306, 569, "43 °C", "t b p", 8)
    txt(f, 135, 514, "Fewer collisions", "t m", 8)
    txt(f, 298, 505, "Denaturation", "t b p", 8)

    # Right explanation inside bottom panel
    txt(f, 472, 484, "Below 37 °C: molecules have lower average", "t s", 8.6)
    txt(f, 472, 501, "kinetic energy, slowing metabolic reactions.", "t s", 8.6)
    txt(f, 472, 524, "Above 40–42 °C: violent thermal vibration", "t b p", 8.6)
    txt(f, 472, 541, "breaks hydrogen & ionic bonds in enzymes,", "t s", 8.6)
    txt(f, 472, 558, "warping active sites so reactions fail.", "t s", 8.6)

    return f.svg()


@figure
def c10_liver_excretion_urea() -> str:
    f = Fig(640, 620, "Assimilation and deamination of amino acids in the liver, and the human excretory organs")
    heading(
        f,
        "10.4  From dal tadka to urea: liver deamination and the human excretory system",
        "The liver assimilates needed amino acids into proteins and deaminates excess amino acids into urea for the kidneys",
    )

    # LEFT HALF: Liver Assimilation & Deamination pathway
    f.rect(20, 56, 295, 398, "wash-e", rx=8)
    txt(f, 167, 78, "A. Inside the Liver: Assimilation vs Deamination", "t b e", 9.8)
    txt(f, 167, 95, "Amino acids arrive from ileum via hepatic portal vein", "t m", 8.3)

    box(
        f,
        42,
        108,
        250,
        48,
        [
            (19, "Absorbed Amino Acids in Hepatic Portal Vein", "t b"),
            (37, "Body cannot store free amino acids in a tank", "t m"),
        ],
        "plate",
        8.6,
    )
    arr(f, 105, 156, 95, 184, "g")
    arr(f, 230, 156, 240, 184, "e")

    # Left branch: Assimilation
    box(
        f,
        32,
        186,
        125,
        118,
        [
            (20, "1. ASSIMILATION", "t b g"),
            (39, "(Needed fraction)", "t m"),
            (60, "Built into new", "t s"),
            (76, "proteins: plasma", "t s"),
            (92, "albumin, fibrinogen", "t b"),
            (108, "& cell enzymes", "t s"),
        ],
        "plate",
        8.3,
    )

    # Right branch: Deamination
    box(
        f,
        168,
        186,
        135,
        118,
        [
            (20, "2. DEAMINATION", "t b e"),
            (39, "(Excess amino acids)", "t m"),
            (60, "Enzymes remove the", "t s"),
            (76, "nitrogen-containing", "t b e"),
            (92, "amino part (−NH₂)", "t b e"),
            (108, "from carbon skeleton", "t s"),
        ],
        "plate",
        8.3,
    )
    arr(f, 200, 304, 155, 334, "g")
    arr(f, 262, 304, 262, 334, "p")

    # Products of deamination
    box(
        f,
        32,
        336,
        142,
        102,
        [
            (20, "Carbohydrate residue", "t b g"),
            (38, "(C, H, O keto-acid)", "t m"),
            (58, "Converted to glycogen", "t s"),
            (74, "or respired to release", "t s"),
            (90, "energy (CO₂ + H₂O)", "t s"),
        ],
        "plate",
        8.1,
    )

    box(
        f,
        182,
        336,
        122,
        102,
        [
            (20, "Toxic ammonia (NH₃)", "t b p"),
            (38, "converted at once to", "t s"),
            (56, "UREA: (NH₂)₂CO", "t b p"),
            (74, "Leaves via hepatic vein", "t s"),
            (90, "in plasma to kidneys", "t m"),
        ],
        "wash-p",
        8.1,
    )

    # RIGHT HALF: Gross Anatomy of the Human Urinary System + Kidney Cortex/Medulla
    f.rect(325, 56, 295, 398, "plate", rx=8)
    txt(f, 472, 78, "B. Human Excretory Organs & Urinary Tract", "t b", 9.8)
    txt(f, 472, 95, "Lungs excrete CO₂; kidneys excrete urea, excess H₂O & ions", "t m", 8.3)

    # Aorta and Vena cava trunks
    f.line(456, 118, 456, 290, "ln e")
    f.line(488, 118, 488, 290, "ln p")
    txt(f, 412, 128, "Aorta", "t b e", 8.3)
    txt(f, 536, 128, "Vena cava", "t b p", 8.3)

    # Renal arteries & veins
    f.line(412, 196, 456, 196, "ln e")
    f.line(488, 196, 532, 196, "ln e")
    f.line(412, 212, 488, 212, "ln p")
    f.line(488, 212, 532, 212, "ln p")

    # Left Kidney (shown in cutaway with Cortex & Medulla) & Right Kidney
    f.rect(352, 162, 62, 82, "wash-e", rx=22)
    f.rect(364, 176, 38, 54, "wash-p", rx=14)
    f.rect(530, 162, 62, 82, "wash-e", rx=22)

    # Clean anatomical labels outside the kidneys
    txt(f, 383, 152, "Kidney (cutaway)", "t b", 8.2)
    txt(f, 561, 152, "Kidney", "t b", 8.2)
    txt(f, 383, 171, "Cortex", "t b e", 7.8)
    txt(f, 383, 206, "Medulla", "t b p", 7.8)
    txt(f, 383, 258, "Renal artery (in)", "t e", 8)
    txt(f, 561, 258, "Renal vein (out)", "t p", 8)

    # Ureters running down from kidneys to urinary bladder
    f.path("M 402 232 C 425 275, 442 310, 454 334", "ln g")
    f.path("M 542 232 C 519 275, 502 310, 490 334", "ln g")
    txt(f, 394, 298, "Ureter", "t b g", 8.3)
    txt(f, 552, 298, "Ureter", "t b g", 8.3)

    # Urinary bladder, sphincter, urethra
    f.rect(432, 332, 80, 52, "wash-g", rx=18)
    txt(f, 472, 355, "Urinary bladder", "t b", 8.3)
    txt(f, 472, 371, "(stores urine)", "t m", 7.8)
    f.rect(460, 384, 24, 14, "plate", rx=3)
    f.line(472, 398, 472, 428, "ln g")
    txt(f, 406, 394, "Sphincter ring", "t s", 8)
    txt(f, 528, 418, "Urethra (exit)", "t b g", 8.3)

    # Bottom comparison ledger: Excretion vs Egestion (0610 classic distinction)
    box(
        f,
        20,
        468,
        600,
        134,
        [
            (22, "Excretion vs Egestion Ledger (Cambridge 0610 Topics 1.1, 7.1 & 13.1)", "t b"),
            (44, "EXCRETION (Made inside cells or absorbed in excess — crossed cell membranes):", "t b g"),
            (62, "• Lungs: excrete carbon dioxide (CO₂) and water vapour made by aerobic respiration.", "t s"),
            (80, "• Kidneys: excrete urea (from liver deamination of excess amino acids), excess water & excess ions in urine.", "t s"),
            (102, "EGESTION (Never entered body cells — stayed inside the gut lumen):", "t b p"),
            (120, "• Alimentary canal (anus): passes out undigested dietary fibre (cellulose) and gut bacteria as faeces.", "t s"),
        ],
        "wash-n",
        8.5,
    )

    return f.svg()


@figure
def c10_kidney_nephron_ledger() -> str:
    f = Fig(640, 630, "Structure and function of a kidney nephron: glomerular filtration and selective reabsorption")
    heading(
        f,
        "10.5  Inside a single nephron: massive filtration followed by selective rescue",
        "Two kidneys filter ~180 L/day in the cortex, then selectively reabsorb 100% of glucose and ~99% of water",
    )

    # Top anatomical schematic of one nephron across Cortex and Medulla
    f.rect(20, 56, 600, 310, "plate", rx=8)
    f.line(32, 232, 608, 232, "ln r")
    txt(f, 78, 76, "KIDNEY CORTEX", "t b e", 8.8)
    txt(f, 82, 250, "KIDNEY MEDULLA", "t b p", 8.8)

    # Step 1 box: Glomerulus & Renal (Bowman's) capsule
    box(
        f,
        36,
        92,
        175,
        122,
        [
            (20, "1. Glomerulus & Capsule", "t b e"),
            (39, "High blood pressure forces", "t s"),
            (55, "water, glucose, urea & ions", "t b"),
            (71, "into the renal capsule.", "t s"),
            (90, "RBCs & plasma proteins", "t b p"),
            (106, "are too large to pass.", "t p"),
        ],
        "wash-e",
        8.4,
    )
    arr(f, 211, 152, 238, 152, "e")

    # Step 2 box: Proximal & Distal Renal Tubule + Peritubular capillaries
    box(
        f,
        240,
        92,
        185,
        122,
        [
            (20, "2. Renal Tubule (Cortex)", "t b g"),
            (39, "Selective reabsorption", "t b"),
            (56, "back into capillary blood:", "t s"),
            (74, "• ALL (100%) of glucose", "t b g"),
            (90, "• MOST water (osmosis)", "t s"),
            (106, "• SOME needed ions", "t s"),
        ],
        "wash-g",
        8.4,
    )
    arr(f, 425, 152, 452, 152, "g")

    # Step 3 box: Collecting duct -> Urine
    box(
        f,
        454,
        92,
        152,
        256,
        [
            (22, "3. Collecting Duct", "t b p"),
            (42, "(Cortex → Medulla)", "t m"),
            (66, "Fine-tunes water", "t s"),
            (82, "reabsorption via", "t s"),
            (98, "aquaporin channels.", "t b"),
            (126, "Final URINE leaves", "t b p"),
            (144, "to ureter & bladder:", "t s"),
            (166, "• Urea (~2.0 g/100 mL)", "t b p"),
            (184, "• Excess water", "t s"),
            (202, "• Excess ions", "t s"),
            (224, "• 0% protein", "t b g"),
            (242, "• 0% glucose", "t b g"),
        ],
        "wash-p",
        8.4,
    )

    # Loop of Henle & Vasa recta dipping into Medulla under Box 2
    box(
        f,
        240,
        244,
        185,
        104,
        [
            (22, "Tubule Loop in Medulla", "t b"),
            (42, "Maintains steep medullary", "t s"),
            (58, "osmotic gradient so water", "t s"),
            (74, "moves out of filtrate into", "t s"),
            (90, "surrounding blood vessels.", "t m"),
        ],
        "plate",
        8.4,
    )
    arr(f, 332, 214, 332, 242, "g")

    # Medulla left note on Wearn & Richards (1924) micropuncture
    box(
        f,
        36,
        262,
        175,
        86,
        [
            (20, "Wearn & Richards (1924)", "t b"),
            (38, "Quartz micropipette proved", "t s"),
            (54, "capsule fluid has glucose", "t s"),
            (70, "and zero protein.", "t m"),
        ],
        "wash-n",
        8.2,
    )

    # Bottom Quantitative Nephron Concentration & Mass-Balance Table
    f.rect(20, 380, 600, 232, "plate", rx=8)
    txt(f, 320, 402, "Quantitative Healthy Nephron Ledger (Concentrations in g / 100 mL & Daily Mass Account)", "t b", 9.6)

    # Table Header
    f.rect(34, 414, 572, 28, "wash-n", rx=4)
    txt(f, 105, 432, "Component", "t b", 8.6)
    txt(f, 225, 432, "Blood Plasma", "t b", 8.6)
    txt(f, 335, 432, "Filtrate (180 L/d)", "t b e", 8.6)
    txt(f, 448, 432, "Reabsorbed", "t b g", 8.6)
    txt(f, 552, 432, "Urine (1.5 L/d)", "t b p", 8.6)

    rows = [
        ("Proteins & RBCs", "8.00 g / 100 mL", "0.00 (unfiltered)", "Not filtered", "0.00 g / 100 mL", "t b"),
        ("Glucose", "0.10 g / 100 mL", "0.10 (180 g/day)", "100% (all 180 g/d)", "0.00 g / 100 mL", "t b g"),
        ("Water (volume)", "Plasma solvent", "180.0 L / day", "~99.2% (178.5 L/d)", "1.5 L / day", "t s"),
        ("Mineral ions (Na⁺, Cl⁻)", "0.72 g / 100 mL", "0.72 (1,296 g/d)", "Some (~98.3%)", "1.50 g / 100 mL", "t s"),
        ("Urea (from liver)", "0.03 g / 100 mL", "0.03 (54 g/day)", "Little (~44%)", "2.00 g / 100 mL (×67)", "t b p"),
    ]
    y = 460
    for comp, pl, fil, reab, ur, ccls in rows:
        f.line(34, y - 14, 606, y - 14, "ln r")
        txt(f, 105, y, comp, "t b", 8.3)
        txt(f, 225, y, pl, "t s", 8.3)
        txt(f, 335, y, fil, "t e", 8.3)
        txt(f, 448, y, reab, "t g", 8.3)
        txt(f, 552, y, ur, ccls, 8.3)
        y += 28

    txt(
        f,
        320,
        598,
        "Why urea is 67× more concentrated in urine: ~99% of filtered water is reabsorbed while most urea stays in the tubule.",
        "t m",
        8.4,
    )

    return f.svg()


@figure
def c10_pathogens_barriers_cholera() -> str:
    f = Fig(640, 630, "Pathogens, transmission routes, mechanical and chemical barriers, and cholera vs oral rehydration")
    heading(
        f,
        "10.6  Pathogens, body barriers and how oral rehydration reverses cholera dehydration",
        "Breaking transmission outside the body, blocking entry at surfaces, and rescuing intestinal water balance",
    )

    # TOP ROW: Direct vs Indirect Transmission + 5 Community Controls (0610 10.1.1-10.1.5)
    box(
        f,
        20,
        56,
        290,
        152,
        [
            (20, "A. Pathogens & Transmission Routes", "t b e"),
            (39, "Pathogen: disease-causing organism (+ viruses).", "t s"),
            (56, "Transmissible disease: passes host to host.", "t s"),
            (76, "1. Direct contact: blood or other body fluids,", "t b"),
            (92, "or direct skin-to-skin contact.", "t s"),
            (112, "2. Indirect transmission: contaminated water,", "t b"),
            (128, "food, surfaces, air droplets, or animal vectors.", "t s"),
        ],
        "wash-e",
        8.4,
    )

    box(
        f,
        330,
        56,
        290,
        152,
        [
            (20, "B. Five Community Hygiene Defences", "t b g"),
            (40, "1. Clean water supply (filtration & chlorination)", "t s"),
            (58, "2. Hygienic food preparation (thorough cooking,", "t s"),
            (74, "chilling, keeping raw & cooked food separate)", "t m"),
            (92, "3. Good personal hygiene (handwashing with soap)", "t s"),
            (110, "4. Safe waste disposal (covered bins, vector control)", "t s"),
            (128, "5. Sewage treatment (stops faecal water contamination)", "t s"),
        ],
        "wash-g",
        8.4,
    )

    # MIDDLE ROW: Mechanical vs Chemical Body Barriers (0610 10.1.4)
    box(
        f,
        20,
        222,
        290,
        122,
        [
            (20, "C. Mechanical Barriers (Physical block)", "t b"),
            (42, "• Skin: tough dead keratinised outer epidermis", "t s"),
            (58, "blocks entry; if cut, platelets trigger fibrin clot.", "t m"),
            (80, "• Hairs in the nose: filter out coarse inhaled", "t s"),
            (96, "dust and pathogen-carrying droplets from air.", "t m"),
        ],
        "plate",
        8.4,
    )

    box(
        f,
        330,
        222,
        290,
        122,
        [
            (20, "D. Chemical Barriers (Trap & destroy)", "t b"),
            (42, "• Mucus: sticky glycoprotein traps pathogens in", "t s"),
            (58, "airways; cilia sweep mucus up to the throat.", "t m"),
            (80, "• Stomach acid (HCl, pH ~1.5–2.0): strong acid", "t s"),
            (96, "denatures bacterial enzymes and kills most microbes.", "t m"),
        ],
        "plate",
        8.4,
    )

    # BOTTOM PANEL: Cholera Toxin Cl- Mechanism vs Oral Rehydration Solution (0610 10.1.16-10.1.17)
    f.rect(20, 358, 600, 254, "plate", rx=8)
    txt(
        f,
        320,
        378,
        "E. Cholera (Vibrio cholerae) Osmotic Crisis vs Oral Rehydration Therapy (De 1959 · Mahalanabis 1971)",
        "t b",
        9.6,
    )

    # Left sub-card: Cholera Toxin mechanism
    box(
        f,
        34,
        392,
        276,
        204,
        [
            (20, "1. Cholera Toxin Mechanism (0610 Supp)", "t b p"),
            (40, "• Vibrio cholerae ingested in contaminated water", "t s"),
            (56, "multiplies in small intestine & secretes TOXIN.", "t s"),
            (76, "• Toxin binds epithelial cells and causes active", "t s"),
            (92, "secretion of CHLORIDE IONS (Cl⁻) into gut lumen.", "t b p"),
            (112, "• Extra Cl⁻ (and Na⁺) lowers the WATER POTENTIAL", "t b"),
            (128, "(Ψ_w) of the small intestine lumen below blood.", "t s"),
            (148, "• Water moves OUT of cells and blood into the gut", "t b p"),
            (164, "by OSMOSIS → profuse watery diarrhoea, severe", "t s"),
            (180, "dehydration and loss of ions from the blood.", "t s"),
        ],
        "wash-p",
        8.2,
    )

    # Right sub-card: Oral Rehydration Solution (ORS) rescue
    box(
        f,
        330,
        392,
        276,
        204,
        [
            (20, "2. Oral Rehydration Solution (ORS Rescue)", "t b g"),
            (40, "• De (1959) showed the intestinal epithelium is", "t s"),
            (56, "not stripped away; its brush border stays intact.", "t s"),
            (76, "• Drinking plain water alone fails, and excess salt", "t s"),
            (92, "alone worsens luminal osmolarity.", "t m"),
            (112, "• ORS supplies clean water + a measured small", "t b g"),
            (128, "amount of SALT (NaCl) and GLUCOSE (~75 mmol/L).", "t b g"),
            (148, "• Intact Na⁺–glucose cotransporters pull Na⁺ and", "t s"),
            (164, "glucose into cells, raising tissue osmolarity so", "t s"),
            (180, "WATER is drawn back into blood by osmosis.", "t b g"),
        ],
        "wash-g",
        8.2,
    )

    return f.svg()


@figure
def c10_immune_response_vaccines() -> str:
    f = Fig(640, 630, "Antigen-antibody specificity, phagocytosis, lymphocytes, memory cells and vaccination")
    heading(
        f,
        "10.7  Specific lock-and-key immunity: lymphocytes, antibodies, memory cells and vaccines",
        "Each pathogen has specific-shaped antigens; complementary antibodies destroy it or mark it for phagocytes",
    )

    # TOP LEFT: Phagocyte vs Lymphocyte & Complementary Antibody Lock-and-Key
    box(
        f,
        20,
        56,
        292,
        236,
        [
            (20, "A. Cellular Division of Labour", "t b"),
            (42, "1. Phagocyte (lobed nucleus):", "t b e"),
            (59, "Non-specific phagocytosis — engulfs", "t s"),
            (75, "pathogens into a vacuole and digests", "t s"),
            (91, "them with hydrolytic enzymes.", "t s"),
            (114, "2. Lymphocyte (large round nucleus):", "t b g"),
            (131, "Recognises pathogen's specific-shaped", "t s"),
            (147, "ANTIGEN, divides into a clone, and", "t s"),
            (163, "secretes protein ANTIBODIES + forms", "t b"),
            (179, "long-lived MEMORY CELLS.", "t b g"),
            (202, "(Recall Ch 8 blood smear nuclei)", "t m"),
        ],
        "plate",
        8.4,
    )

    # TOP RIGHT: Antigen-Antibody Complementary Shape & Two Destruction Routes
    f.rect(328, 56, 292, 236, "wash-e", rx=8)
    txt(f, 474, 76, "B. Complementary Antigen–Antibody Fit", "t b e", 9.6)
    txt(f, 474, 93, "Antibody binding site fits only its matching antigen", "t m", 8.2)

    # Schematic Y-shaped antibody and triangular antigen vs round non-matching antigen
    f.line(372, 165, 392, 165, "ln e")
    f.line(392, 165, 410, 145, "ln e")
    f.line(392, 165, 410, 185, "ln e")
    f.rect(424, 136, 66, 56, "plate", rx=10)
    f.path("M 424 140 L 410 145 L 424 152 Z", "wash-p")
    f.path("M 424 178 L 410 185 L 424 190 Z", "wash-p")
    txt(f, 457, 160, "Pathogen A", "t b", 8)
    txt(f, 457, 176, "(Antigen A)", "t p", 7.8)
    txt(f, 398, 124, "Complementary fit", "t b g", 8)

    # Non-matching pathogen B on right of box B
    f.rect(522, 136, 78, 56, "plate", rx=10)
    f.circle(522, 152, 6, "pt-p")
    f.circle(522, 178, 6, "pt-p")
    txt(f, 561, 160, "Pathogen B", "t b", 8)
    txt(f, 561, 176, "(Wrong shape)", "t m", 7.8)
    txt(f, 558, 124, "No binding (0%)", "t p", 8)

    txt(f, 474, 214, "Once bound, antibodies act in two ways (0610 10.1.8):", "t b", 8.4)
    txt(f, 474, 232, "1. Direct destruction (clumping/neutralising/lysing)", "t s", 8.2)
    txt(f, 474, 250, "2. Marking (opsonising) pathogens so phagocytes", "t s", 8.2)
    txt(f, 474, 268, "engulf and digest them rapidly.", "t s", 8.2)

    # BOTTOM PANEL: Primary vs Secondary (Post-Vaccine) Antibody Curve (Days 0 to 60)
    f.rect(20, 306, 600, 306, "plate", rx=8)
    txt(
        f,
        320,
        328,
        "C. How Vaccination Works: Primary Response vs Memory-Cell Secondary Response",
        "t b",
        9.8,
    )
    txt(
        f,
        320,
        345,
        "1st exposure (vaccine: weakened pathogen or antigen) builds memory cells; 2nd exposure triggers rapid high surge",
        "t m",
        8.4,
    )

    # Graph axes
    f.line(78, 368, 78, 524, "ax")
    f.line(78, 524, 590, 524, "ax")
    txt(f, 48, 380, "High", "t b g", 8)
    txt(f, 48, 438, "Protective", "t e", 8)
    txt(f, 48, 482, "Low", "t m", 8)
    txt(f, 48, 520, "0", "t m", 8)

    # Protective antibody threshold dashed line
    f.line(78, 456, 588, 456, "ln r")
    txt(f, 520, 449, "Protective threshold", "t m", 8)

    # Primary & Secondary response curve (Pathogen A)
    f.path(
        "M 78 524 L 118 524 C 142 524, 165 470, 195 470 C 225 470, 260 508, 310 510 L 340 510 C 352 510, 368 374, 402 374 C 445 374, 510 420, 580 432",
        "ln g",
    )
    # Unrelated Pathogen B primary curve starting at day 30
    f.path("M 332 524 L 365 524 C 390 524, 415 472, 442 472 C 470 472, 510 512, 575 516", "ln p")

    # Labels on graph
    txt(f, 112, 541, "Day 0: Vaccine", "t b e", 8)
    txt(f, 112, 555, "(1st antigen A)", "t m", 7.8)
    txt(f, 195, 461, "Primary response (slow, low)", "t b e", 8)

    txt(f, 335, 541, "Day 28: Live exposure", "t b g", 8)
    txt(f, 335, 555, "(Antigen A + new Antigen B)", "t m", 7.8)
    txt(f, 412, 364, "Secondary response to A (fast, huge: memory cells)", "t b g", 8.2)
    txt(f, 488, 464, "Primary response to new Antigen B", "t p", 8)

    # Bottom 3-step 0610 Vaccination sequence box
    f.rect(36, 566, 568, 36, "wash-n", rx=6)
    txt(
        f,
        320,
        581,
        "0610 Sequence: (1) Weakened pathogens or their antigens introduced → (2) Antigens stimulate lymphocytes",
        "t b",
        8.2,
    )
    txt(
        f,
        320,
        595,
        "to produce complementary antibodies → (3) Memory cells stay in blood/lymph for long-term active immunity.",
        "t s",
        8.2,
    )

    return f.svg()


@figure
def c10_active_vs_passive_immunity() -> str:
    f = Fig(640, 610, "Active immunity versus passive immunity: antibody source, speed of protection, memory cells and duration")
    heading(
        f,
        "10.8  Active immunity vs passive immunity: making your own vs borrowing ready-made antibodies",
        "Active immunity activates lymphocytes and creates memory cells; passive immunity gives immediate short-term cover",
    )

    # LEFT COLUMN: ACTIVE IMMUNITY
    f.rect(20, 56, 292, 342, "wash-g", rx=8)
    txt(f, 166, 78, "ACTIVE IMMUNITY (Self-made)", "t b g", 10.2)
    txt(f, 166, 95, "Defence by antibody production in your own body", "t m", 8.4)

    box(
        f,
        36,
        108,
        260,
        78,
        [
            (20, "1. Natural Active Immunity", "t b g"),
            (39, "Catching a transmissible infection:", "t s"),
            (55, "live pathogen's antigens stimulate", "t s"),
            (71, "lymphocytes during recovery.", "t m"),
        ],
        "plate",
        8.4,
    )

    box(
        f,
        36,
        196,
        260,
        78,
        [
            (20, "2. Artificial Active Immunity (Vaccine)", "t b g"),
            (39, "Vaccination puts weakened/dead pathogen", "t s"),
            (55, "or its antigens into the body without", "t s"),
            (71, "causing the severe disease.", "t m"),
        ],
        "plate",
        8.4,
    )

    box(
        f,
        36,
        284,
        260,
        100,
        [
            (20, "Hallmarks of Active Immunity", "t b"),
            (40, "• Onset: Delayed (4–14 days on 1st contact)", "t s"),
            (58, "• Memory cells: YES — produced & kept", "t b g"),
            (76, "• Duration: LONG-TERM (years / lifetime)", "t b g"),
            (92, "• Subsequent exposure triggers rapid surge", "t m"),
        ],
        "plate",
        8.4,
    )

    # RIGHT COLUMN: PASSIVE IMMUNITY
    f.rect(328, 56, 292, 342, "wash-p", rx=8)
    txt(f, 474, 78, "PASSIVE IMMUNITY (Borrowed)", "t b p", 10.2)
    txt(f, 474, 95, "Short-term defence by antibodies from another individual", "t m", 8.4)

    box(
        f,
        344,
        108,
        260,
        78,
        [
            (20, "3. Natural Passive Immunity (Mother → Baby)", "t b p"),
            (39, "Ready-made maternal antibodies cross the", "t s"),
            (55, "PLACENTA before birth and are fed in", "t b"),
            (71, "BREAST MILK (colostrum) to the infant.", "t b"),
        ],
        "plate",
        8.4,
    )

    box(
        f,
        344,
        196,
        260,
        78,
        [
            (20, "4. Artificial Passive Immunity (Injection)", "t b p"),
            (39, "Pre-formed antibodies purified from donor", "t s"),
            (55, "serum injected for urgent emergencies", "t s"),
            (71, "(rabies immunoglobulin, snake antivenom).", "t m"),
        ],
        "plate",
        8.4,
    )

    box(
        f,
        344,
        284,
        260,
        100,
        [
            (20, "Hallmarks of Passive Immunity", "t b"),
            (40, "• Onset: IMMEDIATE protection from hour 0", "t b e"),
            (58, "• Memory cells: NO — lymphocytes not stimulated", "t b p"),
            (76, "• Duration: SHORT-TERM (weeks to a few months)", "t b p"),
            (92, "• Borrowed antibodies are slowly broken down", "t m"),
        ],
        "plate",
        8.4,
    )

    # BOTTOM PANEL: Time-course comparison of Plasma Antibody Concentration (Active vs Passive)
    f.rect(20, 412, 600, 184, "plate", rx=8)
    txt(f, 320, 432, "Antibody Persistence Over Time: Passive Decay (t₁/₂ ≈ 21 days) vs Active Memory Persistence", "t b", 9.6)

    f.line(78, 450, 78, 556, "ax")
    f.line(78, 556, 588, 556, "ax")
    txt(f, 48, 462, "100%", "t m", 8)
    txt(f, 48, 508, "50%", "t m", 8)
    txt(f, 48, 552, "0%", "t m", 8)

    # Passive curve: starts at 100% on Day 0 and decays exponentially toward 0%
    f.path("M 78 458 C 145 504, 240 538, 420 552 L 580 554", "ln p")
    txt(f, 205, 456, "Passive: immediate peak at Day 0,", "t b p", 8.0)
    txt(f, 205, 470, "decays as protein breaks down (0 memory)", "t p", 8.0)

    # Active curve: rises after lag, stays sustained and boosts on re-exposure
    f.path("M 78 556 L 125 556 C 165 556, 200 492, 245 492 C 300 492, 340 512, 390 512 C 415 512, 435 456, 475 456 L 580 468", "ln g")
    txt(f, 475, 446, "Active: memory cells sustain & boost defence", "t b g", 8.1)

    txt(f, 85, 572, "Week 0", "t m", 8)
    txt(f, 210, 572, "Week 3", "t m", 8)
    txt(f, 335, 572, "Week 6", "t m", 8)
    txt(f, 460, 572, "Week 12 (Booster)", "t m", 8)
    txt(f, 565, 572, "Month 6+", "t m", 8)

    return f.svg()


@figure
def c10_diabetes_renal_case() -> str:
    f = Fig(640, 610, "Chapter 10 diagnostic case: why untreated Type 1 diabetes causes sweet urine while the glomerulus stays intact")
    heading(
        f,
        "10.9  Case Synthesis: The Sweet Urine and the Innocent Glomerular Filter",
        "Untreated Type 1 diabetes (16.0 mmol/L plasma glucose) saturates proximal tubule carriers above T_m (~10.5 mmol/L)",
    )

    # LEFT PANEL: Healthy Nephron (5.0 mmol/L plasma glucose)
    f.rect(20, 56, 292, 348, "wash-g", rx=8)
    txt(f, 166, 78, "A. Healthy Control (Insulin Present)", "t b g", 9.8)
    txt(f, 166, 95, "Plasma glucose held at set point: 5.0 mmol/L", "t m", 8.4)

    box(
        f,
        36,
        110,
        260,
        72,
        [
            (20, "1. Glomerulus & Renal Capsule", "t b"),
            (39, "• Plasma protein (8.0 g/100 mL) → 0.0 in filtrate", "t s"),
            (57, "• Glucose (5.0 mmol/L) filters freely into capsule", "t g"),
        ],
        "plate",
        8.3,
    )
    arr(f, 166, 182, 166, 202, "g")

    box(
        f,
        36,
        204,
        260,
        82,
        [
            (20, "2. Proximal Renal Tubule Carriers", "t b g"),
            (39, "• Filtered load (5.0 mmol/L) is well below carrier", "t s"),
            (55, "capacity (T_m ≈ 10.5 mmol/L).", "t s"),
            (72, "• 100% of glucose is actively reabsorbed into blood.", "t b g"),
        ],
        "plate",
        8.3,
    )
    arr(f, 166, 286, 166, 306, "g")

    box(
        f,
        36,
        308,
        260,
        82,
        [
            (20, "3. Collecting Duct & Final Urine", "t b"),
            (39, "• Normal osmotic water reabsorption (~99.2%).", "t s"),
            (56, "• Urine volume: 1.5 L/day · Urine protein: 0.0", "t s"),
            (73, "• Urine glucose: 0.0 mmol/L (zero glycosuria).", "t b g"),
        ],
        "plate",
        8.3,
    )

    # RIGHT PANEL: Untreated Type 1 Diabetes Nephron (16.0 mmol/L plasma glucose)
    f.rect(328, 56, 292, 348, "wash-p", rx=8)
    txt(f, 474, 78, "B. Untreated Type 1 Diabetes (No Insulin)", "t b p", 9.8)
    txt(f, 474, 95, "Fasting plasma glucose elevated: 16.0 mmol/L", "t m", 8.4)

    box(
        f,
        344,
        110,
        260,
        72,
        [
            (20, "1. Glomerulus & Capsule (INTACT)", "t b"),
            (39, "• Plasma protein (8.0 g/100 mL) → 0.0 in filtrate", "t b g"),
            (57, "• Glucose (16.0 mmol/L) filters freely into capsule", "t p"),
        ],
        "plate",
        8.3,
    )
    arr(f, 474, 182, 474, 202, "p")

    box(
        f,
        344,
        204,
        260,
        82,
        [
            (20, "2. Proximal Tubule Carrier Saturation", "t b e"),
            (39, "• Healthy carriers pump at 100% maximum speed,", "t s"),
            (55, "reabsorbing ~10.5 mmol/L back into blood.", "t s"),
            (72, "• Excess ~5.5 mmol/L cannot fit saturated carriers.", "t b p"),
        ],
        "plate",
        8.3,
    )
    arr(f, 474, 286, 474, 306, "p")

    box(
        f,
        344,
        308,
        260,
        82,
        [
            (20, "3. Osmotic Diuresis in Collecting Duct", "t b p"),
            (39, "• Unreabsorbed glucose lowers tubular Ψ_w,", "t s"),
            (55, "holding water in the lumen by osmosis.", "t s"),
            (72, "• Urine: 3.8 L/day · High glucose · 0.0 protein.", "t b p"),
        ],
        "plate",
        8.3,
    )

    # BOTTOM PANEL: Evaluating the Three Student Hypotheses
    box(
        f,
        20,
        418,
        600,
        176,
        [
            (22, "Evaluating Three Claims Against the Clinical Data", "t b"),
            (46, "Claim 1: 'High blood pressure tore holes in the glomerulus filter.' → FALSIFIED", "t b p"),
            (64, "Small glucose molecules always pass freely into the capsule; zero protein in urine proves the size barrier is intact.", "t s"),
            (92, "Claim 2: 'The kidney's proximal tubule glucose carriers are broken.' → FALSIFIED", "t b e"),
            (110, "The carriers are working at full capacity (~10.5 mmol/L), but pancreas beta-cell failure flooded them with 16.0 mmol/L.", "t s"),
            (138, "Claim 3: 'Unreabsorbed glucose in the tubule pulls extra water into urine by osmosis.' → CONFIRMED", "t b g"),
            (156, "Dissolved glucose lowers lumen water potential, opposing water reabsorption → polyuria (3.8 L/d) & intense thirst.", "t s"),
        ],
        "wash-n",
        8.4,
    )

    return f.svg()
