#!/usr/bin/env python3
"""W4.AD art-direction prototype only. Derives ad.html from the frozen R1.P A+ snapshot.

Product index/assets/tests are never written. Every edit asserts exactly one hit, so a drifted source fails loudly.
"""
import hashlib, json, math, re, subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
APLUS = ROOT / 'docs/showcase-v031/evidence/w4rp/preview/aplus.html'
APLUS_SHA = 'fb37809dc42bca9b8bc1e1f7d486795471a70cb36c1f5060babb612426e52a9d'
PRODUCT = 'b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5'

src = APLUS.read_text()
sha = lambda s: hashlib.sha256(s.encode()).hexdigest()
assert sha(src) == APLUS_SHA, 'A+ snapshot drifted from the reviewed R1.P candidate'
out = src
log = []


def sub1(old, new, why):
    global out
    n = out.count(old)
    assert n == 1, (why, n, old[:120])
    out = out.replace(old, new, 1)
    log.append(why)


def resub1(pattern, new, why):
    global out
    hits = re.findall(pattern, out)
    assert len(hits) == 1, (why, len(hits), pattern[:120])
    out = re.sub(pattern, lambda _m: new, out, count=1)
    log.append(why)


# ---------------------------------------------------------------- head / scripts
sub1('<link rel="stylesheet" href="r1p.css">', '<link rel="stylesheet" href="r1p.css">\n<link rel="stylesheet" href="ad.css">', 'head: scoped AD stylesheet after r1p.css')
sub1('<script src="assets/js/showcase-v23.js" defer></script>', '<script src="assets/js/showcase-v23.js" defer></script>\n<script src="ad.js" defer></script>', 'body: progressive rail enhancement')

# ---------------------------------------------------------------- P1 DOCTRINE: terminal content, not geometry
MODES = ['RELIC', 'ECHO', 'CONTROL', 'BIO', 'MYTH']
DRIFT = [16, 24, 3, 12, 30]  # CONTROL is held closest to the void: "слой контроля удержан"


def fracture_svg():
    cx = cy = 170
    r = 112
    parts = []
    for i, (mode, d) in enumerate(zip(MODES, DRIFT)):
        a0, a1 = -90 + i * 72 + 6, -90 + i * 72 + 66
        mid = math.radians((a0 + a1) / 2)
        ox, oy = d * math.cos(mid), d * math.sin(mid)
        p = lambda a, rr: (cx + ox + rr * math.cos(math.radians(a)), cy + oy + rr * math.sin(math.radians(a)))
        (x0, y0), (x1, y1) = p(a0, r), p(a1, r)
        (u0, v0), (u1, v1) = p(a0, r - 14), p(a1, r - 14)
        held = mode == 'CONTROL'
        cls = 'ad-arc held' if held else 'ad-arc'
        parts.append(f'<path class="{cls}" d="M{x0:.1f} {y0:.1f}A{r} {r} 0 0 1 {x1:.1f} {y1:.1f}L{u1:.1f} {v1:.1f}A{r-14} {r-14} 0 0 0 {u0:.1f} {v0:.1f}Z"/>')
        lx, ly = cx + (r + 30 + d) * math.cos(mid), cy + (r + 30 + d) * math.sin(mid)
        anchor = 'middle' if abs(math.cos(mid)) < .35 else ('start' if math.cos(mid) > 0 else 'end')
        parts.append(f'<text x="{lx:.1f}" y="{ly + 4:.1f}" text-anchor="{anchor}" class="ad-arc-label{" held" if held else ""}">{mode}</text>')
        if held:  # two clamps hold the control arc in place
            for a in (a0 + 4, a1 - 4):
                (c0x, c0y), (c1x, c1y) = p(a, r + 8), p(a, r - 22)
                parts.append(f'<path class="ad-clamp" d="M{c0x:.1f} {c0y:.1f}L{c1x:.1f} {c1y:.1f}"/>')
    ticks = ''.join(
        f'<path d="M{cx + 150 * math.cos(math.radians(a)):.1f} {cy + 150 * math.sin(math.radians(a)):.1f}L{cx + 156 * math.cos(math.radians(a)):.1f} {cy + 156 * math.sin(math.radians(a)):.1f}"/>'
        for a in range(0, 360, 10))
    return ('<svg viewBox="-20 -20 380 380" role="presentation"><g class="ad-ticks">' + ticks + '</g>'
            f'<circle class="ad-ghost" cx="{cx}" cy="{cy}" r="{r - 7}"/>'
            f'<circle class="ad-inner" cx="{cx}" cy="{cy}" r="64"/>'
            + ''.join(parts) +
            f'<g class="ad-void"><circle cx="{cx}" cy="{cy}" r="24"/><path d="M{cx - 30} {cy + 30}L{cx + 30} {cy - 30}"/></g>'
            f'<text x="{cx}" y="{cy + 50}" text-anchor="middle" class="ad-void-label">AXIOM</text></svg>')


