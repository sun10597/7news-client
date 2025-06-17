import { useEffect, useState } from "react";
import './HotNews.css';

export default function HotNews() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("https://express-server-tp2f.onrender.com/api/news?query=속보")
      .then(res => res.json())
      .then(data => setArticles(data.slice(0, 5)))
      .catch(err => console.error("Hot 뉴스 로딩 실패:", err));
  }, []);

  const handleClick = (article) => {
    const saved = JSON.parse(localStorage.getItem("recent") || "[]");
    const updated = [article, ...saved.filter(item => item.link !== article.link)].slice(0, 20);
    localStorage.setItem("recent", JSON.stringify(updated));
  };

  return (
    <div className="hot-news-container">
      <h2 className="hot-news-title">🔥 HOT 뉴스</h2>
      {articles.map((item, index) => (
        <div className="hot-news-item" key={index}>
          <span className="hot-news-rank">{index + 1}</span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(item)}
            dangerouslySetInnerHTML={{ __html: item.title }}
          />
        </div>
      ))}
    </div>
  );
}
