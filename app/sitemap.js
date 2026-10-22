export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bio-connect-lake.vercel.app";

  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/learning", priority: 0.9, changeFrequency: "weekly" },
    { path: "/research", priority: 0.9, changeFrequency: "daily" },
    { path: "/jobs", priority: 0.9, changeFrequency: "daily" },
    { path: "/events", priority: 0.8, changeFrequency: "daily" },
    { path: "/biominute", priority: 0.8, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/guides", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/login", priority: 0.4, changeFrequency: "monthly" },
    { path: "/signup", priority: 0.4, changeFrequency: "monthly" },
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
