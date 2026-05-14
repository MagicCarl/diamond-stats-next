import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/features", "/pricing", "/login", "/signup"],
        disallow: ["/api/", "/dashboard", "/admin", "/settings", "/teams/", "/games/", "/instructions"],
      },
    ],
    sitemap: "https://www.baseballstatstracker.com/sitemap.xml",
  };
}
