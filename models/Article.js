import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: String,
  url: String,
  originalContent: String,
  content: String,        
});


const Article = mongoose.model("Article", articleSchema);

export default Article;
