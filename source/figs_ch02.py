"""Original, theme-aware engraved teaching plates for Chapter 2."""
from figs_core import Fig, figure


def _mito(f, x, y, w=42, h=23):
    f.rect(x, y, w, h, 'wash-n', h/2)
    f.rect(x+3, y+3, w-6, h-6, 'ln nn', (h-6)/2)
    for i in range(3):
        xx=x+10+i*(w-15)/3
        f.path(f'M{xx},{y+5} l4,{h-10} l4,{-h+10}', 'ln nn')


def _cell(f, x, kind):
    plant=kind=='plant'; bacteria=kind=='bacteria'
    if plant:
        f.rect(x, 65, 170, 126, 'ln g', 10)
        f.rect(x+6, 71, 158, 114, 'plate', 9)
        f.rect(x+52, 91, 87, 73, 'wash-e', 14)
        f.text(x+95, 134, 'sap', 't e', 'middle', 14)
        for px,py in [(x+18,84),(x+128,76),(x+125,167)]:
            f.rect(px,py,25,13,'wash-g',6)
            for k in range(3): f.line(px+6+k*5,py+3,px+6+k*5,py+10,'ln g')
    else:
        f.rect(x+5, 78 if bacteria else 65, 160, 96 if bacteria else 126, 'plate', 42)
        if bacteria: f.rect(x+10,83,150,86,'ln e',38)
    if bacteria:
        f.path(f'M{x+47},118 c-18,-25 58,-25 67,1 s-65,36 -67,-1 Z','ln p')
        f.circle(x+127,142,9,'ln p')
        f.text(x+84,204,'DNA ring + plasmid','t p','middle',14)
    else:
        f.circle(x+32,140,18,'wash-p')
        f.path(f'M{x+21},140 q10,-15 20,0 q-10,15 -20,0','ln p')
        _mito(f,x+65,72,37,21)
        f.text(x+84,211,'Nucleus + mitochondria','t','middle',13)
    for dx,dy in [(27,99),(50,166),(146,149),(140,111),(70,151),(110,178)]:
        if bacteria and dy>168: continue
        if plant and 52 < dx < 139 and 91 < dy < 164: continue
        f.circle(x+dx,dy,2,'fill-ink')


@figure
def c2_cell_inventory():
    f=Fig(640,340,'Three schematic cell cutaways: animal and green leaf cells have nuclei and mitochondria; a bacterium has exposed DNA and a plasmid. All have membranes, cytoplasm and ribosomes. Sizes are not to scale.')
    for x,title,kind in [(25,'Animal cell','animal'),(235,'Green leaf cell','plant'),(445,'Bacterial cell','bacteria')]:
        f.text(x+85,35,title,'t s','middle',17)
        _cell(f,x,kind)
    f.text(320,239,'Shared: cell membrane · cytoplasm · ribosomes (dots)','t b','middle',15)
    f.line(25,253,615,253,'ln m')
    f.lines(30,277,['Plant wall: cellulose outside membrane','Green leaf: chloroplasts + large vacuole'],'t',size=14,lh=1.6)
    f.lines(355,277,['Bacterial wall: different material','White onion bulb: no chloroplasts'],'t',size=14,lh=1.6)
    f.text(320,328,'Cutaways; ribosomes and membranes enlarged; molecular crowding omitted for clarity.','t m','middle',12)
    return f.svg()


@figure
def c2_stowaway_clues():
    f=Fig(640,340,'Mitochondrion and chloroplast cutaways beside four independent ancestry clues: surrounding membranes, DNA, bacterial-related ribosomes and division. Gene comparisons provide stronger ancestry evidence than shape alone.')
    f.text(125,29,'Mitochondrion','t s','middle',17)
    _mito(f,45,52,160,78)
    f.circle(80,88,11,'ln p')
    f.text(125,156,'Folded inner membrane','t','middle',14)
    f.text(125,193,'Chloroplast','t s','middle',17)
    f.rect(45,210,160,78,'wash-g',35)
    f.rect(50,215,150,68,'ln g',30)
    for xx in [80,115,150]:
        for yy in [235,244,253]:f.rect(xx,yy,23,6,'ln g',2)
    f.circle(69,266,7,'ln p')
    f.line(245,36,245,297,'ln m')
    rows=[('1 · Two outer boundaries','Membranes around the compartment'),('2 · DNA inside','Part of its own inherited recipe'),('3 · Bacterial relatives','Ribosomes and gene sequences'),('4 · Division','New organelles from existing ones')]
    for i,(a,b) in enumerate(rows):
        y=55+i*62
        f.text(273,y,a,'t b',size=15)
        f.text(273,y+23,b,'t m',size=14)
    f.text(320,323,'Evidence combined → bacterial ancestry; drawings are enlarged reconstructions.','t','middle',14)
    return f.svg()


