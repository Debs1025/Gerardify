import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Library.css';

function Library() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      setPlaylists([...playlists, { 
        id: Date.now(), 
        name: newPlaylistName,
        artist: 'Your Playlist',
        year: new Date().getFullYear(),
        songs: []
      }]);
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/album/${playlist.id}`);
  };

  const handleDeletePlaylist = (id) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== parseInt(id)));
  };
  
  return (
    <div className="library">
      <div className="library-header">
        <h1>Your Library</h1>
        <button 
          className="create-playlist-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>

      {showCreateForm && (
        <div className="create-playlist-form">
          <form onSubmit={handleCreatePlaylist}>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              autoFocus
            />
            <div className="form-buttons">
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="playlists">
        {playlists.map(playlist => (
          <div 
            key={playlist.id} 
            className="playlist-item"
            onClick={() => handlePlaylistClick(playlist)}
          >
            <h3>{playlist.name}</h3>
            <p>{playlist.songs.length} songs</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;