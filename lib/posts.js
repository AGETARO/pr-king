// lib/posts.js - Markdownファイルの読み込みとパース
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { renderAffiliateLink, renderAffiliateCta, renderAffiliateBanner, hasCta } from './affiliates';
import { HUBS, getHubForPost } from './hubs';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

// スラッグ別 フリー画像マップ（Unsplash）
export const POST_IMAGES = {
  'credit-card-student-guide': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
  'how-to-become-white-hat-hacker-for-kids': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'personal-ict-security-guide': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  'inflation-survival-saving-tips': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80',
  'junior-nisa-kids-investment-guide': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
  'recommended-credit-cards-ranking': 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1200&q=80',
  'amazon-prime-sale-best-buys': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
  'smbc-card-nl-vs-gold-vs-platinum-preferred': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
  'smbc-gold-100man-shugyo-guide': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
  'jcb-card-w-vs-smbc-card-nl': 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200&q=80',
  'nisa-creca-tsumitate-comparison-2026': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  'single-food-cost-20000-saving-tips': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'welcome': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80';
const JST = 'Asia/Tokyo';

// frontmatter の日付を 'YYYY-MM-DD'（日本時間の日付）に正規化する。
// - 'YYYY-MM-DD' の文字列はそのまま使う（タイムゾーン変換しない）
// - YAMLが Date に変換した場合（引用符なし）は UTC 0:00 なので、日付部分だけ取り出す
// - 時刻付きの文字列は 日本時間(JST) に変換した日付にする
export function normalizeDate(value) {
  if (!value) return '';
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? '' : value.toISOString().slice(0, 10);
  }
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return '';
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: JST, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(d);
  return p; // en-CA は YYYY-MM-DD
}

// 表示用: 2026年11月20日（時刻は表示しない。時刻の根拠データがないため）
export function formatPostDate(value) {
  const iso = normalizeDate(value);
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  return `${m[1]}年${Number(m[2])}月${Number(m[3])}日`;
}

