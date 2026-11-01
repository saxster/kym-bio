"""Original Chapter 7 paper plates. See grounding/ch07.md for source/model limits."""
import math
from figs_core import Fig, figure


def heading(f, title, sub):
    f.text(320, 29, title, 't s', 'middle', 22)
    f.text(320, 55, sub, 't m', 'middle', 13)


def box(f, x, y, w, h, rows, cls='plate', size=15):
    f.rect(x, y, w, h, cls, 9)
    rows = [rows] if isinstance(rows, str) else rows
    gap = size * 1.4
    for i, s in enumerate(rows):
        f.text(x+w/2, y+h/2+(i-(len(rows)-1)/2)*gap+size*.34, s, 't', 'middle', size)


@figure
def c7_canal():
    f = Fig(640, 640, 'Connection map, not anatomical positions or scale. Food follows mouth, oesophagus, stomach, duodenum and remaining small intestine including ileum, colon, rectum, anus. Salivary glands deliver saliva to mouth. Liver bile can go to gallbladder for storage or through bile duct to duodenum; stored bile returns through the cystic branch. Pancreatic duct delivers pancreatic juice to duodenum. Food does not pass through those accessory organs. Solid arrows food; dashed arrows secretions.')
    heading(f, 'One food route; several secretion routes', 'Connection map, not body positions or lengths · follow the labelled arrows')
    routes=[(90,'Mouth'),(158,'Oesophagus'),(226,'Stomach'),(330,'Duodenum'),(416,['Rest of small intestine','including ileum']),(502,'Colon'),(570,'Rectum → anus')]
    for y,label in routes:box(f,39,y,245,48,label,'wash-g',14)
    for (y,_),(z,__) in zip(routes,routes[1:]):f.arrow(160,y+50,160,z-5,'ink',width=2)
    box(f,383,90,219,48,'Salivary glands','wash-e')
    f.arrow(380,114,292,114,'electron',dash=True)
    f.text(335,103,'saliva','t e','middle',13)
    box(f,383,176,219,48,'Liver: makes bile','wash-e')
    box(f,383,257,219,48,['Gallbladder','stores / concentrates'],'wash-e',14)
    # Shared hepatic/common bile route with a cystic branch, away from text.
    f.path('M381,200 L333,200 L333,354 L291,354','ar ar-electron',extra='stroke-dasharray="5 4" marker-end="url(#ah-electron)"')
    f.arrow(383,281,341,281,'electron',dash=True)
    f.arrow(343,264,379,264,'electron',dash=True)
    f.text(335,379,'bile duct','t e','middle',13)
    box(f,383,421,219,62,['Pancreas: enzymes','and bicarbonate'],'wash-e',14)
    f.path('M381,451 L364,451 L364,391 L263,391 L263,379','ar ar-electron',extra='stroke-dasharray="5 4" marker-end="url(#ah-electron)"')
    f.text(485,506,'Pancreatic duct → duodenum','t e','middle',13)
    f.text(439,551,'Solid: food along the lumen','t b','middle',14)
    f.text(439,578,'Dashed: secretions into it','t e','middle',14)
    f.text(320,631,'The trachea is an airway. Swallowed food normally enters the oesophagus.','t m','middle',13)
    return f.svg()


@figure
def c7_boundary():
    f=Fig(640,465,'Schematic gut boundary. Food in the lumen lies inside the body outline but remains on the external side of its epithelial barrier. Absorbable substances cross the lining into tissues; unabsorbed remnants continue through the canal towards egestion. Absorption and later cellular use or assimilation are separate events. Entire intestinal wall is not shown as one cell thick.')
    heading(f,'Inside the outline is not across the barrier','Enlarged section of a tube · connections matter; sizes are schematic')
    f.rect(23,84,594,320,'ln dash',20)
    f.text(38,108,'BODY OUTLINE','t m',size=13)
    f.rect(35,129,570,91,'wash-e',0)
    f.text(320,153,'LUMEN · continuous with the outside through mouth and anus','t b','middle',14)
    for x,label in [(117,'Food particle'),(332,'Glucose'),(526,'Remnants')]:
        f.circle(x,188,13,'plate');f.text(x,213,label,'t','middle',13)
    f.arrow(48,177,85,177,'ink');f.arrow(546,177,592,177,'ink')
    for x in range(36,604,38):f.rect(x,232,37,36,'wash-g',3,extra='stroke="var(--green)" stroke-width=".5"')
    f.text(122,294,'Epithelial barrier','t b','middle',15)
    f.arrow(332,221,332,317,'green',width=3)
    f.text(393,291,'absorption','t g',size=15)
    f.text(320,342,'TISSUE FLUID → onward transport in blood / lymph','t b','middle',15)
    f.text(320,379,'Cells take up and use supplied nutrients: assimilation.','t','middle',15)
    f.text(320,435,'Remnants can stay in the lumen and leave as faeces: egestion.','t','middle',14)
    f.text(320,458,'Crossing depends on molecules’ chemistry and the available transport machinery.','t m','middle',13)
    return f.svg()


