"""Chapter 5: original schematic plates. No source artwork or external coordinates."""
from figs_core import Fig, figure


def head(f,title,sub):
    f.text(320,28,title,'t s','middle',21)
    f.text(320,53,sub,'t m','middle',13)


@figure
def c5_ledger():
    f=Fig(640,370,'Van Helmont reported a willow increasing from 5 pounds to 169 pounds and about 3 ounces over five years, while 200 pounds of dried soil lost about 2 ounces. Tree drying, water and air inputs and fallen leaves were not fully accounted for. Historical units retained; this is not a dry biomass balance.')
    head(f,'A balance can weigh only what you include','Reported quantities · original historical units, not exact modern conversions')
    for x,label in [(24,'BEFORE'),(339,'AFTER FIVE YEARS')]:
        f.rect(x,73,277,138,'plate');f.text(x+15,101,label,'t b',size=15)
    f.lines(39,133,['Tree: 5 pounds','Dried soil: 200 pounds'],size=17,lh=1.8)
    f.lines(354,133,['Tree: 169 pounds, about 3 oz','Dried soil: about 2 oz less'],size=15,lh=2)
    f.arrow(305,148,334,148,'green')
    f.text(30,243,'RECORDED: large tree gain; small measured soil loss.','t b',size=16)
    f.text(30,273,'MISSING: air exchange, total water, fallen-leaf masses.','t',size=15)
    f.text(30,303,'The tree was not established to be dry at either weighing.','t',size=15)
    f.text(30,339,'Water alone was his conclusion; it was not a complete carbon account.','t m',size=14)
    return f.svg()


@figure
def c5_gas_evidence():
    f=Fig(640,400,'Three historical lines of evidence, not one combined apparatus. Priestley compared altered air kept with and without mint; Ingenhousz investigated light and green tissues using gas collected over water; de Saussure combined gas measurements with plant material accounting. None by itself traced oxygen atoms.')
    head(f,'Three different questions for a leaf','Comparison map · apparatus symbols are schematic, not reenactment instructions')
    rows=[('1771 · Priestley','Altered air + mint / no plant','Later candle test differed.','Air changed; the mechanism was open.'),('1779 · Ingenhousz','Green tissues: light / shade','Gas collected over water differed.','Light and tissue type mattered.'),('1804 · de Saussure','Gas changes + plant material','Compare dry material and gas accounts.','CO₂ and water both contribute.')]
    for i,(who,compare,obs,limit) in enumerate(rows):
        y=77+i*99
        f.rect(20,y,600,89,'plate');f.text(35,y+25,who,'t b',size=16)
        f.text(231,y+25,compare,'t',size=14)
        f.text(231,y+51,obs,'t',size=14)
        f.text(35,y+76,limit,'t m',size=14)
    f.text(320,389,'Observations first; the molecular explanation came later.','t m','middle',14)
    return f.svg()


@figure
def c5_chloroplast():
    f=Fig(640,460,'An enlarged schematic chloroplast: light transfers energy at thylakoid membranes; water supplies electrons and released oxygen. ATP and an electron carrier link light reactions to carbon fixation in the stroma. Carbon dioxide supplies carbohydrate carbon. A fuller balanced summary retains water on both sides; it is not an atom-by-atom pathway.')
    head(f,'Energy has a route. Carbon has a source.','Enlarged chloroplast schematic · arrows are labelled transfers, not molecular tracks')
    f.rect(20,95,600,237,'wash-g',30)
    f.rect(38,114,257,193,'plate',18);f.rect(348,114,253,193,'plate',18)
    f.text(166,144,'Thylakoid membranes','t b','middle',17)
    for y in [166,180,194]:f.rect(80,y,172,9,'wash-g',4)
    f.text(167,229,'H₂O → released O₂','t','middle',17)
    f.text(167,255,'Water supplies electrons.','t','middle',14)
    f.text(167,281,'Chlorophyll absorbs light.','t','middle',14)
    f.text(475,144,'Stroma: carbon fixation','t b','middle',16)
    f.text(475,179,'CO₂ supplies carbon.','t','middle',16)
    f.text(475,217,'Small 3-carbon products','t','middle',15)
    f.arrow(475,231,475,252,'green')
    f.text(475,281,'Sugars, stores, cell walls','t','middle',15)
    f.arrow(295,183,342,183,'electron');f.text(320,168,'ATP','t e','middle',12)
    f.arrow(295,240,342,240,'electron');f.text(320,214,'electron','t e','middle',12);f.text(320,233,'carrier','t e','middle',12)
    f.arrow(166,67,166,110,'neutron');f.text(210,87,'Light energy','t nn',size=14)
    f.text(320,365,'Fuller summary (light energy transferred; chlorophyll present)','t b','middle',14)
    f.text(320,397,'6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O','t s','middle',21)
    f.text(320,426,'Water occurs on both sides. Cancelling 6H₂O gives the school net equation.','t m','middle',13)
    f.text(320,450,'Isotope evidence identifies water as the source of the released O₂.','t m','middle',14)
    return f.svg()


