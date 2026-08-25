"use client";

import { useState, useEffect } from "react";

const DAILY_BIO_CHALLENGES = [
  {
    id: 1,
    question: "What type of DNA overhang is produced by the EcoRI restriction enzyme?",
    options: ["5' Sticky", "3' Sticky", "Blunt End"],
    correct: "5' Sticky",
    category: "Molecular Biology"
  },
  {
    id: 2,
    question: "Which co-factor is strictly required by Taq DNA Polymerase during PCR amplification?",
    options: ["Mg2+", "Zn2+", "Fe2+"],
    correct: "Mg2+",
    category: "PCR & Enzymology"
  },
  {
    id: 3,
    question: "What guide RNA structure directs Cas9 to target DNA in the CRISPR-Cas9 system?",
    options: ["sgRNA", "tRNA", "miRNA"],
    correct: "sgRNA",
    category: "CRISPR & Gene Editing"
  },
  {
    id: 4,
    question: "Which chemical agent is commonly used to induce the lac operon in E. coli expression systems?",
    options: ["IPTG", "X-Gal", "Ampicillin"],
    correct: "IPTG",
    category: "Recombinant DNA"
  },
  {
    id: 5,
    question: "What is the primary function of DpnI enzyme in site-directed mutagenesis?",
    options: ["Digests methylated template DNA", "Ligates vector ends", "Synthesizes cDNA"],
    correct: "Digests methylated template DNA",
    category: "Gene Mutagenesis"
  },
  {
    id: 6,
    question: "Which blotting technique is used to detect specific RNA molecules in a sample?",
    options: ["Northern Blot", "Southern Blot", "Western Blot"],
    correct: "Northern Blot",
    category: "Molecular Diagnostics"
  },
  {
    id: 7,
    question: "What type of bond connects adjacent amino acids in a primary protein chain?",
    options: ["Peptide Bond", "Phosphodiester Bond", "Glycosidic Bond"],
    correct: "Peptide Bond",
    category: "Biochemistry"
  },
  {
    id: 8,
    question: "Which antibody isotype is the first to be secreted during a primary immune response?",
    options: ["IgM", "IgG", "IgA"],
    correct: "IgM",
    category: "Immunology"
  },
  {
    id: 9,
    question: "What is the typical absorbance ratio (A260/A280) indicating pure, contaminant-free DNA?",
    options: ["1.8 - 2.0", "1.0 - 1.2", "2.4 - 2.6"],
    correct: "1.8 - 2.0",
    category: "Biophysical Techniques"
  },
  {
    id: 10,
    question: "Which enzyme resolves supercoiling ahead of the replication fork during bacterial DNA replication?",
    options: ["DNA Topoisomerase / Gyrase", "DNA Helicase", "DNA Primase"],
    correct: "DNA Topoisomerase / Gyrase",
    category: "Genomics"
  },
  {
    id: 11,
    question: "What is the role of beta-mercaptoethanol (BME) in SDS-PAGE sample preparation?",
    options: ["Reduces disulfide bonds", "Denatures cell membranes", "Stains proteins blue"],
    correct: "Reduces disulfide bonds",
    category: "Protein Analytics"
  },
  {
    id: 12,
    question: "Which vector component ensures that only host bacteria containing the plasmid survive on selective media?",
    options: ["Antibiotic Resistance Gene", "Multiple Cloning Site", "Origin of Replication"],
    correct: "Antibiotic Resistance Gene",
    category: "Cloning Vectors"
  },
  {
    id: 13,
    question: "Which chromatographic method separates proteins strictly on the basis of molecular size?",
    options: ["Size-Exclusion / Gel Filtration", "Ion-Exchange", "Affinity Chromatography"],
    correct: "Size-Exclusion / Gel Filtration",
    category: "Bioprocess Engineering"
  },
  {
    id: 14,
    question: "What is the main role of reverse transcriptase in molecular biotechnology?",
    options: ["Synthesizes cDNA from RNA", "Transcribes RNA from DNA", "Cuts double-stranded DNA"],
    correct: "Synthesizes cDNA from RNA",
    category: "Enzymology"
  },
  {
    id: 15,
    question: "Which amino acid residue acts as an alpha-helix breaker due to its rigid cyclic structure?",
    options: ["Proline", "Alanine", "Leucine"],
    correct: "Proline",
    category: "Structural Biology"
  },
  {
    id: 16,
    question: "Which fluorescence microscopy parameter determines the smallest distance between two distinguishable points?",
    options: ["Resolution Limit", "Magnification Power", "Contrast Ratio"],
    correct: "Resolution Limit",
    category: "Cell Imaging"
  },
  {
    id: 17,
    question: "What type of inhibition occurs when an inhibitor binds only to the enzyme-substrate (ES) complex?",
    options: ["Uncompetitive Inhibition", "Competitive Inhibition", "Non-competitive Inhibition"],
    correct: "Uncompetitive Inhibition",
    category: "Enzyme Kinetics"
  },
  {
    id: 18,
    question: "In qPCR, what does a lower threshold cycle (Ct) value signify about target gene expression?",
    options: ["Higher initial copy number", "Lower initial copy number", "Enzyme inhibition"],
    correct: "Higher initial copy number",
    category: "Quantitative PCR"
  },
  {
    id: 19,
    question: "Which cell death pathway is non-inflammatory and characterized by cellular shrinkage and apoptotic bodies?",
    options: ["Apoptosis", "Necrosis", "Pyroptosis"],
    correct: "Apoptosis",
    category: "Cell Biology"
  },
  {
    id: 20,
    question: "What is the primary function of the poly-A tail on eukaryotic mRNA?",
    options: ["Enhances mRNA stability & export", "Codes for amino acids", "Initiates transcription"],
    correct: "Enhances mRNA stability & export",
    category: "RNA Biology"
  },
  {
    id: 21,
    question: "Which tag sequence is widely fused to recombinant proteins for Nickel (Ni-NTA) affinity purification?",
    options: ["His-Tag (6xHis)", "FLAG-Tag", "GST-Tag"],
    correct: "His-Tag (6xHis)",
    category: "Protein Purification"
  },
  {
    id: 22,
    question: "What is the term for bacteria that are capable of taking up foreign extracellular DNA from their environment?",
    options: ["Competent Cells", "Lysogenic Cells", "Transformed Mutants"],
    correct: "Competent Cells",
    category: "Microbiology"
  },
  {
    id: 23,
    question: "Which metabolic pathway converts glucose into 2 pyruvate molecules yielding 2 net ATP in the cytosol?",
    options: ["Glycolysis", "Citric Acid Cycle", "Pentose Phosphate Pathway"],
    correct: "Glycolysis",
    category: "Metabolism"
  },
  {
    id: 24,
    question: "What is the PAM sequence required by SpCas9 prior to double-stranded DNA cleavage?",
    options: ["5'-NGG-3'", "5'-TATA-3'", "5'-AATAAA-3'"],
    correct: "5'-NGG-3'",
    category: "CRISPR Tech"
  },
  {
    id: 25,
    question: "Which hybridization method is used to map protein-DNA interactions across the genome?",
    options: ["ChIP-seq", "Western Blot", "MALDI-TOF"],
    correct: "ChIP-seq",
    category: "Epigenomics"
  },
  {
    id: 26,
    question: "What is the main function of loading dye (e.g. bromophenol blue) in agarose gel electrophoresis?",
    options: ["Tracks migration front & adds density", "Stains double-stranded DNA", "Denatures DNA strands"],
    correct: "Tracks migration front & adds density",
    category: "Electrophoresis"
  },
  {
    id: 27,
    question: "Which cell line derived from human cervical cancer is the oldest and most widely used immortalized human cell line?",
    options: ["HeLa", "HEK293", "CHO"],
    correct: "HeLa",
    category: "Cell Culture"
  },
  {
    id: 28,
    question: "What does a spectrophotometer absorbance reading at A260 measure in molecular biology samples?",
    options: ["Nucleic Acid concentration", "Protein concentration", "Bacterial cell turbidity"],
    correct: "Nucleic Acid concentration",
    category: "Spectrophotometry"
  },
  {
    id: 29,
    question: "Which organelle is responsible for oxidative phosphorylation and generating cellular ATP in eukaryotes?",
    options: ["Mitochondria", "Endoplasmic Reticulum", "Golgi Apparatus"],
    correct: "Mitochondria",
    category: "Organelle Biology"
  },
  {
    id: 30,
    question: "What is the primary role of DNA Ligase in molecular cloning workflows?",
    options: ["Joins 3'-OH and 5'-phosphate DNA ends", "Synthesizes RNA primers", "Cuts specific restriction sites"],
    correct: "Joins 3'-OH and 5'-phosphate DNA ends",
    category: "Molecular Cloning"
  },
  {
    id: 31,
    question: "Which single-cell technique allows high-dimensional protein analysis using heavy-metal isotope-tagged antibodies?",
    options: ["CyTOF (Mass Cytometry)", "Flow Cytometry (FACS)", "ELISA"],
    correct: "CyTOF (Mass Cytometry)",
    category: "Single-Cell Omics"
  }
];

