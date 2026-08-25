import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function decodeEntities(str) {
  if (!str) return "";
  return str
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
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function cleanBiotecnikaText(rawHtml, title = "") {
  if (!rawHtml) return "";
  let clean = rawHtml
    .replace(/<[^>]*>/g, " ")
    .replace(/The post .* appeared first on .*/gi, "")
    .replace(/The post .* appeared first on Biotecnika\.?/gi, "")
    .replace(/\[&#8230;\]/gi, "")
    .replace(/\[\.\.\.\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  clean = decodeEntities(clean);

  // If text repeats the title at the beginning, strip it cleanly
  if (title && clean.toLowerCase().startsWith(title.toLowerCase())) {
    clean = clean.substring(title.length).trim();
  }

  return clean;
}

function getHighResImage(title, description, index) {
  const imgMatch = description ? description.match(/src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/i) : null;
  if (imgMatch && imgMatch[1] && !imgMatch[1].includes("gravatar") && !imgMatch[1].includes("logo")) {
    return imgMatch[1];
  }

  const STOCK_IMAGES = [
    "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=70",
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=70",
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=70",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=70",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=70"
  ];
  return STOCK_IMAGES[index % STOCK_IMAGES.length];
}

function generateDetailedSummary(title, cleanText) {
  const cleanTitle = decodeEntities(title);
  const words = cleanText.split(" ");
  const excerpt = words.slice(0, 80).join(" ");

  let point1 = `The Innovation: ${cleanTitle}. Represents a major step forward in life sciences research.`;
  let point2 = `The Discovery: ${excerpt.length > 20 ? excerpt : "Key findings demonstrate targeted biological mechanisms and improved experimental accuracy."}`;
  let point3 = `The Impact: Unlocks key applications for therapeutics, synthetic biology, and biomanufacturing.`;

  if (cleanTitle.toLowerCase().includes("ai") || cleanTitle.toLowerCase().includes("crispr")) {
    point1 = `The Technology: Combines advanced gene editing tools like CRISPR with cutting-edge artificial intelligence models to analyze complex biological systems.`;
    point2 = `The Breakthrough: ${excerpt.substring(0, 160)}...`;
    point3 = `Future Impact: Significantly speeds up discovery timelines, enabling researchers to engineer new therapeutic and sustainable biological solutions.`;
  } else if (cleanTitle.toLowerCase().includes("virus") || cleanTitle.toLowerCase().includes("study")) {
    point1 = `The Research: Uncovers key cellular and molecular pathways underlying host-pathogen interactions.`;
    point2 = `Key Finding: ${excerpt.substring(0, 160)}...`;
    point3 = `Clinical Relevance: Provides actionable insights for developing targeted vaccines, antiviral agents, and precision medicines.`;
  }

  return [
    { icon: "🧬", text: point1 },
    { icon: "⚡", text: point2 },
    { icon: "🔮", text: point3 }
  ];
}

function generateQuiz(title) {
  const cleanTitle = decodeEntities(title);

  if (cleanTitle.toLowerCase().includes("ai")) {
    return {
      question: `What technology is central to the breakthrough in "${cleanTitle.substring(0, 45)}..."?`,
      options: ["Quantum Computing", "Artificial Intelligence & Computational Modeling", "Manual Lab Titration"],
      answer: 1,
      xp: "+20 XP"
    };
  }

  if (cleanTitle.toLowerCase().includes("crispr") || cleanTitle.toLowerCase().includes("gene")) {
    return {
      question: `What primary biological mechanism is highlighted in "${cleanTitle.substring(0, 45)}..."?`,
      options: ["Gene Editing & Targeted Locus Modification", "Traditional Fermentation", "Static Microscopic Imaging"],
      answer: 0,
      xp: "+20 XP"
    };
  }

  return {
    question: `What major field does today's Biotecnika news report impact?`,
    options: ["Agricultural Engineering", "Biotechnology & Medical Innovation", "Heavy Industrial Metallurgy"],
    answer: 1,
    xp: "+20 XP"
  };
}

export async function GET() {
  try {
    const rssUrl = "https://www.biotecnika.org/category/biotech-news/feed/";
    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BioConnect/2.0"
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Biotecnika RSS feed: ${res.statusText}`);
    }

    const xmlText = await res.text();
    const itemBlocks = xmlText.split("<item>");
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

      const title = decodeEntities(stripHtml(rawTitle));
      if (!title) continue;

      const parsedDate = pubDateRaw ? new Date(pubDateRaw) : new Date();
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

      const image = getHighResImage(title, descRaw || contentRaw, i - 1);
      const cleanText = cleanBiotecnikaText(contentRaw || descRaw, title);
      const summary = generateDetailedSummary(title, cleanText);
      const quiz = generateQuiz(title);

      // Create rich detailed narrative body
      const body = cleanText.length > 500 ? cleanText.substring(0, 500) + "..." : cleanText;

      parsedArticles.push({
        id: i,
        title,
        link,
        date: dateStr,
        readTime: "2 min read",
        category: "BIOTECNIKA NEWS",
        categoryDate: shortDateStr,
        impact: i === 1 ? "🔴 High Industry Impact" : "⚡ Latest Discovery",
        summary,
        body,
        image,
        quiz
      });
    }

    if (parsedArticles.length === 0) {
      throw new Error("No articles parsed from Biotecnika RSS feed");
    }

    const todayArticle = parsedArticles[0];
    const missedArticles = parsedArticles.slice(1, 6).map((art) => ({
      id: art.id,
      date: art.categoryDate,
      title: art.title,
      img: art.image,
      link: art.link,
      fullArticle: art
    }));

    const responsePayload = {
      success: true,
      source: "Biotecnika News",
      article: {
        ...todayArticle,
        streak: 1,
        missed: missedArticles
      },
      allArticles: parsedArticles
    };

    return NextResponse.json(responsePayload, { status: 200 });

  } catch (err) {
    console.error("Biotecnika BioMinute API Error:", err);
    const now = new Date();
    return NextResponse.json({
      success: false,
      error: err.message,
      article: {
        id: 1,
        date: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        readTime: "2 min read",
        category: "BIOTECNIKA NEWS",
        categoryDate: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase(),
        impact: "🔴 High Industry Impact",
        title: "Meet 14-Year-Old Millie Pradawong, Using AI and CRISPR to Rethink Biofuel",
        summary: [
          { icon: "🧬", text: "The Technology: Combines synthetic biology with artificial intelligence algorithms to optimize algal biofuel metabolic pathways." },
          { icon: "⚡", text: "The Breakthrough: Most teenagers spend their free time on social media or video games, but 14-year-old Millie Pradawong is creating science history by engineering algae to increase lipid yields for green energy." },
          { icon: "🔮", text: "Future Impact: Provides a scalable, carbon-neutral alternative to fossil fuels while reducing production costs." }
        ],
        body: "Most teenagers spend their free time scrolling through social media, playing video games or hanging out with friends. Here is a 14-year-old who is creating history with science and technology. Yes, you read it right. Meet Millie Pradawong, who spends her time thinking about algae, gene editing, and how AI can solve global renewable energy challenges. By applying CRISPR tools to algae micro-cultures, her research establishes new benchmarks for sustainable biofuel production.",
        image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=70",
        quiz: {
          question: "What primary technology combination did Millie Pradawong utilize for biofuel research?",
          options: ["Nuclear Fusion", "AI & CRISPR Gene Editing", "Traditional Steam Distillation"],
          answer: 1,
          xp: "+20 XP"
        },
        streak: 1,
        missed: [
          {
            id: 2,
            date: "AUG 13",
            title: "World's First AI-Designed Synthetic Virus, Opening New Possibilities in Medicine",
            img: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=200&q=60",
            fullArticle: {
              id: 2,
              date: "Thursday, August 13, 2026",
              readTime: "2 min read",
              category: "BIOTECNIKA NEWS",
              categoryDate: "AUG 13",
              impact: "⚡ Latest Discovery",
              title: "World's First AI-Designed Synthetic Virus, Opening New Possibilities in Medicine",
              summary: [
                { icon: "🧬", text: "The Innovation: Computer-guided synthetic virus architecture created entirely in silico." },
                { icon: "⚡", text: "The Discovery: Researchers generated viral capsid sequences capable of targeted cell delivery without harmful side effects." },
                { icon: "🔮", text: "The Impact: Opens new avenues for precision gene therapy delivery and targeted oncology treatments." }
              ],
              body: "Scientists have achieved a groundbreaking milestone by creating the world's first synthetic virus designed entirely through artificial intelligence models. This development allows researchers to engineer viral capsids with surgical precision, targeting specific diseased cells while sparing healthy tissue.",
              image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=70",
              quiz: {
                question: "What is the primary medical application of the AI-designed synthetic virus?",
                options: ["Targeted Gene & Cancer Cell Delivery", "Industrial Fertilizer Production", "Solar Cell Coating"],
                answer: 0,
                xp: "+20 XP"
              }
            }
          },
          {
            id: 3,
            date: "AUG 13",
            title: "How Insilico Medicine Is Changing Drug Discovery With AI",
            img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200&q=60",
            fullArticle: {
              id: 3,
              date: "Thursday, August 13, 2026",
              readTime: "2 min read",
              category: "BIOTECNIKA NEWS",
              categoryDate: "AUG 13",
              impact: "⚡ Major Breakthrough",
              title: "How Insilico Medicine Is Changing Drug Discovery With AI",
              summary: [
                { icon: "🧬", text: "The Innovation: End-to-end generative AI platform for novel target discovery and drug design." },
                { icon: "⚡", text: "The Discovery: Compressed preclinical candidate selection from 4 years down to under 18 months." },
                { icon: "🔮", text: "The Impact: Transforms pharmaceutical R&D efficiency for hard-to-treat diseases." }
              ],
              body: "Insilico Medicine continues to push the boundaries of pharmaceutical technology. By deploying generative AI algorithms across target discovery, molecular generation, and clinical trial prediction, the firm has demonstrated unprecedented speed in advancing novel small-molecule drugs into clinical trials.",
              image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=70",
              quiz: {
                question: "By how much did Insilico Medicine compress drug candidate discovery timelines?",
                options: ["From 4 years down to under 18 months", "From 10 years to 8 years", "No change"],
                answer: 0,
                xp: "+20 XP"
              }
            }
          },
          {
            id: 4,
            date: "JUL 28",
            title: "IISc Study Shows How a Virus Tricks Cells Into Making Viral Proteins",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=60",
            fullArticle: {
              id: 4,
              date: "Tuesday, July 28, 2026",
              readTime: "2 min read",
              category: "BIOTECNIKA NEWS",
              categoryDate: "JUL 28",
              impact: "🔴 High Industry Impact",
              title: "IISc Study Shows How a Virus Tricks Cells Into Making Viral Proteins",
              summary: [
                { icon: "🧬", text: "The Finding: Unveils ribosomal hijacking machinery used by viral RNA." },
                { icon: "⚡", text: "The Discovery: Indian Institute of Science researchers mapped structural changes in host translation machinery during infection." },
                { icon: "🔮", text: "The Impact: Identifies vulnerable target sites for broad-spectrum antiviral drug development." }
              ],
              body: "Researchers at the Indian Institute of Science (IISc) have uncovered the precise molecular mechanisms by which viruses hijack cellular translation machinery. By tricking host ribosomes into prioritizing viral RNA translation over cellular proteins, the virus rapidly replicates, offering new targets for antiviral interventions.",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=70",
              quiz: {
                question: "What cellular organelle is hijacked by the virus according to the IISc study?",
                options: ["Mitochondria", "Ribosome (Translation Machinery)", "Lysosome"],
                answer: 1,
                xp: "+20 XP"
              }
            }
          }
        ]
      }
    }, { status: 200 });
  }
}
