#!/usr/bin/env python3
"""YouTube thumbnails (1280x720) for the series.  Usage: python3 thumbs.py <out_dir> --photo 犬.jpg"""
import argparse, base64, io, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import series, talking_photo  # noqa: E402
from icons import dog_icon  # noqa: E402

# (episode, big text line1, line2, small sub line, group)
THUMBS = [
    (1, "AIって", "なに？", "ゼロからやさしく解説", "start"),
    (2, "Claude", "はじめよう", "登録から最初の質問まで", "start"),
    (3, "無料で", "どこまで？", "無料版と有料版のちがい", "start"),
    (4, "AIと", "話してみよう", "Chatの基本の使い方", "chat"),
    (5, "頼み方で", "答えが変わる", "伝わるプロンプトの書き方", "chat"),
    (6, "プログラミング", "ゼロでもOK", "Claude Code 最初の設定", "code"),
    (7, "言葉だけで", "アプリが完成", "Claude Code でToDoリスト", "code"),
    (8, "お店の仕事", "×AI", "個人商店・飲食業・アパレル", "work"),
    (9, "金融・役所", "×AI", "金融・官公庁・政治家", "work"),
    (10, "警察・消防", "×AI", "警察官・消防官・自衛隊", "work"),
]
GROUP = {  # background, pattern dot colour
    "start": ("#FFC738", "#FFD866"),
    "chat": ("#7FD3A6", "#9BDFBA"),
    "code": ("#8EC5F2", "#A9D3F5"),
    "work": ("#FF9F8A", "#FFB6A6"),
}
# icon variants, rotated per episode: (face, extra, tongue)
VARIANTS = [("happy", "heart", True), ("wink", "sparkle", False), ("open", "paw", True), ("open", None, False)]

CSS = """
@font-face{font-family:"Mochiy";src:url(fonts/MochiyPopOne-Regular.ttf)}
@font-face{font-family:"ZenMaru";src:url(fonts/ZenMaruGothic-Black.ttf);font-weight:900}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1280px;height:720px;overflow:hidden}
body{position:relative;font-family:"ZenMaru",sans-serif;color:#24365A}
.bg{position:absolute;inset:0}
.series{position:absolute;left:44px;top:36px;display:flex;gap:14px;align-items:center}
.ep{background:#24365A;color:#fff;font-family:"Mochiy";font-size:44px;border-radius:999px;padding:6px 30px 10px}
.sname{background:#fff;border:5px solid #24365A;border-radius:999px;font-size:30px;font-weight:900;padding:6px 24px}
.big{position:absolute;left:40px;top:160px;width:720px;font-family:"Mochiy";line-height:1.12;color:#24365A;
  paint-order:stroke fill;-webkit-text-stroke:18px #fff}
.big span{display:table;white-space:nowrap}
.subrow{position:absolute;left:44px;bottom:34px;display:flex;align-items:flex-end;gap:6px}
.sub{background:#24365A;color:#fff;font-size:38px;font-weight:900;border-radius:18px;padding:12px 28px;transform:rotate(-1.5deg);margin-bottom:10px}
.dog{position:absolute;right:46px;top:70px;width:440px;height:560px;border:10px solid #24365A;border-radius:48px;overflow:hidden;
  box-shadow:14px 14px 0 #24365A;transform:rotate(3deg);background:#fff}
.dog img{width:100%;height:100%;object-fit:cover;display:block}
.bubble{position:absolute;right:300px;top:22px;background:#fff;border:6px solid #24365A;border-radius:28px;padding:10px 24px;
  font-size:34px;font-weight:900;transform:rotate(-4deg);box-shadow:6px 6px 0 #24365A}
.bubble::after{content:"";position:absolute;right:-26px;top:34px;border:14px solid transparent;border-left:22px solid #24365A}
.ic{position:absolute;filter:drop-shadow(5px 5px 0 rgba(36,54,90,.35))}
.ic svg{display:block}
"""


