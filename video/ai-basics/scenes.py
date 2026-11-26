"""Video script: slides (HTML) + narration lines.

Each line = (step, subtitle_text[, speech_text]).
Elements in the slide HTML with data-s="n" appear when the narration reaches step n.
"""

SERIES = "AI活用のはじめかた"

# Replacements so the Japanese TTS reads English words naturally (longest first).
READINGS = [
    ("claude --version", "クロード ハイフン ハイフン バージョン"),
    ("claude.ai", "クロード ドット エーアイ"),
    ("index.html", "インデックス ドット エイチティーエムエル"),
    ("Claude Code", "クロード コード"),
    ("ChatGPT", "チャットジーピーティー"),
    ("Anthropic", "アンソロピック"),
    ("Gemini", "ジェミニ"),
    ("Claude", "クロード"),
    ("claude", "クロード"),
    ("ToDo", "トゥードゥー"),
    ("Chat", "チャット"),
    ("Code", "コード"),
    ("Google", "グーグル"),
    ("Windows", "ウィンドウズ"),
    ("Mac", "マック"),
    ("Pro", "プロ"),
    ("Max", "マックス"),
    ("PDF", "ピーディーエフ"),
    ("AI", "エーアイ"),
]

SCENES = [
    # ------------------------------------------------------------------ 0
    dict(
        label="はじめに",
        html="""
<div class="title-wrap">
  <div class="kicker">初心者のための基本ガイド</div>
  <h1 class="hero">AIを活用するための<br><span class="accent">はじめの一歩</span></h1>
  <p class="lead">おすすめは Claude。<br>Chat と Code の基本を、ゼロからやさしく。</p>
  <div class="chips"><span class="chip">生成AIの選び方</span><span class="chip">無料と有料</span><span class="chip">プロンプト</span><span class="chip">アプリづくり</span></div>
</div>""",
        lines=[
            (0, "こんにちは。案内役のあかりです。"),
            (0, "この動画では、AIを仕事や毎日の生活に活かすための、基本のやることを順番にお伝えします。"),
            (0, "専門知識がなくても大丈夫です。ゆっくり一緒に進めていきましょう。"),
        ],
    ),
    # ------------------------------------------------------------------ 1
    dict(
        label="今日の内容",
        html="""
<h2>今日の内容</h2>
<ol class="agenda">
  <li data-s="1"><b>01</b>どの生成AIがオススメ？</li>
  <li data-s="2"><b>02</b>使いはじめるために</li>
  <li data-s="3"><b>03</b>無料版と有料版のちがい</li>
  <li data-s="4"><b>04</b>Chat：使い方と、伝わるプロンプト</li>
  <li data-s="5"><b>05</b>Code：最初の設定から、簡単なアプリづくり</li>
</ol>""",
        lines=[
            (0, "今日の内容は、5つです。"),
            (1, "まず、どの生成AIを選べばいいのか。"),
            (2, "次に、使いはじめるための準備。"),
            (3, "そして、無料版と有料版のちがい。"),
            (4, "後半は、Chatの使い方と、伝わるプロンプトの書き方。"),
            (5, "最後に、Claude Codeの設定から、簡単なアプリづくりまでを体験します。"),
        ],
    ),
    # ------------------------------------------------------------------ 2
    dict(
        label="01 どの生成AIがオススメ？",
        html="""
<h2>どの生成AIがオススメ？</h2>
<div class="others" data-s="0">ChatGPT ／ Gemini ／ Copilot ／ Claude …… たくさんあって迷いますよね</div>
<div class="answer" data-s="1"><span class="small">はじめの一つに</span>Claude <span class="small">（クロード）／ Anthropic社</span></div>
<div class="grid2">
  <div class="card" data-s="2"><div class="num">1</div><h3>日本語が自然</h3><p>ていねいで読みやすい文章</p></div>
  <div class="card" data-s="3"><div class="num">2</div><h3>長い資料に強い</h3><p>要約・整理・比較が得意</p></div>
  <div class="card" data-s="4"><div class="num">3</div><h3>安全性を重視</h3><p>慎重で誠実な設計</p></div>
  <div class="card" data-s="5"><div class="num">4</div><h3>Chat も Code も</h3><p>同じアカウントで使える</p></div>
</div>""",
        lines=[
            (0, "生成AIには、ChatGPTやGeminiなど、たくさんの種類があります。"),
            (1, "その中で、はじめの一つとしておすすめしたいのが、Anthropic社のClaudeです。"),
            (2, "理由の一つ目は、日本語が自然で、文章がていねいなこと。"),
            (3, "二つ目は、長い資料を読んで、要約や整理をするのが得意なこと。"),
            (4, "三つ目は、安全性を大切に設計されていること。"),
            (5, "そして四つ目は、会話のChatと、ものづくりのCodeを、同じアカウントで使えることです。"),
            (5, "あれこれ試すよりも、まずは一つに決めて使い込むのが、上達の近道ですよ。"),
        ],
    ),
    # ------------------------------------------------------------------ 3
    dict(
        label="02 使いはじめるために",
        html="""
<h2>使いはじめるために</h2>
<div class="flow">
  <div class="fstep" data-s="1"><div class="fnum">STEP 1</div><h3>アクセス</h3><p><code>claude.ai</code><br>または公式アプリ<br>（スマホ・PC）</p></div>
  <div class="arrow" data-s="2">›</div>
  <div class="fstep" data-s="2"><div class="fnum">STEP 2</div><h3>登録</h3><p>Googleアカウント<br>または<br>メールアドレス</p></div>
  <div class="arrow" data-s="3">›</div>
  <div class="fstep" data-s="3"><div class="fnum">STEP 3</div><h3>確認</h3><p>名前を入力<br>利用規約を<br>確認</p></div>
  <div class="arrow" data-s="4">›</div>
  <div class="fstep" data-s="4"><div class="fnum">STEP 4</div><h3>話しかける</h3><p>入力欄に<br>最初の質問を<br>送ってみる</p></div>
</div>
<div class="caution" data-s="5"><b>注意</b>個人情報や、会社の機密情報は入力しない</div>""",
        lines=[
            (0, "では、使いはじめる準備をしましょう。"),
            (1, "まず、ブラウザで claude.ai にアクセスするか、スマートフォンやパソコンの公式アプリを入れます。"),
            (2, "次に、Googleアカウントか、メールアドレスで登録します。"),
            (3, "名前などを入力して、利用規約を確認したら準備完了です。"),
            (4, "あとは入力欄に、気軽に話しかけてみてください。"),
            (5, "ひとつだけ注意です。個人情報や、会社の機密情報は入力しないようにしましょう。"),
        ],
    ),
    # ------------------------------------------------------------------ 4
    dict(
        label="03 無料版と有料版のちがい",
        html="""
<h2>無料版と有料版のちがい</h2>
<table class="plans">
  <tr><th></th><th>Free（無料）</th><th class="rec">Pro</th><th>Max</th></tr>
  <tr data-s="1"><td>料金の目安</td><td>0円</td><td class="rec">月20ドル<br><span class="small">年払いで月17ドル相当</span></td><td>月100ドル／200ドル</td></tr>
  <tr data-s="1"><td>使える量</td><td>基本（上限あり）</td><td class="rec">無料版より多い</td><td>Proの5倍／20倍</td></tr>
  <tr data-s="2"><td>Claude Code</td><td>―</td><td class="rec">◎ 使える</td><td>◎ 使える</td></tr>
  <tr data-s="4"><td>こんな人に</td><td>まず試したい</td><td class="rec">毎日・仕事で使う</td><td>一日中たくさん使う</td></tr>
</table>
<p class="note">※ 2026年11月時点の目安（税別）。内容・料金は変わることがあります。最新情報は公式サイト（claude.com/pricing）で確認してください。</p>""",
        lines=[
            (0, "続いて、無料版と有料版のちがいです。"),
            (1, "無料版は、0円で基本の会話ができます。ただし、一定の時間に使える量には上限があります。"),
            (2, "有料のProプランは、月20ドルほど。使える量が増えて、Claude Codeも使えるようになります。"),
            (3, "さらに上のMaxプランは、月100ドルからで、Proの5倍、または20倍の量が使えます。"),
            (4, "おすすめは、まず無料版で毎日使ってみて、物足りなくなったらProに切りかえることです。"),
            (4, "料金は変わることがあるので、最新の情報は公式サイトで確認してくださいね。"),
        ],
    ),
    # ------------------------------------------------------------------ 5
    dict(
        label="04 Chat の使い方",
        html="""
<h2>Chat の基本の使い方</h2>
<div class="split">
  <div class="chatmock">
    <div class="bar"><i></i><i></i><i></i></div>
    <div class="msgs">
      <div class="bub user" data-s="1">来週の会議で話す、1分の自己紹介を考えて</div>
      <div class="bub ai" data-s="2">いいですね！より良くするために教えてください。<br>① 参加者はどんな方ですか？<br>② 伝えたい強みはありますか？</div>
      <div class="bub user" data-s="3">社内の10人くらい。資料づくりが得意です</div>
    </div>
    <div class="input" data-s="0">メッセージを入力… <span class="send">↑</span></div>
  </div>
  <ul class="steps">
    <li data-s="1"><b>①</b>入力欄に質問を書いて送信</li>
    <li data-s="2"><b>②</b>返事を読んで、追加で質問</li>
    <li data-s="3"><b>③</b>会話しながら少しずつ形に</li>
    <li data-s="4"><b>＋</b>PDF・画像の添付もOK</li>
  </ul>
</div>""",
        lines=[
            (0, "ここからは、Chatの使い方です。"),
            (1, "画面の下の入力欄に、聞きたいことを書いて送信します。"),
            (2, "返事がきたら、それを読んで、気になるところを追加で質問しましょう。"),
            (3, "一度で完璧な答えを目指すより、会話をしながら、少しずつ形にしていくのがコツです。"),
            (4, "PDFや画像を添付して、内容を読み取ってもらうこともできますよ。"),
        ],
    ),
    # ------------------------------------------------------------------ 6
    dict(
        label="04 伝わるプロンプトの書き方",
        html="""
<h2>伝わるプロンプトの <span class="accent">4つの要素</span></h2>
<div class="grid2">
  <div class="card el e1" data-s="1"><div class="tag">役割</div><p>「あなたはビジネス文書の専門家です」</p></div>
  <div class="card el e2" data-s="2"><div class="tag">目的・背景</div><p>何のために、どんな状況で使うのか</p></div>
  <div class="card el e3" data-s="3"><div class="tag">条件</div><p>文字数・入れる情報・避けること</p></div>
  <div class="card el e4" data-s="4"><div class="tag">出力形式</div><p>箇条書き・表・件名と本文 など</p></div>
</div>""",
        lines=[
            (0, "次は、少し工夫したプロンプトの書き方です。"),
            (0, "プロンプトとは、AIへのお願いの文章のこと。ポイントは4つの要素です。"),
            (1, "一つ目は役割。たとえば、あなたはビジネス文書の専門家です、と伝えます。"),
            (2, "二つ目は目的と背景。何のために、どんな状況で使うのかを書きます。"),
            (3, "三つ目は条件。文字数や、入れてほしい情報、避けてほしいことです。"),
            (4, "四つ目は出力形式。箇条書き、表、件名と本文など、形を指定します。"),
        ],
    ),
    # ------------------------------------------------------------------ 7
    dict(
        label="04 プロンプト Before / After",
        html="""
<h2>Before / After で比べてみよう</h2>
<div class="ba">
  <div class="bcard" data-s="1"><div class="blabel">Before</div><p class="prompt">謝罪メールを書いて</p><p class="res">→ ありきたりな文面に</p></div>
  <div class="acard" data-s="2"><div class="blabel">After</div>
    <p class="prompt"><span class="h1">あなたはビジネス文書の専門家です。</span><span class="h2">取引先に、納品が3日遅れることをお詫びするメールを書いてください。</span><span class="h3">【条件】200字程度／言い訳はしない／新しい納品日は12月5日</span><span class="h4">【形式】件名と本文に分けて</span></p>
    <p class="res">→ そのまま使える文面が返ってきやすい</p></div>
</div>""",
        lines=[
            (0, "実際に比べてみましょう。"),
            (1, "左は、謝罪メールを書いて、とだけお願いした例。これでも書いてくれますが、一般的な内容になりがちです。"),
            (2, "右は、4つの要素を入れた例です。"),
            (2, "役割、状況、条件、形式がはっきりしているので、そのまま使える文章が返ってきやすくなります。"),
            (2, "少し長く書くだけで、答えの質がぐっと変わりますよ。"),
        ],
    ),
    # ------------------------------------------------------------------ 8
    dict(
        label="04 もうひと工夫",
        html="""
<h2>覚えておきたい <span class="accent">もうひと工夫</span></h2>
<ul class="tips">
  <li data-s="1"><b>お手本を見せる</b><span>「こんな感じで」と例を貼ると、雰囲気を合わせてくれる</span></li>
  <li data-s="2"><b>先に質問してもらう</b><span>「足りない情報があれば、先に質問してください」</span></li>
  <li data-s="3"><b>段階に分ける</b><span>「まず構成案だけ」→「次に本文」と順番に</span></li>
  <li data-s="4"><b>注文を重ねる</b><span>「もっと短く」「もっとやわらかく」で仕上げる</span></li>
</ul>""",
        lines=[
            (0, "さらに、覚えておくと便利なひと工夫を紹介します。"),
            (1, "一つ目は、お手本を見せること。こんな感じで、と例を貼ると、雰囲気を合わせてくれます。"),
            (2, "二つ目は、足りない情報があれば先に質問してください、と添えること。"),
            (3, "三つ目は、大きな作業を、段階に分けてお願いすることです。"),
            (4, "そして返ってきた答えに、もっと短く、もっとやわらかく、と注文を重ねていきましょう。"),
        ],
    ),
    # ------------------------------------------------------------------ 9
    dict(
        label="05 Claude Code とは",
        html="""
<h2>Claude Code とは？</h2>
<p class="lead2" data-s="1">あなたのパソコンで、<b>ファイル作成やプログラムづくり</b>をしてくれるAI</p>
<div class="diagram" data-s="2">
  <div class="dbox">あなた<br><span>「〇〇を作って」</span></div><div class="darr">→</div>
  <div class="dbox main">Claude Code<br><span>計画 → 作成 → 確認</span></div><div class="darr">→</div>
  <div class="dbox">完成！<br><span>ファイル・アプリ</span></div>
</div>
<div class="chips" data-s="3"><span class="chip">Pro 以上のプラン</span><span class="chip">パソコン（Mac / Windows / Linux）</span><span class="chip">ターミナル or デスクトップアプリ</span></div>""",
        lines=[
            (0, "ここからは、Claude Codeです。"),
            (1, "Claude Codeは、あなたのパソコンの中で、ファイルを作ったり、プログラムを書いたりしてくれるAIです。"),
            (2, "やりたいことを言葉で伝えるだけで、計画を立てて、作って、確認までしてくれます。"),
            (3, "使うには、Pro以上のプランと、パソコンが必要です。"),
        ],
    ),
    # ------------------------------------------------------------------ 10
    dict(
        label="05 Claude Code 最初の設定",
        html="""
<h2>最初の設定</h2>
<div class="term">
  <div class="bar"><i></i><i></i><i></i><span>ターミナル（Windows は PowerShell）</span></div>
  <div class="tbody">
    <div data-s="2"><span class="cm"># ② インストール（Mac / Linux）</span></div>
    <div data-s="2"><span class="pr">$</span> curl -fsSL https://claude.ai/install.sh | bash</div>
    <div data-s="2"><span class="cm"># Windows（PowerShell）の場合</span></div>
    <div data-s="2"><span class="pr">&gt;</span> irm https://claude.ai/install.ps1 | iex</div>
    <div data-s="3"><span class="cm"># ③ 確認：バージョン番号が出ればOK</span></div>
    <div data-s="3"><span class="pr">$</span> claude --version</div>
    <div data-s="4"><span class="cm"># ④ 作業フォルダを作って起動</span></div>
    <div data-s="4"><span class="pr">$</span> mkdir my-app &amp;&amp; cd my-app</div>
    <div data-s="4"><span class="pr">$</span> claude</div>
    <div data-s="5"><span class="ok">→ ⑤ 初回はブラウザでログイン</span></div>
  </div>
</div>
<p class="note" data-s="1">① まずターミナルを開く　※コマンドは公式ドキュメント（code.claude.com）からコピーできます</p>""",
        lines=[
            (0, "では、最初の設定をしていきましょう。"),
            (1, "まず、ターミナルを開きます。Macならターミナル、Windowsならパワーシェルというアプリです。"),
            (2, "次に、インストール用のコマンドを貼り付けて実行します。コマンドは公式のページからコピーできます。"),
            (3, "終わったら claude --version と入力。バージョン番号が出れば成功です。",
             "終わったら、クロード、ハイフン、ハイフン、バージョン、と入力します。番号が出れば成功です。"),
            (4, "次に、作業用のフォルダを作って、その中で claude と入力して起動します。"),
            (5, "初回はブラウザが開くので、Claudeのアカウントでログインしてください。"),
            (5, "ターミナルが苦手な方は、デスクトップアプリやブラウザ版から使うこともできますよ。"),
        ],
    ),
    # ------------------------------------------------------------------ 11
    dict(
        label="05 簡単なアプリを作ろう",
        html="""
<h2>簡単なアプリを作ろう：ToDoリスト</h2>
<div class="term tall">
  <div class="bar"><i></i><i></i><i></i><span>my-app — claude</span></div>
  <div class="tbody jp">
    <div class="you" data-s="1"><span class="pr">&gt;</span> シンプルなToDoリストアプリを index.html 1つで作って。タスクの追加・完了チェック・削除ができて、データはブラウザに保存。落ち着いた色のデザインでお願い。</div>
    <div data-s="2"><span class="dot">●</span> 了解しました。次の内容で index.html を作成します。</div>
    <div class="ind" data-s="2">・入力欄と追加ボタン　・チェックで完了　・削除ボタン　・ブラウザに自動保存</div>
    <div class="ask" data-s="2">index.html を作成してもよいですか？<br><span class="sel" data-s="3">❯ 1. はい</span>　 2. いいえ</div>
    <div data-s="4"><span class="ok">✓ index.html を作成しました。ブラウザで開いて確認してください。</span></div>
  </div>
</div>""",
        lines=[
            (0, "いよいよ、簡単なアプリを作ってみましょう。題材はToDoリストです。"),
            (1, "起動したClaude Codeに、作りたいものを日本語で伝えます。"),
            (1, "Chatと同じく、条件をはっきり書くのがポイントです。"),
            (2, "すると、作り方を考えて、ファイルを作ってもいいか確認してきます。"),
            (3, "内容を見て、問題なければ、はいを選びます。"),
            (4, "これで、index.html というファイルができあがりました。"),
        ],
    ),
    # ------------------------------------------------------------------ 12
    dict(
        label="05 完成と改良",
        html="""
<h2>完成！ブラウザで開いてみよう</h2>
<div class="split">
  <div class="browser">
    <div class="bar"><i></i><i></i><i></i><span>index.html</span></div>
    <div class="todo">
      <h4>今日のToDo</h4>
      <div class="add"><span>新しいタスク…</span><b>追加</b></div>
      <div class="item done"><i>✓</i><span>企画書の構成を考える</span><em>削除</em></div>
      <div class="item"><i></i><span>Claudeでメールの下書き</span><em>削除</em></div>
      <div class="item"><i></i><span>会議資料を印刷する</span><em>削除</em></div>
    </div>
  </div>
  <div class="next">
    <p class="nlabel" data-s="1">次のお願い例</p>
    <div class="say" data-s="1">「期限を設定できるようにして」</div>
    <div class="say" data-s="1">「スマホでも見やすくして」</div>
    <div class="say" data-s="1">「完了したタスクは下に並べて」</div>
    <p class="hint" data-s="2">小さく頼んで、<br>動きを確かめながら進める</p>
  </div>
</div>""",
        lines=[
            (0, "できたファイルを、ブラウザで開いてみましょう。"),
            (0, "タスクを入力して追加。チェックを入れると完了、削除ボタンで消せます。ちゃんと動いていますね。"),
            (1, "ここから、期限を設定できるようにして、や、スマホでも見やすくして、とお願いすれば、どんどん改良できます。"),
            (2, "一度にたくさん頼むより、小さく頼んで、動きを確かめながら進めるのがコツです。"),
        ],
    ),
    # ------------------------------------------------------------------ 13
    dict(
        label="まとめ",
        html="""
<h2>今日のまとめ</h2>
<ul class="summary">
  <li data-s="1"><b>1</b>Claude に登録して、まずは無料版で毎日使う</li>
  <li data-s="2"><b>2</b>プロンプトは「役割・目的・条件・形式」</li>
  <li data-s="3"><b>3</b>慣れたら Pro で、Claude Code のものづくりへ</li>
  <li data-s="4"><b>4</b>AIの答えは、最後に必ず自分の目で確認</li>
</ul>""",
        lines=[
            (0, "最後に、今日のまとめです。"),
            (1, "まずはClaudeに登録して、無料版で毎日使ってみること。"),
            (2, "プロンプトは、役割、目的、条件、形式の4つを意識すること。"),
            (3, "慣れてきたらProプランにして、Claude Codeで、ものづくりにも挑戦してみてください。"),
            (4, "そして、AIはまちがえることもあります。大切な内容は、最後に必ず自分の目で確認しましょう。"),
        ],
    ),
    # ------------------------------------------------------------------ 14
    dict(
        label="おわりに",
        html="""
<div class="title-wrap end">
  <h1 class="hero">おつかれさまでした</h1>
  <p class="lead">まずは今日、ひとつ話しかけてみましょう。</p>
  <div class="credits">
    <p>音声合成：HTS Voice "Mei"（© Nagoya Institute of Technology, CC BY 3.0）／ Open JTalk</p>
    <p>フォント：Noto Sans CJK JP（SIL Open Font License 1.1）</p>
    <p>イラスト・スライド：本動画のためのオリジナル制作</p>
    <p>料金・手順は2026年11月時点の情報です。本動画はAnthropic社とは関係のない非公式の解説です。<br>Claude および Claude Code は Anthropic PBC の商標です。</p>
  </div>
</div>""",
        lines=[
            (0, "今日の内容は以上です。"),
            (0, "AIは、使えば使うほど、上手に付き合えるようになります。まずは今日、ひとつ話しかけてみてくださいね。"),
            (0, "ご視聴、ありがとうございました。"),
        ],
    ),
]
