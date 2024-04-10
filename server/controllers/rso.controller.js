const db = require('../models');
const RSOs = db.RSOs;
const RSO_members = db.RSO_members;
const Op = db.Sequelize.Op;

// Create an RSO
exports.createRSO = (req, res) => {
    //validate
    if (!req.body.domain) {
        res.status(400).send({
            message: 'RSO data cannot be empty'
        });
        return;
    }

    // Create
    const rso = {
        domain: req.body.domain,
        orgName: req.body.orgName,
        admin_id: req.body.admin_id
    };

    // Add to db
    RSOs.create(rso).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occured while creating RSO'
        });
    });
};

// Add user to an RSO
exports.joinRSO = (req, res) => {
    // validate
    if (!req.body.rso_id || !req.body.user_id) {
        res.status(400).send({
            message: 'id fields cannot be empty'
        });
    };

    // Create member
    const rso_member = {
        rso_id : req.body.rso_id,
        user_id: req.body.user_id
    };

    // Add to db
    RSO_members.create(rso_member).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occured while adding user to RSO'
        });
    });
};

// find RSOs by domain
exports.findRSOByDomain = (req, res) => {
    const domain = req.params.domain;
    RSOs.findAll({ where: { domain: domain }}).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving RSOs by domain'
        });
    });
};

// Find RSO by rso_id
exports.findRSOById = (req, res) => {
    const rso_id = req.params.rso_id;

    RSOs.findOne({ where: { rso_id: rso_id } }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occured while retreiving RSO by rso id'
        });
    });
};

// Find RSOs by user id    *** There should be a way to link this to respond with actual RSO data **
exports.findRSOByUser = (req, res) => {
    const user_id = req.params.user_id;

    RSO_members.findAll({ where: { user_id: user_id}}).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving RSOs by userid'
        });
    });
};

// Find users by rso_id
exports.findUsersInRSO = (req, res) => {
    const rso_id = req.params.rso_id;

    RSO_members.findAll({ where: { rso_id: rso_id}}).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving users by RSO id'
        });
    });
};

// Remove a user from an RSO using user_id and rso_id
exports.removeUserFromRSO = (req, res) => {
    const user_id = req.body.user_id;
    const rso_id = req.body.rso_id;

    RSO_members.destroy({
        where: { user_id: user_id, rso_id: rso_id }
    }).then(num => {
        if(num == 1) {
            // Successful deletion, send 1
            res.send({
                message: num
            });
        }else {
            res.send({
                message: `Cannot delete user: ${user_id} in RSO: ${rso_id}`
            });
        };
    }).catch(err => {
        res.status(500).send({
            message: 'Could not remove user from rso'
        });
    });
};