// site/app/layout.js - ギズモード・ジャパン風モダンテックマガジン
import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import HeaderClock from '../components/HeaderClock';
import AffiliateClickTracker from '../components/AffiliateClickTracker';

import { SITE_NAME, SITE_URL, SITE_TAGLINE, SITE_DESCRIPTION, withOg } from '../lib/site';

const GA_ID = process.env.GA_MEASUREMENT_ID || 'G-FTPK04ND5P';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: withOg(),
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    // Google Discover・画像検索で大きなサムネイルを表示させる
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  // canonical は各ページで指定する（ルートで固定すると全ページがトップを指してしまうため）
  verification: {
    google: 'google6d7c871c5aeaffe7',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        {/* RSS（Feedly などの購読・新着の発見用）。各ページの alternates で上書きされないよう、ここに直接書く */}
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} 新着記事`} href={`${SITE_URL.replace(/\/$/, '')}/feed.xml`} />
      </head>
      <body>
        {/* Google Analytics (GA4) */}
        {GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
            <AffiliateClickTracker />
          </>
        )}

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
              <Link href="/posts/" className="header-pill-btn">
                ALL POSTS
              </Link>
              <Link href="/about/" className="header-pill-btn">
                ABOUT
              </Link>
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
                <Link href="/posts/">ALL POSTS</Link>
                <Link href="/privacy/">PRIVACY</Link>
                <Link href="/about/">ABOUT</Link>
                <Link href="/contact/">CONTACT</Link>
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
