import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import darkIcon from './assets/dark.svg'; // Path to dark mode icon
import lightIcon from './assets/light.svg'; // Path to light mode icon
import logo from './assets/logo.svg'; // Path to the logo SVG
import './Logo.css'; // Import the updated logo CSS

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(userInfo => {
        setUserInfo(userInfo);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        setLoading(false);
      });
  }, [setUserInfo]);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    })
      .then(() => setUserInfo(null))
      .catch(error => console.error('Error logging out:', error));
  }

  const username = userInfo?.username;

  // Toggle between dark and light mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  if (loading) {
    return <header className="header">Loading...</header>;
  }

  return (
    <header className="header">
      <div className="logo-container">
        <span className="logo-icon">
          <img src={logo} alt="Logo" /> {/* Correct path to the logo SVG */}
        </span>
        <Link to="/" className="logo">Innovation Blog</Link>
      </div>
      <nav className="nav-links">
        <button 
          onClick={toggleDarkMode} 
          className="mode-toggle" 
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <img
            src={darkMode ? lightIcon : darkIcon}
            alt={darkMode ? 'Light Mode' : 'Dark Mode'}
            className="mode-icon"
          />
        </button>
        {username ? (
          <>
            <Link to="/create" className="nav-item">Create New Post</Link>
            <a onClick={logout} className="nav-item logout-btn">Logout ({username})</a>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/register" className="nav-item register-btn">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
