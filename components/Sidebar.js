'use client';
// components/Sidebar.js - 右サイドバー
import React, { useState } from 'react';
import Link from 'next/link';
import PromoBanner from './PromoBanner';

// 注目記事のサムネイル（記事にアイキャッチがない場合のフォールバック）
const FALLBACK_THUMBNAILS = [
  'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=160&h=160&q=80',
];

// タグ → 記事一覧ページでのキーワード検索
const TAGS = ['クレジットカード', '三井住友カード', '楽天カード', '学生', 'キャッシュレス', 'ポイント'];

export default function Sidebar({ clusters = [], pickupPosts = [], currentSlug = '' }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/posts/?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <aside className="gizmodo-sidebar">
      {/* 1. アフィリエイトバナー（もしもアフィリエイト） */}
      <PromoBanner id="rectB" />
      <PromoBanner id="wideC" />

      {/* 1-2. アフィリエイトバナー（もしもアフィリエイト） */}
      <PromoBanner id="seminar" />

      {/* 2. 検索バー（記事一覧ページのキーワード検索へ） */}
      <form onSubmit={handleSearchSubmit} className="gizmodo-search-bar" role="search">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="キーワードを入力"
          aria-label="記事を検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="gizmodo-search-input"
        />
      </form>

      {/* 3. タグ */}
      <div className="gizmodo-lime-tags">
        {TAGS.map((tag) => (
          <Link key={tag} href={`/posts/?q=${encodeURIComponent(tag)}`} className="lime-tag-pill">
            # {tag}
          </Link>
        ))}
      </div>

      {/* 4. 注目の記事（更新日が新しい順。アクセス数や評価には基づかない） */}
      <div className="gizmodo-ranking-section">
        <div className="ranking-header">
          <h3 className="ranking-heading">Pick Up</h3>
          <span className="ranking-sub-label">新着</span>
        </div>

        <ol className="gizmodo-ranking-list">
          {pickupPosts.map((post, idx) => (
            <li key={post.slug} className={`ranking-list-item ${post.slug === currentSlug ? 'current' : ''}`}>
              <span className="ranking-index">{idx + 1}.</span>
              <Link href={`/posts/${post.slug}/`} className="ranking-card-link">
                <img
                  src={post.eyecatch || FALLBACK_THUMBNAILS[idx % FALLBACK_THUMBNAILS.length]}
                  alt=""
                  className="ranking-item-thumb"
                  loading="lazy"
                />
                <div className="ranking-item-details">
                  <span className="ranking-item-title">{post.title}</span>
                  {post.formattedDate && (
                    <div className="ranking-item-meta">
                      <span className="ranking-price">{post.formattedDate} 更新</span>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <Link href="/posts/" className="gizmodo-pill-action-btn">
          すべての記事を見る
        </Link>
      </div>

      {/* 5. 特集カテゴリー */}
      <div className="gizmodo-categories-box">
        <h4 className="categories-box-title">CATEGORY</h4>
        <ul className="gizmodo-cat-list">
          {clusters.map((c) => (
            <li key={c.name} className="cat-row">
              <Link href={`/posts/?cluster=${encodeURIComponent(c.name)}`} className="cat-row-link">
                <span>{c.name}</span>
                <span className="cat-badge">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 6. アフィリエイトバナー（300x250） */}
      <PromoBanner id="rect" />
    </aside>
  );
}
