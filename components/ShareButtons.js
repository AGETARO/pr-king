'use client';
// site/components/ShareButtons.js - SNS拡散ボタン群
import React, { useState } from 'react';

export default function ShareButtons({ title, slug }) {
  const [copied, setCopied] = useState(false);

  // クライアント側で現在のURLを取得（SSR時はフォールバック）
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://pr-king-site.america0114.workers.dev/posts/${slug}/`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック
      const input = document.createElement('input');
      input.value = getShareUrl();
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = encodeURIComponent(getShareUrl());
  const shareTitle = encodeURIComponent(title || 'おすすめ記事');

  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const xUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
  const hatebuUrl = `https://b.hatena.ne.jp/entry/${getShareUrl()}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}`;

  return (
    <div className="sns-share-wrapper">
      <div className="sns-share-buttons">
        {/* Facebook */}
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sns-btn sns-btn-fb"
          title="Facebookでシェア"
          aria-label="Facebookでシェア"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>

        {/* X (旧Twitter) */}
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sns-btn sns-btn-x"
          title="Xでポスト"
          aria-label="Xでポスト"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        {/* はてなブックマーク */}
        <a
          href={hatebuUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sns-btn sns-btn-hatebu"
          title="はてなブックマークに追加"
          aria-label="はてなブックマークに追加"
        >
          <span style={{ fontWeight: 900, fontSize: '1rem', fontFamily: 'sans-serif' }}>B!</span>
        </a>

        {/* LINE */}
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sns-btn sns-btn-line"
          title="LINEで送る"
          aria-label="LINEで送る"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.038 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.026c-.053.303-.242 1.185 1.039.646 1.281-.539 6.918-4.078 9.444-6.979 1.733-1.907 2.554-3.847 2.554-5.978z"/>
          </svg>
        </a>

        {/* URLコピー */}
        <button
          type="button"
          onClick={handleCopy}
          className={`sns-btn sns-btn-copy ${copied ? 'copied' : ''}`}
          title="URLをコピー"
          aria-label="URLをコピー"
        >
          {copied ? (
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>✓ コピー済</span>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
