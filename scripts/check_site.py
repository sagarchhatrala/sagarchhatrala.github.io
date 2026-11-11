"""Validate the actual publication artifact and prevent retired routes returning."""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
site = (ROOT / (sys.argv[1] if len(sys.argv) > 1 else '_site')).resolve()
expected = {'experience/index.html', 'purpose-trace/index.html', 'index.html', 'agent-circuit-breaker/index.html', 'horizon-agent-containment/index.html'}
actual = {path.relative_to(site).as_posix() for path in site.rglob('*.html')}
assert actual == expected, ('Unexpected public page routes', actual)
assert not any(path.suffix in {'.py', '.md', '.toml', '.yml'} for path in site.rglob('*')), 'Source/doc files must remain on GitHub, outside the website artifact'

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.links, self.ids = path, [], set()
        self.feed(path.read_text(encoding='utf-8'))
    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if data.get('id'): self.ids.add(data['id'])
        for name in ('href', 'src'):
            if data.get(name): self.links.append(data[name])

pages = {path.resolve(): Page(path) for path in site.rglob('*.html')}
count = 0
for path, page in pages.items():
    for link in page.links:
        url = urlsplit(link)
        if url.scheme and url.netloc != 'sagarchhatrala.github.io': continue
        if url.path.startswith('/') or url.netloc:
            target = site / unquote(url.path.lstrip('/'))
        else:
            target = path.parent / unquote(url.path) if url.path else path
        if target.is_dir(): target /= 'index.html'
        target = target.resolve()
        assert target.is_relative_to(site), ('Escaping link', path, link)
        assert target.is_file(), ('Broken local link', path, link)
        if url.fragment and target.suffix == '.html':
            assert unquote(url.fragment) in pages[target].ids, ('Broken fragment', path, link)
        count += 1
    for payload in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', path.read_text(encoding='utf-8'), re.S):
        json.loads(payload)
for css in site.rglob('*.css'):
    for ref in re.findall(r'url\([\'"]?([^\)\'\"]+)', css.read_text(encoding='utf-8')):
        if not ref.startswith('data:'): assert (css.parent / ref).resolve().is_file(), ('Missing CSS asset', ref)
for path in site.rglob('*.json'):
    json.loads(path.read_text(encoding='utf-8'))
locations = {node.text for node in ET.parse(site / 'sitemap.xml').iter() if node.tag.endswith('loc')}
assert locations == {'https://sagarchhatrala.github.io/experience/', 'https://sagarchhatrala.github.io/purpose-trace/', 'https://sagarchhatrala.github.io/', 'https://sagarchhatrala.github.io/agent-circuit-breaker/', 'https://sagarchhatrala.github.io/horizon-agent-containment/'}
for name in ('hac', 'hac-demo', 'horizon-agent-containment/presentation', 'horizon-agent-containment/demo-assets', 'horizon-agent-containment/docs', 'agent-circuit-breaker/releases'):
    assert not (site / name).exists(), ('Retired path in build', name)

# Keep public release claims tied to the included release evidence.
acb = site / 'agent-circuit-breaker'
project = json.loads((acb / 'project.json').read_text())
verification = json.loads((acb / 'verification.json').read_text())
recorded = json.loads((acb / 'evidence.json').read_text())
profile = json.loads((site / 'profile.json').read_text())
profile_acb = next(item for item in profile['projects'] if item.get('abbreviation') == 'ACB')
assert project['version'] == profile_acb['version'] == recorded['version'] == verification['version']
assert project['source_commit'] == recorded['source_commit'] == verification['source_revision']
assert project['install'] == profile_acb['install']
assert not recorded['runtime_validation']['failures']
assert all(item['passed'] for item in recorded['runtime_validation']['results'])
minio = json.loads((acb / 'owner-minio.json').read_text())
isolation = json.loads((acb / 'owner-isolation.json').read_text())
assert minio['version'] == project['version']
assert minio['passed'] == minio['checks'] == len(minio['scenarios']) == verification['authoritative_wheel_minio_checks']
assert all(item['passed'] for item in minio['scenarios'])
assert len(isolation['checks']) == verification['authoritative_wheel_container_isolation_checks']
assert all(item['passed'] for item in isolation['checks'])
published = project['evidence']['published_validation']
assert published['local_tests'] == verification['regression_tests']
assert published['local_subtests'] == verification['regression_subtests']
assert published['legacy_live_checks'] == verification['legacy_live_checks']
for name in ('index.html', 'llms.txt'):
    assert project['version'] in (acb / name).read_text(), ('Missing current release', name)
assert project['install'] in (acb / 'index.html').read_text()
assert project['evidence']['release_demo_version'] == '1.7.0', 'Do not relabel historical video'
print(f'Validated five pages, {count} local references, structured data, fonts, sitemap, and retired-route exclusion.')
print('Validated ACB release metadata, current runtime examples, and published execution evidence.')
