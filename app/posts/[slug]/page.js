// site/app/posts/[slug]/page.js - ギズモード風 記事詳細ページ
import { getAllPostSlugs, getPostWithHtml, getRelatedPosts, getHubs, getPickupPosts } from '../../../lib/posts';
import { getHubBySlug, hubPath } from '../../../lib/hubs';
import { SITE_NAME, SITE_URL } from '../../../lib/site';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShareButtons from '../../../components/ShareButtons';
import PromoBanner from '../../../components/PromoBanner';
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
        publishedTime: `${post.published}T00:00:00+09:00`,
        modifiedTime: `${post.updated}T00:00:00+09:00`,
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
  const clusters = getHubs();
  const pickupPosts = getPickupPosts(5);
  const hub = getHubBySlug(post.hubSlug);

  // 構造化データ (Article + BreadcrumbList)
  const base = SITE_URL.replace(/\/$/, '');
  const url = `${base}/posts/${post.slug}/`;
  const org = { '@type': 'Organization', name: SITE_NAME, url: `${base}/about/` };
  const crumbs = [
    { name: 'TOP', item: `${base}/` },
    ...(hub ? [{ name: hub.name, item: `${base}${hubPath(hub)}` }] : []),
    { name: post.title, item: url },
  ];
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      image: post.eyecatch || post.image,
      datePublished: `${post.published}T00:00:00+09:00`,
      dateModified: `${post.updated}T00:00:00+09:00`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: org,
      publisher: org,
      ...(hub ? { articleSection: hub.name } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })),
    },
  ];

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
          {hub && (
            <>
              <Link href={hubPath(hub)}>{hub.name}</Link>
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
              <time className="article-entry-date" dateTime={post.updated}>{post.formattedDate} 更新</time>
              <div className="article-meta-tags">
                <span className="article-cluster-pill">{post.cluster || post.category}</span>
              </div>
            </div>

            {/* 記事メインタイトル */}
            <h1 className="gizmodo-post-title">{post.title}</h1>

            {/* 広告表記（記事の冒頭に表示） */}
            {/* 本文・サイドバーに広告があるため全記事に表示（ステマ規制対応。広告表記はここ1か所に集約） */}
            {(
              <div className="gizmodo-post-sub-bar">
                <span className="post-discrete-pr-note">この記事には広告が含まれます</span>
              </div>
            )}

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

            {/* 記事末尾の広告バナー（728x90） */}
            <PromoBanner id="wideA" wide />

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
                        <time className="related-date" dateTime={rp.updated}>{rp.formattedDate}</time>
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
            pickupPosts={pickupPosts}
            currentSlug={post.slug}
          />
        </div>
      </div>
    </>
  );
}
