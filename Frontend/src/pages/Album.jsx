// Import useState and useEffect from React
// Import useParams and useNavigate from react-router-dom
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/pages/Album.css'; 

// album function to display the album details and songs
function Album({ setCurrentSong, currentSong, setIsPlaying, playlists, setPlaylists, songs }) {
  
  // URL parameter for album ID and navigate function for navigation
  const { id } = useParams();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);   // Controls delete confirm
  const [isEditing, setIsEditing] = useState(false);               // Controls edit mode
  const [editedName, setEditedName] = useState('');                // Stores edited album name
  const [editedArtist, setEditedArtist] = useState('');            //  State for edited artist
  const [currentAlbum, setCurrentAlbum] = useState(null);          // Stores current album data
  const [availableSongs, setAvailableSongs] = useState([]);        // Stores songs that can be added
  const [showAddSongs, setShowAddSongs] = useState(false);         //  Controls add songs modal
  const [currentIndex, setCurrentIndex] = useState(0);             //  Handles current song playing in album
  
  // Set the current album based on the ID 
  useEffect(() => {
    const foundAlbum = playlists.find(playlist => playlist.id === parseInt(id));
    if (foundAlbum) {
      setCurrentAlbum(foundAlbum);
      setEditedName(foundAlbum.name);
      setEditedArtist(foundAlbum.artist);
    }
  }, [id, playlists]);

  // Show available songs to add to the current album
  useEffect(() => {
    if (songs && currentAlbum) {
      const albumSongIds = currentAlbum.songs.map(song => song.id);
      const filtered = songs.filter(song => !albumSongIds.includes(song.id));
      setAvailableSongs(filtered);
    }
  }, [songs, currentAlbum]);

  // Plays the songs only inside the album
  useEffect(() => {
  if (currentSong && currentAlbum) {
    // Only play the song that belongs to the album 
    if (currentSong.albumId === currentAlbum.id) {
      const songIndex = currentAlbum.songs.findIndex(song => song.id === currentSong.id);
      if (songIndex === -1) {
        setIsPlaying(false);
        setCurrentSong(null);
      } else {
        setCurrentIndex(songIndex);
        setIsPlaying(true);
      }
    }
  }
}, [currentSong, currentAlbum]);

  // Makes sure that it will change the song that can be played
  // When the album is changed or leaves the album
  useEffect(() => {
    return () => {
      if (currentSong?.albumId === parseInt(id)) {
      }
    };
  }, [id, currentSong]);
  
  // Handle editing the album name and artist
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle saving the edited album name and artist
  const handleSaveEdit = () => {
    if (editedName.trim() && editedArtist.trim()) {
      setPlaylists(prevPlaylists => {
        return prevPlaylists.map(playlist => {
          if (playlist.id === parseInt(id)) {
            return {
              ...playlist,
              name: editedName,
              artist: editedArtist
            };
          }
          return playlist;
        });
      });
      // Update the current album state
      setCurrentAlbum({
        ...currentAlbum,
        name: editedName,
        artist: editedArtist
      });
      setIsEditing(false);
    }
  };

  // Handle deleting the album
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  // Confirm delete of the album
  const confirmDelete = () => {
    setPlaylists(prevPlaylists => 
      prevPlaylists.filter(playlist => playlist.id !== parseInt(id))
    );
    navigate('/library');
  };

  // Handle song click to play the song
  const handleSongClick = (song) => {
    if (currentAlbum.songs.includes(song)) {
      const songIndex = currentAlbum.songs.findIndex(s => s.id === song.id);
      setCurrentIndex(songIndex);
      // Makes sure to play only song from the same album
      setCurrentSong({
        ...song, 
        albumId: currentAlbum.id,
        playlist: currentAlbum.songs 
      });
      setIsPlaying(true);
    }
  };

  // Add song to the current album
  // Check if the song is already in the album before adding it
  const handleAddSong = (songToAdd) => {
    setPlaylists(prevPlaylists => {
      return prevPlaylists.map(playlist => {
        // Checks if the playlist ID matches the current album ID
        if (playlist.id === parseInt(id)) {
          if (!playlist.songs.some(song => song.id === songToAdd.id)) {
            const updatedPlaylist = {
              ...playlist,
              songs: [...playlist.songs, songToAdd]
            };
            setCurrentAlbum(updatedPlaylist);
            return updatedPlaylist;
          }
        }
        return playlist;
      });
    });
    setShowAddSongs(false);
  };

  // Remove song from the current album
  const handleRemoveSong = (songId, e) => {
    e.stopPropagation();
    setPlaylists(prevPlaylists => {
      return prevPlaylists.map(playlist => {
        // Check if the playlist ID matches the current album ID
        if (playlist.id === parseInt(id)) {
          const updatedPlaylist = {
            ...playlist,
            songs: playlist.songs.filter(song => song.id !== songId)
          };
          setCurrentAlbum(updatedPlaylist);
          return updatedPlaylist;
        }
        return playlist;
      });
    });
  };

  // Check if the album exists
  if (!currentAlbum) {
    return <div className="empty-message">Album not found</div>;
  }

  return (
    <div className="album-view"> {/* Main container for the album view */}
      <div className="album-header"> {/* Header section with album details and actions */}
        <div className="album-info-wrapper"> 
          {isEditing ? (
            <div className="edit-form"> {/* Form for editing album name and artist */}
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
              <div className="edit-buttons"> {/* Buttons to save or cancel edit */}
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
              <div className="album-title-container"> {/* Displays album title and edit button */}
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
        <button className="delete-btn" onClick={handleDelete}> {/* Delete album button */}
          <i className="bi bi-trash"></i>
        </button>
      </div>
  
      {showDeleteModal && (
        <div className="delete-modal"> {/* Delete Confirm*/}
          <div className="delete-modal-content"> {/* Content box inside the delete */}
            <h2>Delete Playlist</h2>
            <p>Are you sure you want to delete this playlist?</p>
            <div className="delete-modal-buttons"> {/* Buttons for confirming or not */}
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
  
      <div className="songs-section"> {/* Section containing songs list */}
        <div className="songs-header"> {/* Header for songs section with Add Songs button */}
          <h2>Songs</h2>
          <button className="add-songs-btn" onClick={() => setShowAddSongs(true)}>
            <i className="bi bi-plus-lg"></i> Add Songs
          </button>
        </div>
  
        {showAddSongs && (
          <div className="add-songs-modal"> {/* shows the add song */}
            <div className="modal-content"> {/* Content box */}
              <div className="modal-header"> {/* Header */}
                <h3>Add Songs to {currentAlbum.name}</h3>
                <button className="close-modal-btn" onClick={() => setShowAddSongs(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="available-songs"> {/* List of available songs to add */}
                {availableSongs.length === 0 ? (
                  <p className="empty-message">No songs available to add</p>
                ) : (
                  availableSongs.map(song => (
                    <div key={song.id} className="available-song-item"> {/*available songs*/}
                      <div className="song-info"> {/* Song info inside available song */}
                        <span className="song-title">{song.title}</span>
                        <span className="song-artist">{song.artist}</span>
                      </div>
                      <button 
                        className="add-song-btn"
                        onClick={() => handleAddSong(song)}
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
  
        <div className="songs-content"> {/* Container for songs list */}
          {currentAlbum.songs.length === 0 ? (
            <p className="empty-message">No songs available</p>
          ) : (
            <div className="songs-list"> {/* List of songs inside the album */}
              {currentAlbum.songs.map((song, index) => (
                <div 
                  key={song.id} 
                  className={`song-item ${currentSong?.id === song.id ? 'playing' : ''}`}
                > {/* Individual song item, highlights if currently playing */}
                  <div className="song-item-content" onClick={() => handleSongClick(song)}> {/* Clickable song content */}
                    <span className="song-number">{index + 1}</span>
                    <div className="song-info"> {/* Song title and artist */}
                      <span className="song-title">{song.title}</span>
                      <span className="song-artist">{song.artist}</span>
                    </div>
                    <span className="song-duration">{song.duration}</span>
                  </div>
                  <button 
                    className="remove-song-btn"
                    onClick={(e) => handleRemoveSong(song.id, e)}
                  > {/* Remove song button */}
                    <i className="bi bi-x"></i>
                  </button>
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