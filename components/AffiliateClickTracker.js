'use client';
// components/AffiliateClickTracker.js - 広告リンク（data-aff-id 付き）のクリックを GA4 に送る
// GA4 では イベント名「affiliate_click」で、aff_id（案件）・aff_pos（cta / text）・page_path が見られる。
import { useEffect } from 'react';

export default function AffiliateClickTracker() {
  useEffect(() => {
    function onClick(e) {
      const a = e.target.closest && e.target.closest('a[data-aff-id]');
      if (!a || typeof window.gtag !== 'function') return;
      window.gtag('event', 'affiliate_click', {
        aff_id: a.dataset.affId,
        aff_pos: a.dataset.affPos || '',
        page_path: window.location.pathname,
        // 新しいタブで開くリンクなので、送信を待たずに遷移してよい
        transport_type: 'beacon',
      });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
