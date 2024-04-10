import React, {useEffect, useState} from 'react';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import './Event.css'; // Importing regular CSS file
import axios from 'axios';
import {type} from "@testing-library/user-event/dist/type";

function Event() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [ratings, setRatings] = useState({});
    const [newRating, setNewRating] = useState('');
    const [data, setData] = useState('');
    const [domain, setDomain] = useState('');
    const [rsos, setRSOs] = useState([]);
    const [events, setEvents] = useState([]);
    const [userID, setUserID] = useState('');

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
                setData(response.data);
                localStorage.setItem('data', response.data);
                localStorage.setItem('domain', response.data.domain);
                localStorage.setItem('roleid', response.data.roleid);
                setDomain(response.data.domain);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const getRSOs = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/rso/findByUser/${userId}`);
                setRSOs(response.data);
                localStorage.setItem('rsos', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error getting RSOs:', error);
            }
        };

        const getEvents = async () => {
            const savedData = localStorage.getItem('data');
            const savedDomain    = localStorage.getItem('domain');
            const savedRoleID    = localStorage.getItem('roleid');
            const savedRSOs    = localStorage.getItem('rsos');
            const rsosArray = JSON.parse(savedRSOs);
            try {
                const modifiedDomain = savedDomain.replace("@", "");
                const apiUrlList = [
                    `http://localhost:3001/api/events/findPublic/`,
                    `http://localhost:3001/api/events/findAllPrivate/@${modifiedDomain}`
                ];

                const superUrl = `http://localhost:3001/api/events/pendingByDomain/@${modifiedDomain}`;

                // If statement to determine what the apiUrl will be
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
    }, [userID]); // Run this effect only when userId changes


    const handleSignOut = () => {
        // Clear userId from localStorage
        localStorage.removeItem('userId');
        // Redirect to login page
        navigate('/login');
    };
    return (
        <div>
            <h2>Event Page</h2>
            <div>
                <Navbar />
                {/* Sign-out button */}
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
            <h3>Events</h3>
            {events.length > 0 && (
                <div className="eventGrid">
                    {events.map(event => (
                        <React.Fragment key={event.id}>
                        <div className="eventCard" onClick={() => handleEventClick(event)}>
                            <h4>{event.event_name}</h4>
                            <p><strong>Type:</strong> {event.event_type}</p>
                            {/* Add more event details */}
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
                        {/* Add more event details */}
                        <p><strong>Description:</strong> {selectedEvent.event_desc}</p>
                        <p><strong>Date:</strong> {selectedEvent.date}</p>
                        <p><strong>Time:</strong> {selectedEvent.time}</p>
                        <p><strong>Location:</strong> {selectedEvent.location}</p>
                        <p><strong>Contact Phone:</strong> {selectedEvent.contact_phone}</p>
                        <p><strong>Contact Email:</strong> {selectedEvent.contact_email}</p>
                        {/* Rating component */}
                        <div>
                            <h3>Rating</h3>
                            <input type="number" min="1" max="5" value={newRating} onChange={handleRatingChange} />
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
                    </div>
                </div>
            )}
        </div>
    );
}

export default Event;
