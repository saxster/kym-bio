// Pedagogical enhancements for every live widget in The Living World:
// 1. Goal-directed micro-challenge + earned rubber stamp (challenge)
// 2. Live "Your numbers" handwritten margin substitution in Caveat Variable (yourNumbers)
// 3. 5-shot choreographed "Watch" tour + Cut-away inside view (watch + cutaway)
// 4. "What the model simplifies" 1-sentence honesty footnote (idealised)

export const ENHANCEMENTS = {
  redi_jars: {
    challenge: {
      prompt: 'Inspect Jar 3 (Fine gauze) at Day 5 or later to see where the flies lay their eggs when smell escapes but flies cannot enter.',
      check: (s) => s.tab(0) === 3 && s.num('Day', 0) >= 5,
    },
    yourNumbers: (s) => {
      const day = s.num('Day', 0);
      const focus = ['All 3 jars', 'Jar 1 (Open)', 'Jar 2 (Sealed)', 'Jar 3 (Gauze)'][s.tab(0)] || 'All 3 jars';
      return `Day = ${day.toFixed(1)} of 8.0 | Focus = ${focus} | Variable changed = Fly access (Jar 1 vs Jar 3 both share fresh air)`;
    },
    cutaway: 'Inside the rotting meat: bacteria and blowfly larvae secrete digestive enzymes that break muscle proteins into volatile amines (putrescine and cadaverine) that drift through Jar 3’s gauze and attract adult female Sarcophaga flies.',
    watch: [
      { title: '1. Wide view', caption: '1/5 Wide shot: Redi places identical pieces of meat into three jars—open, parchment-sealed, and gauze-covered.', act: (s) => { s.selectTab(0, 0); s.setSlider('Day', 0); } },
      { title: '2. Close-up', caption: '2/5 Close-up: By Day 2.5, blowflies smell the meat and lay microscopic clutches of eggs directly on Jar 1’s meat and atop Jar 3’s gauze.', act: (s) => { s.selectTab(0, 0); s.setSlider('Day', 2.5); } },
      { title: '3. Cut-away', caption: '3/5 Cut-away: Rising scent molecules pass easily through the fine gauze mesh, refuting the claim that sealed jars only failed for lack of fresh air.', cutaway: true, act: (s) => { s.selectTab(0, 3); s.setSlider('Day', 4.0); } },
      { title: '4. Side-on trend', caption: '4/5 Trend: By Day 6, larvae crawl over Jar 1’s meat and atop Jar 3’s netting, while the meat inside Jar 3 stays 100% maggot-free.', act: (s) => { s.selectTab(0, 3); s.setSlider('Day', 6.0); } },
      { title: '5. Your turn', caption: '5/5 Your turn: Scrub through all 8 days or switch jars to compare the open, sealed, and gauze controls.', cutaway: false, act: (s) => s.selectTab(0, 0) },
    ],
    idealised: 'The simulation tracks macroscopic blowfly eggs and larvae; microscopic bacteria already on the meat continue decomposing all three samples until Pasteur’s later swan-neck flask experiment.',
  },

  leeuwenhoek_scope: {
    challenge: {
      prompt: 'Switch to the "2.0 mm (70×)" or "0.7 mm (275×)" lens and adjust Focus within 4 µm of 0 to bring the swimming animalcules into sharp view.',
      check: (s) => Math.abs(s.num('Focus', 18)) <= 4,
    },
    yourNumbers: (s) => {
      const mag = [70, 150, 275][s.tab(0)] || 275;
      const rLens = [2.0, 1.0, 0.7][s.tab(0)] || 0.7;
      const actualUm = 45;
      const imageMm = (actualUm * mag) / 1000;
      return `M = I ÷ A  ⇒  I = ${actualUm} µm × ${mag}× = ${imageMm.toFixed(2)} mm (${(imageMm * 1000).toFixed(0)} µm apparent size through r = ${rLens} mm sphere)`;
    },
    cutaway: 'Inside the single soda-lime glass bead: the tiny radius of curvature (r = 0.7 mm) bends light steeply at both surfaces, giving focal length f ≈ r / 2(n − 1) ≈ 0.9 mm and 275× magnification when held close to the cornea.',
    watch: [
      { title: '1. Wide view', caption: '1/5 Wide shot: At 70× (a 2.0 mm glass sphere), pond water reveals filamentous Spirogyra algae spirals and fast Paramecia.', act: (s) => { s.selectTab(0, 0); s.setSlider('Focus', 0); } },
      { title: '2. Close-up', caption: '2/5 Close-up: Switching to Leeuwenhoek’s smallest 0.7 mm sphere jumps to 275× magnification—enough to resolve tumbling rod bacteria (2–3 µm).', act: (s) => { s.selectTab(0, 2); s.setSlider('Focus', 0); } },
      { title: '3. Cut-away', caption: '3/5 Cut-away: A single spherical bead avoids the compound lens reflections that blurred Hooke’s multi-lens tubes.', cutaway: true, act: (s) => { s.selectTab(0, 2); s.setSlider('Focus', 0); } },
      { title: '4. Side-on trend', caption: '4/5 Trend: Turning the brass focus screw even 20 µm away from the focal plane blurs the microscopic swimmers into soft haloes.', act: (s) => { s.selectTab(0, 2); s.setSlider('Focus', 22); } },
      { title: '5. Your turn', caption: '5/5 Your turn: Pull Focus back to 0 µm and compare all three glass bead sizes.', cutaway: false, act: (s) => s.setSlider('Focus', 0) },
    ],
    idealised: 'Real spherical glass beads suffer from chromatic fringes and edge curvature outside the central 30% of the field of view.',
  },

  monsoon_imbibition: {
    challenge: {
      prompt: 'Select "Monsoon soak (28 °C + water)" and advance Time to at least 24 hours to watch the radicle root break through the seed coat.',
      check: (s) => s.tab(0) === 1 && s.num('Time', 6) >= 24,
    },
    yourNumbers: (s) => {
      const cond = ['Dry jar (10% H₂O)', 'Monsoon soak (28 °C)', 'Boiled dead seed'][s.tab(0)] || 'Monsoon soak';
      const hr = s.num('Time', 6);
      return `Condition = ${cond} | t = ${hr.toFixed(1)} h | C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~30–32 ATP`;
    },
    cutaway: 'Inside the cotyledon cells: incoming H₂O molecules dissolve the sucrose-raffinose glass matrix, reducing cytoplasmic viscosity by >10,000× so respiratory enzymes and substrates can diffuse and collide.',
    watch: [
      { title: '1. Wide view', caption: '1/5 Wide shot: In a dry cupboard jar (10% water), the moong bean’s cytoplasm is locked in a solid sugar-glass state.', act: (s) => { s.selectTab(0, 0); s.setSlider('Time', 12); } },
      { title: '2. Close-up', caption: '2/5 Close-up: Within 6 hours of monsoon rain soaking into the seed, water content rises past 45% and oxygen uptake leaps >500-fold.', act: (s) => { s.selectTab(0, 1); s.setSlider('Time', 6); } },
      { title: '3. Cut-away', caption: '3/5 Cut-away: Inside the hydrated cell, dissolved enzymes collide rapidly with glucose to recharge ADP into ATP.', cutaway: true, act: (s) => { s.selectTab(0, 1); s.setSlider('Time', 18); } },
      { title: '4. Side-on trend', caption: '4/5 Trend: A boiled seed absorbs the exact same physical water early on, but its heat-unfolded enzymes produce zero O₂ uptake and zero ATP.', act: (s) => { s.selectTab(0, 2); s.setSlider('Time', 24); } },
      { title: '5. Your turn', caption: '5/5 Your turn: Switch back to the living soaked seed at 36 hours to see the radicle root emerge.', cutaway: false, act: (s) => { s.selectTab(0, 1); s.setSlider('Time', 36); } },
    ],
    idealised: 'Respiration curves show representative Vigna radiata (moong bean) laboratory rates at 28 °C; individual seeds vary by coat thickness and age.',
  },

  seed_flame3d: {
    challenge: {
      prompt: 'Switch to "Living Seed Cell (ATP Engine)" and increase Metabolic rate above 1.2× to watch ATP packets shuttle energy from the enzyme hub to build the growing polymer chain.',
      check: (s) => s.tab(0) === 1 && s.num('Metabolic rate', 1) >= 1.2,
    },
    yourNumbers: (s) => {
      const mode = ['Side-by-side', 'Living Seed Cell', 'Candle Flame'][s.tab(0)] || 'Side-by-side';
      const rate = s.num('Metabolic rate', 1.0);
      return `View = ${mode} | Rate = ${rate.toFixed(1)}× | Flame: ~0% coupled to order (100% thermal) vs Seed cell: ~40% coupled into ATP (~30.5 kJ/mol per Pᵢ)`;
    },
    cutaway: 'Inside the mitochondrial enzyme complex: instead of letting oxygen slam directly into carbon at 1,000 °C, enzymes pass electrons down a stepped chain at 28 °C, using each small energy drop to cock the negatively charged triphosphate spring of ATP.',
    watch: [
      { title: '1. Wide view', caption: '1/5 Wide shot: Left, a candle flame shatters hydrocarbon fuel into hot, disordered gas; right, a seed cell channels fuel energy into ordered polymers.', act: (s) => { s.selectTab(0, 0); s.setSlider('Metabolic rate', 1.0); } },
      { title: '2. Close-up', caption: '2/5 Close-up: Zooming into the candle flame shows 100% of the chemical energy escaping as random kinetic motion.', act: (s) => s.selectTab(0, 2) },
      { title: '3. Cut-away', caption: '3/5 Cut-away: Inside the living cell, green catalytic enzymes step fuel energy into golden ATP springs without burning the cell.', cutaway: true, act: (s) => s.selectTab(0, 1) },
      { title: '4. Side-on trend', caption: '4/5 Trend: Speeding up metabolism dispatches more ATP packets per second to the blue DNA-guided assembly site.', act: (s) => { s.selectTab(0, 1); s.setSlider('Metabolic rate', 1.6); } },
      { title: '5. Your turn', caption: '5/5 Your turn: Rotate the 3D stage or switch between side-by-side, cell, and flame views.', cutaway: false, act: (s) => { s.selectTab(0, 0); s.setSlider('Metabolic rate', 1.0); } },
    ],
    idealised: 'Each glowing golden sphere represents a pool of thousands of ATP molecules diffusing across nanometre distances inside the cell.',
  },

  cell_inventory: {
    challenge: { prompt: 'Find a plant cell with mitochondria and no developed chloroplasts.', check: s => s.tab(0) === 2 },
    yourNumbers: s => `Specimen ${s.tab(0)+1} of 4 · enlarge each independently; no common image scale`,
    cutaway: 'A plant wall lies outside its cell membrane. Inside, ribosomes build proteins and mitochondria support ATP supply; neither job depends on the cell being green.',
    watch: [
      { title: '1. Shared machinery', caption: 'Animal cells have a membrane, cytoplasm, ribosomes, a nucleus and mitochondria.', act: s => s.selectTab(0,0) },
      { title: '2. Add the green parts', caption: 'A leaf cell also has a wall, a sap-filled vacuole and chloroplasts.', act: s => s.selectTab(0,1) },
      { title: '3. Inside an onion', caption: 'The white bulb cell keeps mitochondria despite having no developed chloroplasts.', cutaway: true, act: s => s.selectTab(0,2) },
      { title: '4. DNA without a nucleus', caption: 'A bacterium keeps DNA in its cytoplasm and still builds proteins at ribosomes.', cutaway: false, act: s => s.selectTab(0,3) },
      { title: '5. Explain the difference', caption: 'Compare the onion with the green leaf. Which job changes?', act: s => s.selectTab(0,2) },
    ],
    idealised: 'Each schematic is enlarged separately; membranes and ribosomes are oversized, and most molecular crowding is omitted.',
  },

  organelle_clues: {
    challenge: { prompt: 'Reveal all four groups of clues for a chloroplast and explain why shape alone is insufficient.', check: s => s.tab(0) === 1 && s.num('Clue groups',1) === 4 },
    yourNumbers: s => `${s.num('Clue groups',1)} of 4 clue groups · ${s.tab(0) ? 'chloroplast' : 'mitochondrion'} · evidence, not a probability score`,
    cutaway: 'The DNA shown is the organelle’s own inherited DNA. Many proteins it uses are encoded by genes now in the host nucleus, so present-day organelles depend on the cell around them.',
    watch: [
      { title: '1. A suggestive outline', caption: 'Two surrounding membranes are one clue, not proof.', act: s => { s.selectTab(0,0); s.setSlider('Clue groups',1); } },
      { title: '2. A second recipe', caption: 'Add DNA inside the compartment.', act: s => s.setSlider('Clue groups',2) },
      { title: '3. Internal machinery', caption: 'Add bacterial-related ribosomes; these enlarged dots stand for real molecular structures.', cutaway: true, act: s => s.setSlider('Clue groups',3) },
      { title: '4. Compare inheritance', caption: 'Division and comparative gene sequences strengthen the ancestry inference.', cutaway: false, act: s => s.setSlider('Clue groups',4) },
      { title: '5. Another bacterial branch', caption: 'Chloroplast genes trace their ancestry to cyanobacteria.', act: s => { s.selectTab(0,1); s.setSlider('Clue groups',4); } },
    ],
    idealised: 'The four clue groups organise evidence; they are not four equally weighted experiments or a replay of ancient engulfment.',
  },

  sav_cubes3d: {
    challenge: { prompt: 'Choose a 10 cm side and a 2 mm reached layer: how much of the volume remains untouched?', check: s => s.num('Side length',2) === 10 && Math.abs(s.num('Reached depth',.2)-.2) < .001 },
    yourNumbers: s => {
      const a=s.num('Side length',2), d=s.num('Reached depth',.2);
      const reached=100*(1-(Math.max(0,a-2*d)/a)**3);
      return `SA/V = 6 ÷ ${a} = ${(6/a).toFixed(2)} cm⁻¹ | reached volume = ${reached.toFixed(1)}% at chosen depth ${(d*10).toFixed(0)} mm`;
    },
    cutaway: 'The centre slice shows a square untouched core. Its full three-dimensional volume is max(side − 2 × depth, 0)³; the fraction reached uses that volume, not the coloured area of this slice.',
    watch: [
      { title: '1. The smaller cube', caption: 'A 1 cm cube has 6 cm² of surface for 1 cm³ of interior.', act: s => { s.setSlider('Side length',1); s.setSlider('Reached depth',.2); s.selectTab(0,0); } },
      { title: '2. Double the side', caption: 'A 2 cm cube has four times the surface and eight times the volume.', act: s => s.setSlider('Side length',2) },
      { title: '3. Slice through it', caption: 'A chosen 2 mm layer leaves an untouched core; depth is not elapsed time.', cutaway: true, act: s => s.selectTab(0,1) },
      { title: '4. Tenfold side', caption: 'The 10 cm cube has SA/V 0.6 cm⁻¹ and only 11.5% reached volume at the same depth.', cutaway: false, act: s => s.setSlider('Side length',10) },
      { title: '5. Test another depth', caption: 'Change depth and side independently. The 2D drawing keeps a fixed scale; the 3D view fills its frame.', act: s => { s.selectTab(0,0); s.setSlider('Reached depth',.3); } },
    ],
    idealised: 'A uniform sharp-front layer is a geometric assumption; real diffusion makes concentration gradients, and potato dye is not oxygen crossing a cell membrane.',
  },

  diffusion_membrane: {
    challenge: { prompt: 'Start with 50 particles per side, keep the divider permeable, then step the model. Explain why counts can change despite equal starting concentrations.', check: s => s.num('Initially left',80) === 50 && s.tab(0) === 0 && !s.readout().includes('Actual crossings: 0 rightward, 0 leftward;') },
    yourNumbers: s => `Initially left = ${s.num('Initially left',80)}; initially right = ${100-s.num('Initially left',80)} · total always 100 · actual crossing counts are below the drawing`,
    cutaway: 'The divider permits a crossing in either direction. Each step draws a new direction independently of concentration; no particle can inspect which side has more space.',
    watch: [
      {title:'1. Unequal start',caption:'80 left and 20 right in equal volumes make different concentrations.',act:s=>{s.setSlider('Initially left',80);s.selectTab(0,0);}},
      {title:'2. Block passage',caption:'A closed divider prevents transfer even though particles can still wander on their own side.',act:s=>s.selectTab(0,1)},
      {title:'3. Open both directions',caption:'The same opening permits both rightward and leftward crossings. Use Step 20 bounces to count them.',cutaway:true,act:s=>s.selectTab(0,0)},
      {title:'4. Equal start',caption:'50 on each side does not freeze the particles; each trial can fluctuate.',cutaway:false,act:s=>s.setSlider('Initially left',50)},
      {title:'5. Your count',caption:'Press Step 20 bounces several times. Compare total crossings with their signed difference.',act:s=>s.selectTab(0,0)},
    ],
    idealised:'100 tokens follow a two-dimensional fixed-step random walk; solvent collisions are implicit, distances and steps are uncalibrated, and equilibrium fluctuates.',
  },
  water_potential: {
    challenge:{prompt:'Balance inside and outside water potential while their solute contributions remain different.',check:s=>Math.abs(s.num('Inside pressure',0)-.5)<.001},
    yourNumbers:s=>`Inside = −0.80 + ${s.num('Inside pressure',0).toFixed(2)} = ${(-.8+s.num('Inside pressure',0)).toFixed(2)} MPa · outside = −0.30 MPa`,
    cutaway:'Positive internal pressure raises water potential. At +0.50 MPa it exactly balances this chosen solute difference; water still crosses both ways.',
    watch:[
      {title:'1. No added pressure',caption:'At zero pressure the inside has lower water potential, so net water entry is favoured.',act:s=>s.setSlider('Inside pressure',0)},
      {title:'2. Add pressure',caption:'Raising inside pressure reduces the difference driving net entry.',act:s=>s.setSlider('Inside pressure',.25)},
      {title:'3. Balance',caption:'−0.80 + 0.50 = −0.30 MPa: no net water transfer, without equal solutes.',cutaway:true,act:s=>s.setSlider('Inside pressure',.5)},
      {title:'4. Reverse',caption:'An imposed pressure above the balance can favour net water exit.',cutaway:false,act:s=>s.setSlider('Inside pressure',.75)},
      {title:'5. Find the balance',caption:'Move the control yourself and explain what changes the direction.',act:s=>s.setSlider('Inside pressure',.1)},
    ],
    idealised:'Chosen potentials are held fixed as pressure is varied independently; the model predicts direction, not evolving cell volume, concentration or time.',
  },
  osmosis_cells: {
    challenge:{prompt:'Choose concentrated surroundings and show the plant membrane separating from its wall.',check:s=>s.tab(0)===2&&s.num('Response stage',0)===4},
    yourNumbers:s=>`${['Dilute','Matching-solute','Concentrated'][s.tab(0)]} surroundings · stage ${s.num('Response stage',0)} of 4 · schematic, not minutes or measured volume`,
    cutaway:'The cellulose wall stays outside the cell membrane. The vacuole can lose water and shrink; sufficient water loss pulls the membrane-bound contents away from the wall.',
    watch:[
      {title:'1. Starting cells',caption:'Two cell envelopes are shown at different enlargements.',act:s=>{s.selectTab(0,0);s.setSlider('Response stage',0);}},
      {title:'2. Water enters',caption:'In dilute surroundings the animal swells; the plant presses against its wall.',act:s=>s.setSlider('Response stage',2)},
      {title:'3. A wall changes the outcome',caption:'The schematic animal endpoint is rupture; the plant builds opposing turgor pressure.',cutaway:true,act:s=>s.setSlider('Response stage',4)},
      {title:'4. Water leaves',caption:'Concentrated surroundings can shrink animal cells and plasmolyse plant cells.',cutaway:false,act:s=>s.selectTab(0,2)},
      {title:'5. Compare',caption:'Change surroundings at the same selected stage; explain which boundary supports pressure.',act:s=>s.selectTab(0,1)},
    ],
    idealised:'Shapes and stages are qualitative; no salt permeability, membrane mechanics, time course or measured volume is calculated, and the 3D solid denotes the membrane envelope.',
  },
  root_transport: {
    challenge:{prompt:'Follow the proton pump and cotransporter through the whole energy relay.',check:s=>s.num('Relay stage',0)===4},
    yourNumbers:s=>`Relay stage ${s.num('Relay stage',0)} of 4 · ATP powers proton export; the proton gradient can power nitrate entry · no ATP-per-nitrate ratio assigned`,
    cutaway:'The ATP-driven proton pump and the nitrate cotransporter are different proteins. Stored proton electrochemical energy connects their actions.',
    watch:[
      {title:'1. Separate routes',caption:'A proton pump and cotransporter span the root hair membrane.',act:s=>s.setSlider('Relay stage',0)},
      {title:'2. Spend chemical energy',caption:'ATP hydrolysis couples to proton export through the pump.',act:s=>s.setSlider('Relay stage',1)},
      {title:'3. Store a gradient',caption:'Export establishes a proton electrochemical gradient across the membrane.',cutaway:true,act:s=>s.setSlider('Relay stage',2)},
      {title:'4. Couple the return',caption:'Protons moving down that gradient can drive nitrate entry against its concentration gradient.',cutaway:false,act:s=>s.setSlider('Relay stage',3)},
      {title:'5. Explain the relay',caption:'Nitrate accumulation uses energy indirectly; water enters through its own water-potential gradient.',act:s=>s.setSlider('Relay stage',4)},
    ],
    idealised:'This is a manually stepped pathway diagram; it calculates neither ionic charge balance nor kinetic rates or fixed transport stoichiometry.',
  },

  enzyme_barrier: {
    challenge:{prompt:'Use matched chemistry, lower both hurdles by 35 chosen units, and reach stage 4 to regenerate the enzyme.',check:s=>s.interacted&&s.tab(0)===0&&s.num('Barrier lowering',35)===35&&s.num('Cycle stage',0)===4},
    yourNumbers:s=>`Forward barrier = 70 − ${s.tab(0)?0:s.num('Barrier lowering',35)}; reverse = 80 − ${s.tab(0)?0:s.num('Barrier lowering',35)}; net = −10 chosen units`,
    cutaway:'Complementary chemical groups position reactants and stabilise difficult arrangements. The contact symbols stand for interactions, not a rigid outline lock or atomic coordinates.',
    watch:[
      {title:'1. Same endpoints',caption:'Both routes start at 20 and finish at 10. The net change is −10 chosen units.',act:s=>{s.selectTab(0,0);s.setSlider('Barrier lowering',0);s.setSlider('Cycle stage',0);}},
      {title:'2. A lower route',caption:'Lowering the peak by 35 reduces forward and reverse barriers by the same amount.',act:s=>s.setSlider('Barrier lowering',35)},
      {title:'3. Temporary complex',caption:'Binding brings the substrate into a useful chemical environment.',cutaway:true,act:s=>s.setSlider('Cycle stage',1)},
      {title:'4. Change the chemistry',caption:'A similar outline with the wrong group need not support catalysis.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Cycle stage',2);}},
      {title:'5. Release and reuse',caption:'Return to matched chemistry, then release products and regenerate the enzyme.',act:s=>{s.selectTab(0,0);s.setSlider('Cycle stage',4);}},
    ],
    idealised:'Energies and geometry are chosen; progress is not time. No reaction rate, equilibrium shift or universal speed multiplier is calculated.',
  },
  enzyme_conditions: {
    challenge:{prompt:'Compare the heat-exposed sample at assay temperature 60 °C and pH 7.0. Explain why its rate is lower than the fresh comparison at the same settings.',check:s=>s.interacted&&s.tab(0)===1&&s.num('Assay temperature',20)===60&&s.num('Assay pH',7)===7},
    yourNumbers:s=>`${s.num('Assay temperature',20)} °C; pH ${s.num('Assay pH',7).toFixed(1)}; surviving share imposed = ${s.tab(0)?'0.15':'1.00'} · invented model`,
    cutaway:'Warming increases encounters while loss of functional structure can remove active enzyme. The pH factor describes activity, not a measured denatured fraction.',
    watch:[
      {title:'1. Cooler comparison',caption:'At 20 °C and pH 7, inspect a separately prepared fresh sample.',act:s=>{s.selectTab(0,0);s.setSlider('Assay temperature',20);s.setSlider('Assay pH',7);}},
      {title:'2. More encounters',caption:'At 40 °C more encounters increase the model rate while most enzyme remains active.',act:s=>s.setSlider('Assay temperature',40)},
      {title:'3. Shape loss matters',caption:'At 60 °C encounters are faster, but the chosen active fraction is much smaller.',cutaway:true,act:s=>s.setSlider('Assay temperature',60)},
      {title:'4. Compare pH',caption:'At the same temperature, altered pH reduces the chosen chemistry factor.',cutaway:false,act:s=>s.setSlider('Assay pH',5)},
      {title:'5. Fair residual-activity test',caption:'Compare a previously heat-exposed sample at the same assay pH and temperature. This is no recovery trajectory.',act:s=>{s.setSlider('Assay pH',7);s.selectTab(0,1);}},
    ],
    idealised:'No named enzyme is fitted. Parameters, fixed exposure and surviving share are invented; every setting is a new sample, not reversible damage or a human fever model.',
  },
  food_detective: {
    challenge:{prompt:'Choose iodine and valid controls, then actually run the comparison. What does U reveal?',check:s=>s.tab(0)===1&&s.tab(1)===0&&s.readout().startsWith('Comparison run. Iodine: Detected.')},
    yourNumbers:s=>`Test ${s.tab(0)+1} of 5 · three parallel portions: blank, known positive and unknown · no calibrated concentration`,
    cutaway:'A positive control checks that the reagent and method can detect the target; the blank checks for a misleading background. An invalid comparison leaves the unknown inconclusive.',
    watch:[
      {title:'1. Reducing sugar',caption:'Run Benedict’s with valid controls. This invented unknown stays blue.',act:s=>{s.selectTab(0,0);s.selectTab(1,0);s.clickBtn('Run comparison');}},
      {title:'2. Starch',caption:'Run iodine: the unknown gives blue-black while the blank does not.',act:s=>{s.selectTab(0,1);s.clickBtn('Run comparison');}},
      {title:'3. Peptide bonds',caption:'Run biuret: purple supports protein, without showing whether it is folded or active.',cutaway:true,act:s=>{s.selectTab(0,2);s.clickBtn('Run comparison');}},
      {title:'4. Extractable oil',caption:'Run the emulsion test. Compare cloudiness with the clear reagent blank.',cutaway:false,act:s=>{s.selectTab(0,3);s.clickBtn('Run comparison');}},
      {title:'5. Vitamin C',caption:'Run DCPIP, then deliberately fail the positive control and rerun. A negative unknown is then uninterpretable.',act:s=>{s.selectTab(0,4);s.clickBtn('Run comparison');}},
    ],
    idealised:'Unknown U and all outcomes are invented. Written observations replace colour measurement; extraction, sensitivity and matrix interference require real laboratory controls.',
  },
  carbon_account: {
    challenge:{prompt:'Choose two accounting batches and reach stage 4. Check each element on both sides.',check:s=>s.interacted&&s.num('Accounting batches',1)===2&&s.num('Account stage',0)===4},
    yourNumbers:s=>`${s.num('Accounting batches',1)} formal batches · atoms conserved · light is energy input`,
    cutaway:'Thylakoid reactions release oxygen from water and supply ATP and an electron carrier. Enzymes in the stroma incorporate carbon dioxide into small carbon products.',
    watch:[
      {title:'1. Absorb energy',caption:'Light transfers energy; it supplies no carbon atoms.',act:s=>{s.setSlider('Accounting batches',1);s.setSlider('Account stage',0);}},
      {title:'2. Water oxygen',caption:'Isotope evidence links released O₂ to water.',act:s=>s.setSlider('Account stage',1)},
      {title:'3. Carbon source',caption:'Carbon dioxide supplies carbohydrate carbon.',cutaway:true,act:s=>s.setSlider('Account stage',2)},
      {title:'4. Smaller products',caption:'Small three-carbon products supply larger carbohydrates.',cutaway:false,act:s=>s.setSlider('Account stage',3)},
      {title:'5. Conserve atoms',caption:'Double the fuller summary: double every material term, with water still on both sides.',act:s=>{s.setSlider('Accounting batches',2);s.setSlider('Account stage',4);}},
    ],
    idealised:'Formal glucose summaries, not single reactions or literal atom paths. No photon number, efficiency, measured yield or elapsed time is calculated.',
  },
  limiting_lab: {
    challenge:{prompt:'Clear trials. Capture L=20, CO₂=80, T=25 °C, then L=60 with the other two unchanged. Moving controls alone is not a trial.',check:s=>s.readout().includes('Controlled light comparison completed.')},
    yourNumbers:s=>`L=${s.num('Light capacity',20)}; CO₂=${s.num('CO₂ capacity',80)} chosen units; T=${s.num('Temperature',25)} °C`,
    cutaway:'The smallest of three invented capacities caps gross photosynthesis. The chosen oxygen-use baseline is subtracted to obtain net exchange. Real plants have interacting, smoother responses.',
    watch:[
      {title:'1. Capture a baseline',caption:'Record light capacity 20 with carbon capacity 80 at 25 °C.',act:s=>{s.clickBtn('Clear trials');s.setSlider('Light capacity',20);s.setSlider('CO₂ capacity',80);s.setSlider('Temperature',25);s.clickBtn('Capture trial');}},
      {title:'2. Change light only',caption:'Run the requested comparison: gross rises from 20 to 60.',act:s=>{s.setSlider('Light capacity',60);s.clickBtn('Capture trial');}},
      {title:'3. Carbon becomes limiting',caption:'At carbon capacity 20, more light cannot lift gross rate above 20.',cutaway:true,act:s=>s.setSlider('CO₂ capacity',20)},
      {title:'4. A third cap',caption:'At the chosen model temperature 45 °C the thermal capacity is zero. This is not a plant damage threshold.',cutaway:false,act:s=>s.setSlider('Temperature',45)},
      {title:'5. Respiration continues',caption:'In darkness gross oxygen production is zero; net exchange is negative because respiration continues.',act:s=>{s.setSlider('Temperature',25);s.setSlider('Light capacity',0);s.setSlider('CO₂ capacity',80);}},
    ],
    idealised:'R=min(L,C,max(0,100−((T−25)/2)²)); net=R−10, all invented relative units. Each setting is a new sample, not recovery; no calibrated bubbles, gas volume or universal optimum.',
  },
  sap_routes: {
    challenge:{prompt:'Follow stored carbohydrate upwards: choose Store → shoot phloem and reach stage 4.',check:s=>s.interacted&&s.tab(0)===2&&s.num('Transport stage',0)===4},
    yourNumbers:s=>`Route ${s.tab(0)+1} of 3 · explanatory stage ${s.num('Transport stage',0)} of 4 · no seconds or speed`,
    cutaway:'Xylem liquid is pulled under tension. Phloem sap flows down a pressure difference set up by loading, osmotic water entry and unloading. These are different mechanisms.',
    watch:[
      {title:'1. Evaporation first',caption:'Start at the moist leaf surfaces.',act:s=>{s.selectTab(0,0);s.setSlider('Transport stage',0);}},
      {title:'2. Transmit tension',caption:'Cohesion connects the pulled liquid to the xylem column.',act:s=>s.setSlider('Transport stage',3)},
      {title:'3. Replace water',caption:'Roots supply water along a decreasing total water-potential gradient.',cutaway:true,act:s=>s.setSlider('Transport stage',4)},
      {title:'4. Load a different tissue',caption:'In phloem, osmotic water entry raises source pressure.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Transport stage',1);}},
      {title:'5. Send sugars upwards',caption:'A storage organ can supply a growing shoot: source to sink is not always downward.',act:s=>{s.selectTab(0,2);s.setSlider('Transport stage',4);}},
    ],
    idealised:'Enlarged separate pathways; stages focus attention, not calibrated sap motion. Passive and active loading occur; no opposing bulk streams in a single sieve tube.',
  },
  respiration_relay: {
    challenge:{prompt:'Inspect stage 4 with O₂ available, then stage 4 under sustained O₂ absence. Explain what stops and why this does not mean all cellular ATP vanishes instantly.',check:s=>s.interacted&&s.tab(0)===1&&s.num('Relay stage',0)===4&&s.readout().includes('Both oxygen endpoints inspected.')},
    yourNumbers:s=>`${['O₂ available','Sustained O₂ absence'][s.tab(0)]} · focus stage ${s.num('Relay stage',0)} of 4 · no seconds, rpm or ATP yield`,
    cutaway:'The inner membrane separates matrix from intermembrane space. Electron transfer powers H⁺ export; return through a different protein drives rotor/shaft motion and shape changes in its stationary ATP-forming head. The head faces the matrix.',
    watch:[
      {title:'1. Collect electrons',caption:'Fuel reactions load carriers; carbon and electron routes are different.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Relay stage',0);}},
      {title:'2. Pump outwards',caption:'With O₂ available, electron transfer drives H⁺ from matrix to intermembrane space.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Relay stage',1);}},
      {title:'3. Keep a difference',caption:'Concentration and electric potential both contribute; the membrane must hold the difference.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Relay stage',2);}},
      {title:'4. Couple return to ATP',caption:'H⁺ returns towards the matrix through synthase; its rotor turns while catalytic shapes in its stationary head change.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Relay stage',4);}},
      {title:'5. Remove the terminal acceptor',caption:'Compare sustained O₂ absence after residual gradients dissipate. This aerobic relay stalls; glycolysis can still supply ATP if NAD⁺ is regenerated.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Relay stage',4);}},
    ],
    idealised:'Manual causal-focus snapshots overlap in life; enlarged geometry and H⁺ tokens do not encode counts. The absent-O₂ comparison is settled after residual gradient loss, with no kinetic clock, speed, fixed coupling ratio or yield.',
  },
  oxidation_ledger: {
    challenge:{prompt:'At 1.0 kg, inspect Total inputs and products and Original-fat allocation. Explain why about 0.842 kg assigned original fat is different from about 2.814 kg total CO₂.',check:s=>s.interacted&&s.tab(0)===1&&s.num('Fat oxidised',1)===1&&s.readout().includes('Both 1 kg accounts inspected.')},
    yourNumbers:s=>{const m=s.num('Fat oxidised',1);return `Sample ${m.toFixed(1)} kg · O₂ ${(m*2496/860).toFixed(4)} kg · total CO₂ ${(m*2420/860).toFixed(4)} kg · ${s.tab(0)?'original-fat allocation':'full input/product ledger'}`;},
    cutaway:'The full ledger includes incoming molecular oxygen. Separately, the paper assigns the original fat’s carbon and four of its six oxygen atoms to CO₂, and its hydrogen plus two oxygen atoms to water. Oxygen exchange with body water makes this an approximate accounting convention, not uniquely traced atom paths.',
    watch:[
      {title:'1. Include oxygen',caption:'One kilogram of representative fat combines with about 2.9023 kg O₂; total products are about 3.9023 kg.',cutaway:false,act:s=>{s.setSlider('Fat oxidised',1);s.selectTab(0,0);}},
      {title:'2. Scale the whole ledger',caption:'Two kilograms doubles every mass term, including incoming oxygen.',cutaway:false,act:s=>{s.setSlider('Fat oxidised',2);s.selectTab(0,0);}},
      {title:'3. Ask a different question',caption:'Return to one kilogram and allocate only the ORIGINAL fat: about 842 g to CO₂ and 158 g to water, usually rounded 840/160.',cutaway:true,act:s=>{s.setSlider('Fat oxidised',1);s.selectTab(0,1);}},
      {title:'4. Test zero sample',caption:'At zero fuel, oxygen input and both product masses are zero. Per-reaction atom coefficients describe the formal equation, not atoms in this empty sample.',cutaway:false,act:s=>{s.setSlider('Fat oxidised',0);s.selectTab(0,0);}},
      {title:'5. Compare the accounts',caption:'At one kilogram, total CO₂ is about 2.814 kg; only about 0.842 kg is assigned to the original fat in the separate convention.',cutaway:false,act:s=>{s.setSlider('Fat oxidised',1);s.selectTab(0,1);}},
    ],
    idealised:'Complete oxidation of representative C₅₅H₁₀₄O₆ uses nominal C12/H1/O16 masses. The approximately 84%/16% original-fat allocation assumes oxygen exchange; it is not the total product ratio, an isotope trace or a human mass-change model.',
  },
  carrier_routes: {
    challenge:{prompt:'Inspect carrier stage 4 in all three routes. Identify the electron recipient and explain why fermentation adds no ATP beyond glycolysis’s two net ATP.',check:s=>s.interacted&&s.num('Carrier stage',0)===4&&s.readout().includes('All three recycling endpoints inspected.')},
    yourNumbers:s=>`${['Aerobic','Yeast fermentation','Lactate fermentation'][s.tab(0)]} · stage ${s.num('Carrier stage',0)} of 4 · glycolysis: 4 − 2 = 2 net ATP per glucose`,
    cutaway:'NAD⁺ accepts electrons during glycolysis and becomes NADH. Passing those electrons onwards restores NAD⁺: the aerobic chain ultimately passes electrons to oxygen; fermentation passes them to organic recipients. Recycling permits glycolysis to continue and is a separate matter from ATP yield.',
    watch:[
      {title:'1. Supply an empty carrier',caption:'Glycolysis requires oxidised NAD⁺ to accept electrons from fuel.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Carrier stage',0);}},
      {title:'2. Load the carrier',caption:'Glucose becomes two pyruvates; NAD⁺ becomes NADH. Four ATP formed minus two invested is two net ATP.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Carrier stage',1);}},
      {title:'3. Aerobic recycling',caption:'The oxygen-linked electron chain restores NAD⁺ and supports additional ATP through the membrane relay, without a universal total.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Carrier stage',4);}},
      {title:'4. Yeast recycling',caption:'Electrons reach an organic recipient on the ethanol route. Two ethanol and two CO₂ per glucose; recycling adds no extra ATP.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Carrier stage',4);}},
      {title:'5. Lactate recycling',caption:'Pyruvate receives electrons to form lactate and restores NAD⁺. This route releases no CO₂; lactate can also form when O₂ is present.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Carrier stage',4);}},
    ],
    idealised:'Three manually selected route accounts compress compartments and omit proton-balanced NAD chemistry. No clock, gas volume, rate or total aerobic ATP yield is calculated; mixed idli communities are outside this comparison.',
  },
  digestive_steps: {
    challenge: { prompt: 'At stage 4, capture a product endpoint for each food. Compare the recorded products, then explain their different routes. The stamp records captures, not explanation accuracy.', check: s => s.interacted && s.readout().includes('Three endpoint routes captured for comparison.') },
    yourNumbers: s => `${['Starch','Protein','Triglyceride'][s.tab(0)]} · focus stage ${s.num('Digestive stage',0)} of 4 · no clock`,
    cutaway: 'The lumen-facing intestinal cell membrane carries final digestive enzymes and transport proteins. Making a product in the lumen and moving it across a membrane are different events. These stages select explanatory focus; real digestion overlaps.',
    watch: [
      {title:'1. Start starch',caption:'Salivary amylase begins producing maltose and shorter chains. It does not turn all starch straight into glucose.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Digestive stage',0);}},
      {title:'2. Change compartments',caption:'Stomach acid limits salivary amylase; it is not the same condition for every digestive enzyme.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Digestive stage',2);}},
      {title:'3. Start protein',caption:'Pepsin begins hydrolysing protein into peptides under acidic conditions. Later enzymes continue the work.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Digestive stage',2);}},
      {title:'4. Separate two fat changes',caption:'Bile stabilises droplets; pancreatic lipase and water change covalent connections.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Digestive stage',3);}},
      {title:'5. Reach an absorbable sugar',caption:'Brush-border enzymes include maltase, which turns maltose plus water into glucose. Capture endpoints yourself to compare foods.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Digestive stage',4);}},
    ],
    idealised: 'Three selected food routes, five manual focus states. Unit symbols omit atoms/end groups and are not a chemical mass ledger. No digestion clock, residence time or rate is calculated.',
  },
  emulsification: {
    challenge: { prompt: 'Capture two positive-volume geometry trials with the same reference radius and different division. Compare saved areas; the stamp records this controlled comparison, not the accuracy of an explanation.',check:s=>s.interacted && s.readout().includes('Controlled geometry comparison captured: same volume, different division.') },
    yourNumbers: s => {const R=s.num('Reference radius',3),k=s.num('Linear division',1);return `${R.toFixed(1)} mm reference · ${R>0?k**3:0} droplets · ${(4*Math.PI*R**2*k).toFixed(3)} mm² area · no rate`;},
    cutaway:'Each drawn circle projects a sphere. With fixed total fat volume, k³ equal droplets each have radius R/k. Total area becomes k times the reference area, not k³ times. Dispersing molecules among droplets does not hydrolyse those molecules.',
    watch:[
      {title:'1. Set a reference',caption:'A chosen 3 mm sphere has volume 36π mm³ and surface area 36π mm². These are invented model dimensions.',cutaway:false,act:s=>{s.setSlider('Reference radius',3);s.setSlider('Linear division',1);}},
      {title:'2. Make eight spheres',caption:'Linear division 2 gives eight equal droplets, radius 1.5 mm. Total area doubles; volume is unchanged.',cutaway:false,act:s=>{s.setSlider('Reference radius',3);s.setSlider('Linear division',2);}},
      {title:'3. Make sixty-four',caption:'Linear division 4 gives 64 spheres, radius 0.75 mm and four times the original area. It does not establish four times the biological rate.',cutaway:true,act:s=>{s.setSlider('Reference radius',3);s.setSlider('Linear division',4);}},
      {title:'4. Test no fat',caption:'Zero reference radius gives no droplets, zero volume and zero area; an area ratio would divide by zero, so it is not applicable.',cutaway:false,act:s=>{s.setSlider('Reference radius',0);s.setSlider('Linear division',6);}},
      {title:'5. Change the amount',caption:'A 2 mm reference with division 2 is a different fat volume from the 3 mm reference. Do not call that a controlled fixed-volume comparison.',cutaway:false,act:s=>{s.setSlider('Reference radius',2);s.setSlider('Linear division',2);}},
    ],
    idealised:'All equal spheres are shown as a spread-out projection, with chosen millimetre dimensions and conserved 3D volume. Real droplets vary in size/shape. No molecular hydrolysis, enzyme kinetics or digestion-rate multiplier is inferred.',
  },
  absorption_routes: {
    challenge:{prompt:'At stage 4 with positive supply, capture glucose and long-chain lipid endpoints. Compare their saved destinations. The stamp records endpoint captures, not explanation accuracy.',check:s=>s.interacted&&s.readout().includes('Glucose and long-chain lipid endpoints captured.')},
    yourNumbers:s=>`${['Glucose','Long-chain lipid material','Shorter-chain fatty acids'][s.tab(0)]} · focus ${s.num('Absorption stage',0)} of 4 · ${s.num('Marked portions',3)} abstract material portions`,
    cutaway:'Crossing the epithelium requires entry through the lumen-facing membrane, processing where needed, and exit through the tissue-facing side. Glucose entry can use the sodium gradient maintained by an ATP-driven pump. Long-chain lipid products are rebuilt and packaged before lymph transport. Bulk flow in vessels follows these membrane events.',
    watch:[
      {title:'1. Arrive at a barrier',caption:'The glucose is still in the lumen. Small size alone does not explain its movement across a lipid membrane.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Absorption stage',0);s.setSlider('Marked portions',3);}},
      {title:'2. Use an ion gradient',caption:'Sodium-coupled glucose entry depends indirectly on ATP used by the tissue-facing ion pump. Glucose exits through a separate transporter.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Absorption stage',1);s.setSlider('Marked portions',3);}},
      {title:'3. Carry glucose onwards',caption:'After epithelial exit and capillary entry, portal blood carries glucose to the liver. A vessel flow arrow is not a membrane pump.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Absorption stage',4);s.setSlider('Marked portions',3);}},
      {title:'4. Compare long-chain material',caption:'Cells rebuild fat and make chylomicrons. These packages travel through lacteals and lymph to blood near the heart; original droplets and micelles do not.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Absorption stage',4);s.setSlider('Marked portions',3);}},
      {title:'5. Keep an exception',caption:'Some shorter-chain fatty acids take the portal blood route. The route diagram remains meaningful at zero supply, but all material compartments are empty.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Absorption stage',4);s.setSlider('Marked portions',0);}},
    ],
    idealised:'Manual focus states track abstract marked material, not unchanged molecules or a timed transport process. No permeability, tissue damage, absorption efficiency or transit time is modelled. Zero supply gives zero marked portions in every compartment.',
  },
  breathing_gradients: {
    challenge:{prompt:'Capture one shallow rapid trial (250 mL × 24 breaths/min) and one quiet resting trial (500 mL × 12 breaths/min). Explain why both move 6.0 L/min in total yet deliver different fresh alveolar ventilation.',check:s=>s.interacted&&s.readout().includes('Equal minute ventilation, different alveolar ventilation: deeper breaths waste less dead space.')},
    yourNumbers:s=>{const vt=s.num('Tidal volume',500),r=s.num('Breathing rate',12),ve=(vt*r/1000).toFixed(1),va=(Math.max(0,vt-150)*r/1000).toFixed(1);return `${['Quiet inhalation','Quiet exhalation','Forced / exercise','Bell-jar check'][s.tab(0)]} · V_T ${vt} mL × ${r}/min · total ${ve} L/min · alveolar ${va} L/min`;},
    cutaway:'Air is never pulled by suction. During inhalation, diaphragm and external intercostal contraction expands thoracic volume, lowering alveolar pressure slightly below atmospheric pressure (−1 mmHg) so outside air pushes in. In every breath, about 150 mL stays in the conducting airway dead space (trachea, bronchi, bronchioles) where no gas exchange occurs.',
    watch:[
      {title:'1. Quiet inhalation',caption:'External intercostals lift the ribs up and out while the diaphragm flattens downward. Alveolar pressure dips to −1 mmHg and outside air pushes in.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Tidal volume',500);s.setSlider('Breathing rate',12);}},
      {title:'2. Quiet exhalation',caption:'Muscles relax and elastic recoil shrinks lung volume, raising alveolar pressure to +1 mmHg while pleural pressure stays negative (−4 mmHg).',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Tidal volume',500);s.setSlider('Breathing rate',12);}},
      {title:'3. Test shallow rapid breathing',caption:'At 250 mL × 24 breaths/min, total ventilation is still 6.0 L/min, but 150 mL dead space per breath leaves only 2.4 L/min of fresh alveolar air.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Tidal volume',250);s.setSlider('Breathing rate',24);}},
      {title:'4. Exercise and brain CO₂ control',caption:'Active muscles release more CO₂ into blood; the brain detects rising blood CO₂ and increases both rate and depth of breathing.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Tidal volume',1500);s.setSlider('Breathing rate',30);}},
      {title:'5. Bell-jar model honesty check',caption:'Pulling the bottom rubber sheet lowers internal pressure like the diaphragm, but rigid jar walls cannot swing like ribs and the wide air gap is not a thin fluid-coupled pleural cavity.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Tidal volume',500);s.setSlider('Breathing rate',12);}},
    ],
    idealised:'Representative sea-level gauge pressures and a fixed 150 mL anatomical dead space illustrate Boyle’s-law bulk flow and partial-pressure diffusion. Adult two-lung alveolar counts (~300–500 million, Ochs et al. 2004 mean 480 million) vary widely with lung size and age.',
  },
  double_pump: {
    challenge:{prompt:'Capture one Intact double pump state (tab 0) and one Post-natal VSD case state (tab 2). Explain why a hole in the post-natal ventricular septum pushes oxygenated blood left-to-right back into the lungs rather than sending deoxygenated blood into the aorta.',check:s=>s.interacted&&s.readout().includes('Intact and post-natal VSD states captured for comparison.')},
    yourNumbers:s=>{const hr=s.num('Heart rate',70),sv=s.num('Stroke volume',60),co=(hr*sv/1000).toFixed(2);return `${['Intact double pump','Harvey 1628 vs Modern','Post-natal VSD','Fish single circuit'][s.tab(0)]} · stage ${s.num('Circuit stage',0)} · ${hr} bpm × ${sv} mL = ${co} L/min`;},
    cutaway:'Both ventricles pump the same volume per minute in series when the septum is intact, but the left ventricular wall is about three times thicker than the right so it can generate ~120 mmHg for the long systemic circuit while the right ventricle generates ~25 mmHg to protect thin alveolar capillaries. Because LV pressure far exceeds RV pressure after birth, an uncomplicated ventricular septal defect shunts oxygenated blood left-to-right.',
    watch:[
      {title:'1. Enter the right heart',caption:'Deoxygenated blood from the venae cavae enters the thin-walled right atrium and passes through the tricuspid valve into the right ventricle.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Circuit stage',1);s.setSlider('Heart rate',70);s.setSlider('Stroke volume',60);}},
      {title:'2. Gentle lung loop vs high-pressure body loop',caption:'The right ventricle pumps through the pulmonary artery at ~25 mmHg; oxygenated blood returns via pulmonary veins to the thick-walled left ventricle (~120 mmHg).',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Circuit stage',4);s.setSlider('Heart rate',70);s.setSlider('Stroke volume',60);}},
      {title:'3. Harvey 1628 vs modern cardiac output',caption:'In Frankfurt (1628), Harvey showed even 1 drachm per beat over 1,000 beats in 30 min equals 10 lb 5 oz; our modern 70 bpm × 60 mL example gives 4.20 L/min.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Circuit stage',4);s.setSlider('Heart rate',70);s.setSlider('Stroke volume',60);}},
      {title:'4. Post-natal VSD left-to-right shunt',caption:'Because LV systolic pressure (~115 mmHg) far exceeds RV pressure (~35 mmHg), oxygenated blood jets left-to-right into the RV and recycles through the lungs (Qp > Qs).',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Circuit stage',2);s.setSlider('Heart rate',70);s.setSlider('Stroke volume',60);}},
      {title:'5. Fish single circulation comparison',caption:'In a fish, blood passes from the heart through gill capillaries directly to body capillaries without a second pump, so systemic pressure is much lower.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Circuit stage',2);s.setSlider('Heart rate',70);s.setSlider('Stroke volume',60);}},
    ],
    idealised:'Steady-state series haemodynamics and representative chamber pressures. Harvey’s 1628 Troy/apothecaries’ lower-bound arithmetic is kept distinct from the chosen modern metric calculation (HR × SV).',
  },
  vessel_exchange: {
    challenge:{prompt:'Capture Aorta (segment 0) and Capillary bed (segment 3). Explain why blood slows down ~1,000-fold in capillaries even though each individual capillary is microscopic.',check:s=>s.interacted&&s.readout().includes('Aorta and Capillary bed states captured for comparison.')},
    yourNumbers:s=>{const seg=s.num('Vessel segment',0),co=s.num('Cardiac output',4.9),areas=[4.5,20,400,4500,4000,40,18],names=['Aorta','Arteries','Arterioles','Capillaries','Venules','Veins','Vena cava'];return `${names[seg]} · A_total ${areas[seg]} cm² · v ${((co*1000/60)/areas[seg]*10).toFixed(3)} mm/s · CO ${co.toFixed(1)} L/min`;},
    cutaway:'A single capillary is only ~8 µm wide, but billions of capillaries arranged in parallel have a combined cross-sectional area of ~4,500 cm²—roughly 1,000 times the aorta’s 4.5 cm². By continuity (v = Q / A_total), blood crawls at ~0.2 mm/s, giving time for oxygen and nutrient exchange across the one-cell-thick wall.',
    watch:[
      {title:'1. High-pressure elastic aorta',caption:'Thick muscular and elastic walls withstand ~120/80 mmHg surges and recoil to keep blood moving fast (~181 mm/s at 4.9 L/min) through a 4.5 cm² lumen.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Vessel segment',0);s.setSlider('Cardiac output',4.9);}},
      {title:'2. Billions of parallel capillaries',caption:'Total cross-sectional area balloons to ~4,500 cm², dropping speed to ~0.18 mm/s across a one-cell-thick endothelial wall.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Vessel segment',3);s.setSlider('Cardiac output',4.9);}},
      {title:'3. Tissue fluid and lymphatic return',caption:'Hydrostatic pressure filters water and small solutes out at the arterial end; osmosis reabsorbs ~85% at the venous end and lymphatics return ~15% as lymph.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Vessel segment',3);s.setSlider('Cardiac output',4.9);}},
      {title:'4. Low-pressure veins with valves',caption:'Veins have thinner walls, wide lumens and semilunar valves that prevent low-pressure blood from flowing backward.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Vessel segment',5);s.setSlider('Cardiac output',4.9);}},
      {title:'5. Platelets and the fibrin mesh',caption:'At a wound, platelets trigger the conversion of soluble fibrinogen into insoluble fibrin threads that trap red blood cells to stop bleeding and block pathogens.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Vessel segment',3);s.setSlider('Cardiac output',4.9);}},
    ],
    idealised:'Continuity velocity v = Q / A_total uses representative adult total cross-sectional areas and Starling filtration/reabsorption pressures. Individual vessels and capillary beds vary dynamically with arteriole smooth-muscle tone.',
  },
  reflex_action_potential: {
    challenge:{prompt:'Capture one Myelinated reflex arc trial (tab 0) and one Unmyelinated axon loop (tab 1), Voluntary ruler catch (tab 2), or Siddiqi para^ts blocked trial at ≥30 °C (tab 3). Explain why myelination or a spinal reflex loop cuts total response latency.',check:s=>s.interacted&&s.readout().includes('Contrasting reflex/conduction pathways captured for comparison.')},
    yourNumbers:s=>{const d=s.num('Axon diameter',12),t=s.num('Temperature',25),m=s.tab(0),names=['Myelinated reflex','Unmyelinated loop','Voluntary ruler catch','Siddiqi para^ts'];return `${names[m]} · ${d} µm · ${t} °C`;},
    cutaway:'A neurone is not a copper wire: no free electrons flow down the axon. Instead, Skou’s Na⁺/K⁺-ATPase pump uses ATP to keep Na⁺ high outside and K⁺ high inside (−70 mV rest). When depolarised to threshold (−55 mV), voltage-gated Na⁺ channels open so Na⁺ rushes in (+30 mV peak), followed by K⁺ channels opening to repolarise the membrane. In Obaid Siddiqi’s para^ts Drosophila mutant, warming above 30 °C reversibly silences the voltage-gated Na⁺ channels.',
    watch:[
      {title:'1. Fast myelinated spinal reflex',caption:'In a 12 µm myelinated nerve at 25 °C, the impulse jumps between nodes of Ranvier at 72 m/s, completing the 1.3 m spinal withdrawal loop in ~35.9 ms.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Axon diameter',12);s.setSlider('Temperature',25);}},
      {title:'2. Remove the myelin sheath',caption:'Without Schwann-cell myelin insulation, every patch of membrane must depolarise in sequence (~5.0 m/s at 12 µm), stretching total reflex time to ~276.6 ms.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Axon diameter',12);s.setSlider('Temperature',25);}},
      {title:'3. Compare voluntary ruler-drop reaction',caption:'Catching a falling ruler routes through the retina, visual cortex and motor cortex (+135 ms brain processing), giving ~175 ms total latency (~15 cm ruler drop).',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Axon diameter',12);s.setSlider('Temperature',25);}},
      {title:'4. Siddiqi’s para^ts fly at 22 °C',caption:'At a permissive 22 °C, the temperature-sensitive para^ts sodium channels fold and open normally, firing full +30 mV action potentials.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Axon diameter',12);s.setSlider('Temperature',22);}},
      {title:'5. Reversible thermal block at 32 °C',caption:'Warming the para^ts mutant to 32 °C disables its voltage-gated Na⁺ channels: the spike vanishes while the resting potential stays at −70 mV.',cutaway:true,act:s=>{s.selectTab(0,3);s.setSlider('Axon diameter',12);s.setSlider('Temperature',32);}},
    ],
    idealised:'Uses empirical vertebrate scaling for myelinated (v ≈ 6d) and unmyelinated (v ≈ 1.45√d) conduction velocity across a 1.3–1.4 m path length, and models the Siddiqi & Benzer (1976) para^ts thermal conduction block at 30 °C.',
  },
  synapse_transmission: {
    challenge:{prompt:'Capture one Forward (Pre → Post) trial that stimulates a postsynaptic impulse and one Reverse test (Post → Pre) trial. Explain how the location of vesicles and receptor proteins enforces one-way conduction.',check:s=>s.interacted&&s.readout().includes('Contrasting synapse transmission states captured for comparison.')},
    yourNumbers:s=>{const f=s.num('Stimulus frequency',40),w=s.num('Synaptic gap width',20),m=s.tab(0),names=['Forward (Pre→Post)','Reverse (Post→Pre)','Receptor blocker','Enzyme block'];return `${names[m]} · ${f} Hz · ${w} nm gap`;},
    cutaway:'Cambridge 0610 Supplement four-step synapse sequence: (1) an arriving electrical impulse stimulates presynaptic vesicles to release neurotransmitter molecules into the synaptic gap, (2) neurotransmitter diffuses across the ~20 nm gap down its concentration gradient, (3) neurotransmitter binds with complementary receptor proteins on the postsynaptic membrane, and (4) an electrical impulse is stimulated in the next neurone. Because vesicles are only presynaptic and receptors are only postsynaptic, impulses travel in one direction only.',
    watch:[
      {title:'1. Normal forward synaptic relay',caption:'At 40 Hz across a 20 nm cleft, 5 vesicles release neurotransmitter, binding 55% of postsynaptic receptors and depolarising the next neurone past −55 mV threshold.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Stimulus frequency',40);s.setSlider('Synaptic gap width',20);}},
      {title:'2. Inside the four-step chemical relay',caption:'Neurotransmitter crosses the 20 nm cleft by diffusion in less than a microsecond; the ~0.7 ms synaptic delay comes mainly from Ca²⁺ entry, vesicle fusion and receptor gating.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Stimulus frequency',60);s.setSlider('Synaptic gap width',20);}},
      {title:'3. Test reverse stimulation (Post → Pre)',caption:'Stimulating the postsynaptic neurone first releases zero neurotransmitter because the postsynaptic dendrite has no synaptic vesicles and the presynaptic knob lacks the matching receptors.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Stimulus frequency',60);s.setSlider('Synaptic gap width',20);}},
      {title:'4. Competitive receptor blockade (curare)',caption:'When curare occupies 85% of postsynaptic receptors, vesicles still release neurotransmitter across the gap, but receptor binding stays below the −55 mV threshold.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Stimulus frequency',60);s.setSlider('Synaptic gap width',20);}},
      {title:'5. Breakdown enzyme inhibition',caption:'Blocking acetylcholinesterase leaves neurotransmitter trapped in the cleft, keeping postsynaptic receptors bound and preventing the synapse from resetting.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Stimulus frequency',40);s.setSlider('Synaptic gap width',20);}},
    ],
    idealised:'Models quantal vesicle release (~5,000 neurotransmitter molecules per vesicle) and 1D diffusion across a 15–60 nm synaptic cleft without stochastic single-channel fluctuations.',
  },
  eye_accommodation_tropism: {
    challenge:{prompt:'Capture one Near object focus (≤60 cm) and one Distant object focus (≥200 cm) in tab 0 (or two contrasting light/tropism states). Explain why contracting the circular ciliary muscle slackens the suspensory ligaments instead of pulling them tight.',check:s=>s.interacted&&s.readout().includes('Contrasting accommodation or tropism states captured for comparison.')},
    yourNumbers:s=>{const d=s.num('Object distance',35),l=s.num('Light intensity',75),m=s.tab(0),names=['Accommodation','Pupil reflex','Shoot phototropism','Gravitropism'];return `${names[m]} · dist ${d} cm · light ${l}%`;},
    cutaway:'The ciliary muscle is a circular sphincter ring around the lens. When it contracts for a near object, the ring narrows inward toward the lens, slackening the suspensory ligaments so the elastic lens springs thicker and more convex (+54 D total power). When it relaxes for a distant object, eyeball pressure widens the ring, pulling the suspensory ligaments tight and stretching the lens thinner and flatter (~50 D).',
    watch:[
      {title:'1. Near focus on a book (25 cm)',caption:'Diverging rays from 25 cm require 54.0 D total power (cornea 38.0 D + lens 16.0 D): ciliary muscles contract, suspensory ligaments slacken, and the elastic lens thickens to 4.6 mm.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Object distance',25);s.setSlider('Light intensity',70);}},
      {title:'2. Distant focus across the sea (400 cm)',caption:'Nearly parallel rays require only 50.25 D: ciliary muscles relax, suspensory ligaments are pulled tight, and the lens flattens to 3.62 mm.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Object distance',400);s.setSlider('Light intensity',70);}},
      {title:'3. Antagonistic iris muscles in bright light',caption:'At 90% light intensity, circular iris muscles contract and radial muscles relax, constricting the pupil to 2.55 mm to protect the retina while foveal cones resolve colour.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Object distance',100);s.setSlider('Light intensity',90);}},
      {title:'4. Shoot phototropism and shaded-side auxin',caption:'Under unilateral light (80%), auxin made in the shoot tip accumulates on the shaded side (68% vs 32% lit), stimulating shaded cells to elongate faster and bending the shoot +32.4° towards light.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Object distance',100);s.setSlider('Light intensity',80);}},
      {title:'5. Horizontal seedling gravitropism',caption:'Gravity concentrates auxin on the lower side (68%): in the shoot, high auxin stimulates elongation (+32.4° upward); in the root, high auxin inhibits elongation (−27.0° downward).',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Object distance',100);s.setSlider('Light intensity',80);}},
    ],
    idealised:'Optical power uses the thin-lens equation for a 20 mm reduced eye (cornea fixed at 38 D, lens variable 12–16 D); coleoptile auxin distribution follows Went (1926) lateral transport ratios.',
  },
  glucose_thermoregulation: {
    challenge:{prompt:'Capture one hot or high-humidity state and one cold or contrasting glucose state (e.g. Dadar May 38 °C vs Cold room 15 °C, or Mango meal vs Fasting). Explain why arterioles vasodilate or vasoconstrict while capillaries stay fixed in position, or how insulin and glucagon oppose drifts from 5.0 mmol/L.',check:s=>s.interacted&&s.readout().includes('Contrasting thermoregulation or glucose feedback states captured for comparison:')},
    yourNumbers:s=>{const t=s.num('Ambient temperature',38),p=s.num('Humidity or meal',65),m=s.tab(0),names=['Skin thermoregulation','Mumbai humidity','Glucose feedback','Type 1 diabetes'];return `${names[m]} · ${t} °C · ${p}%`;},
    cutaway:'Cambridge 0610 negative feedback around a set point: the brain (hypothalamus at 37.0 °C) coordinates sweat glands, skeletal muscle shivering, hair erector muscles and smooth muscle in the arterioles supplying skin surface capillaries (capillaries themselves never move toward or away from the surface). In blood glucose control (set point ~5.0 mmol/L), pancreatic islet beta cells secrete insulin to stimulate liver glucose-to-glycogen storage, whereas alpha cells secrete glucagon to stimulate liver glycogen-to-glucose breakdown.',
    watch:[
      {title:'1. Dadar afternoon heat (38 °C, 65% RH)',caption:'Arterioles supplying skin surface capillaries vasodilate (145.5% diameter) while sweat glands secrete 420 g/h; evaporation removes latent heat (2,420 J/g) to hold core temperature near 37 °C.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Ambient temperature',38);s.setSlider('Humidity or meal',65);}},
      {title:'2. Cold room (15 °C) heat conservation',caption:'Skin arterioles vasoconstrict (64% diameter) so less warm blood enters fixed surface capillaries, hairs stand upright, sweat stops, and skeletal muscle shivering generates +96 W of heat.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Ambient temperature',15);s.setSlider('Humidity or meal',45);}},
      {title:'3. High Mumbai humidity (38 °C, 85% RH)',caption:'Damp air slows sweat evaporation so most secreted sweat drips off without removing latent heat, causing net core heat storage.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Ambient temperature',38);s.setSlider('Humidity or meal',85);}},
      {title:'4. Pancreatic insulin & glucagon loop',caption:'After a sweet mango meal (85% load), pancreatic beta cells secrete insulin so the liver converts glucose into insoluble glycogen; during fasting (15% load), alpha cells secrete glucagon.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Ambient temperature',30);s.setSlider('Humidity or meal',85);}},
      {title:'5. Type 1 diabetes and insulin injection rescue',caption:'Without insulin (30% slider), plasma glucose climbs above the kidney transport maximum (10.5 mmol/L) and spills into urine; injected insulin (75% slider) restores normal liver storage.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Ambient temperature',30);s.setSlider('Humidity or meal',75);}},
    ],
    idealised:'Steady-state thermal energy balance (metabolic generation, dry transfer and evaporative latent heat at 2,420 J/g) and two-hormone pancreatic negative feedback around a 5.0 mmol/L plasma glucose set point.',
  },
  nephron_filtration: {
    challenge:{prompt:'Capture one Normal hydration state (5 mmol/L plasma glucose) and one Untreated hyperglycaemia state (16 mmol/L) or Dehydrated afternoon state. Explain why glucose appears in urine at 16 mmol/L even though the glomerular protein barrier is completely intact.',check:s=>s.interacted&&s.readout().includes('Contrasting nephron filtration and reabsorption states captured for comparison:')},
    yourNumbers:s=>{const g=s.num('Plasma glucose',5),f=s.num('GFR filtration rate',125),m=s.tab(0),names=['Normal hydration','Mumbai dehydration','High-protein meal','Hyperglycaemia'];return `${names[m]} · glucose ${g} mmol/L · GFR ${f} mL/min`;},
    cutaway:'Each kidney nephron works in two stages across the cortex and medulla: (1) High blood pressure in the glomerulus filters water, glucose, urea and ions into the renal capsule (~180 L/day) while retaining red blood cells and plasma proteins (0.0 g/100mL in filtrate); (2) The renal tubule selectively reabsorbs 100% of glucose (up to T_m ≈ 10.5 mmol/L), most water (via aquaporins) and needed ions back into blood, leaving urea, excess water and excess ions to form urine in the collecting duct.',
    watch:[
      {title:'1. Glomerular ultrafiltration (125 mL/min)',caption:'At normal hydration (5 mmol/L plasma glucose), two kidneys filter 180 L/day into renal capsules while keeping all plasma proteins (8.0 g/100mL) inside the blood.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Plasma glucose',5);s.setSlider('GFR filtration rate',125);}},
      {title:'2. Selective reabsorption of 100% glucose',caption:'In the proximal renal tubule, ATP-supported sodium–glucose carriers rescue 100% of filtered glucose (162 g/day) and ~99.2% of water, leaving 0.0 g/100mL glucose in 1.5 L/day urine.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Plasma glucose',5);s.setSlider('GFR filtration rate',125);}},
      {title:'3. Hot Mumbai afternoon water rescue',caption:'During sweating and dehydration, collecting-duct aquaporin channels increase water reabsorption to 99.55%, cutting urine volume to ~0.75 L/day and concentrating urea ~128-fold.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Plasma glucose',5);s.setSlider('GFR filtration rate',120);}},
      {title:'4. High-protein meal and liver deamination',caption:'Liver deamination of excess amino acids doubles plasma urea (0.06 g/100mL); the nephron excretes 60.5 g/day of urea while still rescuing 100% of filtered glucose.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Plasma glucose',5);s.setSlider('GFR filtration rate',125);}},
      {title:'5. Hyperglycaemia above renal T_m (16 mmol/L)',caption:'When untreated Type 1 diabetes raises filtrate glucose to 16 mmol/L, proximal tubule carriers saturate at 10.5 mmol/L; the un-reabsorbed 5.5 mmol/L spills into urine and pulls water with it by osmosis (3.81 L/day).',cutaway:true,act:s=>{s.selectTab(0,3);s.setSlider('Plasma glucose',16);s.setSlider('GFR filtration rate',125);}},
    ],
    idealised:'Two-kidney adult mass balance (GFR 80–140 mL/min, proximal glucose transport maximum T_m = 10.5 mmol/L, 44% passive medullary urea recycling) matching Wearn & Richards (1924) micropuncture evidence.',
  },
  immunity_vaccine_memory: {
    challenge:{prompt:'Capture one Primary response or Passive state and one Vaccinated secondary memory state (or Matching vs Mismatched antigen state). Explain how memory cells or complementary antigen shape change the speed, height and duration of protection.',check:s=>s.interacted&&s.readout().includes('Contrasting immunity or oral rehydration states captured for comparison:')},
    yourNumbers:s=>{const d=s.num('Days post-exposure',14),l=s.num('Memory or ORS dose',80),m=s.tab(0),names=['Primary vs Memory','Antigen specificity','Active vs Passive','Cholera vs ORS'];return `${names[m]} · Day ${d} · level ${l}%`;},
    cutaway:'Specific active immunity depends on complementary 3D shape: lymphocytes carry receptors matching a pathogen’s specific antigen, divide, and secrete protein antibodies that either destroy pathogens directly or mark them for phagocytes, while leaving long-lived memory cells. Passive immunity (placenta, breast milk, antivenom) supplies borrowed antibodies for immediate short-term cover but produces zero memory cells.',
    watch:[
      {title:'1. Primary response on first exposure (0% memory)',caption:'Without prior memory cells, naive lymphocytes take ~5 days to divide and reach a modest peak of 28 AU at Day 14—below the 40 AU protective threshold.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Days post-exposure',14);s.setSlider('Memory or ORS dose',0);}},
      {title:'2. Post-vaccine secondary response (90% memory)',caption:'After vaccination with weakened pathogen or antigen, memory cells respond within 1 day and surge to 220.2 AU by Day 7, clearing the pathogen before illness.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Days post-exposure',7);s.setSlider('Memory or ORS dose',90);}},
      {title:'3. Antigen–antibody lock-and-key specificity',caption:'Antibodies made against Antigen A have a complementary binding site for A only; against unrelated Pathogen B (20% slider), binding is 0% and a new primary response is needed.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Days post-exposure',7);s.setSlider('Memory or ORS dose',20);}},
      {title:'4. Passive immunity decay (no memory cells)',caption:'Maternal antibodies across the placenta or in breast milk protect immediately at Day 0 (80 AU at 20% slider) but decay with a ~21-day half-life and leave zero memory cells.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Days post-exposure',28);s.setSlider('Memory or ORS dose',20);}},
      {title:'5. Cholera Cl⁻ toxin vs Oral Rehydration Solution',caption:'Cholera toxin drives Cl⁻ secretion into the small intestine so water leaves blood by osmosis; ORS (water + NaCl + glucose at 80% dose) uses intact Na⁺–glucose cotransport to pull +124 mL/h net water back into blood.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Days post-exposure',2);s.setSlider('Memory or ORS dose',80);}},
    ],
    idealised:'Deterministic primary/secondary lymphocyte kinetics, exponential passive IgG catabolism (t₁/₂ = 21 days), and small-intestinal Na⁺–glucose cotransport vs cholera-toxin Cl⁻ secretion.',
  },
  dna_base_pairing: {
    challenge:{prompt:'Capture two contrasting DNA double-helix or Chargaff states (e.g. Human 30% A vs GC-rich 15% A, or a Complementary rung vs a Purine bulge test). Explain how complementary pairing (A=T, C≡G) enforces Chargaff’s rules and keeps the double helix a uniform 2.0 nm wide.',check:s=>s.interacted&&s.readout().includes('Contrasting DNA double-helix and Chargaff states captured for comparison:')},
    yourNumbers:s=>{const a=s.num('Adenine percentage',30),r=s.num('Inspected base pair',6),m=s.tab(0),names=['Beta-globin HBB','Chargaff ledger','Photo 51 geometry','Mismatch test'];return `${names[m]} · ${a}% A · Rung ${r}`;},
    cutaway:'Cambridge 0610 Topic 4.1 DNA structure: two sugar–phosphate strands coil into a double helix (2.0 nm wide, 3.4 nm per 10-base-pair turn, 0.34 nm step in Rosalind Franklin’s Photo 51). Cross-links are formed by pairs of bases that always pair A with T (2 hydrogen bonds) and C with G (3 hydrogen bonds). Because a two-ring purine (A or G) always pairs with a one-ring pyrimidine (T or C), every rung spans 2.0 nm and %A = %T, %G = %C.',
    watch:[
      {title:'1. Human beta-globin HBB double helix (30% A)',caption:'Two antiparallel strands coil around a central axis with complementary A=T (2 H-bonds) and C≡G (3 H-bonds) rungs spanning a uniform 2.00 nm diameter.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Adenine percentage',30);s.setSlider('Inspected base pair',6);}},
      {title:'2. Erwin Chargaff’s base-ratio equivalence (30% A)',caption:'When Adenine is 30.0%, complementary Thymine must also be 30.0% (60% A+T), leaving 40.0% split equally between Guanine (20.0%) and Cytosine (20.0%).',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Adenine percentage',30);s.setSlider('Inspected base pair',6);}},
      {title:'3. GC-rich bacterial DNA (15% A, 70% GC)',caption:'Lowering Adenine to 15.0% raises Guanine and Cytosine to 35.0% each; extra triple hydrogen bonds (C≡G) increase total H-bonds to 33 and raise thermal stability.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Adenine percentage',15);s.setSlider('Inspected base pair',6);}},
      {title:'4. Rosalind Franklin’s Photo 51 geometry',caption:'At Rung 10, the vertical rise reaches 3.40 nm and the helix completes a full 360° turn (0.34 nm and 36° per base pair), matching the X-cross and 10th layer line of Photo 51.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Adenine percentage',30);s.setSlider('Inspected base pair',10);}},
      {title:'5. Purine–purine mismatch bulge (>2.0 nm)',caption:'Forcing two 2-ring purines opposite each other at Rung 6 bulges the backbone to 2.45 nm and breaks hydrogen bonding, showing why only purine–pyrimidine pairs fit.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Adenine percentage',35);s.setSlider('Inspected base pair',6);}},
    ],
    idealised:'B-form DNA helical geometry (3.4 nm pitch, 0.34 nm rise, 10 bp/turn, 2.0 nm diameter) and exact Watson–Crick base equivalence (%A = %T, %G = %C).',
  },
  codon_cipher_khorana: {
    challenge:{prompt:'Capture two contrasting synthetic RNA or reading-frame trials (e.g. Nirenberg poly-U vs Khorana (UC)n, or Frameshift +1 vs +3). Explain why 4 bases must be read in triplets (4³ = 64) and how +3 restores the reading frame.',check:s=>s.interacted&&s.readout().includes('Contrasting triplet cipher states captured for comparison:')},
    yourNumbers:s=>{const t=s.num('Synthetic RNA template',1),f=s.num('Reading-frame shift',0),m=s.tab(0),names=['Nirenberg homopolymers','Khorana dinucleotides','Trinucleotides & Stop','Crick–Brenner frameshift'];return `${names[m]} · Template #${t} · +${f} shift`;},
    cutaway:'Four bases read 1 at a time give 4¹ = 4 words; 2 at a time give 4² = 16 words (still fewer than 20 amino acids); 3 at a time give 4³ = 64 triplet codons (61 sense codons + 3 stop codons UAA, UAG, UGA). Crick and Brenner (1961) proved ribosomes read non-overlapping triplets without commas: +1 or +2 insertions scramble every downstream codon, whereas +3 restores the reading frame. Nirenberg (poly-U → Phe) and Har Gobind Khorana (repeating copolymers such as (UC)ₙ → Ser–Leu) deciphered all 64 triplets.',
    watch:[
      {title:'1. Nirenberg & Matthaei poly-U (1961)',caption:'Synthetic polyuridylic acid (UUU·UUU·UUU...) directs cell-free E. coli ribosomes to assemble pure polyphenylalanine (Phe–Phe–Phe), cracking the first codon.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Synthetic RNA template',1);s.setSlider('Reading-frame shift',0);}},
      {title:'2. Har Gobind Khorana’s (UC)ₙ copolymer',caption:'Repeating dinucleotide UCUCUCUCUCUC splits into alternating triplets UCU (Serine) and CUC (Leucine), producing strictly alternating Ser–Leu–Ser–Leu.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Synthetic RNA template',1);s.setSlider('Reading-frame shift',0);}},
      {title:'3. Khorana’s (UG)ₙ and (AG)ₙ copolymers',caption:'Switching to Template #2 ((UG)ₙ = UGU·GUG) yields alternating Cys–Val–Cys–Val, proving the exact letter order inside mixed triplets.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Synthetic RNA template',2);s.setSlider('Reading-frame shift',0);}},
      {title:'4. Amber nonsense stop codon (UAG)',caption:'When UAG appears at Codon 5 (Template #2 in tab 2), no tRNA matches; release factors halt translation and release a 4-residue fragment, matching Obaid Siddiqi’s nonsense mutants.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Synthetic RNA template',2);s.setSlider('Reading-frame shift',0);}},
      {title:'5. Crick & Brenner +1 vs +3 reading-frame proof',caption:'Inserting +3 bases (+1 full triplet) into the phage message restores the downstream CAU (His) reading frame, whereas +1 or +2 scrambles every subsequent triplet.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Synthetic RNA template',1);s.setSlider('Reading-frame shift',3);}},
    ],
    idealised:'Cell-free translation of 18-nucleotide synthetic mRNA templates using the standard 64-codon genetic code (61 sense codons + 3 stop codons).',
  },
  transcription_translation_ribosome: {
    challenge:{prompt:'Capture two contrasting transcription-translation states (e.g. Child X Silent Codon 3 CTG→CTT vs Child Y Missense Codon 6 GAG→GTG, or Reference HbA vs Nonsense Stop). Explain why Child X builds a 100% normal beta-globin chain while Child Y builds sticky HbS.',check:s=>s.interacted&&s.readout().includes('Contrasting transcription and translation states captured for comparison:')},
    yourNumbers:s=>{const c=s.num('Ribosome codon step',6),f=s.num('Protein machine family',1),m=s.tab(0),names=['Reference HbA','Child X Silent','Child Y Missense','Nonsense Stop'];return `${names[m]} · Codon ${c} · Family #${f}`;},
    cutaway:'Cambridge 0610 Topic 17.1 Supplement protein synthesis: (1) the gene coding for the protein remains in the nucleus; (2) messenger RNA (mRNA) is a copy of a gene; (3) mRNA is made in the nucleus and moves to the cytoplasm; (4) mRNA passes through ribosomes; (5) the ribosome assembles amino acids into protein molecules; and (6) the specific sequence of amino acids is determined by the sequence of bases in the mRNA. DNA controls cell function by encoding enzymes, membrane carriers, neurotransmitter receptors and antibodies.',
    watch:[
      {title:'1. Reference adult beta-globin (HbA) at Codon 6',caption:'In the nucleus, coding DNA (GTG CAC CTG ACT CCT GAG GAG) is copied into mRNA (GUG CAC CUG ACU CCU GAG GAG); at Codon 6 (GAG), the ribosome inserts hydrophilic Glutamic acid (Glu⁶).',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Ribosome codon step',6);s.setSlider('Protein machine family',1);}},
      {title:'2. Child X silent substitution (Codon 3 CTG → CTT)',caption:'At Codon 3, DNA CTG becomes CTT so mRNA CUG becomes CUU; because the 64-codon code is degenerate, CUU still codes for Leucine (Leu³) and the folded HbA protein is 100% unchanged.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Ribosome codon step',3);s.setSlider('Protein machine family',1);}},
      {title:'3. Child Y missense substitution (Codon 6 GAG → GTG)',caption:'At Codon 6, DNA GAG becomes GTG so mRNA GAG becomes GUG, replacing hydrophilic Glu⁶ with hydrophobic Valine (Val⁶) and creating a sticky surface patch on deoxygenated HbS.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Ribosome codon step',6);s.setSlider('Protein machine family',1);}},
      {title:'4. Nonsense stop substitution (Codon 6 GAG → TAG)',caption:'Changing DNA GAG to TAG turns mRNA Codon 6 into the amber stop codon UAG, halting the ribosome prematurely and releasing a non-functional 5-residue fragment.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Ribosome codon step',6);s.setSlider('Protein machine family',1);}},
      {title:'5. DNA control of membrane carriers & receptors',caption:'Switching to Protein Family #3 (Na⁺–glucose carrier) or #4 (synaptic neurotransmitter receptor) shows how the same sequence-to-folding pipeline governs every cell machine.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Ribosome codon step',6);s.setSlider('Protein machine family',3);}},
    ],
    idealised:'Models codons 1–7 of human beta-globin (HBB) after initiator methionine cleavage, following Vernon Ingram (1956–1957) and Cambridge IGCSE 0610 Topic 17.1.',
  },
  dna_replication_meselson: {
    challenge:{prompt:'Capture two contrasting CsCl density-gradient trials (e.g. Semi-conservative Gen 1 vs Gen 2, or Semi-conservative vs Conservative at Gen 1) to explain why Generation 1 falsifies conservative replication and Generation 2 falsifies dispersive replication.',check:s=>s.interacted&&s.readout().includes('Contrasting replication states captured for comparison:')},
    yourNumbers:s=>{const g=s.num('Generation in ¹⁴N',1),f=s.num('Proofreading step',4),m=s.tab(0),names=['Semi-conservative','Conservative','Dispersive','Fork & Proofreading'];return `${names[m]} · Gen ${g} · Fidelity step ${f}`;},
    cutaway:'Before mitosis or meiosis, DNA helicase unwinds the double helix by breaking complementary base-pair hydrogen bonds (A=T has 2 H-bonds, C≡G has 3 H-bonds). Each exposed parental strand templates a new complementary strand assembled by DNA polymerase (semi-conservative replication). In 1958, Matthew Meselson and Franklin Stahl grew E. coli in heavy ¹⁵NH₄Cl (1.724 g/cm³), shifted cells to light ¹⁴NH₄Cl (1.710 g/cm³), and spun extracted DNA in a CsCl gradient at 140,000 × g: Generation 1 yielded 100% hybrid ¹⁵N/¹⁴N DNA (1.717 g/cm³), eliminating conservative replication, and Generation 2 yielded 50% hybrid + 50% light DNA, eliminating dispersive replication.',
    watch:[
      {title:'1. Generation 0 heavy ¹⁵N/¹⁵N baseline (1.724 g/cm³)',caption:'After 14 generations in ¹⁵NH₄Cl, 100% of E. coli DNA double helices carry two heavy ¹⁵N strands and form a single dense band at 1.724 g/cm³.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Generation in ¹⁴N',0);s.setSlider('Proofreading step',4);}},
      {title:'2. Generation 1 single hybrid band (1.717 g/cm³)',caption:'After one doubling (20 min) in light ¹⁴NH₄Cl, 100% of duplexes are ¹⁵N/¹⁴N hybrids (1 old + 1 new strand), producing one intermediate band at 1.717 g/cm³.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Generation in ¹⁴N',1);s.setSlider('Proofreading step',4);}},
      {title:'3. Why Generation 1 falsifies Conservative replication',caption:'Switching to the Conservative hypothesis at Generation 1 predicts 50% heavy (1.724) and 50% light (1.710) bands with zero hybrid DNA—contradicting the 1958 experiment.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Generation in ¹⁴N',1);s.setSlider('Proofreading step',4);}},
      {title:'4. Generation 2 split falsifies Dispersive replication',caption:'At Generation 2 (40 min), Semi-conservative replication yields 50% hybrid (1.717) and 50% light (1.710) bands, whereas Dispersive predicts a single 1.7135 g/cm³ band.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Generation in ¹⁴N',2);s.setSlider('Proofreading step',4);}},
      {title:'5. DNA polymerase proofreading & 40,000 origins',caption:'Stepping Proofreading fidelity from 1 to 4 shows how 3\'→5\' exonuclease proofreading and mismatch repair cut errors from 10⁻⁴ to 10⁻⁹ per base across ~40,000 replication origins.',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Generation in ¹⁴N',3);s.setSlider('Proofreading step',4);}},
    ],
    idealised:'Models Meselson and Stahl’s 1958 E. coli ¹⁵N→¹⁴N equilibrium CsCl density-gradient centrifugation (1.724, 1.717, 1.710 g/cm³) and eukaryotic S-phase replication fidelity.',
  },
  mitosis_meiosis_stepper: {
    challenge:{prompt:'Capture two contrasting division states (e.g. Human Mitosis Stage 5 vs Human Meiosis Stage 4, or Wild diploid banana 2n = 22 vs Triploid Cavendish banana 3n = 33) to explain how mitosis maintains 2n while meiosis halves 2n to n.',check:s=>s.interacted&&s.readout().includes('Contrasting division states captured for comparison:')},
    yourNumbers:s=>{const st=s.num('Division cycle stage',1),org=s.num('Organism preset',1),m=s.tab(0),names=['Human Mitosis','Human Meiosis','Cavendish 3n=33','Janaki Ammal Cane'];return `${names[m]} · Stage ${st} · Preset #${org}`;},
    cutaway:'Cambridge 0610 Topics 17.2 & 17.3: Exact replication of chromosomes occurs before mitosis (46 chromosomes → 92 sister chromatids joined at 46 centromeres). During mitosis, the copies separate in a single division to produce 2 genetically identical diploid cells (2n = 46) for growth, tissue repair, cell replacement, and asexual reproduction. During meiosis (reduction division) in reproductive organs, one DNA replication is followed by two nuclear divisions: Meiosis I separates homologous pairs (halving 2n = 46 to n = 23 with crossing over and 2²³ = 8,388,608 independent combinations) and Meiosis II separates sister chromatids into 4 genetically different haploid gametes.',
    watch:[
      {title:'1. S-phase chromosome replication (46 chr, 92 chromatids)',caption:'Before mitosis begins, semi-conservative DNA replication duplicates every chromosome into two identical sister chromatids joined at one centromere (2n = 46 chromosomes, 92 DNA molecules).',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Organism preset',1);s.setSlider('Division cycle stage',2);}},
      {title:'2. Mitotic separation yields 2 identical 2n = 46 clones',caption:'At Stage 5 of mitosis, sister chromatids have separated to opposite poles, forming two genetically identical diploid daughter cells (2n = 46) for growth, repair, and replacement.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Organism preset',1);s.setSlider('Division cycle stage',5);}},
      {title:'3. Meiosis I reduction division (2n = 46 → n = 23)',caption:'In Human Meiosis at Stage 3, homologous chromosome pairs separate after crossing over, halving the chromosome number from diploid (46) to haploid (23) in each cell.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Organism preset',1);s.setSlider('Division cycle stage',3);}},
      {title:'4. Meiosis II & fertilisation restoring 2n = 46',caption:'Stage 4 separates sister chromatids into 4 genetically unique haploid gametes (n = 23); Stage 5 fuses sperm (23) and egg (23) nuclei into a diploid zygote (2n = 46).',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Organism preset',1);s.setSlider('Division cycle stage',4);}},
      {title:'5. Triploid Cavendish banana (3n = 33) meiosis jam',caption:'Because Cavendish bananas carry 11 homologous triplets (3n = 33), odd triplets split 2-vs-1 at random in Meiosis I, aborting seed formation and locking farmers into mitotic sucker clones.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Organism preset',3);s.setSlider('Division cycle stage',3);}},
    ],
    idealised:'Tracks centromere-based chromosome counts, chromatid/DNA helix counts, ploidy (2n, n, 3n, 8x), and independent assortment (2ⁿ) across human, wild banana, Cavendish banana, and Coimbatore sugarcane.',
  },
  stem_cell_expression_lab: {
    challenge:{prompt:'Capture two contrasting cell expression profiles (e.g. Pancreatic Beta Cell vs Bone-Marrow Erythroblast at Stage 4, or Stage 1 Stem Cell vs Yamanaka iPSC Reset) to verify that all nucleated cells retain 100% of their 46-chromosome DNA while expressing only needed genes.',check:s=>s.interacted&&s.readout().includes('Contrasting expression states captured for comparison:')},
    yourNumbers:s=>{const d=s.num('Differentiation stage',4),tf=s.num('Regulator switch',1),m=s.tab(0),names=['Pancreatic Beta Cell','Erythroblast / RBC','Motor Neurone','Gurdon / Yamanaka iPSC'];return `${names[m]} · Stage ${d} · Switch #${tf}`;},
    cutaway:'Cambridge 0610 Topics 17.2.5 & 17.1.6: Stem cells are unspecialised cells that divide by mitosis to self-renew and produce daughter cells that can become specialised for specific functions. Because every body cell descends from the same zygote by mitosis, most body cells contain the exact same 46 chromosomes (~20,000 genes). Specialisation does not delete unused genes; instead, transcription factors switch ON only the genes needed by that cell (e.g. INS in pancreatic beta cells, HBB in bone-marrow erythroblasts, CHAT/SCN9A in motor neurones) while keeping housekeeping genes (ATP5F1A, GAPDH) ON in all cells.',
    watch:[
      {title:'1. Unspecialised stem cell (Stage 1 self-renewal)',caption:'At Differentiation Stage 1, pluripotency factors (OCT4/SOX2) and housekeeping genes (ATP5F1A, GAPDH) are switched ON while specialist genes (INS, HBB, CHAT) remain silent.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Differentiation stage',1);s.setSlider('Regulator switch',1);}},
      {title:'2. Pancreatic beta cell expresses INS (insulin)',caption:'At Stage 4 in a pancreatic beta cell, transcription factor PDX1 opens Chromosome 11 chromatin at INS to transcribe insulin mRNA while HBB and CHAT stay closed in DNA.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Differentiation stage',4);s.setSlider('Regulator switch',1);}},
      {title:'3. Bone-marrow erythroblast expresses HBB (haemoglobin)',caption:'Switching to Bone-Marrow Erythroblast shows the exact same 46 chromosomes in the nucleus, but GATA1 switches HBB ON to print 270 million haemoglobin molecules while INS is OFF.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Differentiation stage',4);s.setSlider('Regulator switch',1);}},
      {title:'4. Spinal motor neurone expresses CHAT & Na⁺ channels',caption:'In a spinal motor neurone, NEUROD1/ISL1 switches ON synaptic and ion-channel genes (CHAT/SCN9A) while keeping both INS and HBB silenced in heterochromatin.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Differentiation stage',4);s.setSlider('Regulator switch',1);}},
      {title:'5. Gurdon (1962) & Yamanaka (2006) reprogramming proof',caption:'Selecting Switch #4 (Oct4, Sox2, Klf4, c-Myc) rewinds a differentiated somatic nucleus back to an induced pluripotent stem cell (iPSC), proving zero genes were lost during specialisation.',cutaway:true,act:s=>{s.selectTab(0,3);s.setSlider('Differentiation stage',4);s.setSlider('Regulator switch',4);}},
    ],
    idealised:'Models a 6-gene representative locus panel (ATP5F1A, GAPDH, OCT4/SOX2, INS, HBB, CHAT/SCN9A) across 46-chromosome human somatic lineages and iPSC reprogramming.',
  },
  mendel_punnett_simulator: {
    challenge:{prompt:'Capture two contrasting Mendel crosses or sample sizes (e.g. 3:1 Hybrid Rr × Rr vs 1:1 Test Cross Rr × rr, or Small Pod N = 16 vs Mendel 1866 limit) to explain how gamete alleles produce 1:2:1 genotypes, 3:1 phenotypes, and 1:1 test crosses.',check:s=>s.interacted&&s.readout().includes('Contrasting crosses captured for comparison:')},
    yourNumbers:s=>{const t=s.num('Pea character locus',1),n=s.num('Fertilisation sample size',4),m=s.tab(0),modes=['3:1 Hybrid','1:1 Test Cross','Pure F₁','7 Pea Traits'],loci=['Seed shape (R/r)','Flower colour (B/b)','Cotyledon colour (Y/y)','Stem length (T/t)'],samples=['N = 16','N = 64','N = 400','Mendel 1866'];return `${modes[m]} · ${loci[t-1]} · ${samples[n-1]}`;},
    cutaway:'Cambridge 0893 & 0610 Topic 17.4: A gene is a length of DNA at a specific locus on a chromosome that codes for a protein; an allele is an alternative form of a gene. In a diploid organism (2n), homologous chromosomes carry two copies of each gene—either homozygous (RR or rr) or heterozygous (Rr). Because a single functional allele (R) synthesises enough active enzyme (such as starch-branching enzyme SBEI in round peas) to produce the full trait, R is dominant and r is recessive. Meiosis separates homologous chromosomes so each haploid gamete (n) receives 1 allele; random fertilisation in Rr × Rr produces a 1 RR : 2 Rr : 1 rr genotype ratio and a 3 : 1 phenotype ratio, whereas a test cross (Rr × rr) produces a 1 : 1 ratio.',
    watch:[
      {title:'1. Parental pure cross (RR × rr → 100% Rr F₁ hybrids)',caption:'Crossing a homozygous dominant round-seed parent (RR) with a homozygous recessive wrinkled-seed parent (rr) yields 100% heterozygous Rr F₁ seeds; the recessive r allele is unexpressed but preserved intact.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Pea character locus',1);s.setSlider('Fertilisation sample size',4);}},
      {title:'2. Monohybrid F₁ self-cross (Rr × Rr → 1:2:1 & 3:1)',caption:'When two Rr hybrids self-pollinate, 50% R and 50% r gametes combine in a 2×2 Punnett grid to give 25% RR, 50% Rr, and 25% rr genotypes (1:2:1) and 75% round : 25% wrinkled phenotypes (3:1).',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Pea character locus',1);s.setSlider('Fertilisation sample size',4);}},
      {title:'3. Diagnostic test cross (Rr × rr → 1:1)',caption:'Crossing a dominant-phenotype plant of unknown genotype with a homozygous recessive tester (rr) yields 50% Rr and 50% rr offspring (1:1) if the parent is heterozygous, unmasking the hidden recessive allele.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Pea character locus',1);s.setSlider('Fertilisation sample size',4);}},
      {title:'4. Small-sample bounce (N = 16) vs large-sample convergence',caption:'At N = 16 (a single pea pod batch), random fertilisation bounce shifts the observed percentage away from 75%; increasing N from 16 to 64, 400, and 7,324 converges on 3:1.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Pea character locus',1);s.setSlider('Fertilisation sample size',1);}},
      {title:'5. Brno 1866 ledger across 19,959 pea outcomes (2.98 : 1)',caption:'Across all seven pea characters in his 1866 Brno monograph, Johann Gregor Mendel counted 14,949 dominant and 5,010 recessive F₂ outcomes (2.98 : 1) and verified the hidden 1 RR : 2 Rr split in F₃.',cutaway:true,act:s=>{s.selectTab(0,3);s.setSlider('Pea character locus',1);s.setSlider('Fertilisation sample size',4);}},
    ],
    idealised:'Models monohybrid Punnett probabilities, haplosufficient enzyme dosage (100% RR, 50% Rr, 0% rr), and sample-size convergence against Johann Gregor Mendel’s 1866 Brno pea ledger.',
  },
  abo_codominance_pedigree: {
    challenge:{prompt:'Capture two contrasting ABO parental crosses (e.g. IᴬIᴼ × IᴮIᴼ 4-Group Cross vs IᴬIᴮ × IᴼIᴼ Swap Check, or IᴬIᴮ × IᴬIᴮ Codominance) to compare possible and excluded offspring blood groups.',check:s=>s.interacted&&s.readout().includes('Contrasting ABO crosses captured for comparison:')},
    yourNumbers:s=>{const mat=s.num('Maternal ABO genotype',1),pat=s.num('Paternal ABO genotype',3),m=s.tab(0),modes=['4-Group Cross','Swap Check','1:2:1 Codominance','Pedigree Rules'],codes=['IᴬIᴼ (A)','IᴬIᴬ (A)','IᴮIᴼ (B)','IᴮIᴮ (B)','IᴬIᴮ (AB)','IᴼIᴼ (O)'];return `${modes[m]} · ${codes[mat-1]} × ${codes[pat-1]}`;},
    cutaway:'Cambridge 0610 Topic 17.4 (Extended): Codominance occurs when both alleles in a heterozygote are expressed independently and simultaneously in the phenotype. The human ABO blood group gene on Chromosome 9 has three common alleles in the population (Iᴬ, Iᴮ, Iᴼ), though any diploid person inherits only two. Iᴬ codes for GTA enzyme (attaching GalNAc = Antigen A), Iᴮ codes for GTB enzyme (attaching D-Gal = Antigen B), and Iᴼ carries a ΔG261 frameshift loss-of-function deletion (leaving unmodified H-antigen). Iᴬ and Iᴮ are codominant (IᴬIᴮ = Group AB with both antigens), while both Iᴬ and Iᴮ are dominant to recessive Iᴼ (IᴬIᴼ = Group A; IᴮIᴼ = Group B; IᴼIᴼ = Group O).',
    watch:[
      {title:'1. Four-blood-group cross (IᴬIᴼ × IᴮIᴼ → AB, A, B, O)',caption:'When a heterozygous Group A mother (IᴬIᴼ) and heterozygous Group B father (IᴮIᴼ) have children, the 2×2 Punnett grid gives 25% IᴬIᴮ (AB), 25% IᴬIᴼ (A), 25% IᴮIᴼ (B), and 25% IᴼIᴼ (O).',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Maternal ABO genotype',1);s.setSlider('Paternal ABO genotype',3);}},
      {title:'2. Hospital swap check (IᴬIᴮ × IᴼIᴼ → 50% A, 50% B, 0% O)',caption:'A Group AB parent (IᴬIᴮ) passes either Iᴬ or Iᴮ (never Iᴼ), and a Group O parent (IᴼIᴼ) passes only Iᴼ, so biological children can only be Group A (IᴬIᴼ) or Group B (IᴮIᴼ)—never AB or O.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Maternal ABO genotype',5);s.setSlider('Paternal ABO genotype',6);}},
      {title:'3. Codominance 1:2:1 phenotype ratio (IᴬIᴮ × IᴬIᴮ)',caption:'Crossing two Group AB parents (IᴬIᴮ × IᴬIᴮ) produces 25% Group A (IᴬIᴬ), 50% Group AB (IᴬIᴮ), and 25% Group B (IᴮIᴮ)—a 1:2:1 phenotype ratio that directly mirrors the 1:2:1 genotype ratio.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Maternal ABO genotype',5);s.setSlider('Paternal ABO genotype',5);}},
      {title:'4. Two Group A carriers producing a Group O child (IᴬIᴼ × IᴬIᴼ)',caption:'Two Group A parents who both carry a hidden Iᴼ allele (IᴬIᴼ × IᴬIᴼ) have a 25% chance of a Group O child (IᴼIᴼ) and a 75% chance of a Group A child (25% IᴬIᴬ + 50% IᴬIᴼ).',cutaway:false,act:s=>{s.selectTab(0,3);s.setSlider('Maternal ABO genotype',1);s.setSlider('Paternal ABO genotype',1);}},
      {title:'5. Pedigree Detective Rule 1 vs Rule 2',caption:'In family pedigrees, two unaffected parents having an affected child proves a recessive allele (Aa × Aa → aa); conversely, two affected parents having an unaffected child proves a dominant allele.',cutaway:true,act:s=>{s.selectTab(0,3);s.setSlider('Maternal ABO genotype',3);s.setSlider('Paternal ABO genotype',3);}},
    ],
    idealised:'Models diploid 2×2 Punnett inheritance across all 36 (6×6) parental combinations of ABO genotypes (IᴬIᴬ, IᴬIᴼ, IᴮIᴮ, IᴮIᴼ, IᴬIᴮ, IᴼIᴼ) and autosomal pedigree deduction rules.',
  },
  sex_linked_cross_lab: {
    challenge:{prompt:'Capture two contrasting X-linked crosses (e.g. Carrier Mum × Normal Dad vs Normal Mum × Affected Dad, or Carrier Mum × Affected Dad) to explain why sons inherit X-linked traits from their mother and why fathers cannot pass X-linked traits to sons.',check:s=>s.interacted&&s.readout().includes('Contrasting X-linked crosses captured for comparison:')},
    yourNumbers:s=>{const mat=s.num('Maternal XX genotype',1),tr=s.num('X-linked gene locus',1),m=s.tab(0),modes=['Carrier × Normal','Normal × Affected','Carrier × Affected','XX × XY Ratio'],mats=['Carrier XX','Normal XX','Affected XX'],traits=['Red–green vision','Haemophilia','Fly eye colour'];return `${modes[m]} · ${mats[mat-1]} · ${traits[tr-1]}`;},
    cutaway:'Cambridge 0610 Topics 17.1 & 17.4 (Extended): Human females are XX (producing 100% X ova) and males are XY (producing 50% X sperm and 50% Y sperm), giving a 1:1 sex ratio at fertilisation. A sex-linked characteristic is one in which the gene responsible is located on a sex chromosome (usually the non-homologous region of the X chromosome, ~156 Mb and ~850 genes vs ~57 Mb and <100 genes on Y), making it more common in one sex than in the other. Because an XY male has only one X chromosome (hemizygous), a single recessive allele (Xᵇ or Xʰ) causes the condition, and males cannot be unaffected carriers.',
    watch:[
      {title:'1. Carrier mother × Normal father (XᴮXᵇ × XᴮY)',caption:'A carrier mother passes Xᵇ to 50% of her children: 0% of daughters are affected (50% XᴮXᴮ normal, 50% XᴮXᵇ carriers), while 50% of sons are affected (XᵇY) because sons have no second X chromosome.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Maternal XX genotype',1);s.setSlider('X-linked gene locus',1);}},
      {title:'2. Normal mother × Affected father (XᴮXᴮ × XᵇY → 0% affected sons)',caption:'An affected father gives every son his Y chromosome (never his X), so 0% of sons inherit the father’s Xᵇ allele; instead, 100% of daughters inherit his Xᵇ and become unaffected carriers (XᴮXᵇ).',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Maternal XX genotype',2);s.setSlider('X-linked gene locus',1);}},
      {title:'3. Carrier mother × Affected father (XᴮXᵇ × XᵇY → affected daughters)',caption:'An X-linked recessive condition appears in a daughter (XᵇXᵇ) only when she inherits a recessive allele from both her carrier/affected mother and her affected father (50% of daughters here).',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Maternal XX genotype',1);s.setSlider('X-linked gene locus',1);}},
      {title:'4. Haemophilia clotting cascade bridge (Xᴴ/Xʰ)',caption:'Switching to the Haemophilia locus (Xᴴ/Xʰ) shows how Xʰ leaves clotting Factor VIII/IX non-functional in XʰY sons, preventing soluble fibrinogen from forming a fibrin mesh in wounds.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Maternal XX genotype',1);s.setSlider('X-linked gene locus',2);}},
      {title:'5. Morgan 1910 Drosophila white-eye chromosome proof (X⁺/Xʷ)',caption:'Switching to Fly eye colour models Thomas Hunt Morgan’s 1910 Columbia Fly Room discovery: F₂ white eyes appeared exclusively in males (XʷY), proving genes sit physically on chromosomes.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Maternal XX genotype',1);s.setSlider('X-linked gene locus',3);}},
    ],
    idealised:'Models 2×2 X/Y gamete Punnett segregation and separate probabilities among daughters (XX), among sons (XY), and among all children for X-linked loci.',
  },
  variation_mutation_lab: {
    challenge:{prompt:'Capture two contrasting variation or mutation trials (e.g. Height Continuous vs ABO Blood Discontinuous, or Spontaneous 1× vs Ionising X-ray 50×) to compare how genes, environment, and mutagens shape variation.',check:s=>s.interacted&&s.readout().includes('Contrasting variation or mutation trials captured for comparison:')},
    yourNumbers:s=>{const tr=s.num('Variation trait focus',1),env=s.num('Mutagen or environment',1),m=s.tab(0),modes=['Continuous vs Discontinuous','Replica Plate Proof','Mutagen Dose','Meiosis Shuffle'],traits=['Student Height','Body Mass','ABO Blood Group','Pea Seed Shape'],envs=['1× Baseline','5× Chemical','20× UV-B','50× X-Ray'];return `${modes[m]} · ${traits[tr-1]} · ${envs[env-1]}`;},
    cutaway:'Cambridge 0610 Topic 18.1 (Core & Extended): Variation is the differences between individuals of the same species. Continuous variation (e.g. body height, mass) results in a range of phenotypes between two extremes with intermediates, is controlled by many genes (polygenic) plus environmental factors, and is plotted as a histogram with a bell curve. Discontinuous variation (e.g. ABO blood groups, Mendel pea seed shape) results in limited, distinct categories with no intermediates, is controlled by one or a few genes alone with zero environmental shift, and is plotted as separated category bars. Mutation is a random change in the base sequence of DNA (such as GAG → GTG in HBB) and is the ONLY source of brand-new alleles; meiosis, random mating, and random fertilisation reshuffle existing alleles into new combinations. Ionising radiation and chemical mutagens increase the rate of mutation but never direct which gene mutates.',
    watch:[
      {title:'1. Continuous variation: student height histogram & environment shift',caption:'Student height (135–169 cm) is polygenic and modified by nutrition: sliding the environment level from low to rich nutrition shifts the bell-curve mean upward (+3.6 cm) while preserving continuous intermediates.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Variation trait focus',1);s.setSlider('Mutagen or environment',3);}},
      {title:'2. Discontinuous variation: ABO blood group category bars (0% env shift)',caption:'Switching to ABO Blood Group (O, B, A, AB) shows distinct separated bars with no intermediates; sliding the environment slider produces a 0% shift because nutrition or sunlight never changes categorical genotype.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Variation trait focus',2);s.setSlider('Mutagen or environment',4);}},
      {title:'3. Lederberg 1952 replica-plating proof of pre-existing mutation',caption:'Pressing a sterile velveteen stamp from an antibiotic-free master plate onto an antibiotic replica plate reveals resistant colonies (C3, C7, C11) at identical coordinates, proving resistance arose randomly BEFORE drug contact.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Variation trait focus',2);s.setSlider('Mutagen or environment',3);}},
      {title:'4. Mutagen dose response: 1× spontaneous vs 50× ionising X-rays',caption:'DNA polymerase proofreading holds spontaneous glitches to ~10⁻⁹ per base pair (1× baseline), whereas chemical mutagens (5×), UV radiation (20×), and ionising X-rays/gamma rays (50×) raise random mutation frequency without directing outcomes.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Variation trait focus',4);s.setSlider('Mutagen or environment',4);}},
      {title:'5. Four sources of variation: only mutation creates brand-new alleles',caption:'Comparing Mutation, Meiosis (crossing over + 2²³ = 8.4 million assortments), Random Mating, and Random Fertilisation (>70 trillion zygotes) highlights why only DNA mutation invents new alleles.',cutaway:true,act:s=>{s.selectTab(0,3);s.setSlider('Variation trait focus',1);s.setSlider('Mutagen or environment',2);}},
    ],
    idealised:'Models continuous vs discontinuous phenotypic distributions, Lederberg & Lederberg (1952) velveteen replica plating, mutagen rate multipliers (1× to 50×), and the four sources of variation.',
  },
  natural_selection_simulator: {
    challenge:{prompt:'Capture two contrasting natural selection trials (e.g. Full 7-Day Course vs Stop on Day 3 Relapse, or Sooty Bark Moths vs Malaria Belt HbS) to compare how environmental selection pressure shifts allele frequencies across generations.',check:s=>s.interacted&&s.readout().includes('Contrasting natural selection trials captured for comparison:')},
    yourNumbers:s=>{const p=s.num('Selection pressure',3),g=s.num('Generation or day step',5),m=s.tab(0),modes=['Antibiotic Course','Stopped Day 3','Peppered Moths','Malaria & HbS'],press=['0% Pressure','40% Pressure','80% Pressure','100% Pressure'];return `${modes[m]} · ${press[p-1]} · Step ${g}/10`;},
    cutaway:'Cambridge 0610 Topic 18.3 (Core & Extended): Natural selection proceeds through six linked steps: (1) genetic variation exists within populations (including pre-existing random mutations), (2) production of many offspring, (3) struggle for existence / competition for resources, (4) differential survival of individuals better adapted to the environment, (5) reproduction by those better-adapted survivors passing on their alleles, and (6) increase in frequency of advantageous alleles over generations. Antibiotics act as an environmental selection pressure: they do NOT cause bacteria to mutate, nor do bacteria become "immune". In P. falciparum malaria regions, heterozygote advantage (HbᴬHbˢ carriers protected against severe malaria while avoiding HbˢHbˢ sickle-cell anaemia) maintains the Hbˢ allele by balancing selection.',
    watch:[
      {title:'1. Full 7-day antibiotic course: clearance via drug + immune phagocytes',caption:'Sustaining high antibiotic pressure through Step 10 kills sensitive bacteria (99% of initial load) and holds pre-existing resistant cells low enough for host phagocytes and antibodies to clear the infection.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Selection pressure',3);s.setSlider('Generation or day step',10);}},
      {title:'2. Stopping antibiotics early on Day 3: resistant relapse (99.2% resistant)',caption:'Stopping treatment at Step 3 removes sensitive competitors while leaving pre-existing resistant bacteria alive; freed from competition, they divide every 20 minutes until the rebounding infection is >99% resistant.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Selection pressure',3);s.setSlider('Generation or day step',10);}},
      {title:'3. Peppered moth (Biston betularia): industrial melanism & Clean Air reversal',caption:'On sooty industrial bark, visual predation by birds drives dark carbonaria morphs upward by Step 5; following Clean Air recovery of pale lichens, selection reverses toward pale typica.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Selection pressure',4);s.setSlider('Generation or day step',5);}},
      {title:'4. Peak industrial melanism on soot-blackened bark (Step 10)',caption:'Advancing the Peppered Moths timeline to Step 10 on soot-blackened bark shows how natural selection drives dark carbonaria above 93% without any moth choosing its wing colour.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Selection pressure',4);s.setSlider('Generation or day step',10);}},
      {title:'5. Balancing selection: sickle-cell allele (Hbˢ) in holoendemic malaria belts',caption:'Under intense P. falciparum malaria pressure, HbᴬHbˢ heterozygotes have the highest survival fitness, stabilising the Hbˢ allele frequency near q ≈ 15.5% (~26.2% carriers) despite selection against HbˢHbˢ.',cutaway:true,act:s=>{s.selectTab(0,3);s.setSlider('Selection pressure',4);s.setSlider('Generation or day step',9);}},
    ],
    idealised:'Models multi-generation allele and phenotype trajectories under antibiotic regimens, avian visual predation on Biston betularia, and balancing selection on Hbᴬ/Hbˢ under P. falciparum malaria.',
  },
  adaptive_features_selective_breeding: {
    challenge:{prompt:'Capture two contrasting adaptation, selective breeding, or DNA clock trials (e.g. Marram Grass Xerophyte vs Water Lily Hydrophyte, or Gir Cattle Selective Breeding vs DNA Clock) to compare structural mechanisms and evolutionary divergence.',check:s=>s.interacted&&s.readout().includes('Contrasting adaptation or breeding trials captured for comparison:')},
    yourNumbers:s=>{const st=s.num('Stress or generation',3),fl=s.num('Feature or lineage',2),m=s.tab(0),modes=['Xerophyte (Arid)','Hydrophyte (Aquatic)','Selective Breeding','DNA Clock'];return `${modes[m]} · Step ${st}/5 · Focus ${fl}/4`;},
    cutaway:'Cambridge 0610 Topics 18.2, 18.3 & 1.2 (Core & Extended): An adaptive feature is an inherited feature that helps an organism to survive and reproduce in its environment. Xerophytes (marram grass, cacti) conserve water in arid habitats via thick waxy cuticles, sunken stomata in rolled grooves with trichome hairs that trap moist air (reducing the water potential gradient), small/spiny leaves, and deep or widespread roots. Hydrophytes (water lilies) thrive in water via large aerenchyma air spaces for buoyancy and O₂ diffusion, stomata on the upper epidermis only, thin/absent cuticles, and reduced roots/xylem. Selective breeding (artificial selection) uses human choice across generations to amplify desirable traits (reducing genetic diversity), whereas DNA base and amino acid sequences reveal evolutionary relatedness (more similar sequences = more recent common ancestor).',
    watch:[
      {title:'1. Xerophyte adaptation: marram grass rolled leaf & sunken stomatal pits',caption:'Under severe arid wind and heat, marram grass curls its leaf blade around sunken stomatal grooves lined with trichome hairs, trapping a humid boundary layer that cuts transpiration by 86%.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Stress or generation',4);s.setSlider('Feature or lineage',2);}},
      {title:'2. Hydrophyte adaptation: water lily upper stomata & 58% aerenchyma',caption:'Floating water lily leaves pack ~450 stomata per mm² on the upper air-facing epidermis (0 per mm² below) and 58% aerenchyma air spaces for buoyancy and O₂ transport to submerged roots.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Stress or generation',3);s.setSlider('Feature or lineage',3);}},
      {title:'3. Selective breeding: Coimbatore sugarcane vs Gir dairy cattle',caption:'Across 40 generations of human selection, desirable crop and livestock traits rise sharply while heterozygosity narrows, illustrating the genetic diversity trade-off of artificial selection.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Stress or generation',5);s.setSlider('Feature or lineage',3);}},
      {title:'4. Indian Gir dairy cattle milk yield across 40 generations',caption:'Switching the breeding lineage to Gir dairy cattle shows how selecting high-yielding cows and progeny-tested bulls raised lactation yield from 1,350 L to 4,200 L (+211%).',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Stress or generation',5);s.setSlider('Feature or lineage',1);}},
      {title:'5. Molecular clock: Cytochrome c & HBB sequence similarity across vertebrates',caption:'Human vs Chimpanzee shows 0/104 Cytochrome c differences and 98.8% coding DNA identity (~6.5 Ma split), whereas Human vs Chicken shows 13/104 differences (~310 Ma split).',cutaway:true,act:s=>{s.selectTab(0,3);s.setSlider('Stress or generation',4);s.setSlider('Feature or lineage',1);}},
    ],
    idealised:'Models xerophyte and hydrophyte leaf anatomy and transpiration rates, 40-generation selective breeding trajectories and diversity trade-offs, and vertebrate Cytochrome c / beta-globin molecular clocks.',
  },
  ecosystem_trophic_lab: {
    challenge:{prompt:'Capture two contrasting ecosystem, pyramid, diet efficiency, or sigmoid growth trials (e.g. Direct Crop Diet vs Livestock Meat Diet, or Banyan Tree Pyramid vs SGNP Web) to compare trophic energy retention and carrying capacity.',check:s=>s.interacted&&s.readout().includes('Contrasting trophic or population trials captured for comparison:')},
    yourNumbers:s=>{const eff=s.num('Trophic transfer',10),sec=s.num('Plant share or scale',50),m=s.tab(0),modes=['SGNP Web','Banyan Pyramid','Diet Efficiency','Sigmoid Curve'];return `${modes[m]} · ${eff}% transfer · Scale ${sec}%`;},
    cutaway:'Cambridge 0610 Topics 19.1–19.4: Solar energy flows one way (light → chemical energy in producers → consumers → heat via respiration) while nutrients recycle. Only ~10% of energy transfers per trophic step (~90% lost in respiration/heat, faeces, urea & uneaten parts), limiting chains to 4–5 levels and making direct crop diets ~10× more efficient than livestock meat. Pyramids of numbers can invert (1 banyan tree < 8,000 insects), whereas dry biomass and energy pyramids stay upright. Closed populations follow a 4-phase sigmoid curve (lag, log, stationary at K, death).',
    watch:[
      {title:'1. SGNP monsoon forest web: the 10% energy rule & why chains stop at 4–5 levels',caption:'At 10% trophic transfer efficiency, 10,000 kJ m⁻² yr⁻¹ in Karvi shrubs drops to 1,000 kJ in deer, 100 kJ in leopards, and 10 kJ at Level 4, leaving too little energy to sustain a viable 5th predator population.',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Trophic transfer',10);s.setSlider('Plant share or scale',50);}},
      {title:'2. One giant banyan tree: inverted pyramid of numbers vs upright biomass & energy',caption:'A single Ficus benghalensis tree (L1 = 1) feeds 8,000 fruit bats and caterpillars (L2 = 8,000), inverting the base of the pyramid of numbers while dry biomass (4,500 kg → 135 kg) and energy (45,000 → 4,500 kJ) stay upright.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Trophic transfer',10);s.setSlider('Plant share or scale',20);}},
      {title:'3. Direct human crop diet (90% plant): 9.1× population capacity per hectare',caption:'Eating crop plants directly (Producer → Human) bypasses the 90% livestock respiratory/faecal/urinary energy loss, delivering 910 kJ m⁻² yr⁻¹ and supporting 9.1× as many people per hectare as an all-meat diet.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Trophic transfer',10);s.setSlider('Plant share or scale',90);}},
      {title:'4. Livestock meat diet (10% plant / 90% meat): two trophic steps lose 99% of crop energy',caption:'Feeding 90% of arable crops to livestock adds a second 90% trophic tax (Crop → Livestock → Human), cutting human assimilated energy to 190 kJ m⁻² yr⁻¹ (1.9× relative capacity).',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Trophic transfer',10);s.setSlider('Plant share or scale',10);}},
      {title:'5. Sigmoid (S-shaped) population curve: lag, exponential, stationary (K), and death phases',caption:'In a closed batch vessel, population grows slowly in the lag phase, surges exponentially while food is abundant, plateaus at carrying capacity K = 680 when birth rate = death rate, and declines to 238 in the death phase.',cutaway:true,act:s=>{s.selectTab(0,3);s.setSlider('Trophic transfer',12);s.setSlider('Plant share or scale',60);}},
    ],
    idealised:'Models trophic energy and dry biomass cascades, banyan tree pyramid comparisons, farmland human dietary energy budgets, and 4-phase batch-culture sigmoid population dynamics.',
  },
  nutrient_cycles_eutrophication: {
    challenge:{prompt:'Capture two contrasting nitrogen cycle, eutrophication, carbon cycle, or deforestation trials (e.g. Aerated Legumes vs Waterlogged Paddy, or Low vs High Nitrate Runoff in Powai Lake) to compare soil nitrate or dissolved oxygen.',check:s=>s.interacted&&s.readout().includes('Contrasting nutrient or eutrophication trials captured for comparison:')},
    yourNumbers:s=>{const p=s.num('Legume or runoff load',80),sec=s.num('Aeration or sink cover',85),m=s.tab(0),modes=['Nitrogen & Legumes','Eutrophication','Carbon & Keeling','Deforestation'];return `${modes[m]} · Load ${p}% · Aeration/Sink ${sec}%`;},
    cutaway:'Cambridge 0610 Topics 19.3, 20.2 & 20.3: In the nitrogen cycle, nitrogen-fixing bacteria (Rhizobium in legume root nodules and soil Azotobacter) plus lightning convert N₂ gas into ammonium/nitrates; decomposers break proteins and urea into NH₄⁺; aerobic nitrifying bacteria oxidise NH₄⁺ → NO₂⁻ → NO₃⁻ for active root hair uptake; and anaerobic denitrifying bacteria in waterlogged soils reduce NO₃⁻ to N₂ gas. In the 7-step eutrophication cascade, leached NO₃⁻/sewage fuels an algal bloom that blocks light, killing submerged plants so aerobic decomposer bacteria strip dissolved O₂.',
    watch:[
      {title:'1. Well-aerated legume soil (Rhizobium nodules + aerobic nitrification)',caption:'With 80% legume nodulation and 90% soil aeration, Rhizobium fixes 144 kg N ha⁻¹ yr⁻¹ and aerobic nitrifying bacteria oxidise ammonium into 110.1 mg kg⁻¹ soil NO₃⁻ (yielding 193.7 kg ha⁻¹ crop protein).',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Legume or runoff load',80);s.setSlider('Aeration or sink cover',90);}},
      {title:'2. Waterlogged anaerobic monsoon soil: denitrification (NO₃⁻ → N₂ gas escape)',caption:'When flooding drops soil aeration to 10%, anaerobic denitrifying bacteria (Pseudomonas) respire using NO₃⁻ (losing 133.2 kg N ha⁻¹ yr⁻¹), stripping soil nitrate down to 7.3 mg kg⁻¹ and arresting root active transport.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Legume or runoff load',30);s.setSlider('Aeration or sink cover',10);}},
      {title:'3. Powai Lake eutrophication cascade: algal bloom, bacterial BOD spike & hypoxia',caption:'High nitrate/sewage runoff (90%) triggers a surface algal bloom (85.6/100) that cuts underwater light to 27.2%; aerobic decomposer bacteria respiring dead plants raise BOD to 16.77 mg L⁻¹ and crash dissolved O₂ to 1.5 mg L⁻¹ (4% fish survival).',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Legume or runoff load',90);s.setSlider('Aeration or sink cover',20);}},
      {title:'4. Carbon cycle & Keeling Mauna Loa curve: fossil combustion + methane blanket',caption:'High fossil-fuel combustion and livestock/paddy methane emissions push atmospheric CO₂ to 429.7 ppm and CH₄ to 1,738 ppb (+1.48 °C anomaly), trapping outgoing long-wave infrared radiation.',cutaway:false,act:s=>{s.selectTab(0,2);s.setSlider('Legume or runoff load',80);s.setSlider('Aeration or sink cover',40);}},
      {title:'5. Western Ghats deforestation: biodiversity loss, topsoil erosion & flash flooding',caption:'Clearing 80% of forest canopy under heavy monsoon rain cuts biodiversity to 35.1%, accelerates topsoil erosion to 43.6 t ha⁻¹ yr⁻¹, and raises the river siltation flood index to 82.4/100.',cutaway:true,act:s=>{s.selectTab(0,3);s.setSlider('Legume or runoff load',80);s.setSlider('Aeration or sink cover',80);}},
    ],
    idealised:'Models soil nitrogen guild fluxes, the 7-step aquatic eutrophication DO/BOD cascade, global carbon cycle and greenhouse forcing, and tropical watershed deforestation impacts.',
  },
  biotech_fermenter_plasmid_lab: {
    challenge:{prompt:'Capture two contrasting recombinant plasmid, industrial fermenter, enzyme biotech, or GM crop trials (e.g. Optimum 37 °C vs Overheated 55 °C Fermenter, or Matched vs Mismatched Restriction Enzyme) to compare product yields.',check:s=>s.interacted&&s.readout().includes('Contrasting biotechnology trials captured for comparison:')},
    yourNumbers:s=>{const p=s.num('Ligase or temp or pest',90),sec=s.num('Culture or O₂ or refuge',80),m=s.tab(0),modes=['Recombinant Insulin','Industrial Fermenter','Yeast & Enzymes','GM Crops & CRISPR'];return `${modes[m]} · Primary ${p}% · Control ${sec}%`;},
    cutaway:'Cambridge 0610 Topics 21.1–21.3: Bacteria excel in biotechnology because they divide every 20 min, make complex molecules via the universal genetic code, raise few ethical concerns, and carry circular plasmids. To make recombinant human insulin: (1) cut human insulin gene with a restriction enzyme leaving sticky ends, (2) cut a bacterial plasmid with the SAME restriction enzyme for complementary sticky ends, (3) join with DNA ligase into a recombinant plasmid, (4) transform E. coli, and (5) culture in an industrial fermenter controlling steam, nutrients, cooling jacket temperature, pH, O₂ sparging & paddles.',
    watch:[
      {title:'1. Recombinant human insulin: SAME restriction enzyme sticky ends + DNA ligase',caption:'Cutting both human DNA and the bacterial plasmid with the same restriction enzyme creates complementary sticky ends sealed by DNA ligase (79.2% plasmid yield), producing 2,016 mg L⁻¹ pure human insulin after 8.2 h (24.6 doublings).',cutaway:false,act:s=>{s.selectTab(0,0);s.setSlider('Ligase or temp or pest',90);s.setSlider('Culture or O₂ or refuge',80);}},
      {title:'2. Mismatched restriction cut (<25%): zero sticky-end annealing & zero insulin',caption:'If the plasmid and human gene lack complementary sticky ends or DNA ligase is absent (15%), no recombinant plasmid forms and transformed E. coli produce 0 mg L⁻¹ human insulin.',cutaway:true,act:s=>{s.selectTab(0,0);s.setSlider('Ligase or temp or pest',15);s.setSlider('Culture or O₂ or refuge',80);}},
      {title:'3. Industrial fermenter at 37.5 °C optimum with cooling jacket, pH 6.82 & sterile O₂',caption:'With the cold-water jacket removing 73.5 kW of microbial respiratory heat to hold 37.5 °C and sterile air sparging keeping dissolved O₂ at 76.9%, fermenter product yield reaches 20.51 g L⁻¹.',cutaway:true,act:s=>{s.selectTab(0,1);s.setSlider('Ligase or temp or pest',45);s.setSlider('Culture or O₂ or refuge',90);}},
      {title:'4. Unjacketed fermenter overheat (55 °C): thermal enzyme denaturation crashes yield',caption:'When cooling fails and microbial respiration heats the broth to 55 °C, enzyme active sites denature and product yield collapses to 0.01 g L⁻¹.',cutaway:false,act:s=>{s.selectTab(0,1);s.setSlider('Ligase or temp or pest',80);s.setSlider('Culture or O₂ or refuge',40);}},
      {title:'5. Yeast & enzyme biotechnology at 39 °C: washing powders, pectinase & alginate lactase',caption:'At 39 °C, biological washing powder proteases/lipases remove 87.2% of stains, pectinase yields 93.5 mL clarified juice (83.4% clarity), immobilised lactase hydrolyses 86.6% of lactose, and yeast evolves 103.9 cm³ CO₂.',cutaway:true,act:s=>{s.selectTab(0,2);s.setSlider('Ligase or temp or pest',40);s.setSlider('Culture or O₂ or refuge',80);}},
    ],
    idealised:'Models the 5-step recombinant plasmid human insulin pipeline, 6-parameter industrial fermenter kinetics and cooling-jacket heat balance, enzyme/yeast biotechnology, and GM crop / CRISPR comparisons.',
  },
};
