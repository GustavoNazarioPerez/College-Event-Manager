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
        event_type: req.body.event_type,
        date: req.body.date,
        time: req.body.time,
        contact_phone: req.body.contact_phone,
        contact_email: req.body.contact_email,
        rso_id: req.body.rso_id,
        domain: req.body.domain,
        is_public: req.body.is_public,
        approved: false
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

// Delete/Take down an event
exports.deleteEvent = (req, res) => {
    const event_id = req.params.event_id;

    Events.destroy( { where: { event_id : event_id } });

    Event_members.destroy({ where: { event_id : event_id} })
    .then(num => {
        if (num == 0) {
            res.send({
                message: `Event deleted successfully`
            });
        } else {
            res.send({
                message: `Cannot delete event ${event_id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: 'Error while deleting event'
        });
    });
};

// Find all unapproved events given domain
exports.pendingByDomain = (req, res) => {
    const domain = req.params.domain;

    Events.findAll({ where: { domain: domain, approved: false}}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Events with domain= ${domain}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving Events with domain= ${domain}`
        });
    });
}

// Find all approved events given domain
exports.findEventsByDomain = (req, res) => {
    const domain = req.params.domain;

    Events.findAll({ where: { domain: domain, approved: true}}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Events with domain= ${domain}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving Events with domain= ${domain}`
        });
    });
}

// Find all approved public events
exports.findAllPublic = (req, res) => {
    Events.findAll({ where: { is_public : true, approved: true}}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find all public events`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving all public events`
        });
    });
}

// Find all UNAPPROVED public events
exports.findPendingPublic = (req, res) => {
    Events.findAll({ where: { is_public : true, approved: false}}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find all unapproved events`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving unapproved public events`
        });
    });
};

// Find all Approved Private Events (domain)
exports.findAllPrivate = (req, res) => {
    const domain = req.params.domain

    Events.findAll({ where: { 
        is_public : false, 
        approved: true,
        domain: domain
    
    }}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find all private events`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving all private events`
        });
    });
};

// Find all unapproved Private Events (domain)
exports.findPendingPrivate = (req, res) => {
    const domain = req.params.domain

    Events.findAll({ where: { 
        is_public : false, 
        approved: false,
        domain: domain
    
    }}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find all pending private events`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving all pending private events`
        });
    });
};

// Find all RSO events (domain)
exports.findRSOEvents = (req, res) => {
    const domain = req.params.domain

    Events.findAll({ where: { 
        is_public : null, 
        approved: true,
        domain: domain
    
    }}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find all RSO events`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving all RSO events`
        });
    });
};

// Find all pending RSO events (domain)
exports.findPendingRSOEvents = (req, res) => {
    const domain = req.params.domain

    Events.findAll({ where: { 
        is_public : null, 
        approved: false,
        domain: domain
    
    }}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find all pending RSO events`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving all pending RSO events`
        });
    });
};

// Find all Events for a user id
exports.findUsersEvents = (req, res) => {
    const user_id = req.params.user_id;

    Event_members.findAll({ where: { 
        user_id: user_id
    }}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find all pending RSO events`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving all pending RSO events`
        });
    });
}

// Find all users attending an event
exports.findEventMembers = (req, res) => {
    const event_id = req.params.event_id;

    Event_members.findAll({ where: { 
        event_id: event_id
    }}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find all pending RSO events`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving all pending RSO events`
        });
    });
}

