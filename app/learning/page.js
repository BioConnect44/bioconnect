"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";
import LiveStudentWidgets from "@/components/LiveStudentWidgets";

const SUBJECTS = [
  { id: "molecular-biology", name: "Molecular Biology", icon: "🧬", color: "#14B8A6" },
  { id: "biochemistry", name: "Biochemistry", icon: "⚗️", color: "#F97316" },
  { id: "microbiology", name: "Microbiology", icon: "🦠", color: "#EF4444" },
  { id: "genetics", name: "Genetics", icon: "🔬", color: "#8B5CF6" },
  { id: "bioinformatics", name: "Bioinformatics", icon: "💻", color: "#3B82F6" },
  { id: "bioprocess-engineering", name: "Bioprocess Engineering", icon: "🏭", color: "#EC4899" },
];

const CHALLENGES = {
  genetics: {
    title: "Molecular Biology & Genetics PYQs",
    subject: "Molecular Biology (GAT-B 2020-2024)",
    color: "#F97316",
    bg: "#FFF3E8",
    xp: 150,
    timeLimit: 900, // 15 mins
    questions: [
      {
        id: 1,
        question: "GAT-B 2020: The enzyme responsible for unwinding DNA during replication is:",
        options: ["DNA ligase", "Helicase", "Primase", "Topoisomerase"],
        correct: 1,
        explanation: "Helicase unwinds the double-stranded DNA helix by breaking hydrogen bonds between base pairs."
      },
      {
        id: 2,
        question: "GAT-B 2020: Okazaki fragments are formed during synthesis of:",
        options: ["Leading strand", "Lagging strand", "mRNA", "tRNA"],
        correct: 1,
        explanation: "Okazaki fragments are short DNA fragments synthesized discontinuously on the lagging strand during replication."
      },
      {
        id: 3,
        question: "GAT-B 2020: Which RNA carries amino acids to ribosome?",
        options: ["rRNA", "snRNA", "tRNA", "mRNA"],
        correct: 2,
        explanation: "tRNA (transfer RNA) carries specific amino acids to the ribosome during protein translation."
      },
      {
        id: 4,
        question: "GAT-B 2021: The start codon in mRNA is:",
        options: ["UAA", "AUG", "UAG", "UGA"],
        correct: 1,
        explanation: "AUG is the universal start codon in mRNA that codes for Methionine."
      },
      {
        id: 5,
        question: "GAT-B 2021: Which enzyme synthesizes RNA from DNA template?",
        options: ["DNA polymerase", "RNA polymerase", "Reverse transcriptase", "Ligase"],
        correct: 1,
        explanation: "RNA polymerase synthesizes RNA strands by transcribing DNA templates."
      },
      {
        id: 6,
        question: "GAT-B 2021: In eukaryotes, mRNA processing includes:",
        options: ["Splicing", "5' capping", "Polyadenylation", "All of the above"],
        correct: 3,
        explanation: "Eukaryotic pre-mRNA undergoes 5' capping, splicing (intron removal), and 3' polyadenylation to become mature mRNA."
      },
      {
        id: 7,
        question: "GAT-B 2022: The central dogma of molecular biology is:",
        options: ["Protein → RNA → DNA", "DNA → Protein → RNA", "DNA → RNA → Protein", "RNA → DNA → Protein"],
        correct: 2,
        explanation: "Central dogma describes the genetic information flow: DNA is transcribed into RNA, which is translated into Protein."
      },
      {
        id: 8,
        question: "GAT-B 2022: The operator region in lac operon functions as:",
        options: ["Binding site for ribosome", "Binding site for repressor protein", "Site of DNA replication", "Terminator sequence"],
        correct: 1,
        explanation: "The operator is a DNA sequence to which the lac repressor protein binds to inhibit transcription of structural genes."
      },
      {
        id: 9,
        question: "GAT-B 2022: Which enzyme joins Okazaki fragments?",
        options: ["Helicase", "Primase", "Ligase", "Gyrase"],
        correct: 2,
        explanation: "DNA ligase joins Okazaki fragments by creating phosphodiester bonds between adjacent sugar-phosphate backbones."
      },
      {
        id: 10,
        question: "GAT-B 2023: The process of synthesis of RNA from DNA is called:",
        options: ["Translation", "Replication", "Transcription", "Mutation"],
        correct: 2,
        explanation: "Transcription is the biological process of creating RNA from a DNA template."
      },
      {
        id: 11,
        question: "GAT-B 2023: Which of the following is NOT a stop codon?",
        options: ["UAA", "UAG", "UGA", "AUG"],
        correct: 3,
        explanation: "AUG is the start codon for translation (Methionine), whereas UAA, UAG, and UGA are stop codons."
      },
      {
        id: 12,
        question: "GAT-B 2023: Histone proteins are associated with:",
        options: ["Prokaryotic DNA only", "Eukaryotic chromatin", "Ribosomes", "Plasmids"],
        correct: 1,
        explanation: "Histones are basic proteins that package eukaryotic DNA into structural nucleosomes within chromatin."
      },
      {
        id: 13,
        question: "GAT-B 2024: DNA replication is described as semiconservative because:",
        options: ["One strand is completely new", "One parental and one new strand are present in daughter DNA", "DNA is synthesized only in one direction", "Replication occurs conservatively"],
        correct: 1,
        explanation: "Semiconservative replication means each newly formed double-stranded DNA contains one original parental strand and one newly synthesized strand."
      },
      {
        id: 14,
        question: "GAT-B 2024: Which RNA molecule forms the structural component of ribosome?",
        options: ["mRNA", "tRNA", "rRNA", "siRNA"],
        correct: 2,
        explanation: "rRNA (ribosomal RNA) combines with proteins to form the structural catalytic subunits of ribosomes."
      },
      {
        id: 15,
        question: "GAT-B 2024: Alternative splicing results in:",
        options: ["DNA replication", "Multiple proteins from one gene", "Protein degradation", "Mutation repair"],
        correct: 1,
        explanation: "Alternative splicing allows a single gene to encode multiple distinct protein isoforms by selecting different exon combinations."
      }
    ]
  },
  mock: {
    title: "Genetic Engineering PYQs",
    subject: "Genetic Engineering (GAT-B 2020-2024)",
    color: "#8B5CF6",
    bg: "#F3F0FF",
    xp: 150,
    timeLimit: 900, // 15 mins
    questions: [
      {
        id: 16,
        question: "GAT-B 2020: Restriction enzymes are also known as:",
        options: ["Ligases", "Molecular scissors", "Polymerases", "Primases"],
        correct: 1,
        explanation: "Restriction enzymes act as molecular scissors by cutting double-stranded DNA at specific recognition sequences."
      },
      {
        id: 17,
        question: "GAT-B 2020: Which enzyme synthesizes complementary DNA (cDNA)?",
        options: ["DNA polymerase", "RNA polymerase", "Reverse transcriptase", "Ligase"],
        correct: 2,
        explanation: "Reverse transcriptase synthesizes single-stranded cDNA using an RNA template."
      },
      {
        id: 18,
        question: "GAT-B 2020: Plasmids are commonly used as:",
        options: ["Antibiotics", "Vectors", "Enzymes", "Ribosomes"],
        correct: 1,
        explanation: "Plasmids serve as cloning vectors to carry foreign DNA fragments into host cells."
      },
      {
        id: 19,
        question: "GAT-B 2021: EcoRI recognizes the sequence:",
        options: ["5'-AAGCTT-3'", "5'-GGATCC-3'", "5'-GAATTC-3'", "5'-CTGCAG-3'"],
        correct: 2,
        explanation: "EcoRI restriction endonuclease specifically recognizes the palindromic hexanucleotide sequence 5'-GAATTC-3'."
      },
      {
        id: 20,
        question: "GAT-B 2021: Polymerase Chain Reaction (PCR) was invented by:",
        options: ["James Watson", "Kary Mullis", "Francis Crick", "Matthew Meselson"],
        correct: 1,
        explanation: "Kary Mullis invented the Polymerase Chain Reaction (PCR) in 1983, earning the Nobel Prize in Chemistry."
      },
      {
        id: 21,
        question: "GAT-B 2021: The enzyme used in PCR is:",
        options: ["DNA ligase", "Taq polymerase", "Reverse transcriptase", "Primase"],
        correct: 1,
        explanation: "Taq polymerase (isolated from Thermus aquaticus) is a thermostable enzyme used to extend DNA primers during thermal cycling."
      },
      {
        id: 22,
        question: "GAT-B 2022: The sticky ends generated by restriction enzymes are useful because they:",
        options: ["Destroy DNA", "Prevent ligation", "Facilitate joining of complementary DNA fragments", "Replicate DNA"],
        correct: 2,
        explanation: "Single-stranded sticky overhangs allow base-pairing with complementary cohesive ends, facilitating DNA ligation."
      },
      {
        id: 23,
        question: "GAT-B 2022: Southern blotting is used for detection of:",
        options: ["Protein", "DNA", "RNA", "Lipids"],
        correct: 1,
        explanation: "Southern blotting transfers DNA fragments to a membrane for hybridization and specific sequence detection."
      },
      {
        id: 24,
        question: "GAT-B 2022: A cloning vector must contain:",
        options: ["Origin of replication", "Selectable marker", "Cloning site", "All of the above"],
        correct: 3,
        explanation: "An effective cloning vector requires an ori, a selectable marker (e.g. antibiotic resistance), and multiple cloning sites (MCS)."
      },
      {
        id: 25,
        question: "GAT-B 2023: Transformation in bacteria refers to:",
        options: ["Viral infection", "Uptake of naked foreign DNA", "Cell division", "Protein synthesis"],
        correct: 1,
        explanation: "Bacterial transformation is the process by which a competent cell takes up extracellular, naked DNA from its surroundings."
      },
      {
        id: 26,
        question: "GAT-B 2023: Which blotting technique is used to detect RNA?",
        options: ["Southern blot", "Northern blot", "Western blot", "Eastern blot"],
        correct: 1,
        explanation: "Northern blotting is the molecular laboratory method used for RNA detection and expression analysis."
      },
      {
        id: 27,
        question: "GAT-B 2023: Reporter genes are used to:",
        options: ["Replicate plasmids", "Identify and quantify transformed cells", "Destroy vectors", "Synthesize structural proteins"],
        correct: 1,
        explanation: "Reporter genes (such as GFP or LacZ) indicate successful transformation and gene expression."
      },
      {
        id: 28,
        question: "GAT-B 2024: CRISPR-Cas9 is mainly used for:",
        options: ["DNA sequencing", "Genome editing", "Protein purification", "Southern blotting"],
        correct: 1,
        explanation: "CRISPR-Cas9 is an advanced RNA-guided technology used for targeted genome editing in living organisms."
      },
      {
        id: 29,
        question: "GAT-B 2024: Which of the following acts as selectable marker in plasmids?",
        options: ["Ampicillin resistance gene", "Helicase", "Primase", "Histone"],
        correct: 0,
        explanation: "Antibiotic resistance genes (like Ampicillin resistance - ampR) allow selection of host bacteria that successfully took up the plasmid."
      },
      {
        id: 30,
        question: "GAT-B 2024: The denaturation step in PCR generally occurs at:",
        options: ["37°C", "55°C", "72°C", "95°C"],
        correct: 3,
        explanation: "Denaturation of double-stranded DNA into single strands during PCR is performed at high temperatures, typically 94°C–98°C (95°C)."
      }
    ]
  }
};

