module.exports = app => {
    const event = require('../controllers/events.controller');

    var router = require('express').Router();

    // Create new Event
    router.post('/createEvent', event.createEvent);

    // Add user to Event
    router.post('/joinEvent', event.joinEvent);

    // Approve an event
    router.patch('/approveEvent/:event_id', event.approveEvent);

    // Delete an event
    router.delete('/deleteEvent/:event_id', event.deleteEvent);

    // Find Pending Events (domain)
    router.get('/pendingByDomain/:domain', event.pendingByDomain);

    // Find approved Events (domain)
    router.get('/findEventsByDomain/:domain', event.findEventsByDomain);

    // Find approved PUBLIC Events
    router.get('/findPublic', event.findAllPublic);

    // Find unapproved PUBLIC events
    router.get('/findPendingPublic', event.findPendingPublic);

    // Find approved PRIVATE events
    router.get('/findAllPrivate/:domain', event.findAllPrivate);

    // Find unapproved PRIVATE events
    router.get('/findPendingPrivate/:domain', event.findPendingPrivate);

    // Find approved RSO events
    router.get('/findRSOEvents/:domain', event.findRSOEvents);

    // Find unapproved RSO events
    router.get('/findPendingRSOEvents/:domain', event.findPendingRSOEvents);

    // Find events that User is registered for
    router.get('/findUsersEvents/:user_id', event.findUsersEvents);

    // Find all event members
    router.get('/findEventMembers/:event_id', event.findEventMembers);
    
    app.use('/api/events', router);
}