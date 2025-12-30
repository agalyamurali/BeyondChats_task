import axios from "axios";
import {load} from "cheerio";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Article from "../models/Article.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected for scraping"))
  .catch(err => console.log(err));

  const scrapeFullContent = async (articleUrl) => {
  try {
    const response = await axios.get(articleUrl);
    const $ = load(response.data);

    let content = "";

    $(".entry-content p, .elementor-widget-theme-post-content p").each(
      (i, el) => {
        content += $(el).text().trim() + "\n\n";
      }
    );

    return content.trim();
  } catch (error) {
    console.error("Content scrape failed:", articleUrl);
    return "";
  }
};


const scrapeBeyondChats = async () => {
  try {
    const url = "https://beyondchats.com/blogs/";
    const response = await axios.get(url);

    const $ = load(response.data);

    const cards = $(".blog-card");

    const articles = [];

    $("article.entry-card").each((index, element) => {
      if (articles.length >= 5) return;

      const title = $(element)
        .find("h2, h3")
        .first()
        .text()
        .trim();

      const link = $(element)
        .find("a")
        .first()
        .attr("href");

      if (title && link) {
        articles.push({
          title,
          url: link,
          content: "Content will be scraped later"
        });
      }
    });

    console.log("Extracted articles count:", articles.length);

    for (let art of articles) {
  const fullContent = await scrapeFullContent(art.url);

  await Article.findOneAndUpdate(
    { title: art.title },
    { content: fullContent },
    { new: true }
  );

  console.log("Updated content for:", art.title);
}

    for (let art of articles) {
      const exists = await Article.findOne({ title: art.title });
      if (!exists) {
        await Article.create(art);
        console.log("Saved:", art.title);
      }
    }

    console.log("Scraping completed");
    process.exit();

  } catch (error) {
    console.error(error);
  }
};

scrapeBeyondChats();
