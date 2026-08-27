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

function getHighResImage(title = "", description = "", content = "", dateObj = new Date()) {
  const combinedStr = (title || "").toLowerCase();

  if (combinedStr.includes("biofuel") || combinedStr.includes("algae") || combinedStr.includes("energy") || combinedStr.includes("plant") || combinedStr.includes("forest") || combinedStr.includes("environment")) {
    return "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=900&q=80";
  }
  if (combinedStr.includes("crispr") || combinedStr.includes("gene") || combinedStr.includes("dna") || combinedStr.includes("genome") || combinedStr.includes("editing")) {
    return "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=900&q=80";
  }
  if (combinedStr.includes("ai") || combinedStr.includes("model") || combinedStr.includes("computational") || combinedStr.includes("insilico") || combinedStr.includes("algorithm")) {
    return "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=900&q=80";
  }
  if (combinedStr.includes("virus") || combinedStr.includes("cell") || combinedStr.includes("microbiom") || combinedStr.includes("protein") || combinedStr.includes("antibody")) {
    return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80";
  }
  if (combinedStr.includes("microbiology") || combinedStr.includes("bact") || combinedStr.includes("culture") || combinedStr.includes("petri")) {
    return "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80";
  }

  const DYNAMIC_DAILY_IMAGES = [
    "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=900&q=80",
    "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=900&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80",
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80",
    "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=900&q=80"
  ];

  const charCodeSum = (title || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const dayIndex = Math.abs(charCodeSum + Math.floor(dateObj.getTime() / 86400000)) % DYNAMIC_DAILY_IMAGES.length;
  return DYNAMIC_DAILY_IMAGES[dayIndex];
}

function generateDetailedSummary(title, cleanText) {
  const cleanTitle = decodeEntities(title);
  const words = cleanText ? cleanText.split(" ") : [];
  const excerpt = words.length > 0 ? words.slice(0, 70).join(" ") : cleanTitle;

  let point1 = `The Innovation: ${cleanTitle}. Represents a major step forward in life sciences research.`;
  let point2 = `The Discovery: ${excerpt.length > 20 ? excerpt : "Key findings demonstrate targeted biological mechanisms and improved experimental accuracy."}`;
  let point3 = `The Impact: Unlocks key applications for therapeutics, synthetic biology, and biomanufacturing.`;

  if (cleanTitle.toLowerCase().includes("ai") || cleanTitle.toLowerCase().includes("crispr")) {
    point1 = `The Technology: Combines advanced gene editing tools with cutting-edge computational modeling to analyze complex biological systems.`;
    point2 = `The Breakthrough: ${excerpt.substring(0, 160)}...`;
    point3 = `Future Impact: Significantly speeds up discovery timelines, enabling researchers to engineer new therapeutic and sustainable biological solutions.`;
  } else if (cleanTitle.toLowerCase().includes("virus") || cleanTitle.toLowerCase().includes("cell") || cleanTitle.toLowerCase().includes("study")) {
    point1 = `The Research: Uncovers key cellular and molecular pathways underlying host-pathogen interactions.`;
    point2 = `Key Finding: ${excerpt.substring(0, 160)}...`;
    point3 = `Clinical Relevance: Provides actionable insights for developing targeted vaccines, antiviral agents, and precision medicines.`;
  }

  return [
    { text: point1 },
    { text: point2 },
    { text: point3 }
  ];
}

function generateQuiz(title) {
  const cleanTitle = decodeEntities(title);
  const lower = cleanTitle.toLowerCase();

  if (lower.includes("ai") || lower.includes("model") || lower.includes("algorithm")) {
    return {
      question: `What technology is central to the breakthrough in today's Bio-Minute update?`,
      options: ["Quantum Computing", "Artificial Intelligence & Computational Modeling", "Manual Lab Titration"],
      answer: 1,
      xp: "+20 XP"
    };
  }

  if (lower.includes("crispr") || lower.includes("gene") || lower.includes("dna") || lower.includes("genome")) {
    return {
      question: `What primary biological mechanism is highlighted in today's feature?`,
      options: ["Gene Editing & Targeted Locus Modification", "Traditional Fermentation", "Static Microscopic Imaging"],
      answer: 0,
      xp: "+20 XP"
    };
  }

  return {
    question: `What major field does today's feature impact?`,
    options: ["Agricultural Engineering", "Biotechnology & Medical Innovation", "Heavy Industrial Metallurgy"],
    answer: 1,
    xp: "+20 XP"
  };
}

// Generate Date-Seeded Dynamic Daily Biotech News (Guarantees fresh content every 24 hours at midnight)
function getDynamicDailyArticle(dateObj = new Date()) {
  const start = new Date(dateObj.getFullYear(), 0, 0);
  const diff = dateObj - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const DAILY_TOPICS = [
    {
      title: "AI-Powered Protein Folding Models Accelerate Enzyme Engineering for Biodegradable Plastics",
      category: "SYNTHETIC BIOLOGY",
      impact: "🔴 High Industry Impact",
      summary: [
        { text: "The Technology: Uses deep learning algorithms to predict tertiary enzyme structures and catalytic binding site stability." },
        { text: "The Discovery: Researchers engineered a PET-degrading hydrolase variant that breaks down post-consumer plastics in under 48 hours at room temperature." },
        { text: "Future Impact: Paves the way for circular biomanufacturing and industrial-scale plastic waste recycling." }
      ],
      body: "Researchers have achieved a breakthrough by combining generative AI protein design with high-throughput laboratory screening. The newly engineered enzyme displays 10x higher catalytic efficiency against synthetic polymers, enabling rapid bio-recycling without requiring high energy inputs.",
      image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=900&q=80",
      quiz: {
        question: "What material does the AI-engineered enzyme target for rapid degradation?",
        options: ["Post-Consumer Synthetic Plastics (PET)", "Cellulosic Timber", "Silicate Glass"],
        answer: 0,
        xp: "+20 XP"
      }
    },
    {
      title: "CRISPR-Cas13 RNA Editing Shows Promise in Neutralizing RNA Viruses Without Genome Alterations",
      category: "GENE EDITING",
      impact: "⚡ Major Breakthrough",
      summary: [
        { text: "The Technology: Employs RNA-guided Cas13 nucleases to selectively degrade viral messenger RNA inside infected host cells." },
        { text: "The Discovery: Scientists demonstrated transient RNA cleavage that blocks viral replication without causing permanent changes to the host DNA." },
        { text: "Clinical Relevance: Offers a flexible therapeutic platform for rapidly responding to emerging viral epidemics." }
      ],
      body: "Unlike traditional CRISPR-Cas9 tools that target double-stranded DNA, Cas13 operates exclusively on single-stranded RNA. This study highlights how transient RNA therapeutics can neutralize viral transcripts safely, leaving host genomic DNA intact.",
      image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=900&q=80",
      quiz: {
        question: "Why is CRISPR-Cas13 considered safer for transient antiviral therapy?",
        options: ["It degrades viral RNA without altering host genomic DNA", "It replaces cellular mitochondria", "It works only in plant tissues"],
        answer: 0,
        xp: "+20 XP"
      }
    },
    {
      title: "Microalgae Bio-Refineries Achieve Record Lipid Yields for Carbon-Neutral Aviation Fuel",
      category: "GREEN BIOTECH",
      impact: "🌱 Sustainable Innovation",
      summary: [
        { text: "The Innovation: Metabolic pathway engineering in Chlorella pyrenoidosa microalgae strains." },
        { text: "The Discovery: Optimizing nitrogen starvation cues doubled intracellular triacylglycerol accumulation without sacrificing growth kinetics." },
        { text: "Future Impact: Provides a scalable, drop-in replacement for conventional jet fuels, cutting aviation emissions by up to 70%." }
      ],
      body: "Aviation contributes significantly to global carbon emissions. Bio-engineers have developed a continuous-flow photobioreactor that maximizes photosynthetic light capture, converting atmospheric CO2 into bio-oil at industrial scale.",
      image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=900&q=80",
      quiz: {
        question: "What microorganism strain was optimized for sustainable bio-jet fuel production?",
        options: ["Microalgae (Chlorella pyrenoidosa)", "Baker's Yeast", "E. coli Bacteria"],
        answer: 0,
        xp: "+20 XP"
      }
    },
    {
      title: "Targeted Nanoparticle Drug Delivery System Enhances Oncology Immunotherapy Efficacy",
      category: "NANOMEDICINE",
      impact: "🔴 High Industry Impact",
      summary: [
        { text: "The Technology: Lipid nanoparticle (LNP) carriers functionalized with tumor-homing monoclonal antibodies." },
        { text: "The Discovery: Directs immune-checkpoint inhibitors specifically to solid tumor microenvironments, minimizing systemic toxicity." },
        { text: "Clinical Impact: Increases therapeutic response rates while reducing adverse side effects in clinical trial models." }
      ],
      body: "Delivering therapeutic agents directly to tumor sites while sparing healthy organs remains one of oncology's greatest challenges. This bio-engineered nanomedicine vehicle navigates vascular barriers to release immune boosters inside the tumor mass.",
      image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=900&q=80",
      quiz: {
        question: "What key advantage do functionalized lipid nanoparticles provide in oncology therapy?",
        options: ["Targeted tumor drug delivery with reduced systemic side effects", "Faster bone fracture healing", "Instant blood clotting"],
        answer: 0,
        xp: "+20 XP"
      }
    },
    {
      title: "Single-Cell Transcriptomics Uncovers Hidden Cellular Diversity in Human Immune Response",
      category: "GENOMICS & OMICS",
      impact: "⚡ Latest Discovery",
      summary: [
        { text: "The Technology: High-throughput single-cell RNA sequencing (scRNA-seq) paired with bioinformatic clustering algorithms." },
        { text: "The Discovery: Mapped previously uncharacterized dendritic cell subpopulations that regulate early inflammatory signaling." },
        { text: "Future Impact: Informs the design of next-generation personalized vaccines and autoimmune disease treatments." }
      ],
      body: "Bulk cell sequencing often masks rare cell types. By profiling thousands of individual immune cells simultaneously, genomic researchers discovered novel cell states that dictate how the human body responds to vaccines and pathogen exposure.",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80",
      quiz: {
        question: "What genomic technique allowed researchers to discover rare immune cell subpopulations?",
        options: ["Single-Cell RNA Sequencing (scRNA-seq)", "Standard Gel Electrophoresis", "Light Microscopy"],
        answer: 0,
        xp: "+20 XP"
      }
    }
  ];

  const index = Math.abs(dayOfYear) % DAILY_TOPICS.length;
  const topic = DAILY_TOPICS[index];

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

  return {
    id: 1,
    title: topic.title,
    date: dateStr,
    readTime: "2 min read",
    category: topic.category,
    categoryDate: shortDateStr,
    impact: topic.impact,
    summary: topic.summary,
    body: topic.body,
    image: topic.image,
    quiz: topic.quiz,
    streak: 1,
    missed: DAILY_TOPICS.filter((_, i) => i !== index).map((t, idx) => ({
      id: idx + 2,
      date: shortDateStr,
      title: t.title,
      img: t.image,
      fullArticle: {
        id: idx + 2,
        date: dateStr,
        readTime: "2 min read",
        category: t.category,
        categoryDate: shortDateStr,
        impact: t.impact,
        title: t.title,
        summary: t.summary,
        body: t.body,
        image: t.image,
        quiz: t.quiz
      }
    }))
  };
}

export async function GET() {
  const now = new Date();

  // 1. Try Live RSS News Feeds
  const rssFeeds = [
    "https://www.biotecnika.org/feed/",
    "https://phys.org/rss-feed/biology-news/biotechnology/",
    "https://www.sciencedaily.com/rss/plants_animals/biotechnology.xml"
  ];

  for (const feedUrl of rssFeeds) {
    try {
      const res = await fetch(feedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BioConnect/2.0"
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
        if (!title || title.length < 10) continue;

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

        const image = getHighResImage(title, descRaw, contentRaw, parsedDate);
        const cleanText = decodeEntities(contentRaw || descRaw);
        const summary = generateDetailedSummary(title, cleanText);
        const quiz = generateQuiz(title);
        const body = cleanText.length > 500 ? cleanText.substring(0, 500) + "..." : cleanText;

        parsedArticles.push({
          id: i,
          title,
          link,
          date: dateStr,
          readTime: "2 min read",
          category: "BIOTECH NEWS",
          categoryDate: shortDateStr,
          impact: i === 1 ? "🔴 High Industry Impact" : "⚡ Latest Discovery",
          summary,
          body,
          image,
          quiz
        });
      }

      if (parsedArticles.length > 0) {
        const todayArticle = parsedArticles[0];
        const missedArticles = parsedArticles.slice(1, 6).map((art) => ({
          id: art.id,
          date: art.categoryDate,
          title: art.title,
          img: art.image,
          link: art.link,
          fullArticle: art
        }));

        return NextResponse.json({
          success: true,
          source: "Live Biotech Feed",
          article: {
            ...todayArticle,
            streak: 1,
            missed: missedArticles
          },
          allArticles: parsedArticles
        }, { status: 200 });
      }
    } catch (e) {
      console.warn("RSS Feed fetch failed:", feedUrl, e.message);
    }
  }

  // 2. Try Live NCBI PubMed Open API (Latest Research Published Today)
  try {
    const pubmedRes = await fetch(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=biotechnology+OR+crispr+OR+genomics+OR+vaccine&retmode=json&sort=pub_date&retmax=5",
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

            const image = getHighResImage(title, item.source || "", "", dateObj);
            const summary = generateDetailedSummary(title, item.source || "");
            const quiz = generateQuiz(title);

            pubmedArticles.push({
              id: idx + 1,
              title,
              link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
              date: dateStr,
              readTime: "2 min read",
              category: "NCBI PUBMED",
              categoryDate: shortDateStr,
              impact: idx === 0 ? "🔴 High Impact NCBI Study" : "⚡ Latest Research",
              summary,
              body: `Published in ${item.source || "PubMed Journal"}. ${title}`,
              image,
              quiz
            });
          });

          if (pubmedArticles.length > 0) {
            const todayArticle = pubmedArticles[0];
            const missedArticles = pubmedArticles.slice(1).map((art) => ({
              id: art.id,
              date: art.categoryDate,
              title: art.title,
              img: art.image,
              link: art.link,
              fullArticle: art
            }));

            return NextResponse.json({
              success: true,
              source: "NCBI PubMed Live Engine",
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

  // 3. Guaranteed Dynamic Daily Article Engine (Calculated automatically from today's date)
  const dynamicArticle = getDynamicDailyArticle(now);
  return NextResponse.json({
    success: true,
    source: "Daily Calendar Engine",
    article: dynamicArticle
  }, { status: 200 });
}
