#!/usr/bin/env python3
"""Build the explainer video.

Usage: python3 build.py <work_dir> <htsvoice_path> [--preview N]
Requires: open_jtalk (+ naist-jdic), ffmpeg, node + playwright, Pillow, numpy.
"""
import json, math, os, re, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from scenes import SCENES, SERIES, READINGS  # noqa: E402
import avatar  # noqa: E402

W, H, FPS, SR = 1920, 1080, 30, 48000
DIC = "/var/lib/mecab/dic/open-jtalk/naist-jdic"
FONT_BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
AV_X, AV_Y = 1370, 290  # avatar top-left on the frame
GAP_LINE, PAD_START, PAD_END, XFADE = 0.40, 0.7, 1.1, 0.35


def sh(*a, **k):
    subprocess.run(a, check=True, **k)


# ---------------------------------------------------------------- slides
def slide_html(i, sc):
    pct = 100 * i / (len(SCENES) - 1)
    css = open(os.path.join(HERE, "slide.css"), encoding="utf-8").read()
    return f"""<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>{css}</style></head><body>
<div class="top"><span class="series">{SERIES}</span><span class="sep"></span><span>{sc['label']}</span></div>
<div class="prog"><i style="width:{pct:.1f}%"></i></div>
<div class="side"><div class="name">ナビゲーター<b>あかり</b></div><div class="halo"></div></div>
<div class="content">{sc['html']}</div></body></html>"""


RENDER_JS = r"""
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [jobsPath] = process.argv.slice(2); const jobs = JSON.parse(fs.readFileSync(jobsPath));
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1920,height:1080}});
  for (const j of jobs) {
    await p.goto('file://' + j.html); await p.evaluate(() => document.fonts.ready);
    for (const s of j.steps) {
      await p.evaluate((s) => document.querySelectorAll('[data-s]').forEach(e =>
        e.classList.toggle('hidden', +e.dataset.s > s)), s);
      await p.screenshot({path: j.out.replace('%d', s), omitBackground: !!j.alpha});
    }
  }
  await b.close();
})();
"""


def render_assets(work):
    os.makedirs(f"{work}/slides", exist_ok=True)
    os.makedirs(f"{work}/avatar", exist_ok=True)
    jobs = []
    for i, sc in enumerate(SCENES):
        p = f"{work}/slides/s{i:02d}.html"
        open(p, "w", encoding="utf-8").write(slide_html(i, sc))
        steps = sorted({ln[0] for ln in sc["lines"]})
        jobs.append(dict(html=p, steps=steps, out=f"{work}/slides/s{i:02d}_%d.png"))
    for lv in range(3):
        for c in (False, True):
            name = f"m{lv}{'c' if c else 'o'}"
            p = f"{work}/avatar/{name}.html"
            open(p, "w").write("<html><body style='margin:0;background:transparent'>"
                               + avatar.svg(lv, c) + "</body></html>")
            jobs.append(dict(html=p, steps=[0], out=f"{work}/avatar/{name}.png", alpha=True))
    json.dump(jobs, open(f"{work}/jobs.json", "w"))
    open(f"{work}/render.js", "w").write(RENDER_JS)
    sh("node", f"{work}/render.js", f"{work}/jobs.json")
    # crop avatars to 540x800
    for f in os.listdir(f"{work}/avatar"):
        if f.endswith(".png"):
            im = Image.open(f"{work}/avatar/{f}").crop((0, 0, 540, 800))
            im.save(f"{work}/avatar/{f}")


# ---------------------------------------------------------------- speech
def reading(text):
    for a, b in READINGS:
        text = text.replace(a, b)
    return text


def tts(text, path, voice):
    sh("open_jtalk", "-x", DIC, "-m", voice, "-r", "0.93", "-fm", "-1.0", "-jf", "1.1",
       "-ow", path, input=text.encode("utf-8"))
    with wave.open(path) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        assert w.getframerate() == SR
    return a


# ---------------------------------------------------------------- subtitles
def wrap(text, font, maxw, draw):
    """1 line if it fits; otherwise 2 balanced lines, preferring a break after punctuation."""
    fits = lambda t: draw.textlength(t, font=font) <= maxw
    if fits(text):
        return [text]
    n = len(text)
    best = None
    for k in range(1, n):
        a, b = text[:k], text[k:]
        if not (fits(a) and fits(b)) or b[0] in "、。」）！？ー" or a[-1] in "「（":
            continue
        score = abs(len(a) - len(b)) - (30 if a[-1] in "、。！？" else 0)
        if best is None or score < best[0]:
            best = (score, k)
    if best is None:  # too long for 2 lines: greedy wrap, break after punctuation when possible
        lines, cur = [], ""
        for ch in text:
            if not fits(cur + ch) and ch not in "、。」）！？ー":
                cut = max(cur.rfind("、"), cur.rfind("。"))
                if cut >= len(cur) * 0.6:
                    lines.append(cur[:cut + 1]); cur = cur[cut + 1:]
                else:
                    lines.append(cur); cur = ""
            cur += ch
        return lines + [cur]
    return [text[:best[1]], text[best[1]:]]


