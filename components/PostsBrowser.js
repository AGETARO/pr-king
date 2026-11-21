'use client';
// components/PostsBrowser.js - 記事一覧（?q=キーワード / ?cluster=カテゴリ で絞り込み）
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// 絞り込み条件を受け取って一覧を表示する（サーバー側の初期表示と、クライアント側の絞り込みで共用）
export function PostsView({ posts, q = '', cluster = '' }) {
  const needle = q.toLowerCase();
  const filtered = posts.filter((p) => {
    if (cluster && p.cluster !== cluster) return false;
    if (needle) {
      const haystack = `${p.title} ${p.description} ${p.keyword} ${p.cluster}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

  const isFiltered = Boolean(q || cluster);

  return (
    <>
      <div className="feature-header-bar">
        <h1 className="feature-big-title">All Stories</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {isFiltered
            ? `${cluster ? `カテゴリ「${cluster}」` : ''}${cluster && q ? ' × ' : ''}${q ? `キーワード「${q}」` : ''} ：${filtered.length}件 / 全${posts.length}件`
            : `全${posts.length}件の記事`}
          {isFiltered && (
            <>
              {' '}
              <Link href="/posts/" style={{ textDecoration: 'underline' }}>絞り込みを解除</Link>
            </>
          )}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p style={{ padding: '2rem 0' }}>該当する記事が見つかりませんでした。別のキーワードをお試しください。</p>
      ) : (
        <div className="latest-cards-grid">
          {filtered.map((post) => (
            <article key={post.slug} className="latest-story-card">
              <div className="latest-thumb-box">
                <Link href={`/posts/${post.slug}/`}>
                  <img src={post.eyecatch} alt="" className="latest-card-img" loading="lazy" />
                </Link>
              </div>
              <div className="latest-card-body">
                <div className="latest-card-meta">
                  <span className="latest-category">{post.cluster}</span>
                  <time className="latest-date" dateTime={post.updated}>{post.formattedDate}</time>
                </div>
                <h2 className="latest-card-title">
                  <Link href={`/posts/${post.slug}/`}>{post.title}</Link>
                </h2>
                {post.description && <p className="latest-card-desc">{post.description}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

// URLの ?q= / ?cluster= を読んで絞り込む（静的書き出しでも動くようクライアント側で処理）
export default function PostsBrowser({ posts }) {
  const params = useSearchParams();
  const q = (params.get('q') || '').trim();
  const cluster = (params.get('cluster') || '').trim();
  return <PostsView posts={posts} q={q} cluster={cluster} />;
}
