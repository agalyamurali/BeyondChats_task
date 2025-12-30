import axios from "axios";
import { load } from "cheerio";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Article from "../models/Article.js";
import googleIt from "google-it";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

await mongoose.connect(process.env.MONGO_URI);
console.log("DB connected ");

const fetchTopLinks = async (query) => {
  const results = await googleIt({ query, limit: 5 }); 
  const links = [];

  for (let r of results) {
    if (links.length >= 2) break;
    if (r.link.includes("http")) {
      links.push(r.link);
    }
  }

  return links;
};

const scrapeContent = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = load(response.data);

    let content = "";
    $("p").each((i, el) => {
      content += $(el).text().trim() + "\n\n";
    });

    return content.trim();
  } catch (err) {
    console.error("Failed to scrape:", url);
    return "";
  }
};

const rewriteArticle = async (original, references) => {
  const prompt = `
You are an expert content writer. Rewrite the following article to make it similar in style, formatting, and content to these reference articles:

References:
${references.join("\n\n")}

Original article:
${original}

Include a "References" section at the bottom citing the URLs.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  return response.choices[0].message.content;
};

const processArticles = async () => {
  const articles = await Article.find();

  for (let art of articles) {
    console.log("Processing:", art.title);

    const topLinks = await fetchTopLinks(art.title);
    const refContents = [];

    for (let link of topLinks) {
      const c = await scrapeContent(link);
      refContents.push(c);
    }

    const newContent = await rewriteArticle(art.content, refContents);

    await Article.findByIdAndUpdate(art._id, { content: newContent });

    console.log("Updated article:", art.title);
  }

  console.log("Phase 2 complete!");
  process.exit();
};

processArticles();
