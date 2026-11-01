"""Chapter 4: six original, paper-first plates. No external artwork/coordinates."""
from figs_core import Fig, figure
import math


def _unit(f,x,y,label='G',cls='wash-e'):
    f.rect(x-12,y-12,24,24,cls,4)
    f.text(x,y+5,label,'t b','middle',14)


@figure
def c4_water_carbon():
    f=Fig(640,330,'Two neutral bent water molecules have partially negative oxygen and partially positive hydrogen. Solid lines are covalent bonds; a dotted O-to-H contact between molecules is a hydrogen bond. Carbon has four bonding units, shown by methane connectivity, not a flat molecular shape. All sizes illustrative.')
    f.text(165,28,'Water: uneven charge','t s','middle',19)
    for x,y in [(85,103),(249,130)]:
        for dx,dy in [(-35,35),(35,35)]:
            f.line(x,y,x+dx,y+dy,'ln');f.circle(x+dx,y+dy,13,'wash-e');f.text(x+dx,y+dy+5,'H','t','middle',14)
        f.circle(x,y,17,'wash-p');f.text(x,y+5,'O','t','middle',16)
        f.text(x,y-27,'δ−','t p','middle',16)
        f.text(x-57,y+45,'δ+','t e','middle',14)
    f.line(132,138,232,130,'ln dash')
    f.text(166,202,'Dotted: hydrogen bond','t','middle',15)
    f.text(166,229,'Solid: covalent O–H bonds','t','middle',15)
    f.text(166,260,'δ means partial charge.','t m','middle',14)
    f.text(166,284,'Each whole molecule is neutral.','t b','middle',14)
    f.line(331,40,331,291,'ln m')
    f.text(485,28,'Carbon: four bonds','t s','middle',19)
    for x,y in [(485,83),(422,145),(548,145),(485,207)]:
        f.line(485,145,x,y,'ln');f.circle(x,y,15,'wash-e');f.text(x,y+5,'H','t','middle',15)
    f.circle(485,145,19,'wash');f.text(485,151,'C','t b','middle',18)
    f.text(485,251,'CH₄: connectivity only','t b','middle',15)
    f.text(485,279,'Real methane is tetrahedral.','t m','middle',14)
    f.text(320,318,'Enlarged schematics · carbon’s “hands” mean bonding capacity, never intentions','t m','middle',13)
    return f.svg()


@figure
def c4_building_units():
    f=Fig(640,430,'Glucose units build starch, branched glycogen or cellulose with different link arrangements. Amino acids form an ordered chain. A triglyceride has glycerol and three fatty-acid residues, not a repeating monomer chain. Tokens and lines show architecture, not chemical structures or real chain lengths.')
    f.text(320,28,'Same ingredients do not mean the same structure','t s','middle',19)
    for x,title,desc in [(105,'Starch','Plant glucose store'),(320,'Glycogen','More highly branched'),(535,'Cellulose','Wall-supporting fibres')]:
        f.text(x,65,title,'t b','middle',17);f.text(x,89,desc,'t m','middle',14)
    for center,branch in [(105,False),(320,True)]:
        for i in range(5):
            x=center-70+i*35
            if i:f.line(x-35,135,x,135,'ln e')
            _unit(f,x,135)
        if branch:
            for dx in [-35,35]:
                f.line(center+dx,135,center+dx,185,'ln e');_unit(f,center+dx,185)
        else:
            f.line(140,135,140,185,'ln e');_unit(f,140,185)
    for y in [131,177]:
        for i in range(5):
            x=465+i*35
            if i:f.line(x-35,y,x,y,'ln g')
            _unit(f,x,y,'G' if i%2==0 else '↶','wash-g')
        if y==177:
            for i in range(5):f.line(465+i*35,145,465+i*35,163,'ln dash')
    f.text(105,224,'Unbranched + branched','t','middle',13)
    f.text(320,224,'Storage in animals','t','middle',13)
    f.text(535,224,'Different link orientation','t','middle',13)
    f.line(25,246,615,246,'ln m')
    f.text(161,277,'Amino acids → ordered chain','t b','middle',16)
    for i,label in enumerate(['A','B','C','A','D']):
        x=58+i*50
        if i:f.line(x-50,318,x,318,'ln')
        _unit(f,x,318,label,'wash-p' if label=='A' else 'wash-e')
    f.text(161,358,'Letters stand for different side chains.','t m','middle',13)
    f.text(161,383,'Links here represent peptide bonds.','t','middle',14)
    f.text(475,277,'One triglyceride','t b','middle',16)
    f.rect(372,296,40,83,'wash-n',3)
    for y in [309,338,367]:f.path(f'M412,{y} L447,{y} l22,-9 l22,9 l22,-9 l22,9 l22,-9','ln g')
    f.text(390,398,'Glycerol','t','middle',14);f.text(519,398,'3 fatty-acid residues','t','middle',14)
    f.text(320,423,'G = glucose-derived unit · links and lengths schematic · triglycerides are only one lipid class','t m','middle',12)
    return f.svg()


