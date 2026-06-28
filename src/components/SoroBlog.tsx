"use client";

import { useEffect } from "react";

const EMBED_SRC =
  "https://app.trysoro.com/api/embed/8d385f99-7f5f-4586-9a39-bbfdefac99ae";

/**
 * Soro blog embed. Renders the #soro-blog container and injects Soro's loader
 * script after mount (matching their official snippet). We append the script
 * manually rather than via next/script because the afterInteractive strategy
 * only preloaded the file without executing it in this server-component tree.
 */
export default function SoroBlog() {
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div id="soro-blog" />;
}
