// Explicit teaching accounts. No fitted plant kinetics, physical clock or growth predictor.
export function atomAccount(batches=1) {
  const n=Math.max(1,Math.min(4,Math.round(batches)));
  return {n,co2:6*n,waterIn:12*n,glucose:n,oxygen:6*n,waterOut:6*n,
    input:[6*n,24*n,24*n],output:[6*n,24*n,24*n],massIn:480*n,massOut:480*n};
}
export function rateAccount(light=20,carbon=80,temperature=25) {
  const L=Math.max(0,Math.min(100,light)),C=Math.max(0,Math.min(100,carbon)),T=Math.max(5,Math.min(45,temperature));
  const thermal=Math.max(0,100-((T-25)/2)**2),gross=Math.min(L,C,thermal);
  const limits=[['light',L],['CO₂',C],['temperature',thermal]].filter(([,v])=>Math.abs(v-gross)<1e-9).map(([s])=>s);
  return {L,C,T,thermal,gross,respiration:10,net:gross-10,limits};
}
export function compareTrials(a,b) {
  if(!a||!b)return {valid:false,changed:[],reason:'Capture two trials first.'};
  const changed=['L','C','T'].filter(k=>a[k]!==b[k]);
  return {valid:changed.length===1,changed,reason:changed.length===1?'One factor changed.':changed.length===0?'No factor changed.':'More than one factor changed.'};
}
export const sapSteps=[
 ['Evaporate at the leaf','Vapour leaves through stomata','Leaf liquid comes under tension','Cohesion transmits the pull','Root water replaces the loss'],
 ['Load at a mature leaf','Water enters by osmosis','Source pressure drives bulk flow','Unload and use/store at the root','Leaf source → root sink'],
 ['Release stored carbohydrate','Water enters source phloem','Pressure drives sap towards the shoot','Unload at the growing shoot','Storage source → shoot sink'],
];
