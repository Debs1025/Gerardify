import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Library.css';

function Library({ setCurrentSong, playlists, setPlaylists, setCurrentPlaylist, setIsPlaying }) {  
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSongForm, setShowSongForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [songs, setSongs] = useState([]);
  const [newSongData, setNewSongData] = useState({
    title: '',
    artist: '',
    file: null,
    tempUrl: ''
  });

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewSongData({
        ...newSongData,
        file: file,
        tempUrl: url,
        title: file.name.replace(/\.[^/.]+$/, "")
      });
      setShowSongForm(true);
    }
  };

  const handleSongFormSubmit = async (e) => {
    e.preventDefault();
    if (!newSongData.file || !newSongData.title.trim() || !newSongData.artist.trim()) return;

    const audio = new Audio(newSongData.tempUrl);
    
    await new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        const duration = Math.floor(audio.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const newSong = {
          id: Date.now() + Math.random(),
          title: newSongData.title,
          artist: newSongData.artist,
          duration: formattedDuration,
          url: newSongData.tempUrl
        };

        setSongs(prevSongs => {
          const updatedSongs = [...prevSongs, newSong];
          setCurrentPlaylist(updatedSongs);
          return updatedSongs;
        });

        resolve();
      });
    });

    // Reset form
    setNewSongData({
      title: '',
      artist: '',
      file: null,
      tempUrl: ''
    });
    setShowSongForm(false);
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/album/${playlist.id}`);
  };

  const handleSongClick = (song) => {
    navigate('/song', { state: { song } });
  };

  const handlePlayClick = (e, song) => {
    e.stopPropagation(); 
    setCurrentSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      url: song.url
    });
    setCurrentPlaylist(songs);
    setIsPlaying(true);
  };
  
  return (
    <div className="library">
      <div className="library-header">
        <h1>Your Library</h1>
        <div className="header-buttons">
          <button 
            className="create-playlist-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
          <label className="upload-btn">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <i className="bi bi-upload"></i>
          </label>
        </div>
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

      {showSongForm && (
        <div className="create-song-form">
          <form onSubmit={handleSongFormSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={newSongData.title}
                onChange={(e) => setNewSongData({...newSongData, title: e.target.value})}
                placeholder="Enter song title"
                required
              />
            </div>
            <div className="form-group">
              <label>Artist:</label>
              <input
                type="text"
                value={newSongData.artist}
                onChange={(e) => setNewSongData({...newSongData, artist: e.target.value})}
                placeholder="Enter artist name"
                required
              />
            </div>
            <div className="form-group">
              <label>Selected File:</label>
              <div className="selected-file">{newSongData.file?.name}</div>
            </div>
            <div className="form-buttons">
              <button type="submit">Add Song</button>
              <button 
                type="button" 
                onClick={() => {
                  setShowSongForm(false);
                  setNewSongData({
                    title: '',
                    artist: '',
                    file: null,
                    tempUrl: ''
                  });
                }}
              >
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
            <div className="empty-message">
              <p>No songs available</p>
              <label className="upload-btn-large">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <i className="bi bi-cloud-upload"></i>
                <span>Upload Songs</span>
              </label>
            </div>
          ) : (
            <div className="songs-list">
              {songs.map((song, index) => (
                <div 
                  className="song-item" 
                  key={song.id} 
                  onClick={() => handleSongClick(song)}
                >
                  <div className="song-number-container">
                    <span className="song-number">{index + 1}</span>
                    <button 
                      className="play-hover-button"
                      onClick={(e) => handlePlayClick(e, song)}
                    >
                      <i className="bi bi-play-fill"></i>
                    </button>
                  </div>
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