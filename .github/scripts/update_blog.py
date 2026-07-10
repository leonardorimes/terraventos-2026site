#!/usr/bin/env python3
"""
Verifica o feed RSS do TerraVentos Substack e atualiza BlogSection.tsx
com novas postagens em português (sem tradução automática).
"""
import os
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from datetime import datetime

FEED_URL = "https://terraventos.substack.com/feed"
BLOG_FILE = "src/components/BlogSection.tsx"
MAX_POSTS = 5

MONTHS = {
    'pt': ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    'en': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    'es': ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
}


def fetch_feed():
    result = subprocess.run(
        ['curl', '-sL', '--max-time', '30', FEED_URL],
        capture_output=True, timeout=35
    )
    if result.returncode != 0:
        raise RuntimeError(f"curl falhou: {result.stderr.decode()}")
    return result.stdout


def parse_rss(xml_bytes):
    root = ET.fromstring(xml_bytes)
    ns = {
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'media': 'http://search.yahoo.com/mrss/',
    }
    posts = []
    for item in root.find('channel').findall('item')[:MAX_POSTS]:
        title = item.findtext('title', '').strip()
        url = item.findtext('link', '').strip()

        raw = item.findtext('content:encoded', '', ns) or item.findtext('description', '')
        desc = re.sub(r'<[^>]+>', ' ', raw)
        desc = re.sub(r'\s+', ' ', desc).strip()[:400]

        image = ''
        enc = item.find('enclosure')
        if enc is not None:
            image = enc.get('url', '')
        if not image:
            mc = item.find('media:content', ns)
            if mc is not None:
                image = mc.get('url', '')
        if not image:
            m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', raw)
            if m:
                image = m.group(1)

        pub = item.findtext('pubDate', '').strip()
        date_obj = None
        for fmt in ['%a, %d %b %Y %H:%M:%S %z', '%a, %d %b %Y %H:%M:%S GMT']:
            try:
                date_obj = datetime.strptime(pub, fmt)
                break
            except ValueError:
                continue

        posts.append({'title': title, 'url': url, 'description': desc, 'image': image, 'date_obj': date_obj})
    return posts


def format_date(date_obj, lang):
    if not date_obj:
        return ''
    d, mo, y = date_obj.day, date_obj.month - 1, date_obj.year
    m = MONTHS[lang][mo]
    return f'{m} {d}, {y}' if lang == 'en' else f'{d} {m} {y}'


def get_urls_from_file(content):
    return set(re.findall(r'url:\s*["\']([^"\']+)["\']', content))


def extract_posts_block_bounds(content):
    m = re.search(r'(\n\s*const posts: Record<string, BlogPost\[\]> = \{)', content)
    if not m:
        raise ValueError("Bloco 'const posts' não encontrado em BlogSection.tsx")
    start = m.start()
    brace_pos = content.index('{', m.start())
    depth = 0
    for i in range(brace_pos, len(content)):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                if end < len(content) and content[end] == ';':
                    end += 1
                return start, end
    raise ValueError("Fim do bloco 'const posts' não encontrado")


def extract_lang_posts(content, lang):
    m = re.search(rf'\b{lang}:\s*\[', content)
    if not m:
        return []
    i = m.end()
    depth = 1
    while i < len(content) and depth:
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
        i += 1
    array = content[m.end():i - 1]

    posts = []
    j = 0
    while j < len(array):
        if array[j] == '{':
            depth = 1
            k = j + 1
            while k < len(array) and depth:
                if array[k] == '{':
                    depth += 1
                elif array[k] == '}':
                    depth -= 1
                k += 1
            obj = array[j + 1:k - 1]

            def field(name, s=obj):
                fm = re.search(rf'{name}:\s*"((?:[^"\\]|\\.)*)"', s)
                return fm.group(1) if fm else ''

            posts.append({k: field(k) for k in ('title', 'summary', 'url', 'image', 'date')})
            j = k
        else:
            j += 1
    return posts


def escape_tsx(s):
    return s.replace('\\', '\\\\').replace('"', '\\"')


def build_posts_block(all_langs):
    lang_keys = list(all_langs.keys())
    lines = ['  const posts: Record<string, BlogPost[]> = {']
    for li, lang in enumerate(lang_keys):
        posts = all_langs[lang]
        lines.append(f'    {lang}: [')
        for pi, p in enumerate(posts):
            comma = ',' if pi < len(posts) - 1 else ''
            lines += [
                '      {',
                f'        title: "{escape_tsx(p["title"])}",',
                f'        summary: "{escape_tsx(p["summary"])}",',
                f'        url: "{p["url"]}",',
                f'        image: "{p["image"]}",',
                f'        date: "{p["date"]}"',
                f'      }}{comma}',
            ]
        array_comma = ',' if li < len(lang_keys) - 1 else ''
        lines.append(f'    ]{array_comma}')
    lines.append('  };')
    return '\n'.join(lines)


def main():
    print('Buscando feed RSS...')
    feed_items = parse_rss(fetch_feed())
    print(f'  {len(feed_items)} postagens no feed')

    with open(BLOG_FILE, encoding='utf-8') as f:
        content = f.read()

    current_urls = get_urls_from_file(content)
    new_items = [p for p in feed_items if p['url'] not in current_urls]

    if not new_items:
        print('Nenhuma postagem nova — nada a fazer.')
        return

    print(f'  {len(new_items)} postagem(ns) nova(s) encontrada(s).')

    # Usa o mesmo conteúdo (português) para os 3 idiomas
    new_by_lang = {lang: [] for lang in ('pt', 'en', 'es')}
    for item in new_items:
        for lang in ('pt', 'en', 'es'):
            new_by_lang[lang].append({
                'title': item['title'],
                'summary': item['description'],
                'url': item['url'],
                'image': item['image'],
                'date': format_date(item['date_obj'], lang),
            })

    all_langs = {}
    for lang in ('pt', 'en', 'es'):
        existing = extract_lang_posts(content, lang)
        all_langs[lang] = (new_by_lang[lang] + existing)[:MAX_POSTS]

    start, end = extract_posts_block_bounds(content)
    new_block = build_posts_block(all_langs)
    new_content = content[:start] + '\n' + new_block + content[end:]

    with open(BLOG_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print('BlogSection.tsx atualizado com sucesso!')


if __name__ == '__main__':
    main()
