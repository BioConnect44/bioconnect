export default function sitemap() {
  const baseUrl = 'https://bio-connect-phi.vercel.app'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/biominute`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/eventss`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learning`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      priority: 0.5,
    },
  ]
}