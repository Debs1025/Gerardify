import { useState } from 'react' // Importing useState from React
import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // Import routing components from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Library from './pages/Library'
import MusicPlayer from './components/MusicPlayer'
import Album from './pages/Album'
import Song from './pages/Song'

function App() {
  const [currentSong, setCurrentSong] = useState(null); // Use for managing the current song
  const [isPlaying, setIsPlaying] = useState(false);    // Use for managing the current playing song
  const [playlists, setPlaylists] = useState([]);       // Use for managing the playlists
  const [currentPlaylist, setCurrentPlaylist] = useState([]);  // Use for managing the current playlist
  const [songs, setSongs] = useState([]);               // Use for managing the songs 

  return (
    <div className="app-container">
      {/* BrowserRouter is used to enable routing in the app */}
      <BrowserRouter>
        <div className="main-content">
          <Navbar/>
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home playlists={playlists} />} />
              <Route path="/library" element={
                <Library 
                  // Contains the main content of the library page
                  setCurrentSong={setCurrentSong}
                  currentSong={currentSong}
                  playlists={playlists}
                  setPlaylists={setPlaylists}
                  setCurrentPlaylist={setCurrentPlaylist}
                  setIsPlaying={setIsPlaying}
                  songs={songs}
                  setSongs={setSongs}
                />} 
              />
              <Route path="/album/:id" element={
                <Album 
                  // Contains the main content of the album page
                  setCurrentSong={setCurrentSong} 
                  currentSong={currentSong}
                  setIsPlaying={setIsPlaying}
                  playlists={playlists}
                  setPlaylists={setPlaylists}
                  songs={songs}
                />
              } />
              <Route path="/song" element={
                <Song 
                // Contains the main content of the song page
                setCurrentSong={setCurrentSong}
                setIsPlaying={setIsPlaying}
                songs={songs}
                setSongs={setSongs}
                playlists={playlists}
                setPlaylists={setPlaylists}
                />
              } />
            </Routes>
          </div>
        </div>
        <MusicPlayer 
          // Contains the main content of the music player
          currentSong={currentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          playlist={currentPlaylist} 
          setCurrentSong={setCurrentSong}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;