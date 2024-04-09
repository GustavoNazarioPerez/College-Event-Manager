import React, { useState } from 'react';
import './LoginSignupModal.css'; // Import CSS file for styling

function LoginSignupModal({ onLogin, onSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role to 'student'
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Default to login mode

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('Invalid email address');
            return;
        }
        // Perform login or signup based on mode
        if (isLogin) {
            onLogin(email, password);
        } else {
            onSignup(email, password, role);
        }
    };

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    return (
        <div className="modal-container"> {/* Container for centering */}
            <div className="modal">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group"> {/* Container for username and password */}
                        <label>
                            Email:
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>
                            Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                    </div>
                    {!isLogin && (
                        <div className="role-selection">
                            <label>
                                Role:
                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </label>
                        </div>
                    )}
                    <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
                </form>
                {error && <p className="error">{error}</p>}
                <p>{isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign Up' : 'Login'}</button>
                </p>
            </div>
        </div>
    );
}

export default LoginSignupModal;
