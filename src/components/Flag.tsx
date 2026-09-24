'use client';
import React, { useState } from 'react';

/**
 * Country flag that works on every device.
 * Windows desktop browsers cannot draw flag emojis (they show letters like "US"/"GB"),
 * so we read the country code out of the emoji and show a small flag image instead.
 * Falls back to the emoji itself if the image cannot load.
 */
export function codeFromEmoji(emoji?: string | null): string | null {
  if (!emoji) return null;
  const cps = Array.from(emoji.trim()).map((c) => c.codePointAt(0) as number);
  if (cps.length >= 2 && cps[0] >= 0x1f1e6 && cps[0] <= 0x1f1ff && cps[1] >= 0x1f1e6 && cps[1] <= 0x1f1ff) {
    return String.fromCharCode(cps[0] - 0x1f1e6 + 97, cps[1] - 0x1f1e6 + 97);
  }
  return null;
}

export default function Flag({
  emoji,
  code,
  width = 36,
  className = '',
}: {
  emoji?: string | null;
  code?: string | null;
  width?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const cc = (codeFromEmoji(emoji) || (code && /^[a-zA-Z]{2}$/.test(code) ? code.toLowerCase() : null)) as string | null;

  if (!cc || failed) {
    return (
      <span className={className} style={{ fontSize: width * 0.85, lineHeight: 1 }} aria-hidden>
        {emoji && !codeFromEmoji(emoji) && emoji.length > 4 ? '🌍' : emoji || '🌍'}
      </span>
    );
  }

  const w = width <= 20 ? 40 : width <= 40 ? 80 : 160;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w${w}/${cc}.png`}
      srcSet={`https://flagcdn.com/w${w}/${cc}.png 1x, https://flagcdn.com/w${w * 2}/${cc}.png 2x`}
      width={width}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={`inline-block rounded-[3px] shadow-sm border border-gray-200 object-cover ${className}`}
      style={{ width, height: 'auto' }}
    />
  );
}
