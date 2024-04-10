module.exports = app => {
    const event = require('../controllers/events.controller');

    var router = require('express').Router();

    // Create new Event
    router.post('/createEvent', event.createEvent);

    // Add user to Event
    router.post('/joinEvent', event.joinEvent);

    // Approve an event
    router.patch('/approveEvent/:event_id', event.approveEvent);
    
    app.use('/api/events', router);
}