import React, {useEffect, useState} from 'react';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import './RSO.css'; // Importing regular CSS file
import axios from 'axios';


function RSO() {
    const [userID, setUserID] = useState('');
    const [orgName, setOrgName] = useState('');
    const [domainRSOs, setDomainRSOs] = useState([]);
    const [userRSOs, setUserRSOs] = useState([]);
    const [rsos, setRSOs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const [errorMessage, setErrorMessage] = useState(false); // State for modal
    const [successMessage, setSuccessMessage] = useState(false); // State for modal
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Clear userId from sessionStorage
        sessionStorage.removeItem('userId');
        // Redirect to login page
        navigate('/login');
    };

    const handleJoin = async (rso) => {
        setErrorMessage('');
        setSuccessMessage('');
        const savedUser = sessionStorage.getItem('userId');
        let numUsers = null;
        try {
            await axios.post(`http://localhost:3001/api/rso/joinRSO`, {
                rso_id: rso.rso_id,
                user_id: savedUser
            });
            console.log("Successfully joined RSO");
            await getUserRSOs();
            numUsers = await getNumberOfUsers(rso.rso_id);
        } catch (error) {
            console.error('Error joining an RSO:', error);
        }

        console.log(numUsers);
        if (numUsers && numUsers == 5) {
            setSuccessMessage(`There are now 5 members in RSO: "${rso.orgName}". The RSO is active!`);
        }
    };

    const handleLeave = async (rso) => {
        setErrorMessage('');
        setSuccessMessage('');
        const savedUser = sessionStorage.getItem('userId');
        let numUsers = null;

        if (savedUser == rso.admin_id) {
            setErrorMessage("You can not leave the RSO as you are the sole administrator");
            return;
        }

        try {
            await axios.delete(`http://localhost:3001/api/rso/removeUser`, {
                data: {
                    rso_id: rso.rso_id,
                    user_id: savedUser
                }
            });
            console.log("Successfully left RSO");
            await getUserRSOs();
            numUsers = await getNumberOfUsers(rso.rso_id);
        } catch (error) {
            console.error('Error leaving an RSO:', error);
        }

        console.log(numUsers);
        if (numUsers && numUsers == 4) {
            setErrorMessage(`There are now 4 members in RSO: "${rso.orgName}". The RSO is inactive!`);
        }
    };

    // Function to render create button if role ID is 2
    const renderCreateButton = () => {
        const roleid = sessionStorage.getItem('roleid');
        if (roleid !== '2') { // Ensure to compare as strings since sessionStorage returns strings
            return (<button onClick={openModal}>Create RSO</button>);
        } else {
            return null;
        }
    };

    const getNumberOfUsers = async (rsoID) => {
        let numResponse = null;
        try {
            numResponse = await axios.get(`http://localhost:3001/api/rso/findNumUsers/${rsoID}`);
            return numResponse.data[0].numUsers;
        } catch (error) {
            console.error('Error finding the number of users in the rso by ID:', error);
            return null;
        }
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateRSO = async (e) => {
        e.preventDefault();

        let response = null;
        const savedId = sessionStorage.getItem('userId');
        try {
            console.log(savedId);
            // Make API request to create event
            response = await axios.post(`http://localhost:3001/api/rso/createRSO`, {
                orgName,
                domain: sessionStorage.getItem('domain'),
                admin_id: savedId
            });
        } catch (error) {
            console.error('Error creating rso:', error);
        }

        if (response) {
            console.log(response.data.rso_id);
            await handleJoin(response.data);
        }

        closeModal();
    }

    // Modal content JSX
    const modalContent = (
        <div className="modal">
            <div className="modal-content">
                <h2>Create RSO</h2>
                <form onSubmit={handleCreateRSO}>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>RSO Name</label>
                        <input
                            type="name"
                            placeholder="Name"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                        />
                    </div>
                    <button type="submit">Create!</button>
                </form>
            </div>
        </div>
    );

    const getUserRSOs = async () => {
        const userId = sessionStorage.getItem('userId');

        try {
            const response = await axios.get(`http://localhost:3001/api/rso/findByUser/${userId}`)
            setUserRSOs(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        setUserID(userId);

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/users/id/${userId}`);
                sessionStorage.setItem('data', response.data);
                sessionStorage.setItem('domain', response.data.domain);
                sessionStorage.setItem('roleid', response.data.roleid);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const getRSOs =  async () => {
            getUserRSOs();
            getDomainRSOs();
        }


        const getDomainRSOs = async () => {
            const savedDomain = sessionStorage.getItem('domain');

            try {
                const modifiedDomain = savedDomain.replace("@", "");
                const responses = await axios.get(`http://localhost:3001/api/rso/findByDomain/@${modifiedDomain}`);
                setDomainRSOs(responses.data);
                setRSOs(responses.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        // Fetch user data and RSOs concurrently
        fetchData().then(() => getRSOs());

    // eslint-disable-next-line
    }, [userID]); // Run this effect only when userId changes

    return (
        <div>
            <h2>RSO Page</h2>
            <div>
                <Navbar/>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
            <h3>RSOs</h3>
            <div>
                {renderCreateButton()}
            </div>
            {isModalOpen && modalContent}
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            {rsos.length > 0 && (
                <div className="rsoGrid">
                    {rsos.map(rso => (
                        <React.Fragment key={rso.id}>
                            <div className="rsoCard">
                                <h4>{rso.orgName}</h4>
                                <p><strong>RSO ID</strong> {rso.rso_id}</p>
                                {/* Render Join Button if RSO is in domainRSOs but not in userRSOs */}
                                {domainRSOs.some(domainRso => domainRso.rso_id === rso.rso_id) &&
                                    !userRSOs.some(userRso => userRso.rso_id === rso.rso_id) &&
                                    <button onClick={() => handleJoin(rso)}>Join RSO</button>}
                                {/* Render Leave Button if RSO is in userRSOs */}
                                {userRSOs.some(userRso => userRso.rso_id === rso.rso_id) &&
                                    <button onClick={() => handleLeave(rso)}>Leave RSO</button>}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}
export default RSO;