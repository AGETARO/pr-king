// components/PromoBanner.js - アフィリエイトバナー（もしもアフィリエイト）
// 広告であることが分かるよう「PR」を表示し、リンクには rel="sponsored nofollow" を付ける。
// バナーの定義は lib/promos.js。
import React from 'react';
import { PROMOS } from '../lib/promos';

export default function PromoBanner({ id = 'seminar', wide = false }) {
  const p = PROMOS[id];
  if (!p) return null;

  const imgStyle = { border: 'none', maxWidth: '100%', height: 'auto' };

  const banner = (
    <>
      <a
        href={p.href}
        rel="sponsored nofollow noopener"
        referrerPolicy="no-referrer-when-downgrade"
        attributionsrc=""
        target="_blank"
        style={{ display: 'inline-block', maxWidth: '100%' }}
      >
        <img
          src={p.img}
          alt={p.alt || '広告バナー'}
          width={p.width}
          height={p.height}
          style={imgStyle}
          loading="lazy"
        />
      </a>
      {/* 表示回数の計測用ピクセル（1x1・非表示） */}
      <img src={p.impression} width="1" height="1" style={{ border: 'none' }} alt="" loading="lazy" />
    </>
  );

  // 本文エリア用（横長バナー）：中央寄せ＋「広告」表記
  if (wide) {
    return (
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>広告</div>
        {banner}
      </div>
    );
  }

  // サイドバー用
  return (
    <div className="gizmodo-ad-box" style={{ textAlign: 'center' }}>
      <span className="ad-corner-tag">広告</span>
      {banner}
    </div>
  );
}
