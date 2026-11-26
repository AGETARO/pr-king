#!/usr/bin/env python3
"""Build episodes of the series 「AIのはじめかた」.

Usage: python3 build.py <work_dir> --photo <dog_photo> [--ep 1,2,...] [--engine http://localhost:50021] [--preview N]
Voice: VOICEVOX:ずんだもん (ノーマル). Start the engine with
  docker run -d -p 50021:50021 voicevox/voicevox_engine:cpu-latest
"""
import argparse, importlib, io, json, math, os, shutil, subprocess, sys, urllib.parse, urllib.request, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import series  # noqa: E402

W, H, FPS, SR = 1920, 1080, 30, 48000
VV_STYLE = 3  # ずんだもん ノーマル
VV_PARAMS = dict(speedScale=0.9, pitchScale=0.0, intonationScale=1.0, volumeScale=1.0,
                 prePhonemeLength=0.05, postPhonemeLength=0.05, outputSamplingRate=SR, outputStereo=False)
GAP_LINE, PAD_START, PAD_END, XFADE = 0.6, 0.8, 1.3, 0.35
INK = (36, 54, 90, 255)
CARD_BOX = (1400, 160, 1860, 730)  # photo card area (x0, y0, x1, y1) incl. shadow
FONT = os.path.join(HERE, "fonts", "ZenMaruGothic-Bold.ttf")

RENDER_JS = r"""
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2]));
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1920,height:1080}});
  for (const j of jobs) {
    await p.goto('file://' + j.html); await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(150);
    for (const s of j.steps) {
      await p.evaluate((s) => document.querySelectorAll('[data-s]').forEach(e =>
        e.classList.toggle('hidden', +e.dataset.s > s)), s);
      await p.screenshot({path: j.out.replace('%d', s)});
    }
  }
  await b.close();
})();
"""


def sh(*a, **k):
    subprocess.run(a, check=True, **k)


def reading(text):
    for a, b in series.READINGS:
        text = text.replace(a, b)
    return text


