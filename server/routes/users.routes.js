module.exports = app => {
    const users = require('../controllers/users.controller');

    var router = require('express').Router();

    // Create new user
    router.post('/createUser', users.createUser);

    // Get user by id
    router.get('/id/:id', users.getUserById);

    // Get user by email
    router.get('/email/:email', users.getUserByEmail);

    // Get users by role
    router.get('/role/:roleid', users.getUsersByRole);

    // Get users by school (domain)
    router.get('/domain/:domain', users.getUsersBySchool);

    // Update user's role
    router.patch('/updateRole/:id', users.updateRole);

    app.use('/api/users', router);
}