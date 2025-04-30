import React from 'react';
import '../styles/pages/Library.css';

function Library() {
  return (
    <div className="library">
      <h1>Your Library</h1>
      <div className="playlists">
        {/*Digdi ang mga kanta*/}
        <p>Create your own playlists</p>
      </div>
    </div>
  );
}

export default Library;