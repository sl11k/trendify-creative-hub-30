// Generates public/sitemap.xml with static routes + dynamic blog posts.
// Runs in predev/prebuild via package.json scripts.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://trendify.sa";

const SUPABASE_URL = "https://sfgwaukvjwcwdvnxklod.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZ3dhdWt2andjd2R2bnhrbG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjQyNTcsImV4cCI6MjA3MjE0MDI1N30.bM2hbn8mycmjv5Uqeax1zblJEHZrF-l39dCUBVjjCBc";

interface Entry {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

const staticEntries: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/portfolio", changefreq: "weekly", priority: "0.8" },
  { path: "/tools", changefreq: "weekly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
];

async function fetchBlogEntries(): Promise<Entry[]> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from("blogs")
      .select("id, updated_at, created_at")
      .eq("published", true);
    if (error || !data) return [];
    return data.map((b: any) => ({
      path: `/blog/${b.id}`,
      lastmod: (b.updated_at || b.created_at)?.split("T")[0],
      changefreq: "monthly",
      priority: "0.6",
    }));
  } catch (e) {
    console.warn("Failed to fetch blogs for sitemap:", e);
    return [];
  }
}

function render(entries: Entry[]) {
  const urls = entries
    .map((e) =>
      [
        `  <url>`,
        `    <loc>${BASE_URL}${e.path}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        `  </url>`,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

(async () => {
  const blogs = await fetchBlogEntries();
  const all = [...staticEntries, ...blogs];
  writeFileSync(resolve("public/sitemap.xml"), render(all));
  console.log(`sitemap.xml written (${all.length} entries)`);
})();
