import { useEffect, useState } from "react";
import './LatestNews.css';

export default function LatestNews() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("https://express-server-tp2f.onrender.com/api/news?query=뉴스&sort=date")
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error("최신 뉴스 로딩 실패:", err));
  }, []);

  const handleClick = (article) => {
    const saved = JSON.parse(localStorage.getItem("recent") || "[]");
    const updated = [article, ...saved.filter(item => item.link !== article.link)].slice(0, 20);
    localStorage.setItem("recent", JSON.stringify(updated));
  };

  return (
    <div className="latest-news-container">
      <h2 className="latest-news-title">🆕 최신 뉴스</h2>
      {articles.map((item, index) => (
        <div className="latest-news-item" key={index}>
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
