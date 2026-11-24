// lib/affiliates.js - 広告リンクとCTAカードの定義（サイト側の唯一の管理場所）
//
// ■ 提携リンクの差し替え方
//   ASP（A8.net 等）で提携が承認されたら、各案件の `url` を提携リンクに書き換え、
//   `affiliate: true` にしてください。記事を直さなくても全記事のボタンに反映されます。
//   `affiliate: false` のあいだは公式サイトへのリンクとして表示されます（報酬は発生しません）。
//
// ■ 記事での使い方
//   {{aff:card-001}}  … 本文中のテキストリンク
//   {{cta:card-001}}  … 申し込みカード（年会費・還元率の要約＋ボタン）
//   {{banner:etc-gas-card}} … ASP のバナー広告（banner を定義した案件のみ）
//   frontmatter の affiliate_ids があり本文に {{cta:...}} がない記事は、
//   「まとめ」見出しの直前に自動でCTAカードが入る（lib/posts.js）。
//
// ■ 表記ルール
//   数値は記事本文と同じ内容に揃え、「最大」「条件あり」を省かない。誇大な表現（最強・必携など）は使わない。

export const AFFILIATES = {
  'card-001': {
    name: '三井住友カード（NL）',
    label: '三井住友カード(NL) 公式サイト',
    url: 'https://www.smbc-card.com/',
    affiliate: false,
    badge: 'コンビニ・飲食店でよく払う人に',
    desc: '年会費は永年無料。対象のコンビニ・飲食店でスマホのタッチ決済を使うと、ポイント還元が最大7％になります（条件あり）。',
    points: [
      ['年会費', '永年無料'],
      ['還元率', '通常0.5％（対象のコンビニ・飲食店で最大7％）'],
      ['発行', 'ナンバーレス・最短10秒で即時発行'],
    ],
    button: '三井住友カード（NL）の詳細を見る',
  },
  'card-smbc-gold': {
    name: '三井住友カード ゴールド（NL）',
    label: '三井住友カード ゴールド(NL) 公式サイト',
    url: 'https://www.smbc-card.com/',
    affiliate: false,
    badge: '年100万円以上使う人に',
    desc: '年間100万円の利用で、翌年以降の年会費が永年無料になり、毎年10,000ポイントがもらえます。',
    points: [
      ['年会費', '5,500円（年100万円の利用で翌年以降 永年無料）'],
      ['還元率', '通常0.5％（対象のコンビニ・飲食店で最大7％）'],
      ['特典', '年100万円利用で10,000ポイント／国内主要空港ラウンジ'],
    ],
    button: 'ゴールド（NL）の詳細を見る',
  },
  'card-smbc-plat': {
    name: '三井住友カード プラチナプリファード',
    label: '三井住友カード プラチナプリファード 公式サイト',
    url: 'https://www.smbc-card.com/',
    affiliate: false,
    badge: 'ポイント重視で年間の利用額が大きい人に',
    desc: '通常還元率1.0％のポイント特化型カード。特約店ではポイントが上乗せされます。年会費が高いため、年間の利用額で元が取れるか確認してから選びましょう。',
    points: [
      ['年会費', '33,000円'],
      ['還元率', '通常1.0％（特約店で上乗せあり）'],
    ],
    button: 'プラチナプリファードの詳細を見る',
  },
  'card-002': {
    name: 'JCB CARD W',
    label: 'JCB CARD W 公式サイト',
    url: 'https://www.jcb.co.jp/',
    affiliate: false,
    badge: '39歳以下でAmazon・スタバをよく使う人に',
    desc: '年会費は永年無料で、いつでもポイント2倍。申し込みは18〜39歳限定ですが、40歳以降も年会費無料のまま使えます。',
    points: [
      ['年会費', '永年無料（39歳までに申し込めば40歳以降も無料）'],
      ['還元率', '通常1.0％（Amazonなどのパートナー店で上乗せ）'],
      ['発行', 'ナンバーレスは最短5分で即時発行'],
    ],
    button: 'JCB CARD W の詳細を見る',
  },
  'card-003': {
    name: '楽天カード',
    label: '楽天カード 公式サイト',
    url: 'https://www.rakuten-card.co.jp/',
    affiliate: false,
    badge: '楽天市場・楽天証券を使う人に',
    desc: '年会費は永年無料。楽天市場での買い物や、楽天証券のクレカ積立でポイントが貯まります。',
    points: [
      ['年会費', '永年無料'],
      ['還元率', '通常1.0％（楽天市場ではさらに上乗せ）'],
    ],
    button: '楽天カードの詳細を見る',
  },
  // A8.net 提携済み（ETC協同組合 ガソリンカード／事業者向け）。バナー広告のみ。
  // A8 の規約上、表示計測用の1x1画像（pixel）は必ず一緒に出す。
  'etc-gas-card': {
    name: 'ETC協同組合 ガソリンカード',
    label: 'ETC協同組合のガソリンカード（新設法人・個人事業主向け）',
    url: 'https://px.a8.net/svt/ejp?a8mat=4BGS1D+9KQ01E+3EV2+HZAGX',
    affiliate: true,
    pixel: 'https://www15.a8.net/0.gif?a8mat=4BGS1D+9KQ01E+3EV2+HZAGX',
    // 数値は公式サイト（etc-kumiai.jp/ogs.html）の記載どおり。割引額は公式に記載がないため書かない。
    badge: '新設法人・個人事業主・車を使う事業者に',
    desc: 'クレジットカードではないため、クレジット会社の審査はありません。設立直後の会社でも申し込めます（組合規定の審査あり）。',
    points: [
      ['年会費・手数料', '無料（組合加入時の出資金1万円は退会時に返金）'],
      ['使えるSS', '全国約6,400店舗のアポロステーション'],
      ['価格', '毎月末に算出する組合価格（全国均一。高速道路は別価格）'],
      ['支払い', '月末締め・翌月末日に口座振替'],
    ],
    button: 'ETC協同組合のガソリンカードを見る',
    note: '※発行には組合規定の審査があります。価格・条件の最新の内容は公式サイトでご確認ください。',
    banner: {
      src: 'https://www28.a8.net/svt/bgt?aid=261123313579&wid=001&eno=01&mid=s00000015923003020000&mc=1',
      width: 300,
      height: 250,
      alt: '新会社でも作れるガソリンカード ETC協同組合',
    },
  },
  'amazon-prime': {
    name: 'Amazon',
    label: 'Amazon.co.jp',
    url: 'https://www.amazon.co.jp/',
    affiliate: false,
  },
};

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function relFor(a) {
  // 提携リンクは sponsored、公式サイト直リンクは通常の外部リンク扱い
  return a.affiliate ? 'sponsored nofollow noopener noreferrer' : 'nofollow noopener noreferrer';
}

