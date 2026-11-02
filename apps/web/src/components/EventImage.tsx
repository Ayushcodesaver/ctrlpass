'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { brandAssets } from '@/lib/brand';

type EventImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
};

export default function EventImage({
  src,
  alt,
  className = '',
  aspectClassName = 'aspect-[16/9]',
  priority = false,
}: EventImageProps) {
  const [failed, setFailed] = useState(false);

  const imageSrc =
    src && !failed ? src : brandAssets.eventPlaceholder;

  const usingFallback = !src || failed;

  return (
    <div
      className={`relative overflow-hidden bg-[#111111] ${aspectClassName} ${className}`}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        onError={() => {
          if (!usingFallback) {
            setFailed(true);
          }
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      {usingFallback && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-black/30 backdrop-blur-sm">
            <ImageOff className="h-4 w-4 text-[#77736C]" />
          </div>
        </div>
      )}
    </div>
  );
}