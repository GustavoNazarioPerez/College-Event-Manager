import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import SuperSignup from './SuperSignup';
import RSO from "./components/RSO";
import Event from "./components/Event";
import Home from "./components/Home";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    // Check if the user is logged in (you can implement this logic based on your session)
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, []);

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/register" element={<SuperSignup />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/event" element={<Event />} />
                    <Route path="/rso" element={<RSO />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