// ASP の表示計測用 1x1 画像（ある場合のみ）
function pixelFor(a) {
  return a.pixel ? `<img src="${esc(a.pixel)}" width="1" height="1" alt="" style="border:0" loading="lazy">` : '';
}

export function renderAffiliateLink(id) {
  const key = id.trim();
  const a = AFFILIATES[key];
  if (!a) return '';
  return `<a href="${esc(a.url)}" target="_blank" rel="${relFor(a)}" data-aff-id="${esc(key)}" data-aff-pos="text">${esc(a.label)}</a>${pixelFor(a)}`;
}

// {{banner:ID}} … ASP のバナー広告。1つのHTMLブロックで返す。
export function renderAffiliateBanner(id) {
  const key = id.trim();
  const a = AFFILIATES[key];
  if (!a || !a.banner) return '';
  const b = a.banner;
  return [
    `<aside class="aff-banner" aria-label="${esc(a.name)}の広告">`,
    `<span class="aff-cta-pr">PR</span>`,
    `<a href="${esc(a.url)}" target="_blank" rel="${relFor(a)}" data-aff-id="${esc(key)}" data-aff-pos="banner">`,
    `<img src="${esc(b.src)}" width="${b.width}" height="${b.height}" alt="${esc(b.alt || a.name)}" loading="lazy" style="border:0">`,
    `</a>`,
    pixelFor(a),
    `</aside>`,
  ].join('');
}

// CTAカード。Markdown の HTML ブロックとして扱われるよう、空行を含まない1つのブロックで返す。
export function renderAffiliateCta(id) {
  const key = id.trim();
  const a = AFFILIATES[key];
  if (!a || !a.button) return '';
  const points = (a.points || [])
    .map(([k, v]) => `<li><span class="aff-cta-key">${esc(k)}</span><span class="aff-cta-val">${esc(v)}</span></li>`)
    .join('');
  return [
    `<aside class="aff-cta" aria-label="${esc(a.name)}の案内">`,
    `<div class="aff-cta-head"><span class="aff-cta-pr">PR</span>${a.badge ? `<span class="aff-cta-badge">${esc(a.badge)}</span>` : ''}</div>`,
    `<p class="aff-cta-name">${esc(a.name)}</p>`,
    a.desc ? `<p class="aff-cta-desc">${esc(a.desc)}</p>` : '',
    points ? `<ul class="aff-cta-points">${points}</ul>` : '',
    `<a class="aff-cta-btn" href="${esc(a.url)}" target="_blank" rel="${relFor(a)}" data-aff-id="${esc(key)}" data-aff-pos="cta">${esc(a.button)}</a>${pixelFor(a)}`,
    `<p class="aff-cta-note">${esc(a.note || '※還元率・特典には条件があります。最新の内容は公式サイトでご確認ください。')}</p>`,
    `</aside>`,
  ].filter(Boolean).join('');
}

export function hasCta(id) {
  const a = AFFILIATES[String(id).trim()];
  return Boolean(a && a.button);
}
