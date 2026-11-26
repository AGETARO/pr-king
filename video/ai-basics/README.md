# 解説動画「AIを活用するための はじめの一歩」

Claude を例に、生成AIの選び方・始め方・無料版と有料版のちがい・Chat のプロンプト・Claude Code の設定と簡単なアプリづくりを解説する動画（約7分24秒、1920×1080、日本語字幕つき）の生成スクリプトです。

| ファイル | 内容 |
|---|---|
| `scenes.py` | 台本（字幕・読み上げ文）とスライドの HTML |
| `slide.css` | スライドのデザイン |
| `avatar.py` | ナビゲーター「あかり」のイラスト（SVG、オリジナル） |
| `build.py` | 音声合成 → スライド画像化 → 口パク合成 → MP4 出力 |

## 使用素材とライセンス（すべて商用利用可）

| 素材 | 出典・ライセンス | 表記 |
|---|---|---|
| 音声 | VOICEVOX:四国めたん（ノーマル）。「VOICEVOX:四国めたん」と表記すれば商用・非商用で利用可（[音声ライブラリ利用規約](https://zunko.jp/con_ongen_kiyaku.html)） | 動画のエンドクレジットに記載済み。動画の概要欄にも記載してください |
| フォント | Noto Sans CJK JP（SIL Open Font License 1.1） | 不要（エンドクレジットに記載済み） |
| イラスト・スライド・図 | 本動画のためのオリジナル制作 | ― |
| BGM・写真・他社のロゴ | 使っていません | ― |

概要欄のクレジット例:

```
音声：VOICEVOX:四国めたん
本動画は Anthropic 社とは関係のない非公式の解説です。Claude は Anthropic PBC の商標です。
```

料金・インストール手順は 2026年11月時点の情報です（claude.com/pricing、code.claude.com/docs）。公開前に最新の内容を確認してください。

## 動画の作り直し方（Ubuntu の場合）

```bash
docker run -d -p 50021:50021 voicevox/voicevox_engine:cpu-latest   # VOICEVOX エンジン
sudo apt-get install -y fonts-noto-cjk ffmpeg
pip install pillow numpy && npm i -g playwright && npx playwright install chromium
python3 build.py ./work                     # → ./work/AI活用のはじめの一歩.mp4
```

声の高さ・速さ・抑揚は `build.py` の `VV_PARAMS`、話者・スタイルは `VV_STYLE`（2 = 四国めたん ノーマル）で変えられます。

台本は `scenes.py` の各行 `(ステップ番号, 字幕[, 読み上げ文])` を書き換えます。英単語の読みは `READINGS` で調整します。
