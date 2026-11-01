import * as THREE from 'three';
import { Live } from './core.js';
import { makeStage, addAtom, addBond, addArrow, webglOK } from './three_kit.js';

Live.register('seed_flame3d', (stage, params, api) => {
  const c = api.colors();
  const say = api.readout();

  let mode = 0; // 0 = Side-by-side 3D, 1 = Flame Combustion (Chaos), 2 = Seed Cell (ATP & Order)
  let rate = 1.0;

  api.tabs(['1. Side-by-Side 3D', '2. Candle Flame (Chaos)', '3. Seed Cell (ATP & Order)'], (idx) => {
    mode = idx;
    updateVisibility();
    updateReadout();
  });

  api.slider('Reaction speed', {
    min: 0.2, max: 2.0, step: 0.2, value: rate,
    fmt: (v) => `${v.toFixed(1)}×`,
    onInput: (v) => { rate = v; updateReadout(); },
  });

  function updateReadout() {
    if (mode === 0) {
      say(`<b>3D Molecular Comparison</b>: On the left, candle combustion scatters carbon and oxygen atoms into random thermal chaos. On the right, the living seed cell uses glowing ochre <b>ATP</b> coins to assemble monomers into an ordered 3D living helix/microfibril.`);
    } else if (mode === 1) {
      say(`<b>Candle Flame (Uncontrolled Combustion)</b>: Hydrocarbon fuel + O₂ breaks apart in one violent step (~1,000 °C). 100% of the chemical energy escapes as random kinetic motion of CO₂ and H₂O molecules.`);
    } else {
      say(`<b>Living Seed Cell (Coupled ATP Metabolism)</b>: Stepwise oxidation at 28 °C recharges <b>ATP</b> (three repelling phosphate spheres), which docks at the assembly site and locks new carbon building blocks into ordered cellular structure.`);
    }
  }

  if (!webglOK()) {
    const k = api.canvas(640, 300, '2D fallback comparing candle combustion chaos with ATP-driven cellular polymer assembly');
    api.loop(() => {
      const ctx = k.ctx;
      ctx.fillStyle = c.paper;
      ctx.fillRect(0, 0, 640, 300);
      api.draw.text(ctx, 'Flame: Fuel + O₂ → scattered CO₂ + H₂O + heat (chaos)', 320, 120, { size: 14, weight: 700, align: 'center', color: c.proton });
      api.draw.text(ctx, 'Seed Cell: Fuel + O₂ → ATP → ordered polymers & DNA copies', 320, 175, { size: 14, weight: 700, align: 'center', color: c.green });
    });
    updateReadout();
    return { destroy() {} };
  }

  const three = makeStage(stage, api, {
    height: 340,
    camPos: [0, 1.8, 10.2],
    target: [0, 0, 0],
    label: '3D molecular comparison of candle flame combustion versus ATP-coupled cellular polymer assembly in a germinating seed',
  });

  const flameGroup = new THREE.Group();
  const seedGroup = new THREE.Group();
  three.root.add(flameGroup);
  three.root.add(seedGroup);

  // Build Flame Group: glowing core + flying CO2 (O=C=O) and H2O molecules scattering outward
  const flameCore = new THREE.Mesh(
    new THREE.ConeGeometry(0.85, 2.2, 24),
    new THREE.MeshStandardMaterial({ color: 0xe07a5f, emissive: 0xa94730, emissiveIntensity: 0.55, transparent: true, opacity: 0.78 })
  );
  flameCore.position.set(0, -1.1, 0);
  flameGroup.add(flameCore);

  const gasMols = [];
  for (let i = 0; i < 12; i++) {
    const g = new THREE.Group();
    if (i % 2 === 0) {
      // CO2 linear molecule (O-C-O)
      addAtom(g, 'C', [0, 0, 0], 0.24);
      addAtom(g, 'O', [-0.46, 0, 0], 0.21);
      addAtom(g, 'O', [0.46, 0, 0], 0.21);
      addBond(g, [-0.46, 0, 0], [0.46, 0, 0], 0.06);
    } else {
      // H2O bent molecule
      addAtom(g, 'O', [0, 0, 0], 0.22);
      addAtom(g, 'H', [-0.32, 0.24, 0], 0.15);
      addAtom(g, 'H', [0.32, 0.24, 0], 0.15);
    }
    const angle = (i / 12) * Math.PI * 2;
    gasMols.push({
      mesh: g,
      angle,
      speed: 0.8 + (i % 3) * 0.35,
      phase: i * 0.55,
    });
    flameGroup.add(g);
  }

  // Build Seed Cell Group: ordered 3D helical biopolymer / microfibril + orbiting glowing ATP triphosphate carriers
  const orderedNodes = [];
  const totalMonomers = 14;
  for (let i = 0; i < totalMonomers; i++) {
    const theta = i * 0.58;
    const y = -1.9 + i * 0.28;
    const x = Math.cos(theta) * 0.95;
    const z = Math.sin(theta) * 0.95;
    const m = addAtom(seedGroup, i % 3 === 0 ? 'O' : 'C', [x, y, z], 0.25);
    if (i > 0) {
      const prev = orderedNodes[i - 1];
      addBond(seedGroup, [prev.x, prev.y, prev.z], [x, y, z], 0.08, 0x2e604a);
    }
    orderedNodes.push({ x, y, z, mesh: m });
  }

  // 3 ATP molecules (3 linked ochre/terracotta phosphate spheres P-P-P) delivering energy to the growing tip
  const atpList = [];
  for (let k = 0; k < 3; k++) {
    const atp = new THREE.Group();
    addAtom(atp, 'N', [-0.45, 0, 0], 0.20); // Adenosine base
    addAtom(atp, 'S', [-0.1, 0, 0], 0.18);  // P1
    addAtom(atp, 'S', [0.22, 0, 0], 0.18);  // P2
    addAtom(atp, 'O', [0.54, 0, 0], 0.20);  // Terminal P3
    addBond(atp, [-0.45, 0, 0], [0.54, 0, 0], 0.06, 0x936022);
    seedGroup.add(atp);
    atpList.push({ mesh: atp, offset: (k * Math.PI * 2) / 3 });
  }

  function updateVisibility() {
    if (mode === 0) {
      flameGroup.visible = true;
      seedGroup.visible = true;
      flameGroup.position.set(-2.5, 0, 0);
      seedGroup.position.set(2.5, 0, 0);
    } else if (mode === 1) {
      flameGroup.visible = true;
      seedGroup.visible = false;
      flameGroup.position.set(0, 0, 0);
    } else {
      flameGroup.visible = false;
      seedGroup.visible = true;
      seedGroup.position.set(0, 0, 0);
    }
    three.render();
  }

  api.loop((dt, t) => {
    const time = t * rate;
    // Animate scattering combustion molecules in Flame Group
    gasMols.forEach((gm, idx) => {
      const cyc = (time * gm.speed + gm.phase) % 2.6;
      const r = 0.4 + cyc * 0.95;
      gm.mesh.position.set(
        Math.cos(gm.angle + cyc) * r,
        -0.8 + cyc * 1.15,
        Math.sin(gm.angle + cyc) * r
      );
      gm.mesh.rotation.set(time * 2 + idx, time * 1.5, idx);
    });
    flameCore.scale.set(1 + Math.sin(time * 6) * 0.06, 1 + Math.cos(time * 7) * 0.08, 1 + Math.sin(time * 6) * 0.06);

    // Animate Seed Group: gentle rotation of ordered biopolymer + ATP docking cycle
    seedGroup.rotation.y = time * 0.35;
    atpList.forEach((a) => {
      const ang = time * 1.2 + a.offset;
      const rad = 1.45 + Math.sin(ang * 2) * 0.35;
      a.mesh.position.set(Math.cos(ang) * rad, Math.sin(ang) * 1.2, Math.sin(ang) * rad);
      a.mesh.rotation.y = -ang;
    });

    three.render();
  });

  updateVisibility();
  updateReadout();
  // makeStage registers disposal with api.onCleanup.
  return {};
}, { label: 'Inspect in 3D: Flame vs. Seed Cell', three: true });
