"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Autoplaying video that doesn't download until it's near the viewport.
 * A plain <video autoPlay> starts fetching the whole file on page load, which
 * competed with the hero image for bandwidth on phones.
 */
export default function LazyVideo({
  src,
  poster,
  className,
  label,
  captions,
}: {
  src: string;
  poster: string;
  className?: string;
  label: string;
  /** WebVTT file with English captions for the spoken audio */
  captions?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={visible ? src : undefined}
      poster={poster}
      autoPlay={visible}
      preload="none"
      muted
      loop
      playsInline
      controls
      aria-label={label}
      className={className}
    >
      {captions && <track kind="captions" src={captions} srcLang="en" label="English" />}
    </video>
  );
}
