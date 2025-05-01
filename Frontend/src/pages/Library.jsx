import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Library.css';

function Library({ setCurrentSong }) { 
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

  const handleSongClick = (song) => {
    console.log('Song clicked:', song);
    setCurrentSong({
      title: song.title,
      artist: song.artist,
      url: song.url
    });
  };


  const songs = [
    {
      id: 1,
      title: "Sailor Song",
      artist: "Gigi Perez",
      duration: "3:29",
      url: "/songs/sailor.mp3"
    },
    {
      id: 2,
      title: "The Days",
      artist: "Chrystal, Notion",
      duration: "3:53",
      url: "./songs/days.mp3"
    },
    {
      id: 3,
      title: "End of Beginning",
      artist: "Djo",
      duration: "2:39",
      url: "./songs/end.mp3"
    },
    {
      id: 4,
      title: "Escapism",
      artist: "Raye, 070 Shake",
      duration: "4:32",
      url: "./songs/escapism.mp3"
    },
    {
      id: 5,
      title: "Feel It",
      artist: "d4vd",
      duration: "2:58",
      url: "./songs/feel.mp3"
    },
    {
      id: 6,
      title: "Lady Killers II",
      artist: "G-Eazy, Christoph Anderson",
      duration: "4:57",
      url: "./songs/lady.mp3"
    },
    {
      id: 7,
      title: "Multo",
      artist: "Cup of Joe",
      duration: "3:58",
      url: "./songs/multo.mp3"
    },
    {
      id: 8,
      title: "Night Like This",
      artist: "The Kid LARIO",
      duration: "1:27",
      url: "./songs/night.mp3"
    },
    {
      id: 9,
      title: "Sino",
      artist: "Unique Salonga",
      duration: "4:40",
      url: "./songs/sino.mp3"
    },
    {
      id: 10,
      title: "Young and Beautiful",
      artist: "Lana Del Rey",
      duration: "3:56",
      url: "./songs/young.mp3"
    }
  ];
  
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

      <div className="songs-section">
        <h2>All Songs</h2>
        <div className="songs-content">
          {songs.length === 0 ? (
            <p className="empty-message">No songs available</p>
          ) : (
            <div className="songs-list">
              {songs.map((song, index) => (
                  <div className="song-item" 
                    key={song.id} 
                    onClick={() => handleSongClick(song)}
                    style={{ cursor: 'pointer' }}
                  >
                  <span className="song-number">{index + 1}</span>
                  <div className="song-info">
                    <span className="song-title">{song.title}</span>
                    <span className="song-artist">{song.artist}</span>
                  </div>
                  <span className="song-duration">{song.duration}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Library;