@figure
def c7_movement():
    f=Fig(640,610,'Two schematic snapshots of peristalsis above a tooth cutaway. Coordinated contraction narrows the tube behind a bolus while the region ahead relaxes; later the contraction and bolus are farther along. This is muscular propulsion, not gravity alone. Teeth cut and grind: enamel outer crown, dentine below, pulp with nerve and blood vessels, root cement and anchoring jaw bone and gum. Schematics are not to scale; sequence has no calibrated time.')
    heading(f,'A moving squeeze; a set of cutting surfaces','Muscular movement is separate from chemical hydrolysis · not to scale')
    for i,(cy,bx,cx) in enumerate([(143,277,175),(259,408,303)]):
        f.text(39,cy-40,f'{i+1} · Later along the tube' if i else '1 · Contraction behind the bolus','t b',size=15)
        f.path(f'M48,{cy-28} L{cx-29},{cy-28} Q{cx},{cy-5} {cx+29},{cy-28} L592,{cy-28}','ln g',extra='stroke-width="4"')
        f.path(f'M48,{cy+28} L{cx-29},{cy+28} Q{cx},{cy+5} {cx+29},{cy+28} L592,{cy+28}','ln g',extra='stroke-width="4"')
        f.rect(bx-30,cy-20,60,40,'wash-e',19)
        f.text(bx,cy+5,'bolus','t','middle',14)
        f.arrow(bx+42,cy,bx+120,cy,'ink',width=2)
    f.text(320,319,'Local contractions also mix contents; these two snapshots show propulsion.','t m','middle',13)
    f.line(28,338,612,338,'ln r')
    f.text(320,364,'TEETH · incisor cuts; canine tears; premolars and molars crush / grind','t b','middle',14)
    # Simplified tooth cutaway with layers and an open root channel.
    f.path('M92,458 C59,383 179,383 148,458 L137,548 L120,574 L103,548 Z','plate')
    f.path('M102,453 C81,411 159,411 138,453 L128,544 L120,555 L113,544 Z','wash-n',extra='stroke="var(--neutron)" stroke-width="1"')
    f.path('M113,451 Q120,427 127,451 L125,547 L116,547 Z','wash-p',extra='stroke="var(--proton)" stroke-width="1"')
    f.path('M74,473 L96,473 M145,473 L171,473','ln g',extra='stroke-width="7"')
    f.path('M78,497 L96,497 L103,558 M145,497 L137,558 L159,497','ln m')
    f.line(120,548,120,581,'ln p',extra='stroke-width="3"')
    for x,y,tx,ty,label in [(157,409,227,409,'Enamel: hard crown surface'),(139,435,227,435,'Dentine below enamel'),(127,459,227,461,'Pulp: nerves and blood vessels'),(157,473,227,487,'Gum around the tooth'),(141,519,227,519,'Root cement: outer root covering'),(158,550,227,551,'Jaw bone anchors the root')]:
        f.line(x,y,tx-10,ty-5,'ln m');f.text(tx,ty,label,'t',size=14)
    f.text(320,601,'Mechanical breakdown exposes more food surface. It does not cut every molecule.','t m','middle',13)
    return f.svg()


