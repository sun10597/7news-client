import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Header.css';

export default function Header() {
  const [dateStr, setDateStr] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    });
    setDateStr(formatted);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="header-left">{dateStr}</div>

      <div className="header-center">
        <Link to="/" className="logo">7 NEWS</Link>
      </div>

      <div className="header-right">
        <Link to="/recent" className="recent-link" title="최근 본 뉴스">🕘</Link>
        <Link to="/bookmarks" className="bookmark-link" title="즐겨찾기">⭐</Link>
        <input
          type="text"
          placeholder="기사 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>🔍</button>
      </div>
    </header>
  );
}
