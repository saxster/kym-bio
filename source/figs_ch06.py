"""Chapter 6: original schematic plates, grounded in grounding/ch06.md.
No copied artwork, molecular coordinates, rate or fixed ATP-yield claims.
"""
from figs_core import Fig, figure


def head(f, title, subtitle):
    f.text(320, 28, title, 't s', 'middle', 21)
    f.text(320, 53, subtitle, 't m', 'middle', 13)


def proton(f, x, y):
    f.circle(x, y, 12, 'plate')
    f.text(x, y+5, 'H⁺', 't p b', 'middle', 13)


@figure
def c6_routes():
    f = Fig(640, 470, 'Three distinct processes. Ventilation moves air in and out of lungs; gas exchange transfers oxygen and carbon dioxide across wet surfaces; cellular reactions transfer chemical energy to ATP and heat. Blood transports gases between lungs and tissues. Roots and microbes can have cellular metabolism without lungs. Enlarged schematic, not to scale.')
    head(f, 'Moving air is only one part of the story', 'Human route shown · roots and microbes run cell chemistry without lungs')
    # Air sac attached to a branched airway: the arrows indicate air movement.
    f.path('M101,79 L101,111 M101,99 L70,123 M101,99 L132,123', 'ln')
    for x in [70,132]:
        f.path(f'M{x},123 C{x-35},123 {x-34},180 {x},182 C{x+34},180 {x+35},123 {x},123', 'glass')
    f.arrow(92,82,92,115,'electron'); f.arrow(111,115,111,82,'muted')
    f.text(27,202,'Air moves in and out','t m',size=14)
    f.text(244,98,'1 · Ventilation','t b',size=18)
    f.lines(244,128,['Muscles change chest volume.','Air flows through the airways.'],size=16,lh=1.6)
    f.line(25,219,615,219,'ln r')
    # Two neighbouring spaces, with gas crossing a surface, not bulk air crossing it.
    f.rect(32,242,74,72,'wash-e',15); f.rect(132,242,74,72,'wash-p',15)
    f.text(69,269,'Air','t','middle',15); f.text(169,269,'Blood','t','middle',14)
    f.line(118,238,118,319,'ln')
    f.arrow(79,285,161,285,'electron'); f.text(119,279,'O₂','t e','middle',13)
    f.arrow(161,305,79,305,'proton'); f.text(119,338,'CO₂','t p','middle',13)
    f.text(244,247,'2 · Gas exchange + transport','t b',size=17)
    f.lines(244,277,['Gases diffuse across thin surfaces.','Blood carries them to and from tissues.'],size=15,lh=1.6)
    f.line(25,352,615,352,'ln r')
    # Cell and a folded internal membrane; no implication that all cells have one.
    f.rect(31,372,177,67,'wash-g',30)
    f.path('M65,390 C42,410 83,432 151,420 C187,405 161,377 111,386 C89,389 79,385 65,390 Z','glass')
    f.path('M72,396 L88,410 L101,394 L118,411 L133,393 L149,408','ln m')
    f.text(244,382,'3 · Cellular reactions','t b',size=18)
    f.lines(244,411,['Fuel reactions support ATP recycling','and cell work; energy also leaves as heat.'],size=15,lh=1.6)
    f.text(320,462,'Plants respire in light and darkness. Aerobic routes use molecular oxygen, O₂.','t m','middle',13)
    return f.svg()


