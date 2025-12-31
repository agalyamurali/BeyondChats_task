import { useState } from "react";

function Card({ article }) {
  const [isOpen, setIsOpen] = useState(false);

  const formatContent = (text) => {
    if (!text) {
      return <p style={styles.empty}>No content available.</p>;
    }

    return text.split("\n").map((line, index) => {
      if (line.trim() === "") return null;

      if (line.startsWith("## ")) {
        return (
          <h3 key={index} style={styles.heading}>
            {line.replace("## ", "")}
          </h3>
        );
      }

      return (
        <p key={index} style={styles.paragraph}>
          {line}
        </p>
      );
    });
  };

  return (
    <div style={styles.card}>
      
      <h2 style={styles.title}>{article.title}</h2>

      <p style={styles.meta}>
        Recently Updated
      </p>

      <button
        style={styles.button}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Read less ▲" : "Read more ▼"}
      </button>

      
      {isOpen && (
  <>
    <hr style={styles.divider} />

    <h3 style={styles.subheading}>Original Article</h3>
    <div>{formatContent(article.originalContent)}</div>

    <hr style={styles.divider} />

    {/* <h3 style={styles.subheading}>Updated Article</h3> */}
    <div>{formatContent(article.content)}</div>
  </>
)}

    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: "28px",
    marginBottom: "40px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    lineHeight: "1.7",
  },

  title: {
    marginBottom: "6px",
    color: "#111",
  },

  meta: {
    fontSize: "13px",
    color: "#777",
    marginBottom: "14px",
  },

  button: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },

  divider: {
    border: "none",
    borderTop: "1px solid #e5e5e5",
    margin: "20px 0",
  },

  heading: {
    marginTop: "32px",
    marginBottom: "10px",
    paddingBottom: "6px",
    borderBottom: "2px solid #eee",
    color: "#222",
  },

  paragraph: {
    color: "#333",
    fontSize: "15px",
    marginBottom: "14px",
  },

  empty: {
    fontStyle: "italic",
    color: "#999",
  },
  subheading: {
  marginTop: "20px",
  marginBottom: "10px",
  color: "#444",
  fontSize: "16px",
  fontWeight: "600",
},

};

export default Card;
