import React, {useEffect, useState} from 'react';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import './Event.css'; // Importing regular CSS file
import axios from 'axios';

function Event() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [ratings, setRatings] = useState({});
    const [newRating, setNewRating] = useState('');
    const [events, setEvents] = useState([]);
    const [userID, setUserID] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('');
    const [rsoID, setRSOID] = useState(null);
    const [publicBool, setPublic] = useState(true);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseExpandedView = () => {
        setSelectedEvent(null);
    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleAddComment = (eventId) => {
        if (newComment.trim() !== '') {
            setComments(prevComments => ({
                ...prevComments,
                [eventId]: [...(prevComments[eventId] || []), newComment.trim()]
            }));
            setNewComment('');
        }
    };

    const handleRatingChange = (event) => {
        setNewRating(event.target.value);
    };

    const handleAddRating = (eventId) => {
        if (newRating !== '' && !isNaN(newRating)) {
            setRatings(prevRatings => ({
                ...prevRatings,
                [eventId]: parseInt(newRating)
            }));
            setNewRating('');
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setUserID(userId);

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/users/id/${userId}`);
                localStorage.setItem('data', response.data);
                localStorage.setItem('domain', response.data.domain);
                localStorage.setItem('roleid', response.data.roleid);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const getRSOs = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/rso/findByUser/${userId}`);
                localStorage.setItem('rsos', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error getting RSOs:', error);
            }
        };

        const getEvents = async () => {
            const savedDomain = localStorage.getItem('domain');
            const savedRoleID = localStorage.getItem('roleid');
            const savedRSOs = localStorage.getItem('rsos');
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
        const roleid = localStorage.getItem('roleid');
        if (roleid === '1') { // Ensure to compare as strings since localStorage returns strings
            return (<button onClick={openModal}>CreateEvent</button>);
        } else {
            return null;
        }
    };

    // Function to render delete button if role ID is 1
    const renderDeleteButton = () => {
        const roleid = localStorage.getItem('roleid');
        const domain = localStorage.getItem('domain');
        if (roleid === '2' && selectedEvent.domain === domain) { // Ensure to compare as strings since localStorage returns strings
            return (
                <button onClick={() => {
                    handleDeleteEvent();
                    setSelectedEvent(null);
                }}>Delete Event</button>
            );
        } else {
            return null;
        }
    };

    const handleSignOut = () => {
        // Clear userId from localStorage
        localStorage.removeItem('userId');
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
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);

        // Set publicBool based on category
        if (selectedCategory === 'public') {
            setPublic(true);
        } else {
            setPublic(false);
        }

        // Reset RSO ID if category is not RSO
        if (selectedCategory !== 'rso') {
            setRSOID(null); // Reset RSO ID
        }
    };

    const handleCreateEvent = async () => {
        try {
            // Make API request to create event
            await axios.post(`http://localhost:3001/api/events/createEvent`, {
                event_name: name,
                event_desc: desc,
                event_type: type,
                date: date,
                time: time,
                contact_phone: phone,
                contact_email: email,
                rso_id: rsoID,
                domain: localStorage.getItem('domain'),
                is_public: publicBool
            });
        } catch (error) {
            console.error('Error creating event:', error);
        }

        closeModal();
    }

    // Modal content JSX
    const modalContent = (
        <div className="modal">
            <div className="modal-content">
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
                            <input type="number" min="1" max="5" value={newRating} onChange={handleRatingChange}/>
                            <div>
                                <button onClick={() => handleAddRating(selectedEvent.id)}>Submit Rating</button>
                            </div>
                        </div>
                        {/* Commenting component */}
                        <div>
                            <h3>Comments</h3>
                            <textarea rows="4" cols="50" value={newComment} onChange={handleCommentChange}></textarea>
                            <div>
                                <button onClick={() => handleAddComment(selectedEvent.id)}>Submit Comment</button>
                            </div>
                        </div>
                        {/* Display comments and ratings */}
                        <div>
                            <h3>Event {selectedEvent.name} Comments</h3>
                            {comments[selectedEvent.id] && comments[selectedEvent.id].map((comment, index) => (
                                <p key={index}>{comment}</p>
                            ))}
                            <h3>Event {selectedEvent.name} Rating</h3>
                            <p>{ratings[selectedEvent.id]}</p>
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
