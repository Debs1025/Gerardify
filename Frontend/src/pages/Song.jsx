import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/pages/Song.css';

function Song({ setCurrentSong, setIsPlaying, songs, setSongs }) {
  const location = useLocation();
  const navigate = useNavigate();
  const song = location.state?.song;
  const [isEditing, setIsEditing] = useState(false);
  const [editedSong, setEditedSong] = useState(song || {});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePlay = () => {
    if (song) {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setSongs(prevSongs => {
      const updatedSongs = prevSongs.map(s => 
        s.id === song.id 
          ? { ...s, title: editedSong.title, artist: editedSong.artist }
          : s
      );
      song.title = editedSong.title;
      song.artist = editedSong.artist;
      return updatedSongs;
    });
    setIsEditing(false);
    navigate('/song', { state: { song } });
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const updatedSongs = songs.filter(s => s.id !== song.id);
    localStorage.setItem('songs', JSON.stringify(updatedSongs));
    setSongs(updatedSongs);
    navigate('/library');
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (!song) return <div>No song selected</div>;

  return (
    <div className="song-details">
      <div className="song-header">
        <div className="song-cover">
          <i className="bi bi-music-note"></i>
        </div>
        <div className="song-info">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editedSong.title}
                onChange={(e) => setEditedSong({...editedSong, title: e.target.value})}
                placeholder="Song title"
              />
              <input
                type="text"
                value={editedSong.artist}
                onChange={(e) => setEditedSong({...editedSong, artist: e.target.value})}
                placeholder="Artist name"
              />
              <div className="edit-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1>{song.title}</h1>
              <p className="artist">{song.artist}</p>
              <div className="song-meta">
                <span className="duration">
                  <i className="bi bi-clock"></i> {song.duration}
                </span>
              </div>
              <div className="song-actions">
                <button className="play-button" onClick={handlePlay}>
                  <i className="bi bi-play-fill"></i> Play
                </button>
                <button className="edit-button" onClick={handleEdit}>
                  <i className="bi bi-pencil"></i> Edit
                </button>
                <button className="delete-button" onClick={handleDelete}>
                  <i className="bi bi-trash"></i> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation">
            <h3>Delete Song</h3>
            <p>Are you sure you want to delete "{song.title}"?</p>
            <div className="confirmation-buttons">
              <button className="confirm-delete" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="cancel-delete" onClick={cancelDelete}>
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Song;