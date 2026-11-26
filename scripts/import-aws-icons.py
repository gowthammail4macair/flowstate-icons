"""Freeze official AWS service icons locally; pass a downloaded official ZIP."""
import json
import pathlib
import re
import sys
import zipfile

root = pathlib.Path(__file__).resolve().parents[1]
target = root / 'public' / 'aws-icons'
target.mkdir(exist_ok=True)
aliases = {
    'Amazon-Simple-Storage-Service': 's3',
    'Amazon-Elastic-Container-Service': 'ecs',
    'Amazon-Elastic-Kubernetes-Service': 'eks',
    'Amazon-Elastic-Container-Registry': 'ecr',
    'Amazon-Virtual-Private-Cloud': 'vpc',
    'AWS-Identity-and-Access-Management': 'iam',
    'Elastic-Load-Balancing': 'elb',
    'Amazon-Simple-Queue-Service': 'sqs',
    'Amazon-Simple-Notification-Service': 'sns',
    'Amazon-Simple-Email-Service': 'ses',
}
catalog = []
with zipfile.ZipFile(sys.argv[1]) as archive:
    for member in sorted(archive.namelist()):
        if not member.startswith('Architecture-Service-Icons_') or '/64/' not in member or not member.endswith('_64.svg'):
            continue
        name = pathlib.PurePosixPath(member).name.removeprefix('Arch_').removesuffix('_64.svg')
        slug = aliases.get(name, re.sub(r'^(Amazon-|AWS-)', '', name).lower())
        slug = re.sub(r'[^a-z0-9]+', '-', slug).strip('-')
        icon_id = 'aws-' + slug
        # Some services appear under two AWS categories in the official package.
        if any(icon['id'] == icon_id for icon in catalog):
            continue
        category = member.split('/')[1].removeprefix('Arch_').replace('-', ' ')
        data = archive.read(member)
        if b'<script' in data.lower() or b'javascript:' in data.lower():
            raise ValueError('Unexpected executable asset')
        (target / (icon_id + '.svg')).write_bytes(data)
        catalog.append({'id': icon_id, 'label': name.replace('-', ' '), 'category': category,
                        'src': '/aws-icons/' + icon_id + '.svg'})
if len({icon['id'] for icon in catalog}) != len(catalog):
    raise ValueError('Duplicate icon identifier')
(root / 'src' / 'aws-icons.json').write_text(json.dumps(catalog, indent=2) + '\n')
print(f'Imported {len(catalog)} official AWS service icons from {pathlib.Path(sys.argv[1]).name}')
