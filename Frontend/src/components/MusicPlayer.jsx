import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/MusicPlayer.css';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  
  const currentSong = {
    title: "Sailor Song",
    artist: "Gigi Perez",
    duration: "3:29",
    url: "./src/songs/sailor.mp3"
  };

  useEffect(() => {
    audioRef.current.src = currentSong.url;
  }, [currentSong]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-player">
      <div className="now-playing">
        {currentSong && (
          <>
            <div className="song-info">
              <span className="song-title">{currentSong.title}</span>
              <span className="song-artist">{currentSong.artist}</span>
            </div>
          </>
        )}
      </div>
      <div className="player-controls">
        <button className="control-button">
          <i className="bi bi-skip-start-fill"></i>
        </button>
        <button className="control-button play" onClick={togglePlay}>
          <i className={`bi ${isPlaying ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`}></i>
        </button>
        <button className="control-button">
          <i className="bi bi-skip-end-fill"></i>
        </button>
      </div>
    </div>
  );
}

export default MusicPlayer;