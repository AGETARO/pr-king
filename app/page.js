// site/app/page.js - トップページ
import Link from 'next/link';
import { getAllPosts, getCategories } from '../lib/posts';

export const metadata = {
  title: 'おすすめ情報メディア',
  description: '厳選した商品・サービスのおすすめ情報を分かりやすく解説します。',
};

export default function HomePage() {
  const posts = getAllPosts().slice(0, 12);
  const categories = getCategories().slice(0, 8);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* ヒーロー */}
      <section style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        marginBottom: '3rem',
        color: 'white',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
          最新のおすすめ情報を<br />分かりやすく解説
        </h1>
        <p style={{ opacity: 0.9, fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
          専門家が実際に検証した情報をもとに、あなたにぴったりの商品・サービスをご紹介します。
        </p>
      </section>

      {/* カテゴリ */}
      {categories.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            カテゴリ
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <span key={cat.name} className="badge" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                {cat.name} ({cat.count})
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 記事グリッド */}
      <section>
        <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
          最新記事
        </h2>
        {posts.length > 0 ? (
          <div className="post-grid">
            {posts.map(post => (
              <article key={post.slug} className="post-card">
                {post.category && <div className="post-card-category">{post.category}</div>}
                <h2 className="post-card-title">
                  <Link href={`/posts/${post.slug}/`}>{post.title}</Link>
                </h2>
                {post.description && (
                  <p className="post-card-excerpt">{post.description}</p>
                )}
                <div className="post-card-meta">
                  <span>📅 {post.updated}</span>
                  {post.articleType && <span className="badge">{post.articleType}</span>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</p>
            <p>記事を準備中です。パイプラインを実行して記事を生成してください。</p>
          </div>
        )}
      </section>
    </div>
  );
}