/* ── Interactive Challenge / Quiz Modal ── */
function ChallengeModal({ challengeKey, onClose, supabase, profile, onXPUpdate }) {
  const challenge = CHALLENGES[challengeKey] || CHALLENGES.genetics;
  const questions = challenge.questions;
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [isFinished, setIsFinished] = useState(false);
  const [savingXP, setSavingXP] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, timeLeft]);

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function handleSelectOption(optIdx) {
    if (submitted[currentQ] || isFinished) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQ]: optIdx }));
  }

  function handleSubmitAnswer() {
    if (selectedAnswers[currentQ] === undefined) return;
    setSubmitted(prev => ({ ...prev, [currentQ]: true }));
  }

  async function handleFinish() {
    setIsFinished(true);
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount += 1;
      }
    });

    const earned = Math.round((correctCount / questions.length) * challenge.xp);
    setXpEarned(earned);

    if (profile?.id && earned > 0) {
      setSavingXP(true);
      try {
        const currentXP = profile.xp || 0;
        await supabase
          .from("profiles")
          .update({ xp: currentXP + earned })
          .eq("id", profile.id);
        if (onXPUpdate) onXPUpdate(currentXP + earned);
      } catch (e) {
        console.error("Error updating XP:", e);
      }
      setSavingXP(false);
    }
  }

  const q = questions[currentQ];
  const isSelected = selectedAnswers[currentQ] !== undefined;
  const isAnsSubmitted = submitted[currentQ];

  const totalCorrect = questions.reduce((acc, question, idx) => {
    return acc + (selectedAnswers[idx] === question.correct ? 1 : 0);
  }, 0);
  const scorePercent = Math.round((totalCorrect / questions.length) * 100);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(11, 25, 33, 0.85)",
      backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "24px",
        width: "100%", maxWidth: "840px",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        border: "1px solid #E2EEF0",
        display: "flex", flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 28px",
          borderBottom: "1.5px solid #E2EEF0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#F8FCFC",
          borderTopLeftRadius: "24px", borderTopRightRadius: "24px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "22px" }}>{challenge.subject === "Genetics" ? "🔬" : "⏱️"}</span>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#1B2B3A", margin: 0 }}>{challenge.title}</h3>
              <p style={{ fontSize: "12px", color: "#6B8A9A", margin: 0 }}>{challenge.subject} • {questions.length} MCQs</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {!isFinished && (
              <div style={{
                background: timeLeft < 120 ? "#FEF2F2" : "#F0F7F8",
                color: timeLeft < 120 ? "#EF4444" : "#1B2B3A",
                border: `1px solid ${timeLeft < 120 ? "#FCA5A5" : "#D0E5E8"}`,
                padding: "6px 14px", borderRadius: "100px",
                fontSize: "14px", fontWeight: 700,
                display: "flex", alignItems: "center", gap: "6px"
              }}>
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <div style={{
              background: challenge.bg, color: challenge.color,
              border: `1px solid ${challenge.color}30`,
              padding: "6px 14px", borderRadius: "100px",
              fontSize: "13px", fontWeight: 700
            }}>
              +{challenge.xp} XP
            </div>

            <button
              onClick={onClose}
              style={{
                background: "#E2EEF0", color: "#4A5568", border: "none",
                width: "36px", height: "36px", borderRadius: "50%",
                fontSize: "16px", fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!isFinished && (
          <div style={{ height: "6px", background: "#E2EEF0", width: "100%" }}>
            <div style={{
              height: "100%",
              width: `${((currentQ + 1) / questions.length) * 100}%`,
              background: challenge.color,
              transition: "width 0.3s ease"
            }} />
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: "32px 36px", flex: 1 }}>
          {!isFinished ? (
            <div>
              {/* Question Navigation Pills */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
                {questions.map((_, idx) => {
                  const isCurrent = idx === currentQ;
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCorrect = submitted[idx] && selectedAnswers[idx] === questions[idx].correct;
                  const isWrong = submitted[idx] && selectedAnswers[idx] !== questions[idx].correct;

                  let bg = "#F0F7F8";
                  let border = "#E2EEF0";
                  let color = "#6B8A9A";

                  if (isCurrent) {
                    bg = challenge.color;
                    color = "#ffffff";
                    border = challenge.color;
                  } else if (isCorrect) {
                    bg = "#DCFCE7";
                    color = "#15803D";
                    border = "#86EFAC";
                  } else if (isWrong) {
                    bg = "#FEE2E2";
                    color = "#B91C1C";
                    border = "#FCA5A5";
                  } else if (isAnswered) {
                    bg = "#E0F2FE";
                    color = "#0369A1";
                    border = "#7DD3FC";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQ(idx)}
                      style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: bg, border: `1.5px solid ${border}`, color: color,
                        fontWeight: 700, fontSize: "13px", cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Text */}
              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: challenge.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Question {currentQ + 1} of {questions.length}
                </span>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1B2B3A", marginTop: "8px", lineHeight: "1.4" }}>
                  {q.question}
                </h2>
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                {q.options.map((optText, optIdx) => {
                  const isSelectedOpt = selectedAnswers[currentQ] === optIdx;
                  const isCorrectOpt = q.correct === optIdx;
                  
                  let optBg = "#ffffff";
                  let optBorder = "#E2EEF0";
                  let optColor = "#1B2B3A";
                  let badgeBg = "#F0F7F8";
                  let badgeText = "#6B8A9A";

                  if (isAnsSubmitted) {
                    if (isCorrectOpt) {
                      optBg = "#F0FDF4";
                      optBorder = "#22C55E";
                      optColor = "#15803D";
                      badgeBg = "#22C55E";
                      badgeText = "#ffffff";
                    } else if (isSelectedOpt && !isCorrectOpt) {
                      optBg = "#FEF2F2";
                      optBorder = "#EF4444";
                      optColor = "#991B1B";
                      badgeBg = "#EF4444";
                      badgeText = "#ffffff";
                    }
                  } else if (isSelectedOpt) {
                    optBg = challenge.bg;
                    optBorder = challenge.color;
                    optColor = "#1B2B3A";
                    badgeBg = challenge.color;
                    badgeText = "#ffffff";
                  }

                  const letter = String.fromCharCode(65 + optIdx);

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "14px",
                        background: optBg,
                        border: `2px solid ${optBorder}`,
                        color: optColor,
                        cursor: isAnsSubmitted ? "default" : "pointer",
                        display: "flex", alignItems: "center", gap: "16px",
                        transition: "all 0.2s ease",
                        boxShadow: isSelectedOpt ? "0 4px 14px rgba(0,0,0,0.06)" : "none"
                      }}
                    >
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "8px",
                        background: badgeBg, color: badgeText,
                        fontWeight: 700, fontSize: "14px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {letter}
                      </div>
                      <span style={{ fontSize: "15px", fontWeight: 500, flex: 1, lineHeight: "1.4" }}>
                        {optText}
                      </span>
                      {isAnsSubmitted && isCorrectOpt && (
                        <span style={{ fontSize: "18px" }}>✅</span>
                      )}
                      {isAnsSubmitted && isSelectedOpt && !isCorrectOpt && (
                        <span style={{ fontSize: "18px" }}>❌</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Solution Explanation Box */}
              {isAnsSubmitted && (
                <div style={{
                  background: "#F0F9FF",
                  border: "1.5px solid #BAE6FD",
                  borderRadius: "14px",
                  padding: "18px 22px",
                  marginBottom: "28px"
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0284C7", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>💡 Explanation & Key Concept</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6", margin: 0 }}>
                    {q.explanation}
                  </p>
                </div>
              )}

              {/* Bottom Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px" }}>
                <button
                  disabled={currentQ === 0}
                  onClick={() => setCurrentQ(prev => prev - 1)}
                  style={{
                    background: "#F0F7F8", color: "#4A5568", border: "1px solid #D0E5E8",
                    padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                    cursor: currentQ === 0 ? "not-allowed" : "pointer", opacity: currentQ === 0 ? 0.4 : 1
                  }}
                >
                  ← Previous
                </button>

                <div style={{ display: "flex", gap: "12px" }}>
                  {!isAnsSubmitted ? (
                    <button
                      disabled={!isSelected}
                      onClick={handleSubmitAnswer}
                      style={{
                        background: challenge.color, color: "#ffffff", border: "none",
                        padding: "11px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 700,
                        cursor: isSelected ? "pointer" : "not-allowed", opacity: isSelected ? 1 : 0.4,
                        boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.15)" : "none"
                      }}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    currentQ < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQ(prev => prev + 1)}
                        style={{
                          background: "#14B8A6", color: "#ffffff", border: "none",
                          padding: "11px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 700,
                          cursor: "pointer", boxShadow: "0 4px 12px rgba(20,184,166,0.25)"
                        }}
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        onClick={handleFinish}
                        style={{
                          background: "#22C55E", color: "#ffffff", border: "none",
                          padding: "11px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: 700,
                          cursor: "pointer", boxShadow: "0 4px 14px rgba(34,197,94,0.3)"
                        }}
                      >
                        Finish & View Results 🏆
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: scorePercent >= 60 ? "#DCFCE7" : "#FFEDD5",
                color: scorePercent >= 60 ? "#16A34A" : "#EA580C",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "36px", marginBottom: "20px"
              }}>
                {scorePercent >= 80 ? "🏆" : scorePercent >= 60 ? "🎯" : "📚"}
              </div>

              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1B2B3A", marginBottom: "8px" }}>
                {scorePercent >= 80 ? "Outstanding Performance!" : scorePercent >= 60 ? "Great Job!" : "Keep Practicing!"}
              </h2>
              <p style={{ fontSize: "15px", color: "#6B8A9A", marginBottom: "28px" }}>
                You completed <strong>{challenge.title}</strong>
              </p>

              {/* Score Metric Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
                <div style={{ background: "#F8FCFC", borderRadius: "16px", padding: "20px", border: "1px solid #E2EEF0" }}>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#1B2B3A" }}>{totalCorrect} / {questions.length}</div>
                  <div style={{ fontSize: "13px", color: "#6B8A9A", marginTop: "4px" }}>Correct Answers</div>
                </div>

                <div style={{ background: "#F0FDF4", borderRadius: "16px", padding: "20px", border: "1px solid #BBF7D0" }}>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#16A34A" }}>{scorePercent}%</div>
                  <div style={{ fontSize: "13px", color: "#16A34A", marginTop: "4px" }}>Accuracy Rate</div>
                </div>

                <div style={{ background: challenge.bg, borderRadius: "16px", padding: "20px", border: `1px solid ${challenge.color}30` }}>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: challenge.color }}>+{xpEarned} XP</div>
                  <div style={{ fontSize: "13px", color: challenge.color, marginTop: "4px" }}>{savingXP ? "Saving XP..." : "XP Added to Profile!"}</div>
                </div>
              </div>

              {/* Review Questions Accordion */}
              <div style={{ textAlign: "left", marginBottom: "32px", background: "#F8FCFC", borderRadius: "16px", padding: "24px", border: "1px solid #E2EEF0" }}>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2B3A", marginBottom: "16px" }}>Question Breakdown</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {questions.map((item, idx) => {
                    const isRight = selectedAnswers[idx] === item.correct;
                    return (
                      <div key={idx} style={{ background: "#ffffff", padding: "14px 18px", borderRadius: "12px", border: `1px solid ${isRight ? "#86EFAC" : "#FCA5A5"}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                          <div>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: isRight ? "#15803D" : "#B91C1C" }}>
                              Q{idx + 1}: {item.question}
                            </span>
                            <p style={{ fontSize: "12px", color: "#6B8A9A", marginTop: "4px", margin: 0 }}>
                              Your Answer: <strong>{item.options[selectedAnswers[idx]] !== undefined ? item.options[selectedAnswers[idx]] : "Skipped"}</strong>
                            </p>
                            {!isRight && (
                              <p style={{ fontSize: "12px", color: "#15803D", marginTop: "2px", margin: 0 }}>
                                Correct Answer: <strong>{item.options[item.correct]}</strong>
                              </p>
                            )}
                          </div>
                          <span style={{ fontSize: "16px" }}>{isRight ? "✅" : "❌"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Finish Actions */}
              <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setCurrentQ(0);
                    setSelectedAnswers({});
                    setSubmitted({});
                    setTimeLeft(challenge.timeLimit);
                  }}
                  style={{
                    background: "#F0F7F8", color: "#1B2B3A", border: "1.5px solid #D0E5E8",
                    padding: "12px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  🔄 Retake Challenge
                </button>

                <button
                  onClick={onClose}
                  style={{
                    background: challenge.color, color: "#ffffff", border: "none",
                    padding: "12px 32px", borderRadius: "12px", fontSize: "14px", fontWeight: 700,
                    cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
                  }}
                >
                  Back to Learning Hub →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Student / Researcher View ── */
function StudentView({ supabase, profile, onXPUpdate }) {
  const [notes, setNotes] = useState({});
  const [openSubject, setOpenSubject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const isResearcher = profile?.role === "researcher";

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    const r = {};
    for (const sub of SUBJECTS) {
      const { data } = await supabase.storage.from("course-materials").list(sub.id);
      r[sub.id] = data || [];
    }
    setNotes(r);
  }

  async function handleUpload(sid, file) {
    if (!file?.name.endsWith(".pdf")) { alert("Please upload a PDF"); return; }
    setUploading(true);
    const fn = `${profile.id.slice(0,8)}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("course-materials").upload(`${sid}/${fn}`, file);
    if (error) alert("Upload failed: " + error.message);
    else await loadNotes();
    setUploading(false);
  }

  function getUrl(sid, fn) {
    return supabase.storage.from("course-materials").getPublicUrl(`${sid}/${fn}`).data.publicUrl;
  }

  async function handleDelete(sid, fn) {
    if (!confirm("Delete?")) return;
    await supabase.storage.from("course-materials").remove([`${sid}/${fn}`]);
    await loadNotes();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" }}>
      {/* LEFT — main content */}
      <div>
        {/* Continue banner */}
        <div style={{ background: "linear-gradient(135deg, #132D35 0%, #1B4A5A 100%)", borderRadius: "20px", padding: "28px 32px", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "11px", color: "#14B8A6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", background: "rgba(20,184,166,0.15)", padding: "4px 10px", borderRadius: "6px" }}>UP NEXT</span>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "10px 0 6px" }}>Chapter 4: CRISPR & Gene Editing</h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", marginBottom: "20px" }}>Genetics • 4 pages remaining</p>
            <button onClick={() => setActiveChallenge("genetics")} style={{ background: "#fff", color: "#132D35", border: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Continue Learning →</button>
          </div>
          <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#14B8A6" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*40*0.75} ${2*Math.PI*40*0.25}`}
                strokeDashoffset={2*Math.PI*40*0.25}
                transform="rotate(-90 50 50)"/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: "#fff" }}>75%</div>
          </div>
        </div>

        {/* PYQ section */}
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A", marginBottom: "14px" }}>Exam Prep & PYQs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "28px" }}>
          <div style={{ background: "#FFF3E8", borderRadius: "14px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #FFD4A3" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>Genetics PYQs</p>
              <p style={{ fontSize: "12px", color: "#6B8A9A" }}>10 MCQs • <span style={{ color: "#F97316", fontWeight: 600 }}>+100 XP</span></p>
            </div>
            <button onClick={() => setActiveChallenge("genetics")} style={{ background: "#F97316", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Start Challenge</button>
          </div>
          <div style={{ background: "#F3F0FF", borderRadius: "14px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #DDD6FE" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>Timed Mock Exam</p>
              <p style={{ fontSize: "12px", color: "#6B8A9A" }}>20 MCQs • <span style={{ color: "#8B5CF6", fontWeight: 600 }}>+100 XP</span></p>
            </div>
            <button onClick={() => setActiveChallenge("mock")} style={{ background: "#8B5CF6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Start Challenge</button>
          </div>
        </div>

        {/* Researcher add course option */}
        {isResearcher && (
          <div style={{ background: "#F0FCFB", border: "1.5px dashed #14B8A6", borderRadius: "14px", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#1B2B3A" }}>Share your expertise</p>
              <p style={{ fontSize: "13px", color: "#6B8A9A" }}>Upload your research notes or course materials</p>
            </div>
            <a href="/learning" style={{ background: "#14B8A6", color: "#fff", padding: "9px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>+ Add Course</a>
          </div>
        )}

        {/* Active Courses */}
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A", marginBottom: "14px" }}>Active Courses</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {SUBJECTS.map(sub => {
            const isOpen = openSubject === sub.id;
            const pdfs = (notes[sub.id] || []).filter(f => f.name?.endsWith(".pdf"));
            return (
              <div key={sub.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2EEF0", overflow: "hidden" }}>
                <button onClick={() => setOpenSubject(isOpen ? null : sub.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "10px", background: sub.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{sub.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1B2B3A" }}>{sub.name}</p>
                    <p style={{ fontSize: "12px", color: "#6B8A9A" }}>{pdfs.length} notes • Module 1 of 3</p>
                  </div>
                  <div style={{ width: "120px", margin: "0 12px" }}>
                    <div style={{ height: 4, background: "#E2EEF0", borderRadius: "4px" }}>
                      <div style={{ height: 4, width: "30%", background: sub.color, borderRadius: "4px" }}></div>
                    </div>
                  </div>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveChallenge(sub.id === "genetics" ? "genetics" : "mock"); }} style={{ fontSize: "13px", color: "#14B8A6", fontWeight: 500 }}>View Course →</a>
                  <span style={{ fontSize: "16px", color: "#C0CDD5", marginLeft: "8px", transform: isOpen ? "rotate(180deg)" : "none", display: "block" }}>▾</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 20px 20px", borderTop: "1px solid #F0F7F8" }}>
                    {pdfs.length === 0 ? (
                      <p style={{ fontSize: "13px", color: "#9CA3AF", padding: "14px 0 8px" }}>No notes uploaded yet.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px 0 8px" }}>
                        {pdfs.map(f => (
                          <div key={f.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#F8FCFC", borderRadius: "10px" }}>
                            <span>📄</span>
                            <span style={{ flex: 1, fontSize: "13px", color: "#1B2B3A", fontWeight: 500 }}>{f.name.replace(/^[^_]+_\d+_/, "")}</span>
                            <a href={getUrl(sub.id, f.name)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#14B8A6", fontWeight: 600, padding: "5px 12px", background: "rgba(20,184,166,0.08)", borderRadius: "6px" }}>View</a>
                          </div>
                        ))}
                      </div>
                    )}
                    {isResearcher && (
                      <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#14B8A6", color: "#fff", padding: "9px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.7 : 1, marginTop: "8px" }}>
                        {uploading ? "Uploading..." : "📤 Upload PDF"}
                        <input type="file" accept=".pdf" hidden disabled={uploading} onChange={e => handleUpload(sub.id, e.target.files?.[0])}/>
                      </label>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDEBAR — LiveStudentWidgets handles streak, bio-minute & quests */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <LiveStudentWidgets />
      </div>

      {/* Active Challenge Quiz Modal */}
      {activeChallenge && (
        <ChallengeModal
          challengeKey={activeChallenge}
          onClose={() => setActiveChallenge(null)}
          supabase={supabase}
          profile={profile}
          onXPUpdate={onXPUpdate}
        />
      )}
    </div>
  );
}

/* ── Educator View ── */
function EducatorView({ supabase, profile, onXPUpdate }) {
  const [notes, setNotes] = useState({});
  const [openSubject, setOpenSubject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showAddMCQ, setShowAddMCQ] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [mcqForm, setMcqForm] = useState({ subject: "genetics", question: "", options: ["","","",""], answer: 0, xp: "20" });

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    const r = {};
    for (const sub of SUBJECTS) {
      const { data } = await supabase.storage.from("course-materials").list(sub.id);
      r[sub.id] = data || [];
    }
    setNotes(r);
  }

  async function handleUpload(sid, file) {
    if (!file?.name.endsWith(".pdf")) { alert("Please upload a PDF"); return; }
    setUploading(true);
    const fn = `${profile.id.slice(0,8)}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("course-materials").upload(`${sid}/${fn}`, file);
    if (error) alert("Upload failed: " + error.message);
    else await loadNotes();
    setUploading(false);
  }

  function getUrl(sid, fn) {
    return supabase.storage.from("course-materials").getPublicUrl(`${sid}/${fn}`).data.publicUrl;
  }

  async function handleDelete(sid, fn) {
    if (!confirm("Delete?")) return;
    await supabase.storage.from("course-materials").remove([`${sid}/${fn}`]);
    await loadNotes();
  }

  const totalNotes = Object.values(notes).reduce((acc, arr) => acc + arr.filter(f => f.name?.endsWith(".pdf")).length, 0);

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" }}>
        {[
          { label: "Total Materials", value: totalNotes, icon: "📚", color: "#14B8A6" },
          { label: "Subjects", value: SUBJECTS.length, icon: "🧬", color: "#8B5CF6" },
          { label: "Students (approx)", value: "—", icon: "👥", color: "#F97316" },
          { label: "MCQ Sets", value: "2", icon: "📝", color: "#3B82F6" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "14px", padding: "18px 20px", border: "1px solid #E2EEF0", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "10px", background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: "20px", fontWeight: 700, color: "#1B2B3A" }}>{s.value}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* My Courses */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A" }}>My Courses</h2>
            <span style={{ fontSize: "13px", color: "#14B8A6", fontWeight: 500 }}>Manage Materials</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {SUBJECTS.map(sub => {
              const isOpen = openSubject === sub.id;
              const pdfs = (notes[sub.id] || []).filter(f => f.name?.endsWith(".pdf"));
              return (
                <div key={sub.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2EEF0", overflow: "hidden" }}>
                  <button onClick={() => setOpenSubject(isOpen ? null : sub.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "10px", background: sub.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{sub.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#1B2B3A" }}>{sub.name}</p>
                      <p style={{ fontSize: "12px", color: "#6B8A9A" }}>{pdfs.length} PDFs uploaded</p>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#14B8A6", background: "rgba(20,184,166,0.08)", padding: "4px 10px", borderRadius: "6px" }}>{pdfs.length > 0 ? `${pdfs.length} files` : "Empty"}</span>
                    <span style={{ fontSize: "16px", color: "#C0CDD5", marginLeft: "8px", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 18px 18px", borderTop: "1px solid #F0F7F8" }}>
                      {pdfs.length === 0 ? (
                        <p style={{ fontSize: "13px", color: "#9CA3AF", padding: "12px 0 8px" }}>No files yet</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "10px 0 8px" }}>
                          {pdfs.map(f => (
                            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", background: "#F8FCFC", borderRadius: "8px" }}>
                              <span>📄</span>
                              <span style={{ flex: 1, fontSize: "13px", color: "#1B2B3A", fontWeight: 500 }}>{f.name.replace(/^[^_]+_\d+_/, "")}</span>
                              <a href={getUrl(sub.id, f.name)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#14B8A6", fontWeight: 600, padding: "4px 10px", background: "rgba(20,184,166,0.08)", borderRadius: "6px" }}>View</a>
                              <button onClick={() => handleDelete(sub.id, f.name)} style={{ fontSize: "12px", color: "#EF4444", background: "#FEF2F2", border: "none", padding: "4px 8px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#14B8A6", color: "#fff", padding: "8px 16px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.7 : 1, marginTop: "8px" }}>
                        {uploading ? "Uploading..." : "📤 Upload PDF"}
                        <input type="file" accept=".pdf" hidden disabled={uploading} onChange={e => handleUpload(sub.id, e.target.files?.[0])}/>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PYQ MCQs */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A" }}>PYQ MCQs</h2>
            <button onClick={() => setShowAddMCQ(!showAddMCQ)} style={{ background: "#F97316", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {showAddMCQ ? "Cancel" : "+ Add MCQ"}
            </button>
          </div>
          {showAddMCQ && (
            <div style={{ background: "#fff", borderRadius: "14px", padding: "20px", border: "1px solid #E2EEF0", marginBottom: "14px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1B2B3A", marginBottom: "16px" }}>Add MCQ Question</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={L}>Subject</label>
                  <select value={mcqForm.subject} onChange={e => setMcqForm({...mcqForm, subject: e.target.value})} style={I}>
                    {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={L}>Question *</label>
                  <textarea value={mcqForm.question} onChange={e => setMcqForm({...mcqForm, question: e.target.value})} rows={2} style={{...I, resize: "vertical"}} placeholder="Enter your MCQ question..."/>
                </div>
                {mcqForm.options.map((opt, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input type="radio" name="answer" checked={mcqForm.answer === i} onChange={() => setMcqForm({...mcqForm, answer: i})} style={{ accentColor: "#14B8A6", width: 16, height: 16, flexShrink: 0 }}/>
                    <input value={opt} onChange={e => { const opts = [...mcqForm.options]; opts[i] = e.target.value; setMcqForm({...mcqForm, options: opts}); }} style={{ ...I, flex: 1 }} placeholder={`Option ${i + 1}${i === mcqForm.answer ? " (correct)" : ""}`}/>
                  </div>
                ))}
                <p style={{ fontSize: "12px", color: "#9CA3AF" }}>Select the radio button next to the correct answer</p>
                <div>
                  <label style={L}>XP Reward</label>
                  <input value={mcqForm.xp} onChange={e => setMcqForm({...mcqForm, xp: e.target.value})} style={I} placeholder="20"/>
                </div>
                <button onClick={() => {
                  if (!mcqForm.question || mcqForm.options.some(o => !o)) { alert("Fill all fields"); return; }
                  alert("MCQ saved!");
                  setShowAddMCQ(false);
                  setMcqForm({ subject: "genetics", question: "", options: ["","","",""], answer: 0, xp: "20" });
                }} style={{ background: "#F97316", color: "#fff", border: "none", padding: "11px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Save MCQ
                </button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { title: "Genetics PYQs", count: 10, xp: 100, subject: "Genetics", color: "#F97316", bg: "#FFF3E8", key: "genetics" },
              { title: "Biochemistry MCQs", count: 15, xp: 150, subject: "Biochemistry", color: "#8B5CF6", bg: "#F3F0FF", key: "mock" },
              { title: "Timed Mock Exam", count: 20, xp: 200, subject: "All Subjects", color: "#14B8A6", bg: "#F0FCFB", key: "mock" },
            ].map(q => (
              <div key={q.title} style={{ background: q.bg, borderRadius: "14px", padding: "18px 20px", border: `1px solid ${q.color}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>{q.title}</p>
                    <p style={{ fontSize: "12px", color: "#6B8A9A" }}>{q.count} MCQs • {q.subject} • <span style={{ color: q.color, fontWeight: 600 }}>+{q.xp} XP</span></p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ background: "#fff", color: q.color, border: `1.5px solid ${q.color}`, padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                    <button onClick={() => setActiveChallenge(q.key)} style={{ background: q.color, color: "#fff", border: "none", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Preview</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Challenge Quiz Modal */}
      {activeChallenge && (
        <ChallengeModal
          challengeKey={activeChallenge}
          onClose={() => setActiveChallenge(null)}
          supabase={supabase}
          profile={profile}
          onXPUpdate={onXPUpdate}
        />
      )}
    </div>
  );
}

export default function LearningPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  function handleXPUpdate(newXP) {
    setProfile(prev => prev ? { ...prev, xp: newXP } : prev);
  }

  return (
    <AppShell active="/learning">
      {loading
        ? <div style={{ textAlign: "center", padding: "100px", color: "#9CA3AF" }}>Loading...</div>
        : profile?.role === "educator"
          ? <EducatorView supabase={supabase} profile={profile} onXPUpdate={handleXPUpdate} />
          : <StudentView supabase={supabase} profile={profile} onXPUpdate={handleXPUpdate} />
      }
    </AppShell>
  );
}

const L = { display: "block", fontSize: "12px", fontWeight: 600, color: "#6B8A9A", marginBottom: "6px" };
const I = { width: "100%", padding: "10px 14px", border: "1.5px solid #E2EEF0", borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff", color: "#1B2B3A" };