// site/app/posts/[slug]/page.js - ギズモード風 記事詳細ページ
import { getAllPostSlugs, getPostWithHtml, getRelatedPosts, getClusters, getPopularPosts } from '../../../lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShareButtons from '../../../components/ShareButtons';
import ArticleEyecatch from '../../../components/ArticleEyecatch';
import Sidebar from '../../../components/Sidebar';

export const dynamicParams = false;

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
        images: [{ url: post.eyecatch || post.image }],
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
  const clusters = getClusters();
  const popularPosts = getPopularPosts(5);

  // 構造化データ (Article)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.eyecatch || post.image,
    dateModified: post.updated,
    author: { '@type': 'Organization', name: process.env.SITE_NAME || 'PR-KING' },
    publisher: {
      '@type': 'Organization',
      name: process.env.SITE_NAME || 'PR-KING',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="gizmodo-main-container">
        {/* パンくずリスト */}
        <nav className="gizmodo-breadcrumbs" aria-label="パンくずリスト">
          <Link href="/">TOP</Link>
          <span className="sep">/</span>
          {post.cluster && (
            <>
              <Link href={`/?cluster=${encodeURIComponent(post.cluster)}`}>{post.cluster}</Link>
              <span className="sep">/</span>
            </>
          )}
          <span className="current">{post.title}</span>
        </nav>

        <div className="gizmodo-layout-grid">
          {/* メイン記事カラム */}
          <article className="gizmodo-article-container">
            {/* 記事メタヘッダー */}
            <div className="article-entry-meta">
              <time className="article-entry-date">{post.formattedDate || post.updated}</time>
              <div className="article-meta-tags">
                <span className="article-cluster-pill">{post.cluster || post.category}</span>
                <span className="article-pr-notice">PR</span>
              </div>
            </div>

            {/* 記事メインタイトル */}
            <h1 className="gizmodo-post-title">{post.title}</h1>

            {/* 閲覧数 & ひっそりと配置された9ptのPR注記 */}
            <div className="gizmodo-post-sub-bar">
              <span className="post-view-count">👁️ {post.views} views</span>
              <span className="post-discrete-pr-note">※本記事にはアフィリエイト・プロモーション広告が含まれます</span>
            </div>

            {/* 上部 SNSシェアボタン */}
            <ShareButtons title={post.title} slug={post.slug} />

            {/* 大迫力アイキャッチ画像 (Unsplash高解像度写真) */}
            <ArticleEyecatch
              title={post.title}
              category={post.category}
              cluster={post.cluster}
              imageUrl={post.eyecatch || post.image}
            />

            {/* 記事本文 (Markdown) */}
            <div
              className="gizmodo-post-body"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* 記事末尾のシェアエリア */}
            <div className="gizmodo-bottom-share">
              <h4 className="bottom-share-label">SHARE THIS STORY</h4>
              <ShareButtons title={post.title} slug={post.slug} />
            </div>

            {/* 関連記事セクション (Gizmodoカードグリッド) */}
            {relatedPosts.length > 0 && (
              <section className="gizmodo-related-stories">
                <div className="related-header">
                  <h3 className="related-title">RECOMMENDED</h3>
                </div>
                <div className="related-cards-grid">
                  {relatedPosts.map((rp) => (
                    <article key={rp.slug} className="related-card-item">
                      <div className="related-thumb-wrapper">
                        <Link href={`/posts/${rp.slug}/`}>
                          <img
                            src={rp.eyecatch || rp.image}
                            alt={rp.title}
                            className="related-thumb"
                            loading="lazy"
                          />
                        </Link>
                      </div>
                      <div className="related-body">
                        <span className="related-cat-label">{rp.cluster || rp.category}</span>
                        <h4 className="related-card-heading">
                          <Link href={`/posts/${rp.slug}/`}>
                            {rp.title}
                          </Link>
                        </h4>
                        <time className="related-date">{rp.formattedDate}</time>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* 右サイドバー */}
          <Sidebar
            clusters={clusters}
            popularPosts={popularPosts}
            currentSlug={post.slug}
          />
        </div>
      </div>
    </>
  );
}
