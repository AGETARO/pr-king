'use client';
import { useState, useEffect } from 'react';

export default function HeaderClock() {
  // 初期表示は固定の偽時刻ではなく、取得できるまで空欄にする
  const [timeStr, setTimeStr] = useState('--:--:-- JST');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      // JST (UTC+9) の時刻をフォーマット
      const jstString = now.toLocaleTimeString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTimeStr(`${jstString} JST`);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header-clock">
      <span>{timeStr}</span>
    </div>
  );
}

