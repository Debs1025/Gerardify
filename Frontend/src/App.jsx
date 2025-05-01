import { useState } from 'react'
import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import MusicPlayer from './components/MusicPlayer'
import Album from './pages/Album'

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="app-container">
      <BrowserRouter>
        <div className="main-content">
          <Navbar/>
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library setCurrentSong={setCurrentSong} />} 
              />
              <Route path="/album/:id" element={
                <Album 
                  setCurrentSong={setCurrentSong} 
                  currentSong={currentSong}
                  setIsPlaying={setIsPlaying}
                />
              } />
            </Routes>
          </div>
        </div>
        <MusicPlayer 
          currentSong={currentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </BrowserRouter>
    </div>
  );
}

export default App