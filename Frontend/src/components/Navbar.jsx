// Import link and use location from react-router-dom for navigation
import { Link, useLocation } from 'react-router-dom'
import '../styles/components/Navbar.css'

function Navbar() {
  // Get location from react-router-dom to determine the current path
  const location = useLocation()

  return (
    <nav className="sidebar">
      {/* Logo section with home link */}
      <Link to="/" className="logo">
        <img src="/src/assets/logo.png" alt="Gerardify" />
        <h1>Gerardify</h1>
      </Link>
      
      {/* Navigation links  */}
      <ul className="nav-links">
        {/* Home link */}
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <i className="bi bi-house-door"></i> 
            Home
          </Link>
        </li>
        {/* Library link */}
        <li className={location.pathname === '/library' ? 'active' : ''}>
          <Link to="/library">
            <i className="bi bi-music-note-list"></i> 
            Your Library
          </Link>
        </li>
      </ul>
    </nav>
  )
}

// Export the Navbar component to use in other parts of the application
export default Navbar