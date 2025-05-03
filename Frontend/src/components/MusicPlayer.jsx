import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/MusicPlayer.css';

function MusicPlayer({ currentSong, isPlaying, setIsPlaying, playlist, setCurrentSong }) {
  const audioRef = useRef(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Manage Progress Bar and Time
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Skip to next song when current song ends
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      handleSkipForward(); 
    };
  
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentSong]); 

  // Previous and Next Song 
  const handleSkipForward = () => {
    const songPlaylist = currentSong?.playlist || playlist;
    
    if (!songPlaylist?.length || !currentSong) return;
    
    const currentIndex = songPlaylist.findIndex(song => song.id === currentSong.id);
    if (currentIndex > -1) {
      const nextIndex = (currentIndex + 1) % songPlaylist.length;
      const nextSong = songPlaylist[nextIndex];
      // Make sures to play only songs from the same album if the song is played from an album
      setCurrentSong({
        ...nextSong,
        albumId: currentSong.albumId, 
        playlist: songPlaylist 
      });
      setIsPlaying(true);
    }
  };
  
  const handleSkipBackward = () => {
    const songPlaylist = currentSong?.playlist || playlist;
    
    if (!songPlaylist?.length || !currentSong) return;
    
    const currentIndex = songPlaylist.findIndex(song => song.id === currentSong.id);
    if (currentIndex > -1) {
      const prevIndex = (currentIndex - 1 + songPlaylist.length) % songPlaylist.length;
      const prevSong = songPlaylist[prevIndex];
      // Make sures to play only songs from the same album if the song is played from an album
      setCurrentSong({
        ...prevSong,
        albumId: currentSong.albumId, 
        playlist: songPlaylist 
      });
      setIsPlaying(true);
    }
  };

  // Time Format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  // Play Audio and Display Song
  useEffect(() => {
    if (currentSong) {
      console.log('Loading song:', currentSong); 
      audioRef.current.src = currentSong.url;
      setIsPlaying(true);
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  }, [currentSong]); 

  useEffect(() => {
    if (currentSong) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  // Volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      audioRef.current.volume = prevVolume;
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div className="music-player">
      {/* Left section */}
      <div className="left-section">
        {currentSong ? (
          <div className="song-info">
            <span className="song-title">{currentSong.title}</span>
            <span className="song-artist">{currentSong.artist}</span>
          </div>
        ) : (
          <div className="song-info">
            <span className="song-title">No song playing</span>
          </div>
        )}
      </div>
  
      {/* Middle section */}
      <div className="middle-section">
        <div className="player-controls">
          <button className="control-button" onClick={handleSkipBackward}>
            <i className="bi bi-skip-start-fill"></i>
          </button>
          <button className="control-button play" onClick={togglePlay}>
            <i className={`bi ${isPlaying ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`}></i>
          </button>
          <button className="control-button" onClick={handleSkipForward}>
            <i className="bi bi-skip-end-fill"></i>
          </button>
        </div>
        <div className="progress-wrapper">
          <div className="time-info">
            <span>{formatTime(currentTime)}</span>
            <span> / </span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100 || 0}
            onChange={handleProgressChange}
            className="progress-bar"
          />
        </div>
      </div>
  
        {/* Right section - Volume Controls */}
        <div className="right-section">
          <div className="volume-controls">
            <button className="control-button" onClick={toggleMute}>
              <i className={`bi ${volume === 0 ? 'bi-volume-mute-fill' : 
                volume < 0.3 ? 'bi-volume-off-fill' :
                volume < 0.7 ? 'bi-volume-down-fill' : 
                'bi-volume-up-fill'}`}>
              </i>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
        </div>
    </div>  
</div>
  );
}

export default MusicPlayer;