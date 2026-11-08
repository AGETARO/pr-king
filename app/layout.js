// site/app/layout.js - ギズモード・ジャパン風モダンテックマガジン
import './globals.css';
import Link from 'next/link';
import HeaderClock from '../components/HeaderClock';

const SITE_NAME = process.env.SITE_NAME || 'PR-KING';
const SITE_URL = process.env.SITE_URL || 'https://your-site.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | テック＆ライフスタイル・デジタル決済メディア`, template: `%s | ${SITE_NAME}` },
  description: '最新のトレンド、クレジットカード、サブスク、デジタルガジェットをシャープに切り取るテックマガジン',
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
        {/* Gizmodo Style Top Header */}
        <header className="gizmodo-header">
          <div className="header-container">
            {/* 左側: JST タイムスタンプ */}
            <div className="header-left">
              <HeaderClock />
            </div>

            {/* 中央: 黒カプセル (Pill shape) ブランドロゴ */}
            <div className="header-center">
              <Link href="/" className="gizmodo-logo-pill">
                {SITE_NAME}
              </Link>
            </div>

            {/* 右側: カプセル型ピルボタン群 (MENU, ···, SNS) */}
            <div className="header-right">
              <button type="button" className="header-pill-btn" aria-label="メニュー">
                MENU
              </button>
              <button type="button" className="header-pill-btn dot-btn" aria-label="その他のリンク">
                ···
              </button>
              <button type="button" className="header-pill-btn sns-btn" aria-label="ソーシャルメディア">
                SNS 🌐
              </button>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main>{children}</main>

        {/* Gizmodo Style Clean Footer */}
        <footer className="gizmodo-footer">
          <div className="footer-container">
            <div className="footer-top">
              <Link href="/" className="gizmodo-logo-pill footer-logo">
                {SITE_NAME}
              </Link>
              <nav className="footer-nav">
                <Link href="/">HOME</Link>
                <Link href="/posts">ALL POSTS</Link>
                <Link href="/privacy">PRIVACY</Link>
                <Link href="/about">ABOUT</Link>
              </nav>
            </div>
            <div className="footer-bottom">
              <p className="footer-affiliate-note">
                ※本サイトはアフィリエイト広告およびプロモーションコンテンツを掲載しています。
              </p>
              <p className="footer-copyright">
                © {new Date().getFullYear()} {SITE_NAME}. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
