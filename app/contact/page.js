// app/contact/page.js - お問い合わせフォーム（FormSubmit 経由でメール送信）
import Link from 'next/link';
import { SITE_NAME, SITE_URL, CONTACT_NAME, CONTACT_FORM_ENDPOINT, withOg } from '../../lib/site';

export const metadata = {
  title: 'お問い合わせ',
  description: `${SITE_NAME}へのお問い合わせフォームです。記事内容の誤りのご指摘、掲載・広告に関するご相談などはこちらからお送りください。`,
  alternates: { canonical: '/contact/' },
  openGraph: withOg({ title: `お問い合わせ | ${SITE_NAME}` }, '/contact/'),
};

const TOPICS = ['記事内容について（誤りのご指摘など）', '掲載・広告・提携のご相談', 'サイトの不具合', 'その他'];

export default function ContactPage() {
  const base = SITE_URL.replace(/\/$/, '');

  return (
    <div className="gizmodo-main-container">
      <nav className="gizmodo-breadcrumbs" aria-label="パンくずリスト">
        <Link href="/">TOP</Link>
        <span className="sep">/</span>
        <span className="current">CONTACT</span>
      </nav>

      <article className="gizmodo-article-container" style={{ maxWidth: 820, margin: '0 auto' }}>
        <h1 className="gizmodo-post-title">お問い合わせ</h1>

        <div className="gizmodo-post-body">
          <p>
            {SITE_NAME}（運営：{CONTACT_NAME}）へのお問い合わせは、下のフォームからお送りください。
            内容を確認のうえ、ご入力いただいたメールアドレス宛てにご連絡します。返信までに数日かかる場合があります。
          </p>
          <p className="contact-note">
            ※ クレジットカードの審査状況や、各社のサービス内容についてのご質問には、当サイトではお答えできません。各社の公式窓口へお問い合わせください。
          </p>
        </div>

        <form className="contact-form" action={CONTACT_FORM_ENDPOINT} method="POST" acceptCharset="UTF-8">
          {/* FormSubmit の設定（送信後の移動先・件名・メール形式・迷惑メール対策） */}
          <input type="hidden" name="_next" value={`${base}/contact/thanks/`} />
          <input type="hidden" name="_subject" value={`【${SITE_NAME}】お問い合わせが届きました`} />
          <input type="hidden" name="_template" value="table" />
          <input type="text" name="_honey" className="contact-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <label className="contact-field">
            <span className="contact-label">お名前 <em>必須</em></span>
            <input type="text" name="お名前" required maxLength={100} autoComplete="name" />
          </label>

          <label className="contact-field">
            <span className="contact-label">メールアドレス <em>必須</em></span>
            {/* name="email" にすると、届いたメールの「返信」でそのまま相手に返信できる */}
            <input type="email" name="email" required maxLength={200} autoComplete="email" inputMode="email" />
          </label>

          <label className="contact-field">
            <span className="contact-label">お問い合わせの種類</span>
            <select name="種類" defaultValue={TOPICS[0]}>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="contact-field">
            <span className="contact-label">お問い合わせ内容 <em>必須</em></span>
            <textarea name="お問い合わせ内容" required rows={8} maxLength={5000} />
          </label>

          <label className="contact-agree">
            <input type="checkbox" name="プライバシーポリシーへの同意" value="同意する" required />
            <span>
              <Link href="/privacy/">プライバシーポリシー</Link>に同意して送信します <em>必須</em>
            </span>
          </label>

          <button type="submit" className="contact-submit">送信する</button>
        </form>
      </article>
    </div>
  );
}
