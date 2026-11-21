// lib/promos.js - アフィリエイトバナー（もしもアフィリエイト）の定義
// 新しいバナーは、ここに1件追加し、<PromoBanner id="..." /> で表示します。
// width / height は画像の実寸（不明な場合は省略可）。
export const PROMOS = {
  // サイドバー用（マネーセミナー）
  seminar: {
    href: '//af.moshimo.com/af/c/click?a_id=5915323&p_id=1715&pc_id=3242&pl_id=24578&url=https%3A%2F%2Fios-moneyseminar.jp%2F%3Fid%3Dmoshi',
    img: 'https://image.moshimo.com/af-img/1057/000000024578.jpg',
    impression: '//i.moshimo.com/af/i/impression?a_id=5915323&p_id=1715&pc_id=3242&pl_id=24578',
    alt: '広告：マネーセミナーの案内',
  },
  // 記事末尾用（728x90）
  wideA: {
    href: '//af.moshimo.com/af/c/click?a_id=5915324&p_id=1151&pc_id=1733&pl_id=89425',
    img: '//image.moshimo.com/af-img/0400/000000089425.png',
    impression: '//i.moshimo.com/af/i/impression?a_id=5915324&p_id=1151&pc_id=1733&pl_id=89425',
    width: 728,
    height: 90,
    alt: '広告バナー',
  },
  // トップページ用（468x60）
  wideB: {
    href: '//af.moshimo.com/af/c/click?a_id=5915321&p_id=54&pc_id=54&pl_id=1220',
    img: '//image.moshimo.com/af-img/0032/000000001220.gif',
    impression: '//i.moshimo.com/af/i/impression?a_id=5915321&p_id=54&pc_id=54&pl_id=1220',
    width: 468,
    height: 60,
    alt: '広告バナー',
  },
  // サイドバー下部用（300x250）
  rect: {
    href: '//af.moshimo.com/af/c/click?a_id=5915322&p_id=7685&pc_id=22248&pl_id=95902',
    img: '//image.moshimo.com/af-img/6249/000000095902.png',
    impression: '//i.moshimo.com/af/i/impression?a_id=5915322&p_id=7685&pc_id=22248&pl_id=95902',
    width: 300,
    height: 250,
    alt: '広告バナー',
  },
};
