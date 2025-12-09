"use client"

import React from 'react';
import { API_URL } from '@/lib/api';

// Reusable Logo component.
// By default it tries to load the uploaded logo at `${API_URL}uploads/ruraltech-logo.svg`.
// Falls back to the local public asset `/img/ruraltech-logo.svg` when API_URL is not available
// or the uploaded file isn't accessible.
export default function Logo({ className = '', alt = 'RuralTech Logo', width, height }) {
  const uploaded = API_URL ? `${API_URL}uploads/ruraltech-logo.svg` : null;
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  // Use the uploaded path first; if it 404s the browser will fall back to the local asset
  // only if you change the `onError` to swap src. Here we set uploaded first and also set
  // a `onError` that replaces src with the public path.
  const publicSrc = '/img/ruraltech-logo.svg';

  return (
    <img
      src={uploaded || publicSrc}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        if (e.currentTarget.src !== publicSrc) e.currentTarget.src = publicSrc;
      }}
    />
  );
}
