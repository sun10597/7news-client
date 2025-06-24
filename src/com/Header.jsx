import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Header.css';

export default function Header() {
  const [dateStr, setDateStr] = useState("");
  const [query, setQuery] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();

  // 날짜 설정
  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    });
    setDateStr(formatted);
  }, []);

  // 키워드 설정 (localStorage 또는 기본값)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
    if (stored.length > 0) {
      setKeywords(stored);
    } else {
      setKeywords(["AI", "경제", "속보", "정치", "날씨"]);
    }
  }, []);

  // 슬라이드 전환
  useEffect(() => {
    if (keywords.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % keywords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [keywords]);

  // 검색 처리
  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const prev = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
    const updated = [trimmed, ...prev.filter(k => k !== trimmed)].slice(0, 10);
    localStorage.setItem("recentKeywords", JSON.stringify(updated));
    setKeywords(updated);
    setCurrentIndex(0);
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  // 가짜 날씨 정보
  useEffect(() => {
    const mock = {
      city: "서울",
      temp: 25,
      icon: "🌧️",
    };
    setWeather(mock);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <span>{dateStr}</span>
        {weather && (
          <span className="weather-info">
            {weather.icon} {weather.temp}°C {weather.city}
          </span>
        )}
      </div>

      <div className="header-center">
        <Link to="/" className="logo">7 NEWS</Link>
        <div className="search-bar">
          <input
            type="text"
            placeholder="기사 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
      </div>

      <div className="header-right">
        {keywords.length > 0 && (
          <div
            className="hot-keyword-fade"
            onClick={() => navigate(`/search?query=${keywords[currentIndex]}`)}
          >
            {keywords.map((word, i) => (
              <div
                key={i}
                className={`hot-keyword-fade-item ${
                  i === currentIndex ? "active" : ""
                }`}
              >
                #{word}
              </div>
            ))}
          </div>
        )}
        <Link to="/recent" className="recent-link">🕘</Link>
        <Link to="/bookmarks" className="bookmark-link">⭐</Link>
      </div>
    </header>
  );
}
