import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Library.css';

function Library({ setCurrentSong, currentSong, playlists, setPlaylists, setCurrentPlaylist, setIsPlaying, songs, setSongs }) {
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false); // state for creating an album/playlist
  const [showSongForm, setShowSongForm] = useState(false);     // state for showing the data form for a new song
  const [newPlaylistName, setNewPlaylistName] = useState('');  // state for new playlist/album name
  const [newSongData, setNewSongData] = useState({             // state for new song data
    title: '',
    artist: '',
    file: null,
    tempUrl: ''
  });

  // For creating a new playlist/album
  const handleCreatePlaylist = (e) => { 
    e.preventDefault();
    // .trim to avoid empty names
    if (newPlaylistName.trim()) {
      // Sets the new playlist with a unique ID and default values
      setPlaylists([...playlists, { 
        id: Date.now(), 
        name: newPlaylistName,
        artist: 'Your Playlist',
        year: new Date().getFullYear(),
        songs: []
      }]);
      setNewPlaylistName('');
      setShowCreateForm(false);  // Close the form after creating a playlist
    }
  };

  // For selecting a file to upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // Store selected file and generate temp URL for preview
      setNewSongData({
        ...newSongData,
        file: file,
        tempUrl: url,
        title: file.name.replace(/\.[^/.]+$/, "") // Set default title from filename
      });
      setShowSongForm(true); 
    }
  };

  // For submitting the song
  const handleSongFormSubmit = async (e) => {
    e.preventDefault();
    if (!newSongData.file || !newSongData.title.trim() || !newSongData.artist.trim()) return;
  
    // Checks for duplicated song 
    const isDuplicate = songs.some(
      song => song.title.toLowerCase() === newSongData.title.toLowerCase() && 
              song.artist.toLowerCase() === newSongData.artist.toLowerCase()
    );
  
    if (isDuplicate) {
      alert('This song already exists in your library!');
      return;
    }
    
    // for getting the duration of the song
    const audio = new Audio(newSongData.tempUrl);
    
    // Wait for metadata to load so we can get duration
    await new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        const duration = Math.floor(audio.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
        // Create new song object
        const newSong = {
          id: Date.now() + Math.random(),
          title: newSongData.title,
          artist: newSongData.artist,
          duration: formattedDuration,
          url: newSongData.tempUrl
        };
  
        // Add new song to library and current playlist
        setSongs(prevSongs => [...prevSongs, newSong]);
        setCurrentPlaylist([...songs, newSong]);
        resolve();
      });
    });
  
    // Reset song form after adding for other new songs
    setNewSongData({
      title: '',
      artist: '',
      file: null,
      tempUrl: ''
    });
    setShowSongForm(false);
  };

  // Go to the playlist/album page
  const handlePlaylistClick = (playlist) => {
    navigate(`/album/${playlist.id}`);
  };

  // Navigate to song detail page
  const handleSongClick = (song) => {
    navigate('/song', { state: { song } });
  };

  // Play selected song 
  const handlePlayClick = (e, song) => {
    e.stopPropagation(); // Prevents opening the song detail page when clicking play button
    setCurrentSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      url: song.url
    });
    setCurrentPlaylist(songs); // Set full song list as current playlist
    setIsPlaying(true);
  };
  
  return (
    <div className="library-container">
      <div className="library-header">
        <h1>Your Library</h1>
        <div className="library-header-buttons">
          {/* Button to show create playlist  */}
          <button 
            className="library-create-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
          {/* Upload song */}
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

      {/* Create playlist form */}
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

      {/* Form for adding the song */}
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

      {/* Display playlists */}
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

      {/* Display all songs */}
      <div className="library-songs-section">
        <h2>All Songs</h2>
        <div className="library-songs-content">
          {songs.length === 0 ? (
            // If no songs are available
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
            // If songs are available
            <div className="library-songs-list">
              {songs.map((song, index) => (
                <div 
                  className={`library-song-item ${currentSong?.id === song.id ? 'playing' : ''}`}
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
