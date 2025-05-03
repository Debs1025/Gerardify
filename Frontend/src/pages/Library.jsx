//nawara si like pag nag upload ka ning music tas nag upload ka ulit ning same file dpat dae pwede

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Library.css';

function Library({ setCurrentSong, playlists, setPlaylists, setCurrentPlaylist, setIsPlaying, songs, setSongs }) {  
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSongForm, setShowSongForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
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

        setSongs(prevSongs => [...prevSongs, newSong]);
        setCurrentPlaylist([...songs, newSong]);
        resolve();
      });
    });

    // Reset the song to add new song
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
    <div className="library-container">
      <div className="library-header">
        <h1>Your Library</h1>
        <div className="library-header-buttons">
          <button 
            className="library-create-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
          <label className="library-upload-btn">
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
        <div className="library-form">
          <form onSubmit={handleCreatePlaylist}>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              autoFocus
            />
            <div className="library-form-buttons">
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showSongForm && (
        <div className="library-form">
          <form onSubmit={handleSongFormSubmit}>
            <div className="library-form-group">
              <label>Title:</label>
              <input
                type="text"
                value={newSongData.title}
                onChange={(e) => setNewSongData({...newSongData, title: e.target.value})}
                placeholder="Enter song title"
                required
              />
            </div>
            <div className="library-form-group">
              <label>Artist:</label>
              <input
                type="text"
                value={newSongData.artist}
                onChange={(e) => setNewSongData({...newSongData, artist: e.target.value})}
                placeholder="Enter artist name"
                required
              />
            </div>
            <div className="library-form-group">
              <label>Selected File:</label>
              <div className="library-selected-file">{newSongData.file?.name}</div>
            </div>
            <div className="library-form-buttons">
              <button type="submit">Add Song</button>
              <button type="button" onClick={() => {
                setShowSongForm(false);
                setNewSongData({
                  title: '',
                  artist: '',
                  file: null,
                  tempUrl: ''
                });
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="library-playlists-grid">
        {playlists.map(playlist => (
          <div 
            key={playlist.id} 
            className="library-playlist-item"
            onClick={() => handlePlaylistClick(playlist)}
          >
            <h3>{playlist.name}</h3>
            <p>{playlist.songs.length} songs</p>
          </div>
        ))}
      </div>

      <div className="library-songs-section">
        <h2>All Songs</h2>
        <div className="library-songs-content">
          {songs.length === 0 ? (
            <div className="library-empty-message">
              <p>No songs available</p>
              <label className="library-upload-btn-large">
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
            <div className="library-songs-list">
              {songs.map((song, index) => (
                <div 
                  className="library-song-item" 
                  key={song.id} 
                  onClick={() => handleSongClick(song)}
                >
                  <div className="library-song-number-container">
                    <span className="library-song-number">{index + 1}</span>
                    <button 
                      className="library-play-button"
                      onClick={(e) => handlePlayClick(e, song)}
                    >
                      <i className="bi bi-play-fill"></i>
                    </button>
                  </div>
                  <div className="library-song-info">
                    <span className="library-song-title">{song.title}</span>
                    <span className="library-song-artist">{song.artist}</span>
                  </div>
                  <span className="library-song-duration">{song.duration}</span>
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