@figure
def c4_folding():
    f=Fig(640,390,'Collagen is drawn as three separate helical strands wound together, with no atomic coordinates implied. A peptide backbone has relatively planar peptide groups and rotations on neighbouring bonds. Nonbonded atoms cannot occupy the same space. Local allowed angles restrict but do not determine the whole fold. Schematic projections, not a measured Ramachandran plot.')
    f.text(155,28,'Collagen: modern schematic','t s','middle',18)
    for n,cls in enumerate(['ln p','ln e','ln g']):
        pts=[(36+i*2.35,104+28*math.sin(i*.13+n*2*math.pi/3)) for i in range(100)]
        f.path('M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in pts),cls)
        f.text(32+n*86,165,str(n+1)+' '+['chain','chain','chain'][n],['t p','t e','t g'][n],size=14)
    f.lines(155,201,['1954: three-chain proposal','1955: coiled-coil revision'],'t','middle',14,1.7)
    f.line(315,43,315,254,'ln m')
    f.text(476,28,'A backbone has limits','t s','middle',18)
    f.line(356,134,409,112,'ln');f.rect(410,92,100,44,'wash',4);f.text(460,119,'peptide group','t','middle',13)
    f.line(510,112,567,145,'ln')
    f.curved_arrow(369,105,397,91,-18,'electron');f.curved_arrow(534,115,563,124,-19,'green')
    f.text(374,77,'turn 1','t e','middle',14);f.text(556,77,'turn 2','t g','middle',14)
    f.lines(476,197,['Peptide group: relatively planar','Neighbours: two backbone rotations','Many angle pairs crowd atoms.'],'t','middle',14,1.7)
    f.line(25,266,615,266,'ln m')
    for x,clash in [(66,False),(356,True)]:
        f.circle(x,310,19,'ln e');f.circle(x+(25 if clash else 65),310,19,'ln p')
        f.text(x+98,305,'Too close' if clash else 'Space between','t b',size=15)
        f.text(x+98,329,'High-energy clash' if clash else 'No clash here','t m',size=14)
    f.text(320,365,'1963: Ramachandran, C. Ramakrishnan, V. Sasisekharan','t b','middle',14)
    f.text(320,386,'Illustrative projections · no atomic scale or measured angle map · local fit ≠ full fold','t m','middle',12)
    return f.svg()


@figure
def c4_barrier():
    f=Fig(640,424,'A schematic free-energy graph has common reactant level20 and product level10. Uncatalysed peak90 gives forward barrier70; catalysed peak55 gives35. Net change minus10 is unchanged. A separate enzyme cycle shows binding, chemical rearrangement, release and reuse. Chosen arbitrary energy units; progress is not time and no rate multiplier is calculated.')
    f.text(320,25,'A lower hurdle; the same start and finish','t s','middle',19)
    f.text(29,53,'Free energy (chosen units)','t m',size=13)
    f.line(55,244,55,54,'ln');f.arrow(55,244,596,244,'ink')
    f.path('M80,204 C166,204 191,64 296,64 S440,224 569,224','ln p')
    f.path('M80,204 C166,204 191,134 296,134 S440,224 569,224','ln g')
    f.line(80,204,345,204,'ln dash')
    f.line(296,64,342,64,'ln dash');f.arrow(342,204,342,64,'proton');f.text(354,105,'70','t p',size=15)
    f.line(296,134,388,134,'ln dash');f.arrow(388,204,388,134,'green');f.text(400,173,'35','t g',size=15)
    f.text(431,77,'Uncatalysed','t p',size=15);f.text(442,127,'Catalysed','t g',size=15)
    f.text(80,228,'20','t b','middle',13);f.text(573,208,'10','t b','middle',13)
    f.text(321,273,'Reaction progress → (not elapsed time)','t m','middle',14)
    f.text(320,299,'Chosen example: net change = 10 − 20 = −10 on BOTH routes','t b','middle',14)
    for x,n,a,b in [(70,'1','Bind','substrate'),(232,'2','Rearrange','at active site'),(405,'3','Release','products'),(565,'4','Reuse','enzyme')]:
        f.circle(x,334,13,'ln g');f.text(x,339,n,'t g','middle',14)
        f.text(x,366,a,'t b','middle',15);f.text(x,388,b,'t','middle',13)
        if x<560:f.arrow(x+25,334,x+125,334,'electron')
    f.text(320,408,'Schematic pathways · not measured data · no universal “million times” factor','t m','middle',12)
    return f.svg()


@figure
def c4_conditions():
    f=Fig(640,360,'Schematic temperature response separates increasing encounters from declining active enzyme fraction; their product can rise then fall. A separate pH panel shows changed side-chain charge affecting active-site chemistry. No particular enzyme, universal optimum or fever threshold is represented.')
    f.text(166,28,'Warming has two effects','t s','middle',18)
    f.line(49,232,302,232,'ln');f.line(49,232,49,64,'ln')
    for typ,cls in [('enc','ln e'),('frac','ln p'),('rate','ln g')]:
        pts=[]
        for i in range(101):
            t=i*.8;enc=2**((t-20)/20);frac=1/(1+math.exp((t-50)/4))
            value={'enc':enc/8,'frac':frac,'rate':enc*frac/2}[typ]
            pts.append((49+2.95*t,232-145*value))
        f.path('M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in pts),cls)
    f.text(170,258,'Temperature →','t m','middle',14)
    f.text(62,72,'Relative scales, each chosen','t m',size=12)
    f.text(52,285,'E: encounters rise','t e',size=14);f.text(52,308,'F: active fraction falls','t p',size=14);f.text(52,331,'R: combined rate','t g',size=14)
    f.line(325,44,325,332,'ln m')
    f.text(480,28,'pH changes chemistry','t s','middle',18)
    for y,label,sign in [(96,'One charge state','−'),(204,'Different pH','0')]:
        f.rect(358,y-26,74,62,'wash',10);f.circle(395,y+5,16,'ln e');f.text(395,y+10,sign,'t b','middle',17)
        f.text(455,y,label,'t b',size=15)
        f.text(455,y+24,'Binding/catalysis changes','t m',size=12)
    f.text(480,283,'Extreme pH may also unfold','t','middle',14)
    f.text(480,307,'the protein. Low rate alone','t','middle',14)
    f.text(480,331,'does not prove denaturation.','t b','middle',14)
    f.text(320,355,'Invented teaching curves, no measured data · optimum depends on enzyme and assay conditions','t m','middle',12)
    return f.svg()


@figure
def c4_food_tests():
    f=Fig(640,478,'Five supervised laboratory tests with targets, positive observations and positive controls: Benedict heated for reducing sugar, iodine for starch, biuret for protein peptide bonds, ethanol then water for fats/oils, DCPIP decolourisation for vitamin C. Run a reagent blank and matched known positive. Colours alone are not precise nutrient measurements.')
    f.text(320,27,'The food detective’s bench map','t s','middle',20)
    f.text(24,57,'Test / target','t b',size=15);f.text(233,57,'Positive observation','t b',size=15);f.text(489,57,'Known positive','t b',size=15)
    rows=[('Benedict’s + heat','Reducing sugars','Coloured precipitate','green → brick-red range','Glucose'),('Iodine solution','Starch','Blue-black','from yellow-brown','Starch'),('Biuret reagent','Protein / peptide bonds','Lilac or purple','from blue','Protein solution'),('Ethanol → water','Fats and oils','White / cloudy emulsion','from clear extract + water','Cooking oil'),('DCPIP','Vitamin C','Dye loses colour','usually blue → colourless','Vitamin C')]
    for i,(a,b,c,d,e) in enumerate(rows):
        y=88+i*64;f.line(23,y-16,615,y-16,'ln m')
        f.text(24,y+3,a,'t b',size=15);f.text(24,y+25,b,'t m',size=13)
        f.text(233,y+3,c,'t',size=15);f.text(233,y+25,d,'t m',size=13)
        f.text(489,y+10,e,'t g',size=14)
    f.line(24,399,615,399,'ln m')
    f.text(320,420,'Every test: reagent blank + known positive + clean separate food portion','t b','middle',13)
    f.text(320,442,'School laboratory only · teacher manages heat/reagents/waste · no tasting or ethanol flames','t m','middle',12)
    f.text(320,458,'Observations schematic · sample colour, acidity, cloudiness and sensitivity can affect interpretation','t m','middle',12)
    return f.svg()
