// lib/affiliates.js - 記事内の {{aff:ID}} プレースホルダーの展開先
//
// frontmatter の affiliate_ids や本文の {{aff:card-001}} は、ここで定義した
// リンクに置き換わります。現在は各社の公式サイトURLです。
// ASP（A8.net 等）の提携リンクを使う場合は、url をそのURLに差し替えてください。
// 外部リンクには rel="sponsored nofollow noopener noreferrer" が自動で付きます。

export const AFFILIATES = {
  'card-001': { label: '三井住友カード(NL) 公式サイト', url: 'https://www.smbc-card.com/' },
  'card-002': { label: 'JCB CARD W 公式サイト', url: 'https://www.jcb.co.jp/' },
  'card-003': { label: '楽天カード 公式サイト', url: 'https://www.rakuten-card.co.jp/' },
  'card-smbc-gold': { label: '三井住友カード ゴールド(NL) 公式サイト', url: 'https://www.smbc-card.com/' },
  'card-smbc-plat': { label: '三井住友カード プラチナプリファード 公式サイト', url: 'https://www.smbc-card.com/' },
  'amazon-prime': { label: 'Amazon.co.jp', url: 'https://www.amazon.co.jp/' },
};

export function renderAffiliateLink(id) {
  const a = AFFILIATES[id.trim()];
  if (!a) return '';
  return `<a href="${a.url}" target="_blank" rel="sponsored nofollow noopener noreferrer">${a.label}</a>`;
}
