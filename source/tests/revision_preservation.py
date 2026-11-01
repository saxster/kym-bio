"""Check an explicitly frozen authorised revision alongside historical baselines.

Historical byte snapshots remain unchanged. A changed file must be listed with its
reviewed SHA-256; unlisted files continue through the original preservation check.
"""
import hashlib,json,os
from pathlib import Path

def revised_file(root, name, check, report):
    manifest=os.environ.get('BIO_REVISION_MANIFEST')
    if not manifest:
        return False
    entries=json.loads(Path(manifest).read_text())['files']
    if name not in entries:
        return False
    digest=hashlib.sha256((root.parent/name).read_bytes()).hexdigest()
    check(digest==entries[name], 'Frozen authorised revision '+name)
    report.setdefault('authorised_revision_files',[]).append(name)
    return True
