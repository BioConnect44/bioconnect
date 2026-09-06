"use client";

import { useState } from "react";
import PublicNavbarFooter from "@/components/PublicNavbarFooter";

const BLOG_POSTS = [
  {
    id: "crispr-cas9-2026-breakthroughs",
    title: "CRISPR-Cas9 in 2026: Next-Generation Epigenome Editing & Clinical Applications",
    category: "Biotech Trends",
    author: "Dr. Ananya Sharma",
    authorRole: "Lead Researcher, IISc Bengaluru",
    date: "March 2, 2026",
    readTime: "6 min read",
    featured: true,
    banner: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Explore how prime editing and epigenome modification without double-strand DNA breaks are revolutionizing gene therapy for hereditary conditions in India.",
    content: `
      ### The Evolution of Precision Genome Editing
      Gene editing has advanced beyond traditional double-stranded breaks. In 2026, epigenomic editing and prime editing 3.0 are allowing scientists to modify gene expression patterns without cutting the DNA backbone.

      #### Key Breakthroughs
      1. **Off-Target Minimization**: New Cas variants engineered with machine learning have reduced unintended off-target cleavages by over 99.4%.
      2. **In-Vivo Delivery Advances**: Lipid Nanoparticles (LNPs) targeted to specific organ tissue types have enabled direct systemic administration for liver and blood cell disorders.
      3. **Regulatory Landscape**: CDSCO India has established streamlined fast-track pathways for investigational cell and gene therapy (CGT) protocols.

      #### Implications for Biotechnology Students
      Understanding molecular biology fundamentals combined with computational guide RNA design tools (e.g. CRISPOR, CHOPCHOP) is now essential for every biotech graduate.
    `,
    tags: ["CRISPR", "Gene Therapy", "Epigenomics", "Biotech Trends"]
  },
  {
    id: "ai-protein-folding-alphafold3-practical-guide",
    title: "AlphaFold 3 & Beyond: How AI is Accelerating Structural Biology & Drug Discovery",
    category: "Bioinformatics",
    author: "Rohan Varma",
    authorRole: "Bioinformatics Engineer",
    date: "February 24, 2026",
    readTime: "8 min read",
    banner: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
    excerpt: "Deep learning models are predicting complex protein-ligand, nucleic acid, and post-translational modifications with atomic precision.",
    content: `
      ### Demystifying Biomolecular Interaction Modeling
      Predicting how proteins interact with small molecules, RNA, and DNA was once restricted to months of X-ray crystallography or cryo-EM. Today, multi-state AI architectures predict complex structures in minutes.

      #### Practical Applications
      - **Biotherapeutics Design**: Rapid screening of nanobodies and synthetic antibody fragments.
      - **Enzyme Engineering**: Optimizing thermostable enzymes for industrial bioprocess scale-up.
      - **Virtual High-Throughput Screening**: Docking millions of candidate molecules with AI-refined binding site predictions.

      #### Getting Started with Open Tools
      Students can leverage ESMFold, AlphaFold-Multimer, and PyMOL 3.0 on free Google Colab notebooks to visualize molecular docking.
    `,
    tags: ["AlphaFold", "Bioinformatics", "Structural Biology", "AI in Healthcare"]
  },
  {
    id: "biotech-internship-roadmap-india-2026",
    title: "The Ultimate 2026 Guide to Securing CSIR, DBT & Industry Biotech Internships",
    category: "Career & Research",
    author: "Priya Nair",
    authorRole: "Career Advisor & BioConnect Mentor",
    date: "February 18, 2026",
    readTime: "7 min read",
    banner: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    excerpt: "Step-by-step strategies for cold emailing lab professors, building a research CV, and applying for prestigious national fellowships.",
    content: `
      ### Securing Research Experience in India
      Undergraduate and postgraduate research internships are pivotal for higher education applications (GATE, NET, MS, PhD) and R&D roles in pharma.

      #### Key Fellowship Deadlines
      - **CSIR-JRF / Summer Research Fellowship (IAS-INSA-NASI)**: Applications open Nov - Dec.
      - **DBT-BITP (Biotechnology Industrial Training Programme)**: Stipend-backed industry placements.
      - **ICMR & BIRAC Innovation Fellowships**: Focused on healthcare and medical devices.

      #### Cold Emailing Best Practices
      1. Keep emails under 200 words.
      2. Mention 1 specific recent paper from the professor's lab.
      3. Clearly state your availability, technical skills (PCR, HPLC, Python), and funding status.
    `,
    tags: ["Internships", "Career Advice", "Fellowships", "CSIR", "DBT"]
  },
  {
    id: "mastering-pcr-troubleshooting-lab-guide",
    title: "PCR Masterclass: Troubleshooting Non-Specific Bands, Smears & Zero Yield",
    category: "Lab Techniques",
    author: "Dr. Vikram Sethi",
    authorRole: "Senior Scientist, CCMB Hyderabad",
    date: "February 10, 2026",
    readTime: "5 min read",
    banner: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    excerpt: "Master primer annealing temperatures, MgCl2 optimization, and PCR additive hacks for difficult GC-rich templates.",
    content: `
      ### Systematic Polymerase Chain Reaction Diagnostics
      PCR failures are a common hurdle in molecular biology labs. Here is a decision matrix to fix gel electrophoresis anomalies.

      #### Troubleshooting Guide
      - **Problem: Primer Dimers (small bands under 100 bp)**
        - *Fix*: Raise annealing temperature by 2°C; decrease primer concentration to 0.2 µM.
      - **Problem: Smearing across the gel lane**
        - *Fix*: Reduce template DNA input; lower total PCR cycle count from 35 to 28-30 cycles.
      - **Problem: No Amplification Band**
        - *Fix*: Test a gradient annealing PCR (+/- 5°C of Tm); add 5% DMSO or Betaine for GC-rich DNA.
    `,
    tags: ["PCR", "Molecular Biology", "Lab Protocols", "Troubleshooting"]
  },
  {
    id: "single-cell-rna-seq-genomics-trends",
    title: "Single-Cell RNA Sequencing (scRNA-seq): Unraveling Cellular Heterogeneity in Cancer",
    category: "Genomics",
    author: "Dr. Meera Kulkarni",
    authorRole: "Genomics Lead, NCBS",
    date: "January 29, 2026",
    readTime: "9 min read",
    banner: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    excerpt: "How microfluidic droplet-based single-cell transcriptomics is unveiling rare immune cell populations and chemotherapy resistance mechanisms.",
    content: `
      ### Bulk RNA-seq vs. Single-Cell Resolution
      Traditional bulk transcriptomics averages gene expression across thousands of cells, masking vital subpopulation dynamics. Single-cell RNA-seq captures individual cell transcriptomes.

      #### Data Analysis Pipeline (Seurat & Scanpy)
      1. **Quality Control**: Filtering dead cells with high mitochondrial read percentages.
      2. **Dimensionality Reduction**: PCA, UMAP, and t-SNE clustering.
      3. **Differential Gene Expression**: Identifying cell-type marker genes and novel cell states.
    `,
    tags: ["Genomics", "scRNA-seq", "Cancer Research", "Bioinformatics"]
  },
  {
    id: "industrial-fermentation-bioprocess-scaleup",
    title: "Bioprocess Engineering Scale-Up: From 5L Benchtop Fermenters to 50,000L Bioreactors",
    category: "Biotech Trends",
    author: "Siddharth Gupta",
    authorRole: "Bioprocess Chemical Engineer",
    date: "January 15, 2026",
    readTime: "7 min read",
    banner: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    excerpt: "Key parameters for maintaining volumetric mass transfer coefficients (kLa), dissolved oxygen control, and shear stress limits.",
    content: `
      ### The Engineering Challenge of Bioprocess Scaling
      Transitioning a microbial fermentation process from lab-scale shaker flasks to commercial pilot fermenters requires rigorous fluid dynamics balance.

      #### Essential Scale-Up Criteria
      - **Constant kLa (Mass Transfer Coefficient)**: Ensuring adequate oxygen transfer to high-density bacterial cultures.
      - **Impeller Tip Speed & Shear Stress**: Preventing cell lysis in delicate mammalian cell cultures while maintaining uniform mixing.
      - **Heat Dissipation**: Managing metabolic heat generation in high-titer bioprocesses.
    `,
    tags: ["Bioprocess", "Fermentation", "Industrial Biotech", "Scale Up"]
  }
];

