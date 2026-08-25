import { NextResponse } from "next/server";

function decodeEntities(str) {
  if (!str) return "";
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function stripHtml(html) {
  if (!html) return "";
  const clean = html.replace(/<[^>]*>/g, "").trim();
  return decodeEntities(clean);
}

function getHighResImage(title, description, index) {
  // Try extracting image from description HTML
  const imgMatch = description ? description.match(/src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/i) : null;
  if (imgMatch && imgMatch[1] && !imgMatch[1].includes("gravatar") && !imgMatch[1].includes("logo")) {
    return imgMatch[1];
  }

  // Curated high-resolution biotech stock images
  const STOCK_IMAGES = [
    "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=70",
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=70",
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=70",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=70",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=70"
  ];
  return STOCK_IMAGES[index % STOCK_IMAGES.length];
}

function generateArticleSummary(title, contentStr) {
  const cleanTitle = decodeEntities(title);
  const cleanText = stripHtml(contentStr);
  const words = cleanText.split(" ");
  const excerpt = words.slice(0, 70).join(" ") + "...";

  let point1 = `The Innovation: ${cleanTitle}`;
  let point2 = `The Discovery: ${excerpt.substring(0, 110)}...`;
  let point3 = `The Future: Unlocks key applications for therapeutics, synthetic biology, and biomanufacturing.`;

  if (cleanTitle.toLowerCase().includes("ai") || cleanTitle.toLowerCase().includes("crispr")) {
    point1 = `The Tech: Utilizes state-of-the-art gene editing and computational AI models.`;
    point2 = `The Breakthrough: ${excerpt.substring(0, 110)}...`;
    point3 = `The Impact: Accelerates experimental discovery cycles from months to days.`;
  } else if (cleanTitle.toLowerCase().includes("virus") || cleanTitle.toLowerCase().includes("study")) {
    point1 = `The Finding: Decodes molecular pathways and host-pathogen interactions.`;
    point2 = `Key Result: ${excerpt.substring(0, 110)}...`;
    point3 = `Next Steps: Provides critical targets for next-generation drug and vaccine design.`;
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
      next: { revalidate: 3600 } // Auto revalidate cache every hour for daily updates
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
      const summary = generateArticleSummary(title, contentRaw || descRaw);
      const bodyText = stripHtml(contentRaw || descRaw);
      const body = bodyText.length > 400 ? bodyText.substring(0, 400) + "..." : bodyText;
      const quiz = generateQuiz(title);

      parsedArticles.push({
        title,
        link,
        date: dateStr,
        readTime: "2 min read",
        category: "BIOTECHNIKA NEWS",
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
    const missedArticles = parsedArticles.slice(1, 4).map((art) => ({
      date: art.categoryDate,
      title: art.title,
      img: art.image,
      link: art.link
    }));

    const responsePayload = {
      success: true,
      source: "Biotecnika News",
      article: {
        ...todayArticle,
        streak: 5,
        missed: missedArticles
      }
    };

    return NextResponse.json(responsePayload, { status: 200 });

  } catch (err) {
    console.error("Biotecnika BioMinute API Error:", err);
    // Fallback response maintaining standard format if network issue occurs
    const now = new Date();
    return NextResponse.json({
      success: false,
      error: err.message,
      article: {
        date: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        readTime: "2 min read",
        category: "BIOTECHNIKA NEWS",
        categoryDate: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase(),
        impact: "🔴 High Industry Impact",
        title: "Biotecnika Daily Biotech News Update",
        summary: [
          { icon: "🧬", text: "Latest News: Live biotech updates directly from Biotecnika." },
          { icon: "⚡", text: "Industry Impact: Covering CRISPR, Synthetic Biology, AI, and Life Sciences." },
          { icon: "🔮", text: "Daily Updates: Automatically refreshes every day with new breaking headlines." }
        ],
        body: "Biotecnika is India's leading biotechnology portal, delivering daily news, research insights, and industry breakthroughs across molecular biology, gene editing, and pharma innovations.",
        image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=70",
        quiz: {
          question: "What portal provides daily automated biotech news to BioConnect's Bio-Minute?",
          options: ["PubMed Central", "Biotecnika News Portal", "Nature Journal"],
          answer: 1,
          xp: "+20 XP"
        },
        streak: 5,
        missed: [
          { date: "RECENT", title: "Meet 14-Year-Old Millie Pradawong, Using AI and CRISPR", img: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=200&q=60" },
          { date: "RECENT", title: "World's First AI-Designed Synthetic Virus", img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200&q=60" },
          { date: "RECENT", title: "IISc Study Shows How a Virus Tricks Cells", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=60" }
        ]
      }
    }, { status: 200 });
  }
}
