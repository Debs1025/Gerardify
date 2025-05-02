//Fix and delete dapat nadedelete album sa playlist and home
//Dapat nakakaedit den kang title and pangaran 
//Dapat nakakaadd ng songs sa album
//Dapat nakakaedit ng songs sa album
//Dapat nakaka delete ng songs sa album

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/pages/Album.css';

function Album({ setCurrentSong, currentSong, setIsPlaying, playlists }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedArtist, setEditedArtist] = useState('');
  const [currentAlbum, setCurrentAlbum] = useState(null);

  // Find the current playlist/album using the id from URL params
  useEffect(() => {
    const foundAlbum = playlists.find(playlist => playlist.id === parseInt(id));
    if (foundAlbum) {
      setCurrentAlbum(foundAlbum);
      setEditedName(foundAlbum.name);
      setEditedArtist(foundAlbum.artist);
    }
  }, [id, playlists]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedName.trim() && editedArtist.trim()) {
      setCurrentAlbum({
        ...currentAlbum,
        name: editedName,
        artist: editedArtist
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    navigate('/library');
  };

  const handleSongClick = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  if (!currentAlbum) {
    return <div className="empty-message">Album not found</div>;
  }
  
  return (
    <div className="album-view">
      <div className="album-header">
        <div className="album-info-wrapper">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="edit-input"
                placeholder="Playlist name"
                autoFocus
              />
              <input
                type="text"
                value={editedArtist}
                onChange={(e) => setEditedArtist(e.target.value)}
                className="edit-input"
                placeholder="Artist name"
              />
              <div className="edit-buttons">
                <button className="save-btn" onClick={handleSaveEdit}>
                  <i className="bi bi-check2"></i>
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="album-title-container">
                <h1>{currentAlbum.name}</h1>
                <button className="edit-btn" onClick={handleEditClick}>
                  <i className="bi bi-pencil"></i>
                </button>
              </div>
              <p className="album-info">
                {currentAlbum.artist} • {currentAlbum.year}
              </p>
            </>
          )}
        </div>
        <button className="delete-btn" onClick={handleDelete}>
          <i className="bi bi-trash"></i>
        </button>
      </div>

      {showDeleteModal && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <h2>Delete Playlist</h2>
            <p>Are you sure you want to delete this playlist?</p>
            <div className="delete-modal-buttons">
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Yes
              </button>
              <button className="cancel-delete-btn" onClick={() => setShowDeleteModal(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="songs-section">
        <h2>Songs</h2>
        <div className="songs-content">
          {currentAlbum.songs.length === 0 ? (
            <p className="empty-message">No songs available</p>
          ) : (
            <div className="songs-list">
              {currentAlbum.songs.map((song, index) => (
                <div 
                  key={song.id} 
                  className={`song-item ${currentSong?.id === song.id ? 'playing' : ''}`}
                  onClick={() => handleSongClick(song)}
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

export default Album;