export default function DailyBioChallenge() {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [expiresText, setExpiresText] = useState("Expires in 4h");
  const [streakDays, setStreakDays] = useState(4);
  const [dateKey, setDateKey] = useState("");

  useEffect(() => {
    const now = new Date();
    // Compute YYYY-MM-DD
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayKey = `${yyyy}-${mm}-${dd}`;
    setDateKey(todayKey);

    // Calculate day of year to pick today's question
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const challengeIndex = dayOfYear % DAILY_BIO_CHALLENGES.length;
    const todayChallenge = DAILY_BIO_CHALLENGES[challengeIndex];
    setCurrentChallenge(todayChallenge);

    // Calculate hours left until midnight
    const hoursLeft = 24 - now.getHours();
    setExpiresText(`Expires in ${hoursLeft}h`);

    // Load user's saved answer for today from localStorage
    try {
      const savedAnswer = localStorage.getItem(`daily_bio_challenge_${todayKey}`);
      if (savedAnswer) {
        setSelectedOpt(savedAnswer);
      }
      
      const savedStreak = localStorage.getItem("daily_bio_streak");
      if (savedStreak) {
        setStreakDays(parseInt(savedStreak, 10));
      }
    } catch (err) {
      console.error("LocalStorage read error:", err);
    }
  }, []);

  function handleSelectOption(opt) {
    if (!currentChallenge || !dateKey) return;
    setSelectedOpt(opt);

    try {
      localStorage.setItem(`daily_bio_challenge_${dateKey}`, opt);
      if (opt === currentChallenge.correct) {
        const newStreak = streakDays + 1;
        setStreakDays(newStreak);
        localStorage.setItem("daily_bio_streak", newStreak.toString());
      }
    } catch (err) {
      console.error("LocalStorage write error:", err);
    }
  }

  if (!currentChallenge) return null;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        fontFamily: "inherit"
      }}
    >
      <style>{`
        .challenge-opt-btn {
          padding: 10px 24px;
          border: 1.5px solid #E2EEF0;
          border-radius: 12px;
          background: #ffffff;
          font-size: 14px;
          font-weight: 600;
          color: #132D35;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease-in-out;
          outline: none;
        }
        .challenge-opt-btn:hover {
          border-color: #14B8A6 !important;
          color: #14B8A6 !important;
          background: #F0FCFB !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(20, 184, 166, 0.15);
        }
        .challenge-opt-btn.correct {
          border-color: #22C55E !important;
          color: #15803D !important;
          background: #F0FDF4 !important;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.18) !important;
        }
        .challenge-opt-btn.wrong {
          border-color: #EF4444 !important;
          color: #B91C1C !important;
          background: #FEF2F2 !important;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🎯</span>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#132D35" }}>
            Daily Bio-Challenge
          </span>
          <span
            style={{
              fontSize: "12px",
              background: "#FFF3E8",
              color: "#F97316",
              padding: "4px 12px",
              borderRadius: "100px",
              fontWeight: 700,
            }}
          >
            {expiresText}
          </span>
          <span
            style={{
              fontSize: "11px",
              background: "rgba(20,184,166,0.1)",
              color: "#14B8A6",
              padding: "3px 10px",
              borderRadius: "20px",
              fontWeight: 600,
            }}
          >
            {currentChallenge.category}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "15px", color: "#132D35", fontWeight: 800 }}>
            Current Streak 🔥 {streakDays} Days
          </span>
        </div>
      </div>

      {/* Question & Options */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#132D35", marginBottom: "16px" }}>
            {currentChallenge.question}
          </p>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            {currentChallenge.options.map((opt) => {
              const isSelected = selectedOpt === opt;
              const isCorrect = opt === currentChallenge.correct;
              let btnClass = "challenge-opt-btn";
              if (isSelected) {
                btnClass += isCorrect ? " correct" : " wrong";
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  className={btnClass}
                >
                  {opt} {isSelected && (isCorrect ? " ✓" : " ✕")}
                </button>
              );
            })}

            {selectedOpt && (
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: selectedOpt === currentChallenge.correct ? "#16A34A" : "#DC2626",
                  marginLeft: "6px"
                }}
              >
                {selectedOpt === currentChallenge.correct ? "🎉 Correct! +50 XP" : "❌ Try again!"}
              </span>
            )}
          </div>
        </div>

        {/* Streak Visualizer */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[1, 2, 3, 4, 5, 6, 7].map((d, i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: i < Math.min(streakDays, 7) ? "#14B8A6" : "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: i < Math.min(streakDays, 7) ? "#fff" : "#9CA3AF"
              }}
            >
              {i < Math.min(streakDays, 7) ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                d
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
