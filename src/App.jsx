import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import RecognizePage from './pages/RecognizePage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/recognize" element={<RecognizePage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
