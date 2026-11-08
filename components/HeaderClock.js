'use client';
import { useState, useEffect } from 'react';

export default function HeaderClock() {
  const [timeStr, setTimeStr] = useState('23:10:29 JST');

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

