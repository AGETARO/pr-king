// site/app/posts/page.js - 記事一覧ページ (ギズモード風)
import Link from 'next/link';
import { getAllPosts, getClusters, getPopularPosts } from '../../lib/posts';
import Sidebar from '../../components/Sidebar';

export const metadata = {
  title: 'ALL STORIES 記事一覧 | PR-KING',
  description: 'PR-KINGに掲載されているすべての記事一覧です。',
};

export default function PostsPage() {
  const posts = getAllPosts();
  const clusters = getClusters();
  const popularPosts = getPopularPosts(5);

  return (
    <div className="gizmodo-main-container">
      {/* パンくずリスト */}
      <nav className="gizmodo-breadcrumbs" aria-label="パンくずリスト">
        <Link href="/">TOP</Link>
        <span className="sep">/</span>
        <span className="current">ALL STORIES</span>
      </nav>

      <div className="gizmodo-layout-grid">
        <div className="gizmodo-feed">
          <div className="feature-header-bar">
            <h1 className="feature-big-title">All Stories</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              全{posts.length}件の記事
            </p>
          </div>

          <div className="latest-cards-grid">
            {posts.map((post) => (
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
                    <time className="latest-date">{post.formattedDate || post.updated}</time>
                  </div>
                  <h2 className="latest-card-title">
                    <Link href={`/posts/${post.slug}/`}>
                      {post.title}
                    </Link>
                  </h2>
                  {post.description && (
                    <p className="latest-card-desc">{post.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 右サイドバー */}
        <Sidebar
          clusters={clusters}
          popularPosts={popularPosts}
        />
      </div>
    </div>
  );
}

