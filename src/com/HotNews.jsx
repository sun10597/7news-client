import { useEffect, useState } from "react";
import './HotNews.css';

export default function HotNews() {
  const [articles, setArticles] = useState([]);

  // ✅ Jaccard 유사도 계산 함수 (문자 기준)
  const jaccardSimilarity = (a, b) => {
    const setA = new Set(a.split(''));
    const setB = new Set(b.split(''));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  };
  // ✅ 유사 뉴스 제거 함수
  const removeDuplicateNews = (newsList) => {
    const filtered = [];

    for (const item of newsList) {
      const normTitle = item.title
        .replace(/<[^>]*>/g, '')    // HTML 태그 제거
        .replace(/[\[\]\(\)\.\,\”\“\"\·\"\‘\’\'\:\-\s]/g, '') // 특수문자 제거
        .toLowerCase();

      const isDuplicate = filtered.some(existing => {
        const existingTitle = existing.title
          .replace(/<[^>]*>/g, '')
          .replace(/[\[\]\(\)\.\·\"\'\:\-\s]/g, '')
          .toLowerCase();
        return jaccardSimilarity(normTitle, existingTitle) > 0.8;
      });

      if (!isDuplicate) filtered.push(item);
    }

    return filtered;
  };

  useEffect(() => {
    fetch("https://express-server-tp2f.onrender.com/api/news?query=속보")
      .then(res => res.json())
      .then(data => {
        const filtered = removeDuplicateNews(data);
        setArticles(filtered.slice(0, 5)); // 최대 5개 표시
      })
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