@figure
def c6_respiration():
    f = Fig(640, 500, 'Separate schematic routes for carbon and electrons in aerobic glucose oxidation. Cytoplasmic glycolysis converts one six-carbon glucose into two three-carbon pyruvates and collects electrons. Further carbon reactions in the mitochondrial matrix release six carbon dioxide molecules in total. Electron carriers supply a membrane chain that passes electrons to oxygen, forming water; electron transfer supports proton pumping and ATP synthesis. The net equation is a material summary, not one molecular collision.')
    head(f, 'Follow carbon. Then follow electrons.', 'Aerobic glucose model · pathway map, not a single reaction or atom-origin tracing')
    f.rect(20,83,194,177,'wash-e',10); f.rect(238,83,382,177,'wash-g',10)
    f.text(117,106,'CYTOPLASM','t b','middle',14)
    f.text(429,106,'MITOCHONDRIAL MATRIX','t b','middle',14)
    f.text(47,136,'Glucose: 6 C','t',size=16)
    for x in range(59,180,24):
        f.circle(x,156,8,'plate'); f.text(x,160,'C','t b','middle',11+1)
    f.arrow(117,170,117,191,'ink')
    f.text(117,216,'2 pyruvates × 3 C','t','middle',15)
    f.arrow(216,211,267,211,'green')
    f.text(288,146,'Further carbon reactions','t b',size=16)
    f.text(288,173,'Release CO₂ in several steps.','t',size=15)
    f.text(288,211,'6 CO₂ in total per glucose','t g',size=17)
    f.rect(30,309,166,69,'plate',9); f.text(113,335,'Carriers collect','t','middle',15)
    f.text(113,359,'electrons from fuel','t','middle',14)
    f.arrow(117,241,117,305,'electron')
    f.path('M431,240 L431,280 L145,280 L145,305', 'ar ar-electron', extra='marker-end="url(#ah-electron)"')
    f.arrow(197,344,264,344,'electron'); f.text(232,331,'e⁻','t e','middle',14)
    f.rect(271,309,163,69,'wash-e',9)
    f.lines(352,337,['Membrane','electron chain'],'t b','middle',16,1.35)
    f.arrow(438,344,485,344,'electron')
    f.text(554,329,'O₂ + e⁻ + H⁺','t e','middle',15)
    f.text(554,362,'→ water','t','middle',16)
    f.text(320,407,'Electron transfer → H⁺ gradient → much of the ATP','t b','middle',17)
    f.text(320,443,'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O','t s','middle',22)
    f.text(320,477,'Net material account: it omits enzyme steps, carriers and ATP/ADP cycling.','t m','middle',13)
    return f.svg()


@figure
def c6_membrane():
    f = Fig(640, 540, 'Enlarged inner mitochondrial membrane cutaway. Intermembrane space is above and matrix below. Electron transfer drives pumping of protons upwards from matrix into intermembrane space. Protons return down through ATP synthase, driving rotation of its membrane rotor and shaft. The ATP-forming head on the matrix side and its support stay stationary while changing shape to form ATP from ADP and phosphate. Proton numbers and protein shapes are schematic, not stoichiometric or to scale.')
    head(f, 'A membrane separates pumping from return', 'Enlarged cutaway · protein shapes and H⁺ tokens are schematic, not to scale')
    f.rect(20,79,600,147,'wash-p',8)
    f.text(34,102,'INTERMEMBRANE SPACE','t b',size=15)
    f.text(34,127,'More H⁺; more positive than the matrix','t p',size=14)
    for x,y in [(75,165),(246,161),(306,184),(370,161),(538,164),(585,145)]:proton(f,x,y)
    # Bilayer is a barrier, with separate embedded pump and return machine.
    f.rect(20,224,600,40,'plate',0)
    for x in range(31,617,22):
        f.circle(x,229,4,'wash-g'); f.circle(x,259,4,'wash-g')
        f.line(x,234,x+4,243,'ln m'); f.line(x,254,x+4,245,'ln m')
    f.rect(143,211,60,66,'wash-e',14)
    f.arrow(173,298,173,151,'proton',width=3)
    f.text(52,305,'PUMP H⁺ UP','t p b',size=14)
    f.text(25,330,'Electron transfer drives pumping.','t',size=13)
    f.arrow(44,364,198,364,'electron',width=3)
    f.text(117,387,'Electron path → O₂ → water','t e','middle',13)
    # F0 rotor, rotating shaft, fixed F1 head and external stationary support.
    f.rect(434,214,58,60,'wash-g',20)
    f.arrow(463,150,463,275,'proton',width=3)
    f.text(490,201,'RETURN H⁺ DOWN','t p b',size=13)
    f.line(463,274,463,346,'ln g',extra='stroke-width="8"')
    f.path('M482,288 Q502,310 478,326','ar ar-green',extra='marker-end="url(#ah-green)"')
    f.line(516,244,516,384,'ln'); f.line(495,383,516,383,'ln')
    for x,y in [(442,358),(483,358),(463,389)]:f.circle(x,y,26,'plate')
    f.text(463,365,'ATP','t b','middle',14)
    f.text(463,387,'head','t','middle',13)
    f.line(389,301,449,301,'ln m'); f.text(379,306,'Shaft rotates','t g','end',14)
    f.line(530,358,568,358,'ln m'); f.text(582,350,'Fixed','t','middle',14); f.text(582,370,'support','t','middle',14)
    f.text(36,430,'MATRIX','t b',size=16)
    f.text(36,453,'Fewer H⁺; ATP-forming head faces this side.','t',size=14)
    f.text(332,425,'ADP + Pᵢ','t','middle',17)
    f.arrow(389,420,426,420,'green'); f.text(482,426,'ATP','t g b','middle',18)
    f.text(320,489,'The head stays still; rotation changes the shapes of its catalytic parts.','t','middle',14)
    f.text(320,518,'Stored concentration AND charge differences supply the return-flow energy.','t m','middle',13)
    return f.svg()


