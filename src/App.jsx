import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/shared/ScrollToTop'
import CornerNodeWeb from './components/shared/CornerNodeWeb'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <CornerNodeWeb />
      <div className="relative z-10 min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-16 pb-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
