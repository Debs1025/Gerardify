import { useState } from 'react'
import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import MusicPlayer from './components/MusicPlayer'

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <div className="main-content">
          <Navbar />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
            </Routes>
          </div>
        </div>
        <MusicPlayer />
      </BrowserRouter>
    </div>
  )
}

export default App