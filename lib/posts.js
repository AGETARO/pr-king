// site/lib/posts.js - Markdownファイルの読み込みとパース
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

// スラッグ別 高画質おしゃれフリー画像マップ（Unsplash）
export const POST_IMAGES = {
  'credit-card-student-recommend': 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
  'credit-card-student-guide': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
  'creditcard-student-rakuten-vs-smcc': 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80',
  'credit-card-student-visa-guide': 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=1200&q=80',
  'credit-card-student-recommend-1': 'https://images.unsplash.com/photo-1559526324-593bc073d998?auto=format&fit=crop&w=1200&q=80',
  'welcome': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
};

// 擬似ビュー数・タイムスタンプ生成ヘルパー (Gizmodo風)
function formatGizmodoDate(dateStr) {
  if (!dateStr) return 'Nov 8, 2026 23:00';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()] || 'Nov';
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year} 22:00`;
}

export function getAllPostSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') && !f.includes('.quality') && !f.includes('.backup'))
    .map(f => ({ slug: f.replace('.md', '') }));
}

export function getAllPosts() {
  const slugs = getAllPostSlugs();
  return slugs
    .map(({ slug }) => {
      try {
        return getPostData(slug);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.updated || b.date || 0) - new Date(a.updated || a.date || 0));
}

export function getPostsByCategory(category) {
  return getAllPosts().filter(p => p.category === category);
}

export function getPostsByCluster(cluster) {
  return getAllPosts().filter(p => p.cluster === cluster);
}

export function getPostData(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) throw new Error(`Post not found: ${slug}`);

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const fallbackImage = POST_IMAGES[slug] || 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80';
  const eyecatch = data.eyecatch || data.image || fallbackImage;

  // 擬似PV数（スラッグをシードにして安定した数を生成）
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const views = Math.abs((hash % 18000) + 12400).toLocaleString();

  return {
    slug: data.slug || slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || 'FEATURE',
    cluster: data.cluster || '注目トピック',
    keyword: data.keyword || '',
    articleType: data.article_type || '',
    related: data.related || [],
    affiliateIds: data.affiliate_ids || [],
    updated: data.updated || '2026-11-08',
    formattedDate: formatGizmodoDate(data.updated),
    views,
    image: eyecatch,
    eyecatch,
    content, // raw markdown (HTMLに変換前)
    ...data,
  };
}

export async function getPostWithHtml(slug) {
  const post = getPostData(slug);
  
  // 本文中の重複した広告表記（目立つもの）をトリミングして専用エリアに集約
  let cleanContent = post.content
    .replace(/^【広告】[^\n]*\n+/g, '')
    .replace(/^※\s*本記事には[^\n]*\n+/g, '');

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(cleanContent);

  return {
    ...post,
    contentHtml: processed.toString(),
  };
}

export function getRelatedPosts(post, limit = 4) {
  const allPosts = getAllPosts();
  const related = (post.related || [])
    .map(slug => allPosts.find(p => p.slug === slug))
    .filter(Boolean);

  if (related.length >= limit) return related.slice(0, limit);

  // 不足分をクラスターから補完
  const fromCluster = allPosts
    .filter(p => p.cluster === post.cluster && p.slug !== post.slug && !related.find(r => r.slug === p.slug))
    .slice(0, limit - related.length);

  return [...related, ...fromCluster];
}

export function getCategories() {
  const posts = getAllPosts();
  const catCount = {};
  posts.forEach(p => {
    if (p.category) catCount[p.category] = (catCount[p.category] || 0) + 1;
  });
  return Object.entries(catCount).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getClusters() {
  const posts = getAllPosts();
  const clusterMap = {};
  posts.forEach(p => {
    if (p.cluster) {
      clusterMap[p.cluster] = (clusterMap[p.cluster] || 0) + 1;
    }
  });
  return Object.entries(clusterMap).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPopularPosts(limit = 5) {
  const allPosts = getAllPosts();
  // 更新日・文字数順などを組み合わせて人気記事風に
  return allPosts.slice(0, limit);
}
