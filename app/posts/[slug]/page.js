// site/app/posts/[slug]/page.js - 記事詳細ページ
import { getAllPostSlugs, getPostWithHtml, getRelatedPosts } from '../../../lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs;
}

export async function generateMetadata({ params }) {
  try {
    const post = await getPostWithHtml(params.slug);
    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.updated,
      },
      alternates: {
        canonical: `/posts/${params.slug}/`,
      },
    };
  } catch {
    return { title: '記事が見つかりません' };
  }
}

export default async function PostPage({ params }) {
  let post;
  try {
    post = await getPostWithHtml(params.slug);
  } catch {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, 4);

  // 構造化データ (Article + FAQ)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    dateModified: post.updated,
    author: { '@type': 'Organization', name: process.env.SITE_NAME || 'PR-KING' },
    publisher: {
      '@type': 'Organization',
      name: process.env.SITE_NAME || 'PR-KING',
    },
  };

  const hasAffiliate = (post.affiliateIds || []).length > 0
    || post.contentHtml?.includes('nofollow');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container">
        <div className="layout-with-sidebar">
          {/* メインコンテンツ */}
          <article>
            <header className="article-header">
              {post.category && <div className="article-category">{post.category}</div>}
              <h1 className="article-title">{post.title}</h1>
              <div className="article-meta">
                <span>📅 更新: {post.updated}</span>
                {post.articleType && <span className="badge">{post.articleType}</span>}
              </div>
            </header>

            {/* 広告表記 */}
            {hasAffiliate && (
              <div className="ad-disclosure">
                ※ 本記事にはプロモーション（広告）が含まれます。掲載商品の選定は編集部が独自に行っています。
              </div>
            )}

            {/* 記事本文 */}
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* 関連記事 */}
            {relatedPosts.length > 0 && (
              <aside className="related-section">
                <h2>関連記事</h2>
                <ul className="related-list">
                  {relatedPosts.map(rp => (
                    <li key={rp.slug}>
                      <Link href={`/posts/${rp.slug}/`}>{rp.title}</Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </article>

          {/* サイドバー */}
          <aside className="sidebar">
            <div className="sidebar-widget">
              <h3>この記事について</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                {post.keyword && <p>🔍 キーワード: {post.keyword}</p>}
                {post.cluster && <p>📁 クラスター: {post.cluster}</p>}
                {post.updated && <p>📅 最終更新: {post.updated}</p>}
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <div className="sidebar-widget">
                <h3>関連記事</h3>
                <ul className="toc-list">
                  {relatedPosts.slice(0, 5).map(rp => (
                    <li key={rp.slug}>
                      <Link href={`/posts/${rp.slug}/`}>{rp.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
