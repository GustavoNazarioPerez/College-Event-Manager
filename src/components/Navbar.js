import React from 'react';
import './Navbar.css';
import {Link} from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/event">Event</Link></li>
                <li><Link to="/rso">RSO</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;