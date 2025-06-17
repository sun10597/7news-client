import './App.css'
import { Routes, Route } from 'react-router-dom';
import Header from './com/Header';
import NewsDashboard from './page/NewsDashboard';
import SearchNewsPage from './page/SearhNewsPage';
import Footer from './com/Footer';
import BookmarksPage from './page/BookmarksPage';
import RecentPage from './page/RecentPage';
function App() {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<NewsDashboard/>} />
        <Route path="/search" element={<SearchNewsPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/recent" element={<RecentPage />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
