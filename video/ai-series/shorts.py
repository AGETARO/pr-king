#!/usr/bin/env python3
"""Vertical YouTube Shorts (1080x1920, under 60 s) cut from an episode.

Usage: python3 shorts.py <build_work_dir> --photo 犬.jpg [--engine http://localhost:50021]
Needs the episode to have been built first (reuses its slide images and narration).
"""
import argparse, importlib, math, os, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build, series, talking_photo  # noqa: E402

W, H, FPS, SR = 1080, 1920, 30, 48000
INK = (36, 54, 90, 255)
SKY = (220, 238, 250, 255)
SUN = (255, 199, 56, 255)

# episode, scene index, file name, hook title (2 lines), spoken hook, spoken outro, scene lines to skip
SHORTS = [
    (1, 7, "short_第01回_AIの苦手なこと", ("AIを使う前に", "知っておきたい4つ"),
     "AIを使う前に、これだけは知っておいてください。", "くわしくは、本編の第1回で解説しています。", (0,)),
    (1, 6, "short_第01回_Claudeをおすすめする理由", ("どのAIを", "使えばいい？"),
     "どの生成AIを使えばいいか、迷っていませんか？", "くわしくは、本編の第1回で解説しています。", (5,)),
]


def font(name, size):
    return ImageFont.truetype(os.path.join(HERE, "fonts", name), size)


def outlined(d, xy, text, f, fill=INK, stroke=(255, 255, 255, 255), sw=12, anchor="mm"):
    d.text(xy, text, font=f, fill=fill, stroke_width=sw, stroke_fill=stroke, anchor=anchor)


