// site/app/page.js - ギズモード・ジャパン風トップページ
import Link from 'next/link';
import { getAllPosts, getClusters, getPopularPosts } from '../lib/posts';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'PR-KING | デジタル決済・ガジェット・ライフスタイル最新メディア',
  description: '最新のトレンド、クレジットカード、サブスク、デジタルガジェットをシャープに切り取るテックマガジン',
};

export default function HomePage() {
  const posts = getAllPosts();
  const clusters = getClusters();
  const popularPosts = getPopularPosts(5);

  // 添付画像 (Gizmodo) のレイアウト構成に記事を割り振る
  const leadPost = posts[0] || null;
  const subPost1 = posts[1] || null;
  const subPost2 = posts[2] || null;
  const featurePost1 = posts[3] || null;
  const featurePost2 = posts[4] || null;
  const remainingPosts = posts.slice(5);

  return (
    <div className="gizmodo-main-container">
      <div className="gizmodo-layout-grid">
        {/* ====================================================
            左側：メインコンテンツカラム (Gizmodo Feed)
            ==================================================== */}
        <div className="gizmodo-feed">
          {/* 1. Lead Feature (サメ監視ドローンの位置：特大タイトル＋巨大写真) */}
          {leadPost && (
            <article className="gizmodo-lead-article">
              <div className="lead-meta-header">
                <time className="lead-timestamp">{leadPost.formattedDate || 'Nov 8, 2026 23:00'}</time>
                <span className="lead-category-pill">{leadPost.cluster || leadPost.category}</span>
              </div>
              <h1 className="lead-headline">
                <Link href={`/posts/${leadPost.slug}/`}>
                  {leadPost.title}
                </Link>
              </h1>
              <div className="lead-image-wrapper">
                <Link href={`/posts/${leadPost.slug}/`}>
                  <img
                    src={leadPost.eyecatch || leadPost.image}
                    alt={leadPost.title}
                    className="lead-main-image"
                    loading="eager"
                  />
                </Link>
              </div>
            </article>
          )}

          {/* 2. Sub Grid (SHUREサウンドラボ ＆ フロッピーディスクの位置：2カラム) */}
          {(subPost1 || subPost2) && (
            <div className="gizmodo-sub-grid">
              {subPost1 && (
                <article className="sub-grid-card">
                  <div className="sub-card-meta">
                    <span className="sub-pr-badge">PR [三井住友カード]</span>
                  </div>
                  <h3 className="sub-card-title">
                    <Link href={`/posts/${subPost1.slug}/`}>
                      {subPost1.title}
                    </Link>
                  </h3>
                  <div className="sub-card-thumb-wrap">
                    <Link href={`/posts/${subPost1.slug}/`}>
                      <img
                        src={subPost1.eyecatch || subPost1.image}
                        alt={subPost1.title}
                        className="sub-card-thumb"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                </article>
              )}

              {subPost2 && (
                <article className="sub-grid-card">
                  <div className="sub-card-meta">
                    <time className="sub-timestamp">{subPost2.formattedDate || 'Nov 8, 2026 22:30'}</time>
                  </div>
                  <h3 className="sub-card-title">
                    <Link href={`/posts/${subPost2.slug}/`}>
                      {subPost2.title}
                    </Link>
                  </h3>
                  <div className="sub-card-thumb-wrap">
                    <Link href={`/posts/${subPost2.slug}/`}>
                      <img
                        src={subPost2.eyecatch || subPost2.image}
                        alt={subPost2.title}
                        className="sub-card-thumb"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                </article>
              )}
            </div>
          )}

          {/* 3. 特大セクション「Feature」 (添付画像の超目立つボールド見出し！) */}
          <section className="gizmodo-feature-section">
            <div className="feature-header-bar">
              <h2 className="feature-big-title">Feature</h2>
            </div>

            <div className="feature-article-list">
              {featurePost1 && (
                <article className="feature-row-article">
                  <div className="feature-row-meta">
                    <time className="feature-date">{featurePost1.formattedDate}</time>
                    <span className="feature-views-pill">
                      👁️ {featurePost1.views}
                    </span>
                  </div>
                  <h3 className="feature-row-title">
                    <Link href={`/posts/${featurePost1.slug}/`}>
                      {featurePost1.title}
                    </Link>
                  </h3>
                  <div className="feature-row-thumb-wrap">
                    <Link href={`/posts/${featurePost1.slug}/`}>
                      <img
                        src={featurePost1.eyecatch || featurePost1.image}
                        alt={featurePost1.title}
                        className="feature-row-thumb"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                </article>
              )}

              {featurePost2 && (
                <article className="feature-row-article">
                  <div className="feature-row-meta">
                    <span className="sub-pr-badge">PR [ライフスタイル]</span>
                    <time className="feature-date">{featurePost2.formattedDate}</time>
                  </div>
                  <h3 className="feature-row-title">
                    <Link href={`/posts/${featurePost2.slug}/`}>
                      {featurePost2.title}
                    </Link>
                  </h3>
                  <div className="feature-row-thumb-wrap">
                    <Link href={`/posts/${featurePost2.slug}/`}>
                      <img
                        src={featurePost2.eyecatch || featurePost2.image}
                        alt={featurePost2.title}
                        className="feature-row-thumb"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                </article>
              )}
            </div>
          </section>

          {/* 4. 最新記事フィード (残りの記事一覧も写真付きで展開) */}
          {remainingPosts.length > 0 && (
            <section className="gizmodo-latest-section">
              <div className="latest-header-bar">
                <h2 className="latest-section-title">Latest Stories</h2>
              </div>
              <div className="latest-cards-grid">
                {remainingPosts.map((post) => (
                  <article key={post.slug} className="latest-story-card">
                    <div className="latest-thumb-box">
                      <Link href={`/posts/${post.slug}/`}>
                        <img
                          src={post.eyecatch || post.image}
                          alt={post.title}
                          className="latest-card-img"
                          loading="lazy"
                        />
                      </Link>
                    </div>
                    <div className="latest-card-body">
                      <div className="latest-card-meta">
                        <span className="latest-category">{post.cluster || post.category}</span>
                        <time className="latest-date">{post.formattedDate}</time>
                      </div>
                      <h4 className="latest-card-title">
                        <Link href={`/posts/${post.slug}/`}>
                          {post.title}
                        </Link>
                      </h4>
                      {post.description && (
                        <p className="latest-card-desc">{post.description}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ====================================================
            右側：サイドバー (Gizmodo Sidebar)
            ==================================================== */}
        <Sidebar
          clusters={clusters}
          popularPosts={popularPosts}
        />
      </div>
    </div>
  );
}