@figure
def c6_mass():
    f = Fig(640, 550, 'Two different mass accounts for complete oxidation of a representative triglyceride C55H104O6. Using chosen nominal atomic masses C12 H1 O16, one kilogram of fuel combines with 2.9023 kilograms oxygen and produces 2.8140 kilograms carbon dioxide plus 1.0884 kilograms water. Total input and output are both about 3.9023 kilograms. Separately, the paper\'s approximate original-fat allocation assigns about 842 grams of the original kilogram to carbon dioxide and 158 grams to water. That allocation depends on an oxygen exchange convention and is not derived uniquely from the net equation.')
    head(f, 'One kilogram in the fuel is not the whole input', 'Representative complete-oxidation model · chosen nominal masses C12, H1, O16')
    f.text(320,93,'C₅₅H₁₀₄O₆ + 78O₂ → 55CO₂ + 52H₂O','t s','middle',22)
    f.text(320,126,'FULL MASS LEDGER · kg per 1 kg of representative fat','t b','middle',15)
    f.line(320,149,320,341,'ln r')
    f.text(161,166,'INPUTS','t b','middle',15); f.text(477,166,'OUTPUTS','t b','middle',15)
    f.rect(35,184,252,54,'wash-g',5);f.rect(352,184,252,54,'wash-p',5)
    f.text(50,207,'Fat','t',size=16); f.text(272,219,'1.0000 kg','t b','end',19)
    f.text(367,207,'Carbon dioxide','t',size=16); f.text(589,219,'2.8140 kg','t b','end',19)
    f.rect(35,249,252,54,'wash-e',5);f.rect(352,249,252,54,'wash-e',5)
    f.text(50,272,'Incoming O₂','t',size=16); f.text(272,284,'2.9023 kg','t b','end',19)
    f.text(367,272,'Water','t',size=16); f.text(589,284,'1.0884 kg','t b','end',19)
    f.text(320,332,'Both sides ≈ 3.9023 kg · round only after adding','t g b','middle',16)
    f.line(28,352,612,352,'ln')
    f.text(320,381,'A DIFFERENT QUESTION: where is the ORIGINAL kilogram assigned?','t b','middle',14)
    # A true 84.186% / 15.814% allocation bar, not a product-ratio bar.
    f.rect(35,401,480*.841860465,31,'wash-p',0)
    f.rect(35+480*.841860465,401,480*.158139535,31,'wash-e',0)
    f.rect(35,401,480,31,'ln',0)
    f.text(228,422,'≈ 842 g assigned to CO₂','t b','middle',15)
    f.text(553,422,'≈ 158 g','t b','middle',14)
    f.line(515,416,523,416,'ln m')
    f.text(553,443,'to water','t','middle',13)
    f.text(320,473,'Usually rounded to 840 g / 160 g: an approximate original-fat allocation.','t','middle',14)
    f.text(320,502,'Oxygen exchange with body water prevents a unique tagged-atom route.','t m','middle',14)
    f.text(320,530,'All fuel carbon reaches CO₂ here. Water joins body water before leaving.','t m','middle',13)
    return f.svg()


