# 動画シリーズ「AIのはじめかた」全10回

初心者・社内研修・就職をひかえた高校生/大学生向けに、生成AI（Claude）のはじめかたから仕事での活用までを10回（各約9〜10分）で解説する動画の生成スクリプトです。

| 回 | タイトル |
|---|---|
| 第1回 | AIってなに？どれを使えばいい？ |
| 第2回 | Claudeを使いはじめよう |
| 第3回 | 無料版と有料版のちがい |
| 第4回 | Chatの基本の使い方 |
| 第5回 | 伝わるプロンプトの書き方 |
| 第6回 | Claude Code 入門：最初の設定 |
| 第7回 | Claude Codeで簡単なアプリを作ろう |
| 第8回 | お仕事別の活用①　個人商店・飲食業・アパレル |
| 第9回 | お仕事別の活用②　金融・官公庁・政治家 |
| 第10回 | お仕事別の活用③　警察官・消防官・自衛隊　と、シリーズのまとめ |

## ファイル

| ファイル | 内容 |
|---|---|
| `episodes/epNN.py` | 各回の台本（字幕・読み上げ文）とスライドの中身 |
| `series.py` | ナビ犬の名前、英単語の読み、スライド部品（カード・手順・チャット画面など） |
| `slide.css` | スライドのデザイン（空色×ひまわり色のステッカー風） |
| `fonts/` | Zen Maru Gothic・Mochiy Pop One（SIL OFL 1.1） |
| `build.py` | 音声合成 → スライド画像化 → 写真アバター合成 → MP4 出力 |

## 使用素材とライセンス

| 素材 | 出典・ライセンス | 表記 |
|---|---|---|
| 音声 | VOICEVOX:ずんだもん（ノーマル）。「VOICEVOX:ずんだもん」と表記すれば商用・非商用で利用可（[音声ライブラリ利用規約](https://zunko.jp/con_ongen_kiyaku.html)） | 第10回のエンドクレジットに記載。各回の概要欄にも記載してください |
| ナビ犬の写真 | 依頼者が提供した写真 | ― |
| フォント | Zen Maru Gothic・Mochiy Pop One・Noto Color Emoji（SIL Open Font License 1.1） | 不要（クレジットに記載済み） |
| スライド・図 | 本動画のためのオリジナル制作 | ― |

概要欄のクレジット例:

```
音声：VOICEVOX:ずんだもん
本動画は Anthropic 社とは関係のない非公式の解説です。Claude は Anthropic PBC の商標です。
```

料金・利用条件・インストール手順は 2026年11月時点の情報です。公開前に最新の内容を確認してください。

## 作り方

```bash
docker run -d -p 50021:50021 voicevox/voicevox_engine:cpu-latest   # VOICEVOX エンジン
pip install pillow numpy && npm i -g playwright && npx playwright install chromium
python3 build.py ./work --photo ./tanuki.jpg            # 全10回
python3 build.py ./work --photo ./tanuki.jpg --ep 3     # 第3回だけ
```

- 合成した音声は `work/epNN/tts/` に保存され、台本を変えていない行は次回から使い回します（写真だけ差しかえるときは速く終わります）。
- 写真は中央付近を縦長（約9:11）に切り抜いて使います。犬が中央に写った縦長の写真がきれいに収まります。
- ナビ犬の名前は `series.py` の `NAVI_NAME`、声の速さや高さは `build.py` の `VV_PARAMS` で変えられます。
