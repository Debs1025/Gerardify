import React from 'react';
import '../styles/components/MusicPlayer.css';

function MusicPlayer() {
  return (
    <div className="music-player">
      <div className="player-controls">
        <button className="control-button">
          <i className="bi bi-skip-start-fill"></i>
        </button>
        <button className="control-button play">
          <i className="bi bi-play-circle-fill"></i>
        </button>
        <button className="control-button">
          <i className="bi bi-skip-end-fill"></i>
        </button>
      </div>
    </div>
  );
}

export default MusicPlayer;