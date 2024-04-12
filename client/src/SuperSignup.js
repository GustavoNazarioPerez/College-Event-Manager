import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import login.css file

function SuperSignup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [location, setLocation] = useState('');
    const [numStudents, setNumStudents] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const roleId = 2;


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create School
            const schoolResponse = await axios.post('http://localhost:3001/api/schools/createSchool', {
                domain: email.substring(email.indexOf('@')),
                schoolName,
                location,
                numStudents,
                super_id: null
            });
            if (schoolResponse.status === 200) {
                console.log(schoolResponse);
            } else {
                // Display error message and reset success message
                setErrorMessage('Could not create school');
                setSuccessMessage('');
            }

            // Create superadmin account
            const accountResponse = await axios.post('http://localhost:3001/api/users/createUser', {
                email,
                domain: email.substring(email.indexOf('@')), // Extract domain from email including "@"
                name, 
                password,
                roleid: roleId // Superadmin id of 2
            });
            if (accountResponse.status === 200) {
                // Clear form fields
                setName('');
                setEmail('');
                setPassword('');
                console.log(accountResponse);
            } else {
                // Display error message and reset success message
                setErrorMessage('Could not create user, make sure that your school has been added to the site');
                setSuccessMessage('');
            }

            const new_id = accountResponse.data.user_id;
            const domain = email.substring(email.indexOf('@'));

            // Set schools super id to the new account user id
            const superResponse = await axios.patch(`http://localhost:3001/api/schools/setSuper/${domain}`, {
                super_id: new_id
            });
            if (superResponse.status === 200) {
                // Display success message and reset error message
                setSuccessMessage('School created and Superadmin assigned, please login through Login page!');
                setErrorMessage('');
                // Clear form fields
                setName('');
                setEmail('');
                setPassword('');
                console.log(superResponse);
            } else {
                // Display error message and reset success message
                setErrorMessage('Could not set super id');
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
                        <label>School Name</label>
                        <input
                            type="schoolName"
                            placeholder="School Name"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                        />
                    </div>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Location</label>
                        <input
                            type="location"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Number of Students</label>
                        <input
                            type="numStudents"
                            placeholder="Number of Students"
                            value={numStudents}
                            onChange={(e) => setNumStudents(e.target.value)}
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <Link to="/login">Already have a school? Login</Link>
            </div>
        </div>
    );
}

export default SuperSignup;
