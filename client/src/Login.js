import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/users/authenticateUser', {
                email,
                password
            });

            console.log(response);
            // Check the response data to determine if the login attempt was successful
            if (response.status === 200) {
                // Redirect to dashboard or home page after successful login
                window.location.href = '/';
            } else {
                // Handle login error
                console.error('Login failed');
                setErrorMessage('Invalid email or password');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('An error occurred while logging in');
            setSuccessMessage('');
        }
    };

    return (
        <div className='modal-container'> {/* Apply class name for modal container */}
            <div className='modal'> {/* Apply class name for modal */}
                <h2>Login</h2>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <Link to="/signup">Don't have an account? Sign Up</Link>
            </div>
        </div>
    );
}

export default Login;