def tts(text, path, engine):
    key = json.dumps([text, VV_STYLE, VV_PARAMS], ensure_ascii=False)
    if os.path.exists(path) and os.path.exists(path + ".key") and open(path + ".key").read() == key:
        with wave.open(path) as w:
            return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    op = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    q = urllib.parse.urlencode({"text": text, "speaker": VV_STYLE})
    query = json.loads(op.open(urllib.request.Request(f"{engine}/audio_query?{q}", method="POST")).read())
    query.update(VV_PARAMS)
    req = urllib.request.Request(f"{engine}/synthesis?speaker={VV_STYLE}", data=json.dumps(query).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    data = op.open(req).read()
    open(path, "wb").write(data)
    open(path + ".key", "w").write(key)
    with wave.open(io.BytesIO(data)) as w:
        assert w.getframerate() == SR
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768


# ---------------------------------------------------------------- photo card
def photo_card(path):
    x0, y0, x1, y1 = CARD_BOX
    cw, ch = x1 - x0 - 10, y1 - y0 - 10  # leave room for the offset shadow
    im = Image.open(path).convert("RGB")
    # cover-crop, biased slightly upward (faces tend to be in the upper half)
    s = max(cw / im.width, ch / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = (im.width - cw) // 2
    top = max(0, min(im.height - ch, int((im.height - ch) * 0.4)))
    im = im.crop((left, top, left + cw, top + ch))
    card = Image.new("RGBA", (cw + 10, ch + 10), (0, 0, 0, 0))
    r = 40
    sh_mask = Image.new("L", (cw, ch), 0)
    ImageDraw.Draw(sh_mask).rounded_rectangle((0, 0, cw - 1, ch - 1), r, fill=255)
    card.paste(Image.new("RGBA", (cw, ch), INK), (10, 10), sh_mask)
    card.paste(im, (0, 0), sh_mask)
    ImageDraw.Draw(card).rounded_rectangle((2, 2, cw - 3, ch - 3), r, outline=INK, width=6)
    return card


# ---------------------------------------------------------------- subtitles
def wrap(text, font, maxw, draw):
    fits = lambda t: draw.textlength(t, font=font) <= maxw
    if fits(text):
        return [text]
    best = None
    for k in range(1, len(text)):
        a, b = text[:k], text[k:]
        if not (fits(a) and fits(b)) or b[0] in "、。」）！？ーぁぃぅぇぉっゃゅょ" or a[-1] in "「（":
            continue
        score = abs(len(a) - len(b)) - (30 if a[-1] in "、。！？" else 0)
        if best is None or score < best[0]:
            best = (score, k)
    if best:
        return [text[:best[1]], text[best[1]:]]
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


def subtitle_img(text, font):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x0, x1, yb = 60, 1330, 1046
    lines = wrap(text, font, x1 - x0 - 90, d)
    lh = 60
    h = lh * len(lines) + 44
    y0 = yb - h
    d.rounded_rectangle((x0 + 7, y0 + 7, x1 + 7, yb + 7), 30, fill=INK)
    # tail toward the dog (drawn before the body so the border covers the joint)
    ty = min(yb - 40, y0 + 40)
    tail = [(x1 - 10, ty - 22), (x1 + 58, ty - 60), (x1 - 10, ty + 22)]
    d.polygon([(x + 6, y + 6) for x, y in tail], fill=INK)
    d.polygon(tail, fill=(255, 255, 255, 255), outline=INK, width=5)
    d.rounded_rectangle((x0, y0, x1, yb), 30, fill=(255, 255, 255, 255), outline=INK, width=5)
    d.polygon([(x1 - 14, ty - 17), (x1 + 44, ty - 50), (x1 - 14, ty + 17)], fill=(255, 255, 255, 255))
    for k, ln in enumerate(lines):
        tw = d.textlength(ln, font=font)
        d.text(((x0 + x1 - tw) / 2, y0 + 20 + k * lh), ln, font=font, fill=INK)
    return img


# ---------------------------------------------------------------- episode
def build_episode(ep, work, card, engine, preview=None):
    no = ep["no"]
    wd = f"{work}/ep{no:02d}"
    os.makedirs(f"{wd}/slides", exist_ok=True)
    os.makedirs(f"{wd}/tts", exist_ok=True)
    css = os.path.join(HERE, "slide.css")
    scenes = ep["scenes"][:preview] if preview else ep["scenes"]
    jobs = []
    for i, sc in enumerate(scenes):
        p = f"{wd}/slides/s{i:02d}.html"
        open(p, "w", encoding="utf-8").write(series.frame(no, sc["label"], sc["html"], "file://" + css))
        jobs.append(dict(html=p, steps=sorted({ln[0] for ln in sc["lines"]}), out=f"{wd}/slides/s{i:02d}_%d.png"))
    json.dump(jobs, open(f"{wd}/jobs.json", "w"))
    open(f"{work}/render.js", "w").write(RENDER_JS)
    sh("node", f"{work}/render.js", f"{wd}/jobs.json")

    audio, events, t = [np.zeros(int(SR * 0.3), np.float32)], [], 0.3
    for i, sc in enumerate(scenes):
        audio.append(np.zeros(int(SR * PAD_START), np.float32))
        events.append((t, i, sc["lines"][0][0], None)); t += PAD_START
        for j, ln in enumerate(sc["lines"]):
            step, sub = ln[0], ln[1]
            say = ln[2] if len(ln) > 2 else reading(sub)
            a = tts(say, f"{wd}/tts/{i:02d}_{j:02d}.wav", engine)
            events.append((t, i, step, sub))
            audio.append(a); t += len(a) / SR
            g = GAP_LINE if j < len(sc["lines"]) - 1 else PAD_END
            audio.append(np.zeros(int(SR * g), np.float32)); t += g
    audio = np.concatenate(audio)
    audio = audio / max(1e-6, np.abs(audio).max()) * 0.89
    total = len(audio) / SR
    with wave.open(f"{wd}/narration.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((audio * 32767).astype(np.int16).tobytes())

    # speaking envelope → little hops of the photo card
    nfr = int(math.ceil(total * FPS)); hop = SR // FPS
    rms = np.array([np.sqrt(np.mean(audio[k * hop:(k + 1) * hop] ** 2) + 1e-12) for k in range(nfr)])
    ref = np.percentile(rms[rms > 0.01], 80) if (rms > 0.01).any() else 1
    env = np.clip(rms / ref, 0, 1)
    sm = np.zeros(nfr)
    for k in range(nfr):
        sm[k] = max(env[k], sm[k - 1] * 0.82) if k else env[k]

    font = ImageFont.truetype(FONT, 40)
    slides, subs, bases = {}, {}, {}

    def base(key):
        if key not in bases:
            i, step, sub = key
            if (i, step) not in slides:
                slides[(i, step)] = Image.open(f"{wd}/slides/s{i:02d}_{step}.png").convert("RGBA")
            im = slides[(i, step)].copy()
            if sub:
                subs.setdefault(sub, subtitle_img(sub, font))
                im.alpha_composite(subs[sub])
            if len(bases) > 6:
                bases.clear()
            bases[key] = im
        return bases[key]

    out_v = f"{wd}/video_noaudio.mp4"
    enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                            "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium",
                            "-crf", "20", "-pix_fmt", "yuv420p", out_v], stdin=subprocess.PIPE)
    ei, prev_key, t_change = 0, None, -10
    cur_key = events[0][1:]
    phase = 0.0
    for f in range(nfr):
        tf = f / FPS
        while ei < len(events) and events[ei][0] <= tf:
            nk = events[ei][1:]
            if nk != cur_key:
                prev_key, cur_key, t_change = cur_key, nk, tf
            ei += 1
        frame = base(cur_key)
        a = (tf - t_change) / XFADE
        frame = Image.blend(base(prev_key), frame, 0.5 - 0.5 * math.cos(math.pi * a)) if prev_key and a < 1 else frame.copy()
        phase += 2 * math.pi * 3.2 / FPS * (0.4 + sm[f])
        dy = -round(14 * sm[f] * abs(math.sin(phase))) + round(3 * math.sin(2 * math.pi * tf / 4.0))
        frame.alpha_composite(card, (CARD_BOX[0], CARD_BOX[1] + dy))
        enc.stdin.write(frame.convert("RGB").tobytes())
    enc.stdin.close(); enc.wait()
    final = f"{work}/第{no:02d}回_{ep['short']}.mp4"
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", out_v, "-i", f"{wd}/narration.wav", "-c:v", "copy",
       "-c:a", "aac", "-b:a", "160k", "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "48000", "-shortest",
       "-movflags", "+faststart", final)
    print(f"done: {final} ({total:.1f}s)", flush=True)
    return final, total


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("work")
    ap.add_argument("--photo", required=True)
    ap.add_argument("--ep", default="1,2,3,4,5,6,7,8,9,10")
    ap.add_argument("--engine", default="http://localhost:50021")
    ap.add_argument("--preview", type=int)
    a = ap.parse_args()
    os.makedirs(a.work, exist_ok=True)
    card = photo_card(a.photo)
    for n in [int(x) for x in a.ep.split(",")]:
        ep = importlib.import_module(f"episodes.ep{n:02d}").EP
        build_episode(ep, a.work, card, a.engine, a.preview)


if __name__ == "__main__":
    main()
