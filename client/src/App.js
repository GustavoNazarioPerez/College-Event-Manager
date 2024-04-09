import './App.css';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Update import
import Event from "./components/Event";
import RSO from "./components/RSO";
import {useState} from "react";
import LoginSignupModal from "./components/LoginSignupModal";
import Home from "./components/Home";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showModal, setShowModal] = useState(true); // Initially show the modal

    const handleLogin = () => {
        // Logic to handle successful login
        setIsLoggedIn(true);
        setShowModal(false); // Hide the modal after successful login
    };

    const handleLogout = () => {
        // Logic to handle logout
        setIsLoggedIn(false);
        setShowModal(true); // Show the modal when logging out
    };

    return (
        <Router>
            <div className="App">
                <h1>College Event Manager</h1>
                {!isLoggedIn && showModal && <LoginSignupModal onLogin={handleLogin} />}
                {isLoggedIn && (
                    <div>
                        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                        <Routes>
                            <Route path="/" element={<Home />} /> {/* Use element prop */}
                            <Route path="/event" element={<Event />} /> {/* Use element prop */}
                            <Route path="/rso" element={<RSO />} /> {/* Use element prop */}
                        </Routes>
                    </div>
                )}
            </div>
        </Router>
    );
}

export default App;
