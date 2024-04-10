const db = require('../models');
const Events = db.Events;
const Event_members = db.Event_members;
const Op = db.Sequelize.Op;

// Create an event
exports.createEvent = (req, res) => {
    //validate
    if (!req.body) {
        res.status(400).send({
            message: 'Event field cannot be empty'
        });
        return;
    }

    // Create
    const event = {
        event_name: req.body.event_name,
        event_desc: req.body.event_desc,
        rso_id: req.body.rso_id,
        domain: req.body.domain,
        is_public: req.body.is_public,
    };

    // Add to db
    Events.create(event).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occured while creating Event'
        });
    });
};

// Add user to an event
exports.joinEvent = (req, res) => {
    // validate
    if (!req.body.event_id || !req.body.user_id) {
        res.status(400).send({
            message: 'id fields cannot be empty'
        });
    };

    // Create member
    const event_member = {
        event_id : req.body.event_id,
        user_id: req.body.user_id
    };

    // Add to db
    Event_members.create(event_member).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occured while adding user to Event'
        });
    });
};

// Approve Event (done by school super admin)
exports.approveEvent = (req, res) => {
    const event_id = req.params.event_id;

    Events.update( { approved: true }, {
        where: { event_id: event_id} })
        .then(num => {
        if (num == 1) {
            res.send({
                message: `Event with id: ${event_id}, event approved successfully`
            });
        } else {
            res.send({
                message: `Cannot update event with event id ${event_id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error updating event with event id ${event_id}`
        });
    });
}
