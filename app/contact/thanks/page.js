// app/contact/thanks/page.js - お問い合わせ送信完了（検索結果には出さない）
import Link from 'next/link';

export const metadata = {
  title: 'お問い合わせを受け付けました',
  robots: { index: false, follow: true },
  alternates: { canonical: '/contact/thanks/' },
};

export default function ContactThanksPage() {
  return (
    <div className="gizmodo-main-container">
      <article className="gizmodo-article-container" style={{ maxWidth: 820, margin: '0 auto' }}>
        <h1 className="gizmodo-post-title">お問い合わせを受け付けました</h1>
        <div className="gizmodo-post-body">
          <p>お問い合わせありがとうございます。内容を確認のうえ、ご入力いただいたメールアドレス宛てにご連絡します。</p>
          <p>返信までに数日かかる場合があります。しばらくお待ちください。</p>
          <p><Link href="/">トップページへ戻る</Link></p>
        </div>
      </article>
    </div>
  );
}
