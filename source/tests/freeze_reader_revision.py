"""Record explicit revised hashes; never rewrite historical preservation baselines."""
from pathlib import Path
import hashlib,json,sys
root=Path(__file__).resolve().parents[2]
files={}
for n in range(6,11):
    entries=json.loads((root/f'source/tests/ch{n:02}-preserved.json').read_text())['files']
    for name,old in entries.items():
        p=root/name
        if not p.is_file():continue
        digest=hashlib.sha256(p.read_bytes()).hexdigest()
        if digest!=old['sha256']:files[name]=digest
out=Path(sys.argv[1]);out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps({'purpose':'Explicit final revision hashes, including retained prior Chapters 1–5 edits; historical baselines stay unchanged.','files':files},indent=2)+'\n')
print(f'Frozen {len(files)} revised files: {out}')
