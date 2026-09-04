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

const HIGH_RES_IMAGES = [
  "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=900&q=80",
  "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=900&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80",
  "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&q=80"
];

function getHighResImage(title = "", dateObj = new Date()) {
  const lower = (title || "").toLowerCase();

  if (lower.includes("biofuel") || lower.includes("algae") || lower.includes("plant") || lower.includes("agriculture") || lower.includes("crop") || lower.includes("environment")) {
    return HIGH_RES_IMAGES[4];
  }
  if (lower.includes("crispr") || lower.includes("gene") || lower.includes("dna") || lower.includes("genome") || lower.includes("editing") || lower.includes("mutation")) {
    return HIGH_RES_IMAGES[0];
  }
  if (lower.includes("ai") || lower.includes("model") || lower.includes("computational") || lower.includes("algorithm") || lower.includes("predict")) {
    return HIGH_RES_IMAGES[1];
  }
  if (lower.includes("cancer") || lower.includes("drug") || lower.includes("therapy") || lower.includes("cell") || lower.includes("virus") || lower.includes("immune")) {
    return HIGH_RES_IMAGES[2];
  }
  if (lower.includes("microb") || lower.includes("bacteri") || lower.includes("culture") || lower.includes("enzyme") || lower.includes("petri")) {
    return HIGH_RES_IMAGES[3];
  }

  const charCodeSum = (title || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(charCodeSum) % HIGH_RES_IMAGES.length;
  return HIGH_RES_IMAGES[index];
}

function generateDetailedSummary(title, cleanText) {
  const cleanTitle = decodeEntities(title);
  const cleanDesc = decodeEntities(cleanText);

  const sentences = cleanDesc
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && !s.toLowerCase().includes("read more"));

  const sentence1 = sentences[0] || "Researchers have unveiled a novel biological mechanism with far-reaching implications for life sciences.";
  const sentence2 = sentences[1] || "The experimental findings demonstrate targeted cellular pathways and enhanced accuracy in bio-engineered models.";
  const sentence3 = sentences[2] || "This discovery opens new avenues for therapeutic development, synthetic biology, and sustainable biotechnology applications.";

  return [
    { text: `The Breakthrough: ${cleanTitle}.` },
    { text: `Key Scientific Finding: ${sentence1}` },
    { text: `Future & Clinical Impact: ${sentence3 || sentence2}` }
  ];
}

