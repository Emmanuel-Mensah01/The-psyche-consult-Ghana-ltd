import React from 'react';

/**
 * TeamAvatar — reusable team-member picture.
 *
 * Right now it draws a clean SVG silhouette on a coloured gradient.
 * LATER: pass an `image` path (e.g. "/team/solomon.jpg", saved in the
 * project's public\team\ folder) and the real photo replaces the SVG
 * automatically — no other code needs to change.
 */
interface TeamAvatarProps {
  name: string;
  image?: string;            // optional real photo, e.g. '/team/solomon.jpg'
  colorClass?: string;       // gradient classes for the SVG background
  className?: string;       // size, e.g. 'w-24 h-24'
}

export default function TeamAvatar({
  name,
  image,
  colorClass = 'from-indigo-500 to-purple-600',
  className = 'w-24 h-24',
}: TeamAvatarProps) {
  return (
    <div
      className={`${className} rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${colorClass} flex-shrink-0`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        <svg viewBox="0 0 96 96" className="w-full h-full" role="img" aria-label={name}>
          {/* soft decorative ring */}
          <circle cx="48" cy="48" r="44" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="2" />
          {/* head */}
          <circle cx="48" cy="36" r="15" fill="white" fillOpacity="0.92" />
          {/* shoulders (bottom is clipped by the rounded card) */}
          <path d="M17 96c0-19 14-31 31-31s31 12 31 31z" fill="white" fillOpacity="0.92" />
        </svg>
      )}
    </div>
  );
}