fracture = ('<div class="ad-fracture" aria-hidden="true">' + fracture_svg() +
            '<span class="ad-fracture-cap">ЦЕЛОЕ → ПЯТЬ СЛЕДОВ</span></div>')
ledger = ('<div class="ad-state"><span class="ad-state-k">СОСТОЯНИЕ AXIOM</span>'
          '<ul><li><i>01</i>ФРАГМЕНТИРОВАН</li><li><i>02</i>НЕ СТЁРТ</li><li><i>03</i>НЕ ВОССТАНОВЛЕН</li></ul></div>')
sub1('<span class="r1p-terminal-strata" aria-hidden="true"></span></div>',
     '<span class="r1p-terminal-strata" aria-hidden="true"></span>' + fracture + ledger + '</div>',
     'doctrine: fractured ring + canonical state ledger fill the terminal lower register')
sub1('Она передаёт архивный голос и не является цитатой из канонического документа.</figcaption>',
     'Она передаёт архивный голос и не является цитатой из канонического документа. Три состояния в нижнем регистре терминала соответствуют канонической модели фрагментации AXIOM.</figcaption>',
     'doctrine: provenance of the state ledger')

# Five fragments become five *recognition traces* (Canon 03.03 B05.S05); AXIOM ∅ keeps the nature of each mode.
TRACES = [
    ('RELIC', 'Ядро под печатью', 'Технократы видят в запечатанном реликте доказательство: сборку можно провести инженерной процедурой.', 'ВСТРЕЧАЮТ', 'ТЕХНОКРАТЫ', 'ПРИНИМАЮТ ЗА', 'ЧЕРТЁЖ СБОРКИ'),
    ('ECHO', 'Голос, который отвечает', 'Подполье слышит в фантомных ответах возвращение целой личности. Но эхо — только отражение.', 'ВСТРЕЧАЕТ', 'ПОДПОЛЬЕ', 'ПРИНИМАЕТ ЗА', 'ВОЗВРАЩЕНИЕ'),
    ('CONTROL', 'Рычаги порядка', 'Власть принимает удержанный слой контроля за остаток полного господства над AXIOM.', 'ВСТРЕЧАЕТ', 'ВЛАСТЬ', 'ПРИНИМАЕТ ЗА', 'ГОСПОДСТВО'),
    ('BIO', 'Слепое пятно', 'Скрытые контуры не до конца доступны цифровой клетке. Этот след труднее всего заметить.', 'ДЛЯ МАШИН', 'СЛЕПАЯ ЗОНА', 'СЛЕД', 'ВНЕ ЦИФРЫ'),
    ('MYTH', 'Знамение', 'Культы принимают мифический отклик за божественное явление, а городские легенды несут его дальше.', 'ВСТРЕЧАЮТ', 'КУЛЬТЫ', 'ПРИНИМАЮТ ЗА', 'ЯВЛЕНИЕ'),
]
m = re.search(r'<div class="fragments r1p-residuals">[\s\S]*?</div></article></div>', out)
assert m and out.count('<div class="fragments r1p-residuals">') == 1
glyphs = re.findall(r'<svg class="glyph"[\s\S]*?</svg>', m.group())
assert len(glyphs) == 5
cards = ''.join(
    f'<article class="frag" id="trace-{mode.lower()}">{g}<span class="frag-id">{mode}</span><h3>{title}</h3><p>{text}</p>'
    f'<div class="frag-foot"><span>{k1}<b>{v1}</b></span><span>{k2}<b>{v2}</b></span></div></article>'
    for (mode, title, text, k1, v1, k2, v2), g in zip(TRACES, glyphs))
