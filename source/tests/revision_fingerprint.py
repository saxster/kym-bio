"""Freeze revised chapter content without blocking unrelated concurrent chapters."""
import hashlib

def revision_digest(path):
    data=path.read_bytes()
    if path.name == 'enhancements.js':
        # The shared table is ordered by chapter. Freeze the module wrapper and
        # every Chapter 11–15 entry; Chapters 1–10 are independently revised.
        marker=b'  dna_base_pairing: {'
        assert data.count(marker)==1, 'Expected one Chapter 11 enhancement boundary'
        data=data[:data.index(b'  redi_jars: {')]+data[data.index(marker):]
    return hashlib.sha256(data).hexdigest()