@figure
def c5_limits():
    f=Fig(640,355,'Schematic limiting-factor graph, not measured plant data. Gross photosynthesis increases with a chosen light capacity until a lower carbon dioxide capacity caps it. Raising the carbon dioxide cap allows a higher plateau only if temperature and other conditions permit. Net oxygen release subtracts oxygen consumption.')
    head(f,'More light helps only while light is limiting','Invented bottleneck diagram · relative capacities, not measured rates or irradiance')
    f.line(70,258,595,258,'ln');f.line(70,258,70,79,'ln')
    f.text(29,87,'100','t m',size=13);f.text(46,262,'0','t m',size=13)
    f.text(77,78,'Gross model rate (relative units)','t m',size=14)
    f.path('M70,258 L278,186 L590,186','ln g',extra='stroke-width="3"')
    f.path('M70,258 L486,114 L590,114','ln e dash',extra='stroke-width="3"')
    f.text(325,210,'Solid: CO₂ capacity 40','t g',size=15)
    f.text(325,99,'Dashed: CO₂ capacity 80','t e',size=15)
    f.text(320,285,'Light capacity (chosen units, 0–100)','t m','middle',14)
    f.text(320,317,'Temperature can impose a third, lower cap.','t','middle',16)
    f.text(320,343,'Net oxygen = gross production − oxygen consumption; bubbles are not a calibration.','t m','middle',12)
    return f.svg()


@figure
def c5_leaf():
    f=Fig(640,515,'Representative dicot leaf cross-section, not universal or to scale. A cuticle covers epidermis; palisade and spongy mesophyll contain chloroplasts. Air spaces connect to a lower stoma. A vein contains xylem and phloem. A separate enlarged surface view shows paired guard cells bordering a pore; water relations and wall mechanics alter its aperture.')
    head(f,'A thin leaf connects air, light and liquid water','Representative dicot · cross-section above; enlarged surface view below · not to scale')
    # Geometry occupies the left half; keyed leaders terminate before right-side words.
    f.rect(25,88,330,10,'wash-n',1)
    f.rect(25,98,330,31,'plate',1)
    for x in range(25,355,55):f.line(x,98,x,129,'ln m')
    for x in range(31,345,40):
        f.rect(x,134,30,81,'wash-g',8)
        for y in [152,178,202]:f.circle(x+8,y,3,'fill-ink')
    for x,y in [(48,244),(132,235),(290,244),(80,292),(180,286),(307,297)]:
        f.rect(x-18,y-12,40,27,'wash-g',12);f.circle(x-3,y,3,'fill-ink')
    f.rect(205,241,48,58,'plate',15);f.text(229,263,'X','t e b','middle',14);f.text(229,287,'P','t p b','middle',14)
    f.rect(25,324,123,25,'plate',1);f.rect(186,324,169,25,'plate',1)
    f.rect(147,324,12,25,'wash-g',5);f.rect(175,324,12,25,'wash-g',5)
    for y,txt,start in [(92,'Cuticle: slows water loss',355),(113,'Upper epidermis: light passes',355),(170,'Palisade: many chloroplasts',355),(237,'Spongy mesophyll',337),(275,'Air spaces: gas diffusion',355),(307,'Vein: X xylem; P phloem',253),(339,'Lower epidermis + stoma',355)]:
        f.line(start,y,373,y,'ln m');f.text(384,y+5,txt,'t',size=13)
    f.arrow(166,305,166,354,'electron')
    f.text(30,379,'Gas route: pore ↔ air spaces ↔ moist cell surfaces','t',size=15)
    f.path('M72,420 C28,398 28,477 72,462 Q50,441 72,420','wash-g')
    f.path('M93,420 C137,398 137,477 93,462 Q115,441 93,420','wash-g')
    f.text(82,495,'Surface view','t m','middle',13)
    f.text(165,425,'Guard cells gain/lose water; turgor and wall','t',size=15)
    f.text(165,453,'structure change their shape and the pore.','t',size=15)
    f.text(165,483,'Not every leaf has stomata only underneath.','t m',size=14)
    return f.svg()


