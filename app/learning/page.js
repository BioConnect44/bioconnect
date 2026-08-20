"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";
import LiveStudentWidgets, { markQuestCompleted } from "@/components/LiveStudentWidgets";

const COURSE_TOPICS = [
  {
    id: "topic-01",
    topicNum: "TOPIC 01",
    name: "Biomolecules, Membranes, Enzymes, Metabolism & Bioenergetics",
    shortName: "Biomolecules & Bioenergetics",
    icon: "🧪",
    color: "#14B8A6",
    notesCount: "5 notes",
    module: "Module 1 of 4",
    progress: 85,
    tagline: "Molecular structure determines function: carbohydrates, lipids, proteins, enzymes & metabolic pathways.",
    pdfTitle: "Topic 01 - Biomolecules, Membranes, Enzymes & Bioenergetics.pdf",
    sections: [
      {
        title: "1. The Four Classes of Biomolecules",
        content: `• Carbohydrates: Polyhydroxy aldehydes/ketones. Mono (glucose, ribose), Di (sucrose, lactose), Poly (starch, glycogen, cellulose, chitin). Joined by glycosidic bonds; cellulose β-1,4 is indigestible to humans.
• Lipids: Hydrophobic/amphipathic. Simple (fats), compound (phospholipids), derived (steroids). Phospholipids = polar head + 2 hydrophobic tails → membranes. Steroids = 4-ring structure.
• Proteins: Amino-acid polymers joined by peptide bonds. Primary → Secondary (α-helix, β-sheet) → Tertiary → Quaternary.
• Nucleic Acids: Nucleotide polymers linked by phosphodiester bonds. Nucleotide = base + pentose sugar + phosphate. Purines (A,G), Pyrimidines (C,T,U).`
      },
      {
        title: "2. Biological Membranes & Transport",
        content: `• Fluid Mosaic Model: Phospholipid bilayer with embedded lateral proteins. Cholesterol regulates fluidity.
• Passive Transport: Simple diffusion, Facilitated diffusion, Osmosis (water).
• Active Transport: Primary (ATP, e.g. Na+/K+-ATPase), Secondary (electrochemical gradient).
• Nernst Equation (at 25°C): E = (0.0591/z) · log([ion]out/[ion]in).`
      },
      {
        title: "3. Enzymes & Kinetics",
        content: `• Michaelis-Menten: v = Vmax[S] / (Km + [S]). Lower Km = higher affinity.
• Lineweaver-Burk: 1/v = (Km/Vmax)(1/[S]) + 1/Vmax.
• Competitive Inhibition: Km increases, Vmax unchanged (beaten by excess S).
• Non-competitive Inhibition: Km unchanged, Vmax decreases.
• Uncompetitive Inhibition: Both Km and Vmax decrease.`
      },
      {
        title: "4. Metabolism & Bioenergetics",
        content: `• Glycolysis: Glucose → 2 pyruvate (cytosol). Net ATP = 2 ATP, 2 NADH. Key regulator: PFK-1.
• TCA Cycle: Per acetyl-CoA → 3 NADH, 1 FADH2, 1 GTP.
• ATP Yield: ~30-32 ATP per glucose under aerobic respiration.
• ΔG = ΔH - TΔS. Spontaneous when ΔG < 0.`
      }
    ],
    examTraps: [
      "A catalyst changes the rate, NEVER the equilibrium position or ΔG of a reaction.",
      "Km is an inverse proxy for affinity — low Km = high affinity.",
      "Competitive inhibition raises apparent Km but leaves Vmax unchanged."
    ],
    pyqs: [
      {
        id: 1,
        question: "GAT-B 2020: Which of the following interactions are involved in stabilising protein structure?",
        options: ["Hydrophobic interactions", "Ionic bonds", "Hydrogen bonds", "All of the above"],
        correct: 3,
        explanation: "Protein tertiary and quaternary structures are stabilized by non-covalent interactions including hydrophobic interactions, ionic bonds, hydrogen bonds, and disulfide bridges."
      },
      {
        id: 2,
        question: "GAT-B 2020: The bond length of peptide bond is approximately:",
        options: ["1.32 Å", "2.01 Å", "1.49 Å", "1.80 Å"],
        correct: 0,
        explanation: "The C-N peptide bond length is approximately 1.32 Å, which is shorter than a standard C-N single bond (1.47 Å) due to partial double-bond character."
      },
      {
        id: 3,
        question: "GAT-B 2020: Denaturation of proteins causes loss of biological activity mainly due to:",
        options: ["Loss of primary structure", "Loss of peptide bond", "Loss of secondary and tertiary structure", "Hydrolysis of amino acids"],
        correct: 2,
        explanation: "Denaturation disrupts secondary, tertiary, and quaternary structures without breaking primary covalent peptide bonds."
      },
      {
        id: 4,
        question: "GAT-B 2020: Which amino acid is most likely to disrupt α-helix?",
        options: ["Alanine", "Leucine", "Proline", "Methionine"],
        correct: 2,
        explanation: "Proline acts as an alpha-helix breaker because its rigid cyclic side chain creates steric hindrance and lacks an N-H hydrogen bond donor."
      },
      {
        id: 5,
        question: "GAT-B 2020: Which of the following is NOT a reducing sugar?",
        options: ["Maltose", "Lactose", "Glucose", "Sucrose"],
        correct: 3,
        explanation: "Sucrose is a non-reducing disaccharide because both of its anomeric carbons (C1 of glucose and C2 of fructose) are involved in the glycosidic bond."
      },
      {
        id: 6,
        question: "GAT-B 2021: Competitive inhibition can be overcome by:",
        options: ["Decreasing substrate concentration", "Increasing substrate concentration", "Increasing inhibitor concentration", "Decreasing enzyme concentration"],
        correct: 1,
        explanation: "Increasing substrate concentration outcompetes the inhibitor for binding at the active site, restoring maximum velocity Vmax."
      },
      {
        id: 7,
        question: "GAT-B 2021: Which enzyme parameter remains unchanged in competitive inhibition?",
        options: ["Km", "Vmax", "Both Km and Vmax", "Turnover number"],
        correct: 1,
        explanation: "In competitive inhibition, Vmax remains unchanged because high substrate concentration can outcompete the inhibitor, whereas apparent Km increases."
      },
      {
        id: 8,
        question: "GAT-B 2021: Cholesterol in plasma membrane mainly helps in:",
        options: ["Protein synthesis", "Membrane fluidity regulation", "ATP synthesis", "Cell wall formation"],
        correct: 1,
        explanation: "Cholesterol regulates membrane fluidity by preventing fatty acid chains from packing tightly at low temperatures and restricting excessive movement at high temperatures."
      },
      {
        id: 9,
        question: "GAT-B 2021: Which RNA possesses catalytic activity?",
        options: ["mRNA", "tRNA", "rRNA", "hnRNA"],
        correct: 2,
        explanation: "23S rRNA (in prokaryotes) or 28S rRNA (in eukaryotes) functions as a peptidyl transferase ribozyme that catalyzes peptide bond formation."
      },
      {
        id: 10,
        question: "GAT-B 2021: Which amino acid contains imidazole ring?",
        options: ["Lysine", "Histidine", "Arginine", "Tryptophan"],
        correct: 1,
        explanation: "Histidine contains an aromatic imidazole side chain ring with a pKa ~6.0, allowing it to act as a general acid-base catalyst at physiological pH."
      },
      {
        id: 11,
        question: "GAT-B 2022: Which polysaccharide is highly branched?",
        options: ["Amylose", "Cellulose", "Glycogen", "Chitin"],
        correct: 2,
        explanation: "Glycogen is a highly branched glucose polymer with α-1,4 glycosidic bonds and α-1,6 branch points occurring every 8-12 glucose residues."
      },
      {
        id: 12,
        question: "GAT-B 2022: Base pairing in DNA is stabilised by:",
        options: ["Ionic bonds", "Covalent bonds", "Hydrogen bonds", "Peptide bonds"],
        correct: 2,
        explanation: "Complementary base pairs (A-T with 2 hydrogen bonds, G-C with 3 hydrogen bonds) stabilize the double-stranded DNA helix."
      },
      {
        id: 13,
        question: "GAT-B 2022: Which vitamin acts as antioxidant?",
        options: ["Vitamin C", "Vitamin D", "Vitamin K", "Vitamin B12"],
        correct: 0,
        explanation: "Vitamin C (ascorbic acid) and Vitamin E act as powerful water-soluble and lipid-soluble antioxidants, scavenging free radicals."
      },
      {
        id: 14,
        question: "GAT-B 2022: The phosphodiester bond in nucleic acid is formed between:",
        options: ["2' OH and 3' phosphate", "1' carbon and base", "3' OH and 5' phosphate", "Nitrogenous bases"],
        correct: 2,
        explanation: "Phosphodiester bonds link the 3'-OH group of one sugar molecule to the 5'-phosphate group of the adjacent sugar in nucleic acids."
      },
      {
        id: 15,
        question: "GAT-B 2022: Which of the following is a ketose sugar?",
        options: ["Glucose", "Galactose", "Fructose", "Ribose"],
        correct: 2,
        explanation: "Fructose is a ketohexose containing a ketone group at C2, whereas glucose and galactose are aldohexoses."
      },
      {
        id: 16,
        question: "GAT-B 2023: Apoenzyme together with cofactor forms:",
        options: ["Isoenzyme", "Ribozyme", "Holoenzyme", "Zymogen"],
        correct: 2,
        explanation: "An apoenzyme (inactive protein part) plus its required cofactor/coenzyme forms a catalytically active holoenzyme."
      },
      {
        id: 17,
        question: "GAT-B 2023: Which amino acid contains sulfur atom?",
        options: ["Glycine", "Serine", "Methionine", "Proline"],
        correct: 2,
        explanation: "Methionine and Cysteine are the two standard sulfur-containing amino acids."
      },
      {
        id: 18,
        question: "GAT-B 2023: Which nitrogenous base is absent in RNA?",
        options: ["Adenine", "Guanine", "Cytosine", "Thymine"],
        correct: 3,
        explanation: "RNA contains Uracil (U) instead of Thymine (T)."
      },
      {
        id: 19,
        question: "GAT-B 2023: The major structural component of biological membrane is:",
        options: ["Steroid", "Cholesterol", "Phospholipid", "Triglyceride"],
        correct: 2,
        explanation: "Phospholipids form the fundamental structural lipid bilayer matrix of all biological membranes."
      },
      {
        id: 20,
        question: "GAT-B 2023: Which amino acid does NOT possess chiral carbon?",
        options: ["Alanine", "Glycine", "Valine", "Threonine"],
        correct: 1,
        explanation: "Glycine has two hydrogen atoms attached to its alpha carbon, making it achiral (non-optically active)."
      }
    ]
  },
  {
    id: "topic-02",
    topicNum: "TOPIC 02",
    name: "Advanced Genetics & Molecular Biology",
    shortName: "Genetics & Molecular Biology",
    icon: "🧬",
    color: "#8B5CF6",
    notesCount: "4 notes",
    module: "Module 2 of 4",
    progress: 75,
    tagline: "DNA compaction, replication machinery, repair pathways & lac operon regulation.",
    pdfTitle: "Master Engineering Course Guide - Advanced Genetics & Molecular Biology.pdf",
    tagline: "Definitive High-Yield Textbook & Exam Prep Syllabus Framework for B.Tech Undergraduate & GATE Examinations.",
    sections: [
      {
        title: "MODULE 1: Molecular Structure of Genes and Chromosomes",
        content: `• Gene Definition: Complete sequence of chromosomal nucleotides located across specific loci containing instructions for functional RNA (rRNA, tRNA, snRNA, miRNA) or polypeptide.
• Compaction Tiers: Nucleosome core particle (146 bp DNA wound 1.65x left-handed superhelical turn around histone octamer 2x H2A, H2B, H3, H4 rich in Lys & Arg).
• Packaging Hierarchy: 11 nm 'beads-on-a-string' (linker H1 20-80 bp) → 30 nm Solenoid (~6 nucleosomes/turn, 40x denser) → Loop Domains (20-100 kb) anchored to central scaffold (Topoisomerase II & Condensin ring) → 700-1400 nm mitotic chromosome.
• Epigenetics: Euchromatin (open, active, high histone tail acetylation by HATs e.g. H3K9ac/H3K14ac neutralizing positive charge) vs Heterochromatin (condensed, silent, H3K9me3 & H3K27me3 by HMTs recruiting HP1; Constitutive vs Facultative).`
      },
      {
        title: "MODULE 2: Nucleic Acid Replication, Transcription, and Translation",
        content: `• Replication Fork Dynamics: 5' to 3' direction from 3'-OH. Prokaryotic oriC initiated by DnaA binding 9-mer/13-mer repeats; DnaB Helicase loaded via DnaC; positive supercoils relieved by DNA Gyrase (type II topoisomerase); SSBs prevent reannealing; Leading strand continuous, Lagging strand discontinuous via 1000-2000 bp Okazaki fragments primed by DnaG Primase. Processivity driven by homodimeric beta-2 sliding clamp.
• Machinery Table: Origin (prokaryote DnaA vs eukaryote ORC 1-6); Helicase (DnaB vs CMG Mcm2-7/GINS/Cdc45); Primase (DnaG vs Pol α/Primase); Elongation (Pol III core vs Pol ε leading & Pol δ lagging); Primer removal (Pol I 5'->3' exo vs FEN1 & Dna2).
• Transcription: Prokaryotic core RNA pol (α2ββ'ω) + sigma factor (σ) binds consensus -10 Pribnow box (5'-TATAAT-3') and -35 (5'-TTGACA-3'). Termination: Intrinsic (GC stem-loop + uracils) vs Rho-dependent (ATP hexameric helicase Rho).
• Eukaryotic Polymerases: Pol I (45S precursor -> 28S, 18S, 5.8S rRNA), Pol II (mRNA, snRNA, miRNA with core TATA box at -25 bp recruiting TFIID/TFIIB/TFIIE/TFIIH), Pol III (tRNA, 5S rRNA).
• mRNA Post-Transcriptional Chain: 1. 5' Capping (7-methylguanosine 5'-to-5' triphosphate bridge). 2. 3' Polyadenylation (AAUAAA signal -> endonuclease cleavage -> Poly(A) Polymerase PAP adds 150-250 adenines). 3. Spliceosome Splicing (U1, U2, U4, U5, U6 snRNAs + 150 proteins; 5' splice site GU, branch point A, 3' splice site AG).`
      },
      {
        title: "MODULE 3: Mutations, Mutagenesis, DNA Damage, and Repair Pathways",
        content: `• Classification: Transitions (purine<->purine A<->G, pyrimidine<->pyrimidine C<->T) vs Transversions (purine<->pyrimidine A<->C, G<->T).
• Consequences: Silent (degeneracy, e.g. GUA->GUG Val), Missense (GAG Glu -> GTG Val), Nonsense (premature stop UAA/UAG/UGA), Frameshift (indel not multiple of 3).
• Environmental Mutagens: Physical (UV creates intrastrand pyrimidine dimers CPDs & [6-4] photoproducts; X-rays/gamma generate ROS causing strand breaks); Chemical (EMS alkylating agent; 5-BU base analogue mimics T, enol shifts pair with G causing T·A -> C·G transitions).
• Repair Cascades: MMR (MutS-MutL-MutH scans hemi-methylated 5'-GATC-3' by Dam Methylase, nicks unmethylated strand); BER (DNA Glycosylase cuts glycosidic bond -> AP site -> AP Endonuclease cuts 5' backbone -> Pol I & Ligase); NER (UvrABC excinuclease: UvrA/B scan, UvrC cuts 8 nt upstream & 4-5 nt downstream, UvrD Helicase removes 12-13 nt fragment; defects cause Xeroderma Pigmentosum).`
      },
      {
        title: "MODULE 4: Classical Transmission Genetics & Chromosomal Mapping",
        content: `• Mendelian & Epistasis: Segregation & Independent Assortment (9:3:3:1). Epistatic deviations: Complementary (9:7), Recessive Epistasis (9:3:4 e.g. Labrador coat color *ee* masking *B/b*), Dominant Epistasis (12:3:1 summer squash), Duplicate Dominant (15:1).
• Three-Point Testcross (AaBbCc x aabbcc): 1. Group progeny: Parentals (highest frequency, sum=800) vs DCO (lowest frequency, sum=10). 2. Gene Order: Single locus flipped in DCO relative to parentals is the middle gene (e.g. p-q-r). 3. Recombination Frequencies: RF = [(Σ Single Crossovers + Σ Double Crossovers) / Total Progeny] * 100. (Region 1 p-q = 9.0 cM, Region 2 q-r = 12.0 cM). 4. Interference: Expected DCO = 0.090 * 0.120 = 0.0108; Observed DCO = 10/1000 = 0.0100; Coefficient of Coincidence C = 0.0100 / 0.0108 = 0.9259; Interference I = 1 - C = 1 - 0.9259 = 0.0741 (7.41%).`
      },
      {
        title: "MODULE 5: Bacterial Genetics, Horizontal Gene Transfer & RNAi",
        content: `• HGT Mechanisms: Transformation (naked DNA uptake by competent cells via Com machinery & RecA; induced artificially by CaCl2 heat shock or Electroporation); Transduction (bacteriophage-mediated: Generalized lytic P22/P1 random host packaging vs Specialized lysogenic Lambda phage integrating at attλ site transferring flanking gal/bio genes); Conjugation (direct contact via sex pilus, F-plasmid nicked at oriT pumped into F- cell; Hfr strain has F integrated in chromosome, transfers host genes via rolling circle; bridge breaks before 100 min transfer completes).
• Transposable Elements: Insertion Sequences IS (encodes transposase flanked by inverted terminal repeats); Complex transposons (Tn10 tetracycline resistance); Modes: Conservative ('cut-and-paste') vs Replicative ('copy-and-paste').
• RNA Interference (RNAi): Dicer cleaves dsRNA into 21-23 bp siRNAs -> loaded into RISC complex -> unwound -> Argonaute protein cleaves complementary target mRNA, silencing translation.`
      },
      {
        title: "MODULE 6: Chromosomal Variations & Molecular Basis of Genetic Diseases",
        content: `• Aberrations: Numerical Aneuploidy (monosomy 2n-1, trisomy 2n+1 from meiotic nondisjunction); Structural (Deletions pseudo-dominance, Duplications gene families, Inversions paracentric vs pericentric suppressing recombination loops, Translocations Robertsonian fusion).
• Disease Matrix:
  1. Sickle Cell Anemia (Autosomal Recessive): A->T transversion in 6th codon of beta-globin on chr 11 (GAG -> GTG), substituting hydrophilic Glutamic Acid with hydrophobic Valine at position 6. Hypoxia causes HbS tetramers to polymerize into rigid sickle shapes clogging capillaries.
  2. Huntington Disease (Autosomal Dominant): CAG trinucleotide repeat expansion (>40 repeats) in exon 1 of HTT gene on chr 4 encoding long polyglutamine tract, forming toxic striatal aggregates. Displays Anticipation.
  3. Chronic Myelogenous Leukemia (CML) (Somatic Rearrangement): Reciprocal translocation t(9;22)(q34;q11) generating Philadelphia Chromosome, fusing BCR with ABL proto-oncogene to form constitutively active BCR-ABL tyrosine kinase. Treated with Imatinib (Gleevec).
  4. Down Syndrome (Chromosomal Aneuploidy): Trisomy 21 (47, XX/XY, +21) from maternal meiotic nondisjunction, overexpressing SOD1 and APP.`
      },
      {
        title: "MODULE 7: Exam-Focused Evaluative Questions & Solved Quantitative Bank",
        content: `• Lac Operon Model Answer (5-Mark): Polycistronic lacZ (β-gal), lacY (permease), lacA (transacetylase). Negative control: LacI tetrameric repressor binds O1 operator site blocking RNA Pol. Allolactose inducer binds repressor causing dissociation. Positive control: Low glucose -> active Adenylyl Cyclase -> high cAMP -> cAMP-CAP complex binds upstream promoter bending DNA 50x to boost RNA Pol.
• Complementation & Cis-Trans Test: Complementation restores wild-type phenotype when mutations are in different genes (intergenic). Cis-trans test: Trans (m1+/+m2) wild-type = complementation (different genes); mutant = same gene (intragenic). Cis (m1m2/++) control verifies non-dominance.
• Solved FAQ 1 (3-Point Testcross Numerical): Progeny: [p q r]=398, [+++]=402, [p++]=42, [+qr]=38, [pq+]=54, [++r]=56, [p+r]=6, [+q+]=4. Gene order: p-q-r (q flipped in DCO). Distance p-q = (42+38+6+4)/1000 * 100 = 9.0 cM. Distance q-r = (54+56+6+4)/1000 * 100 = 12.0 cM. Interference I = 1 - C = 1 - (0.0100/0.0108) = 7.41%.
• Solved FAQ 2 (PCR Kinetics Numerical): Initial template N0 = 500 copies, efficiency E = 0.94, cycles n = 28. Formula: Nt = N0 * (1 + E)^n = 500 * (1.94)^28. log(1.94^28) = 28 * 0.2878 = 8.0584 -> 1.94^28 ≈ 114,393,243. Nt = 500 * 114,393,243 = 57,196,621,500 ≈ 5.72 × 10^10 target DNA molecules.`
      }
    ],
    examTraps: [
      "DNA polymerase needs a primer and only extends 5' → 3'; it cannot start de novo.",
      "In lac operon, the true inducer is ALLOLACTOSE, not lactose itself.",
      "Transformation vs Transduction vs Conjugation: ONLY conjugation requires cell-to-cell contact (pilus).",
      "Recombination frequency saturates at 50% for genes far apart or on different chromosomes.",
      "Sickle Cell Anemia is a transversion (A->T) substituting Glutamic Acid with Valine at position 6.",
      "CML Philadelphia chromosome is a reciprocal translocation t(9;22) forming BCR-ABL tyrosine kinase targeted by Imatinib."
    ],
    pyqs: [
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
        explanation: "Okazaki fragments are short DNA fragments synthesized discontinuously on the lagging strand."
      },
      {
        id: 3,
        question: "GAT-B 2020: Which RNA carries amino acids to ribosome?",
        options: ["rRNA", "snRNA", "tRNA", "mRNA"],
        correct: 2,
        explanation: "tRNA (transfer RNA) carries specific amino acids to the ribosome during translation."
      },
      {
        id: 4,
        question: "GAT-B 2021: The start codon in mRNA is:",
        options: ["UAA", "AUG", "UAG", "UGA"],
        correct: 1,
        explanation: "AUG is the universal start codon coding for Methionine."
      },
      {
        id: 5,
        question: "GAT-B 2021: Which enzyme synthesizes RNA from DNA template?",
        options: ["DNA polymerase", "RNA polymerase", "Reverse transcriptase", "Ligase"],
        correct: 1,
        explanation: "RNA polymerase transcribes RNA using a DNA strand as a template."
      },
      {
        id: 6,
        question: "GAT-B 2021: In eukaryotes, mRNA processing includes:",
        options: ["Splicing", "5' capping", "Polyadenylation", "All of the above"],
        correct: 3,
        explanation: "Eukaryotic pre-mRNA undergoes 5' 7-methylguanosine capping, 3' polyadenylation, and intron splicing."
      },
      {
        id: 7,
        question: "GAT-B 2022: The central dogma of molecular biology is:",
        options: ["Protein → RNA → DNA", "DNA → Protein → RNA", "DNA → RNA → Protein", "RNA → DNA → Protein"],
        correct: 2,
        explanation: "The central dogma states that genetic information flows from DNA to RNA (transcription) and from RNA to protein (translation)."
      },
      {
        id: 8,
        question: "GAT-B 2022: The operator region in lac operon functions as:",
        options: ["Binding site for ribosome", "Binding site for repressor protein", "Site of DNA replication", "Terminator sequence"],
        correct: 1,
        explanation: "The operator is a regulatory DNA sequence bound by the LacI repressor protein to block transcription."
      },
      {
        id: 9,
        question: "GAT-B 2022: Which enzyme joins Okazaki fragments?",
        options: ["Helicase", "Primase", "Ligase", "Gyrase"],
        correct: 2,
        explanation: "DNA ligase seals nicks in the phosphodiester backbone between lagging strand Okazaki fragments."
      },
      {
        id: 10,
        question: "GAT-B 2023: The process of synthesis of RNA from DNA is called:",
        options: ["Translation", "Replication", "Transcription", "Mutation"],
        correct: 2,
        explanation: "Transcription is the synthesis of RNA molecules from a DNA template."
      },
      {
        id: 11,
        question: "GAT-B 2023: Which of the following is NOT a stop codon?",
        options: ["UAA", "UAG", "UGA", "AUG"],
        correct: 3,
        explanation: "AUG is the start codon; UAA, UAG, and UGA are the three stop codons."
      },
      {
        id: 12,
        question: "GAT-B 2023: Histone proteins are associated with:",
        options: ["Prokaryotic DNA only", "Eukaryotic chromatin", "Ribosomes", "Plasmids"],
        correct: 1,
        explanation: "Histone octamers compact eukaryotic DNA into nucleosomes and chromatin structure."
      },
      {
        id: 13,
        question: "GAT-B 2024: DNA replication is described as semiconservative because:",
        options: ["One strand is completely new", "One parental and one new strand are present", "DNA is synthesized only in one direction", "Replication occurs conservatively"],
        correct: 1,
        explanation: "In semiconservative replication, each daughter DNA double helix consists of one original parental strand and one newly synthesized strand."
      },
      {
        id: 14,
        question: "GAT-B 2024: Which RNA molecule forms the structural component of ribosome?",
        options: ["mRNA", "tRNA", "rRNA", "siRNA"],
        correct: 2,
        explanation: "rRNA (ribosomal RNA) combines with proteins to form ribosomal subunits."
      },
      {
        id: 15,
        question: "GAT-B 2024: Alternative splicing results in:",
        options: ["DNA replication", "Multiple proteins from one gene", "Protein degradation", "Mutation repair"],
        correct: 1,
        explanation: "Alternative splicing allows a single pre-mRNA to produce different protein isoforms by including/excluding distinct exons."
      },
      {
        id: 16,
        question: "GAT-B 2020: Restriction enzymes are also known as:",
        options: ["Ligases", "Molecular scissors", "Polymerases", "Primases"],
        correct: 1,
        explanation: "Restriction endonucleases cleave DNA at specific palindrome recognition sequences, acting as molecular scissors."
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
        explanation: "Plasmids are extrachromosomal circular DNA molecules widely used as vectors to clone and express foreign genes."
      },
      {
        id: 19,
        question: "GAT-B 2021: EcoRI recognizes the sequence:",
        options: ["AAGCTT", "GGATCC", "GAATTC", "CTGCAG"],
        correct: 2,
        explanation: "EcoRI cuts at the palindromic hexanucleotide sequence 5'-GAATTC-3'."
      },
      {
        id: 20,
        question: "GAT-B 2021: PCR was invented by:",
        options: ["Watson", "Mullis", "Crick", "Meselson"],
        correct: 1,
        explanation: "Kary Mullis invented the Polymerase Chain Reaction (PCR) in 1983."
      },
      {
        id: 21,
        question: "GAT-B 2021: The enzyme used in PCR is:",
        options: ["DNA ligase", "Taq polymerase", "Reverse transcriptase", "Primase"],
        correct: 1,
        explanation: "Taq DNA polymerase from Thermus aquaticus is thermostable and withstands high PCR denaturation temperatures (95°C)."
      },
      {
        id: 22,
        question: "GAT-B 2022: The sticky ends generated by restriction enzymes are useful because they:",
        options: ["Destroy DNA", "Prevent ligation", "Facilitate joining of DNA fragments", "Replicate DNA"],
        correct: 2,
        explanation: "Overhanging single-stranded sticky ends form complementary base pairs, aiding ligation with target DNA fragments."
      },
      {
        id: 23,
        question: "GAT-B 2022: Southern blotting is used for detection of:",
        options: ["Protein", "DNA", "RNA", "Lipids"],
        correct: 1,
        explanation: "Southern blotting detects specific DNA sequences; Northern detects RNA; Western detects proteins."
      },
      {
        id: 24,
        question: "GAT-B 2022: A cloning vector must contain:",
        options: ["Origin of replication", "Selectable marker", "Cloning site", "All of the above"],
        correct: 3,
        explanation: "Functional cloning vectors require an ori, selectable marker (e.g. antibiotic resistance), and multiple cloning site (MCS)."
      },
      {
        id: 25,
        question: "GAT-B 2023: Transformation in bacteria refers to:",
        options: ["Viral infection", "Uptake of naked DNA", "Cell division", "Protein synthesis"],
        correct: 1,
        explanation: "Transformation is the uptake and incorporation of exogenous naked DNA from the surrounding medium into competent bacterial cells."
      },
      {
        id: 26,
        question: "GAT-B 2023: Which blotting technique is used to detect RNA?",
        options: ["Southern blot", "Northern blot", "Western blot", "Eastern blot"],
        correct: 1,
        explanation: "Northern blotting isolates and identifies specific RNA transcripts using labeled nucleic acid probes."
      },
      {
        id: 27,
        question: "GAT-B 2023: Reporter genes are used to:",
        options: ["Replicate plasmids", "Identify transformed cells", "Destroy vectors", "Synthesize proteins"],
        correct: 1,
        explanation: "Reporter genes (such as lacZ or GFP) produce easily detectable assays to identify transformed cells or track promoter activity."
      },
      {
        id: 28,
        question: "GAT-B 2024: CRISPR-Cas9 is mainly used for:",
        options: ["DNA sequencing", "Genome editing", "Protein purification", "Southern blotting"],
        correct: 1,
        explanation: "CRISPR-Cas9 uses guide RNA to induce double-stranded DNA breaks for precise site-specific genome editing."
      },
      {
        id: 29,
        question: "GAT-B 2024: Which of the following acts as selectable marker in plasmids?",
        options: ["Ampicillin resistance gene", "Helicase", "Primase", "Histone"],
        correct: 0,
        explanation: "Antibiotic resistance genes (like ampR) select host bacteria that successfully took up the plasmid on antibiotic media."
      },
      {
        id: 30,
        question: "GAT-B 2024: The denaturation step in PCR generally occurs at:",
        options: ["37°C", "55°C", "72°C", "95°C"],
        correct: 3,
        explanation: "Thermal denaturation of double-stranded DNA during PCR occurs at 94°C–98°C (commonly 95°C)."
      }
    ]
  },
  {
    id: "topic-04",
    topicNum: "TOPIC 04",
    name: "Animal Cell Culture & Biomanufacturing",
    shortName: "Animal Cell Culture",
    icon: "🧫",
    color: "#F97316",
    notesCount: "18 pages",
    module: "Module 3 of 4",
    progress: 60,
    tagline: "Full 18-Page Master Textbook: Cell lines, media, cryopreservation, kinetics, microcarriers, hybridomas, iPSCs & SCNT.",
    pdfTitle: "Topic 04 - Animal Cell Culture & Biomanufacturing.pdf",
    sections: [
      {
        title: "1. Animal Cell Culture Fundamentals & Cell Lines",
        content: `• Primary Culture: Direct from fresh tissue; diploid, finite lifespan due to telomere shortening.
• Finite Lines: 20-80 population doublings before Hayflick limit / senescence.
• Continuous (Immortalized) Lines: Tumor-derived or oncogene-transformed (SV40 T-Ag, hTERT); infinite lifespan, aneuploid (CHO, HeLa, Vero). Doubling time: ~12-24 h.
• Primary Explants: Aseptic harvest, 0.25% trypsin + 0.02% EDTA dissociation, serum-inactivation.`
      },
      {
        title: "2. Media Composition & Growth Parameters",
        content: `• Media Formulations: Synthetic (DMEM, RPMI-1640, Ham's F12) vs Serum-Free Media (SFM, with insulin/transferrin).
• Fetal Bovine Serum (FBS): Provides growth factors (PDGF, EGF), transport proteins (transferrin, albumin), attachment factors (fibronectin) & shear protection.
• Buffering: Bicarbonate-CO2 buffer (5-10% CO2, pH 7.2-7.4). pH = pKa + log([HCO3-]/[H2CO3]), pKa = 6.1. Phenol red turns yellow below pH 6.8.
• Conditions: 37°C ± 0.5°C, 290-320 mOsm/kg H2O osmolality.`
      },
      {
        title: "3. Cryopreservation & Thawing Mechanics",
        content: `• Cryopreservation: Liquid nitrogen at -196°C.
• Permeable CPAs: 10% DMSO, Glycerol (crosses membrane, prevents ice crystal grids).
• Non-Permeable CPAs: Sucrose, PVP (extracellular osmotic dehydration).
• Golden Rule: Cool SLOW (-1°C/min down to -80°C), thaw FAST (37°C water bath in 60-90s) to prevent ice recrystallization.`
      },
      {
        title: "4. Anchorage vs. Non-Anchorage Culture",
        content: `• Adherent Cells: Require hydrophilic substrate (plasma-treated polystyrene with Ca2+/Mg2+ and integrin binding). Detach via trypsinization. Dying when detached = Anoikis.
• Suspension Cells: Hematopoietic & adapted industrial lines (CHO, HeLa-S) in stirred-tank bioreactors. Protected with Pluronic F-68 surfactant.`
      },
      {
        title: "5. Cell Growth Kinetics & Yield Coefficients",
        content: `• Exponential Growth: dX/dt = μX → Xt = X0 · e^(μt).
• Specific Growth Rate: μ = (ln Xt - ln X0) / t = 2.303 · log10(Xt / X0) / t.
• Doubling Time: td = 0.693 / μ.
• Biomass Yield Index: Y_(X/S) = (Xt - X0) / (S0 - St).`
      },
      {
        title: "6. Micro- & Macro-Carrier Technology",
        content: `• Microcarriers: 100-300 µm beads (dextran, glass) for monolayer growth in stirred tanks.
• Macrocarriers: Porous 3D matrices (foam, ceramic) for shear protection in packed-bed reactors.
• Total Surface Area Equation: A_total = 3·Cb / (r·ρ_p). Reducing bead radius r increases available surface area.`
      },
      {
        title: "7. Hybridoma Technology & Monoclonal Antibodies",
        content: `• Monoclonal Antibody (mAb) Production: Fusion of B-lymphocytes (spleen) + HGPRT- myeloma cells using PEG.
• HAT Selection Medium (Hypoxanthine, Aminopterin, Thymidine):
  1. De novo pathway blocked by Aminopterin.
  2. Unfused Myeloma (HGPRT-) dies (cannot use salvage).
  3. Unfused B-cells die (finite lifespan).
  4. Hybridomas (HGPRT+ from B-cell, immortal from myeloma) survive.`
      },
      {
        title: "8. Stem Cell Technology & iPSCs",
        content: `• Potency: Totipotent (zygote), Pluripotent (ESCs from ICM), Multipotent (HSCs), Unipotent (basal skin).
• iPSCs (Yamanaka Factors): Oct4, Sox2, Klf4, c-Myc reprogram adult somatic cells to pluripotency. Avoids blastocyst destruction.`
      },
      {
        title: "9. Animal Cloning (SCNT) & Transgenic Animals",
        content: `• SCNT: Enucleation of MII oocyte → Donor cell (G0 phase) electrofusion → Chemical activation → Surrogate implantation.
• Bottleneck: Incomplete epigenetic reprogramming (Large Offspring Syndrome).
• Transgenics: Pronuclear microinjection, ESC-mediated transfer, CRISPR-Cas9 targeted knock-in.`
      },
      {
        title: "10. Comprehensive FAQs & GATE Preparation",
        content: `• L-Glutamine: Essential, but degrades into toxic NH4+ at 37°C; replaced by L-alanyl-L-glutamine.
• Pluronic F-68: Non-ionic surfactant preventing cell damage from bubble bursting.
• Mycoplasma: 0.15-0.3 µm, no cell wall, passes 0.22 µm filters, penicillin resistant.`
      }
    ],
    examTraps: [
      "Cool slow (-1°C/min), thaw fast (37°C) — golden rule of cryopreservation.",
      "HAT selection: Aminopterin blocks de novo pathway; HGPRT- myeloma cells die because they cannot use salvage.",
      "Phenol red is a pH indicator, NOT a buffer; bicarbonate/CO2 is the actual buffer system."
    ],
    pyqs: [
      {
        id: 1,
        question: "GAT-B 2020: Animal cell culture requires:",
        options: ["High salt only", "Growth factors and sterile conditions", "Anaerobic environment only", "Soil nutrients"],
        correct: 1,
        explanation: "Animal cell culture requires growth factors (usually provided by serum such as FBS) and strict sterile/aseptic conditions."
      },
      {
        id: 2,
        question: "GAT-B 2020: The commonly used medium for animal cell culture is:",
        options: ["MS medium", "LB broth", "DMEM", "Nutrient agar"],
        correct: 2,
        explanation: "Dulbecco's Modified Eagle Medium (DMEM) is a widely used synthetic basal medium for animal cell culture."
      },
      {
        id: 3,
        question: "GAT-B 2020: Trypsinization is used for:",
        options: ["DNA isolation", "Cell detachment", "Protein sequencing", "Electrophoresis"],
        correct: 1,
        explanation: "Trypsin is a proteolytic enzyme used to break cell-surface adhesion proteins and detach anchorage-dependent cells."
      },
      {
        id: 4,
        question: "GAT-B 2021: Primary cell cultures are derived directly from:",
        options: ["Immortal cell lines", "Fresh tissues", "Hybridomas", "Plasmids"],
        correct: 1,
        explanation: "Primary cell cultures are established directly from fresh animal or human tissues through mechanical/enzymatic dissociation."
      },
      {
        id: 5,
        question: "GAT-B 2021: CO2 incubators in animal tissue culture generally maintain:",
        options: ["100% oxygen", "5% CO2", "Nitrogen only", "Vacuum"],
        correct: 1,
        explanation: "CO2 incubators maintain 5% CO2 to regulate the bicarbonate buffer system, keeping the medium pH strictly at 7.2–7.4."
      },
      {
        id: 6,
        question: "GAT-B 2021: HeLa cells are an example of:",
        options: ["Plant cells", "Continuous cell line", "Stem cells only", "Hybrid cells"],
        correct: 1,
        explanation: "HeLa cells are an immortalized, continuous human epithelial cell line derived from cervical cancer."
      },
      {
        id: 7,
        question: "In hybridoma technology, HAT medium selects for hybrid cells because:",
        options: ["Aminopterin blocks de novo synthesis, forcing cells to use HGPRT-mediated salvage pathway", "Hypoxanthine is toxic to unfused B-cells", "Thymidine kills HGPRT-positive cells", "PEG degrades unfused myeloma cells"],
        correct: 0,
        explanation: "Aminopterin blocks de novo nucleotide synthesis. HGPRT-deficient myeloma cells cannot use the salvage pathway and die, while B-cell-myeloma hybrids survive."
      },
      {
        id: 8,
        question: "Which combination of transcription factors represents the Yamanaka Factors used for iPSC generation?",
        options: ["Oct4, Sox2, Klf4, c-Myc", "Nanog, Lin28, Sox2, Myc", "p53, Rb, E2F, Cyclin D", "CD4, CD8, TCR, MHC"],
        correct: 0,
        explanation: "Oct4, Sox2, Klf4, and c-Myc are the four Yamanaka factors that reprogram adult somatic cells into induced pluripotent stem cells."
      }
    ]
  },
  {
    id: "topic-05",
    topicNum: "TOPIC 05",
    name: "Bioprocess Engineering",
    shortName: "Bioprocess Engineering",
    icon: "🏭",
    color: "#EC4899",
    notesCount: "3 notes",
    module: "Module 4 of 4",
    progress: 40,
    tagline: "Reactor design, stoichiometry, oxygen mass transfer & sterilization kinetics.",
    pdfTitle: "Topic 05 - Bioprocess Engineering.pdf",
    sections: [
      {
        title: "1. Material & Electron Balances",
        content: `• Biomass Formula: CHaObNc.
• Degree of Reductance (γ): γ = 4 + a - 2b - 3c (for NH3 nitrogen source).
• If nitrogen source is HNO3 (N is +5): γ = 4 + a - 2b + 5c.`
      },
      {
        title: "2. Ideal & Non-Ideal Reactors",
        content: `• Batch: Closed system; dX/dt = μX.
• CSTR / Chemostat: Open, steady state. Dilution rate D = F/V. At steady state, μ = D. Washout occurs when D > μmax.
• PFR: Plug flow reactor, no axial mixing; τ = V/F = ∫dS/(-rS).`
      },
      {
        title: "3. Mass Transfer & Sterilization Kinetics",
        content: `• Oxygen Transfer Rate (OTR): OTR = kLa(C* - CL) ≥ OUR = qO2 · X.
• Sterilization Del Factor (∇): ∇ = ln(N0/Nt) = ∫kd dt.
• HTST (High-Temperature Short-Time): 140°C for seconds sterilizes media while preserving heat-labile nutrients.`
      }
    ],
    examTraps: [
      "Chemostat golden rule: the culture grows exactly as fast as you feed it — μ = D at steady state.",
      "At chemostat steady state, residual substrate S is set by dilution rate D, NOT by feed concentration Sin.",
      "Washout occurs when dilution rate D exceeds the maximum achievable growth rate μmax."
    ],
    pyqs: [
      {
        id: 1,
        question: "Which parameter describes volumetric oxygen mass transfer capability in a fermenter?",
        options: ["kLa", "Re (Reynolds number)", "N (Impeller speed)", "Kd"],
        correct: 0,
        explanation: "kLa (volumetric oxygen mass transfer coefficient) measures gas-liquid mass transfer in bioreactors."
      }
    ]
  }
];

