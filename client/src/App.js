import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes
import Login from './Login';
import Signup from './Signup';

function App() {
    return (
        <Router>
            <div>
                <Routes> {/* Use Routes instead of Switch */}
                    <Route path="/login" element={<Login />} /> {/* Specify the element prop */}
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
