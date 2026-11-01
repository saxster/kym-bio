"""Original engraved transport plates: Chapter 3, paper-first and theme-aware."""
from figs_core import Fig, figure


def _dots(f,x,y,n,cls='wash-e'):
    for i in range(n):
        f.circle(x+(i%5)*17,y+(i//5)*17,4,cls)


@figure
def c3_diffusion():
    f=Fig(640,320,'Equal-volume model chambers: 80 particles left, 20 right. Equal crossing probability gives expected crossings 8 rightward and 2 leftward. At 50 each, crossings average 5 each way; motion continues. Dots represent groups, not measured molecules.')
    for x,title,left,right in [(24,'Unequal concentration',80,20),(338,'Equal concentration',50,50)]:
        f.text(x+139,28,title,'t s','middle',17)
        f.rect(x,48,278,167,'plate',3)
        f.line(x+139,48,x+139,112,'ln m');f.line(x+139,146,x+139,215,'ln m')
        _dots(f,x+25,77,left//5);_dots(f,x+182,77,right//5)
        f.text(x+67,198,str(left),'t b','middle',16);f.text(x+211,198,str(right),'t b','middle',16)
        f.arrow(x+100,120,x+180,120,'electron');f.arrow(x+180,140,x+100,140,'proton')
        a,b=(8,2) if left==80 else (5,5)
        f.text(x+139,244,f'Expected: {a} → and {b} ←','t','middle',15)
        f.text(x+139,271,f'Net: {a-b} →' if a!=b else 'Net: 0; crossings continue','t b','middle',14)
    f.text(320,307,'Each dot = 5 model particles · equal volumes · chosen crossing chance 1 in 10','t m','middle',12)
    return f.svg()


@figure
def c3_water_gate():
    f=Fig(640,335,'Water crosses a water-selective aquaporin both ways; sucrose and ions do not cross this channel. A second panel shows cell solute contribution minus 0.80 MPa plus pressure plus 0.50 MPa equals outside minus 0.30 MPa, so no net water movement is required.')
    f.text(170,27,'A selective route through the membrane','t s','middle',16)
    for y in [102,175]:
        for x in range(25,314,15):
            if 139<x<196:continue
            f.circle(x,y,5,'wash-n');f.line(x,y+(6 if y==102 else -6),x,y+(30 if y==102 else -30),'ln nn')
    f.rect(141,84,53,111,'ln g',15)
    f.text(48,62,'Water','t e',size=14)
    for x,y in [(55,81),(103,70),(230,75),(280,208),(68,223)]:f.circle(x,y,5,'wash-e')
    f.arrow(159,68,159,219,'electron');f.arrow(177,219,177,68,'electron')
    f.rect(251,54,17,17,'wash-p',2);f.text(278,68,'sugar','t p',size=12)
    f.circle(84,205,9,'ln p');f.text(84,210,'+','t p','middle',13)
    f.lines(168,251,['Water pore: aquaporin','No ion or sucrose route here'],'t','middle',14,1.7)
    f.line(335,42,335,298,'ln m')
    f.text(482,45,'When net entry stops','t s','middle',17)
    for y,label,value in [(90,'Outside water potential','−0.30 MPa'),(145,'Inside: solute contribution','−0.80 MPa'),(199,'Inside: pressure contribution','+0.50 MPa')]:
        f.text(360,y,label,'t m',size=13);f.text(360,y+26,value,'t b',size=18)
    f.line(359,238,607,238,'ln m')
    f.text(360,264,'Inside total = −0.30 MPa','t b',size=16)
    f.text(360,291,'Equal potentials; unequal solutes','t',size=13)
    f.text(320,325,'Enlarged schematic channel · chosen pressure example, not measured cell sap','t m','middle',12)
    return f.svg()


@figure
def c3_cells():
    f=Fig(640,330,'Three surrounding solutions compared. In dilute solution a red blood cell can burst while a plant cell becomes turgid. In matching conditions animal volume stays steady; a plant with little pressure is flaccid. In concentrated solution animal cells shrink and plant contents can pull away from the wall: plasmolysis. Different enlargements, schematic endpoints.')
    for x,title,mode in [(30,'Dilute outside',0),(242,'Matching solutes',1),(454,'Concentrated outside',2)]:
        f.text(x+78,27,title,'t s','middle',15)
        r=[43,31,21][mode];f.circle(x+78,91,r,'ln p')
        if mode==0:
            f.path(f'M{x+104},57 l12,-9 m-7,22 l19,-1','ln p')
        f.text(x+78,149,['Animal: may burst','Animal: steady volume','Animal: shrivels'][mode],'t','middle',13)
        f.rect(x+13,174,130,94,'ln g',4)
        inset=[3,3,25][mode]
        f.rect(x+13+inset,174+inset,130-2*inset,94-2*inset,'ln e',5)
        f.rect(x+39+inset/2,194+inset/2,78-inset,49-inset,'wash-e',8)
        if mode==0:
            f.arrow(x+77,217,x+77,180,'green')
        f.text(x+78,294,['Plant: turgid','Plant: flaccid','Plant: plasmolysed'][mode],'t b','middle',13)
    f.text(320,322,'Green outline = wall · inner line = membrane · blue region = vacuole · endpoints schematic','t m','middle',12)
    return f.svg()


@figure
def c3_root_routes():
    f=Fig(640,340,'Root transport: ATP powers a proton pump exporting H plus. Protons returning down their electrochemical gradient can drive nitrate uptake through a cotransporter. Mangrove account: exclude much salt at roots, maintain lower tissue water potential, compartmentalise ions, secrete some salt at leaves. Water enters down water potential, not by an ATP water pump.')
    f.text(171,28,'Root hair: an energy relay','t s','middle',17)
    f.text(27,64,'Soil','t m',size=14);f.text(27,252,'Cell interior','t m',size=14)
    f.rect(28,119,284,48,'wash-n',3)
    f.rect(79,100,44,87,'ln g',7);f.rect(214,100,49,87,'ln e',7)
    f.arrow(101,209,101,77,'green');f.text(101,60,'H⁺ out','t g','middle',14)
    f.arrow(239,77,239,214,'electron');f.text(239,60,'H⁺ + NO₃⁻ in','t e','middle',14)
    f.text(101,229,'ATP → ADP + Pᵢ','t g','middle',13)
    f.lines(171,279,['Pump stores a proton gradient.','Cotransporter uses that gradient.'],'t','middle',14,1.7)
    f.line(336,43,336,309,'ln m')
    f.text(481,49,'Mangrove water account','t s','middle',17)
    for y,n,a,b in [(89,'1','Root barriers','Exclude much salt'),(145,'2','Dissolved substances','Lower tissue water potential'),(201,'3','Vacuoles and leaf glands','Store ions; secrete some salt')]:
        f.circle(363,y+5,12,'ln g');f.text(363,y+10,n,'t g','middle',13)
        f.text(385,y,a,'t b',size=14);f.text(385,y+23,b,'t m',size=13)
    f.arrow(366,271,596,271,'electron')
    f.text(481,298,'Water: higher → lower potential','t e','middle',14)
    f.text(320,331,'Routes enlarged · no fixed ATP cost per nitrate · Avicennia has salt-secreting glands','t m','middle',12)
    return f.svg()
