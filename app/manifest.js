export default function manifest() {
  return {
    name: "BioConnect — Biotech Academic Platform",
    short_name: "BioConnect",
    description: "Connect with biotech students, educators, and researchers. Access learning resources, research papers, and events.",
    start_url: "/",
    display: "standalone",
    background_color: "#EEF7F7",
    theme_color: "#14B8A6",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
