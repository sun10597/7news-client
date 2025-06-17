import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-title">7 NEWS</p>
        <p className="footer-description">© 2025 | 7 News. All rights reserved.</p>
        <p className="footer-links">
          <a href="https://news.naver.com/" target="_blank" rel="noopener noreferrer">네이버 뉴스</a> | 
          <a href="https://www.korea.go.kr" target="_blank" rel="noopener noreferrer">정부24</a>
        </p>
      </div>
    </footer>
  );
}
