"""Shared settings and slide helpers for the 10-part series 「AIのはじめかた」."""

SERIES = "AIのはじめかた"
NAVI_NAME = "たぬき"          # navigator dog's name (shown on the name tag)
NAVI_ROLE = "ナビ犬"
VOICE_CREDIT = "VOICEVOX:ずんだもん"

# Readings so the TTS pronounces English terms naturally (longest first).
READINGS = [
    ("claude --version", "クロード ハイフン ハイフン バージョン"),
    ("claude.ai", "クロード ドット エーアイ"),
    ("index.html", "インデックス ドット エイチティーエムエル"),
    ("Claude Code", "クロードコード"),
    ("ChatGPT", "チャットジーピーティー"),
    ("Copilot", "コパイロット"),
    ("Anthropic", "アンソロピック"),
    ("Enterprise", "エンタープライズ"),
    ("Gemini", "ジェミニ"),
    ("Claude", "クロード"),
    ("claude", "クロード"),
    ("PowerShell", "パワーシェル"),
    ("Windows", "ウィンドウズ"),
    ("Excel", "エクセル"),
    ("ToDo", "トゥードゥー"),
    ("Chat", "チャット"),
    ("Code", "コード"),
    ("Google", "グーグル"),
    ("Team", "チーム"),
    ("Mac", "マック"),
    ("Pro", "プロ"),
    ("Max", "マックス"),
    ("PDF", "ピーディーエフ"),
    ("SNS", "エスエヌエス"),
    ("POP", "ポップ"),
    ("Esc", "エスケープ"),
    ("/help", "スラッシュ ヘルプ"),
    ("/clear", "スラッシュ クリア"),
    ("/exit", "スラッシュ エグジット"),
    ("AI", "エーアイ"),
]


def S(n):
    return "" if n is None else f' data-s="{n}"'


# ---------------------------------------------------------------- blocks
def cover(no, title, sub, agenda, start=1):
    items = "".join(f'<li{S(start + k)}><b>{k + 1}</b>{a}</li>' for k, a in enumerate(agenda))
    return f"""<div class="cover"><div class="ep">第{no}回</div>
<h1>{title}</h1><p>{sub}</p><ul class="agenda">{items}</ul></div>"""


def outro(no, summary, next_title=None, start=1):
    items = "".join(f'<li class="stk"{S(start + k)}><span class="ic">✅</span>{s}</li>' for k, s in enumerate(summary))
    nxt = (f'<div class="stk nextup"{S(start + len(summary))}><div class="lbl">次回 第{no + 1}回</div><h3>{next_title}</h3></div>'
           if next_title else "")
    return f'<h2>第{no}回のまとめ</h2><ul class="list">{items}</ul>{nxt}'


def cards(items, cols=2, start=1, tone=""):
    """items: (emoji, title, body)"""
    out = []
    for k, (ic, t, b) in enumerate(items):
        icon = f'<span class="ic">{ic}</span>' if ic else ""
        out.append(f'<div class="stk card {tone}"{S(start + k if start is not None else None)}>{icon}<h3>{t}</h3><p>{b}</p></div>')
    return f'<div class="grid g{cols}">{"".join(out)}</div>'


def steps(items, start=1):
    """items: (title, body) — only for real sequences."""
    out = [f'<div class="stk step"{S(start + k)}><div class="n">{k + 1}</div><h3>{t}</h3><p>{b}</p></div>'
           for k, (t, b) in enumerate(items)]
    return f'<div class="steps">{"".join(out)}</div>'


def blist(items, start=1):
    """items: (emoji, text, sub)"""
    out = []
    for k, (ic, t, sub) in enumerate(items):
        small = f"<small>{sub}</small>" if sub else ""
        out.append(f'<li class="stk"{S(start + k)}><span class="ic">{ic}</span><div>{t}{small}</div></li>')
    return f'<ul class="list">{"".join(out)}</ul>'


def callout(kind, text, step=None):
    ic = {"warn": "⚠️", "ok": "👍", "tip": "💡"}[kind]
    return f'<div class="stk callout {kind}"{S(step)}><span class="ic">{ic}</span><div>{text}</div></div>'


def chat(msgs, side=""):
    """msgs: (role 'u'|'a', text, step)"""
    b = "".join(f'<div class="bub {r}"{S(s)}>{t}</div>' for r, t, s in msgs)
    return f"""<div class="row"><div class="stk chat"><div class="bar"><i></i><i></i><i></i><span>Claude</span></div>
<div class="msgs">{b}</div><div class="inp">メッセージを入力… <b>↑</b></div></div><div class="side-list">{side}</div></div>"""


def term(lines, title="ターミナル", jp=False, height=None):
    """lines: (cls, text, step); cls in c/pr/ok/you/ask/''"""
    out = []
    for cls, t, s in lines:
        if cls == "pr":
            out.append(f'<div{S(s)}><span class="pr">$</span>{t}</div>')
        elif cls == "ps":
            out.append(f'<div{S(s)}><span class="pr">&gt;</span>{t}</div>')
        elif cls in ("c", "ok"):
            out.append(f'<div{S(s)}><span class="{cls}">{t}</span></div>')
        elif cls:
            out.append(f'<div class="{cls}"{S(s)}>{t}</div>')
        else:
            out.append(f'<div{S(s)}>{t}</div>')
    h = f' style="height:{height}px"' if height else ""
    return f"""<div class="stk term"{h}><div class="bar"><i></i><i></i><i></i><span>{title}</span></div>
<div class="tb{' jp' if jp else ''}">{"".join(out)}</div></div>"""


def job(ic, name, uses, start=1, caution=None, cstep=None):
    """uses: (emoji, text, sub)"""
    u = "".join(f'<div class="stk use"{S(start + k)}><span class="ic">{e}</span><div>{t}<small>{s}</small></div></div>'
                for k, (e, t, s) in enumerate(uses))
    c = callout("warn", caution, cstep) if caution else ""
    return f"""<div class="job"><div class="stk who"><span class="ic">{ic}</span><h3>{name}</h3></div>
<div class="uses">{u}</div></div>{c}"""


def frame(no, label, html, css_href, total=10):
    walk = []
    for k in range(1, total + 1):
        cls = "done" if k < no else ("now" if k == no else "")
        inner = str(k) if k == no else ""
        walk.append(f'<i class="{cls}">{inner}</i>')
    walk_html = "<b></b>".join(walk)
    return f"""<!doctype html><html lang="ja"><head><meta charset="utf-8"><link rel="stylesheet" href="{css_href}"></head><body>
<div class="tag">第{no}回</div><div class="chapter">{label}</div>
<div class="walk">{walk_html}</div><div class="walk-label">{SERIES}　全10回</div>
<div class="side"><div class="nametag"><span>{NAVI_ROLE}</span>{NAVI_NAME}</div></div>
<div class="content">{html}</div></body></html>"""

# Mouth position in the navigator photo (photo pixel coordinates) for the talking animation.
MOUTH = dict(cx=258, y=258, half=36, open_px=8, lift=0.1, curve=0.006)
# Face center and crop height (photo pixels) so the face sits in the middle of the frame.
FACE = dict(cx=255, cy=185, crop_h=380)

# 「方」は人を指すときは「かた」と読ませる（音声のみ。字幕はそのまま）
PERSON_KATA = [
    ("苦手な方", "苦手なかた"), ("外国の方", "外国のかた"), ("迷っている方", "迷っているかた"),
    ("スタッフの方", "スタッフのかた"), ("住民の方", "住民のかた"),
]
