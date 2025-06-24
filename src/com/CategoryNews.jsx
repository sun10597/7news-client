import React, { useState, useEffect } from "react";
import './CategoryNews.css';

const categories = ["정치", "경제", "사회", "IT", "스포츠", "생활", "문화", "세계"];

const subcategories = {
  정치: [ "대통령실",  "국회", "외교", "북한"],
  경제: ["금융", "부동산", "무역", "증권"],
  사회: ["사건사고", "교육", "노동", "언론"],
  IT: ["AI", "보안", "모바일", "게임"],
  스포츠: ["축구", "야구", "농구", "배구"],
  생활: ["건강", "여행", "음식"],
  문화: ["영화", "음악", "공연"],
  세계: ["미국", "중국", "일본"],
};

export default function CategoryNews() {
  const [selectedCategory, setSelectedCategory] = useState("정치");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      setLoading(true);
      try {
        const query = selectedSubcategory || selectedCategory;
        const res = await fetch(`https://express-server-tp2f.onrender.com/api/news?query=${query}&page=${page}`);
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
  }, [selectedCategory, selectedSubcategory, page]);

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
              setSelectedSubcategory("");
              setPage(1);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {subcategories[selectedCategory] && (
        <div className="subcategory-tabs">
          {subcategories[selectedCategory].map((sub) => (
            <button
              key={sub}
              className={sub === selectedSubcategory ? "active" : ""}
              onClick={() => {
                setSelectedSubcategory(sub);
                setPage(1);
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

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
