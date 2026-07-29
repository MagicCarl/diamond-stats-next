"use client";

import { useEffect } from "react";

const EMBED_SRC =
  "https://app.trysoro.com/api/embed/8d385f99-7f5f-4586-9a39-bbfdefac99ae";

const CARD_SELECTOR = "a.soro-blog-card[data-slug]";

/**
 * Soro blog embed. Renders the #soro-blog container and injects Soro's loader
 * script after mount (matching their official snippet). We append the script
 * manually rather than via next/script because the afterInteractive strategy
 * only preloaded the file without executing it in this server-component tree.
 *
 * The widget is a teaser list only. Left to itself it links each card at
 * `/?post=<slug>` and renders the article inline, which appended a second
 * <link rel="canonical"> and landed those URLs in Google's "Duplicate without
 * user-selected canonical" bucket. Articles now live at /blog/<slug> as real
 * server-rendered pages, so we repoint the cards there and let the browser
 * navigate normally.
 */
export default function SoroBlog() {
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const container = document.getElementById("soro-blog");
    if (!container) return;

    const rewriteLinks = () => {
      container.querySelectorAll<HTMLAnchorElement>(CARD_SELECTOR).forEach((card) => {
        const slug = card.dataset.slug;
        if (slug) card.setAttribute("href", `/blog/${slug}`);
      });
    };

    // The widget renders asynchronously and re-renders on navigation, so watch
    // the subtree rather than rewriting once.
    const observer = new MutationObserver(rewriteLinks);
    observer.observe(container, { childList: true, subtree: true });
    rewriteLinks();

    // Capture phase runs before Soro's own listener on each card, which calls
    // preventDefault() unconditionally to swap in its in-page article view.
    // Stopping propagation here leaves the anchor's default navigation intact —
    // which now points at /blog/<slug> — and restores cmd/middle-click too.
    const stopSoroNavigation = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(CARD_SELECTOR)) event.stopPropagation();
    };
    container.addEventListener("click", stopSoroNavigation, true);

    return () => {
      observer.disconnect();
      container.removeEventListener("click", stopSoroNavigation, true);
    };
  }, []);

  return <div id="soro-blog" />;
}
