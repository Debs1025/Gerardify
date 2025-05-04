import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Home.css';

function Home({ playlists }) {
  const navigate = useNavigate(); // Initialize navigation function

  // When a playlist is clicked, navigate to the album page
  const handlePlaylistClick = (playlist) => {
    navigate(`/album/${playlist.id}`);
  };

  return (
    <div className="home">
      {/* Page title */}
      <h1>Welcome to Gerardify</h1>
      <p>Your music streaming platform</p>

      {/* Show Playlist if theres any */}
      {playlists.length > 0 && (
        <div className="your-playlists">
          <h2>Your Playlists</h2>
          <div className="playlists-grid">
            {/* Map each playlist/album if theres any */}
            {playlists.map(playlist => (
              <div 
                key={playlist.id} // Unique key for each album
                className="playlist-item"
                onClick={() => handlePlaylistClick(playlist)} // Go to album page when clicked
              >
                {/* Playlist icon */}
                <div className="playlist-cover">
                  <i className="bi bi-music-note-list"></i>
                </div>
                {/* Playlist name */}
                <h3>{playlist.name}</h3>
                {/* Number of songs in the playlist */}
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
