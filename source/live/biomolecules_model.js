// Invented teaching accounts, not fitted experimental data. No calibrated kinetics.
export function energyAccount(lowering=35) {
  const drop=Math.max(0,Math.min(45,lowering));
  return {start:20,end:10,uncatPeak:90,catPeak:90-drop,
    forward:70-drop,reverse:80-drop,delta:-10,lowering:drop};
}
export function conditionsAccount(temperature=20,pH=7,exposed=false) {
  const encounters=2**((temperature-20)/20);
  const fraction=1/(1+Math.exp((temperature-50)/4));
  const chemistry=Math.exp(-(((pH-7)/2)**2));
  const survival=exposed?.15:1;
  const activeFraction=fraction*survival;
  return {encounters,fraction,chemistry,survival,activeFraction,rate:encounters*activeFraction*chemistry};
}
export const foodTests=[
  {name:'Benedict’s',target:'Reducing sugar',positive:'Coloured precipitate',negative:'Stays blue',control:'Glucose',present:false,method:'Teacher-managed water bath; observe precipitate.',limit:'Sucrose can be negative before hydrolysis; hue alone gives no exact mass.'},
  {name:'Iodine',target:'Starch',positive:'Blue-black',negative:'Yellow-brown',control:'Starch',present:true,method:'Iodine solution added to a separate sample.',limit:'This test does not identify every carbohydrate or glucose.'},
  {name:'Biuret',target:'Protein / peptide bonds',positive:'Lilac / purple',negative:'Stays blue',control:'Protein',present:true,method:'Prepared biuret reagent added under supervision.',limit:'A positive does not establish a functional folded enzyme.'},
  {name:'Emulsion',target:'Fats and oils',positive:'White cloudy emulsion',negative:'Clear',control:'Oil',present:true,method:'Ethanol extract added to water; no flames or ethanol heating.',limit:'A cloudy blank invalidates a cloudiness comparison.'},
  {name:'DCPIP',target:'Vitamin C',positive:'Dye loses colour',negative:'Dye colour remains',control:'Vitamin C',present:false,method:'Compare with water blank and known vitamin C.',limit:'Acid can turn dye pink; sample colour and other reducers can interfere.'},
];
export function foodResult(test,control,ran) {
  if(!ran)return {valid:false,status:'Not run',observation:'Run this comparison first.'};
  if(control!==0)return {valid:false,status:'Inconclusive',observation:control===1?'Known positive failed.':'Blank gives a misleading response.'};
  const q=foodTests[test];return {valid:true,status:q.present?'Detected':'Not detected',observation:q.present?q.positive:q.negative};
}
