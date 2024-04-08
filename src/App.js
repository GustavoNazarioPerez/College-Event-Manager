import './App.css';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Update import
import Event from "./components/Event";
import RSO from "./components/RSO";
import {useState} from "react";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        // Logic to handle successful login
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        // Logic to handle logout
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div className="App">
                <Navbar />
                <button onClick={handleLogout}>Sign out</button>
                <Routes> {/* Replace Switch with Routes */}
                    <Route path="/event" element={<Event />} /> {/* Use element prop */}
                    <Route path="/rso" element={<RSO />} /> {/* Use element prop */}
                </Routes>
                <h1>Welcome to the College Event Manager</h1>
            </div>
        </Router>
    );
}

export default App;