def background(title, ep_no, ep_title):
    im = Image.new("RGBA", (W, H), SKY)
    d = ImageDraw.Draw(im)
    for y in range(0, H, 46):  # dot pattern
        for x in range(0, W, 46):
            d.ellipse((x + 18, y + 18, x + 28, y + 28), fill=(205, 229, 247, 255))
    # series badge
    d.rounded_rectangle((60, 70, 520, 140), 35, fill=INK)
    d.text((290, 105), f"{series.SERIES}　第{ep_no}回より", font=font("ZenMaruGothic-Black.ttf", 34), fill="white", anchor="mm")
    # hook title
    big = font("MochiyPopOne-Regular.ttf", 104)
    outlined(d, (W // 2, 250), title[0], big, sw=14)
    outlined(d, (W // 2, 380), title[1], big, sw=14)
    # bottom call to action
    d.rounded_rectangle((50, 1770, 1030, 1880), 30, fill=SUN, outline=INK, width=6)
    d.text((W // 2, 1825), f"続きは本編「第{ep_no}回」で！ チャンネル登録もよろしく", font=font("ZenMaruGothic-Black.ttf", 36), fill=INK, anchor="mm")
    return im


def slide_panel(path):
    sl = Image.open(path).convert("RGBA").crop((40, 120, 1340, 860))  # content area only
    sl = sl.resize((960, 546), Image.LANCZOS)
    panel = Image.new("RGBA", (980, 566), (0, 0, 0, 0))
    d = ImageDraw.Draw(panel)
    d.rounded_rectangle((10, 10, 979, 565), 30, fill=INK)
    mask = Image.new("L", sl.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, sl.width - 1, sl.height - 1), 26, fill=255)
    panel.paste(sl, (0, 0), mask)
    ImageDraw.Draw(panel).rounded_rectangle((0, 0, 959, 545), 26, outline=INK, width=6)
    return panel


def subtitle(text):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f = font("ZenMaruGothic-Bold.ttf", 42)
    lines = build.wrap(text, f, 900, d)
    lh = 58
    y0, x0, x1 = 1490, 50, 1030
    h = lh * len(lines) + 44
    d.rounded_rectangle((x0 + 7, y0 + 7, x1 + 7, y0 + h + 7), 30, fill=INK)
    tail = [(380, y0 + 6), (420, y0 - 46), (460, y0 + 6)]
    d.polygon(tail, fill=(255, 255, 255, 255), outline=INK, width=5)
    d.rounded_rectangle((x0, y0, x1, y0 + h), 30, fill=(255, 255, 255, 255), outline=INK, width=5)
    d.polygon([(386, y0 + 8), (420, y0 - 38), (454, y0 + 8)], fill=(255, 255, 255, 255))
    for k, ln in enumerate(lines):
        d.text((W // 2, y0 + 22 + k * lh + lh // 2), ln, font=f, fill=INK, anchor="mm")
    return img


def read_wav(p):
    with wave.open(p) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768


def make_short(cfg, work, cards, engine, out_dir):
    ep_no, si, name, title, hook, outro, skip = cfg
    ep = importlib.import_module(f"episodes.ep{ep_no:02d}").EP
    sc = ep["scenes"][si]
    wd = f"{work}/ep{ep_no:02d}"
    os.makedirs(f"{work}/shorts", exist_ok=True)
    first_step = sc["lines"][0][0]
    # timeline: (audio, subtitle, step)
    seq = [(build.tts(hook, f"{work}/shorts/{name}_hook.wav", engine), hook, first_step)]
    for j, ln in enumerate(sc["lines"]):
        if j in skip:
            continue
        seq.append((read_wav(f"{wd}/tts/{si:02d}_{j:02d}.wav"), ln[1], ln[0]))
    seq.append((build.tts(outro, f"{work}/shorts/{name}_outro.wav", engine), outro, sc["lines"][-1][0]))
    audio, events, t = [np.zeros(int(SR * 0.3), np.float32)], [], 0.3
    for k, (a, sub, step) in enumerate(seq):
        events.append((t, step, sub))
        audio.append(a); t += len(a) / SR
        g = 0.45 if k < len(seq) - 1 else 1.0
        audio.append(np.zeros(int(SR * g), np.float32)); t += g
    audio = np.concatenate(audio); audio = audio / max(1e-6, np.abs(audio).max()) * 0.89
    total = len(audio) / SR
    assert total < 60, f"{name}: {total:.1f}s is too long for a Short"
    wav = f"{work}/shorts/{name}.wav"
    with wave.open(wav, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((audio * 32767).astype(np.int16).tobytes())

    nfr = int(math.ceil(total * FPS)); hop = SR // FPS
    rms = np.array([np.sqrt(np.mean(audio[k * hop:(k + 1) * hop] ** 2) + 1e-12) for k in range(nfr)])
    ref = np.percentile(rms[rms > 0.01], 80)
    env = np.clip(rms / ref, 0, 1); sm = np.zeros(nfr)
    for k in range(nfr):
        sm[k] = max(env[k], sm[k - 1] * 0.65) if k else env[k]
    target = np.clip(np.round(np.clip((sm - 0.12) / 0.88, 0, 1) * (len(cards) - 1)), 0, len(cards) - 1).astype(int)
    mouth = np.zeros(nfr, int)
    for k in range(1, nfr):
        mouth[k] = mouth[k - 1] + int(np.clip(target[k] - mouth[k - 1], -3, 3))

    bg = background(title, ep_no, ep["title"])
    panels = {}
    subs = {}
    out_v = f"{work}/shorts/{name}_v.mp4"
    enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                            "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
                            "-pix_fmt", "yuv420p", out_v], stdin=subprocess.PIPE)
    ei, cur = 0, events[0]
    for fr in range(nfr):
        tf = fr / FPS
        while ei < len(events) and events[ei][0] <= tf:
            cur = events[ei]; ei += 1
        _, step, sub = cur
        if step not in panels:
            panels[step] = slide_panel(f"{wd}/slides/s{si:02d}_{step}.png")
        if sub not in subs:
            subs[sub] = subtitle(sub)
        frame = bg.copy()
        frame.alpha_composite(panels[step], (50, 470))
        card = cards[mouth[fr]]
        dy = round(2 * math.sin(2 * math.pi * tf / 4.5))
        frame.alpha_composite(card, (W // 2 - card.width // 2, 1040 + dy))
        frame.alpha_composite(subs[sub])
        enc.stdin.write(frame.convert("RGB").tobytes())
    enc.stdin.close(); enc.wait()
    final = os.path.join(out_dir, f"{name}.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", out_v, "-i", wav, "-c:v", "copy", "-c:a", "aac",
                    "-b:a", "160k", "-af", "loudnorm=I=-14:TP=-1.5", "-ar", "48000", "-shortest",
                    "-movflags", "+faststart", final], check=True)
    os.remove(out_v)
    print(f"done: {final} ({total:.1f}s)", flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("work")
    ap.add_argument("--photo", required=True)
    ap.add_argument("--engine", default="http://localhost:50021")
    ap.add_argument("--out", default=None)
    a = ap.parse_args()
    out = a.out or a.work
    os.makedirs(out, exist_ok=True)
    frames = talking_photo.make_frames(a.photo, series.MOUTH, 8)
    big = [build.photo_card(f, series.FACE) for f in frames]
    cards = [c.resize((int(c.width * 0.75), int(c.height * 0.75)), Image.LANCZOS) for c in big]
    for cfg in SHORTS:
        make_short(cfg, a.work, cards, a.engine, out)


if __name__ == "__main__":
    main()
