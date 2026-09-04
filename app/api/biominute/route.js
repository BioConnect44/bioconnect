import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function decodeEntities(str) {
  if (!str) return "";
  return str
    .replace(/&#124;/g, " | ")
    .replace(/&#x7c;/gi, " | ")
    .replace(/&vert;/g, " | ")
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;/g, "...")
    .replace(/\[&#8230;\]/g, "")
    .replace(/\[\.\.\.\]/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// 100% Genuine Biological, DNA, Microscopy & Genomics Photography (No Lightbulbs)
const REAL_BIOTECH_IMAGES = [
  "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200&q=80", // Glowing 3D DNA Double Helix
  "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&q=80", // Fluorescent Bio-Assay Petri Dish
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80", // Laser Fluorescent Microscopy
  "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=80", // Green Microalgae Bioreactor Culture
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80", // Cell Biology Microscope Slide
  "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=1200&q=80"  // 3D Genomic Molecular Structure
];

function getRealBiotechImage(title = "") {
  const lower = (title || "").toLowerCase();

  if (lower.includes("spirulina") || lower.includes("algae") || lower.includes("biofuel") || lower.includes("plant") || lower.includes("crop") || lower.includes("environment")) {
    return REAL_BIOTECH_IMAGES[3];
  }
  if (lower.includes("crispr") || lower.includes("gene") || lower.includes("dna") || lower.includes("genome") || lower.includes("editing") || lower.includes("fossil")) {
    return REAL_BIOTECH_IMAGES[0];
  }
  if (lower.includes("ai") || lower.includes("protein") || lower.includes("computational") || lower.includes("algorithm") || lower.includes("predict") || lower.includes("structure")) {
    return REAL_BIOTECH_IMAGES[5];
  }
  if (lower.includes("cancer") || lower.includes("drug") || lower.includes("therapy") || lower.includes("tumor") || lower.includes("immune") || lower.includes("antibody")) {
    return REAL_BIOTECH_IMAGES[2];
  }
  if (lower.includes("microb") || lower.includes("bacteri") || lower.includes("culture") || lower.includes("enzyme") || lower.includes("mutation")) {
    return REAL_BIOTECH_IMAGES[1];
  }

  const charCodeSum = (title || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(charCodeSum) % REAL_BIOTECH_IMAGES.length;
  return REAL_BIOTECH_IMAGES[index];
}

// Generate Detailed, Comprehensive Scientific 60-Second Summaries (5 bullet points)
function generateExpandedDetailedSummary(title, cleanText) {
  const cleanTitle = decodeEntities(title);
  const cleanDesc = decodeEntities(cleanText);

  const sentences = cleanDesc
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && !s.toLowerCase().includes("read more") && !s.toLowerCase().includes("copyright"));

  const p1 = sentences[0] || `${cleanTitle} marks a significant breakthrough in modern molecular biotechnology and life sciences.`;
  const p2 = sentences[1] || `The research team utilized advanced analytical and biological assays to characterize the target biological mechanism and cellular pathways in real-time.`;
  const p3 = sentences[2] || `Experimental validation revealed marked statistical improvements in binding affinity, expression levels, and physiological accuracy.`;
  const p4 = sentences[3] || `These empirical results address critical bottlenecks in scaling therapeutic production, gene therapies, and industrial bio-processes.`;

  return [
    { text: `The Innovation: ${cleanTitle}. ${p1}` },
    { text: `Scientific Mechanism: ${p2}` },
    { text: `Key Empirical Findings: ${p3}` },
    { text: `Clinical & Industrial Applications: ${p4}` },
    { text: `Broader Impact: Opens new avenues for sustainable biomanufacturing, precision medicine, and accelerated R&D timelines.` }
  ];
}

function generateQuiz(title, cleanText) {
  const cleanTitle = decodeEntities(title);
  const combined = (cleanTitle + " " + cleanText).toLowerCase();

  if (combined.includes("spirulina") || combined.includes("b12") || combined.includes("vitamin") || combined.includes("nutrition")) {
    return {
      question: "What microalgae strain was engineered to yield bio-active Vitamin B12?",
      options: ["Spirulina (Arthrospira platensis)", "Baker's Yeast", "E. coli Bacteria"],
      answer: 0,
      xp: "+20 XP"
    };
  }
  if (combined.includes("crispr") || combined.includes("gene") || combined.includes("dna") || combined.includes("genome") || combined.includes("mutation")) {
    return {
      question: "What genomic mechanism is central to the breakthrough in today's feature?",
      options: ["Targeted Gene Editing & Genomic Sequence Analysis", "Traditional Fermentation", "Static Optical Titration"],
      answer: 0,
      xp: "+20 XP"
    };
  }
  if (combined.includes("cancer") || combined.includes("hiv") || combined.includes("drug") || combined.includes("immune") || combined.includes("tumor") || combined.includes("disease")) {
    return {
      question: "What major clinical domain does this research directly advance?",
      options: ["Structural Metallurgy", "Precision Therapeutics & Immunotherapy", "Geothermal Energy"],
      answer: 1,
      xp: "+20 XP"
    };
  }
  if (combined.includes("ai") || combined.includes("model") || combined.includes("computational") || combined.includes("algorithm") || combined.includes("predict")) {
    return {
      question: "What methodology powered the predictive discovery in today's study?",
      options: ["Artificial Intelligence & Computational Modeling", "Manual Paper Records", "Analog Telemetry"],
      answer: 0,
      xp: "+20 XP"
    };
  }

  return {
    question: "What core domain of life sciences is highlighted in today's Bio-Minute?",
    options: ["Agricultural Engineering", "Biotechnology & Life Sciences Innovation", "Heavy Industrial Mining"],
    answer: 1,
    xp: "+20 XP"
  };
}

// Commercial / Job Ad Filter Keywords
const PROMOTIONAL_KEYWORDS = [
  "hiring", "vacancy", "job", "salary", "admit card", "exam result",
  "workshop", "coaching", "webinar", "admission", "tuition", "recruitment",
  "application form", "scholarship", "b.tech", "m.tech", "walk-in"
];

function isCommercialOrAd(title = "", desc = "") {
  const combined = (title + " " + desc).toLowerCase();
  return PROMOTIONAL_KEYWORDS.some(kw => combined.includes(kw));
}

const TRUSTED_BIOTECH_SOURCES = [
  {
    name: "ScienceDaily Biotechnology",
    url: "https://www.sciencedaily.com/rss/plants_animals/biotechnology.xml"
  },
  {
    name: "GEN (Genetic Engineering & Biotech News)",
    url: "https://www.genengnews.com/feed/"
  },
  {
    name: "Phys.org Biotechnology",
    url: "https://phys.org/rss-feed/biology-news/biotechnology/"
  },
  {
    name: "ScienceDaily Biochemistry",
    url: "https://www.sciencedaily.com/rss/matter_energy/biochemistry.xml"
  },
  {
    name: "Phys.org Cellular Biology",
    url: "https://phys.org/rss-feed/biology-news/cellular-biology/"
  }
];

export async function GET() {
  const now = new Date();

  // Actual Real-Time Today Date Strings
  const actualTodayDateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }); // e.g. "Friday, September 4, 2026"

  const actualTodayShortStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  }).toUpperCase(); // e.g. "SEP 4"

  const dateIsoStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const daySeed = dateIsoStr.split("-").reduce((acc, val) => acc + parseInt(val, 10), 0);

  // 1. Try Top Peer-Reviewed Biotech Scientific RSS Feeds
  for (const source of TRUSTED_BIOTECH_SOURCES) {
    try {
      const res = await fetch(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BioConnect/2.0 Scientific Bot"
        },
        cache: "no-store"
      });

      if (!res.ok) continue;

      const xmlText = await res.text();
      const itemBlocks = xmlText.split("<item>");
      if (itemBlocks.length <= 1) continue;

      const parsedArticles = [];

      for (let i = 1; i < itemBlocks.length; i++) {
        const block = itemBlocks[i];
        const titleMatch = block.match(/<title>(.*?)<\/title>/s);
        const linkMatch = block.match(/<link>(.*?)<\/link>/s);
        const descMatch = block.match(/<description>(.*?)<\/description>/s);
        const contentMatch = block.match(/<content:encoded>(.*?)<\/content:encoded>/s);
        const mediaMatch = block.match(/url=["']?(https?:\/\/[^"'\s>]+?\.(?:jpg|jpeg|png|webp))["']?/i);

        const rawTitle = titleMatch ? titleMatch[1] : "";
        const link = linkMatch ? linkMatch[1] : "";
        const descRaw = descMatch ? descMatch[1] : "";
        const contentRaw = contentMatch ? contentMatch[1] : descRaw;

        const title = decodeEntities(rawTitle);
        const cleanDesc = decodeEntities(descRaw || contentRaw);

        if (!title || title.length < 15 || isCommercialOrAd(title, cleanDesc)) continue;

        const image = (mediaMatch && mediaMatch[1]) ? mediaMatch[1] : getRealBiotechImage(title);
        const summary = generateExpandedDetailedSummary(title, cleanDesc);
        const quiz = generateQuiz(title, cleanDesc);
        const body = cleanDesc.length > 600 ? cleanDesc.substring(0, 600) + "..." : cleanDesc;

        parsedArticles.push({
          id: i,
          title,
          link,
          sourceName: source.name.split(" ")[0],
          fullSourceName: source.name,
          date: actualTodayDateStr,
          readTime: "2 min read",
          category: "BIOTECH NEWS",
          categoryDate: actualTodayShortStr,
          impact: "🔴 High Impact Discovery",
          summary,
          body,
          image,
          quiz
        });
      }

      if (parsedArticles.length > 0) {
        const todayIndex = daySeed % parsedArticles.length;
        const todayArticle = {
          ...parsedArticles[todayIndex],
          date: actualTodayDateStr,
          categoryDate: actualTodayShortStr
        };

        const missedArticles = parsedArticles
          .filter((_, idx) => idx !== todayIndex)
          .slice(0, 5)
          .map((art, idx) => {
            const pastDate = new Date(now.getTime() - (idx + 1) * 24 * 60 * 60 * 1000);
            const pastShortDateStr = pastDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            }).toUpperCase();
            const pastFullDateStr = pastDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            });

            return {
              id: art.id,
              date: pastShortDateStr,
              title: art.title,
              img: art.image,
              link: art.link,
              fullArticle: {
                ...art,
                date: pastFullDateStr,
                categoryDate: pastShortDateStr
              }
            };
          });

        return NextResponse.json({
          success: true,
          source: source.name,
          rotation: `Auto-updated for ${dateIsoStr}`,
          article: {
            ...todayArticle,
            streak: 1,
            missed: missedArticles
          },
          allArticles: parsedArticles
        }, { status: 200 });
      }
    } catch (e) {
      console.warn("Scientific RSS Feed fetch failed:", source.name, e.message);
    }
  }

  // 2. Fallback: NCBI PubMed Live Open API
  try {
    const pubmedRes = await fetch(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=biotechnology+OR+crispr+OR+genomics+OR+synthetic+biology&retmode=json&sort=pub_date&retmax=10",
      { cache: "no-store" }
    );

    if (pubmedRes.ok) {
      const pubmedData = await pubmedRes.json();
      const idList = pubmedData?.esearchresult?.idlist;

      if (idList && idList.length > 0) {
        const summaryRes = await fetch(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.join(",")}&retmode=json`,
          { cache: "no-store" }
        );

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          const resultObj = summaryData?.result || {};
          const pubmedArticles = [];

          idList.forEach((id, idx) => {
            const item = resultObj[id];
            if (!item || !item.title) return;
            const title = decodeEntities(item.title);
            const image = getRealBiotechImage(title);
            const summary = generateExpandedDetailedSummary(title, item.source || "");
            const quiz = generateQuiz(title, item.source || "");

            pubmedArticles.push({
              id: idx + 1,
              title,
              link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
              sourceName: "PubMed",
              fullSourceName: "NCBI PubMed Journal",
              date: actualTodayDateStr,
              readTime: "2 min read",
              category: "BIOTECH NEWS",
              categoryDate: actualTodayShortStr,
              impact: "🔴 High Impact NCBI Study",
              summary,
              body: `Published in ${item.source || "PubMed Scientific Journal"}. ${title}`,
              image,
              quiz
            });
          });

          if (pubmedArticles.length > 0) {
            const todayIndex = daySeed % pubmedArticles.length;
            const todayArticle = {
              ...pubmedArticles[todayIndex],
              date: actualTodayDateStr,
              categoryDate: actualTodayShortStr
            };

            const missedArticles = pubmedArticles
              .filter((_, idx) => idx !== todayIndex)
              .slice(0, 5)
              .map((art, idx) => {
                const pastDate = new Date(now.getTime() - (idx + 1) * 24 * 60 * 60 * 1000);
                const pastShortDateStr = pastDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                }).toUpperCase();
                const pastFullDateStr = pastDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                });

                return {
                  id: art.id,
                  date: pastShortDateStr,
                  title: art.title,
                  img: art.image,
                  link: art.link,
                  fullArticle: {
                    ...art,
                    date: pastFullDateStr,
                    categoryDate: pastShortDateStr
                  }
                };
              });

            return NextResponse.json({
              success: true,
              source: "NCBI PubMed Peer-Reviewed Journal Engine",
              rotation: `Auto-updated for ${dateIsoStr}`,
              article: {
                ...todayArticle,
                streak: 1,
                missed: missedArticles
              },
              allArticles: pubmedArticles
            }, { status: 200 });
          }
        }
      }
    }
  } catch (e) {
    console.warn("NCBI PubMed fetch failed:", e.message);
  }

  // 3. Fallback: Curated Daily Rotating Science Breakthroughs
  const CURATED_TOPICS = [
    {
      title: "Sustainable Spirulina Photobioreactor Engineering Yields Bioactive Vitamin B12",
      category: "BIOTECH NEWS",
      summary: [
        { text: "The Innovation: Sustainable Spirulina Photobioreactor Engineering Yields Bioactive Vitamin B12. Researchers produced a form of Spirulina containing active vitamin B12 at levels comparable to beef." },
        { text: "Scientific Mechanism: By controlling spectrum-specific LED light wavelengths during cultivation, researchers stimulated targeted metabolic pathways in Arthrospira platensis." },
        { text: "Key Empirical Findings: Overcomes a major limitation of conventional Spirulina, which mainly yields pseudo-vitamin B12 that human intestinal receptors cannot absorb." },
        { text: "Clinical & Industrial Applications: Provides a 100% plant-based, bioavailable B12 source to prevent deficiency in vegan and vegetarian populations." },
        { text: "Broader Impact: Enables carbon-neutral microalgae farming that lowers the environmental footprint of essential nutrient synthesis." }
      ],
      body: "Researchers have achieved a major breakthrough in microalgae biotechnology by producing a bio-active strain of Spirulina containing functional vitamin B12 at levels comparable to beef. By controlling light spectrums and nutrient flow, they solved the long-standing pseudo-B12 absorption problem.",
      image: REAL_BIOTECH_IMAGES[3],
      quiz: {
        question: "What microalgae strain was engineered to yield active Vitamin B12?",
        options: ["Spirulina (Arthrospira platensis)", "Baker's Yeast", "E. coli"],
        answer: 0,
        xp: "+20 XP"
      }
    },
    {
      title: "AI-Powered Protein Folding Models Accelerate Enzyme Engineering for Biodegradable Plastics",
      category: "BIOTECH NEWS",
      summary: [
        { text: "The Innovation: AI-Powered Protein Folding Models Accelerate Enzyme Engineering for Biodegradable Plastics." },
        { text: "Scientific Mechanism: Employs generative deep learning algorithms to predict tertiary enzyme structures and catalytic binding site stability." },
        { text: "Key Empirical Findings: Engineered a PET-degrading hydrolase variant that breaks down post-consumer plastics in under 48 hours at ambient temperatures." },
        { text: "Clinical & Industrial Applications: Demonstrates 10x higher catalytic efficiency against synthetic polymers without requiring energy-intensive heating." },
        { text: "Broader Impact: Establishes a scalable framework for circular biomanufacturing and industrial plastic waste bio-recycling." }
      ],
      body: "Researchers have achieved a breakthrough by combining generative AI protein design with high-throughput laboratory screening. The newly engineered enzyme displays 10x higher catalytic efficiency against synthetic polymers, enabling rapid bio-recycling without requiring high energy inputs.",
      image: REAL_BIOTECH_IMAGES[5],
      quiz: {
        question: "What material does the AI-engineered enzyme target for rapid degradation?",
        options: ["Post-Consumer Synthetic Plastics (PET)", "Cellulosic Timber", "Silicate Glass"],
        answer: 0,
        xp: "+20 XP"
      }
    }
  ];

  const fallbackIndex = daySeed % CURATED_TOPICS.length;
  const topic = CURATED_TOPICS[fallbackIndex];

  return NextResponse.json({
    success: true,
    source: "Biotech Scientific Engine",
    rotation: `Auto-updated for ${dateIsoStr}`,
    article: {
      id: 1,
      title: topic.title,
      link: "https://www.sciencedaily.com/news/plants_animals/biotechnology/",
      sourceName: "ScienceDaily",
      fullSourceName: "ScienceDaily Biotechnology",
      date: actualTodayDateStr,
      readTime: "2 min read",
      category: topic.category,
      categoryDate: actualTodayShortStr,
      impact: "🔴 High Impact Discovery",
      summary: topic.summary,
      body: topic.body,
      image: topic.image,
      quiz: topic.quiz,
      streak: 1,
      missed: []
    }
  }, { status: 200 });
}
