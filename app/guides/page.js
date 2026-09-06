"use client";

import { useState } from "react";
import PublicNavbarFooter from "@/components/PublicNavbarFooter";

const GUIDES_DATA = [
  {
    id: "lab-safety-biosafety-levels-guide",
    title: "Lab Safety & Biosafety Protocol Guide (BSL-1 to BSL-3)",
    category: "Lab Safety & Protocols",
    level: "Beginner",
    readTime: "12 min read",
    badgeColor: "#DCFCE7",
    textColor: "#166534",
    summary: "Essential safety protocols for handling hazardous chemicals, biological agents, autoclaves, and PPE standards in academic and industrial laboratories.",
    chapters: [
      {
        title: "1. Personal Protective Equipment (PPE) Essentials",
        content: "Always wear long lab coats (100% cotton preferred), chemical splash goggles, nitrile gloves, and closed-toe footwear. Change gloves immediately after accidental contact with ethidium bromide, phenol, or acrylamide."
      },
      {
        title: "2. Biosafety Levels Overview",
        content: "BSL-1: Non-pathogenic E. coli strains. BSL-2: Human pathogens like Staphylococcus aureus (requires Laminar Flow Hood). BSL-3: Airborne pathogens like Mycobacterium tuberculosis (requires negative pressure & HEPA filtration)."
      },
      {
        title: "3. Chemical Spill & Autoclave Protocols",
        content: "Autoclave liquids at 121°C for 20 minutes under 15 psi pressure. Never autoclave volatile solvents, strong acids, or bleach mixtures."
      }
    ],
    checklist: [
      "Confirm eyewash station and emergency shower locations",
      "Inspect autoclave pressure gauge and biohazard indicator tape",
      "Verify Laminar Flow Hood airflow velocity prior to cell culture",
      "Label all chemical bottles with chemical name, concentration, and date"
    ]
  },
  {
    id: "how-to-write-biotech-research-paper",
    title: "How to Write & Publish a High-Impact Biotech Research Paper",
    category: "Academic & Research",
    level: "Intermediate",
    readTime: "15 min read",
    badgeColor: "#E0F2FE",
    textColor: "#0369A1",
    summary: "A step-by-step roadmap to structuring your abstract, literature review, methodology, figure panels, and navigating journal peer review.",
    chapters: [
      {
        title: "1. Structuring the Abstract & Title",
        content: "Write a 200-250 word structured abstract answering: What is the biological gap? What was your methodology? What is the main quantitative finding? Why does it matter for the field?"
      },
      {
        title: "2. Designing Publication-Quality Figures",
        content: "Export vector graphs at 300+ DPI. Label gel lanes clearly with molecular weight markers (ladder). Include scale bars on all microscopic images."
      },
      {
        title: "3. Responding to Reviewer Comments",
        content: "Be polite, objective, and address every point line-by-line. Highlight revised manuscript text in color and provide raw assay data in supplementary files."
      }
    ],
    checklist: [
      "Format references using journal CSL style (e.g. Nature, Elsevier, ACS)",
      "Run plagiarism scan using Turnitin / iThenticate prior to submission",
      "Prepare high-resolution supplementary tables & raw gel images",
      "Draft author contribution statements (CRediT taxonomy)"
    ]
  },
  {
    id: "ncbi-blast-pymol-bioinformatics-guide",
    title: "Getting Started with BLAST, PyMOL & NCBI GenBank",
    category: "Bioinformatics",
    level: "Beginner",
    readTime: "10 min read",
    badgeColor: "#F3E8FF",
    textColor: "#6B21A8",
    summary: "Learn how to perform nucleotide/protein sequence alignments, extract FASTA sequences from GenBank, and render 3D macromolecular structures.",
    chapters: [
      {
        title: "1. BLAST Alignment Strategy",
        content: "Use BLASTn for nucleotide sequences and BLASTp for protein sequences. Check E-value (closer to 0 indicates high significance) and Query Coverage (>90% ideal)."
      },
      {
        title: "2. Downloading PDB Files & PyMOL Rendering",
        content: "Fetch 4-character PDB IDs from rscb.org. In PyMOL, use commands `show cartoon`, `color secondary`, `preset publication`, and `ray 2400, 1800` for crisp images."
      },
      {
        title: "3. Multiple Sequence Alignment (Clustal Omega)",
        content: "Align evolutionary conserved catalytic domains across species to identify active site amino acid residues."
      }
    ],
    checklist: [
      "Master FASTA file format header structure (>seq_name)",
      "Understand identity % vs e-value thresholds in BLAST",
      "Learn basic PyMOL commands: hide spheres, show cartoon, color by chain",
      "Save PyMOL session (.pse) files for reproducible molecular graphics"
    ]
  },
  {
    id: "securing-biotech-internships-india-guide",
    title: "A Student Guide to Securing CSIR, DBT & Biotech Internships",
    category: "Career & Fellowships",
    level: "Beginner",
    readTime: "8 min read",
    badgeColor: "#FEF3C7",
    textColor: "#92400E",
    summary: "Proven strategies for crafting cold emails, building a research CV, preparing for technical interviews, and applying for government fellowships.",
    chapters: [
      {
        title: "1. Key Government Fellowships in India",
        content: "Indian Academy of Sciences (IASc-INSA-NASI) Summer Fellowship, DBT-BITP, CSIR-SPARK, and ICMR Summer Fellowships. Applications open between October and December."
      },
      {
        title: "2. Perfecting the Cold Email to Professors",
        content: "Subject line: 'Application for Summer Internship - [Your Name] - [University]'. Paragraph 1: Who you are. Paragraph 2: Why their research fascinates you. Paragraph 3: Your technical skills."
      },
      {
        title: "3. Technical Interview Preparation",
        content: "Be prepared to explain your past lab projects, standard buffer calculations (Molarity, Normality, C1V1=C2V2), and basic instrumentation principles."
      }
    ],
    checklist: [
      "Prepare a 1-page academic CV showcasing lab skills & instrumentation",
      "Draft a customized Statement of Purpose (SOP) under 500 words",
      "Obtain 2 recommendation letters from university faculty",
      "Follow up politely 7 days after sending cold emails"
    ]
  },
  {
    id: "ngs-data-analysis-qc-pipeline-guide",
    title: "Next-Generation Sequencing (NGS) Data Analysis Pipeline",
    category: "Bioinformatics",
    level: "Advanced",
    readTime: "18 min read",
    badgeColor: "#F3E8FF",
    textColor: "#6B21A8",
    summary: "A practical command-line guide to FastQC, Trimmomatic, BWA-MEM, Samtools, and variant calling with GATK.",
    chapters: [
      {
        title: "1. Quality Control with FastQC & MultiQC",
        content: "Inspect Phred quality scores (Q30 = 99.9% accuracy), adapter contamination, and per-base sequence content."
      },
      {
        title: "2. Sequence Read Alignment (BWA-MEM & Bowtie2)",
        content: "Align paired-end FASTQ reads to human reference genome (GRCh38) using `bwa mem -t 8 hg38.fa read1.fq read2.fq | samtools view -bS - > aligned.bam`."
      },
      {
        title: "3. Variant Calling & Annotation (GATK / VEP)",
        content: "Mark duplicates, recalibrate base quality scores, and call single nucleotide variants (SNVs) and indels into a VCF file."
      }
    ],
    checklist: [
      "Run FastQC to verify Phred quality scores > 30",
      "Trim low-quality ends and adapter sequences with Trimmomatic",
      "Index BAM files using `samtools index` prior to visualization in IGV",
      "Annotate variant consequences using Ensembl VEP or SnpEff"
    ]
  },
  {
    id: "bioprocess-scale-up-fermentation-guide",
    title: "Bioprocess Engineering Scale-Up: Fundamental Calculations & Protocols",
    category: "Lab Safety & Protocols",
    level: "Intermediate",
    readTime: "14 min read",
    badgeColor: "#DCFCE7",
    textColor: "#166534",
    summary: "Master mass balance, volumetric oxygen transfer coefficient (kLa), aeration rates, and impeller mixing dynamics.",
    chapters: [
      {
        title: "1. Mass & Energy Balance in Bioreactors",
        content: "Calculate specific growth rate (mu), biomass yield coefficient (Y_x/s), and product yield under fed-batch conditions."
      },
      {
        title: "2. Dissolved Oxygen (DO) & kLa Determination",
        content: "Use the dynamic gassing-out method to measure kLa values and adjust sparger airflow (vvm) to prevent hypoxia."
      },
      {
        title: "3. Sterilization Kinetics & Del Factor",
        content: "Compute the Del Factor (nabla = ln(N0/Nt)) to determine required holding time at 121°C for complete nutrient medium sterility."
      }
    ],
    checklist: [
      "Calibrate pH and dissolved oxygen (DO) probes prior to autoclaving",
      "Perform pressure hold test to check bioreactor vessel seal integrity",
      "Set up feed pumps and antifoam addition loops",
      "Record OD600 growth curves at 2-hour intervals"
    ]
  }
];

