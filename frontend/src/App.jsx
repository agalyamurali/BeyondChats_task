import { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "./components/card";

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get("https://article-ai-update.onrender.com/api/articles")
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={styles.container}>
      <h1>BeyondChats Articles</h1>

      {articles.map(article => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
    
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px"
  }
};

export default App;