const CHALLENGES = {
  genetics: {
    title: "Biomolecules & Bioenergetics PYQs",
    subject: "Biomolecules & Bioenergetics (GAT-B 2020-2023)",
    color: "#F97316",
    bg: "#FFF3E8",
    xp: 200,
    timeLimit: 900,
    questions: COURSE_TOPICS[0].pyqs
  },
  mock: {
    title: "Genetics & MolBio PYQs",
    subject: "Genetics & Molecular Biology (GAT-B 2020-2024)",
    color: "#8B5CF6",
    bg: "#F3F0FF",
    xp: 300,
    timeLimit: 1200,
    questions: COURSE_TOPICS[1].pyqs
  }
};

/* ── 19-Page Master Textbook Pages for Biomolecules, Membranes, Enzymes, Metabolism & Bioenergetics ── */
const FULL_BIOMOLECULES_19_PAGES = [
  `<h1 style="font-size:22px; color:#0f766e; margin:0 0 10px; border-bottom:2px solid #0f766e; padding-bottom:8px;">Biomolecules, Membranes, Enzymes, Metabolism and Bioenergetics</h1>
<p style="font-style:italic; color:#475569; font-size:13px; margin-bottom:24px;">A high-yield, exam-focused study guide for undergraduate B.Tech Biotechnology students, designed for university examinations and GATE preparation.</p>
<div style="background:#ccfbf1; border-left:4px solid #0d9488; padding:12px 16px; margin-bottom:20px; font-weight:700; color:#0f766e;">
  1. Biomolecules: Structure and Functions
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Definition</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Biomolecules are the naturally occurring chemical compounds of living organisms that form cellular structure, store and release energy, regulate biological processes and carry hereditary information.<br/>
  The four major classes are carbohydrates, lipids, proteins and nucleic acids.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Core Concept</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Living systems are built from a small number of recurring chemical units, but the arrangement of these units gives rise to a remarkable diversity of biological functions. For examinations and GATE, the central principle is that <strong>molecular structure determines molecular function</strong>, so every biomolecule must be studied with its building blocks, bonds, properties and biological role.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Working Principle</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Biomolecules function through specific chemical interactions such as covalent bonding, hydrogen bonding, ionic interactions, hydrophobic effects and molecular recognition. Their three-dimensional arrangement determines stability, reactivity and biological specificity.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Types — Carbohydrates</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Carbohydrates are polyhydroxy aldehydes or ketones, or compounds that yield them on hydrolysis. They function in energy supply, energy storage, structural support and cell recognition.<br/>
  • <strong>Monosaccharides:</strong> glucose, fructose, galactose, ribose, deoxyribose.<br/>
  • <strong>Oligosaccharides:</strong> disaccharides such as sucrose, lactose and maltose.
</p>`,
  `<p style="font-size:13.5px; color:#334155; line-height:1.7; margin-top:0;">
  • <strong>Polysaccharides:</strong> starch, glycogen, cellulose and chitin.
</p>
<h4 style="font-size:14px; color:#0f172a; margin:14px 0 8px;">Important Structural Points (Carbohydrates)</h4>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li>Monosaccharides may exist in linear or cyclic form (glucose in pyranose form).</li>
  <li>Alpha and beta anomers differ in orientation at the anomeric carbon.</li>
  <li>Glycosidic bonds join sugar units together.</li>
  <li>Starch contains amylose and amylopectin; glycogen is more highly branched.</li>
  <li>Cellulose has beta-1,4 glycosidic bonds, which humans cannot digest.</li>
</ul>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Types — Lipids</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Lipids are hydrophobic or amphipathic biomolecules that are insoluble in water but soluble in non-polar solvents. They serve as energy reserves, membrane components, signaling molecules and protective substances.<br/>
  • <strong>Simple lipids:</strong> fats and oils.<br/>
  • <strong>Compound lipids:</strong> phospholipids, glycolipids, lipoproteins.<br/>
  • <strong>Derived lipids:</strong> fatty acids, steroids, terpenes, eicosanoids.
</p>
<h4 style="font-size:14px; color:#0f172a; margin:14px 0 8px;">Important Structural Points (Lipids)</h4>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li>Fatty acids may be saturated or unsaturated (double bonds increase fluidity).</li>
  <li>Triacylglycerols are esters of glycerol with three fatty acids.</li>
  <li>Phospholipids contain a polar head group and two hydrophobic tails.</li>
  <li>Steroids possess a characteristic four-ring structure.</li>
</ul>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 6px;">Types — Proteins</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Proteins are polymers of amino acids linked by peptide bonds and are the most functionally versatile biomolecules in cells.<br/>
  • <strong>By Shape:</strong> Fibrous (collagen, keratin, elastin) vs Globular (enzymes, hemoglobin, myoglobin, antibodies).<br/>
  • <strong>By Composition:</strong> Simple (yield only amino acids) vs Conjugated (prosthetic group e.g. glycoproteins, lipoproteins, metalloproteins).
</p>
<h4 style="font-size:14px; color:#0f172a; margin:14px 0 8px;">Structural Levels of Proteins</h4>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li><strong>Primary:</strong> amino acid sequence.</li>
  <li><strong>Secondary:</strong> alpha-helix and beta-pleated sheet stabilized by hydrogen bonds.</li>
  <li><strong>Tertiary:</strong> three-dimensional folding due to side-chain interactions.</li>
  <li><strong>Quaternary:</strong> association of two or more polypeptide chains.</li>
</ul>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Types — Nucleic Acids</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Nucleic acids are polymers of nucleotides and store, transmit and express genetic information.<br/>
  • <strong>DNA:</strong> deoxyribonucleic acid, the main hereditary material.<br/>
  • <strong>RNA:</strong> ribonucleic acid, involved in gene expression and regulation.<br/>
  Components of nucleotide: Nitrogenous base + Pentose sugar + Phosphate group.
</p>`,
  `<h4 style="font-size:14px; color:#0f172a; margin:0 0 10px;">Structure-Function Relationship Table</h4>
<table style="width:100%; border-collapse:collapse; font-size:12.5px; margin-bottom:20px;">
  <thead>
    <tr style="background:#1e293b; color:#fff; text-align:left;">
      <th style="padding:8px;">Biomolecule</th>
      <th style="padding:8px;">Building unit</th>
      <th style="padding:8px;">Characteristic bond</th>
      <th style="padding:8px;">Major function</th>
      <th style="padding:8px;">High-yield example</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#f8fafc;"><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Carbohydrates</td><td style="padding:8px; border:1px solid #e2e8f0;">Monosaccharides</td><td style="padding:8px; border:1px solid #e2e8f0;">Glycosidic bond</td><td style="padding:8px; border:1px solid #e2e8f0;">Energy and structure</td><td style="padding:8px; border:1px solid #e2e8f0;">Glycogen for storage</td></tr>
    <tr><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Lipids</td><td style="padding:8px; border:1px solid #e2e8f0;">Fatty acids & glycerol</td><td style="padding:8px; border:1px solid #e2e8f0;">Ester bond</td><td style="padding:8px; border:1px solid #e2e8f0;">Membrane & energy storage</td><td style="padding:8px; border:1px solid #e2e8f0;">Phospholipid bilayer</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Proteins</td><td style="padding:8px; border:1px solid #e2e8f0;">Amino acids</td><td style="padding:8px; border:1px solid #e2e8f0;">Peptide bond</td><td style="padding:8px; border:1px solid #e2e8f0;">Catalysis and structure</td><td style="padding:8px; border:1px solid #e2e8f0;">Enzymes and collagen</td></tr>
    <tr><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Nucleic acids</td><td style="padding:8px; border:1px solid #e2e8f0;">Nucleotides</td><td style="padding:8px; border:1px solid #e2e8f0;">Phosphodiester bond</td><td style="padding:8px; border:1px solid #e2e8f0;">Genetic information</td><td style="padding:8px; border:1px solid #e2e8f0;">DNA and RNA</td></tr>
  </tbody>
</table>
<h4 style="font-size:14px; color:#0f172a; margin:14px 0 8px;">Key Equations & Derivations</h4>
<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:8px; font-size:13px; line-height:1.7;">
  1. Carbohydrates empirical formula: (CH2O)n<br/>
  2. Peptide bond formation: Amino acid 1 + Amino acid 2 -&gt; Dipeptide + H2O<br/>
  3. Ester bond in triacylglycerol: Glycerol + 3 Fatty acids -&gt; Triacylglycerol + 3 H2O<br/>
  4. Nucleotide assembly: Nitrogenous base + Pentose sugar + Phosphate -&gt; Nucleotide
</div>`,
  `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px; margin-bottom:20px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">Typical 5-Mark Exam Question & Model Answer</h4>
  <p style="font-weight:700; color:#14532d; font-size:13px; margin-bottom:6px;">Question: Explain the structure and functions of major biomolecules in living cells.</p>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    <strong>Model Answer:</strong> Biomolecules are chemical compounds of living systems classified into carbohydrates, lipids, proteins and nucleic acids.<br/>
    • <strong>Carbohydrates</strong> (monosaccharide units) function in energy supply, storage (glycogen/starch) and structural support (cellulose).<br/>
    • <strong>Lipids</strong> (fatty acids & glycerol) form cell membranes (phospholipids), long-term energy storage (TAGs) and cell signaling.<br/>
    • <strong>Proteins</strong> (amino acid polymers) perform catalytic (enzymes), structural (collagen), transport (hemoglobin) and defense (antibodies) roles.<br/>
    • <strong>Nucleic Acids</strong> (nucleotide polymers) store and transmit genetic information (DNA & RNA).
  </div>
</div>
<div style="background:#ccfbf1; border-left:4px solid #0d9488; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#0f766e;">
  2. Biological Membranes, Structure, Action Potential and Transport Processes
</div>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  A biological membrane is a selectively permeable boundary composed mainly of lipids, proteins and carbohydrates that separates the internal and external environments of cells and organelles.
</p>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">Working Principle & Membrane Types</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  According to the <strong>fluid mosaic model</strong>, the membrane consists of a phospholipid bilayer in which proteins are embedded and move laterally. Hydrophobic lipid tails face inward, while hydrophilic heads face the aqueous environment.<br/>
  • Integral proteins (transport, receptors) vs Peripheral proteins (signaling, support).<br/>
  • Cholesterol regulates membrane fluidity in animal cells.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 8px;">Transport Processes across Membranes</h3>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li><strong>Simple diffusion:</strong> movement along concentration gradient without energy or carrier.</li>
  <li><strong>Facilitated diffusion:</strong> movement along gradient with transport proteins.</li>
  <li><strong>Osmosis:</strong> movement of water across a semipermeable membrane.</li>
  <li><strong>Active transport:</strong> movement against gradient using ATP (e.g. Na+/K+-ATPase).</li>
  <li><strong>Secondary active transport:</strong> driven by electrochemical gradients.</li>
</ul>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 8px;">Action Potential Kinetics</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Depolarization occurs mainly due to Na+ influx; repolarization due to K+ efflux. Nernst equation at 25°C: E = (0.0591/z) * log([ion]out / [ion]in).
</p>`,
  `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px; margin-bottom:20px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">Typical 5-Mark Exam Question & Model Answer</h4>
  <p style="font-weight:700; color:#14532d; font-size:13px; margin-bottom:6px;">Question: Explain the fluid mosaic model of membrane structure and transport processes across the membrane.</p>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    <strong>Model Answer:</strong> The fluid mosaic model states that biological membranes consist of a fluid phospholipid bilayer with mobile embedded proteins.<br/>
    Hydrophilic heads face external/internal aqueous phases, while hydrophobic fatty acid tails form the core.<br/>
    Membrane proteins function as channels, carriers, receptors, and enzymes.<br/>
    Transport occurs via passive mechanisms (simple diffusion, facilitated diffusion, osmosis) and active mechanisms (Na+/K+ pump, vesicular endo/exocytosis).
  </div>
</div>
<div style="background:#ccfbf1; border-left:4px solid #0d9488; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#0f766e;">
  3. Enzymes: Classification, Kinetics and Mechanism of Action
</div>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Enzymes are biological catalysts (mainly proteins, or catalytic RNA ribozymes) that accelerate chemical reactions by lowering activation energy and stabilizing transition states without altering reaction equilibrium (ΔG).
</p>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">IUBMB Classification of Enzymes (6 Classes)</h3>
<ol style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li><strong>Oxidoreductases:</strong> catalyze oxidation-reduction reactions (e.g. dehydrogenases).</li>
  <li><strong>Transferases:</strong> transfer functional groups from one molecule to another (e.g. kinases).</li>
  <li><strong>Hydrolases:</strong> catalyze bond cleavage by adding water (e.g. phosphatases, lipases).</li>
  <li><strong>Lyases:</strong> add/remove groups to double bonds without hydrolysis (e.g. decarboxylases).</li>
  <li><strong>Isomerases:</strong> catalyze intramolecular rearrangements (e.g. isomerases, mutases).</li>
  <li><strong>Ligases:</strong> join two molecules using ATP hydrolysis (e.g. synthetases, DNA ligase).</li>
</ol>
<h4 style="font-size:14px; color:#0f172a; margin:14px 0 8px;">Associated Terms</h4>
<p style="font-size:13px; color:#334155; line-height:1.6;">
  • <strong>Apoenzyme:</strong> inactive protein component alone.<br/>
  • <strong>Holoenzyme:</strong> complete catalytically active enzyme (Apoenzyme + Cofactor).<br/>
  • <strong>Coenzyme:</strong> organic non-protein cofactor (vitamin-derived e.g. NAD+, FAD).<br/>
  • <strong>Prosthetic group:</strong> tightly or covalently bound cofactor (e.g. heme).
</p>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">Enzyme Kinetics & Michaelis-Menten Equation</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Basic scheme: E + S &lt;-&gt; ES -&gt; E + P<br/>
  Michaelis-Menten Equation: v = (Vmax * [S]) / (Km + [S])<br/>
  Lineweaver-Burk Double Reciprocal Plot: 1/v = (Km/Vmax)*(1/[S]) + 1/Vmax
</p>
<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-top:14px;">
  <h4 style="margin:0 0 8px; color:#0f172a; font-size:14px;">Meaning of Kinetic Parameters</h4>
  <ul style="font-size:13px; color:#334155; line-height:1.6; padding-left:20px; margin:0;">
    <li><strong>Vmax:</strong> maximum reaction velocity at enzyme saturation.</li>
    <li><strong>Km:</strong> substrate concentration at half-Vmax. Lower Km indicates higher enzyme affinity.</li>
    <li><strong>kcat:</strong> turnover number (kcat = Vmax / [E]t), molecules converted per second.</li>
    <li><strong>kcat/Km:</strong> catalytic efficiency index.</li>
  </ul>
</div>`,
  `<h4 style="font-size:14px; color:#0f172a; margin:0 0 8px;">Derivation Outline of Michaelis-Menten Equation</h4>
<ol style="font-size:13px; color:#334155; line-height:1.7; padding-left:20px;">
  <li>Reaction: E + S &lt;-&gt; ES -&gt; E + P</li>
  <li>Steady-state assumption: Rate of ES formation = Rate of ES breakdown -&gt; k1[E][S] = (k_-1 + k2)[ES]</li>
  <li>Define Michaelis constant: Km = (k_-1 + k2) / k1</li>
  <li>Conservation of enzyme: [E]t = [E] + [ES] -&gt; [E] = [E]t - [ES]</li>
  <li>Substitute [E]: k1([E]t - [ES])[S] = (k_-1 + k2)[ES]</li>
  <li>Simplify for [ES] and velocity v = k2[ES]: v = (Vmax * [S]) / (Km + [S])</li>
</ol>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">Enzyme Inhibition Modes</h3>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li><strong>Competitive Inhibition:</strong> Inhibitor binds active site. Km increases, Vmax unchanged. Overcome by excess [S].</li>
  <li><strong>Non-Competitive Inhibition:</strong> Inhibitor binds separate site. Km unchanged, Vmax decreases. Not reversed by [S].</li>
  <li><strong>Uncompetitive Inhibition:</strong> Inhibitor binds only to ES complex. Both Km and Vmax decrease.</li>
  <li><strong>Irreversible Inhibition:</strong> Covalent or tight permanent binding (e.g. aspirin inhibiting COX).</li>
</ul>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 8px;">Allosteric Regulation</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Allosteric enzymes feature regulatory sites distinct from the active site and exhibit sigmoidal kinetics (e.g. phosphofructokinase-1 in glycolysis).
</p>`,
  `<h4 style="font-size:14px; color:#0f172a; margin:0 0 10px;">Quick Comparison Table of Enzyme Inhibition</h4>
<table style="width:100%; border-collapse:collapse; font-size:12.5px; margin-bottom:20px;">
  <thead>
    <tr style="background:#1e293b; color:#fff; text-align:left;">
      <th style="padding:8px;">Inhibition Type</th>
      <th style="padding:8px;">Binding Site</th>
      <th style="padding:8px;">Effect on Km</th>
      <th style="padding:8px;">Effect on Vmax</th>
      <th style="padding:8px;">Reversed by [S]?</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#f8fafc;"><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Competitive</td><td style="padding:8px; border:1px solid #e2e8f0;">Active site</td><td style="padding:8px; border:1px solid #e2e8f0;">Increases (Km up)</td><td style="padding:8px; border:1px solid #e2e8f0;">No change</td><td style="padding:8px; border:1px solid #e2e8f0;">Yes</td></tr>
    <tr><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Non-competitive</td><td style="padding:8px; border:1px solid #e2e8f0;">Separate site on E/ES</td><td style="padding:8px; border:1px solid #e2e8f0;">No change</td><td style="padding:8px; border:1px solid #e2e8f0;">Decreases (Vmax down)</td><td style="padding:8px; border:1px solid #e2e8f0;">No</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Uncompetitive</td><td style="padding:8px; border:1px solid #e2e8f0;">ES complex only</td><td style="padding:8px; border:1px solid #e2e8f0;">Decreases (Km down)</td><td style="padding:8px; border:1px solid #e2e8f0;">Decreases (Vmax down)</td><td style="padding:8px; border:1px solid #e2e8f0;">No</td></tr>
  </tbody>
</table>
<div style="background:#ccfbf1; border-left:4px solid #0d9488; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#0f766e;">
  4. Basic Concepts and Design of Metabolism
</div>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 6px;">Metabolic Architecture: Catabolism vs. Anabolism</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  • <strong>Catabolism:</strong> oxidative breakdown of complex molecules releasing energy (ATP, NADH).<br/>
  • <strong>Anabolism:</strong> reductive synthesis of complex macromolecules requiring energy input.<br/>
  • <strong>Amphibolic Pathways:</strong> dual role in breakdown and synthesis (e.g. Citric Acid Cycle).<br/>
  Central interconnecting hubs: pyruvate, acetyl-CoA, oxaloacetate, ATP, NADH, NADPH.
</p>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">Carbohydrate Metabolism — Glycolysis</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Glycolysis is the cytosolic 10-step pathway converting 1 glucose into 2 pyruvate.<br/>
  Key regulatory enzyme: <strong>Phosphofructokinase-1 (PFK-1)</strong>.<br/>
  Overall reaction:<br/>
  Glucose + 2 ADP + 2 Pi + 2 NAD+ -&gt; 2 Pyruvate + 2 ATP + 2 NADH + 2 H+ + 2 H2O<br/>
  Net ATP yield = 4 (produced) - 2 (invested) = 2 ATP.
</p>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">Central Metabolic Pathways Overview</h3>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li><strong>Gluconeogenesis:</strong> Glucose synthesis from non-carbohydrates (lactate, glycerol, amino acids) in liver/kidney. Bypasses 3 irreversible steps of glycolysis.</li>
  <li><strong>Citric Acid Cycle (TCA):</strong> Mitochondrial matrix oxidation of acetyl-CoA. Per acetyl-CoA yields 3 NADH + 1 FADH2 + 1 GTP.</li>
  <li><strong>Beta Oxidation:</strong> Mitochondrial matrix degradation of fatty acids into 2-carbon acetyl-CoA units.</li>
  <li><strong>Fatty Acid Synthesis:</strong> Cytosolic assembly catalyzed by acetyl-CoA carboxylase (ACC).</li>
  <li><strong>Urea Cycle:</strong> Hepatic detoxification of ammonia into urea.</li>
</ul>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">Photosynthesis, Respiration & Electron Transport Chain</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  • <strong>Photosynthesis:</strong> Light reactions generate ATP and NADPH; Calvin cycle fixes CO2.<br/>
  • <strong>Respiration & ETC:</strong> Electron transfer from NADH/FADH2 through Complexes I–IV to O2 creates a proton gradient across inner mitochondrial membrane, driving ATP synthesis via F1F0-ATP synthase (chemiosmotic theory).
</p>
<div style="background:#ccfbf1; border-left:4px solid #0d9488; padding:12px 16px; margin-top:20px; font-weight:700; color:#0f766e;">
  5. Bioenergetics & Thermodynamics
</div>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">Thermodynamics & Free Energy Equations</h3>
<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:14px; border-radius:8px; font-size:13px; line-height:1.8;">
  1. Gibbs free energy relation: ΔG = ΔH - T*ΔS<br/>
  2. Standard free energy relation: ΔG = ΔG° + RT*ln(Q)<br/>
  3. Equilibrium constant relation: ΔG° = -RT*ln(Keq)<br/>
  4. ATP hydrolysis: ATP + H2O -&gt; ADP + Pi + energy (ΔG° = -30.5 kJ/mol)<br/>
  5. Free energy and redox potential: ΔG° = -nF*ΔE°
</div>
<p style="font-size:13px; color:#334155; margin-top:10px;">
  Spontaneous reactions proceed when ΔG &lt; 0 (exergonic). Endergonic reactions (ΔG &gt; 0) are driven by coupling with ATP hydrolysis.
</p>`,
  `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px; margin-bottom:20px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">Typical 5-Mark Exam Question & Model Answer</h4>
  <p style="font-weight:700; color:#14532d; font-size:13px; margin-bottom:6px;">Question: What is bioenergetics? Explain the importance of ATP in cellular energy transactions.</p>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    <strong>Model Answer:</strong> Bioenergetics studies energy flow and transformations in biological systems.<br/>
    ATP acts as the universal energy currency of cells because hydrolysis of its phosphoanhydride bonds releases usable free energy (ΔG° = -30.5 kJ/mol).<br/>
    Cells couple exergonic ATP hydrolysis to endergonic processes such as active transport (Na+/K+ pump), mechanical work (muscle contraction) and anabolic biosynthesis.
  </div>
</div>
<h4 style="font-size:14px; color:#0f172a; margin:14px 0 8px;">Rapid Comparison Table of Core Syllabus Topics</h4>
<table style="width:100%; border-collapse:collapse; font-size:12px;">
  <thead>
    <tr style="background:#1e293b; color:#fff; text-align:left;">
      <th style="padding:6px;">Topic</th>
      <th style="padding:6px;">Most Important Point</th>
      <th style="padding:6px;">Frequent Exam Focus</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#f8fafc;"><td style="padding:6px; border:1px solid #e2e8f0; font-weight:700;">Biomolecules</td><td style="padding:6px; border:1px solid #e2e8f0;">Structure determines function</td><td style="padding:6px; border:1px solid #e2e8f0;">Building blocks, glycosidic/peptide/ester bonds</td></tr>
    <tr><td style="padding:6px; border:1px solid #e2e8f0; font-weight:700;">Membranes</td><td style="padding:6px; border:1px solid #e2e8f0;">Fluid mosaic model &amp; selective permeability</td><td style="padding:6px; border:1px solid #e2e8f0;">Active vs passive transport, Nernst equation</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:6px; border:1px solid #e2e8f0; font-weight:700;">Enzymes</td><td style="padding:6px; border:1px solid #e2e8f0;">Catalysts lower activation energy</td><td style="padding:6px; border:1px solid #e2e8f0;">Michaelis-Menten (Km, Vmax), inhibition patterns</td></tr>
    <tr><td style="padding:6px; border:1px solid #e2e8f0; font-weight:700;">Metabolism</td><td style="padding:6px; border:1px solid #e2e8f0;">Interconnected regulated pathways</td><td style="padding:6px; border:1px solid #e2e8f0;">Glycolysis net yield, TCA cycle, beta-oxidation</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:6px; border:1px solid #e2e8f0; font-weight:700;">Bioenergetics</td><td style="padding:6px; border:1px solid #e2e8f0;">ATP couples energy release &amp; use</td><td style="padding:6px; border:1px solid #e2e8f0;">ΔG = ΔH - T*ΔS, redox ΔG° = -nF*ΔE°</td></tr>
  </tbody>
</table>`,
  `<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:20px;">
  <h4 style="margin:0 0 10px; color:#0f172a; font-size:14px;">🎓 Final Exam Preparation Protocol</h4>
  <ol style="font-size:13px; color:#334155; line-height:1.7; padding-left:20px; margin:0;">
    <li>Draw pathways (Glycolysis, TCA cycle, beta-oxidation) at least three times from memory.</li>
    <li>Memorize all major equations (ΔG = ΔH - T*ΔS, v = Vmax*[S]/(Km+[S]), Nernst equation) and define every variable.</li>
    <li>Solve previous GATE and university questions topic-wise.</li>
    <li>Practice writing compact 5-mark model answers within one page.</li>
    <li>Revise regulatory enzymes (PFK-1, ACC) and ATP yield repeatedly.</li>
  </ol>
</div>`
];

