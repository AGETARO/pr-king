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
    return { slug: data.slug || f.replace(/\.md$/, ''), updated: toDate(data.updated), hub: hub ? hub.slug : '' };
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
  ...posts.map((p) => entry(`${SITE_URL}/posts/${p.slug}/`, p.updated, 'weekly', '0.8')),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} URLs`);
