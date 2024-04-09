import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import CSS file for styling

function Navbar({ isLoggedIn, handleLogout }) {
    return (
        <nav>
            <ul className="navbar-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/event">Event</Link></li>
                <li><Link to="/rso">RSO</Link></li>
                {isLoggedIn && <li><button onClick={handleLogout}>Sign out</button></li>}
            </ul>
        </nav>
    );
}

export default Navbar;