// 広告（アフィリエイト）を含む記事かどうか
function detectPromotion(content, affiliateIds) {
  if (Array.isArray(affiliateIds) && affiliateIds.length > 0) return true;
  return /affiliate-card|\{\{(aff|cta|banner):|【PR】|【広告】|アフィリエイト|プロモーション/.test(content);
}

export function getAllPostSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') && !f.includes('.quality') && !f.includes('.backup'))
    .map(f => ({ slug: f.replace(/\.md$/, '') }));
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
    .sort((a, b) => {
      const diff = new Date(b.updated || 0) - new Date(a.updated || 0);
      return diff !== 0 ? diff : a.slug.localeCompare(b.slug);
    });
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

  const fallbackImage = POST_IMAGES[slug] || DEFAULT_IMAGE;
  const eyecatch = data.eyecatch || data.image || fallbackImage;
  const updated = normalizeDate(data.updated) || '2026-11-08';
  // 公開日: frontmatter の published / date。なければ更新日で代用（推測の日付は作らない）
  const published = normalizeDate(data.published || data.date) || updated;
  const affiliateIds = data.affiliate_ids || [];

  return {
    ...data,
    slug: data.slug || slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || 'FEATURE',
    cluster: data.cluster || '注目トピック',
    keyword: data.keyword || '',
    articleType: data.article_type || '',
    related: data.related || [],
    affiliateIds,
    hasPromo: detectPromotion(content, affiliateIds),
    updated,
    published,
    hubSlug: getHubForPost({ hub: data.hub, cluster: data.cluster || '注目トピック' })?.slug || '',
    formattedDate: formatPostDate(updated),
    image: eyecatch,
    eyecatch,
    content, // raw markdown (HTMLに変換前)
  };
}

// 本文に {{cta:...}} がなく affiliate_ids がある記事は、「まとめ／結論」見出しの直前（なければ末尾）に
// CTAカードを自動で入れる。読み終える直前が、申し込みを検討するタイミングのため。
const AUTO_CTA_MAX = 3;
function insertAutoCta(content, affiliateIds) {
  if (/\{\{cta:/.test(content)) return content;
  const ids = (affiliateIds || []).filter(hasCta).slice(0, AUTO_CTA_MAX);
  if (ids.length === 0) return content;
  const block = `\n${ids.map((id) => `{{cta:${id}}}`).join('\n\n')}\n\n`;
  const headings = [...content.matchAll(/^## .*$/gm)];
  const target = [...headings].reverse().find((m) => /まとめ|結論/.test(m[0]));
  if (!target) return `${content.trimEnd()}\n\n${block}`;
  return content.slice(0, target.index) + block + content.slice(target.index);
}

export async function getPostWithHtml(slug) {
  const post = getPostData(slug);

  let cleanContent = insertAutoCta(post.content, post.affiliateIds)
    // 本文冒頭の広告表記は専用エリアに集約
    .replace(/^【広告】[^\n]*\n+/g, '')
    .replace(/^※\s*本記事には[^\n]*\n+/g, '')
    // 未解決の内部リンク用プレースホルダー行は削除
    .replace(/^\{\{internal_link:[^}]*\}\}[ \t]*\n?/gm, '')
    // {{cta:ID}} を申し込みカードに展開（前後を空行にして独立したHTMLブロックにする）
    .replace(/\{\{cta:([^}]+)\}\}/g, (_, id) => `\n\n${renderAffiliateCta(id)}\n\n`)
    .replace(/\{\{banner:([^}]+)\}\}/g, (_, id) => `\n\n${renderAffiliateBanner(id)}\n\n`)
    // {{aff:ID}} を広告リンクに展開。未定義のIDは空にする
    .replace(/\{\{aff:([^}]+)\}\}/g, (_, id) => renderAffiliateLink(id));

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(cleanContent);

  // 外部リンクは別タブ + rel を付与（記事内に直書きされた <a> で rel がないもの）
  const contentHtml = processed
    .toString()
    .replace(/<a href="(https?:\/\/[^"]+)">/g, '<a href="$1" target="_blank" rel="noopener noreferrer">');

  return {
    ...post,
    contentHtml,
  };
}

export function getRelatedPosts(post, limit = 4) {
  const allPosts = getAllPosts();
  const related = (post.related || [])
    .map(slug => allPosts.find(p => p.slug === slug))
    .filter(Boolean);

  if (related.length >= limit) return related.slice(0, limit);

  // 不足分を 同じクラスター → 同じハブ の順に補完
  const isNew = p => p.slug !== post.slug && !related.find(r => r.slug === p.slug);
  const fromCluster = allPosts.filter(p => p.cluster === post.cluster && isNew(p));
  const fromHub = post.hubSlug
    ? allPosts.filter(p => p.hubSlug === post.hubSlug && p.cluster !== post.cluster && isNew(p))
    : [];

  return [...related, ...fromCluster, ...fromHub].slice(0, limit);
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

// 注目記事 = 更新日が新しい順。アクセス数などの実測値には基づかない。
// クライアントコンポーネント(Sidebar)に渡すため、本文を含まない最小限の項目だけ返す。
export function getPickupPosts(limit = 5) {
  return getAllPosts()
    .slice(0, limit)
    .map(({ slug, title, eyecatch, updated, formattedDate }) => ({
      slug, title, eyecatch, updated, formattedDate,
    }));
}

export function getPostsByHub(hubSlug) {
  return getAllPosts().filter(p => p.hubSlug === hubSlug);
}

// サイドバー等のカテゴリ一覧用（記事が1本以上あるハブのみ）
export function getHubs() {
  const posts = getAllPosts();
  return HUBS
    .map(h => ({ name: h.name, slug: h.slug, count: posts.filter(p => p.hubSlug === h.slug).length }))
    .filter(h => h.count > 0);
}