@figure
def c7_chemistry():
    f=Fig(640,560,'Compartment map for three food components. Mouth salivary amylase begins starch breakdown; stomach pepsin in acid begins protein breakdown. Pancreatic amylase, proteases and lipase act in small intestine with suitable conditions; brush-border enzymes complete carbohydrate and peptide processing. Starch yields glucose through intermediate sugars; protein yields amino acids via peptides; major pancreatic triglyceride products are fatty acids and monoacylglycerols. This is a selected pathway map, not every reaction or a timed journey.')
    heading(f,'Different compartments, different chemical jobs','Selected main routes · intermediates matter · stages overlap in life')
    centers=[119,320,521]
    for x,title in zip(centers,['STARCH','PROTEIN','TRIGLYCERIDE']):f.text(x,99,title,'t b','middle',16)
    rows=[(123,76,[['Mouth: amylase','Maltose + shorter chains'],['Mouth: chewing','No main protease step'],['Mixing begins','Many molecules per droplet']]),(236,77,[['Stomach acid limits','salivary amylase'],['Stomach: pepsin','Protein → peptides'],['Some lipase action','Main work follows']]),(350,80,[['Pancreatic amylase','More maltose / chains'],['Pancreatic proteases','Smaller peptides'],['Bile disperses droplets','Lipase + water: hydrolysis']])]
    for y,h,data in rows:
        for x,lines in zip(centers,data):box(f,x-91,y,182,h,lines,'wash-e' if y==236 else 'plate',13)
    for x in centers:
        f.arrow(x,201,x,229,'ink');f.arrow(x,315,x,343,'ink');f.arrow(x,432,x,460,'green')
    for x,lines in zip(centers,[['Brush-border enzymes','Glucose for absorption'],['Peptidases finish','Amino acids to blood'],['Fatty acids + mono-','acylglycerols enter cells']]):box(f,x-91,467,182,61,lines,'wash-g',13)
    f.text(320,553,'Lower rows: small intestine. Acid is a condition; pepsin is an enzyme.','t m','middle',13)
    return f.svg()


@figure
def c7_protection():
    f=Fig(640,490,'Enlarged schematic stomach surface. Acidic lumen contains active pepsin and food protein. Mucus retains secreted bicarbonate near the epithelial surface, limiting acid exposure. Joined epithelial cells restrict leakage, with tissue support and repair beneath. Cells release inactive pepsinogen before activation in the lumen. These defences reduce self-digestion but are not perfect. Not a quantitative pH gradient or scale drawing.')
    heading(f,'A reactive lumen beside a protected surface','Stomach cutaway · qualitative conditions, no universal pH or layer thickness')
    f.rect(26,85,588,95,'wash-p',0)
    f.text(43,110,'LUMEN: acid + pepsin act on food protein','t b',size=16)
    f.text(43,146,'Protein → peptide fragments','t p',size=17)
    f.rect(26,183,588,79,'wash-e',0)
    f.text(320,210,'MUCUS + BICARBONATE','t e b','middle',16)
    f.text(320,239,'Local buffering limits acid reaching the cells.','t','middle',15)
    for x in range(27,600,73):f.rect(x,269,71,70,'wash-g',4)
    f.rect(26,269,588,70,'ln g',0)
    f.text(320,310,'Joined epithelial cells: a barrier','t b','middle',17)
    f.text(320,373,'Underlying tissue supports renewal and repair.','t','middle',16)
    f.line(26,393,614,393,'ln r')
    f.text(124,424,'Pepsinogen','t b','middle',17);f.text(124,450,'inactive precursor','t m','middle',13)
    f.arrow(211,420,420,420,'ink')
    f.text(316,411,'activation in acidic lumen','t','middle',13)
    f.text(511,424,'Pepsin','t p b','middle',17);f.text(511,450,'active protease','t m','middle',13)
    f.text(320,481,'Protection is maintained, and can fail. The wall is not made of indigestible protein.','t m','middle',13)
    return f.svg()


@figure
def c7_emulsion():
    f=Fig(640,500,'Conserved-volume geometric example using three-dimensional equal spheres. One sphere radius 3 millimetres divided into eight equal-volume spheres gives radius 1.5 millimetres per sphere. Total fat volume remains 36 pi cubic millimetres; total area doubles from 36 pi to 72 pi square millimetres. Circles are a spread-out projection of spheres, not a two-dimensional area calculation. Chosen millimetre geometry is not a measurement of gut droplets. Molecules remain triglycerides; no digestion rate is calculated.')
    heading(f,'Same fat volume. More exposed interface.', 'Chosen 3D sphere geometry · circles are a spread-out projection, not measured gut fat')
    f.text(155,105,'ONE SPHERE','t b','middle',16)
    f.text(479,105,'EIGHT EQUAL SPHERES','t b','middle',16)
    f.circle(155,207,56,'wash-n',extra='stroke="var(--neutron)" stroke-width="1.5"')
    f.line(155,207,211,207,'ln');f.text(155,282,'R = 3 mm','t','middle',16)
    for y in [168,241]:
        for x in [367,436,505,574]:f.circle(x,y,28,'wash-n',extra='stroke="var(--neutron)" stroke-width="1.5"')
    f.text(473,304,'r = 1.5 mm each','t','middle',16)
    f.arrow(229,207,322,207,'ink')
    f.text(276,185,'disperse','t','middle',13)
    f.line(26,326,614,326,'ln r')
    f.text(320,356,'Volume: 1 × 4π(3³)/3 = 8 × 4π(1.5³)/3 = 36π mm³','t s','middle',17)
    f.text(320,391,'Area: 4π(3²) = 36π mm² → 8 × 4π(1.5²) = 72π mm²','t s','middle',16)
    f.text(320,427,'Eight droplets, twice the area. Fat molecules have not been hydrolysed.','t b','middle',14)
    f.text(320,460,'Bile helps stabilise dispersed droplets; lipase acts at the fat–water interface.','t','middle',14)
    f.text(320,489,'Geometry alone does not establish a twofold biological digestion rate.','t m','middle',13)
    return f.svg()


