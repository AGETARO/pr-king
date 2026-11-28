// scripts/generate-sitemap.mjs - public/sitemap.xml を記事から自動生成する（npm run build の前に実行）
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { HUBS } from '../lib/hubs.js';

const SITE_URL = (process.env.SITE_URL || 'https://lifetime.pr-king.workers.dev').replace(/\/$/, '');
const postsDir = path.join(process.cwd(), 'content/posts');

function toDate(v) {
  if (!v) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v).trim();
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : '';
}

const posts = fs.readdirSync(postsDir)
  .filter((f) => f.endsWith('.md') && !f.includes('.quality') && !f.includes('.backup'))
  .map((f) => {
    const { data } = matter(fs.readFileSync(path.join(postsDir, f), 'utf8'));
    const hub = data.hub
      ? HUBS.find((h) => h.slug === data.hub)
      : HUBS.find((h) => h.clusters.includes(data.cluster));
    return {
      slug: data.slug || f.replace(/\.md$/, ''),
      updated: toDate(data.updated),
      published: toDate(data.published || data.date) || toDate(data.updated),
      hub: hub ? hub.slug : '',
      hubName: hub ? hub.name : '',
      title: data.title || '',
      description: data.description || '',
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

const latest = posts.map((p) => p.updated).filter(Boolean).sort().pop() || '';

const entry = (loc, lastmod, freq, prio) =>
  `  <url>\n    <loc>${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`;

const urls = [
  entry(`${SITE_URL}/`, latest, 'daily', '1.0'),
  entry(`${SITE_URL}/posts/`, latest, 'daily', '0.8'),
  // カテゴリハブ（記事があるものだけ。lastmod は所属記事の最新更新日）
  ...HUBS.map((h) => {
    const d = posts.filter((p) => p.hub === h.slug).map((p) => p.updated).filter(Boolean).sort().pop();
    return d ? entry(`${SITE_URL}/category/${h.slug}/`, d, 'weekly', '0.7') : null;
  }).filter(Boolean),
  entry(`${SITE_URL}/about/`, '', 'yearly', '0.3'),
  entry(`${SITE_URL}/privacy/`, '', 'yearly', '0.3'),
  entry(`${SITE_URL}/contact/`, '', 'yearly', '0.3'),
  ...posts.map((p) => entry(`${SITE_URL}/posts/${p.slug}/`, p.updated, 'weekly', '0.8')),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} URLs`);

// ---- RSS 2.0（public/feed.xml）: 新着の購読（Feedly等）と、検索エンジンへの更新通知に使う ----
const SITE_NAME = process.env.SITE_NAME || 'PR-KING';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// 日付は日本時間 0:00 として扱う（記事ページの datePublished と同じ基準）
const rfc822 = (d) => new Date(`${d}T00:00:00+09:00`).toUTCString();
const feedPosts = posts
  .filter((p) => p.updated)
  .sort((a, b) => (b.updated.localeCompare(a.updated)) || a.slug.localeCompare(b.slug))
  .slice(0, 30);
const items = feedPosts.map((p) => {
  const link = `${SITE_URL}/posts/${p.slug}/`;
  return [
    '    <item>',
    `      <title>${esc(p.title)}</title>`,
    `      <link>${link}</link>`,
    `      <guid isPermaLink="true">${link}</guid>`,
    `      <pubDate>${rfc822(p.updated)}</pubDate>`,
    p.hubName ? `      <category>${esc(p.hubName)}</category>` : '',
    `      <description>${esc(p.description)}</description>`,
    '    </item>',
  ].filter(Boolean).join('\n');
});
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${SITE_URL}/</link>
    <description>クレジットカード・新NISA・節約のお金メディア</description>
    <language>ja</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${latest ? `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>\n` : ''}${items.join('\n')}
  </channel>
</rss>
`;
fs.writeFileSync(path.join(process.cwd(), 'public/feed.xml'), rss);
console.log(`feed.xml: ${items.length} items`);
