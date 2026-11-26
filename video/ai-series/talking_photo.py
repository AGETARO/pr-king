"""Make a still photo of a dog 'talk': lower the jaw below the mouth line and paint the mouth interior.

make_frames(photo, mouth, levels) -> list of RGB PIL images, index 0 = closed, last = widest open.
mouth = dict(cx, y, half, open_px, curve) in the photo's own pixel coordinates.
"""
import cv2
import numpy as np
from PIL import Image


def _smooth(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


def make_frames(path, mouth, levels=8):
    src = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    h, w = src.shape[:2]
    cx, my, half = mouth["cx"], mouth["y"], mouth["half"]
    curve = mouth.get("curve", 0.004)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    line = my + curve * (xx - cx) ** 2                      # mouth line (corners slightly lower)
    q = (1 - _smooth(np.abs(xx - cx) / half)) ** 1.1       # how much each column opens
    jaw = 1 - _smooth((yy - line - 18) / 60)                # jaw moves fully near the lip, fades toward the chest
    below = (yy >= line).astype(np.float32)

    # mouth interior colour: dark throat at the top, pink tongue toward the bottom
    frames = []
    for k in range(levels):
        d = mouth["open_px"] * k / (levels - 1)
        if d == 0:
            frames.append(Image.fromarray(src.astype(np.uint8)))
            continue
        dy = d * q * jaw * below
        # the upper lip lifts a little too (fades out toward the nose)
        lift = 0.18 * d * q * (1 - _smooth((line - yy) / 14)) * (1 - below)
        map_x = xx
        map_y = yy - dy + lift
        warped = cv2.remap(src, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        top = line - 0.18 * d * q
        gap = d * q * 1.18                                  # gap height per column
        inside = (yy >= top) & (yy < top + gap)
        rel = np.where(gap > 0, (yy - top) / np.maximum(gap, 1e-3), 0)  # 0 at upper lip, 1 at lower lip
        throat = np.array([24, 12, 14], np.float32)
        tongue = np.array([150, 66, 74], np.float32)
        tmix = 0.85 * _smooth((rel - 0.55) / 0.4)[..., None] * _smooth((gap - 4) / 6)[..., None] * \
            (1 - _smooth(np.abs(xx - cx) / (half * 0.75)))[..., None]
        interior = throat * (1 - tmix) + tongue * tmix
        # soft shading near the lips
        shade = 0.7 + 0.3 * np.sin(np.clip(rel, 0, 1) * np.pi)[..., None]
        interior = interior * shade
        mask = cv2.GaussianBlur(inside.astype(np.float32), (0, 0), 1.1)[..., None]
        out = warped * (1 - mask) + interior * mask
        frames.append(Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)))
    return frames


if __name__ == "__main__":
    import sys
    from series import MOUTH
    fr = make_frames(sys.argv[1], MOUTH, 8)
    cx, my = MOUTH["cx"], MOUTH["y"]
    tiles = [f.crop((cx - 90, my - 80, cx + 90, my + 70)).resize((360, 300), Image.LANCZOS) for f in fr]
    sheet = Image.new("RGB", (360 * 4, 300 * 2))
    for i, t in enumerate(tiles):
        sheet.paste(t, ((i % 4) * 360, (i // 4) * 300))
    sheet.save(sys.argv[2])
