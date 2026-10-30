// site/lib/posts.js - Markdownファイルの読み込みとパース
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

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

  return {
    slug: data.slug || slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || '',
    cluster: data.cluster || '',
    keyword: data.keyword || '',
    articleType: data.article_type || '',
    related: data.related || [],
    affiliateIds: data.affiliate_ids || [],
    updated: data.updated || null,
    content, // raw markdown (HTMLに変換前)
    ...data,
  };
}

export async function getPostWithHtml(slug) {
  const post = getPostData(slug);
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(post.content);

  return {
    ...post,
    contentHtml: processed.toString(),
  };
}

export function getRelatedPosts(post, limit = 3) {
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
