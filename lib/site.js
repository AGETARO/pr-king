// lib/site.js - サイト共通設定（運営者情報・問い合わせ先）
//
// ★ここを実際の情報に書き換えてください。
// 空欄のままにすると、/about/ と /privacy/ には「準備中」と表示されます。
// 個人運営でも、特定商取引法に基づく表記が不要な範囲であれば、
// 屋号（サイト名）のみ・問い合わせフォームURLのみでも構いません。

export const SITE_NAME = process.env.SITE_NAME || 'PR-KING';
export const SITE_URL = process.env.SITE_URL || 'https://lifetime.pr-king.workers.dev';

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
