import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import BookSelectionPage from './pages/BookSelectionPage.jsx'
import QuizPage from './pages/QuizPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/books" element={<BookSelectionPage />} />
        <Route path="/quiz/:bookId" element={<QuizPage />} />
      </Routes>
    </BrowserRouter>
  )
}