traces = ('<div class="ad-traces"><div class="ad-traces-head"><div><span class="r1p-beat">05 / СЛЕДЫ В МИРЕ</span>'
          '<h3>Пять следов.<br><em>Одно имя.</em></h3></div>'
          '<p>Разные люди встречают разные остатки AXIOM — и называют всё это одним словом. '
          'Чем является каждый режим, раскрывает досье AXIOM&nbsp;∅ в разделе персонажей.</p></div>'
          '<div class="fragments r1p-residuals ad-rail" data-ad-rail="traces" tabindex="0" role="region" aria-label="Пять следов AXIOM, горизонтальная лента">'
          + cards + '</div></div>')
sub1(m.group(), traces, 'doctrine: five fragments rewritten as recognition traces; mobile rail')
resub1(r'<p class="r1p-residual-note">[\s\S]*?</p>', '', 'doctrine: residual note absorbed into traces head')

# ---------------------------------------------------------------- P1 AFTERMATH
resub1(r'<div class="r1p-gate-art"><picture>[\s\S]*?</picture><div class="r1p-door" aria-hidden="true"><i></i><i></i></div><span>ДОСТУП / ENDEAVOR</span></div>',
       '<div class="r1p-gate-art ad-gate"><img src="assets/showcase/visual-library/A08_protocol_gate.webp" width="675" height="1200" loading="lazy" decoding="async" alt="">'
       '<span class="ad-gate-scan" aria-hidden="true"></span><span class="ad-gate-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>'
       '<span class="ad-gate-cap">ПОРОГ / ДОПУСК</span></div>',
       'aftermath: W04 reuse replaced by reserved library A08 threshold (CREATOR confirmation required)')
sub1('<h3>У города<br>есть границы.</h3>', '<h3>Дальше —<br>только по допуску.</h3>', 'aftermath: access headline speaks from the threshold')
assert out.count('W04_vertical_city') == 7, out.count('W04_vertical_city')

BODY = ('M10 320C14 286 30 268 66 256C82 250 88 238 86 222C66 202 52 176 54 140C56 82 96 42 144 42'
        'C172 42 186 58 188 82C190 96 186 104 190 112C196 124 206 136 208 146C209 152 202 156 194 157'
        'C196 162 198 166 196 170C192 173 190 175 193 179C196 184 192 188 188 190C186 196 192 202 190 208'
        'C186 218 170 222 160 224C156 234 158 244 166 252C196 264 226 280 248 320Z')