def html(ep, l1, l2, sub, group, dog_uri):
    bg, dot = GROUP[group]
    n = max(len(l1), len(l2))
    size = 150 if n <= 5 else 132
    a, b, c = (VARIANTS[(ep + k) % len(VARIANTS)] for k in range(3))
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="bg" style="background:{bg};background-image:radial-gradient({dot} 22%,transparent 23%);background-size:46px 46px"></div>
<div class="series"><div class="ep">第{ep}回</div><div class="sname">{series.SERIES}</div></div>
<div class="big" style="font-size:{size}px"><span>{l1}</span><span>{l2}</span></div>
<div class="subrow"><div class="sub">{sub}</div><div class="ic" style="position:static;transform:rotate(8deg)">{dog_icon(*c, size=104)}</div></div>
<div class="dog"><img src="{dog_uri}"></div>
<div class="bubble">いっしょに学ぼう！</div>
<div class="ic" style="left:686px;top:520px;transform:rotate(-10deg)">{dog_icon(*a, size=160)}</div>
<div class="ic" style="left:1150px;top:14px;transform:rotate(12deg)">{dog_icon(*b, size=118)}</div>
<script>
// shrink the headline until both lines fit left of the photo (max 700px wide, 2 lines)
const big = document.querySelector('.big');
for (const sp of big.querySelectorAll('span')) {{
  let fs = parseFloat(getComputedStyle(big).fontSize);
  sp.style.fontSize = fs + 'px';
  while (sp.scrollWidth > 700 && fs > 60) {{ fs -= 2; sp.style.fontSize = fs + 'px'; }}
}}
</script>
</body></html>"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("--photo", required=True)
    a = ap.parse_args()
    out = os.path.abspath(a.out)
    os.makedirs(out, exist_ok=True)
    # a slightly open mouth looks like the dog is talking
    frame = talking_photo.make_frames(a.photo, series.MOUTH, 8)[4]
    f = series.FACE
    bh = min(f["crop_h"], frame.height); bw = bh * 440 / 560
    bx = min(max(f["cx"] - bw / 2, 0), frame.width - bw); by = min(max(f["cy"] - bh / 2, 0), frame.height - bh)
    dog = frame.resize((880, 1120), box=(bx, by, bx + bw, by + bh))
    buf = io.BytesIO(); dog.save(buf, "JPEG", quality=92)
    uri = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

    tmp = os.path.join(HERE, ".thumbs_tmp")  # beside fonts/ so the relative font URLs resolve
    os.makedirs(tmp, exist_ok=True)
    jobs = []
    try:
        for ep, l1, l2, sub, g in THUMBS:
            p = os.path.join(HERE, f".thumb_{ep:02d}.html")
            open(p, "w", encoding="utf-8").write(html(ep, l1, l2, sub, g, uri))
            jobs.append(dict(html=p, out=os.path.join(out, f"thumb_{ep:02d}.png")))
        js = r"""const { chromium } = require('playwright'); const fs=require('fs');
(async()=>{const jobs=JSON.parse(fs.readFileSync(process.argv[2]));const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1280,height:720}});
for(const j of jobs){await p.goto('file://'+j.html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(100);
await p.screenshot({path:j.out});}await b.close();})();"""
        jp = os.path.join(tmp, "jobs.json"); json.dump(jobs, open(jp, "w"))
        rp = os.path.join(tmp, "thumbs.js"); open(rp, "w").write(js)
        subprocess.run(["node", rp, jp], check=True)
    finally:  # leave no working files behind
        for j in jobs:
            if os.path.exists(j["html"]):
                os.remove(j["html"])
        for fn in ("jobs.json", "thumbs.js"):
            if os.path.exists(os.path.join(tmp, fn)):
                os.remove(os.path.join(tmp, fn))
        if os.path.isdir(tmp):
            os.rmdir(tmp)


if __name__ == "__main__":
    main()