function generateQuiz(title, cleanText) {
  const cleanTitle = decodeEntities(title);
  const combined = (cleanTitle + " " + cleanText).toLowerCase();

  if (combined.includes("spirulina") || combined.includes("b12") || combined.includes("vitamin") || combined.includes("nutrition")) {
    return {
      question: "What microalgae strain was engineered to yield active Vitamin B12?",
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

  // Calculate day-based integer seed for automatic daily rotation at 00:00 midnight
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
        const pubDateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/s);
        const descMatch = block.match(/<description>(.*?)<\/description>/s);
        const contentMatch = block.match(/<content:encoded>(.*?)<\/content:encoded>/s);

        const rawTitle = titleMatch ? titleMatch[1] : "";
        const link = linkMatch ? linkMatch[1] : "";
        const pubDateRaw = pubDateMatch ? pubDateMatch[1] : "";
        const descRaw = descMatch ? descMatch[1] : "";
        const contentRaw = contentMatch ? contentMatch[1] : descRaw;

        const title = decodeEntities(rawTitle);
        const cleanDesc = decodeEntities(descRaw || contentRaw);

        if (!title || title.length < 15 || isCommercialOrAd(title, cleanDesc)) continue;

        const parsedDate = pubDateRaw ? new Date(pubDateRaw) : now;
        const dateStr = parsedDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const shortDateStr = parsedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }).toUpperCase();

        const image = getHighResImage(title, parsedDate);
        const summary = generateDetailedSummary(title, cleanDesc);
        const quiz = generateQuiz(title, cleanDesc);
        const body = cleanDesc.length > 500 ? cleanDesc.substring(0, 500) + "..." : cleanDesc;

        parsedArticles.push({
          id: i,
          title,
          link,
          sourceName: source.name.split(" ")[0],
          fullSourceName: source.name,
          date: dateStr,
          readTime: "2 min read",
          category: source.name.toUpperCase(),
          categoryDate: shortDateStr,
          impact: "🔴 High Impact Discovery",
          summary,
          body,
          image,
          quiz
        });
      }

      if (parsedArticles.length > 0) {
        // Automatic Midnight Rotation: Index shifts deterministically every single calendar day
        const todayIndex = daySeed % parsedArticles.length;
        const todayArticle = parsedArticles[todayIndex];

        const missedArticles = parsedArticles
          .filter((_, idx) => idx !== todayIndex)
          .slice(0, 5)
          .map((art) => ({
            id: art.id,
            date: art.categoryDate,
            title: art.title,
            img: art.image,
            link: art.link,
            fullArticle: art
          }));

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
            const pubDate = item.pubdate || now.toISOString();
            const dateObj = new Date(pubDate);

            const dateStr = dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            });
            const shortDateStr = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            }).toUpperCase();

            const image = getHighResImage(title, dateObj);
            const summary = generateDetailedSummary(title, item.source || "");
            const quiz = generateQuiz(title, item.source || "");

            pubmedArticles.push({
              id: idx + 1,
              title,
              link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
              sourceName: "PubMed",
              fullSourceName: "NCBI PubMed Journal",
              date: dateStr,
              readTime: "2 min read",
              category: "NCBI PUBMED RESEARCH",
              categoryDate: shortDateStr,
              impact: "🔴 High Impact NCBI Study",
              summary,
              body: `Published in ${item.source || "PubMed Scientific Journal"}. ${title}`,
              image,
              quiz
            });
          });

          if (pubmedArticles.length > 0) {
            const todayIndex = daySeed % pubmedArticles.length;
            const todayArticle = pubmedArticles[todayIndex];

            const missedArticles = pubmedArticles
              .filter((_, idx) => idx !== todayIndex)
              .slice(0, 5)
              .map((art) => ({
                id: art.id,
                date: art.categoryDate,
                title: art.title,
                img: art.image,
                link: art.link,
                fullArticle: art
              }));

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
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const shortDateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  }).toUpperCase();

  const CURATED_TOPICS = [
    {
      title: "AI-Powered Protein Folding Models Accelerate Enzyme Engineering for Biodegradable Plastics",
      category: "SYNTHETIC BIOLOGY",
      summary: [
        { text: "The Breakthrough: AI-Powered Protein Folding Models Accelerate Enzyme Engineering for Biodegradable Plastics." },
        { text: "Key Scientific Finding: Researchers engineered a PET-degrading hydrolase variant that breaks down post-consumer plastics in under 48 hours at room temperature." },
        { text: "Future & Clinical Impact: Paves the way for circular biomanufacturing and industrial-scale plastic waste bio-recycling." }
      ],
      body: "Researchers have achieved a major breakthrough by combining generative AI protein design with high-throughput laboratory screening. The newly engineered enzyme displays 10x higher catalytic efficiency against synthetic polymers.",
      image: HIGH_RES_IMAGES[1],
      quiz: {
        question: "What material does the AI-engineered enzyme target for rapid degradation?",
        options: ["Post-Consumer Synthetic Plastics (PET)", "Cellulosic Timber", "Silicate Glass"],
        answer: 0,
        xp: "+20 XP"
      }
    },
    {
      title: "CRISPR-Cas13 RNA Editing Neutralizes Pathogenic Viruses Without Genomic DNA Alteration",
      category: "GENE EDITING",
      summary: [
        { text: "The Breakthrough: CRISPR-Cas13 RNA Editing Neutralizes Pathogenic Viruses Without Genomic DNA Alteration." },
        { text: "Key Scientific Finding: Uses transient RNA-guided Cas13 nucleases to selectively degrade viral transcripts inside infected cells." },
        { text: "Future & Clinical Impact: Offers a versatile antiviral platform that operates without causing permanent host genome modifications." }
      ],
      body: "Unlike traditional CRISPR-Cas9 systems that modify double-stranded DNA, Cas13 acts exclusively on single-stranded RNA transcripts, opening a novel therapeutic window for acute viral interventions.",
      image: HIGH_RES_IMAGES[0],
      quiz: {
        question: "Why is CRISPR-Cas13 considered safer for transient antiviral therapeutics?",
        options: ["It degrades viral RNA without altering host DNA", "It replaces cellular mitochondria", "It functions only in plants"],
        answer: 0,
        xp: "+20 XP"
      }
    },
    {
      title: "Microalgae Bio-Refineries Achieve Record Lipid Yields for Carbon-Neutral Jet Fuels",
      category: "GREEN BIOTECH",
      summary: [
        { text: "The Breakthrough: Microalgae Bio-Refineries Achieve Record Lipid Yields for Carbon-Neutral Jet Fuels." },
        { text: "Key Scientific Finding: Metabolic pathway engineering in Chlorella microalgae doubled intracellular triacylglycerol accumulation." },
        { text: "Future & Clinical Impact: Provides a scalable drop-in replacement for conventional aviation fuels, reducing greenhouse gas emissions." }
      ],
      body: "Bio-engineers have developed continuous-flow photobioreactors that maximize photosynthetic efficiency, transforming atmospheric CO2 into bio-oil at commercial scale.",
      image: HIGH_RES_IMAGES[4],
      quiz: {
        question: "What organism strain was engineered for sustainable bio-jet fuel production?",
        options: ["Microalgae (Chlorella pyrenoidosa)", "Baker's Yeast", "E. coli"],
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
      date: dateStr,
      readTime: "2 min read",
      category: topic.category,
      categoryDate: shortDateStr,
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
