'use client'

import React, { useState } from 'react';

export default function PictureFrame({ url, imageName }: { url: string, imageName: string }) {
  const [imageError, setImageError] = useState(false);

  return imageError && (
    <img
      src={url}
      alt={imageName}
      className="rounded-lg w-[25%] bg-black my-8"
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setImageError(true);
      }}
    />
  );
}