def _cube(f,x,y,s):
    d=s*.32
    f.rect(x,y,s,s,'wash-e',0)
    f.path(f'M{x},{y} l{d},{-d} h{s} l{-d},{d} Z','ln e')
    f.path(f'M{x+s},{y} l{d},{-d} v{s} l{-d},{d} Z','ln e')
    for i in range(1,5):
        z=i*s/5
        f.line(x+z,y,x+z,y+s,'ln m',extra='opacity=".35"')
    return f


@figure
def c2_geometry():
    f=Fig(640,340,'Cubes with sides 1, 2 and 10 centimetres drawn at the same scale. Surface areas are 6, 24 and 600 square centimetres; volumes 1, 8 and 1000 cubic centimetres; ratios 6, 3 and 0.6 inverse centimetres.')
    f.text(320,26,'Same shape · tenfold side · thousandfold interior','t s','middle',17)
    for x,a in [(70,1),(245,2),(440,10)]:
        _cube(f,x,209-13*a,13*a)
        f.text(x+13*a/2,230,f'{a} cm side','t b','middle',15)
    f.line(28,239,612,239,'ln m')
    for x,area,vol,ratio in [(77,6,1,'6'),(258,24,8,'3'),(505,600,1000,'0.6')]:
        f.lines(x,263,[f'Area {area} cm²',f'Volume {vol} cm³',f'SA/V = {ratio} cm⁻¹'],'t','middle',14,1.5)
    f.text(320,333,'Geometry model in centimetres; these cubes are not actual cells.','t m','middle',12)
    return f.svg()


@figure
def c2_specialists():
    f=Fig(640,340,'Five specialised cells: biconcave red blood cell, root hair extension, cilia moving mucus, chloroplast-rich palisade cell and branching neurone. Below: cell to tissue to organ to system to organism.')
    # Different panels deliberately do not share a scale.
    f.path('M30,99 C35,69 101,69 106,99 C101,127 35,127 30,99 Z','wash-p')
    f.path('M43,98 Q68,80 93,98 Q68,113 43,98','ln p')
    f.lines(68,155,['Red blood cell','Thin, flexible disc','Oxygen transport'],'t','middle',13,1.6)
    f.path('M147,75 h48 v15 h27 q25,0 25,10 q0,10 -25,10 h-27 v21 h-48 Z','wash-g')
    f.circle(163,99,8,'ln p')
    f.lines(192,155,['Root hair cell','Long extension','More contact area'],'t','middle',13,1.6)
    f.rect(279,83,45,46,'plate',4)
    for xx in range(281,325,7):f.path(f'M{xx},83 q-9,-14 0,-26','ln')
    f.arrow(278,43,333,43,'e')
    f.text(303,28,'mucus','t e','middle',13)
    f.lines(309,155,['Ciliated cell','Beating hairs','Move mucus'],'t','middle',13,1.6)
    f.rect(382,59,48,72,'ln g',4)
    for yy in [68,87,107]:
        f.rect(388,yy,12,8,'wash-g',3);f.rect(413,yy,12,8,'wash-g',3)
    f.circle(406,120,6,'ln p')
    f.lines(408,155,['Palisade cell','Chloroplasts','Capture light'],'t','middle',13,1.6)
    f.circle(510,95,15,'wash-n')
    for dx,dy in [(-26,-25),(-28,2),(-20,30)]:f.path(f'M510,95 l{dx},{dy} l-12,-6 m12,6 l-8,10','ln nn')
    f.path('M525,95 h64 l15,-16 m-15,16 l15,16','ln nn')
    f.lines(552,155,['Neurone','Long, narrow axon','Conduct impulses'],'t','middle',13,1.6)
    f.line(25,222,615,222,'ln m')
    f.text(320,248,'Palisade cell → palisade tissue → leaf → shoot system → bean plant','t','middle',14)
    f.text(320,277,'cell → tissue → organ → organ system → organism','t b','middle',15)
    f.text(320,318,'Schematic profiles at different enlargements; no shared scale.','t m','middle',13)
    return f.svg()