@figure
def c7_lipase():
    f=Fig(640,515,'Simplified connectivity map of triglyceride hydrolysis. A glycerol backbone has three fatty-acid tails attached through ester links. Pancreatic lipase, assisted at the interface by colipase, mainly removes the two outer fatty acids using two waters, leaving a monoacylglycerol and two free fatty acids. It changes covalent links, unlike emulsification. Fatty-acid head-group atoms and ester-group atoms are omitted in the cartoon; the separate full-formula triolein account balances carbon hydrogen oxygen, including water. No molecular bond angles or scale implied.')
    heading(f,'Lipase changes molecular connections','Simplified link map; fatty-acid head-group atoms omitted · no shape or rate model')
    f.text(147,102,'TRIGLYCERIDE','t b','middle',17)
    for y in [140,180,220]:
        f.rect(41,y-12,35,25,'wash-g',2);f.line(78,y,118,y,'ln p');f.path(f'M121,{y} l17,-7 l17,14 l17,-14 l17,14 l17,-7','ln')
    f.line(58,154,58,166,'ln g');f.line(58,194,58,206,'ln g')
    f.text(57,255,'glycerol','t g','middle',13);f.text(160,255,'three fatty-acid tails','t','middle',13)
    f.arrow(234,180,366,180,'ink',width=2)
    f.text(300,148,'lipase + 2 H₂O','t b','middle',15)
    f.text(300,215,'hydrolysis','t p','middle',14)
    f.text(489,102,'MAIN PRODUCTS','t b','middle',17)
    for y in [140,180,220]:f.rect(394,y-12,35,25,'wash-g',2)
    f.line(411,154,411,166,'ln g');f.line(411,194,411,206,'ln g')
    f.line(431,180,466,180,'ln p');f.path('M469,180 l17,-7 l17,14 l17,-14 l17,14 l17,-7','ln')
    for y in [140,220]:
        f.line(430,y,438,y,'ln p');f.text(451,y+4,'OH','t p','middle',13);f.path(f'M474,{y} l17,-7 l17,14 l17,-14 l17,14 l17,-7','ln')
    f.text(484,259,'One tail still attached; two released.','t','middle',13)
    f.line(26,281,614,281,'ln r')
    f.text(320,314,'REPRESENTATIVE MOLECULE: TRIOLEIN','t b','middle',15)
    f.text(320,348,'C₅₇H₁₀₄O₆ + 2H₂O → C₂₁H₄₀O₄ + 2C₁₈H₃₄O₂','t s','middle',21)
    f.text(320,377,'triglyceride + water → monoacylglycerol + fatty acids','t','middle',15)
    f.text(320,408,'Atoms on each side: C 57 · H 108 · O 8','t b','middle',16)
    f.text(320,446,'Full hydrolysis would also remove the last tail and release free glycerol.','t','middle',14)
    f.text(320,477,'A smaller droplet still contains many molecules. A hydrolysis product is a new molecule.','t m','middle',13)
    f.text(320,506,'Colipase helps pancreatic lipase work at the bile-coated interface; omitted from this map.','t m','middle',12)
    return f.svg()


