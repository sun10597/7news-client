import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import './SearchNewsPage.css';
import usePageTitle from "../hooks/usePageTitle";

export default function SearchNewsPage() {
  usePageTitle("🔍 검색");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyword = params.get("query");

  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 초기 북마크 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    setBookmarks(saved ? JSON.parse(saved) : []);
  }, []);

  useEffect(() => {
    setPage(1);
    setArticles([]);
  }, [keyword]);

  useEffect(() => {
    if (!keyword) return;
    const fetchSearchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://express-server-tp2f.onrender.com/api/news?query=${encodeURIComponent(keyword)}&page=${page}`);
        const data = await res.json();
        if (page === 1) {
          setArticles(data);
        } else {
          setArticles(prev => [...prev, ...data]);
        }
      } catch (err) {
        console.error("검색 결과 오류:", err);
      }
      setLoading(false);
    };

    fetchSearchNews();
  }, [keyword, page]);

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
    <div className="search-page">
      <h2 className="search-title">🔍 "{keyword}" 검색 결과</h2>

      {articles.length === 0 && !loading && (
        <p className="no-result">검색 결과가 없습니다.</p>
      )}

      <div className="search-list">
        {articles.map((item, index) => (
          <div className="search-item" key={index}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleClick(item)}
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            {item.description && (
              <p className="search-description" dangerouslySetInnerHTML={{ __html: item.description }} />
            )}
            {item.pubDate && (
              <span className="search-date">
                {new Date(item.pubDate).toLocaleString()}
              </span>
            )}
            <button className="bookmark-button" onClick={() => toggleBookmark(item)}>
              {isBookmarked(item) ? "★" : "☆"}
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
