// components/PromoBanner.js - アフィリエイトバナー（もしもアフィリエイト）
// 広告であることが分かるよう「PR」を表示し、リンクには rel="sponsored nofollow" を付ける。
import React from 'react';

export default function PromoBanner() {
  return (
    <div className="gizmodo-ad-box" style={{ textAlign: 'center' }}>
      <span className="ad-corner-tag">PR</span>
      <a
        href="//af.moshimo.com/af/c/click?a_id=5915323&p_id=1715&pc_id=3242&pl_id=24578&url=https%3A%2F%2Fios-moneyseminar.jp%2F%3Fid%3Dmoshi"
        rel="sponsored nofollow noopener"
        referrerPolicy="no-referrer-when-downgrade"
        attributionsrc=""
        target="_blank"
        style={{ display: 'block' }}
      >
        <img
          src="https://image.moshimo.com/af-img/1057/000000024578.jpg"
          alt="広告：マネーセミナーの案内"
          style={{ border: 'none', maxWidth: '100%', height: 'auto' }}
          loading="lazy"
        />
      </a>
      {/* 表示回数の計測用ピクセル（1x1・非表示） */}
      <img
        src="//i.moshimo.com/af/i/impression?a_id=5915323&p_id=1715&pc_id=3242&pl_id=24578"
        width="1"
        height="1"
        style={{ border: 'none' }}
        alt=""
        loading="lazy"
      />
    </div>
  );
}
