#!/usr/bin/env python3
"""YouTube titles / descriptions with chapters, computed from the synthesized narration.

Usage: python3 youtube_meta.py <build_work_dir> <out_dir>
(<build_work_dir> is the folder build.py wrote to; the tts/*.wav files give the exact timings.)
"""
import importlib, os, sys, wave

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build, series  # noqa: E402

TAGS = "#AI #生成AI #Claude #ClaudeCode #AI初心者 #AIのはじめかた"


def ts(t):
    t = int(t)
    return f"{t // 60}:{t % 60:02d}"


def chapters(ep, work):
    t, out = 0.3, []
    for i, sc in enumerate(ep["scenes"]):
        out.append((t, sc["label"]))
        t += build.PAD_START
        for j in range(len(sc["lines"])):
            with wave.open(f"{work}/ep{ep['no']:02d}/tts/{i:02d}_{j:02d}.wav") as w:
                t += w.getnframes() / w.getframerate()
            t += build.GAP_LINE if j < len(sc["lines"]) - 1 else build.PAD_END
    # YouTube: first chapter at 0:00, chapters >= 10 s; merge repeated labels
    merged = []
    for st, lb in out:
        if merged and (merged[-1][1] == lb or st - merged[-1][0] < 10):
            continue
        merged.append((st, lb))
    merged[0] = (0, merged[0][1])
    return merged


def main():
    work, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    eps = [importlib.import_module(f"episodes.ep{n:02d}").EP for n in range(1, 11)]
    for k, ep in enumerate(eps):
        no = ep["no"]
        title = f"【第{no}回】{ep['title']}｜{series.SERIES}（初心者・研修向け）"
        prev_l = f"◀ 前回：第{no - 1}回 {eps[k - 1]['title']}" if k else ""
        next_l = f"▶ 次回：第{no + 1}回 {eps[k + 1]['title']}" if k < 9 else "▶ 全10回、おつかれさまでした！"
        ch = "\n".join(f"{ts(st)} {lb}" for st, lb in chapters(ep, work))
        desc = f"""{ep['title']}
ナビ犬の「{series.NAVI_NAME}」といっしょに、AIのはじめかたを全10回で学ぶシリーズです。
パソコンが苦手な方、社内研修、これから就職する高校生・大学生の方にもおすすめです。

{prev_l}
{next_l}
▶ 全10回の再生リスト：（ここに再生リストのURL）

■ チャプター
{ch}

■ 注意
料金・利用条件・手順は2026年11月時点の情報です。最新の内容は公式サイトで確認してください。
本動画は Anthropic 社とは関係のない非公式の解説です。Claude は Anthropic PBC の商標です。

■ クレジット
音声：{series.VOICE_CREDIT}
フォント：Zen Maru Gothic・Mochiy Pop One・Noto Color Emoji（SIL Open Font License 1.1）

{TAGS}
"""
        with open(f"{out}/第{no:02d}回.txt", "w", encoding="utf-8") as f:
            f.write(f"【タイトル】\n{title}\n\n【説明文】\n{desc.replace(chr(10) * 3, chr(10) * 2)}")
    print("ok")


if __name__ == "__main__":
    main()
