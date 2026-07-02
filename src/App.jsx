import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import BookSelectionPage from './pages/BookSelectionPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import ScoreboardPage from './pages/ScoreboardPage.jsx'

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/books" element={<BookSelectionPage />} />
        <Route path="/quiz/:bookId" element={<QuizPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/scoreboard" element={<ScoreboardPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
