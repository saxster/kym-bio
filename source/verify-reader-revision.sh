#!/usr/bin/env bash
# Local verification for the authorised Chapters 1–5 reader revision.
set -euo pipefail
cd "$(dirname "$0")"
PYTHON_BIN="${BIO_PYTHON:-python3}"
"$PYTHON_BIN" build.py --site build/site
node --input-type=module <<'JS'
import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=fs.readFileSync('live/w_monsoon_imbibition.js','utf8');
const body=source.match(/function metrics\(w\) \{([\s\S]*?)\n  \}/)[1];
const model=new Function('w',body);
assert.equal(model(10).wetMass,50);
assert.equal(model(65).wetMass,128.6);
let previous=0;
for(let water=10;water<=65;water+=5){
 const m=model(water);
 assert.ok(Math.abs(m.wetMass*(1-water/100)-45)<0.05,'45g non-water matter conserved within rounding');
 assert.ok(m.wetMass>previous,'mass increases with water fraction');
 assert.ok(m.mobility>0&&m.mobility<=1,'illustrative mobility stays bounded');
 previous=m.wetMass;
}
console.log('Hydration: all 12 slider states passed');
JS
"$PYTHON_BIN" tests/qa_reader_atlas.py build/site/index.html
"$PYTHON_BIN" livetest.py build/site/index.html /tmp/bio-reader-revision-verified --offline
