// app/category/[hub]/page.js - カテゴリハブページ（静的に書き出す・検索結果に出せるURL）
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostsByHub, getHubs, getPickupPosts } from '../../../lib/posts';
import { HUBS, getHubBySlug, hubPath } from '../../../lib/hubs';
import { SITE_NAME, SITE_URL } from '../../../lib/site';
import Sidebar from '../../../components/Sidebar';
import { PostsView } from '../../../components/PostsBrowser';

export const dynamicParams = false;

export function generateStaticParams() {
  // 記事が1本もないハブはページを作らない（中身のないページを出さない）
  return HUBS.filter((h) => getPostsByHub(h.slug).length > 0).map((h) => ({ hub: h.slug }));
}

export function generateMetadata({ params }) {
  const hub = getHubBySlug(params.hub);
  if (!hub) return { title: 'カテゴリが見つかりません' };
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: hubPath(hub) },
    openGraph: { title: hub.title, description: hub.description, type: 'website' },
  };
}

export default function HubPage({ params }) {
  const hub = getHubBySlug(params.hub);
  if (!hub) notFound();

  const posts = getPostsByHub(hub.slug).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    keyword: p.keyword,
    cluster: p.cluster,
    eyecatch: p.eyecatch,
    updated: p.updated,
    formattedDate: p.formattedDate,
  }));
  const base = SITE_URL.replace(/\/$/, '');
  const url = `${base}${hubPath(hub)}`;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: hub.title,
      description: hub.description,
      url,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${base}/` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: posts.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${base}/posts/${p.slug}/`,
          name: p.title,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'TOP', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: hub.name, item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="gizmodo-main-container">
        <nav className="gizmodo-breadcrumbs" aria-label="パンくずリスト">
          <Link href="/">TOP</Link>
          <span className="sep">/</span>
          <span className="current">{hub.name}</span>
        </nav>

        <div className="gizmodo-layout-grid">
          <div className="gizmodo-feed">
            <div className="feature-header-bar">
              <h1 className="feature-big-title">{hub.title}</h1>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.8, marginTop: '0.75rem' }}>{hub.intro}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {posts.length}件の記事
              </p>
            </div>
            <PostsView posts={posts} hideHeader />
          </div>

          <Sidebar clusters={getHubs()} pickupPosts={getPickupPosts(5)} />
        </div>
      </div>
    </>
  );
}
