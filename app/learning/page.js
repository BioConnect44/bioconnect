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
    pdfTitle: "Topic 02 - Advanced Genetics & Molecular Biology.pdf",
    sections: [
      {
        title: "1. Genome Structure & Chromatin",
        content: `• Tiers of Compaction: 146 bp DNA wound 1.65x around histone octamer (2x H2A, H2B, H3, H4) → 11 nm 'beads on a string' (linker H1) → 30 nm solenoid (~6 nucleosomes/turn) → Loop domains & scaffold (Topoisomerase II & condensin).
• Euchromatin: Open, active; high histone acetylation (HATs).
• Heterochromatin: Condensed, silent; H3K9me3 / H3K27me3.`
      },
      {
        title: "2. Replication, Transcription & Translation",
        content: `• Helicase: DnaB (prokaryote) | CMG complex (eukaryote).
• Elongation: Pol III core (prokaryote) | Pol ε (leading) & Pol δ (lagging, eukaryote).
• mRNA Processing: 5' 7-methylguanosine cap, 3' poly(A) tail (150-250 A residues), Spliceosome intron removal.`
      },
      {
        title: "3. Mutations & DNA Repair Pathways",
        content: `• Point Mutations: Silent, Missense (GAG → GTG), Nonsense (stop codon), Frameshift.
• Repair Pathways: MMR (MutS-MutL-MutH), BER (glycosylase → AP site), NER (UvrABC removes bulky lesions, defects → Xeroderma Pigmentosum).`
      },
      {
        title: "4. Bacterial Genetics & Operons",
        content: `• Transformation (naked DNA uptake), Transduction (phage-mediated), Conjugation (F-pilus contact).
• Lac Operon: Negative control via lacI repressor (inducer: allolactose). Positive control via CAP-cAMP complex.`
      }
    ],
    examTraps: [
      "DNA polymerase needs a primer and only extends 5' → 3'; it cannot start de novo.",
      "In lac operon, the true inducer is ALLOLACTOSE, not lactose itself.",
      "Transformation vs Transduction vs Conjugation: ONLY conjugation requires cell-to-cell contact (pilus)."
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
    notesCount: "3 notes",
    module: "Module 3 of 4",
    progress: 60,
    tagline: "Cell-line types, media chemistry, cryopreservation, anchorage & growth kinetics.",
    pdfTitle: "Topic 04 - Animal Cell Culture & Biomanufacturing.pdf",
    sections: [
      {
        title: "1. Cell-Line Types",
        content: `• Primary: Fresh tissue; normal diploid; finite lifespan (telomere shortening).
• Finite Line: Subcultured primary; 20-80 divisions then senescence (Hayflick limit).
• Continuous Line: Tumor / oncogene-immortalized (SV40 T-antigen, hTERT); infinite lifespan, aneuploid (CHO, HeLa, Vero). Doubling time: ~18-24 h.`
      },
      {
        title: "2. Media & Buffer Chemistry",
        content: `• Synthetic Media: DMEM, RPMI-1640, Ham's F12.
• Serum-free Media (SFM): Insulin/transferrin added; removes prion/virus risk.
• Fetal Bovine Serum (FBS): Supplies growth factors (insulin, PDGF, EGF), adhesion factors (fibronectin) & shear protection.
• Bicarbonate-CO2 Buffer: H2O + CO2 ⇌ H2CO3 ⇌ H+ + HCO3-. 5-10% CO2 maintains pH 7.2-7.4. Phenol red turns yellow as it acidifies.`
      },
      {
        title: "3. Cryopreservation & Anchorage Biology",
        content: `• Cryopreservation: Store at -196°C (LN2). Cool SLOW at -1°C/min with 10% DMSO; thaw FAST at 37°C.
• Anchorage-dependent: Must attach or die by anoikis. Scale up with microcarriers; harvest by trypsinization.
• Suspension: Grow free in stirred tanks (CHO, HeLa-S); add Pluronic F-68 for shear protection.`
      },
      {
        title: "4. Growth Kinetics",
        content: `• Growth equation: dX/dt = μX → Xt = X0 · e^(μt).
• Specific growth rate: μ = (ln Xt - ln X0) / t.
• Doubling time: td = 0.693 / μ.`
      }
    ],
    examTraps: [
      "Cool slow, thaw fast — the golden rule of cryopreservation (-1°C/min in, 37°C out).",
      "DMSO is protective when frozen but toxic at room temperature — dilute quickly after thawing.",
      "Phenol red is only a pH indicator, NOT a buffer; the actual buffering is bicarbonate/CO2."
    ],
    pyqs: [
      {
        question: "What is the primary role of 10% DMSO in cell cryopreservation?",
        options: ["Nutrient source", "Cryoprotectant preventing intracellular ice crystal formation", "Antibiotic", "pH buffer"],
        correct: 1,
        explanation: "DMSO penetrates cell membranes and prevents intracellular ice crystal formation during freezing."
      },
      {
        question: "Anoikis refers to programmed cell death triggered by:",
        options: ["High CO2 levels", "Loss of cell attachment to extracellular matrix", "Trypsin toxicity", "Thermal shock"],
        correct: 1,
        explanation: "Anoikis is apoptosis induced when anchorage-dependent cells detach from the extracellular matrix."
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
        question: "In a chemostat operated at steady state, the specific growth rate (μ) of the microorganism is equal to:",
        options: ["Maximum growth rate (μmax)", "Dilution rate (D)", "Volumetric productivity", "Zero"],
        correct: 1,
        explanation: "At steady state in a chemostat, cell growth balances cell washout, so μ = D."
      },
      {
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
    title: "Molecular Biology & Genetics PYQs",
    subject: "Genetics & Molecular Biology (GAT-B 2020-2024)",
    color: "#8B5CF6",
    bg: "#F3F0FF",
    xp: 150,
    timeLimit: 900,
    questions: COURSE_TOPICS[1].pyqs.concat(COURSE_TOPICS[2].pyqs).concat(COURSE_TOPICS[3].pyqs)
  }
};

/* ── Continuous Scroll PDF Document Viewer Component ── */
function ContinuousPdfViewer({ topic }) {
  function handleOpenNewWindow() {
    const newWin = window.open("", "_blank");
    if (!newWin) return;
    
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
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .card { background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .card-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
    .card-body { white-space: pre-line; font-size: 13.5px; color: #334155; line-height: 1.6; }
    .trap { background: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 12px; padding: 20px; color: #7f1d1d; margin-bottom: 20px; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <h3 style="margin:0; font-size: 16px;">📄 ${topic.pdfTitle}</h3>
      <p style="margin:2px 0 0; font-size: 12px; color: #94a3b8;">B.Tech Biotechnology · Complete GATE Study Document</p>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <!-- Page 1 -->
  <div class="page">
    <div class="header">
      <div>
        <div class="badge">B.TECH BIOTECHNOLOGY · GATE STUDY NOTES</div>
        <h2 class="title">${topic.name}</h2>
      </div>
      <span style="font-size: 12px; font-weight: 700; color: #64748b;">PAGE 1 OF 4</span>
    </div>
    <h3 style="font-size: 15px; font-weight: 700; color: ${topic.color}; margin-bottom: 12px;">1. Key Concepts & Core Principles</h3>
    <p style="font-style: italic; color: #475569; margin-bottom: 16px;">"${topic.tagline}"</p>
    <div class="grid">
      <div class="card">
        <div class="card-title">${topic.sections[0]?.title || ""}</div>
        <div class="card-body">${topic.sections[0]?.content || ""}</div>
      </div>
      <div class="card">
        <div class="card-title">${topic.sections[1]?.title || ""}</div>
        <div class="card-body">${topic.sections[1]?.content || ""}</div>
      </div>
    </div>
    <div class="footer"><span>BioConnect Ecosystem</span><span>Page 1</span></div>
  </div>

  <!-- Page 2 -->
  <div class="page">
    <div class="header">
      <div>
        <div class="badge">B.TECH BIOTECHNOLOGY · GATE STUDY NOTES</div>
        <h2 class="title">${topic.name}</h2>
      </div>
      <span style="font-size: 12px; font-weight: 700; color: #64748b;">PAGE 2 OF 4</span>
    </div>
    <h3 style="font-size: 15px; font-weight: 700; color: ${topic.color}; margin-bottom: 12px;">2. Equations, Kinetics & Balances</h3>
    <div class="card" style="margin-bottom: 16px;">
      <div class="card-title">${topic.sections[2]?.title || ""}</div>
      <div class="card-body">${topic.sections[2]?.content || ""}</div>
    </div>
    <div class="card" style="margin-bottom: 16px;">
      <div class="card-title">${topic.sections[3]?.title || ""}</div>
      <div class="card-body">${topic.sections[3]?.content || ""}</div>
    </div>
    <div class="footer"><span>BioConnect Ecosystem</span><span>Page 2</span></div>
  </div>

  <!-- Page 3 -->
  <div class="page">
    <div class="header">
      <div>
        <div class="badge">B.TECH BIOTECHNOLOGY · GATE STUDY NOTES</div>
        <h2 class="title">${topic.name}</h2>
      </div>
      <span style="font-size: 12px; font-weight: 700; color: #64748b;">PAGE 3 OF 4</span>
    </div>
    <h3 style="font-size: 15px; font-weight: 700; color: #dc2626; margin-bottom: 12px;">3. Common Exam Traps & High-Yield Rules</h3>
    <div class="trap">
      <h4 style="font-size: 14px; font-weight: 700; color: #991b1b; margin: 0 0 10px;">⚠️ CRITICAL EXAM TRAPS</h4>
      <ul style="padding-left: 20px; margin: 0;">
        ${topic.examTraps.map(trap => `<li style="margin-bottom: 8px;">${trap}</li>`).join("")}
      </ul>
    </div>
    <div class="footer"><span>BioConnect Ecosystem</span><span>Page 3</span></div>
  </div>

  <!-- Page 4 -->
  <div class="page">
    <div class="header">
      <div>
        <div class="badge">B.TECH BIOTECHNOLOGY · GATE STUDY NOTES</div>
        <h2 class="title">${topic.name}</h2>
      </div>
      <span style="font-size: 12px; font-weight: 700; color: #64748b;">PAGE 4 OF 4</span>
    </div>
    <h3 style="font-size: 15px; font-weight: 700; color: ${topic.color}; margin-bottom: 12px;">4. Authentic GAT-B Past Year Questions (${topic.pyqs.length} MCQs)</h3>
    <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 20px; color: #14532d;">
      <h4 style="font-size: 14px; font-weight: 700; color: #166534; margin: 0 0 10px;">📝 TOPIC PYQ SUMMARY</h4>
      <p style="margin:0; font-size: 13.5px;">This topic includes ${topic.pyqs.length} authentic GAT-B questions covering past papers from 2020 to 2024 with complete solution keys.</p>
    </div>
    <div class="footer"><span>BioConnect Ecosystem</span><span>Page 4 · End of PDF Document</span></div>
  </div>
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
        paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>📄</span>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "#fff" }}>{topic.pdfTitle}</h3>
            <p style={{ fontSize: "12px", color: "#94A3B8", margin: "2px 0 0" }}>Continuous Straight Scroll View • Complete 4-Page GATE & B.Tech Biotech Study PDF</p>
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
          title="Click to open full PDF document in a new browser tab/window"
        >
          <span>↗️</span>
          <span>Open PDF in New Window</span>
        </button>
      </div>

      {/* CONTINUOUS STRAIGHT SCROLL CONTAINER FOR ALL PAGES (Also Clickable) */}
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
        title="Click anywhere on the PDF viewer to open full document in new window"
      >
        {/* Page 1 */}
        <div style={{
          background: "#ffffff", color: "#1e293b", borderRadius: "12px", padding: "36px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          <div style={{ borderBottom: "2px solid " + topic.color, paddingBottom: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: topic.color, letterSpacing: "1px" }}>B.TECH BIOTECHNOLOGY · GATE STUDY NOTES</span>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>{topic.name}</h2>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" }}>PAGE 1 OF 4 ↗️</span>
          </div>

          <h3 style={{ fontSize: "15px", fontWeight: 700, color: topic.color, marginBottom: "12px" }}>1. Key Concepts & Core Principles</h3>
          <p style={{ fontStyle: "italic", color: "#475569", marginBottom: "16px" }}>"{topic.tagline}"</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            {topic.sections.slice(0, 2).map((sec, idx) => (
              <div key={idx} style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>{sec.title}</h4>
                <div style={{ whiteSpace: "pre-line", fontSize: "13px", color: "#334155" }}>{sec.content}</div>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
            <span>BioConnect Platform · Click to open in new tab</span>
            <span>Page 1</span>
          </div>
        </div>

        {/* Page 2 */}
        <div style={{
          background: "#ffffff", color: "#1e293b", borderRadius: "12px", padding: "36px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          <div style={{ borderBottom: "2px solid " + topic.color, paddingBottom: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: topic.color, letterSpacing: "1px" }}>B.TECH BIOTECHNOLOGY · GATE STUDY NOTES</span>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>{topic.name}</h2>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" }}>PAGE 2 OF 4 ↗️</span>
          </div>

          <h3 style={{ fontSize: "15px", fontWeight: 700, color: topic.color, marginBottom: "12px" }}>2. Equations, Kinetics & Balances</h3>
          {topic.sections.slice(2, 4).map((sec, idx) => (
            <div key={idx} style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>{sec.title}</h4>
              <div style={{ whiteSpace: "pre-line", fontSize: "13.5px", color: "#334155" }}>{sec.content}</div>
            </div>
          ))}
          <div style={{ paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
            <span>BioConnect Platform · Click to open in new tab</span>
            <span>Page 2</span>
          </div>
        </div>

        {/* Page 3 */}
        <div style={{
          background: "#ffffff", color: "#1e293b", borderRadius: "12px", padding: "36px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          <div style={{ borderBottom: "2px solid " + topic.color, paddingBottom: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: topic.color, letterSpacing: "1px" }}>B.TECH BIOTECHNOLOGY · GATE STUDY NOTES</span>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>{topic.name}</h2>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" }}>PAGE 3 OF 4 ↗️</span>
          </div>

          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#dc2626", marginBottom: "12px" }}>3. Common Exam Traps & High-Yield Rules</h3>
          <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#991b1b", margin: "0 0 10px" }}>⚠️ CRITICAL EXAM TRAPS</h4>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              {topic.examTraps.map((trap, idx) => (
                <li key={idx} style={{ marginBottom: "8px", color: "#7f1d1d", fontSize: "13.5px" }}>{trap}</li>
              ))}
            </ul>
          </div>
          <div style={{ paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
            <span>BioConnect Platform · Click to open in new tab</span>
            <span>Page 3</span>
          </div>
        </div>

        {/* Page 4 */}
        <div style={{
          background: "#ffffff", color: "#1e293b", borderRadius: "12px", padding: "36px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          <div style={{ borderBottom: "2px solid " + topic.color, paddingBottom: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: topic.color, letterSpacing: "1px" }}>B.TECH BIOTECHNOLOGY · GATE STUDY NOTES</span>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>{topic.name}</h2>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" }}>PAGE 4 OF 4 ↗️</span>
          </div>

          <h3 style={{ fontSize: "15px", fontWeight: 700, color: topic.color, marginBottom: "12px" }}>4. Authentic GAT-B Past Year Questions Overview</h3>
          <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: "12px", padding: "20px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#166534", margin: "0 0 10px" }}>📝 TOPIC PYQ SUMMARY ({topic.pyqs.length} MCQs)</h4>
            <p style={{ fontSize: "13.5px", color: "#14532d" }}>
              This topic includes <strong>{topic.pyqs.length} authentic GAT-B questions</strong> with complete answer keys and detailed explanations. Switch to the <strong>"Topic PYQ MCQs ({topic.pyqs.length})"</strong> tab above to practice!
            </p>
          </div>
          <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
            <span>BioConnect Platform · Click to open in new tab</span>
            <span>Page 4 · End of PDF Document</span>
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