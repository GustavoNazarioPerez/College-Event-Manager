// Home.js
import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        // Get userId from localStorage
        const userId = localStorage.getItem('userId');
        // Log userId to console
        console.log('User ID:', userId);
    }, []); // Run this effect only once after the component mounts

    const handleSignOut = () => {
        // Clear userId from localStorage
        localStorage.removeItem('userId');
        // Redirect to login page
        navigate('/login');
    };

    return (
        <div>
            <h2>Home Page</h2>
            <div>
                <Navbar />
                {/* Sign-out button */}
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
            <p>Welcome to the Home page!</p>
        </div>
    );
}

export default Home;
