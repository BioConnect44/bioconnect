export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bio-connect-lake.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/profile/", "/verify-otp", "/reset-password"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
