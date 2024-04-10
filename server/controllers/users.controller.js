const db = require('../models');
const Users = db.Users;
const Op = db.Sequelize.Op;

// Create a user
exports.createUser = (req, res) => {
    // Validate Request
    if (!req.body.email) {
        res.status(400).send({
            message: 'Email is empty'
        });
        return;
    }

    // Create
    const user = {
        email: req.body.email,
        domain: req.body.domain,
        name: req.body.name,
        password: req.body.password,
        roleid: req.body.roleid
    };

    // Create user in database
    Users.create(user).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Error while creating user'
        });
    });
};

// Get user by id
exports.getUserById = (req, res) => {
    const id = req.params.id;

    Users.findByPk(id).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find User with id=${id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving user with id = ${id}`
        });
    });
};

// Get user by email
exports.getUserByEmail = (req, res) => {
    const email = req.params.email;

    Users.findOne({ where : { email: email } }).then(data => {
        if(data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find User with email=${email}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving user with email=${email}`
        });
    });
};

// Get users by roleid (0 = student, 1 = admin, 2 = superadmin)
exports.getUsersByRole = (req, res) => {
    const roleid = req.params.roleid;

    Users.findAll({ where: { roleid: roleid}}).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving users by roleid"
        });
    });
};

// Get users by school (domain)
exports.getUsersBySchool = (req, res) => {
    const domain = req.params.domain;

    Users.findAll({ where: { domain: domain }}).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving users by school"
        });
    });
};

// Update user role
exports.updateRole = (req, res) => {
    const id = req.params.id;

    Users.update( req.body, {where: { id: id} }).then(num => {
        if (num == 1) {
            res.send({
                message: `User with id: ${id}, role updated successfully`
            });
        } else {
            res.send({
                message: `Cannot update user with id ${id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error updating user with id ${id}`
        });
    });
}