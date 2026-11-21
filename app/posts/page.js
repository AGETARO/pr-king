// app/posts/page.js - 記事一覧ページ
import { Suspense } from 'react';
import Link from 'next/link';
import { getAllPosts, getClusters, getPickupPosts } from '../../lib/posts';
import Sidebar from '../../components/Sidebar';
import PostsBrowser, { PostsView } from '../../components/PostsBrowser';

export const metadata = {
  title: 'ALL STORIES 記事一覧',
  description: 'PR-KINGに掲載されているすべての記事一覧です。',
  alternates: { canonical: '/posts/' },
};

export default function PostsPage() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    keyword: p.keyword,
    cluster: p.cluster,
    eyecatch: p.eyecatch,
    updated: p.updated,
    formattedDate: p.formattedDate,
  }));
  const clusters = getClusters();
  const pickupPosts = getPickupPosts(5);

  return (
    <div className="gizmodo-main-container">
      <nav className="gizmodo-breadcrumbs" aria-label="パンくずリスト">
        <Link href="/">TOP</Link>
        <span className="sep">/</span>
        <span className="current">ALL STORIES</span>
      </nav>

      <div className="gizmodo-layout-grid">
        <div className="gizmodo-feed">
          <Suspense fallback={<PostsView posts={posts} />}>
            <PostsBrowser posts={posts} />
          </Suspense>
        </div>

        <Sidebar clusters={clusters} pickupPosts={pickupPosts} />
      </div>
    </div>
  );
}