pulse = ('M176 270H226L236 270L242 258L248 270L258 270L266 222L278 300L286 270L300 270L306 262L314 270H352')
step = 'M410 270H424V250H440V270H456V250H472V270H488V250H504V270H520'
dependence = (
    '<div class="r1p-body-object ad-life" aria-hidden="true"><svg viewBox="0 0 600 340">'
    '<defs><linearGradient id="ad-skin" x1="0" x2="1"><stop offset="0" stop-color="#16171c"/><stop offset=".75" stop-color="#1d1013"/><stop offset="1" stop-color="#3a0a12"/></linearGradient>'
    '<radialGradient id="ad-heart"><stop offset="0" stop-color="#ff2034" stop-opacity=".55"/><stop offset="1" stop-color="#ff2034" stop-opacity="0"/></radialGradient>'
    '<linearGradient id="ad-rim" x1="0" x2="1"><stop offset=".55" stop-color="#ff2034" stop-opacity="0"/><stop offset="1" stop-color="#ff2034"/></linearGradient></defs>'
    '<g class="ad-grid">' + ''.join(f'<path d="M{x} 30V320"/>' for x in range(330, 600, 30)) + '</g>'
    '<circle cx="170" cy="270" r="70" fill="url(#ad-heart)"/>'
    f'<path d="{BODY}" fill="url(#ad-skin)"/><path d="{BODY}" fill="none" stroke="url(#ad-rim)" stroke-width="1.6"/>'
    '<path class="ad-eye" d="M164 112Q173 118 182 112"/>'
    f'<path class="ad-pulse" d="{pulse}"/><path class="ad-pulse-trace" d="{pulse}"/>'
    '<g class="ad-node"><circle cx="170" cy="270" r="9"/><circle cx="170" cy="270" r="3.5" class="fill"/></g>'
    '<g class="ad-gate-ring"><circle cx="381" cy="270" r="26"/><circle cx="381" cy="270" r="17" stroke-dasharray="3 4"/><path d="M381 236V248M381 292V304M347 270H359M403 270H415"/></g>'
    f'<path class="ad-step" d="{step}"/>'
    '<g class="ad-permit"><path d="M534 236H556V304H534M548 252V288"/><circle cx="548" cy="262" r="5"/></g>'
    '<path class="ad-flow" d="M352 270H355M407 270H410"/>'
    '<text x="262" y="326" class="ad-life-k">ПУЛЬС</text><text x="381" y="326" class="ad-life-k" text-anchor="middle">СИСТЕМА</text>'
    '<text x="556" y="326" class="ad-life-k" text-anchor="end">РАЗРЕШЕНИЕ</text>'
    '<text x="590" y="52" class="ad-life-q" text-anchor="end">ЧЕЙ ЭТО СИГНАЛ?</text>'
    '</svg><span>ЖИЗНЕННЫЙ СИГНАЛ / ЧУЖОЙ ПРОТОКОЛ</span></div>')
resub1(r'<div class="r1p-body-object" aria-hidden="true"><svg viewBox="0 0 440 300">[\s\S]*?</svg><span>ЧЕЛОВЕК / ТЕХНОЛОГИЯ / КОНТРОЛЬ</span></div>',
       dependence, 'aftermath: dependence object becomes a human pulse passing through a foreign protocol')

# ---------------------------------------------------------------- P1 MOBILE + P2 WORK → SYSTEM
sub1('<span class="show-kicker">SYSTEM SURFACES / CONCEPTUAL VISUALIZATION</span><h3>ЧЕТЫРЕ СПОСОБА<br><em>УВИДЕТЬ СИСТЕМУ.</em></h3>',
     '<span class="show-kicker">SURFACE STUDIES / ЭТЮДЫ ИНТЕРФЕЙСОВ</span><h3>ЭТЮДЫ<br><em>ВИЗУАЛЬНОГО ЯЗЫКА.</em></h3>',
     'work: exhibit names visual studies, not a second system explanation')
sub1('<p>Выше — восемь настоящих интерфейсов и их задачи. Ниже — отдельная экспозиция их визуальных идей: орбита чтения, досье сущности, связи мест и наблюдение. Это концептуальные композиции, не ещё одна галерея и не телеметрия.</p>',
     '<p>Восемь экранов выше — работающие интерфейсы. Здесь — художественные этюды того, как мир AXIOM может выглядеть на экране: орбита глав, досье сущности, маршруты власти, радар тишины. Как устроена сама система, рассказывает следующий раздел.</p>',
     'work: exhibit intro hands architecture to SYSTEM')
SURF = [('chronicle', 'CHRONICLE'), ('content', 'CONTENT'), ('cartography', 'CARTOGRAPHY'), ('watchdog', 'WATCH_DOG')]
index = ('<nav class="ad-surface-index" aria-label="Этюды интерфейсов">'
         + ''.join(f'<a href="#surface-{k}"><b>{i + 1:02d}</b>{n}</a>' for i, (k, n) in enumerate(SURF)) + '</nav>')