const FULL_GENETICS_23_PAGES = [
  // Page 1
  `<h1 style="font-size:22px; color:#1e3a8a; margin:0 0 10px; border-bottom:2px solid #1e3a8a; padding-bottom:8px;">MASTER ENGINEERING COURSE GUIDE:<br/>ADVANCED GENETICS & MOLECULAR BIOLOGY</h1>
  <p style="font-style:italic; color:#475569; font-size:13px; margin-bottom:24px;">The Definitive High-Yield Textbook and Exam Prep Syllabus Framework for B.Tech Undergraduate University Examinations and the Graduate Aptitude Test in Engineering (GATE)</p>
  <div style="background:#e0f2fe; border-left:4px solid #0284c7; padding:12px 16px; margin-bottom:20px; font-weight:700; color:#0369a1;">
    MODULE 1: MOLECULAR STRUCTURE OF GENES AND CHROMOSOMES
  </div>
  <h3 style="font-size:16px; color:#0f172a; margin:16px 0 8px;">1.1 Structural Foundations and Biochemical Architecture</h3>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    The precise definition of a gene has transitioned significantly from a simple abstract hereditary unit into a chemically explicit, highly complex macromolecular layout. Modern molecular biotechnology defines a gene as the complete sequence of chromosomal nucleotides located across specific structural loci that contains the necessary coded instructions for the synthesis of a functional product, whether it be a specialized structural RNA molecule (such as rRNA, tRNA, snRNA, or miRNA) or a polypeptide sequence destined for structural or enzymatic deployment.
  </p>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    The operational constraints of storing extended genomic text within a microscopic cell dictate that DNA cannot exist as an uncoiled macromolecule. For example, the total linear length of human genomic DNA across a single diploid cell nucleus is approximately two meters, yet it must be packed into a sphere with a diameter of only a few micrometers. This massive condensation is accomplished via sequential structural compaction tiers.
  </p>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    In eukaryotic cells, the primary unit of packing is the <strong>nucleosome core particle</strong>. This complex consists of 146 base pairs of double-stranded DNA wound exactly 1.65 times in a left-handed superhelical turn around a core octamer of basic histone proteins. The histone core is a structured complex consisting of two copies each of histones H2A, H2B, H3, and H4. The basic residues (primarily rich in the amino acids lysine and arginine) carry strong positive charges, allowing them to form tight electrostatic interactions with the negatively charged oxygen atoms on the phosphate backbone of DNA.
  </p>`,

  // Page 2
  `<h3 style="font-size:16px; color:#0f172a; margin:0 0 12px;">1.2 Higher-Order Packaging Hierarchies</h3>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">Compaction beyond the basic nucleosome level proceeds systematically to establish high-density chromosomes:</p>
  <ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
    <li><strong>The 11 nm Fiber:</strong> Often described as the "beads-on-a-string" architecture. Features nucleosome cores separated by linker DNA (20–80 bp). Linker histone H1 binds directly where DNA enters/leaves the core, clamping it in place.</li>
    <li><strong>The 30 nm Solenoid Fiber:</strong> The 11 nm string undergoes helical coiling (~6 nucleosomes per turn), increasing packaging density by roughly 40-fold.</li>
    <li><strong>Loop Domains and Mitotic Scaffolding:</strong> The 30 nm fiber folds into extensive loop domains (20 to 100 kb) anchored to a central chromosome scaffold. Key scaffold proteins: <strong>Topoisomerase II</strong> (resolves torsional stress) and <strong>Condensin complex</strong> (dimeric ring driving condensed folding). Mitotic thickness: 700 to 1400 nm.</li>
  </ul>
  <h3 style="font-size:16px; color:#0f172a; margin:20px 0 12px;">1.3 Compartmentalized Epigenetic States: Euchromatin and Heterochromatin</h3>
  <ol style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
    <li><strong>Euchromatin:</strong> Loose, open organization allowing transcription factors and RNA Polymerase ready access. Biochemically distinguished by high <strong>histone tail acetylation</strong> by Histone Acetyltransferases (HATs e.g., H3K9ac, H3K14ac), neutralizing positive charges.</li>
    <li><strong>Heterochromatin:</strong> Highly condensed, transcriptionally silent. Characterized by <strong>histone lysine methylations</strong> (H3K9me3, H3K27me3) by Histone Methyltransferases (HMTs), recruiting Heterochromatin Protein 1 (HP1). Divided into <em>Constitutive Heterochromatin</em> (permanently silent at centromeres/telomeres) and...</li>
  </ol>`,

  // Page 3
  `<p style="font-size:13.5px; color:#334155; line-height:1.7;">
    ...<em>Facultative Heterochromatin</em>, which can dynamically switch between silent and active states in response to developmental signals.
  </p>
  <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:20px; margin-top:24px;">
    <h4 style="margin:0 0 10px; color:#1e293b; font-size:14px;">💡 Module 1 High-Yield Epigenetics Summary</h4>
    <table style="width:100%; border-collapse:collapse; font-size:13px;">
      <thead>
        <tr style="background:#f1f5f9; text-align:left;">
          <th style="padding:8px; border:1px solid #cbd5e1;">Feature</th>
          <th style="padding:8px; border:1px solid #cbd5e1;">Euchromatin</th>
          <th style="padding:8px; border:1px solid #cbd5e1;">Heterochromatin</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="padding:8px; border:1px solid #cbd5e1;">Structure</td><td style="padding:8px; border:1px solid #cbd5e1;">Open, 11 nm fiber</td><td style="padding:8px; border:1px solid #cbd5e1;">Condensed 30 nm / loops</td></tr>
        <tr><td style="padding:8px; border:1px solid #cbd5e1;">Activity</td><td style="padding:8px; border:1px solid #cbd5e1;">Active transcription</td><td style="padding:8px; border:1px solid #cbd5e1;">Transcriptionally silent</td></tr>
        <tr><td style="padding:8px; border:1px solid #cbd5e1;">Mark</td><td style="padding:8px; border:1px solid #cbd5e1;">Acetylation (HATs)</td><td style="padding:8px; border:1px solid #cbd5e1;">H3K9me3 / H3K27me3 (HMTs)</td></tr>
      </tbody>
    </table>
  </div>`,

  // Page 4
  `<div style="background:#e0f2fe; border-left:4px solid #0284c7; padding:12px 16px; margin-bottom:20px; font-weight:700; color:#0369a1;">
    MODULE 2: NUCLEIC ACID REPLICATION, TRANSCRIPTION, AND TRANSLATION
  </div>
  <h3 style="font-size:16px; color:#0f172a; margin:0 0 12px;">2.1 Bidirectional Replication Fork Dynamics</h3>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    DNA replication is a highly coordinated, semi-conservative process ensuring high-fidelity transmission of genetic material during S phase. Because DNA polymerases only add nucleotides to a pre-existing 3'-OH group, elongation proceeds exclusively 5' to 3', creating an asymmetric fork.
  </p>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    In prokaryotes (<em>E. coli</em>), replication initiates at a single origin (<strong>oriC</strong>). Initiator proteins (<strong>DnaA</strong>) bind 9-mer and 13-mer repeats. <strong>DnaB Helicase</strong> is loaded by DnaC to unwind strands. Positive supercoils ahead of the fork are relieved by <strong>DNA Gyrase</strong> (type II topoisomerase).
  </p>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    Unwound single strands are stabilized by <strong>Single-Stranded Binding Proteins (SSBs)</strong>. Leading strand synthesis runs continuously, while lagging strand synthesis produces short <strong>Okazaki fragments</strong> (1000–2000 bp) primed by <strong>DnaG Primase</strong> and extended by <strong>DNA Polymerase III Holoenzyme</strong> with a homodimeric <strong>beta-2 sliding clamp</strong>.
  </p>`,

  // Page 5
  `<h4 style="font-size:14px; color:#0f172a; margin:0 0 10px;">Prokaryotic vs. Eukaryotic Replication Machinery</h4>
  <table style="width:100%; border-collapse:collapse; font-size:12.5px; margin-bottom:20px;">
    <thead>
      <tr style="background:#1e293b; color:#fff; text-align:left;">
        <th style="padding:8px;">Function</th>
        <th style="padding:8px;">Prokaryotic (E. coli)</th>
        <th style="padding:8px;">Eukaryotic (Mammalian)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background:#f8fafc;"><td style="padding:8px; border:1px solid #e2e8f0;">Origin Recognition</td><td style="padding:8px; border:1px solid #e2e8f0;">DnaA Protein (9-mer/13-mer)</td><td style="padding:8px; border:1px solid #e2e8f0;">ORC 1–6 Complex</td></tr>
      <tr><td style="padding:8px; border:1px solid #e2e8f0;">Helicase Activation</td><td style="padding:8px; border:1px solid #e2e8f0;">DnaB Helicase (5' to 3')</td><td style="padding:8px; border:1px solid #e2e8f0;">CMG Complex (Mcm2-7/GINS/Cdc45)</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:8px; border:1px solid #e2e8f0;">Primer Synthesis</td><td style="padding:8px; border:1px solid #e2e8f0;">DnaG Primase</td><td style="padding:8px; border:1px solid #e2e8f0;">Pol α / Primase complex</td></tr>
      <tr><td style="padding:8px; border:1px solid #e2e8f0;">Elongation Enzymes</td><td style="padding:8px; border:1px solid #e2e8f0;">Pol III Core (α, ε, θ)</td><td style="padding:8px; border:1px solid #e2e8f0;">Pol ε (leading), Pol δ (lagging)</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:8px; border:1px solid #e2e8f0;">Primer Removal</td><td style="padding:8px; border:1px solid #e2e8f0;">Pol I (5' to 3' exonuclease)</td><td style="padding:8px; border:1px solid #e2e8f0;">FEN1 & Dna2</td></tr>
    </tbody>
  </table>
  <h3 style="font-size:15px; color:#0f172a; margin:16px 0 8px;">2.2 Transcription Processing and Regulatory Mechanisms</h3>
  <p style="font-size:13px; color:#334155; line-height:1.6;">
    Prokaryotes use a single core RNA polymerase (α2ββ\'ω) + <strong>sigma factor (σ)</strong> binding consensus sequences at <strong>-10 (Pribnow box, 5'-TATAAT-3')</strong> and <strong>-35 (5'-TTGACA-3')</strong>. Eukaryotes segregate work across three polymerases: Pol I (45S rRNA), Pol II (mRNA with core <strong>TATA box</strong> at -25 bp recruiting TFIID/TFIIB/TFIIE/TFIIH), Pol III (tRNA, 5S rRNA).
  </p>`,

  // Page 6
  `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:18px; margin-bottom:20px;">
    <h4 style="margin:0 0 10px; color:#166534; font-size:14px;">STEP-BY-STEP EUKARYOTIC MRNA POST-TRANSCRIPTIONAL PROCESSING CHAIN</h4>
    <ol style="font-size:13px; color:#14532d; line-height:1.7; padding-left:20px; margin:0;">
      <li><strong>5' Capping:</strong> Addition of <strong>7-methylguanosine cap</strong> via 5'-to-5' triphosphate bridge. Protects 5' end and recruits ribosome.</li>
      <li><strong>3' Cleavage & Polyadenylation:</strong> Following 5'-AAUAAA-3' signal, endonuclease cleaves pre-mRNA and <strong>Poly(A) Polymerase (PAP)</strong> adds 150–250 adenine residues.</li>
      <li><strong>Spliceosome Splicing:</strong> Introns removed by <strong>Spliceosome</strong> (U1, U2, U4, U5, U6 snRNAs + 150 proteins). Follows 5' splice site (GU), branch point (A), and 3' splice site (AG).</li>
    </ol>
  </div>`,

  // Page 7
  `<div style="background:#e0f2fe; border-left:4px solid #0284c7; padding:12px 16px; margin-bottom:20px; font-weight:700; color:#0369a1;">
    MODULE 3: MUTATIONS, MUTAGENESIS, DNA DAMAGE, AND REPAIR PATHWAYS
  </div>
  <h3 style="font-size:16px; color:#0f172a; margin:0 0 12px;">3.1 Molecular Classification of Mutations</h3>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    Point mutations: <strong>Transitions</strong> (purine ↔ purine [A ↔ G] or pyrimidine ↔ pyrimidine [C ↔ T]) vs <strong>Transversions</strong> (purine ↔ pyrimidine [A ↔ C, G ↔ T]).
  </p>
  <ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
    <li><strong>Silent Mutations:</strong> Codon changes but amino acid remains same due to code degeneracy (GUA → GUG Val).</li>
    <li><strong>Missense Mutations:</strong> Codon specifies a different amino acid (GAG [Glu] → GTG [Val] in Sickle Cell).</li>
    <li><strong>Nonsense Mutations:</strong> Converts codon into premature stop codon (UAA, UAG, UGA), producing truncated protein.</li>
    <li><strong>Frameshift Mutations:</strong> Indels not a multiple of 3, shifting triplet reading frame.</li>
  </ul>
  <h3 style="font-size:16px; color:#0f172a; margin:20px 0 12px;">3.2 Mechanics of Environmental Mutagenesis</h3>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    1. <strong>Physical Mutagens:</strong> UV radiation forms intrastrand <strong>cyclobutane pyrimidine dimers (CPDs)</strong> & [6-4] photoproducts. X-rays create ROS and strand breaks.
  </p>`,

  // Page 8
  `<p style="font-size:13.5px; color:#334155; line-height:1.7;">
    2. <strong>Chemical Mutagens:</strong> EMS alkylating agent; <strong>5-Bromouracil (5-BU)</strong> base analogue mimics T and undergoes tautomeric shifts to enol form, pairing with G (T·A → C·G transition).
  </p>
  <h3 style="font-size:16px; color:#0f172a; margin:20px 0 12px;">3.3 DNA Repair Cascades and Enzymatic Pathways</h3>
  <ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
    <li><strong>A. Mismatch Repair (MMR):</strong> <strong>MutS-MutL-MutH</strong> complex scans hemi-methylated 5'-GATC-3' (methylated by <strong>Dam Methylase</strong>). MutH nicks unmethylated strand.</li>
    <li><strong>B. Base Excision Repair (BER):</strong> <strong>DNA Glycosylase</strong> removes base leaving <strong>AP site</strong>. <strong>AP Endonuclease</strong> cuts backbone, Pol I & Ligase repair.</li>
    <li><strong>C. Nucleotide Excision Repair (NER):</strong> <strong>UvrABC excinuclease</strong> (UvrA/B scan, UvrC cuts 8 nt 5' & 4-5 nt 3'), <strong>UvrD Helicase</strong> removes 12-13 nt fragment. Defects cause <strong>Xeroderma Pigmentosum</strong>.</li>
  </ul>`,

  // Page 9
  `<div style="background:#e0f2fe; border-left:4px solid #0284c7; padding:12px 16px; margin-bottom:20px; font-weight:700; color:#0369a1;">
    MODULE 4: CLASSICAL TRANSMISSION GENETICS, GENE INTERACTIONS, LINKAGE, AND MAPPING
  </div>
  <h3 style="font-size:16px; color:#0f172a; margin:0 0 12px;">4.1 Mendelian Inheritance and Post-Mendelian Extensions</h3>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    Law of Segregation & Law of Independent Assortment (9:3:3:1 ratio). Epistatic non-allelic interactions modify standard dihybrid ratio:
  </p>
  <ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
    <li><strong>Complementary Gene Interaction (9:7 Ratio):</strong> Both functional genes required for wild-type.</li>
    <li><strong>Recessive Epistasis (9:3:4 Ratio):</strong> Recessive allele masks second locus (e.g. Labrador coat color <em>ee</em> masking <em>B/b</em>).</li>
    <li><strong>Dominant Epistasis (12:3:1 Ratio):</strong> Single dominant allele suppresses alternative locus.</li>
    <li><strong>Duplicate Dominant Epistasis (15:1 Ratio):</strong> Dominant allele at either locus gives wild-type.</li>
  </ul>`,

  // Page 10
  `<h3 style="font-size:16px; color:#0f172a; margin:0 0 12px;">4.2 Recombination Linkage and Three-Point Testcross Mapping</h3>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    1 centimorgan (cM) = 1% recombination frequency. <strong>Three-Point Testcross</strong> (AaBbCc × aabbcc) workflow:
  </p>
  <ol style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
    <li><strong>Group Progeny:</strong> Parental classes (highest frequency) vs Double Crossover DCO (lowest frequency).</li>
    <li><strong>Determine Gene Order:</strong> The locus flipped in DCO relative to parentals is the <strong>middle gene</strong>.</li>
    <li><strong>Calculate Recombination Distances:</strong><br/>
      <div style="background:#f1f5f9; padding:10px; border-radius:6px; font-weight:700; text-align:center; margin:8px 0;">
        RF = [(Σ Single Crossovers + Σ Double Crossovers) / Total Progeny] × 100
      </div>
    </li>
    <li><strong>Evaluate Interference:</strong> Interference $I = 1 - C$, where $C = \text{Observed DCO} / \text{Expected DCO}$.</li>
  </ol>`,

  // Page 11
  `<p style="font-size:13.5px; color:#334155; line-height:1.7;">
    An interference value $I = 0$ indicates independent crossovers, while $I = 1$ indicates complete suppression of adjacent crossovers.
  </p>
  <div style="background:#fffbe6; border:1px solid #ffe58f; border-radius:10px; padding:16px; margin-top:20px;">
    <h4 style="margin:0 0 8px; color:#d48806; font-size:14px;">📌 Quick Rule for 3-Point Mapping</h4>
    <p style="margin:0; font-size:13px; color:#8c6b00;">Compare parental pair [A B C / a b c] with DCO pair [A b C / a B c]. Notice 'b' has flipped! Therefore, gene order is <strong>A – B – C</strong>.</p>
  </div>`,

  // Page 12
  `<div style="background:#e0f2fe; border-left:4px solid #0284c7; padding:12px 16px; margin-bottom:20px; font-weight:700; color:#0369a1;">
    MODULE 5: BACTERIAL GENETICS, HORIZONTAL GENE TRANSFER, AND RNA INTERFERENCE
  </div>
  <h3 style="font-size:16px; color:#0f172a; margin:0 0 12px;">5.1 Mechanisms of Horizontal Gene Transfer (HGT)</h3>
  <ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
    <li><strong>A. Transformation:</strong> Direct uptake of cell-free naked DNA by competent cells (Com machinery & RecA). Induced by $\text{CaCl}_2$ heat shock or electroporation.</li>
    <li><strong>B. Transduction:</strong> Bacteriophage-mediated. <em>Generalized Transduction</em> (lytic P22/P1 random bacterial DNA packaging) vs <em>Specialized Transduction</em> (lysogenic Lambda phage integrating at <em>attλ</em> transferring flanking <em>gal/bio</em> genes).</li>
  </ul>`,

  // Page 13
  `<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px; margin-top:0;">
    <li><strong>C. Conjugation:</strong> Direct contact via sex pilus, F-plasmid nicked at <em>oriT</em> pumped from $\text{F}^+$ to $\text{F}^-$. <strong>Hfr strain</strong> has F integrated into host chromosome; 100 min transfer bridge breaks early leaving recipient $\text{F}^-$.</li>
  </ul>
  <h3 style="font-size:16px; color:#0f172a; margin:20px 0 12px;">5.2 Transposable Elements ("Jumping Genes")</h3>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    <strong>Insertion Sequences (IS)</strong> encode transposase flanked by inverted repeats. Complex transposons carry antibiotic markers (Tn10 tetracycline resistance). Modes: Conservative ("cut-and-paste") vs Replicative ("copy-and-paste").
  </p>
  <h3 style="font-size:16px; color:#0f172a; margin:20px 0 12px;">5.3 Post-Transcriptional Silencing via RNA Interference (RNAi)</h3>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    Cytoplasmic dsRNA is cleaved by <strong>Dicer</strong> into 21–23 bp <strong>siRNAs</strong>, loaded into <strong>RISC</strong>. The catalytic subunit <strong>Argonaute</strong> cleaves complementary target mRNA, silencing gene expression.
  </p>`,

  // Page 14
  `<div style="background:#e0f2fe; border-left:4px solid #0284c7; padding:12px 16px; margin-bottom:20px; font-weight:700; color:#0369a1;">
    MODULE 6: CHROMOSOMAL VARIATIONS AND THE MOLECULAR BASIS OF GENETIC DISEASES
  </div>
  <h3 style="font-size:16px; color:#0f172a; margin:0 0 12px;">6.1 Large-Scale Numerical and Structural Chromosomal Aberrations</h3>
  <p style="font-size:13.5px; color:#334155; line-height:1.7;">
    1. <strong>Numerical Aberrations:</strong> Aneuploidy ($2n-1$ monosomy, $2n+1$ trisomy) from meiotic <strong>Nondisjunction</strong>. Polyploidy ($3n, 4n$).<br/>
    2. <strong>Structural Aberrations:</strong> Deletions (pseudo-dominance), Duplications (gene families), Inversions (Paracentric vs Pericentric), Translocations (Robertsonian Fusion).
  </p>
  <h3 style="font-size:16px; color:#0f172a; margin:20px 0 12px;">6.2 Molecular Basis of Representative Genetic Diseases</h3>`,

  // Page 15
  `<table style="width:100%; border-collapse:collapse; font-size:12.5px; margin-bottom:20px;">
    <thead>
      <tr style="background:#1e293b; color:#fff; text-align:left;">
        <th style="padding:8px;">Disease Condition</th>
        <th style="padding:8px;">Inheritance</th>
        <th style="padding:8px;">Molecular Defect & Pathological Basis</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background:#f8fafc;">
        <td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Sickle Cell Anemia</td>
        <td style="padding:8px; border:1px solid #e2e8f0;">Autosomal Recessive</td>
        <td style="padding:8px; border:1px solid #e2e8f0;">Transversion (A→T) in 6th codon of β-globin (GAG → GTG, Glu6Val). HbS polymerizes under hypoxia into sickle shapes.</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Huntington Disease</td>
        <td style="padding:8px; border:1px solid #e2e8f0;">Autosomal Dominant</td>
        <td style="padding:8px; border:1px solid #e2e8f0;">Trinucleotide repeat expansion (>40 CAG repeats) in HTT gene exon 1, polyglutamine toxicity, displays <strong>Anticipation</strong>.</td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">CML (Leukemia)</td>
        <td style="padding:8px; border:1px solid #e2e8f0;">Somatic Rearrangement</td>
        <td style="padding:8px; border:1px solid #e2e8f0;">Translocation t(9;22)(q34;q11) forming <strong>Philadelphia Chromosome</strong> (BCR-ABL fusion kinase). Treated with <strong>Imatinib (Gleevec)</strong>.</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Down Syndrome</td>
        <td style="padding:8px; border:1px solid #e2e8f0;">Chromosomal Aneuploidy</td>
        <td style="padding:8px; border:1px solid #e2e8f0;">Trisomy 21 ($47, XX/XY, +21$) from maternal meiotic nondisjunction, overexpressing SOD1 and APP.</td>
      </tr>
    </tbody>
  </table>`,

  // Page 16
  `<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:20px;">
    <h4 style="margin:0 0 10px; color:#0f172a; font-size:14px;">📌 Summary of Clinical Chromosomal Pathology</h4>
    <p style="font-size:13px; color:#334155; line-height:1.6; margin:0;">
      Key GATE exam takeaway: Robertsonian Translocations involve acrocentric chromosomes (13, 14, 15, 21, 22) fusing at centromeres. Trisomy 21 rate increases exponentially with maternal age due to prolonged dictyate arrest in oocytes.
    </p>
  </div>`,

  // Page 17
  `<div style="background:#e0f2fe; border-left:4px solid #0284c7; padding:12px 16px; margin-bottom:20px; font-weight:700; color:#0369a1;">
    MODULE 7: EXAM-FOCUSED EVALUATIVE QUESTIONS AND SOLVED QUANTITATIVE BANK
  </div>
  <h3 style="font-size:15px; color:#dc2626; margin:0 0 12px;">7.1 High-Yield 5-Mark Descriptive Questions & Model Answers</h3>
  <p style="font-size:13.5px; color:#0f172a; font-weight:700;">
    Question 1: Elaborate on the molecular regulation of the lac operon in E. coli under varying nutrient conditions.
  </p>
  <div style="background:#f8fafc; padding:16px; border-radius:10px; border:1px solid #e2e8f0; font-size:13px; color:#334155; line-height:1.7;">
    <strong>Model Answer:</strong> Polycistronic system encoding <em>lacZ</em> (β-gal), <em>lacY</em> (permease), and <em>lacA</em> (transacetylase).<br/>
    • <strong>Negative Regulation:</strong> LacI tetrameric repressor binds operator site $O_1$. Allolactose inducer binds repressor causing dissociation.<br/>
    • <strong>Positive CAP Coordination:</strong> Low glucose activates Adenylyl Cyclase → high cAMP → cAMP-CAP complex binds upstream promoter, bending DNA to boost RNA Pol binding >50-fold.<br/>
    • <em>Summary:</em> +Glc/-Lac (OFF), +Glc/+Lac (Basal ON), -Glc/+Lac (Maximal Fully ON).
  </div>`,

  // Page 18
  `<p style="font-size:13.5px; color:#0f172a; font-weight:700; margin-top:0;">
    Question 2: Explain genetic complementation versus recombination, and the Cis-Trans test.
  </p>
  <div style="background:#f8fafc; padding:16px; border-radius:10px; border:1px solid #e2e8f0; font-size:13px; color:#334155; line-height:1.7;">
    <strong>Model Answer:</strong> Complementation occurs when two mutant genomes restore wild-type phenotype in shared cytoplasm without altering nucleotide sequence. Recombination physically breaks and rejoins DNA.<br/>
    • <strong>Trans Test ($m_1 + / + m_2$):</strong> Wild-type = complementation (different genes/intergenic). Mutant = same gene (intragenic).<br/>
    • <strong>Cis Test ($m_1 m_2 / + +$):</strong> Essential control proving mutations are recessive.
  </div>`,

  // Page 19
  `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:18px;">
    <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">💡 Cis-Trans Test Rule of Thumb</h4>
    <p style="margin:0; font-size:13px; color:#14532d;">If trans configuration gives WILD-TYPE → <strong>COMPLEMENTATION = DIFFERENT GENES</strong>. If trans configuration gives MUTANT → <strong>NO COMPLEMENTATION = SAME GENE</strong>.</p>
  </div>`,

  // Page 20
  `<h3 style="font-size:16px; color:#0f172a; margin:0 0 12px;">7.2 Frequently Asked GATE Quantitative Problems & Solved Analytical Bank</h3>
  <div style="background:#eff6ff; border-left:4px solid #3b82f6; padding:14px; margin-bottom:16px; font-weight:700; color:#1e40af;">
    GATE Quantitative Practice & Worked Solutions
  </div>`,

  // Page 21
  `<p style="font-size:13.5px; color:#0f172a; font-weight:700;">
    FAQ 1 (Three-Point Testcross Mapping Numerical): Maize cross data for 1000 progeny:
  </p>
  <pre style="background:#f1f5f9; padding:12px; border-radius:8px; font-size:12.5px; color:#0f172a;">
[p q r] = 398    [+ + +] = 402
[p + +] = 42     [+ q r] = 38
[p q +] = 54     [+ + r] = 56
[p + r] = 6      [+ q +] = 4
  </pre>
  <div style="font-size:13px; color:#334155; line-height:1.7;">
    <strong>Step 1: Group Progeny:</strong> Parentals = 398+402 = 800; DCO = 6+4 = 10.<br/>
    <strong>Step 2: Determine Order:</strong> Comparing parentals [p q r] with DCO [p + r], <strong>q locus flipped</strong> → Order is <strong>p – q – r</strong>.<br/>
    <strong>Step 3: Distance p-q (Region 1):</strong> $[(42 + 38 + 6 + 4)/1000] \times 100 = 90/1000 \times 100 = 9.0\text{ cM}$.
  </div>`,

  // Page 22
  `<div style="font-size:13px; color:#334155; line-height:1.7;">
    <strong>Step 4: Distance q-r (Region 2):</strong> $[(54 + 56 + 6 + 4)/1000] \times 100 = 120/1000 \times 100 = 12.0\text{ cM}$.<br/>
    <strong>Step 5: Genetic Interference ($I$):</strong><br/>
    • Expected DCO = $0.090 \times 0.120 = 0.0108$ ($1.08\%$).<br/>
    • Observed DCO = $10 / 1000 = 0.0100$ ($1.00\%$).<br/>
    • Coefficient of Coincidence ($C$) = $0.0100 / 0.0108 = 0.9259$.<br/>
    • Interference ($I$) = $1 - C = 1 - 0.9259 = 0.0741$ ($7.41\%$).
  </div>
  <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:14px; margin-top:16px;">
    <strong>Final Answer Matrix:</strong> Gene order: <strong>p – q – r</strong> | Map Distances: <strong>p–q = 9.0 cM</strong>, <strong>q–r = 12.0 cM</strong> | Interference: <strong>7.41%</strong>.
  </div>`,

  // Page 23
  `<p style="font-size:13.5px; color:#0f172a; font-weight:700;">
    FAQ 2 (Polymerase Chain Reaction Growth Kinetics): Initial template $N_0 = 500$, efficiency $E = 0.94$, cycles $n = 28$. Calculate total molecules $N_t$.
  </p>
  <div style="background:#f8fafc; padding:16px; border-radius:10px; border:1px solid #e2e8f0; font-size:13px; color:#334155; line-height:1.7;">
    <strong>Formula:</strong> $N_t = N_0 \times (1 + E)^n = 500 \times (1.94)^{28}$<br/>
    $\log(1.94^{28}) = 28 \times \log(1.94) \approx 28 \times 0.2878 = 8.0584$<br/>
    $1.94^{28} = 10^{8.0584} \approx 114,393,243$<br/>
    $N_t = 500 \times 114,393,243 = 57,196,621,500$
  </div>
  <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:14px; margin-top:16px; color:#166534; font-weight:700;">
    Answer: Total target DNA molecules after 28 cycles = $57,196,621,500 \approx 5.72 \times 10^{10}$ molecules.
  </div>`
];

