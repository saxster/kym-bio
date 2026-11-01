"""Copy the current working book for reproducible local verification amid other edits."""
from pathlib import Path
import shutil,sys
root=Path(__file__).resolve().parents[2]
target=Path(sys.argv[1]).resolve()
if target.exists():raise SystemExit('Use a fresh verification directory: '+str(target))
if target==root or root in target.parents:raise SystemExit('Snapshot must be outside the working repository')
shutil.copytree(root,target,symlinks=True,ignore=shutil.ignore_patterns('.git','graft','build','__pycache__','.DS_Store'))
print('Frozen working copy: '+str(target))
