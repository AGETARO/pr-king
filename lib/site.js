// lib/site.js - サイト共通設定（運営者情報・問い合わせ先）
//
// ★ここを実際の情報に書き換えてください。
// 空欄のままにすると、/about/ と /privacy/ には「準備中」と表示されます。
// 個人運営でも、特定商取引法に基づく表記が不要な範囲であれば、
// 屋号（サイト名）のみ・問い合わせフォームURLのみでも構いません。

export const SITE_NAME = process.env.SITE_NAME || 'PR-KING';
export const SITE_URL = process.env.SITE_URL || 'https://lifetime.pr-king.workers.dev';

// 検索結果・SNSで使うサイトの説明。実際の記事テーマ（カード・NISA・節約・セキュリティ）に合わせる。
export const SITE_TAGLINE = 'クレジットカード・新NISA・節約のお金メディア';
export const SITE_DESCRIPTION =
  'クレジットカードの選び方と比較、新NISAとクレカ積立、物価高に負けない節約術、カードの不正利用対策まで。毎日のお金の判断に役立つ情報をまとめています。';

// og:image が個別に決まらないページ（トップ・一覧・カテゴリ）で使う画像
export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80';

// 各ページの openGraph に共通項目を足す。
// Next.js はページ側で openGraph を書くとレイアウトの openGraph を丸ごと置き換えるため、ここで毎回補う。
// pathname を渡したページだけ og:url を出す（レイアウトで '/' を出すと、全ページがトップを指してしまう）。
export function withOg(og = {}, pathname) {
  return {
    siteName: SITE_NAME,
    locale: 'ja_JP',
    type: 'website',
    ...(pathname ? { url: pathname } : {}),
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 800 }],
    ...og,
  };
}

// 運営者名（個人名または屋号）
export const OPERATOR_NAME = 'Lifetime運営事務局';

// 問い合わせ先の名称
export const CONTACT_NAME = 'Lifetime運営事務局';

// 連絡手段（メールアドレス または 問い合わせフォームのURL のどちらか／両方）。
// 設定すると、名称の下に表示されます。未設定の場合は名称のみ表示されます。
export const CONTACT_EMAIL = '';
export const CONTACT_FORM_URL = '';

// プライバシーポリシーの制定日・最終改定日（YYYY年M月D日）
export const POLICY_ENACTED = '2026年11月21日';
export const POLICY_UPDATED = '2026年11月21日';
