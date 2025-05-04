import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/pages/Song.css';

function Song({ setCurrentSong, setIsPlaying, songs, setSongs, setPlaylists }) {
  const location = useLocation(); // For getting the song passed from the library
  const navigate = useNavigate(); // For navigation when clicking buttons
  const song = location.state?.song; // Retrieve the song from the location defined or undefined

  const [isEditing, setIsEditing] = useState(false); // For toggling edit mode
  const [editedSong, setEditedSong] = useState(song || {}); // Holds the song details for editing
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // For showing delete confirmation 

  // Function to play the selected song
  const handlePlay = () => {
    if (song) {
      setCurrentSong(song); // Se the current song as the selected song
      setIsPlaying(true);   // Start playing
    }
  };

  // For editing the song details
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Save edited song details to library and playlists
  const handleSave = () => {
    // Update song in main library
    setSongs(prevSongs => {
      const updatedSongs = prevSongs.map(s => 
        s.id === song.id 
          ? { ...s, title: editedSong.title, artist: editedSong.artist } // Update title/artist if IDs match
          : s
      );
      // Reflect changes in the `song` object used by the component
      song.title = editedSong.title;
      song.artist = editedSong.artist;
      return updatedSongs;
    });

    // Updates playlists to reflect the edited song
    setPlaylists(prevPlaylists => {
      return prevPlaylists.map(playlist => {
        const hasSong = playlist.songs.some(s => s.id === song.id);
        if (hasSong) {
          return {
            ...playlist,
            songs: playlist.songs.map(s => 
              s.id === song.id 
                ? { ...s, title: editedSong.title, artist: editedSong.artist }
                : s
            )
          };
        }
        return playlist;
      });
    });

    setIsEditing(false); // Exit editing mode
    navigate('/song', { state: { song } }); // Refresh the page with updated song state
  };

  // For deleting the song
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  // Confirm delete of the song
  const confirmDelete = () => {
    const updatedSongs = songs.filter(s => s.id !== song.id); // Filter out the song
    localStorage.setItem('songs', JSON.stringify(updatedSongs)); // Updates local storage
    setSongs(updatedSongs); // Update the songs state
    navigate('/library'); // Go back to library page
  };

  // Cancel delete 
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // If no song was passed, show a message
  if (!song) return <div>No song selected</div>;

  return (
    <div className="song-details">
      <div className="song-header">
        <div className="song-cover">
          <i className="bi bi-music-note"></i> {/* Placeholder for song cover */}
        </div>
        <div className="song-info">
          {isEditing ? (
            // Edit mode
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
            // Display mode
            <>
              <h1>{song.title}</h1>
              <p className="artist">{song.artist}</p>
              <div className="song-meta">
                <span className="duration">
                  <i className="bi bi-clock"></i> {song.duration}
                </span>
              </div>
              <div className="song-actions">
                {/* Buttons for play, edit, delete */}
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

      {/* Delete confirmation dialog */}
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