@figure
def c7_villus():
    f=Fig(640,595,'Nested enlargements of small intestine absorption surface. Circular folds carry villi; a villus is a tissue projection with a thin epithelial lining, blood capillaries and a central lacteal. Individual absorptive epithelial cells have microscopic membrane projections called microvilli. A microvillus is not a smaller villus with its own blood vessel. Three panels use different schematic magnifications; entire intestinal wall includes deeper muscle and tissue layers.')
    heading(f,'Fold → villus → cell surface','Three separate enlargements · each panel has its own schematic scale')
    f.text(320,91,'1 · FOLDS OF THE INTESTINAL LINING','t b','middle',15)
    surface = [(x, 180-61*math.sin(math.pi*(x-40)/120)**2) for x in range(40,291,2)]
    edge = ' L'.join(f'{x},{y:.2f}' for x,y in surface)
    f.path('M40,198 L'+edge+' L290,198 Z','wash-g',extra='stroke="var(--green)" stroke-width="1.4"')
    for x in range(45,286,12):
        y=180-61*math.sin(math.pi*(x-40)/120)**2
        f.path(f'M{x-3},{y:.2f} L{x-3},{y-9:.2f} Q{x},{y-15:.2f} {x+3},{y-9:.2f} L{x+3},{y:.2f}','ln')
    f.lines(340,132,['Folds carry many villi.','Deeper wall has connective','tissue and muscle.'],size=15,lh=1.65)
    f.line(26,213,614,213,'ln r')
    f.text(320,243,'2 · ONE VILLUS: A TISSUE PROJECTION','t b','middle',15)
    f.path('M76,399 L76,310 C76,260 219,260 219,310 L219,399','wash-g',extra='stroke="var(--green)" stroke-width="1.4"')
    f.path('M94,397 L94,312 C94,285 201,285 201,312 L201,397','ln')
    f.path('M113,397 L113,323 Q113,302 135,313 L135,397','ln p',extra='stroke-width="3"')
    f.path('M173,397 L173,321 Q173,306 191,321 L191,397','ln p',extra='stroke-width="3"')
    f.path('M149,397 L149,324 Q156,310 163,324 L163,397','ln e',extra='stroke-width="5"')
    f.lines(340,287,['Thin absorptive epithelium','surrounds the villus.','Capillaries carry blood.','A lacteal carries lymph.'],size=15,lh=1.65)
    f.text(147,423,'blood      lymph      blood','t','middle',13)
    f.line(26,443,614,443,'ln r')
    f.text(320,472,'3 · AN ABSORPTIVE CELL’S MEMBRANE','t b','middle',15)
    f.rect(66,512,164,55,'wash-g',4,extra='stroke="var(--green)" stroke-width="1"')
    for x in range(72,228,13):f.path(f'M{x},511 L{x},493 Q{x+4},485 {x+8},493 L{x+8},511','ln g',extra='stroke-width="2"')
    f.lines(340,514,['Microvilli project from cells.','They contain no capillaries.','Extra membrane holds transporters.'],size=14,lh=1.65)
    f.text(320,587,'One-cell-thick epithelium ≠ one-cell-thick intestinal wall.','t m','middle',13)
    return f.svg()


@figure
def c7_absorption():
    f=Fig(640,625,'Two representative absorption routes, not all nutrients. Glucose crosses lumen-facing membrane through sodium-coupled transport, powered indirectly by ATP-maintained sodium gradient; it exits tissue-facing membrane via a transporter and reaches tissue fluid, villus capillary, hepatic portal vein, liver and circulation. Long-chain fatty acids and monoacylglycerols leave micelles and enter epithelial cells, are rebuilt as triglycerides and packaged as chylomicrons before tissue fluid, lacteal, lymph and blood near heart. Some shorter-chain fatty acids follow portal blood instead. Distinguish membrane crossing from bulk blood and lymph flow.')
    heading(f,'Cross a membrane; then join a transport route','Representative pathways · arrows name material movement, not energy transfer')
    f.text(166,99,'GLUCOSE EXAMPLE','t b','middle',16)
    f.text(478,99,'LONG-CHAIN FAT EXAMPLE','t b','middle',16)
    rows=[(122,61,[['Lumen: glucose + Na⁺','A coupled transporter admits them.'],['Lumen: product-bearing micelles','Products leave; micelles stay.']]),(223,81,[['Epithelial cell','ATP-driven pump maintains Na⁺','difference; glucose exits via protein.'],['Epithelial cell','Fatty acids + monoacylglycerols','→ rebuilt fat in chylomicrons']]),(344,48,[['Tissue fluid → blood capillary'],['Tissue fluid → lacteal']]),(432,60,[['Hepatic portal vein → liver'],['Lymph vessels → blood','near the heart']]),(532,42,[['Onward blood → body tissues'],['Onward blood → body tissues']])]
    for y,h,data in rows:
        for x,copy in zip([166,478],data):box(f,x-143,y,286,h,copy,'wash-g' if y==223 else 'plate',13)
    for x in [166,478]:
        for y,z in [(185,215),(307,336),(394,424),(495,524)]:f.arrow(x,y,x,z,'green' if y<336 else 'ink',width=2)
    f.text(320,599,'Some shorter-chain fatty acids use portal blood. Not every lipid follows lymph.','t','middle',14)
    f.text(320,621,'The token tracks dietary material, not an unchanged fat droplet or micelle.','t m','middle',13)
    return f.svg()