def subtitle_img(text, font):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x0, x1, yb = 60, 1340, 1050
    lines = wrap(text, font, x1 - x0 - 80, d)
    lh = 58
    h = lh * len(lines) + 40
    d.rounded_rectangle((x0, yb - h, x1, yb), 22, fill=(255, 255, 255, 236), outline=(230, 222, 214, 255), width=2)
    for k, ln in enumerate(lines):
        tw = d.textlength(ln, font=font)
        d.text(((x0 + x1 - tw) / 2, yb - h + 18 + k * lh), ln, font=font, fill=(47, 42, 39, 255))
    return img


# ---------------------------------------------------------------- main
def main():
    work, voice = sys.argv[1], sys.argv[2]
    preview = int(sys.argv[sys.argv.index("--preview") + 1]) if "--preview" in sys.argv else None
    os.makedirs(f"{work}/tts", exist_ok=True)
    render_assets(work)

    # timeline
    audio, events = [np.zeros(int(SR * 0.3), np.float32)], []  # events: (t, scene, step, text)
    t = 0.3
    scenes = list(enumerate(SCENES))[:preview] if preview else list(enumerate(SCENES))
    for i, sc in scenes:
        audio.append(np.zeros(int(SR * PAD_START), np.float32)); t0 = t; t += PAD_START
        events.append((t0, i, sc["lines"][0][0], None))
        for j, ln in enumerate(sc["lines"]):
            step, sub = ln[0], ln[1]
            say = ln[2] if len(ln) > 2 else reading(sub)
            a = tts(say, f"{work}/tts/{i:02d}_{j:02d}.wav", voice)
            events.append((t, i, step, sub))
            audio.append(a); t += len(a) / SR
            g = GAP_LINE if j < len(sc["lines"]) - 1 else PAD_END
            audio.append(np.zeros(int(SR * g), np.float32)); t += g
    audio = np.concatenate(audio)
    audio = audio / max(1e-6, np.abs(audio).max()) * 0.89
    total = len(audio) / SR
    with wave.open(f"{work}/narration.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((audio * 32767).astype(np.int16).tobytes())

    # mouth openness per frame from RMS
    nfr = int(math.ceil(total * FPS))
    hop = SR // FPS
    rms = np.array([np.sqrt(np.mean(audio[k * hop:(k + 1) * hop] ** 2) + 1e-12) for k in range(nfr)])
    ref = np.percentile(rms[rms > 0.01], 70) if (rms > 0.01).any() else 1
    lv = rms / ref
    mouth = np.where(lv > 0.55, 2, np.where(lv > 0.18, 1, 0))
    # avoid 1-frame flicker
    for k in range(1, nfr - 1):
        if mouth[k - 1] == mouth[k + 1] != mouth[k]:
            mouth[k] = mouth[k - 1]
    rng = np.random.default_rng(7)
    blink = np.zeros(nfr, bool)
    k = int(FPS * 1.5)
    while k < nfr:
        blink[k:k + 4] = True
        k += int(FPS * rng.uniform(2.8, 5.5))

    font = ImageFont.truetype(FONT_BOLD, 40)
    avs = {(m, c): Image.open(f"{work}/avatar/m{m}{'c' if c else 'o'}.png").convert("RGBA")
           for m in range(3) for c in (False, True)}
    slides, subs, bases = {}, {}, {}

    def base(key):
        if key not in bases:
            i, step, sub = key
            if (i, step) not in slides:
                slides[(i, step)] = Image.open(f"{work}/slides/s{i:02d}_{step}.png").convert("RGBA")
            im = slides[(i, step)].copy()
            if sub:
                if sub not in subs:
                    subs[sub] = subtitle_img(sub, font)
                im.alpha_composite(subs[sub])
            bases.clear() if len(bases) > 6 else None
            bases[key] = im
        return bases[key]

    out_v = f"{work}/video_noaudio.mp4"
    enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                            "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium",
                            "-crf", "20", "-pix_fmt", "yuv420p", "-tune", "stillimage", out_v], stdin=subprocess.PIPE)
    ei, prev_key, t_change = 0, None, -10
    cur_key = events[0][1:]
    for f in range(nfr):
        tf = f / FPS
        while ei < len(events) and events[ei][0] <= tf:
            _, i, step, sub = events[ei]
            nk = (i, step, sub)
            if nk != cur_key:
                prev_key, cur_key, t_change = cur_key, nk, tf
            ei += 1
        frame = base(cur_key)
        a = (tf - t_change) / XFADE
        if prev_key and a < 1:
            frame = Image.blend(base(prev_key), frame, 0.5 - 0.5 * math.cos(math.pi * a))
        else:
            frame = frame.copy()
        bob = int(round(3 * math.sin(2 * math.pi * tf / 4.2)))
        frame.alpha_composite(avs[(int(mouth[f]), bool(blink[f]))], (AV_X, AV_Y + bob))
        enc.stdin.write(frame.convert("RGB").tobytes())
    enc.stdin.close(); enc.wait()
    final = f"{work}/AI活用のはじめの一歩.mp4"
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", out_v, "-i", f"{work}/narration.wav",
       "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "48000", "-shortest",
       "-movflags", "+faststart", final)
    print(f"done: {final}  ({total:.1f}s)")


if __name__ == "__main__":
    main()