sub1('</div><div class="modules">',
     '</div>' + index + '<div class="modules ad-rail" data-ad-rail="surfaces" tabindex="0" role="region" aria-label="Четыре этюда интерфейсов, горизонтальная лента">',
     'work: compact index + rail container for four full studies')
seg = out[out.index('id="work-surfaces"'):out.index('<div class="ax-work-intro" id="work-intro">')]
assert seg.count('<div class="module">') == 4
seg2 = seg
for k, _n in SURF:
    seg2 = seg2.replace('<div class="module">', f'<div class="module" id="surface-{k}">', 1)
out = out.replace(seg, seg2, 1)
log.append('work: stable anchors for four studies')
for old, new, why in [
    ('<p>Литературное вступление в AXIOM — главы, прологи и фрагменты канона в медленной орбите. Каждая глава = узел памяти.</p>',
     '<p>Этюд чтения: главы не выстроены в ленту, а вращаются вокруг одной точки памяти. Читатель выбирает вход, а не страницу.</p>', 'chronicle copy'),
    ('<p>Каталог канона: персонажи, локации, технологии, фракции. Фильтр по тегам и ссылочный граф.</p>',
     '<p>Этюд досье: сущность узнаётся по силуэту, тегам и связям раньше, чем по тексту.</p>', 'content copy'),
    ('<p>Не просто география, а маршруты власти и доступа по трём осям мира: Aeternum&nbsp;→&nbsp;ECHELON, Terra&nbsp;Nova&nbsp;→&nbsp;NEXUS, Gluhaya&nbsp;→ OMEGA-0&nbsp;→&nbsp;NEXUS. Города как узлы власти, связи как линии причины.</p>',
     '<p>Этюд маршрутов: города показаны как узлы власти, а линии — как причины, которые их связывают. Сама карта мира — в разделе WORLD.</p>', 'cartography copy (axes stay in WORLD only)'),
    ('<p>Концептуальный образ наблюдения: радар, локальные сигналы и индекс локаций. Здесь показан визуальный язык WATCH_DOG, а не данные работающей системы.</p>',
     '<p>Этюд наблюдения: радар ищет не шум, а места, где мир замолчал. Метки условные — это язык интерфейса, а не данные.</p>', 'watchdog copy'),
]:
    sub1(old, new, 'work: ' + why)
sub1('<p class="r1p-exhibit-note">Все четыре композиции — концептуальная визуализация. Статусы, версии и измерения здесь не изображают работу production-системы. Географическая схема показывает связи, а полная художественная карта остаётся в WORLD.</p>',
     '<p class="r1p-exhibit-note">Все четыре этюда — художественная визуализация. Статусы и метки в них не изображают работу production-системы.</p>',
     'work: shorter honesty note')

# ---------------------------------------------------------------- P2 WORLD GRID / CHARACTERS (external copy only)
sub1('<h2 id="world-title" class="sec-title" lang="en">THE SHAPE<br><em>OF POWER.</em></h2><p class="r1p-translation" lang="ru">География власти</p>',
     '<h2 id="world-title" class="sec-title" lang="en">THE CITY RISES.<br><em>THE DEPTH IS SEALED.</em></h2><p class="r1p-translation" lang="ru">Город растёт вверх. Глубина закрыта.</p>',
     'world: headline names AXIOM vertical/subterranean geography')
sub1('<p class="sec-desc">ECHELON — вертикальная городская мегаструктура, где инфраструктура становится способом власти. NEXUS — купольный город, прежде называвшийся Terra Nova.</p>',
     '<p class="sec-desc">Вверх растёт ECHELON — вертикальная мегаструктура, где инфраструктура становится способом власти. Под Глухой станцией начинается путь вниз, к OMEGA-0. Между ними — NEXUS, купольный город, прежде называвшийся Terra Nova.</p>',
     'world: intro maps headline to ECHELON / OMEGA-0 / NEXUS')
