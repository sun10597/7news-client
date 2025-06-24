import { useEffect, useState } from "react";
import './BookmarksPage.css';
import usePageTitle from "../hooks/usePageTitle";

export default function BookmarksPage() {
  usePageTitle("⭐ 즐겨찾기");

  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    setBookmarks(saved ? JSON.parse(saved) : []);
  }, []);

  const toggleBookmark = (article) => {
    const updated = bookmarks.filter(b => b.link !== article.link);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  return (
    <div className="bookmarks-page">
      <h2 className="bookmarks-title">⭐ 즐겨찾기한 뉴스</h2>

      {bookmarks.length === 0 ? (
        <p className="empty-message">즐겨찾기한 뉴스가 없습니다.</p>
      ) : (
        <div className="news-list">
          {bookmarks.map((article, index) => (
            <div key={index} className="news-item">
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                <div dangerouslySetInnerHTML={{ __html: article.title }} />
              </a>
              <button
                className="bookmark-button"
                onClick={() => toggleBookmark(article)}
              >
                ☆
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
