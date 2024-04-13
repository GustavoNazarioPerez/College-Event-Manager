import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import login.css file

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Function to map role to its corresponding integer value
    const getRoleId = (role) => {
        switch (role) {
            case 'student':
                return 0;
            case 'admin':
                return 1;
            case 'superadmin':
                return 2;
            default:
                return 0; // Default to student role
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const roleId = getRoleId(role); // Get the integer value for the role
            const response = await axios.post('http://localhost:3001/api/users/createUser', {
                email,
                domain: email.substring(email.indexOf('@')), // Extract domain from email including "@"
                name, // Blank name
                password,
                roleid: roleId // Send the integer role id to the backend
            });
            if (response.status === 200) {
                // Display success message and reset error message
                setSuccessMessage('Account was created! Please login via the login page');
                setErrorMessage('');
                // Clear form fields
                setName('');
                setEmail('');
                setPassword('');
                console.log(response);
            } else {
                // Display error message and reset success message
                setErrorMessage('Could not create user, make sure that your school has been added to the site');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error signing up:', error);
            // Display error message
            setErrorMessage('Could not create user, make sure that your school has been added to the site');
            setSuccessMessage('');
        }
    };

    return (
        <div className='modal-container'> {/* Apply class name for modal container */}
            <div className='modal'> {/* Apply class name for modal */}
                <h2>Sign Up</h2>
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Name</label>
                        <input
                            type="name"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
                <Link to="/login">Already have an account? Login</Link>
            </div>
        </div>
    );
}

export default Signup;
