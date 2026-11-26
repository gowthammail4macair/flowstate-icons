"""Build a reproducible, integrity-addressed FlowState icon library."""
import argparse
import hashlib
import json
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('version')
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
catalog = json.loads((root / 'catalog.json').read_text())
files = {p.relative_to(root / 'public').as_posix(): p.read_bytes()
         for p in (root / 'public').rglob('*') if p.is_file()}
for icon in catalog:
    for key in ('thumbnail', 'canvas', 'descriptor'):
        if key in icon and icon[key] not in files:
            raise ValueError(f"Missing {key} for {icon['id']}")
files['catalog.json'] = (root / 'catalog.json').read_bytes()
for path in sorted((root / 'src').glob('*.json')):
    files['metadata/' + path.name] = path.read_bytes()
files['metadata/software-icons.mjs'] = (root / 'src/software-icons.mjs').read_bytes()
for path in [root / 'RIGHTS.md', root / 'LICENSE', root / 'LICENSE-MIT', root / 'LICENSE-APACHE', root / 'NOTICE',
             root / 'docs/LICENSE.drawio-stencils.txt']:
    files['notices/' + path.name] = path.read_bytes()
digest = lambda data: hashlib.sha256(data).hexdigest()
hashes = {name: digest(data) for name, data in sorted(files.items())}
manifest = dict(format=1, version=args.version, iconCount=len(catalog), files=hashes)
files['manifest.json'] = json.dumps(manifest, sort_keys=True, separators=(',', ':')).encode()
args.output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(args.output, 'w') as z:
    for name, data in sorted(files.items()):
        item = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
        item.create_system = 3
        item.external_attr = 0o100644 << 16
        z.writestr(item, data, compress_type=zipfile.ZIP_DEFLATED, compresslevel=6)
print(json.dumps(dict(version=args.version, filename=args.output.name, sha256=digest(args.output.read_bytes()),
                      bytes=args.output.stat().st_size, iconCount=len(catalog)),indent=2))

