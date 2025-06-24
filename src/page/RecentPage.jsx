import { useEffect, useState } from "react";
import './RecentPage.css';
import usePageTitle from "../hooks/usePageTitle";

export default function RecentPage() {
  usePageTitle("🕘 최근 본 뉴스");
  
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("recent");
    setRecent(saved ? JSON.parse(saved) : []);
  }, []);

  return (
    <div className="recent-page">
      <h2 className="recent-title">🕘 최근 본 뉴스</h2>

      {recent.length === 0 ? (
        <p className="empty-message">최근 본 뉴스가 없습니다.</p>
      ) : (
        <div className="news-list">
          {recent.map((item, index) => (
            <div className="news-item" key={index}>
              <a href={item.link} target="_blank" rel="noopener noreferrer"
                 dangerouslySetInnerHTML={{ __html: item.title }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
