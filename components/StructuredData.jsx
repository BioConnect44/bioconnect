export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bio-connect-lake.vercel.app";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BioConnect",
    "url": baseUrl,
    "description": "India's premier biotechnology academic and research platform.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/research?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "BioConnect",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Academic platform connecting students, researchers, and biotech professionals across India.",
    "sameAs": [
      "https://github.com/bioconnect",
      "https://twitter.com/bioconnect"
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
