"use client";

import Link from "next/link";

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bio-connect-lake.vercel.app";

  const schemaItems = [
    { name: "Home", url: baseUrl },
    ...items.map((it) => ({
      name: it.label,
      url: it.href ? `${baseUrl}${it.href}` : undefined,
    })),
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": schemaItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url ? { "item": item.url } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" style={{ margin: "16px 0", fontSize: "0.85rem", color: "#64748B" }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
          <li>
            <Link href="/" style={{ color: "#64748B", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#14B8A6"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}>
              Home
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#CBD5E1" }}>/</span>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    style={{ color: "#64748B", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#14B8A6"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ color: "#0F172A", fontWeight: 600 }}>{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
