// site/components/ArticleEyecatch.js - ギズモード風 大迫力アイキャッチ写真コンポーネント
import React from 'react';

export default function ArticleEyecatch({ title, category, cluster, imageUrl }) {
  const finalImage = imageUrl || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80';

  return (
    <figure className="gizmodo-eyecatch-wrapper">
      <div className="gizmodo-eyecatch-image-box">
        <img
          src={finalImage}
          alt={title}
          className="gizmodo-eyecatch-img"
          loading="eager"
        />
        <div className="gizmodo-eyecatch-badge-tag">
          {cluster || category || 'FEATURE'}
        </div>
      </div>
      <figcaption className="gizmodo-eyecatch-caption">
        <span className="caption-text">{title}</span>
        <span className="caption-credit">Photo: Unsplash / PR-KING</span>
      </figcaption>
    </figure>
  );
}
