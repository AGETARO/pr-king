// site/app/layout.js
import './globals.css';
import Link from 'next/link';

const SITE_NAME = process.env.SITE_NAME || 'PR-KING';
const SITE_URL = process.env.SITE_URL || 'https://your-site.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: '最新のおすすめ情報を分かりやすく解説するメディアサイト',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: SITE_NAME,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="site-logo">👑 {SITE_NAME}</Link>
            <nav className="site-nav">
              <Link href="/">ホーム</Link>
              <Link href="/posts">記事一覧</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="footer-inner">
            <div>
              <Link href="/" className="site-logo" style={{ fontSize: '1rem' }}>👑 {SITE_NAME}</Link>
            </div>
            <div className="footer-note">
              <p>※本サイトはアフィリエイト広告を掲載しています。</p>
              <p>© {new Date().getFullYear()} {SITE_NAME}</p>
            </div>
            <nav style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
              <Link href="/privacy" style={{ color: 'var(--color-text-muted)' }}>プライバシーポリシー</Link>
              <Link href="/about" style={{ color: 'var(--color-text-muted)' }}>このサイトについて</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
