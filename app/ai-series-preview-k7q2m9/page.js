// app/ai-series-preview-k7q2m9/page.js - 動画シリーズ「AIのはじめかた」のテスト閲覧用ページ
// どこからもリンクしていない非公開ページ。検索エンジンに載せない（noindex）、サイトマップにも入れない。
import styles from './page.module.css';

const BASE = '/ai-series-preview-k7q2m9';

const EPISODES = [
  { no: 1, title: 'AIってなに？どれを使えばいい？', length: '9:59' },
  { no: 2, title: 'Claudeを使いはじめよう', length: '9:30' },
  { no: 3, title: '無料版と有料版のちがい', length: '9:45' },
  { no: 4, title: 'Chatの基本の使い方', length: '9:25' },
  { no: 5, title: '伝わるプロンプトの書き方', length: '9:27' },
  { no: 6, title: 'Claude Code 入門：最初の設定', length: '9:42' },
  { no: 7, title: 'Claude Codeで簡単なアプリを作ろう', length: '9:28' },
  { no: 8, title: 'お仕事別の活用①　個人商店・飲食業・アパレル', length: '8:46' },
  { no: 9, title: 'お仕事別の活用②　金融・官公庁・政治家', length: '9:26' },
  { no: 10, title: 'お仕事別の活用③　警察官・消防官・自衛隊　と、シリーズのまとめ', length: '9:51' },
];

const SHORTS = [
  { file: 'short1.mp4', title: 'AIを使う前に知っておきたい4つのこと', length: '0:54' },
  { file: 'short2.mp4', title: 'どの生成AIを使えばいい？', length: '0:55' },
];

export const metadata = {
  title: '動画テスト閲覧：AIのはじめかた',
  description: '動画シリーズ「AIのはじめかた」のテスト閲覧用ページです。',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

const pad = (n) => String(n).padStart(2, '0');

export default function SeriesPreviewPage() {
  return (
    <div className={`gizmodo-main-container ${styles.wrap}`}>
      <div className={styles.notice}>
        テスト閲覧用のページです。URLを知っている人だけが見られます（検索には表示されません）。
        動画は確認用に画質を720pに下げています。
      </div>

      <h1 className={styles.title}>AIのはじめかた　全10回</h1>
      <p className={styles.lead}>
        ナビ犬のたぬきといっしょに、生成AI（Claude）のはじめかたから仕事での活用までを学ぶシリーズです。
      </p>

      <ol className={styles.list}>
        {EPISODES.map((ep) => (
          <li key={ep.no} className={styles.item} id={`ep${pad(ep.no)}`}>
            <video
              className={styles.video}
              controls
              preload="none"
              playsInline
              poster={`${BASE}/thumb${pad(ep.no)}.jpg`}
              src={`${BASE}/ep${pad(ep.no)}.mp4`}
            />
            <div className={styles.meta}>
              <span className={styles.ep}>第{ep.no}回</span>
              <span className={styles.epTitle}>{ep.title}</span>
              <span className={styles.len}>{ep.length}</span>
            </div>
          </li>
        ))}
      </ol>

      <h2 className={styles.sub}>ショート動画</h2>
      <div className={styles.shorts}>
        {SHORTS.map((s) => (
          <figure key={s.file} className={styles.short}>
            <video className={styles.shortVideo} controls preload="metadata" playsInline src={`${BASE}/${s.file}`} />
            <figcaption>
              {s.title}（{s.length}）
            </figcaption>
          </figure>
        ))}
      </div>

      <p className={styles.credit}>
        音声：VOICEVOX:ずんだもん ／ 本動画は Anthropic 社とは関係のない非公式の解説です。
      </p>
    </div>
  );
}
