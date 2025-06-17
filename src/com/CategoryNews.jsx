import React, { useState, useEffect } from "react";
import './CategoryNews.css';

const categories = ["정치", "경제", "사회", "IT", "스포츠", "생활", "문화", "세계"];

export default function CategoryNews() {
  const [selectedCategory, setSelectedCategory] = useState("정치");
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://express-server-tp2f.onrender.com/api/news?query=${selectedCategory}&page=${page}`);
        const data = await res.json();
        if (page === 1) {
          setArticles(data);
        } else {
          setArticles(prev => [...prev, ...data]);
        }
      } catch (error) {
        console.error("뉴스 로딩 실패:", error);
      }
      setLoading(false);
    };
    fetchCategoryNews();
  }, [selectedCategory, page]);

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    setBookmarks(saved ? JSON.parse(saved) : []);
  }, []);

  const handleClick = (article) => {
    const saved = JSON.parse(localStorage.getItem("recent") || "[]");
    const updated = [article, ...saved.filter(item => item.link !== article.link)].slice(0, 20);
    localStorage.setItem("recent", JSON.stringify(updated));
  };

  const toggleBookmark = (article) => {
    const exists = bookmarks.some(item => item.link === article.link);
    const updated = exists
      ? bookmarks.filter(item => item.link !== article.link)
      : [...bookmarks, article];

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const isBookmarked = (article) =>
    bookmarks.some(item => item.link === article.link);

  return (
    <div className="category-news">
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={cat === selectedCategory ? "active" : ""}
            onClick={() => {
              setSelectedCategory(cat);
              setPage(1);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="news-list">
        {articles.map((article, index) => (
          <div key={index} className="news-item">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleClick(article)}
            >
              <div dangerouslySetInnerHTML={{ __html: article.title }} />
            </a>
            <button onClick={() => toggleBookmark(article)}>
              {isBookmarked(article) ? "★" : "☆"}
            </button>
          </div>
        ))}
      </div>

      {articles.length > 0 && (
        <div className="load-more">
          <button onClick={() => setPage(prev => prev + 1)} disabled={loading}>
            {loading ? "불러오는 중..." : "더보기"}
          </button>
        </div>
      )}
    </div>
  );
}