const CATEGORIES = ["All Guides", "Lab Safety & Protocols", "Academic & Research", "Bioinformatics", "Career & Fellowships"];

export default function GuidesPage() {
  const [selectedCat, setSelectedCat] = useState("All Guides");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGuide, setActiveGuide] = useState(null);
  const [completedGuideIds, setCompletedGuideIds] = useState([]);

  const filteredGuides = GUIDES_DATA.filter((guide) => {
    const matchesCat = selectedCat === "All Guides" || guide.category === selectedCat;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      guide.title.toLowerCase().includes(q) ||
      guide.summary.toLowerCase().includes(q) ||
      guide.chapters.some((c) => c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const toggleComplete = (id) => {
    setCompletedGuideIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <PublicNavbarFooter>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* HERO SECTION */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#E0F2FE", color: "#0369A1", padding: "6px 16px", borderRadius: 100, fontSize: "0.82rem", fontWeight: 700, marginBottom: 16 }}>
            <span>Technical Reference Library</span>
          </div>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 800, color: "#102A30", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Student & Researcher Field Guides
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#64748B", maxWidth: 720, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Structured, step-by-step documentation for lab safety protocols, manuscript drafting, bioinformatics pipelines, and fellowship applications.
          </p>

          {/* Search Box */}
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Search guides by title, protocol, or skill..."
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

        {/* CATEGORY TABS */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 44 }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
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

        {/* GUIDES GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 24 }}>
          {filteredGuides.map((guide) => {
            const isDone = completedGuideIds.includes(guide.id);
            return (
              <div
                key={guide.id}
                onClick={() => setActiveGuide(guide)}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  border: "1px solid #E2EEF0",
                  padding: 26,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ background: guide.badgeColor, color: guide.textColor, padding: "3px 10px", borderRadius: 4, fontSize: "0.72rem", fontWeight: 800 }}>
                      {guide.category}
                    </span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: "0.76rem", color: "#64748B", fontWeight: 600 }}>{guide.level}</span>
                      <span style={{ fontSize: "0.76rem", color: "#94A3B8" }}>• {guide.readTime}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "1.18rem", fontWeight: 800, color: "#102A30", marginBottom: 10, lineHeight: 1.4 }}>
                    {guide.title}
                  </h3>

                  <p style={{ fontSize: "0.86rem", color: "#64748B", lineHeight: 1.55, marginBottom: 18 }}>
                    {guide.summary}
                  </p>

                  <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 14px", marginBottom: 18, border: "1px solid #F1F5F9" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 4 }}>
                      Chapters Overview ({guide.chapters.length})
                    </div>
                    {guide.chapters.map((ch, idx) => (
                      <div key={idx} style={{ fontSize: "0.8rem", color: "#102A30", fontWeight: 600, padding: "2px 0" }}>
                        • {ch.title}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #F1F5F9" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(guide.id);
                    }}
                    style={{
                      background: isDone ? "#DCFCE7" : "#F1F5F9",
                      color: isDone ? "#166534" : "#475569",
                      border: "none",
                      padding: "5px 12px",
                      borderRadius: 6,
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {isDone ? "Completed" : "Mark Complete"}
                  </button>

                  <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "#2AB4B4" }}>
                    Open Guide →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredGuides.length === 0 && (
          <div style={{ background: "#FFFFFF", borderRadius: 18, padding: 48, textAlign: "center", border: "1px solid #E2EEF0", color: "#64748B" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#102A30", marginBottom: 6 }}>No matching guides found</h3>
            <p style={{ fontSize: "0.9rem" }}>Try searching for a different protocol or topic.</p>
            <button
              onClick={() => { setSelectedCat("All Guides"); setSearchQuery(""); }}
              style={{ marginTop: 14, background: "#2AB4B4", color: "#FFF", border: "none", padding: "9px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.88rem" }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* INTERACTIVE GUIDE READER MODAL */}
      {activeGuide && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10, 25, 30, 0.82)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 20, width: "100%", maxWidth: 840, maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "18px 24px", background: "#102A30", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ background: activeGuide.badgeColor, color: activeGuide.textColor, padding: "3px 9px", borderRadius: 4, fontSize: "0.72rem", fontWeight: 800 }}>
                  {activeGuide.category}
                </span>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>• {activeGuide.readTime}</span>
              </div>
              <button
                onClick={() => setActiveGuide(null)}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#FFF", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: "1rem" }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto", color: "#102A30" }}>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1.3, marginBottom: 10 }}>
                {activeGuide.title}
              </h1>
              <p style={{ fontSize: "0.95rem", color: "#64748B", marginBottom: 24, lineHeight: 1.6 }}>
                {activeGuide.summary}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
                {activeGuide.chapters.map((ch, idx) => (
                  <div key={idx} style={{ background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2EEF0", padding: 20 }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#102A30", marginBottom: 8 }}>
                      {ch.title}
                    </h3>
                    <p style={{ fontSize: "0.92rem", color: "#334155", lineHeight: 1.65, margin: 0 }}>
                      {ch.content}
                    </p>
                  </div>
                ))}
              </div>

              {activeGuide.checklist && (
                <div style={{ background: "#E0F2FE", borderRadius: 14, padding: 20, border: "1px solid #BAE6FD" }}>
                  <h4 style={{ fontSize: "0.98rem", fontWeight: 800, color: "#0369A1", marginBottom: 12 }}>
                    Guide Protocol Checklist
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {activeGuide.checklist.map((item, idx) => (
                      <label key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", color: "#0F172A", cursor: "pointer" }}>
                        <input type="checkbox" style={{ width: 16, height: 16, accentColor: "#0284C7" }} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "18px 24px", background: "#F8FAFC", borderTop: "1px solid #E2EEF0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => toggleComplete(activeGuide.id)}
                style={{
                  background: completedGuideIds.includes(activeGuide.id) ? "#DCFCE7" : "#102A30",
                  color: completedGuideIds.includes(activeGuide.id) ? "#166534" : "#FFFFFF",
                  border: "none",
                  padding: "9px 18px",
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {completedGuideIds.includes(activeGuide.id) ? "Completed" : "Mark as Completed"}
              </button>

              <button
                onClick={() => alert("Guide PDF checklist downloaded!")}
                style={{ background: "#2AB4B4", color: "#FFFFFF", border: "none", padding: "9px 18px", borderRadius: 8, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Download Checklist
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicNavbarFooter>
  );
}
