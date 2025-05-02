import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Home.css';

function Home({ playlists }) {
  const navigate = useNavigate();

  const handlePlaylistClick = (playlist) => {
    navigate(`/album/${playlist.id}`);
  };

  return (
    <div className="home">
      <h1>Welcome to Gerardify</h1>
      <p>Your music streaming platform</p>

      {playlists.length > 0 && (
        <div className="your-playlists">
          <h2>Your Playlists</h2>
          <div className="playlists-grid">
            {playlists.map(playlist => (
              <div 
                key={playlist.id} 
                className="playlist-item"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="playlist-cover">
                  <i className="bi bi-music-note-list"></i>
                </div>
                <h3>{playlist.name}</h3>
                <p>{playlist.songs.length} songs</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;