const FULL_ANIMAL_CELL_18_PAGES = [
  `<h1 style="font-size:22px; color:#c2410c; margin:0 0 10px; border-bottom:2px solid #c2410c; padding-bottom:8px;">ADVANCED ANIMAL BIOTECHNOLOGY</h1>
<p style="font-style:italic; color:#475569; font-size:13px; margin-bottom:24px;">Comprehensive High-Yield Study Guide for B.Tech Undergraduate University Examinations &amp; GATE Biotechnology (BT)</p>
<div style="background:#ffedd5; border-left:4px solid #ea580c; padding:12px 16px; margin-bottom:20px; font-weight:700; color:#9a3412;">
  1. ANIMAL CELL CULTURE: INTRODUCTION &amp; FUNDAMENTALS
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Definition &amp; Scope</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Animal cell culture is the process by which cells derived from animal tissues are isolated and grown under highly controlled in vitro laboratory environments. Unlike microbial cells, animal cells lack rigid cell walls, exhibit complex signaling networks, and possess stringent nutritional requirements. This technology serves as the foundation for modern biomanufacturing, viral vaccine development, therapeutic protein synthesis, and tissue engineering.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Working Principle</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  The core operating principle of animal cell culture involves mimicking the physiological in vivo environment inside an in vitro system. This requires providing a suitable substrate or vessel, sterile nutrient media formulation, specific gaseous parameters (Carbon Dioxide and Oxygen), strict homeostatic temperature regulation, and proper physiological osmotic conditions. Cells are mechanically or enzymatically isolated from tissue pieces (explants) using proteolytic enzymes like trypsin or collagenase and then introduced into culture vessels where they proliferate as monodispersed cell lines or specialized tissue constructs.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Types of Animal Cell Cultures</h3>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li><strong>Primary Cell Culture:</strong> Cells isolated directly from parental tissues via mechanical or enzymatic cleavage. These cells maintain the normal diploid chromosomal complement (karyotype) and mirror true in vivo tissue responses. However, they exhibit a finite lifespan and undergo replicative senescence due to the shortening of telomeres.</li>
  <li><strong>Finite Cell Lines:</strong> Secondary cultures obtained by subculturing primary lines. They possess a defined replicative potential, usually dividing between 20 to 80 times before undergoing programmed senescence.</li>
  <li><strong>Continuous (Immortalized) Cell Lines:</strong> Derived from tumor populations or established by artificially introducing viral oncogenes (e.g., SV40 Large T-antigen, hTERT expression vector). These lines possess altered genotypes, vary in chromosome number (aneuploidy), and demonstrate an infinite proliferative lifespan, bypassing the classical Hayflick limit.</li>
</ul>
<div style="background:#fff7ed; border:1px solid #ffedd5; border-radius:8px; padding:12px; margin-top:14px; font-size:13px; color:#9a3412;">
  <strong>GATE High-Yield Concept:</strong> Primary cultures are highly representative of physiological states but are sensitive to mechanical stress. Continuous cell lines display modified contact inhibition and are widely utilized for therapeutic production (e.g., CHO, Vero, HeLa cell models).
</div>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 6px;">Core Concept Breakdown</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  The successful maintenance of animal cells requires rigorous aseptic techniques because their slow multiplication rate renders them highly vulnerable to rapid microbial overgrowth by bacteria, fungi, or mycoplasma. A typical cell division cycle for mammalian cells takes approximately 18 to 24 hours, compared to 20 minutes for common bacterial strains like <em>Escherichia coli</em>.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 8px;">Step-by-Step Core Working Protocol: Isolation of Primary Explants</h3>
<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
  <h4 style="margin:0 0 10px; color:#0f172a; font-size:14px;">Protocol Steps:</h4>
  <ol style="font-size:13px; color:#334155; line-height:1.7; padding-left:20px; margin:0;">
    <li>Aseptically harvest target organ or soft tissue sample from animal source in a sterile laminar airflow hood.</li>
    <li>Rinse the harvested tissue repeatedly using sterile Phosphate-Buffered Saline (PBS) fortified with penicillin and streptomycin antibiotics to eliminate surface contaminants.</li>
    <li>Mince tissue into sub-millimeter pieces (approximately 1 mm³ fragments) using a sterile surgical scalpel blade.</li>
    <li>Expose tissue to chemical dissociation fluid containing 0.25% Trypsin and 0.02% EDTA at 37°C for 20 minutes to disrupt inter-cellular cell adhesion molecules (cadherins).</li>
    <li>Inactivate trypsin action by introducing an equal volume of serum-containing growth media. Centrifuge the slurry at 1,000 rpm for 5 minutes.</li>
    <li>Resuspend the isolated cell pellet in complete growth medium and seed onto fresh tissue-culture treated flasks.</li>
  </ol>
</div>`,
  `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px; margin-bottom:20px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">5-Mark Exam Question: Differentiate between Primary Cell Cultures and Continuous Cell Lines. Outline their primary applications.</h4>
  <p style="font-weight:700; color:#14532d; font-size:13px; margin-bottom:10px;">Model Answer:</p>
  <table style="width:100%; border-collapse:collapse; font-size:12px; color:#14532d; margin-bottom:10px;">
    <thead>
      <tr style="background:#dcfce7;">
        <th style="padding:6px; border:1px solid #86efac;">Characteristic Parameter</th>
        <th style="padding:6px; border:1px solid #86efac;">Primary Cell Culture</th>
        <th style="padding:6px; border:1px solid #86efac;">Continuous Cell Line</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding:6px; border:1px solid #86efac; font-weight:700;">Source Material</td><td style="padding:6px; border:1px solid #86efac;">Directly from fresh animal biopsy tissue.</td><td style="padding:6px; border:1px solid #86efac;">Transformed finite lines or cancerous tumor tissue.</td></tr>
      <tr><td style="padding:6px; border:1px solid #86efac; font-weight:700;">Lifespan/Viability</td><td style="padding:6px; border:1px solid #86efac;">Finite capacity; undergoes rapid senescence.</td><td style="padding:6px; border:1px solid #86efac;">Infinite replication potential (Immortalized).</td></tr>
      <tr><td style="padding:6px; border:1px solid #86efac; font-weight:700;">Karyotype</td><td style="padding:6px; border:1px solid #86efac;">Normal diploid structure preserved.</td><td style="padding:6px; border:1px solid #86efac;">Aneuploid or heteroploid variations observed.</td></tr>
      <tr><td style="padding:6px; border:1px solid #86efac; font-weight:700;">Growth Rate</td><td style="padding:6px; border:1px solid #86efac;">Slow kinetics (doubling time 24-72 hours).</td><td style="padding:6px; border:1px solid #86efac;">Rapid kinetics (doubling time 12-24 hours).</td></tr>
      <tr><td style="padding:6px; border:1px solid #86efac; font-weight:700;">Contact Inhibition</td><td style="padding:6px; border:1px solid #86efac;">Maintained tightly; forms clean monolayers.</td><td style="padding:6px; border:1px solid #86efac;">Diminished or absent; forms multi-layered aggregates.</td></tr>
    </tbody>
  </table>
  <p style="font-size:12.5px; color:#14532d; margin:0;"><strong>Major Applications:</strong> Primary cultures are ideal for precise toxicological assessments, vaccine production, and cell signaling research. Continuous cell lines are heavily favored for industrial expression of monoclonal antibodies, recombinant proteins, and large-scale manufacturing workflows.</p>
</div>
<div style="background:#ffedd5; border-left:4px solid #ea580c; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#9a3412;">
  2. MEDIA COMPOSITION AND GROWTH CONDITIONS
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Definition and Functional Design</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Animal cell culture media is an exacted formulation of essential macro- and micronutrients designed to preserve intracellular metabolic homeostasis. The design requires a precise equilibrium of amino acids, carbohydrates, vitamins, mineral salts, lipids, and specialized buffer complexes that replicate extracellular matrix signaling and systemic circulatory distribution parameters.
</p>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 6px;">Types of Media Formulations</h3>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li><strong>Natural Media:</strong> Formulated using biological fluids directly obtained from organisms, including coagula, amniotic fluid, embryonic extracts, or human and bovine sera. While rich in growth factors, it introduces massive batch-to-batch variation.</li>
  <li><strong>Synthetic/Chemically Defined Media:</strong> Formulated from completely pure inorganic and organic reagents where every singular component concentration is known precisely (e.g., DMEM, RPMI-1640, Ham's F12).</li>
  <li><strong>Serum-Free Media (SFM):</strong> Formulations optimized for specific lines without serum addition, supplemented with targeted recombinant proteins like insulin and transferrin. SFM eliminates biological risk vectors.</li>
</ul>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Core Composition Analysis</h3>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li><strong>Carbon Sources:</strong> D-Glucose remains the primary operational fuel, catabolized through glycolysis into pyruvate. High-efficiency media formulations also include L-Glutamine, an essential amino acid incorporated in tricarboxylic acid (TCA) cycle oxidative phosphorylation.</li>
  <li><strong>Inorganic Salts:</strong> Salts like NaCl, KCl, CaCl2, and MgSO4 regulate cellular osmotic pressure, maintaining cell structural volume and enabling crucial electrochemical cell membrane potentials.</li>
  <li><strong>Buffering Systems:</strong> Cultured animal cells generate substantial acidic waste products (primarily lactic acid). Control is established via a sodium bicarbonate (NaHCO3) buffer network operating alongside an exogenous incubator gas environment supplying 5% to 10% gaseous CO2. The biochemical reaction is represented as:<br/>
  <strong>H2O + CO2 ⇌ H2CO3 ⇌ H+ + HCO3-</strong><br/>
  To provide clear visual tracking of medium acidification, the pH indicator dye Phenol Red is regularly integrated. It transitions visually from red-orange (pH 7.4) to bright yellow when pH drops below 6.8, signalling critical metabolic acid accumulation.</li>
</ul>
<div style="background:#fff7ed; border:1px solid #ffedd5; border-radius:8px; padding:12px; margin-top:14px; font-size:13px; color:#9a3412;">
  <strong>GATE Formula Focus:</strong> The maintenance of optimum physiological pH requires balancing bicarbonate additions against carbon dioxide partial pressures in accordance with the classical Henderson-Hasselbalch expression:<br/>
  pH = pKa + log([HCO3-] / [H2CO3]) &nbsp;|&nbsp; Where pKa for the bicarbonate system at 37°C is 6.1.
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Growth Conditions and Physical Parameters</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  • <strong>Temperature:</strong> Standard mammalian cultures require a strict homeostatic set point of 37.0°C ± 0.5°C. Avian cells demand higher points (38.5°C), while insect systems run cooler (27°C-28°C).<br/>
  • <strong>Osmolality:</strong> Standard mammalian growth demands a narrow osmotic range of 290 to 320 mOsm/kg H2O to prevent hypertonic shrinkage or hypotonic cell lysis.
</p>`,
  `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px; margin-bottom:20px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">5-Mark Exam Question: Explain the biological role of Fetal Bovine Serum (FBS) in media formulations and outline the advantages of transitioning to Serum-Free Media.</h4>
  <p style="font-weight:700; color:#14532d; font-size:13px; margin-bottom:6px;">Model Answer:</p>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    Fetal Bovine Serum (FBS) serves as a comprehensive additive rich in vital compounds:<br/>
    1. <strong>Hormonal Stimulants:</strong> Contains insulin, growth factors (PDGF, FGF, EGF) that trigger critical mitotic signaling cascades.<br/>
    2. <strong>Transport Elements:</strong> Provides transferrin to shuttle iron across membranes and albumin to carry complex lipid fractions.<br/>
    3. <strong>Adhesion Factors:</strong> Supplies fibronectin and vitronectin, helping anchorage-dependent cells adhere to surfaces.<br/>
    4. <strong>Buffer &amp; Protective Action:</strong> Increases viscosity, safeguarding delicate cells against hydrodynamic shear stress in stirred bioreactors.<br/><br/>
    <strong>Advantages of Serum-Free Media (SFM):</strong> SFM drastically reduces the risk of contaminating cultures with viral pathogens or prion agents (such as BSE). It simplifies downstream processing because there are no high-concentration serum proteins to separate out, provides completely uniform batch configurations, and eliminates ethical or supply chain vulnerabilities associated with animal-derived serums.
  </div>
</div>
<div style="background:#ffedd5; border-left:4px solid #ea580c; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#9a3412;">
  3. ANIMAL CELL AND TISSUE PRESERVATION
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Definition &amp; Principles</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Cryopreservation is the long-term structural and biological preservation of viable animal cells and tissue matrices at sub-zero temperatures, routinely in liquid nitrogen storage units operating at -196°C (77 Kelvin). At these temperatures, cellular metabolic activity and chemical reactions cease completely, effectively halting biological aging processes.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Working Principle: Cellular Dehydration &amp; Ice Crystallization Control</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  When cells are cooled without intervention, intracellular water freezes into sharp, large ice crystals. These crystals break plasma membranes and destroy internal organelle frameworks. To counter this, cryoprotective agents (CPAs) are added to cell solutions. CPAs are categorized into two classes based on mechanism:<br/>
  • <strong>Intracellular Permeable CPAs:</strong> Small, highly polar compounds like Dimethyl Sulfoxide (DMSO) and Glycerol. They penetrate across the lipid bilayer and form hydrogen bonds with internal water molecules, which lowers the solution freezing point and limits the formation of ordered ice crystal grids.<br/>
  • <strong>Extracellular Non-Permeable CPAs:</strong> Large polymers or sugars like sucrose, trehalose, and polyvinylpyrrolidone (PVP). These compounds do not enter the cell; instead, they increase the osmotic pressure of the surrounding fluid, gently drawing water out of the cell before it can freeze.
</p>`,
  `<div style="background:#fff7ed; border:1px solid #ffedd5; border-radius:8px; padding:12px; margin-bottom:16px; font-size:13px; color:#9a3412;">
  <strong>GATE Physics Fact:</strong> Effective cryopreservation requires a highly precise cooling rate, typically around <strong>-1°C per minute</strong>. This slow cooling rate allows intracellular water to move out of the cell via osmosis, matching the concentration of the freezing extracellular solution without causing cell collapse.
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 8px;">Step-by-Step Cryopreservation Protocol</h3>
<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-bottom:16px;">
  <h4 style="margin:0 0 10px; color:#0f172a; font-size:14px;">Detailed Freezing Protocol:</h4>
  <ol style="font-size:13px; color:#334155; line-height:1.7; padding-left:20px; margin:0;">
    <li>Harvest mid-log phase cells showing high initial viability (greater than 95%).</li>
    <li>Centrifuge cells to form a pellet, then resuspend them in pre-cooled freezing medium (typically containing 10% DMSO and 90% serum or specialized base media).</li>
    <li>Dispense the cell solution into sterile 1.5 mL cryovials at a density of 5 × 10⁶ cells/mL.</li>
    <li>Place vials inside a controlled-rate cooling container (such as a Mr. Frosty container packed with isopropyl alcohol) to achieve a steady cooling rate of -1°C/minute down to -80°C.</li>
    <li>Transfer the frozen vials into the liquid nitrogen storage vapor phase (-196°C) for permanent long-term storage.</li>
  </ol>
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Thawing Mechanics: Rapid Warm Rehydration</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  While cooling must be performed slowly, thawing must be executed rapidly at 37°C in a water bath (within 60-90 seconds). This rapid temperature jump prevents small, harmless ice crystals from recrystallizing and coalescing into larger, destructive ice crystal sheets. Because DMSO is toxic to cells at room temperature, thawed cell mixtures must be diluted with fresh media and centrifuged immediately to remove residual cryoprotectant.
</p>
<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px; margin-top:14px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">5-Mark Exam Question: Describe the phenomenon of ice crystal injury during cryopreservation. How does DMSO protect cells from this damage?</h4>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    During slow cooling without a cryoprotective agent, water in the extracellular space freezes first. This concentrates solutes outside the cell, creating an osmotic gradient that pulls water out of the cytoplasm. If cooling is too fast, water cannot escape quickly enough and freezes inside the cell, creating large ice crystals that puncture intracellular structures and rip the plasma membrane.<br/><br/>
    Dimethyl Sulfoxide (DMSO) prevents this damage through two main actions:<br/>
    1. <strong>Disrupting Ice Structure:</strong> It mixes with water inside the cell and prevents water molecules from forming rigid, dangerous ice crystal grids.<br/>
    2. <strong>Modulating Cell Hydration:</strong> DMSO lowers the freezing point of the cytoplasm, keeping the cell interior liquid longer. This allows a controlled amount of water to leave the cell, dehydrating it enough to prevent internal freezing without causing cellular collapse.
  </div>
</div>`,
  `<div style="background:#ffedd5; border-left:4px solid #ea580c; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#9a3412;">
  4. ANCHORAGE &amp; NON-ANCHORAGE DEPENDENT CELL CULTURE
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Definitions and Operational Rules</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Animal cell types are divided into two categories based on how they interact with their physical environment: Anchorage-Dependent (Adherent) cells and Non-Anchorage Dependent (Suspension) cells.<br/>
  • <strong>Anchorage-Dependent Cells:</strong> Cells that must attach to a solid, hydrophilic substrate to survive and replicate. If these cells remain suspended in fluid, they undergo a specialized form of programmed cell death known as <em>anoikis</em>. Most cells derived from solid tissues (such as epithelial, endothelial, and fibroblast cells) belong to this group.<br/>
  • <strong>Non-Anchorage Dependent Cells:</strong> Cells that can grow suspended in liquid media without attaching to a surface. These cells do not rely on surface attachment signaling pathways. Examples include hematopoietic cells, leukemia lines, and specialized industrial production lines like CHO or HeLa adapted to suspension.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Substrate Materials and Surface Modification</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  To support the growth of adherent cells, culture vessels must be made from specific materials. Standard polystyrene plastic is naturally hydrophobic, which prevents cells from attaching. To fix this, industrial culture vessels are treated with vacuum gas plasma, which introduces negatively charged oxygen atoms to the plastic surface. This modified surface binds to divalent cations (Ca²⁺ and Mg²⁺) in the culture medium, allowing them to bridge with cell-surface adhesion proteins called integrins.
</p>
<table style="width:100%; border-collapse:collapse; font-size:12.5px; margin-top:14px;">
  <thead>
    <tr style="background:#1e293b; color:#fff; text-align:left;">
      <th style="padding:8px;">Engineering Factor</th>
      <th style="padding:8px;">Anchorage-Dependent Culture</th>
      <th style="padding:8px;">Non-Anchorage Dependent Culture</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#f8fafc;"><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Vessel Systems Used</td><td style="padding:8px; border:1px solid #e2e8f0;">T-Flasks, Multi-layer Roller Bottles, Cell Factories.</td><td style="padding:8px; border:1px solid #e2e8f0;">Stirred Tank Bioreactors, Erlenmeyer Shake Flasks.</td></tr>
    <tr><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Scale-Up Strategy</td><td style="padding:8px; border:1px solid #e2e8f0;">Increasing available surface area (Using Microcarriers).</td><td style="padding:8px; border:1px solid #e2e8f0;">Increasing liquid volume (Straightforward scale-up).</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Harvesting Process</td><td style="padding:8px; border:1px solid #e2e8f0;">Requires enzymatic detachment (Trypsinization).</td><td style="padding:8px; border:1px solid #e2e8f0;">Simple mechanical separation (Centrifugation).</td></tr>
    <tr><td style="padding:8px; border:1px solid #e2e8f0; font-weight:700;">Shear Sensitivity</td><td style="padding:8px; border:1px solid #e2e8f0;">Protected by attachment surface; low shear.</td><td style="padding:8px; border:1px solid #e2e8f0;">High sensitivity to fluid shear forces from impellers.</td></tr>
  </tbody>
</table>`,
  `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px; margin-bottom:20px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">5-Mark Exam Question: Explain the mechanism of cell adhesion to artificial surfaces and define the physiological process of anoikis.</h4>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    Cells attach to artificial culture surfaces through a three-step process:<br/>
    1. <strong>Adsorption:</strong> ECM glycoproteins from the serum (like fibronectin and vitronectin) coat the negatively charged plastic surface.<br/>
    2. <strong>Contact &amp; Binding:</strong> Integrin receptors on the cell membrane recognize and bind to specific amino acid sequences (like the RGD peptide sequence) on these adsorbed proteins.<br/>
    3. <strong>Spreading:</strong> This binding triggers internal signaling pathways that reorganize the actin cytoskeleton, flattening and anchoring the cell to the surface.<br/><br/>
    <strong>Anoikis:</strong> This term refers to a specific form of apoptosis (programmed cell death) that occurs when anchorage-dependent cells lose attachment to their surrounding extracellular matrix. Without integrin signaling, the cell activates internal pro-apoptotic molecules (like Bax and Bak), which destroy the cell to prevent it from growing in incorrect anatomical locations.
  </div>
</div>
<div style="background:#ffedd5; border-left:4px solid #ea580c; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#9a3412;">
  5. KINETICS OF CELL GROWTH
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Mathematical Principles &amp; Kinetics Profile</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  The growth of animal cells in a batch culture follows a standard kinetic curve divided into four phases: Lag Phase, Exponential (Log) Growth Phase, Stationary Phase, and Decline (Death) Phase. Because animal cells grow more slowly and are more fragile than microbial cultures, tracking their growth kinetics requires precise mathematical modeling.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Mathematical Derivations and Equations</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  During the exponential growth phase, the rate of biomass increase is directly proportional to the cell concentration present: <strong>dX/dt = μX</strong><br/>
  Where <em>X</em> represents viable cell density (cells/mL), <em>t</em> is time (hours), and <em>μ</em> is specific growth rate (hr⁻¹).<br/>
  Integrating this expression from initial time <em>t = 0</em> (cell density <em>X₀</em>) to <em>t</em> yields:<br/>
  <strong>ln(X_t) - ln(X_0) = μt  ⟹  X_t = X_0 · e^(μt)</strong><br/>
  Converting to common base-10 logarithms:<br/>
  <strong>μ = (ln X_t - ln X_0) / t = (2.303 · log10(X_t / X_0)) / t</strong><br/>
  The population doubling time (t_d) when X_t = 2X₀ gives:<br/>
  <strong>t_d = ln(2) / μ ≈ 0.693 / μ</strong>
</p>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 6px;">Nutrient Consumption &amp; Product Yield Coefficients</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  To measure how efficiently cells consume nutrients to produce biomass or target products, we use specific yield coefficients (Y). The biomass yield coefficient based on substrate consumption (Y_{X/S}) is calculated as:<br/>
  <strong>Y_{X/S} = ΔX / ΔS = (X_t - X_0) / (S_0 - S_t)</strong><br/>
  Where S₀ and S_t represent the substrate concentration (such as glucose or glutamine) at the start and end of the measurement period.
</p>
<div style="background:#fff7ed; border:1px solid #ffedd5; border-radius:8px; padding:12px; margin-top:14px; margin-bottom:16px; font-size:13px; color:#9a3412;">
  <strong>GATE Numerical Trick:</strong> When solving cell growth problems, make sure your units match. Biomass density can be reported as either cell count (cells/mL) or dry weight (g/L). The population doubling time t_d and specific growth rate μ are always inversely linked through the value 0.693.
</div>
<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">5-Mark Exam Question: A Chinese Hamster Ovary (CHO) cell culture is seeded at an initial density of 2.0 × 10⁵ cells/mL. After 48 hours of exponential growth, the cell density reaches 1.6 × 10⁶ cells/mL. Calculate the specific growth rate (μ) and the population doubling time (t_d).</h4>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    <strong>Given parameters:</strong> Initial density X₀ = 2.0 × 10⁵ cells/mL | Final density X_t = 1.6 × 10⁶ cells/mL | Time t = 48 hours<br/><br/>
    <strong>Step 1: Calculate specific growth rate (μ):</strong><br/>
    μ = [ln(X_t) - ln(X_0)] / t = [ln(1.6 × 10⁶) - ln(2.0 × 10⁵)] / 48<br/>
    μ = ln(1.6 × 10⁶ / 2.0 × 10⁵) / 48 = ln(8) / 48 = 2.0794 / 48 ≈ <strong>0.0433 hr⁻¹</strong><br/><br/>
    <strong>Step 2: Calculate population doubling time (t_d):</strong><br/>
    t_d = 0.693 / μ = 0.693 / 0.0433 ≈ <strong>16.01 hours</strong><br/><br/>
    <strong>Final Answer:</strong> The specific growth rate of the culture is <strong>0.0433 hr⁻¹</strong> and the population doubling time is <strong>16.01 hours</strong>.
  </div>
</div>`,
  `<div style="background:#ffedd5; border-left:4px solid #ea580c; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#9a3412;">
  6. MICRO &amp; MACRO-CARRIER CULTURE
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Definitions and Physical Principles</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Scaling up the production of anchorage-dependent cells using traditional, flat culture vessels is difficult because it requires excessive physical space and manual labor. Micro- and macro-carrier technologies solve this problem by providing small particles or porous matrices suspended in liquid media, which vastly increases the surface area available for cell attachment per unit volume.<br/>
  • <strong>Micro-carriers:</strong> Small solid or porous beads ranging from 100 to 300 micrometers in diameter, made from materials like dextran, polyacrylamide, glass, or polystyrene. Cells grow as a single layer (monolayer) across the outer surface of these beads, which are kept suspended in fluid inside stirred bioreactors.<br/>
  • <strong>Macro-carriers:</strong> Larger structures (ranging from several millimeters to centimeters) made from highly porous matrix materials like polyurethane foam, cellulose templates, or ceramic webs. Cells migrate into the internal pores of these structures, protecting them from fluid shear forces. Macro-carriers are typically used in packed-bed or fluidized-bed bioreactor systems.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Surface-Area-to-Volume Ratio Equations</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  For a spherical microcarrier with radius <em>r</em>, surface area (A_p) and volume (V_p) are:<br/>
  <strong>A_p = 4πr² &nbsp;|&nbsp; V_p = (4/3)πr³</strong><br/>
  Number of beads per unit volume N (for bead concentration C_b and density ρ_p):<br/>
  <strong>N = C_b / (ρ_p · V_p) = 3 C_b / (4π r³ ρ_p)</strong><br/>
  Total available surface area per unit volume:<br/>
  <strong>A_total = N · A_p = 3 C_b / (r · ρ_p)</strong><br/>
  This shows that reducing bead radius (r) or increasing bead concentration (C_b) directly increases total surface area for cell growth.
</p>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">Step-by-Step Bioreactor Setup Protocol</h3>
<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-bottom:16px;">
  <h4 style="margin:0 0 10px; color:#0f172a; font-size:14px;">Microcarrier Cultivation Protocol:</h4>
  <ol style="font-size:13px; color:#334155; line-height:1.7; padding-left:20px; margin:0;">
    <li>Hydrate dry dextran microcarriers in Ca²⁺ and Mg²⁺-free PBS for 3 hours, then sterilize via autoclave at 121°C for 20 minutes.</li>
    <li>Condition the sterile beads by rinsing with complete growth medium to coat surfaces with serum attachment proteins.</li>
    <li>Inoculate bioreactor with cells mixed with microcarriers using 1/3 final volume. Agitate gently for 2 min, then turn off for 30 min. Repeat cycle for 4 hours for attachment.</li>
    <li>Slowly add fresh medium to full volume and set impeller speed low (30-50 rpm) to keep beads suspended.</li>
  </ol>
</div>
<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px; margin-bottom:20px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">5-Mark Exam Question: Explain how fluid shear stress affects microcarrier cultures inside stirred-tank bioreactors. How can engineers minimize this damage?</h4>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    In microcarrier cultures, cells are exposed on the outer surface of beads, making them vulnerable to shear stress caused by impellers when turbulent eddy size matches or falls below bead diameter.<br/><br/>
    <strong>Engineers use three main strategies to minimize shear damage:</strong><br/>
    1. <strong>Optimizing Impeller Design:</strong> Using large-diameter, pitched-blade or marine-propeller impellers operating at low RPMs.<br/>
    2. <strong>Adding Protective Agents:</strong> Mixing non-ionic surfactants like <strong>Pluronic F-68</strong> to coat cell membranes and protect against bubble bursts.<br/>
    3. <strong>Using Porous Macro-carriers:</strong> Shielding cells inside internal pores from turbulent fluid movement.
  </div>
</div>
<div style="background:#ffedd5; border-left:4px solid #ea580c; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#9a3412;">
  7. HYBRIDOMA TECHNOLOGY
</div>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Hybridoma technology is a bioengineering method to produce identical, highly specific monoclonal antibodies (mAbs). The process works by fusing short-lived antibody-producing B-lymphocytes with immortal, non-secreting myeloma cells.
</p>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">The Selection Mechanism: HAT Selection Medium</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Fusing cells using PEG (Polyethylene Glycol) produces a mixture of unfused B-cells, unfused myeloma cells, and fused hybrids. To isolate the correct B-cell-myeloma hybrids, the mixture is grown in <strong>HAT Medium</strong> (Hypoxanthine, Aminopterin, Thymidine):<br/>
  • <strong>The De Novo Pathway:</strong> Constructs nucleotides from basic amino acids and sugars. Blocked by <strong>Aminopterin</strong> in HAT medium.<br/>
  • <strong>The Salvage Pathway:</strong> Recycles pre-existing bases (Hypoxanthine &amp; Thymidine) using <strong>HGPRT</strong> (Hypoxanthine-Guanine Phosphoribosyltransferase) and <strong>TK</strong> (Thymidine Kinase).
</p>
<div style="background:#fff7ed; border:1px solid #ffedd5; border-radius:8px; padding:12px; margin-top:14px; font-size:13px; color:#9a3412;">
  <strong>GATE Selection Logic:</strong> Myeloma cells used are engineered to be <strong>HGPRT⁻</strong>. In HAT medium, de novo synthesis is blocked by aminopterin and salvage is blocked by HGPRT deficiency, so all unfused myeloma cells die. Unfused B-cells possess HGPRT but die naturally within days due to finite lifespan. Only fused hybridomas survive: they inherit HGPRT from the B-cell and immortality from the myeloma cell.
</div>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">Step-by-Step Monoclonal Antibody Production Protocol</h3>
<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-bottom:16px;">
  <h4 style="margin:0 0 10px; color:#0f172a; font-size:14px;">Hybridoma Protocol Steps:</h4>
  <ol style="font-size:13px; color:#334155; line-height:1.7; padding-left:20px; margin:0;">
    <li>Inject target antigen into a laboratory animal (mouse) to trigger an immune response.</li>
    <li>Harvest animal's spleen containing enriched antibody-producing B-lymphocytes.</li>
    <li>Mix spleen cells with HGPRT⁻ myeloma cells in a centrifuge tube with Polyethylene Glycol (PEG) for 1-2 minutes to fuse membranes.</li>
    <li>Wash out PEG, resuspend in complete medium + HAT, and distribute across 96-well plates.</li>
    <li>Incubate 10-14 days. Screen supernatants using ELISA assay to identify target antibody-producing colonies.</li>
    <li>Perform limiting dilution cloning to establish single-cell monoclonal hybridoma lines.</li>
  </ol>
</div>
<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">5-Mark Exam Question: Detail the biochemical mechanism of HAT medium selection in hybridoma production. Why are HGPRT-deficient myeloma lines vital?</h4>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    1. <strong>Aminopterin Block:</strong> Aminopterin inhibits DHFR, shutting down de novo purine/pyrimidine synthesis.<br/>
    2. <strong>Salvage Pathway Dependency:</strong> Cells must use HGPRT and TK to recycle hypoxanthine and thymidine.<br/>
    3. <strong>Death of Unfused Myeloma:</strong> Myeloma is HGPRT⁻, so it cannot use salvage and dies under aminopterin block.<br/>
    4. <strong>Death of Unfused B-Cells:</strong> B-cells are HGPRT⁺ but die naturally within a few days due to finite lifespan.<br/>
    5. <strong>Survival of Hybridomas:</strong> Hybrids inherit HGPRT⁺ from B-cells and immortality from myeloma, surviving indefinitely in HAT.
  </div>
</div>`,
  `<div style="background:#ffedd5; border-left:4px solid #ea580c; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#9a3412;">
  8. STEM CELL TECHNOLOGY
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Definitions and Core Capabilities</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Stem cells are unspecialized progenitor cells defined by two cardinal properties: <strong>Self-Renewal</strong> (unlimited division in unspecialized state) and <strong>Potency</strong> (capacity to differentiate into specialized cell types).
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Classification by Differentiation Potency</h3>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li><strong>Totipotent Stem Cells:</strong> Can form all embryonic and extra-embryonic tissues (zygote, early blastomeres).</li>
  <li><strong>Pluripotent Stem Cells:</strong> Differentiate into all 3 germ layers (endoderm, mesoderm, ectoderm). Example: ESCs from inner cell mass of blastocyst.</li>
  <li><strong>Multipotent Stem Cells:</strong> Restricted to cell types within a specific lineage (e.g., Hematopoietic Stem Cells).</li>
  <li><strong>Unipotent Stem Cells:</strong> Differentiate into a single cell type (e.g., epidermal basal stem cells).</li>
</ul>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Induced Pluripotent Stem Cells (iPSCs)</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Developed in 2006 by Shinya Yamanaka by expressing four master transcription factors in adult somatic cells:<br/>
  <strong>Yamanaka Factors = {Oct4, Sox2, Klf4, c-Myc}</strong><br/>
  These factors reactivate pluripotency gene networks and silence adult tissue-specific genes.
</p>
<div style="background:#fff7ed; border:1px solid #ffedd5; border-radius:8px; padding:12px; margin-top:14px; font-size:13px; color:#9a3412;">
  <strong>GATE Regulatory Concept:</strong> While c-Myc enhances reprogramming efficiency, it is a proto-oncogene that poses teratoma risks. Modern methods use non-integrating RNA or small molecules to replace c-Myc.
</div>`,
  `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px; margin-bottom:20px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">5-Mark Exam Question: What are iPSCs? State the factors used to generate them and discuss their advantages over Embryonic Stem Cells.</h4>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    <strong>Definition:</strong> iPSCs are adult somatic cells reprogrammed into an embryonic-like pluripotent state using transcription factors (Oct4, Sox2, Klf4, c-Myc).<br/><br/>
    <strong>Advantages over ESCs:</strong><br/>
    1. <strong>No Ethical Conflict:</strong> Generated from skin/blood biopsies, avoiding destruction of human blastocysts.<br/>
    2. <strong>Patient-Specific Therapeutics:</strong> Retain the patient's exact genetic match, eliminating immune rejection without immunosuppressive drugs.
  </div>
</div>
<div style="background:#ffedd5; border-left:4px solid #ea580c; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#9a3412;">
  9. ANIMAL CLONING &amp; TRANSGENIC ANIMALS
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Definitions and Underlying Principles</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  • <strong>Animal Cloning:</strong> Producing a genetically identical copy of a multicellular animal using <strong>Somatic Cell Nuclear Transfer (SCNT)</strong>.<br/>
  • <strong>Transgenic Animals:</strong> Animals with foreign DNA (transgenes) stably integrated into their germline, passing traits to offspring.
</p>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Working Principle of SCNT</h3>
<p style="font-size:13.5px; color:#334155; line-height:1.7;">
  Differentiated adult cell nuclei retain full genomic potential. Transferred into an open, enucleated oocyte, egg cytoplasm factors reprogram the adult nucleus back to embryonic totipotency.
</p>`,
  `<h3 style="font-size:15px; color:#0f172a; margin:0 0 8px;">Step-by-Step SCNT Execution Protocol</h3>
<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-bottom:16px;">
  <h4 style="margin:0 0 10px; color:#0f172a; font-size:14px;">SCNT Protocol Steps:</h4>
  <ol style="font-size:13px; color:#334155; line-height:1.7; padding-left:20px; margin:0;">
    <li>Harvest MII-stage unfertilized oocytes and remove the nucleus (enucleation).</li>
    <li>Starve donor somatic cells in culture to force them into resting G0 phase.</li>
    <li>Place donor cell beside enucleated oocyte and apply electrofusion pulses.</li>
    <li>Activate fused egg with chemical stimuli (ionomycin) to initiate cleavage.</li>
    <li>Implant blastocyst-stage embryo into a synchronized surrogate mother.</li>
  </ol>
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Methods for Generating Transgenic Animals</h3>
<ul style="font-size:13.5px; color:#334155; line-height:1.7; padding-left:20px;">
  <li><strong>Pronuclear Microinjection:</strong> Direct injection into male pronucleus of fertilized zygote.</li>
  <li><strong>ES Cell Mediated Transfer:</strong> Transfection of ESCs, injection into blastocysts to form chimeras.</li>
  <li><strong>Lentiviral Transduction:</strong> Recombinant retroviral vector infection of early embryos.</li>
</ul>
<div style="background:#fff7ed; border:1px solid #ffedd5; border-radius:8px; padding:12px; margin-top:14px; font-size:13px; color:#9a3412;">
  <strong>GATE Engineering Focus:</strong> Targeted CRISPR-Cas9 editing replaces random integration to prevent host gene disruption and insert transgenes precisely via HDR.
</div>`,
  `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px; margin-bottom:20px;">
  <h4 style="margin:0 0 8px; color:#166534; font-size:14px;">5-Mark Exam Question: Outline SCNT steps for cloning and highlight major efficiency bottlenecks.</h4>
  <div style="font-size:13px; color:#14532d; line-height:1.6;">
    <strong>Steps:</strong> 1. Enucleation 2. Donor G0 Conditioning 3. Electrofusion 4. Chemical Activation 5. Surrogate Implantation.<br/><br/>
    <strong>Efficiency Bottleneck:</strong> SCNT success rate is low (1–5%). The main cause is <strong>incomplete epigenetic reprogramming</strong> of donor DNA methylation/histone marks, leading to developmental failure and Large Offspring Syndrome (LOS).
  </div>
</div>
<div style="background:#ffedd5; border-left:4px solid #ea580c; padding:12px 16px; margin-bottom:16px; font-weight:700; color:#9a3412;">
  10. GATE FOCUS: HIGH-YIELD SUMMARY &amp; COMPREHENSIVE FAQ
</div>
<h3 style="font-size:15px; color:#0f172a; margin:16px 0 6px;">Essential Formula Guide for GATE Numerical Problems</h3>
<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:14px; font-size:13px; line-height:1.8;">
  • <strong>Specific Growth Rate:</strong> μ = (ln X2 - ln X1) / (t2 - t1)<br/>
  • <strong>Doubling Time:</strong> t_d = 0.693 / μ<br/>
  • <strong>Biomass Yield:</strong> Y_{X/S} = (X_final - X_initial) / (S_initial - S_final)<br/>
  • <strong>Microcarrier Total Area:</strong> A_total = 3 C_b / (r · ρ_p)
</div>`,
  `<h4 style="font-size:14px; color:#0f172a; margin:0 0 10px;">Frequently Asked Questions (FAQs)</h4>
<div style="font-size:13px; color:#334155; line-height:1.6;">
  <p><strong>Q1: Why is L-Glutamine uniquely essential but problematic?</strong><br/>
  <em>Answer:</em> It provides energy and nitrogen, but spontaneously degrades at 37°C into toxic ammonium (NH4+). Stable dipeptides (L-alanyl-L-glutamine) are used as replacements.</p>
  <p><strong>Q2: What is the function of Pluronic F-68 in bioreactors?</strong><br/>
  <em>Answer:</em> Non-ionic surfactant that lowers surface tension and coats cell membranes, protecting cells from sparging and shear stress.</p>
  <p><strong>Q3: How does mycoplasma contamination differ from bacterial contamination?</strong><br/>
  <em>Answer:</em> Mycoplasma lack cell walls (0.15–0.3 µm), pass through 0.22 µm filters, are resistant to penicillin, and infect cultures invisibly.</p>
  <p><strong>Q4: What is contact inhibition and how does it change upon transformation?</strong><br/>
  <em>Answer:</em> Adherent cells stop dividing upon contact. Transformed/cancer cells lose contact inhibition and form multi-layered clumps.</p>
  <p><strong>Q5: Why is the male pronucleus preferred for microinjection?</strong><br/>
  <em>Answer:</em> The male pronucleus is larger and clearer under a microscope than the female pronucleus, improving injection accuracy.</p>
</div>
<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-top:16px;">
  <h4 style="margin:0 0 8px; color:#0f172a; font-size:14px;">🎓 Final Exam Preparation Checklist</h4>
  <ol style="font-size:12.5px; color:#334155; line-height:1.6; padding-left:20px; margin:0;">
    <li>Master the distinction between Primary and Continuous Cell Lines.</li>
    <li>Memorize the Henderson-Hasselbalch equation and buffering parameters (5% CO2, pH 7.4).</li>
    <li>Practice growth kinetics calculations (μ, t_d, Y_{X/S}).</li>
    <li>Understand HAT selection (Aminopterin block + HGPRT salvage).</li>
    <li>Memorize the 4 Yamanaka Factors (Oct4, Sox2, Klf4, c-Myc) and SCNT steps.</li>
  </ol>
</div>`
];

