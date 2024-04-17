import React, {useEffect, useState} from 'react';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import './Event.css'; // Importing regular CSS file
import axios from 'axios';

function Event() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [commenterNames, setCommenters] = useState('');
    const [ratings, setRatings] = useState({});
    const [newRating, setNewRating] = useState(null);
    const [data, setData] = useState('');
    const [domain, setDomain] = useState('');
    const [rsos, setRSOs] = useState([]);
    const [events, setEvents] = useState([]);
    const [userID, setUserID] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [modifiedText, setModifiedText] = useState('');
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('');
    const [rsoID, setRSOID] = useState(null);
    const [publicBool, setPublic] = useState(true);

    const handleEventClick = (event) => {
        sessionStorage.setItem('current_event_id', event.event_id)
        setSelectedEvent(event);
    };

    const handleCloseExpandedView = () => {
        setSelectedEvent(null);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create Comment
            const submissionComment = await axios.post('http://localhost:3001/api/comments/createComment', {
                event_id: sessionStorage.getItem('current_event_id'),
                user_id: sessionStorage.getItem('userId'),
                name: sessionStorage.getItem('name'),
                text: newComment
            });
            if (submissionComment.status === 200) {
                console.log(submissionComment);
                setNewComment('');
                setSelectedEvent(sessionStorage.getItem('current_event_id'));
            } else {
                console.log('error creating comment');
            }
        } catch (error) {
            console.error('Error submitting comment', error);
        }
    }

    const handleModifyComment = async () => {
        console.log(modifiedText);
        const comment_id = activeCommentId;
        const newText = modifiedText;

        console.log(`Edited comment should have new text: ${newText}`)
        console.log(`Editing comment of id: ${comment_id}`)

        try {
            // Edit comment
            const edit = await axios.patch(`http://localhost:3001/api/comments/editComment/${comment_id}`, {
                text: newText
            });
            if (edit.status === 200) {
                console.log(edit);
                setSelectedEvent(sessionStorage.getItem('current_event_id')); // just refreshes
            } else {
                console.log('Error editing comment');
            }
        } catch(error) {
            console.error('Error while editing comment', error);
        }
    }

    const handleDeleteComment = async (e, comment) => {
        e.preventDefault();
        const comment_id = comment.comment_id;

        console.log(`Deleting comment of id: ${comment_id}`)
        try {
            // Delete Comment
            const deletion = await axios.delete(`http://localhost:3001/api/comments/deleteComment/${comment_id}`);
            if (deletion.status === 200) {
                console.log(deletion);
                setSelectedEvent(sessionStorage.getItem('current_event_id')); // just refreshes
            } else {
                console.log('Error deleting comment');
            }
        } catch (error) {
            console.error('Error while deleting comment', error);
        }
    }

    const handleRatingChange = (e) => {
        setNewRating(e.target.value);
    };

    const handleAddRating = async (e) => {
        e.preventDefault();

        console.log(newRating);

        try {
            // Create Comment
            const submissionRating = await axios.post('http://localhost:3001/api/comments/createRating', {
                event_id: sessionStorage.getItem('current_event_id'),
                user_id: sessionStorage.getItem('userId'),
                name: sessionStorage.getItem('name'),
                rating: newRating
            });
            if (submissionRating.status === 200) {
                console.log(submissionRating);
                setNewRating('');
                setSelectedEvent(sessionStorage.getItem('current_event_id')); // Refreshes after submit
            } else {
                console.log('error creating Rating');
            }
        } catch (error) {
            console.error('Error submitting rating', error);
        }
    };

    const navigate = useNavigate();

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

        const getRSOs = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/rso/findByUser/${userId}`);
                sessionStorage.setItem('rsos', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error getting RSOs:', error);
            }
        };

        const getEvents = async () => {
            const savedDomain = sessionStorage.getItem('domain');
            const savedRoleID = sessionStorage.getItem('roleid');
            const savedRSOs = sessionStorage.getItem('rsos');
            const rsosArray = JSON.parse(savedRSOs);
            try {
                const modifiedDomain = savedDomain.replace("@", "");
                const apiUrlList = [
                    `http://localhost:3001/api/events/findPublic/`,
                    `http://localhost:3001/api/events/findAllPrivate/@${modifiedDomain}`
                ];

                const superUrl = `http://localhost:3001/api/events/pendingByDomain/@${modifiedDomain}`;

                // If statement to determine what the apiUrl will be
                // eslint-disable-next-line
                if (savedRoleID == 2) {
                    apiUrlList.push(superUrl);
                }

                for (const rsoId of rsosArray) {
                    const rsoIdVal = rsoId.rso_id;
                    const apiUrl = `http://localhost:3001/api/events/findRSOEvents/${rsoIdVal}`;
                    apiUrlList.push(apiUrl);
                }

                const responses = await Promise.all(apiUrlList.map(apiUrl => axios.get(apiUrl)));
                const newEvents = [];

                responses.forEach(response => {
                    const eventDataList = response.data;
                    eventDataList.forEach(eventData => {
                        if (!events.some(event => event.id === eventData.id)) {
                            newEvents.push(eventData);
                        }
                    });
                });

                setEvents(prevEvents => [...newEvents]);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        // Fetch user data and RSOs concurrently
        fetchData().then(() => getRSOs()).then(() => getEvents());

        // eslint-disable-next-line
    }, [userID]); // Run this effect only when userId changes


    useEffect(() => {
        // RETRIEVING COMMENTS AND COMMENTER NAMES (INCLUDING RATINGS)
        const event_id = sessionStorage.getItem('current_event_id')
        
        const getComments = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/comments/findEventComments/${event_id}`);
                setComments(response.data);

                console.log(comments);
            } catch (error) {
                console.error('Error getting comments:', error);
            }
        }

        const getRatings = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/comments/findEventRatings/${event_id}`);
                setRatings(response.data);

                console.log(ratings);
            } catch (error) {
                console.error('Error getting ratings:', error);
            }
        }

        getComments().then(() => console.log(`got comments! for event: ${event_id}`)).then(getRatings());
    }, [selectedEvent]);

    useEffect(() => {
        // EDITING COMMENTS
        if(!isEditing && activeCommentId !== null) {
            handleModifyComment();
            setActiveCommentId(null); // Reset Active Comment ID
        }

    }, [isEditing, modifiedText, activeCommentId]);


    // Function to handle event deletion
    const handleDeleteEvent = async (eventId) => {

        // Check if eventId is a valid integer
        if (!Number.isInteger(eventId)) {
            console.error('Invalid eventId:', eventId);
            return;
        }

        try {
            // Make API request to delete event
            await axios.delete(`http://localhost:3001/api/events/deleteEvent/${eventId}`);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    }

    // Function to render create button if role ID is 2
    const renderCreateButton = () => {
        const roleid = sessionStorage.getItem('roleid');
        if (roleid === '1') { // Ensure to compare as strings since sessionStorage returns strings
            return (<button onClick={openModal}>CreateEvent</button>);
        } else {
            return null;
        }
    };

    // Function to render delete button if role ID is 1
    const renderDeleteButton = () => {
        const roleid = sessionStorage.getItem('roleid');
        const domain = sessionStorage.getItem('domain');
        if (roleid === '2' && selectedEvent.domain === domain) { // Ensure to compare as strings since sessionStorage returns strings
            return (
                <button onClick={() => {
                    handleDeleteEvent(selectedEvent.event_id);
                    setSelectedEvent(null);
                }}>Delete Event</button>
            );
        } else {
            return null;
        }
    };


    const handleSignOut = () => {
        // Clear userId from sessionStorage
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('domain');
        sessionStorage.removeItem('roleid');
        // Redirect to login page
        navigate('/login');
    };

    // Function to open modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close modal
    const closeModal = () => {
        setName('');
        setDesc('');
        setType('');
        setDate('');
        setTime('');
        setPhone('');
        setEmail('');
        setRSOID(null);
        setCategory('');
        setPublic(true);
        setIsModalOpen(false);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);

        // Set publicBool based on category
        if (selectedCategory === 'public') {
            setPublic(true);
        } else if (selectedCategory === 'private') {
            setPublic(false);
        } else {
            setPublic(null);
        }

        // Reset RSO ID if category is not RSO
        if (selectedCategory !== 'rso') {
            setRSOID(null); // Reset RSO ID
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        let response = null;
        try {
            response = await axios.get(`http://localhost:3001/api/rso/findRSO/${rsoID}`);
        } catch (error) {
            console.error('Error finding the rso by ID:', error);
            return;
        }

        if (category === 'rso' && response && response.data.admin_id != userID) {
            console.log(response);
            console.log(response.admin_id);
            console.log(userID);
            console.log("You are not the administrator of this RSO");
            setErrorMessage("You are not the administrator of this RSO");
            return;
        }

        let numResponse = null;
        try {
            numResponse = await axios.get(`http://localhost:3001/api/rso/findNumUsers/${rsoID}`);
        } catch (error) {
            console.error('Error finding the number of users in the rso by ID:', error);
            return;
        }

        console.log(numResponse.data[0].numUsers);
        if (category === 'rso' && numResponse && numResponse.data[0].numUsers < 5) {
            console.log("This RSO is inactive, you must have at least 5 members");
            setErrorMessage("This RSO is inactive, you must have at least 5 members");
            return;
        }

        const duplicateEvent = events.find(event => event.location === location && event.time === time && event.date === date);
        if (duplicateEvent) {
            console.log(`An event already exists on ${date} at ${location} at ${time}, the event is ${duplicateEvent.event_name}`);
            setErrorMessage(`An event already exists on ${date} at ${location} at ${time}, the event is ${duplicateEvent.event_name}`);
            return;
        }

        try {
            // Make API request to create event
            await axios.post(`http://localhost:3001/api/events/createEvent`, {
                event_name: name,
                event_desc: desc,
                event_type: type,
                location: location,
                date: date,
                time: time,
                contact_phone: phone,
                contact_email: email,
                rso_id: rsoID,
                domain: sessionStorage.getItem('domain'),
                is_public: publicBool
            });
            closeModal();
        } catch (error) {
            console.error('Error creating event:', error);
        }
    }

    // Modal content JSX
    const modalContent = (
        <div className="modal">
            <div className="modal-content">
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <h2>Create Event</h2>
                <form onSubmit={handleCreateEvent}>
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
                        <label>Description</label>
                        <input
                            type="description"
                            placeholder="Description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Type</label>
                        <input
                            type="type"
                            placeholder="Tech Talk, Social, Fundraising..."
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        />
                    </div>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Location</label>
                        <input
                            type="location"
                            placeholder="Student Union, Gym..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Date</label>
                        <input
                            type="Date"
                            placeholder="MM-DD-YYYY"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Time</label>
                        <input
                            type="time"
                            placeholder="00:00"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Contact Phone</label>
                        <input
                            type="contact_phone"
                            placeholder="000-000-0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Contact Email</label>
                        <input
                            type="contact_email"
                            placeholder="user@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='input-group'> {/* Apply class name for input group */}
                        <label>Category</label>
                        <select value={category} onChange={handleCategoryChange}>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="rso">RSO</option>
                        </select>
                    </div>
                    {category === 'rso' && (
                        <div className='input-group'> {/* Apply class name for input group */}
                            <label>RSO ID</label>
                            <input
                                type="rsoID"
                                placeholder="0"
                                value={rsoID}
                                onChange={(e) => setRSOID(e.target.value)}
                            />
                        </div>
                    )}
                    <button type="submit">Create!</button>
                </form>
                <button onClick={closeModal}>Close</button>
            </div>
        </div>
    );

    return (
        <div>
            <h2>Event Page</h2>
            <div>
                <Navbar/>
                {/* Sign-out button */}
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
            <h3>Events</h3>
            <div>
                {renderCreateButton()}
            </div>
            {isModalOpen && modalContent}
            {events.length > 0 && (
                <div className="eventGrid">
                    {events.map(event => (
                        <React.Fragment key={event.id}>
                            <div className="eventCard" onClick={() => handleEventClick(event)}>
                                <h4>{event.event_name}</h4>
                                <p><strong>Type:</strong> {event.event_type}</p>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
            {selectedEvent && (
                <div className="expandedEvent" onClick={handleCloseExpandedView}>
                    <div className="expandedContent" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedEvent.name}</h2>
                        <p><strong>Type:</strong> {selectedEvent.event_type}</p>
                        <p><strong>Description:</strong> {selectedEvent.event_desc}</p>
                        <p><strong>Date:</strong> {selectedEvent.date}</p>
                        <p><strong>Time:</strong> {selectedEvent.time}</p>
                        <p><strong>Location:</strong> {selectedEvent.location}</p>
                        <p><strong>Contact Phone:</strong> {selectedEvent.contact_phone}</p>
                        <p><strong>Contact Email:</strong> {selectedEvent.contact_email}</p>
                        <div>
                            <h3>Rating</h3>
                            <select id='rating-select' value={newRating} onChange={(e) => setNewRating(e.target.value)}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        {/* Commenting component */}
                        <div>
                            <h3>Comments</h3>
                            <textarea rows="4" cols="50" value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
                            <div>
                                <button onClick={(e) => handleCommentSubmit(e)}>Submit Comment</button>
                            </div>
                        </div>
                        {/* Display comments and ratings */}
                        <div>
                            <h3>Event Comments</h3>
                            {comments.map(comment => (
                                <div key={comment.comment_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '5px ', padding: '0' }}>
                                    {isEditing && activeCommentId === comment.comment_id ? (
                                        <input type='text' value={modifiedText} onChange={(e) => setModifiedText(e.target.value)}/>
                                    ) : (
                                        <p>{comment.name}: {comment.text}</p>
                                    )}
                                    {comment.user_id == userID && 
                                        <button style={{ marginLeft: '10px' }} onClick={(e) => handleDeleteComment(e, comment)}>
                                            Delete
                                        </button>
                                    }
                                    {comment.user_id == userID && 
                                        <button style={{ marginLeft: '10px' }} onClick={() => {
                                        if (!isEditing) {
                                            setModifiedText(comment.text);
                                            setActiveCommentId(comment.comment_id);
                                        }
                                        setIsEditing(!isEditing);
                                        }}>
                                            {isEditing ? 'Done' : 'Edit'}
                                        </button>
                                    }
                                </div>
                            ))}

                            <h3>Event Rating</h3>
                            {ratings.map(rating => (
                                <div key={rating.comment_id} style={{ display: 'inline', alignItems: 'center' }}>
                                    <p>{rating.name}: Rates this event {rating.rating}/5</p>
                                    {rating.user_id == userID && 
                                        <button style={{ marginLeft: '10px' }} onClick={(e) => handleDeleteComment(e, rating)}>
                                            Delete
                                        </button>
                                    }
                                </div>
                            ))}
                        </div>
                        <div>
                            {renderDeleteButton()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Event;