@figure
def c6_fermentation():
    f = Fig(640, 555, 'Carrier-recycling schematic. Glycolysis transfers electrons to NAD+, making NADH, and converts one glucose to two pyruvates. Four ATP formed minus two invested gives two net ATP. Fermentation transfers the electrons from NADH to organic products and regenerates NAD+; the recycling step adds no extra ATP. Separate yeast and lactate routes show two ethanol plus two carbon dioxide, or two lactate with no carbon dioxide. These routes are not a unique description of mixed-community idli fermentation.')
    head(f, 'Keep the electron carrier available', 'Fermentation supports continued glycolysis by returning NAD⁺ · schematic cycle')
    f.rect(188,89,262,84,'wash-g',8)
    f.text(319,117,'GLYCOLYSIS','t b','middle',17)
    f.text(319,148,'Glucose → 2 pyruvates','t','middle',18)
    f.text(68,116,'NAD⁺','t e b','middle',18)
    f.arrow(112,123,181,123,'electron')
    f.arrow(457,123,521,123,'electron')
    f.text(566,116,'NADH','t e b','middle',18)
    f.text(319,200,'4 ATP formed − 2 invested = 2 net ATP','t g b','middle',18)
    f.text(319,225,'Electrons leave the fuel on NADH.','t e','middle',15)
    # Return circuit outside the text area, with its own recipient reaction.
    f.path('M566,137 L566,277 L447,277','ar ar-electron',extra='marker-end="url(#ah-electron)"')
    f.rect(188,247,262,68,'wash-e',8)
    f.text(319,273,'FERMENTATION','t b','middle',16)
    f.text(319,300,'Electrons pass to organic products.','t','middle',14)
    f.path('M188,277 L68,277 L68,137','ar ar-electron',extra='marker-end="url(#ah-electron)"')
    f.text(105,305,'NAD⁺ restored','t e','middle',13)
    f.text(319,342,'Recycling adds no extra ATP.','t b','middle',17)
    f.line(28,362,612,362,'ln')
    for x,title in [(177,'YEAST ROUTE'),(477,'LACTATE ROUTE')]:f.text(x,393,title,'t b','middle',15)
    f.line(320,376,320,478,'ln r')
    f.text(177,423,'2 pyruvates → 2 ethanol','t','middle',16)
    f.text(177,453,'+ 2 CO₂ (gas)','t p b','middle',17)
    f.text(477,423,'2 pyruvates → 2 lactate','t','middle',16)
    f.text(477,453,'No CO₂ in this route','t b','middle',16)
    f.text(320,499,'Lactate can form when oxygen is present and can be reused as fuel.','t m','middle',14)
    f.text(320,530,'Idli contains mixed microbial communities; its rise does not identify one route.','t m','middle',13)
    return f.svg()


@figure
def c6_roots():
    f = Fig(640, 480, 'Drained and waterlogged root-zone cross-sections. Air-filled pores provide an oxygen supply to roots in drained soil. Waterlogging replaces connected air spaces with water, limiting oxygen supply even though H2O contains chemically bound oxygen atoms. Dissolved O2 is distinct from those atoms. Root respiration supports ATP-dependent transport; flood-tolerant plants such as rice can conduct oxygen through internal air spaces. Qualitative schematic, not diffusion rates or survival times.')
    head(f, 'Roots need molecular oxygen, not just water', 'Qualitative soil cutaways · pores, roots and adaptations enlarged; not to scale')
    for x,title,wet in [(24,'DRAINED',False),(337,'WATERLOGGED',True)]:
        f.text(x+137,91,title,'t b','middle',16)
        f.rect(x,110,277,204,'water' if wet else 'plate',8)
        for dx,dy,r in [(29,38,21),(91,38,24),(215,38,25),(41,99,27),(112,99,22),(228,110,30),(33,174,22),(109,175,25),(214,175,25)]:
            f.circle(x+dx,110+dy,r,'wash-n');f.circle(x+dx,110+dy,r,'ln m')
        f.path(f'M{x+151},117 L{x+151},293 M{x+151},197 L{x+128},216 M{x+151},250 L{x+176},271','ln g',extra='stroke-width="8"')
        if not wet:
            f.arrow(x+161,111,x+183,197,'electron')
            f.text(x+185,188,'O₂','t e b',size=17)
            f.text(x+137,341,'Connected air-filled pores','t','middle',15)
        else:
            f.text(x+185,188,'H₂O','t e b',size=19)
            f.text(x+137,341,'Water fills the air spaces','t','middle',15)
    f.text(320,375,'Dissolved O₂ can be used; the oxygen bound inside H₂O is different.','t b','middle',14)
    f.text(320,405,'Less O₂ supply → less aerobic ATP → transport and growth can suffer.','t','middle',14)
    f.text(320,438,'Adaptation: rice can conduct O₂ through internal gas spaces to roots.','t g','middle',14)
    f.text(320,466,'Tolerance varies. Flooding does not make every root die immediately.','t m','middle',13)
    return f.svg()
