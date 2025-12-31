import axios from "axios";
import { load } from "cheerio";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Article from "../models/Article.js";
import googleIt from "google-it";

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const fetchTopLinks = async (query) => {
  const results = await googleIt({ query, limit: 5 });
  const links = [];

  for (let r of results) {
    if (links.length >= 2) break;
    if (r.link && r.link.startsWith("http")) {
      links.push(r.link);
    }
  }
  return links;
};

const scrapeContent = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const $ = load(response.data);

    let content = "";
    $("p").each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 50) {
        content += text + "\n\n";
      }
    });

    return content.slice(0, 2000);
  } catch (err) {
    console.error("Failed to scrape:", url);
    return "";
  }
};

const mockRewriteArticle = (original, refContents, refLinks) => {
  let updated = `## Updated Article\n\n`;
  updated += original + "\n\n";

  updated += `## Insights from Top Ranking Articles\n\n`;
  if (refContents.length === 0) {
    updated += "Insights derived from general industry best practices.\n\n";
  } else {
    refContents.forEach((content, i) => {
      updated += `### Reference Article ${i + 1}\n`;
      updated += content + "\n\n";
    });
  }

  updated += `## References\n`;
  if (refLinks.length === 0) {
    updated += "No external references available (mock AI mode).\n";
  } else {
    refLinks.forEach((link, index) => {
      updated += `${index + 1}. ${link}\n`;
    });
  }

  return updated;
};


const runPhase2 = async () => {
  try {
    await connectDB();

    const articles = await Article.find();

    for (let art of articles) {
      console.log("\nProcessing:", art.title);

      const links = await fetchTopLinks(art.title);
      const refContents = [];

      for (let link of links) {
        const content = await scrapeContent(link);
        if (content && content.length > 100) {
            refContents.push(content);
        } else {
             refContents.push("Content could not be extracted, but the source was referenced.");
        }
      }

      const updatedContent = mockRewriteArticle(
        art.content,
        refContents,
        links
      );

      await Article.findByIdAndUpdate(
       art._id,
       { content: updatedContent },
       { new: true }
);

      console.log("Updated article:", art.title);
    }

    process.exit();

  } catch (error) {
    console.error("Phase 2 error:", error.message);
    process.exit(1);
  }
};

runPhase2();