const CATEGORIES = ["All", "Biotech Trends", "Career & Research", "Bioinformatics", "Lab Techniques", "Genomics"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <PublicNavbarFooter>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* HERO SECTION */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#E0F2FE", color: "#0369A1", padding: "6px 16px", borderRadius: 100, fontSize: "0.82rem", fontWeight: 700, marginBottom: 16 }}>
            <span>BioConnect Science Journal</span>
          </div>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 800, color: "#102A30", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Biotechnology Trends, Lab Protocols & Research Insights
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#64748B", maxWidth: 720, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Curated articles written by researchers, bioinformatics engineers, and academic advisors across India&apos;s leading biotech institutions.
          </p>

          {/* Search Box */}
          <div style={{ maxWidth: 580, margin: "0 auto", position: "relative" }}>
            <input
              type="text"
              placeholder="Search articles by topic, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "15px 22px",
                borderRadius: 100,
                border: "1.5px solid #CBD5E1",
                fontSize: "0.92rem",
                outline: "none",
                background: "#FFFFFF",
                color: "#102A30",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)"
              }}
            />
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 44 }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: isSelected ? "#2AB4B4" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#102A30",
                  border: isSelected ? "none" : "1px solid #E2EEF0",
                  padding: "8px 18px",
                  borderRadius: 100,
                  fontSize: "0.85rem",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 4px 12px rgba(42,180,180,0.25)" : "0 2px 4px rgba(0,0,0,0.02)",
                  transition: "all 0.2s ease"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* FEATURED BANNER POST */}
        {!searchQuery && selectedCategory === "All" && featuredPost && (
          <div
            onClick={() => setActiveArticle(featuredPost)}
            style={{
              background: "linear-gradient(135deg, #102A30 0%, #1A4A55 100%)",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 48,
              boxShadow: "0 10px 30px rgba(16,42,48,0.15)",
              cursor: "pointer",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              alignItems: "center"
            }}
          >
            <div style={{ padding: "40px 36px", color: "#FFFFFF" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                <span style={{ background: "#2AB4B4", color: "#FFFFFF", padding: "4px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>
                  FEATURED
                </span>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>• {featuredPost.readTime}</span>
              </div>

              <h2 style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1.3, marginBottom: 14, color: "#FFFFFF" }}>
                {featuredPost.title}
              </h2>

              <p style={{ fontSize: "0.95rem", color: "#CBD5E1", lineHeight: 1.6, marginBottom: 24 }}>
                {featuredPost.excerpt}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{featuredPost.author}</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}>{featuredPost.authorRole} • {featuredPost.date}</div>
                </div>

                <button style={{ background: "#FFFFFF", color: "#102A30", border: "none", padding: "9px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.85rem" }}>
                  Read Article →
                </button>
              </div>
            </div>

            <div style={{ height: "100%", minHeight: 280, position: "relative" }}>
              <img
                src={featuredPost.banner}
                alt={featuredPost.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        )}

        {/* ARTICLES GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 24 }}>
          {filteredPosts.map((post) => {
            const isBookmarked = bookmarkedIds.includes(post.id);
            return (
              <div
                key={post.id}
                onClick={() => setActiveArticle(post)}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  border: "1px solid #E2EEF0",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                }}
              >
                <div>
                  <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
                    <img
                      src={post.banner}
                      alt={post.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <span style={{ position: "absolute", top: 12, left: 12, background: "#102A30", color: "#FFFFFF", padding: "3px 9px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 800 }}>
                      {post.category}
                    </span>
                    <button
                      onClick={(e) => toggleBookmark(post.id, e)}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "rgba(255,255,255,0.92)",
                        border: "none",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill={isBookmarked ? "#2AB4B4" : "none"} stroke={isBookmarked ? "#2AB4B4" : "#102A30"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>

                  <div style={{ padding: 22 }}>
                    <div style={{ fontSize: "0.76rem", color: "#64748B", marginBottom: 8 }}>
                      {post.date} • {post.readTime}
                    </div>

                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#102A30", marginBottom: 8, lineHeight: 1.4 }}>
                      {post.title}
                    </h3>

                    <p style={{ fontSize: "0.86rem", color: "#64748B", lineHeight: 1.55, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {post.excerpt}
                    </p>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {post.tags.map((tag) => (
                        <span key={tag} style={{ background: "#F1F5F9", color: "#475569", fontSize: "0.7rem", fontWeight: 600, padding: "3px 8px", borderRadius: 4 }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ padding: "14px 22px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#102A30" }}>{post.author}</div>
                    <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>{post.authorRole}</div>
                  </div>
                  <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "#2AB4B4" }}>
                    Read Article →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div style={{ background: "#FFFFFF", borderRadius: 18, padding: 48, textAlign: "center", border: "1px solid #E2EEF0", color: "#64748B" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#102A30", marginBottom: 6 }}>No matching articles found</h3>
            <p style={{ fontSize: "0.9rem" }}>Try adjusting your search query or selected category.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              style={{ marginTop: 14, background: "#2AB4B4", color: "#FFF", border: "none", padding: "9px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.88rem" }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10, 25, 30, 0.82)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 20, width: "100%", maxWidth: 840, maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "18px 24px", background: "#102A30", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ background: "#2AB4B4", padding: "3px 9px", borderRadius: 4, fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>
                  {activeArticle.category}
                </span>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>• {activeArticle.readTime}</span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#FFF", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: "1rem" }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto", color: "#102A30" }}>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1.3, marginBottom: 14 }}>
                {activeArticle.title}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 18, borderBottom: "1px solid #E2EEF0" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2AB4B4", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem" }}>
                  {activeArticle.author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{activeArticle.author}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748B" }}>{activeArticle.authorRole} • Published on {activeArticle.date}</div>
                </div>
              </div>

              <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 24, maxHeight: 300 }}>
                <img src={activeArticle.banner} alt={activeArticle.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>

              <div style={{ fontSize: "0.98rem", lineHeight: 1.75, color: "#334155" }}>
                {activeArticle.content.split("\n\n").map((paragraph, idx) => {
                  if (paragraph.trim().startsWith("###")) {
                    return <h3 key={idx} style={{ fontSize: "1.3rem", fontWeight: 800, color: "#102A30", marginTop: 22, marginBottom: 10 }}>{paragraph.replace("###", "").trim()}</h3>;
                  }
                  if (paragraph.trim().startsWith("####")) {
                    return <h4 key={idx} style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1A4A55", marginTop: 16, marginBottom: 6 }}>{paragraph.replace("####", "").trim()}</h4>;
                  }
                  return <p key={idx} style={{ marginBottom: 14 }}>{paragraph.trim()}</p>;
                })}
              </div>

              <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #E2EEF0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {activeArticle.tags.map((tag) => (
                    <span key={tag} style={{ background: "#E0F2FE", color: "#0369A1", fontSize: "0.78rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => alert("Article link copied to clipboard!")}
                  style={{ background: "#F1F5F9", color: "#102A30", border: "1px solid #CBD5E1", padding: "7px 16px", borderRadius: 8, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
                >
                  Share Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PublicNavbarFooter>
  );
}