@figure
def c5_xylem():
    f=Fig(640,420,'Cohesion–tension causal chain: evaporation from moist mesophyll walls and vapour loss lower leaf water potential; curved water surfaces create tension transmitted through cohesive liquid in lignified xylem. Water replaces losses from roots. Numbered stages show causes, not measured heights or velocities.')
    head(f,'The pull begins at wet leaf surfaces','Xylem: water + mineral ions · conceptual route, not an open drinking straw')
    f.rect(70,119,54,212,'water',6)
    f.line(70,119,70,331,'ln b');f.line(124,119,124,331,'ln b')
    for y in [153,203,253,303]:
        f.arrow(97,y+15,97,y-17,'electron')
    f.path('M70,120 Q97,141 124,120','ln e')
    f.arrow(112,103,170,81,'electron')
    f.text(28,354,'Root supply','t e',size=15)
    f.text(28,379,'Liquid column','t m',size=14)
    rows=[('1 · Evaporation','Water leaves moist cell walls as vapour.'),('2 · Vapour diffuses out','Through air spaces and stomata to drier air.'),('3 · Tension spreads','Curved surfaces pull; cohesion transmits pull.'),('4 · Water replaces losses','Soil → root → xylem → leaf; total Ψ decreases.')]
    for i,(a,b) in enumerate(rows):
        y=104+i*69;f.text(200,y,a,'t b',size=17);f.text(200,y+27,b,'t',size=14)
    f.text(320,409,'Walls resist collapse · cavitation can interrupt a route · no ATP pump up the trunk','t m','middle',13)
    return f.svg()


@figure
def c5_phloem():
    f=Fig(640,405,'Phloem pressure flow carries sucrose and amino acids from sources to sinks. Loading raises solute concentration, water enters by osmosis and higher pressure drives bulk flow toward unloading and use or storage. Two separate pathways illustrate leaf to root downward and storage organ to growing shoot upward; there is no opposing flow in one tube.')
    head(f,'A source can be above OR below its sink','Phloem: sucrose + amino acids in sap · two separate conceptual pathways')
    for x,top,bottom,up in [(167,'Mature leaf: source','Root: sink',False),(473,'Growing shoot: sink','Storage organ: source',True)]:
        f.rect(x-125,78,250,47,'wash-g',8);f.text(x,107,top,'t b','middle',15)
        f.rect(x-20,139,40,125,'plate',3)
        for y in [170,208,245]:f.line(x-20,y,x+20,y,'ln dash')
        f.arrow(x,250 if up else 150,x,150 if up else 250,'green')
        f.rect(x-125,280,250,47,'wash-e',8);f.text(x,309,bottom,'t b','middle',15)
    f.text(320,355,'Loading → water entry → pressure difference → flow → unloading','t b','middle',16)
    f.text(320,382,'Some loading routes use metabolic energy; others are passive.','t m','middle',14)
    f.text(320,401,'Directions belong to source–sink connections, not to the word “food”.','t m','middle',13)
    return f.svg()