sub1('<h2 id="r1p-characters-title" class="sec-title" lang="en">LIVES INSIDE<br><em>THE FRACTURE.</em></h2><p class="r1p-translation" lang="ru">Люди внутри разлома</p>',
     '<h2 id="r1p-characters-title" class="sec-title" lang="en">THREE LIVES<br><em>INSIDE THE FRACTURE.</em></h2><p class="r1p-translation" lang="ru">Три жизни внутри разлома</p>',
     'characters: concrete count, same structure')
sub1('Их истории показывают цену мира, который вы только что увидели.</p>',
     'На карте порядок выглядит как схема. В их судьбах — как цена.</p>', 'characters: bridge from map to people')

# ---------------------------------------------------------------- protected internals stay byte-identical to A+
def block(s, pattern):
    m = re.search(pattern, s); assert m, pattern
    tag = re.match(r'<([\w:-]+)', m.group()).group(1); depth = 0
    for t in re.finditer(r'<!--[\s\S]*?-->|</?([\w:-]+)\b[^>]*>', s[m.start():]):
        v = t.group()
        if v.startswith('<!--') or t.group(1) != tag: continue
        if v.startswith('</'): depth -= 1
        elif not v.endswith('/>'): depth += 1
        if depth == 0: return s[m.start():m.start() + t.end()]
    raise ValueError(pattern)

checks = {}
for name, pattern in [('map', r'<div class="v23-map-composition">'), ('axes', r'<div class="v23-map-axes"[^>]*>'), ('omega', r'<div class="ax-omega">'),
                      ('cards', r'<div class="chars">'), ('axiom', r'<div class="axiom-entity"[^>]*>'), ('viewer', r'<dialog[^>]*id="showcase-lightbox"[^>]*>'),
                      ('system', r'<section[^>]*id="system"[^>]*>')]:
    a, b = block(src, pattern), block(out, pattern)
    assert a == b, name
    checks[name] = {'exactVsAplus': True, 'sha256': sha(a)}
world = lambda s: block(s, r'<section\b[^>]*\bid="world"[^>]*>')
a, b = block(world(src), r'<picture>'), block(world(out), r'<picture>')
assert a == b and 'W04_vertical_city' in a
checks['worldW04Picture'] = {'exactVsAplus': True, 'sha256': sha(a)}
for tag, cls, count in [('figure', 'ax-shot', 8), ('div', 'ax-case', 8)]:
    pat = rf'<{tag} class="{cls}">'
    a = [block(src[m.start():], pat) for m in re.finditer(pat, src)]
    b = [block(out[m.start():], pat) for m in re.finditer(pat, out)]
    assert a == b and len(a) == count, cls
    checks[cls] = {'exactVsAplus': True, 'count': count}
# Four studies: all SVG geometry of the restored modules stays as in A+.
svgs = lambda s: re.findall(r'<svg[\s\S]*?</svg>', s[s.index('id="work-surfaces"'):s.index('id="work-intro"')])
assert svgs(src) == svgs(out) and len(svgs(out)) >= 3
checks['surfaceSvgGeometry'] = {'exactVsAplus': True, 'count': len(svgs(out))}
assert not subprocess.check_output(['git', 'diff', PRODUCT, '--', 'index.html', 'assets', 'tests'], cwd=ROOT, text=True)
checks['productDiffVsB85'] = 'empty'

(HERE / 'ad.html').write_text(out)
proof = {'base': {'aplus': str(APLUS.relative_to(ROOT)), 'aplusSha256': APLUS_SHA, 'product': PRODUCT},
         'reportingStart': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
         'candidateHtmlSha256': sha(out), 'edits': log, 'checks': checks}
(HERE / 'source-proof.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n')
print(f'ad.html built: {len(log)} asserted edits; protected internals exact vs A+')
