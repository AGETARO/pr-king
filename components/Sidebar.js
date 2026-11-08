'use client';
// site/components/Sidebar.js - ギズモード・ジャパン風 右サイドバー
import React, { useState } from 'react';
import Link from 'next/link';

// ランキング用の高解像度アイテム画像
const RANKING_THUMBNAILS = [
  'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1559526324-593bc073d998?auto=format&fit=crop&w=160&h=160&q=80',
];

export default function Sidebar({ clusters = [], popularPosts = [], currentSlug = '' }) {
  const [rankingTab, setRankingTab] = useState('Daily');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <aside className="gizmodo-sidebar">
      {/* 1. スポンサーバナー 1 (Amazon風 / テックセール枠) */}
      <div className="gizmodo-ad-box">
        <span className="ad-corner-tag">AD</span>
        <a
          href="https://www.smbc-card.com/"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="gizmodo-ad-link"
        >
          <div className="ad-text-col">
            <span className="ad-title-label">【PR-KING 特集】</span>
            <span className="ad-product-name">三井住友カード (NL) 学生限定キャッシュバック</span>
            <span className="ad-badge-pill">最大7%還元</span>
            <span className="ad-prime-mark">✓ 年会費 永年無料</span>
          </div>
          <div className="ad-image-col">
            <img
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&h=180&q=80"
              alt="三井住友カード(NL)"
              className="ad-thumb-img"
            />
          </div>
        </a>
      </div>

      {/* 2. カプセル型 検索バー (Gizmodo Pill Shape) */}
      <form onSubmit={handleSearchSubmit} className="gizmodo-search-bar">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="キーワードを入力"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="gizmodo-search-input"
        />
      </form>

      {/* 3. トレンド・人気タグ (Gizmodo特有の鮮やかなライムグリーン！) */}
      <div className="gizmodo-lime-tags">
        <Link href="/" className="lime-tag-pill"># クレジットカード</Link>
        <Link href="/" className="lime-tag-pill"># 三井住友カードNL</Link>
        <Link href="/" className="lime-tag-pill"># 楽天カード</Link>
        <Link href="/" className="lime-tag-pill"># 学生ライフ</Link>
        <Link href="/" className="lime-tag-pill"># キャッシュレス</Link>
        <Link href="/" className="lime-tag-pill"># ポイ活</Link>
      </div>

      {/* 4. Ranking セクション (太字見出し + 期間タブ + 1〜5位リスト) */}
      <div className="gizmodo-ranking-section">
        <div className="ranking-header">
          <h3 className="ranking-heading">Ranking</h3>
          <span className="ranking-sub-label">PR</span>
        </div>

        {/* 期間切り替えタブ */}
        <div className="ranking-tabs">
          {['Daily', 'Weekly', 'Monthly', 'Amazon'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`ranking-tab-btn ${rankingTab === tab ? 'active' : ''}`}
              onClick={() => setRankingTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ランキングリスト */}
        <ol className="gizmodo-ranking-list">
          {popularPosts.map((post, idx) => (
            <li key={post.slug} className={`ranking-list-item ${post.slug === currentSlug ? 'current' : ''}`}>
              <span className="ranking-index">{idx + 1}.</span>
              <Link href={`/posts/${post.slug}/`} className="ranking-card-link">
                <img
                  src={post.eyecatch || RANKING_THUMBNAILS[idx % RANKING_THUMBNAILS.length]}
                  alt={post.title}
                  className="ranking-item-thumb"
                  loading="lazy"
                />
                <div className="ranking-item-details">
                  <span className="ranking-item-title">{post.title}</span>
                  <div className="ranking-item-meta">
                    <span className="ranking-price">¥ 0 永年無料</span>
                    <span className="ranking-rating">★ 4.8</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        {/* 下部カプセル型ピルボタン */}
        <Link href="/" className="gizmodo-pill-action-btn">
          Amazonセール開催中！
        </Link>
      </div>

      {/* 5. ビジュアルバナー (ハリネズミ風 / 3Dアート・クリエイティブ枠) */}
      <div className="gizmodo-creative-banner">
        <div className="creative-img-wrapper">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=300&q=80"
            alt="AIアート・デザイン"
            className="creative-banner-img"
          />
        </div>
        <div className="creative-banner-footer">
          <p className="creative-desc">初心者でもできた！ ゼロから始めるAI活用術</p>
          <span className="creative-pr-tag">PR PR-KING LAB</span>
        </div>
      </div>

      {/* 6. スポンサーバナー 3 (ServiceNow風 / 深いネイビーのテック縦長バナー) */}
      <div className="gizmodo-tech-banner">
        <div className="tech-banner-logo">PR-KING NEXT</div>
        <h4 className="tech-banner-catch">
          キャッシュレスの一次対応を、<br />AIに任せられるか。
        </h4>
        <p className="tech-banner-sub">
          9万人を対象に検証する金融DX最前線
        </p>
        <span className="tech-banner-btn">導入事例を読む →</span>
      </div>

      {/* 7. 特集カテゴリー (下部にクリーンに配置) */}
      <div className="gizmodo-categories-box">
        <h4 className="categories-box-title">CATEGORY</h4>
        <ul className="gizmodo-cat-list">
          {clusters.map((c) => (
            <li key={c.name} className="cat-row">
              <Link href={`/?cluster=${encodeURIComponent(c.name)}`} className="cat-row-link">
                <span>{c.name}</span>
                <span className="cat-badge">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