/* ── Continuous Scroll PDF Document Viewer Component ── */
function ContinuousPdfViewer({ topic }) {
  function handleOpenNewWindow() {
    const newWin = window.open("", "_blank");
    if (!newWin) return;

    let pagesHtml = "";
    if (topic.id === "topic-01") {
      pagesHtml = FULL_BIOMOLECULES_19_PAGES.map((pgContent, idx) => `
        <div class="page">
          <div class="header">
            <div>
              <div class="badge">B.TECH BIOTECHNOLOGY · GATE STUDY GUIDE</div>
              <h2 class="title">${topic.name}</h2>
            </div>
            <span style="font-size: 12px; font-weight: 700; color: #64748b;">PAGE ${idx + 1} OF 19</span>
          </div>
          ${pgContent}
          <div class="footer"><span>BioConnect Academic Series</span><span>Page ${idx + 1} of 19</span></div>
        </div>
      `).join("");
    } else if (topic.id === "topic-02") {
      pagesHtml = FULL_GENETICS_23_PAGES.map((pgContent, idx) => `
        <div class="page">
          <div class="header">
            <div>
              <div class="badge">B.TECH BIOTECHNOLOGY · GATE MASTER STUDY GUIDE</div>
              <h2 class="title">${topic.name}</h2>
            </div>
            <span style="font-size: 12px; font-weight: 700; color: #64748b;">PAGE ${idx + 1} OF 23</span>
          </div>
          ${pgContent}
          <div class="footer"><span>BioConnect Academic Series</span><span>Page ${idx + 1} of 23</span></div>
        </div>
      `).join("");
    } else if (topic.id === "topic-04") {
      pagesHtml = FULL_ANIMAL_CELL_18_PAGES.map((pgContent, idx) => `
        <div class="page">
          <div class="header">
            <div>
              <div class="badge">B.TECH BIOTECHNOLOGY · GATE MASTER STUDY GUIDE</div>
              <h2 class="title">${topic.name}</h2>
            </div>
            <span style="font-size: 12px; font-weight: 700; color: #64748b;">PAGE ${idx + 1} OF 18</span>
          </div>
          ${pgContent}
          <div class="footer"><span>BioConnect Academic Series</span><span>Page ${idx + 1} of 18</span></div>
        </div>
      `).join("");
    } else {
      pagesHtml = topic.sections.map((sec, idx) => `
        <div class="page">
          <div class="header">
            <div>
              <div class="badge">B.TECH BIOTECHNOLOGY · GATE STUDY NOTES</div>
              <h2 class="title">${topic.name}</h2>
            </div>
            <span style="font-size: 12px; font-weight: 700; color: #64748b;">PAGE ${idx + 1} OF ${topic.sections.length + 1}</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: ${topic.color}; margin-bottom: 12px;">${sec.title}</h3>
          <div class="card">
            <div class="card-body">${sec.content}</div>
          </div>
          <div class="footer"><span>BioConnect Academic Series</span><span>Page ${idx + 1}</span></div>
        </div>
      `).join("") + `
        <div class="page">
          <div class="header">
            <div>
              <div class="badge">B.TECH BIOTECHNOLOGY · GATE STUDY NOTES</div>
              <h2 class="title">${topic.name}</h2>
            </div>
            <span style="font-size: 12px; font-weight: 700; color: #64748b;">PAGE ${topic.sections.length + 1} OF ${topic.sections.length + 1}</span>
          </div>
          <h3 style="font-size: 15px; font-weight: 700; color: #dc2626; margin-bottom: 12px;">Exam Traps & High-Yield Summary</h3>
          <div class="trap">
            <h4 style="font-size: 14px; font-weight: 700; color: #991b1b; margin: 0 0 10px;">⚠️ CRITICAL EXAM TRAPS</h4>
            <ul style="padding-left: 20px; margin: 0;">
              ${topic.examTraps.map(trap => `<li style="margin-bottom: 8px;">${trap}</li>`).join("")}
            </ul>
          </div>
          <div class="footer"><span>BioConnect Academic Series</span><span>End of Document</span></div>
        </div>
      `;
    }

    const pageHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${topic.pdfTitle}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #fff; margin: 0; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
    .toolbar { max-width: 820px; width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .print-btn { background: ${topic.color}; color: #fff; border: none; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; }
    .page { background: #ffffff; color: #1e293b; border-radius: 14px; padding: 40px; max-width: 820px; width: 100%; box-shadow: 0 12px 36px rgba(0,0,0,0.4); margin-bottom: 32px; box-sizing: border-box; }
    .header { border-bottom: 2px solid ${topic.color}; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 19px; font-weight: 800; color: #0f172a; margin: 4px 0 0; }
    .badge { font-size: 11px; font-weight: 700; color: ${topic.color}; letter-spacing: 1px; text-transform: uppercase; }
    .card { background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .card-body { white-space: pre-line; font-size: 13.5px; color: #334155; line-height: 1.7; }
    .trap { background: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 12px; padding: 20px; color: #7f1d1d; margin-bottom: 20px; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <h3 style="margin:0; font-size: 16px;">📄 ${topic.pdfTitle}</h3>
      <p style="margin:2px 0 0; font-size: 12px; color: #94a3b8;">B.Tech Biotechnology · Complete Master Study Guide (${topic.id === "topic-01" ? 19 : topic.id === "topic-02" ? 23 : topic.sections.length + 1} Pages)</p>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  ${pagesHtml}
</body>
</html>`;

    newWin.document.write(pageHtml);
    newWin.document.close();
  }

  return (
    <div style={{
      background: "#1E293B",
      borderRadius: "16px",
      padding: "24px",
      color: "#fff",
      boxShadow: "0 12px 36px rgba(0,0,0,0.3)",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }}>
      {/* PDF Header / Toolbar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: "16px", borderBottom: "1.5px solid rgba(255,255,255,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>📄</span>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "#fff" }}>{topic.pdfTitle}</h3>
            <p style={{ fontSize: "12px", color: "#94A3B8", margin: "2px 0 0" }}>
              {topic.id === "topic-01" ? "Executive Syllabus Summary • Full 19-Page PDF Document Available below" : topic.id === "topic-02" ? "Executive Syllabus Summary • Full 23-Page PDF Document Available below" : topic.id === "topic-04" ? "Executive Syllabus Summary • Full 18-Page PDF Document Available below" : `Continuous Straight Scroll View • (${topic.sections.length + 1} Pages)`}
            </p>
          </div>
        </div>

        {/* Clickable Button to Open PDF in New Window */}
        <button
          onClick={handleOpenNewWindow}
          style={{
            background: topic.color, color: "#fff", border: "none",
            padding: "8px 18px", borderRadius: "10px", fontSize: "12.5px", fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
            boxShadow: "0 3px 12px " + topic.color + "40", transition: "all 0.2s"
          }}
          title={topic.id === "topic-01" ? "Click to open full 19-page PDF document in a new browser tab/window" : topic.id === "topic-02" ? "Click to open full 23-page PDF document in a new browser tab/window" : topic.id === "topic-04" ? "Click to open full 18-page PDF document in a new browser tab/window" : "Click to open full PDF in a new browser tab/window"}
        >
          <span>↗️</span>
          <span>{topic.id === "topic-01" ? "Open Full 19-Page PDF" : topic.id === "topic-02" ? "Open Full 23-Page PDF" : topic.id === "topic-04" ? "Open Full 18-Page PDF" : "Open PDF in New Window"}</span>
        </button>
      </div>

      {/* IN-APP STUDY NOTES SUMMARY VIEWER */}
      <div
        onClick={handleOpenNewWindow}
        style={{
          maxHeight: "680px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          paddingRight: "8px",
          cursor: "pointer"
        }}
        title={topic.id === "topic-01" ? "Click anywhere on the study notes viewer to open full 19-page PDF document in new window" : topic.id === "topic-02" ? "Click anywhere on the study notes viewer to open full 23-page PDF document in new window" : topic.id === "topic-04" ? "Click anywhere on the study notes viewer to open full 18-page PDF document in new window" : "Click anywhere on the PDF viewer to open full document in new window"}
      >
        {topic.sections.map((sec, idx) => (
          <div key={idx} style={{
            background: "#ffffff", color: "#1e293b", borderRadius: "12px", padding: "32px 36px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontFamily: "system-ui, -apple-system, sans-serif"
          }}>
            <div style={{ borderBottom: "2px solid " + topic.color, paddingBottom: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: topic.color, letterSpacing: "1px" }}>B.TECH BIOTECHNOLOGY · GATE MASTER STUDY GUIDE</span>
                <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>{topic.name}</h2>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" }}>SUMMARY MODULE {idx + 1} OF {topic.sections.length} ↗️</span>
            </div>

            <h3 style={{ fontSize: "15px", fontWeight: 700, color: topic.color, marginBottom: "14px" }}>{sec.title}</h3>
            <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "20px", border: "1px solid #e2e8f0", whiteSpace: "pre-line", fontSize: "13.5px", color: "#334155", lineHeight: "1.7" }}>
              {sec.content}
            </div>

            <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
              <span>BioConnect Academic Series · Click to open full 23-page PDF in new tab</span>
              <span>Module {idx + 1}</span>
            </div>
          </div>
        ))}

        {/* Final Summary Page */}
        <div style={{
          background: "#ffffff", color: "#1e293b", borderRadius: "12px", padding: "32px 36px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          <div style={{ borderBottom: "2px solid " + topic.color, paddingBottom: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: topic.color, letterSpacing: "1px" }}>B.TECH BIOTECHNOLOGY · GATE MASTER STUDY GUIDE</span>
              <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>{topic.name}</h2>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" }}>EXAM TRAPS ↗️</span>
          </div>

          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#dc2626", marginBottom: "12px" }}>Exam Traps & High-Yield Summary</h3>
          <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#991b1b", margin: "0 0 10px" }}>⚠️ CRITICAL EXAM TRAPS</h4>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              {topic.examTraps.map((trap, idx) => (
                <li key={idx} style={{ marginBottom: "8px", color: "#7f1d1d", fontSize: "13.5px" }}>{trap}</li>
              ))}
            </ul>
          </div>

          <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: "12px", padding: "20px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#166534", margin: "0 0 10px" }}>📝 TOPIC PYQ SUMMARY ({topic.pyqs.length} MCQs)</h4>
            <p style={{ fontSize: "13.5px", color: "#14532d", margin: 0 }}>
              This topic includes <strong>{topic.pyqs.length} authentic GAT-B questions</strong> with complete answer keys and detailed explanations. Switch to the <strong>"Topic PYQ MCQs ({topic.pyqs.length})"</strong> tab above to practice!
            </p>
          </div>

          <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
            <span>BioConnect Academic Series · Click to open full 23-page PDF in new tab</span>
            <span>End of Syllabus Summary</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Interactive Course / Topic Viewer Modal ── */
function CourseTopicModal({ topic, onClose, supabase, profile, onXPUpdate }) {
  const [activeTab, setActiveTab] = useState("notes"); // "notes" | "pyq"
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    // Automatically complete "Read 4 pages" quest when opening topic course
    markQuestCompleted("read_pages");
  }, []);

  function handleSelectOption(optIdx) {
    if (submitted[currentQ] || isFinished) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQ]: optIdx }));
  }

  function handleSubmitAnswer() {
    if (selectedAnswers[currentQ] === undefined) return;
    setSubmitted(prev => ({ ...prev, [currentQ]: true }));
  }

  async function handleFinishPYQ() {
    setIsFinished(true);
    markQuestCompleted("pyq_challenge");
    let correctCount = 0;
    topic.pyqs.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correctCount += 1;
    });

    const earned = Math.round((correctCount / topic.pyqs.length) * 100);
    setXpEarned(earned);

    if (profile?.id && earned > 0) {
      try {
        const currentXP = profile.xp || 0;
        await supabase
          .from("profiles")
          .update({ xp: currentXP + earned })
          .eq("id", profile.id);
        if (onXPUpdate) onXPUpdate(currentXP + earned);
      } catch (e) {}
    }
  }

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
        width: "100%", maxWidth: "880px",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        border: "1px solid #E2EEF0",
        display: "flex", flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 32px",
          borderBottom: "1.5px solid #E2EEF0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#F8FCFC",
          borderTopLeftRadius: "24px", borderTopRightRadius: "24px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: 48, height: 48, borderRadius: "14px", background: topic.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
              {topic.icon}
            </div>
            <div>
              <h2 style={{ fontSize: "19px", fontWeight: 800, color: "#1B2B3A", margin: 0 }}>{topic.name}</h2>
              <p style={{ fontSize: "13px", color: "#6B8A9A", margin: "3px 0 0" }}>{topic.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#E2EEF0", color: "#4A5568", border: "none",
              width: "38px", height: "38px", borderRadius: "50%",
              fontSize: "16px", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", borderBottom: "1px solid #E2EEF0", background: "#ffffff", padding: "0 32px" }}>
          <button
            onClick={() => setActiveTab("notes")}
            style={{
              padding: "14px 20px", background: "none", border: "none",
              borderBottom: activeTab === "notes" ? `3px solid ${topic.color}` : "3px solid transparent",
              color: activeTab === "notes" ? topic.color : "#6B8A9A",
              fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit"
            }}
          >
            📚 Study Notes & PDF Content
          </button>
          <button
            onClick={() => setActiveTab("pyq")}
            style={{
              padding: "14px 20px", background: "none", border: "none",
              borderBottom: activeTab === "pyq" ? `3px solid ${topic.color}` : "3px solid transparent",
              color: activeTab === "pyq" ? topic.color : "#6B8A9A",
              fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: "6px"
            }}
          >
            📝 Topic PYQ MCQs ({topic.pyqs.length})
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: "28px 32px", flex: 1 }}>
          {activeTab === "notes" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Continuous Straight Scroll PDF Viewer */}
              <ContinuousPdfViewer topic={topic} />

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setActiveTab("pyq")}
                  style={{ background: topic.color, color: "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
                >
                  Practice Topic PYQs ({topic.pyqs.length}) →
                </button>
              </div>
            </div>
          ) : (
            /* PYQ MCQ Section for Topic */
            <div>
              {!isFinished ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: topic.color, textTransform: "uppercase" }}>
                      Question {currentQ + 1} of {topic.pyqs.length}
                    </span>
                    <span style={{ fontSize: "12px", color: "#6B8A9A" }}>
                      Authentic GAT-B Exam Questions
                    </span>
                  </div>

                  {/* Question */}
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A", marginBottom: "20px", lineHeight: "1.4" }}>
                    {topic.pyqs[currentQ].question}
                  </h3>

                  {/* Options */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                    {topic.pyqs[currentQ].options.map((optText, optIdx) => {
                      const isSelectedOpt = selectedAnswers[currentQ] === optIdx;
                      const isCorrectOpt = topic.pyqs[currentQ].correct === optIdx;
                      const isAnsSubmitted = submitted[currentQ];

                      let optBg = "#ffffff";
                      let optBorder = "#E2EEF0";
                      let optColor = "#1B2B3A";

                      if (isAnsSubmitted) {
                        if (isCorrectOpt) {
                          optBg = "#F0FDF4";
                          optBorder = "#22C55E";
                          optColor = "#15803D";
                        } else if (isSelectedOpt && !isCorrectOpt) {
                          optBg = "#FEF2F2";
                          optBorder = "#EF4444";
                          optColor = "#991B1B";
                        }
                      } else if (isSelectedOpt) {
                        optBg = topic.color + "15";
                        optBorder = topic.color;
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          style={{
                            padding: "14px 18px", borderRadius: "12px",
                            background: optBg, border: `2px solid ${optBorder}`, color: optColor,
                            cursor: isAnsSubmitted ? "default" : "pointer",
                            display: "flex", alignItems: "center", gap: "12px", fontSize: "14.5px"
                          }}
                        >
                          <span style={{ fontWeight: 700, opacity: 0.7 }}>{String.fromCharCode(65 + optIdx)}.</span>
                          <span style={{ flex: 1 }}>{optText}</span>
                          {isAnsSubmitted && isCorrectOpt && <span>✅</span>}
                          {isAnsSubmitted && isSelectedOpt && !isCorrectOpt && <span>❌</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution Box */}
                  {submitted[currentQ] && (
                    <div style={{ background: "#F0F9FF", border: "1.5px solid #BAE6FD", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#0284C7", marginBottom: "4px" }}>💡 Solution & Explanation</div>
                      <p style={{ fontSize: "13.5px", color: "#334155", margin: 0 }}>{topic.pyqs[currentQ].explanation}</p>
                    </div>
                  )}

                  {/* Next / Submit Buttons */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      disabled={currentQ === 0}
                      onClick={() => setCurrentQ(prev => prev - 1)}
                      style={{ background: "#F0F7F8", border: "1px solid #D0E5E8", color: "#4A5568", padding: "9px 18px", borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: currentQ === 0 ? "not-allowed" : "pointer", opacity: currentQ === 0 ? 0.4 : 1 }}
                    >
                      ← Previous
                    </button>

                    {!submitted[currentQ] ? (
                      <button
                        disabled={selectedAnswers[currentQ] === undefined}
                        onClick={handleSubmitAnswer}
                        style={{ background: topic.color, color: "#fff", border: "none", padding: "10px 22px", borderRadius: "8px", fontWeight: 700, fontSize: "13.5px", cursor: selectedAnswers[currentQ] !== undefined ? "pointer" : "not-allowed", opacity: selectedAnswers[currentQ] !== undefined ? 1 : 0.4 }}
                      >
                        Submit Answer
                      </button>
                    ) : currentQ < topic.pyqs.length - 1 ? (
                      <button
                        onClick={() => setCurrentQ(prev => prev + 1)}
                        style={{ background: "#14B8A6", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "8px", fontWeight: 700, fontSize: "13.5px", cursor: "pointer" }}
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishPYQ}
                        style={{ background: "#22C55E", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: 700, fontSize: "13.5px", cursor: "pointer" }}
                      >
                        Finish Topic Quiz 🏆
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Topic Quiz Result */
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#1B2B3A" }}>Topic Practice Completed!</h3>
                  <p style={{ color: "#6B8A9A", fontSize: "14px", marginTop: "4px" }}>You scored +{xpEarned} XP on {topic.shortName}</p>
                  <button onClick={onClose} style={{ background: topic.color, color: "#fff", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: 700, marginTop: "20px", cursor: "pointer" }}>
                    Close & Continue Learning
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
    markQuestCompleted("pyq_challenge");
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
      } catch (e) {}
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
            <span style={{ fontSize: "22px" }}>{challenge.subject.includes("Biomolecules") ? "🧪" : "⏱️"}</span>
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
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const isResearcher = profile?.role === "researcher";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" }}>
      {/* LEFT — main content */}
      <div>
        {/* Continue banner */}
        <div style={{ background: "linear-gradient(135deg, #132D35 0%, #1B4A5A 100%)", borderRadius: "20px", padding: "28px 32px", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "11px", color: "#14B8A6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", background: "rgba(20,184,166,0.15)", padding: "4px 10px", borderRadius: "6px" }}>UP NEXT</span>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "10px 0 6px" }}>Advanced Genetics & Molecular Biology</h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", marginBottom: "20px" }}>Genetics • 4 pages remaining</p>
            <button onClick={() => { setActiveTopic(COURSE_TOPICS[1]); markQuestCompleted("read_pages"); }} style={{ background: "#fff", color: "#132D35", border: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Continue Learning →</button>
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
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>Biomolecules & Bioenergetics PYQs</p>
              <p style={{ fontSize: "12px", color: "#6B8A9A" }}>20 MCQs • <span style={{ color: "#F97316", fontWeight: 600 }}>+200 XP</span></p>
            </div>
            <button onClick={() => setActiveChallenge("genetics")} style={{ background: "#F97316", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Start Challenge</button>
          </div>
          <div style={{ background: "#F3F0FF", borderRadius: "14px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #DDD6FE" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>Genetics & MolBio PYQs</p>
              <p style={{ fontSize: "12px", color: "#6B8A9A" }}>15 MCQs • <span style={{ color: "#8B5CF6", fontWeight: 600 }}>+150 XP</span></p>
            </div>
            <button onClick={() => setActiveChallenge("mock")} style={{ background: "#8B5CF6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Start Challenge</button>
          </div>
        </div>

        {/* Active Courses — Updated with PDF topics */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A", margin: 0 }}>Active Courses & Topic Modules</h2>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#14B8A6", background: "#E6F4F1", padding: "4px 10px", borderRadius: "6px" }}>
            GATE & Academic Notes
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {COURSE_TOPICS.map(topic => (
            <div key={topic.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2EEF0", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.2s" }}>
              <div style={{ width: 44, height: 44, borderRadius: "12px", background: topic.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                {topic.icon}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", margin: 0 }}>{topic.name}</h3>
              </div>

              <div style={{ width: "120px", flexShrink: 0 }}>
                <div style={{ height: 5, background: "#E2EEF0", borderRadius: "4px" }}>
                  <div style={{ height: 5, width: `${topic.progress}%`, background: topic.color, borderRadius: "4px" }}></div>
                </div>
              </div>

              <button
                onClick={() => { setActiveTopic(topic); markQuestCompleted("read_pages"); }}
                style={{
                  background: topic.color + "12", color: topic.color,
                  border: `1.5px solid ${topic.color}30`,
                  padding: "8px 16px", borderRadius: "10px",
                  fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                  flexShrink: 0
                }}
              >
                View Course →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR — LiveStudentWidgets */}
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

      {/* Active Course Topic Viewer Modal */}
      {activeTopic && (
        <CourseTopicModal
          topic={activeTopic}
          onClose={() => setActiveTopic(null)}
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
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" }}>
        {[
          { label: "Total Materials", value: "4 Topic Sets", icon: "📚", color: "#14B8A6" },
          { label: "Subjects", value: "4 Modules", icon: "🧬", color: "#8B5CF6" },
          { label: "Students Enrolled", value: "250+", icon: "👥", color: "#F97316" },
          { label: "PYQ Sets", value: "50+ MCQs", icon: "📝", color: "#3B82F6" },
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
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A" }}>Topic Courses & PDF Notes</h2>
            <span style={{ fontSize: "13px", color: "#14B8A6", fontWeight: 500 }}>Active Syllabus</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {COURSE_TOPICS.map(topic => (
              <div key={topic.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2EEF0", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "20px" }}>{topic.icon}</span>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1B2B3A", margin: 0 }}>{topic.name}</p>
                    <p style={{ fontSize: "12px", color: "#6B8A9A", margin: 0 }}>{topic.pdfTitle}</p>
                  </div>
                </div>
                <button onClick={() => setActiveTopic(topic)} style={{ background: topic.color + "15", color: topic.color, border: `1.5px solid ${topic.color}30`, padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                  Preview
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PYQ MCQs */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A" }}>PYQ Challenge Sets</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { title: "Biomolecules & Bioenergetics PYQs", count: 20, xp: 200, subject: "GAT-B 2020-2023", color: "#F97316", bg: "#FFF3E8", key: "genetics" },
              { title: "Genetics & MolBio PYQs", count: 15, xp: 150, subject: "GAT-B 2020-2024", color: "#8B5CF6", bg: "#F3F0FF", key: "mock" },
            ].map(q => (
              <div key={q.title} style={{ background: q.bg, borderRadius: "14px", padding: "18px 20px", border: `1px solid ${q.color}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>{q.title}</p>
                    <p style={{ fontSize: "12px", color: "#6B8A9A" }}>{q.count} MCQs • {q.subject} • <span style={{ color: q.color, fontWeight: 600 }}>+{q.xp} XP</span></p>
                  </div>
                  <button onClick={() => setActiveChallenge(q.key)} style={{ background: q.color, color: "#fff", border: "none", padding: "7px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Preview Quiz
                  </button>
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

      {/* Active Course Topic Viewer Modal */}
      {activeTopic && (
        <CourseTopicModal
          topic={activeTopic}
          onClose={() => setActiveTopic(null)}
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
      if (!user) {
        window.location.href = "/login";
        return;
      }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  function handleXPUpdate(newXP) {
    setProfile(prev => (prev ? { ...prev, xp: newXP } : prev));
  }

  if (loading) {
    return (
      <AppShell active="/learning">
        <div style={{ textAlign: "center", padding: "100px", color: "#9CA3AF" }}>Loading...</div>
      </AppShell>
    );
  }

  return (
    <AppShell active="/learning">
      {profile?.role === "educator" ? (
        <EducatorView supabase={supabase} profile={profile} onXPUpdate={handleXPUpdate} />
      ) : (
        <StudentView supabase={supabase} profile={profile} onXPUpdate={handleXPUpdate} />
      )}
    </AppShell>
  );
}
