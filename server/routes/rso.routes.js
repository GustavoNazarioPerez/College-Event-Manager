module.exports = app => {
    const rso = require('../controllers/rso.controller');

    var router = require('express').Router();

    // Create new RSO
    router.post('/createRSO', rso.createRSO);

    // Add user to RSO
    router.post('/joinRSO', rso.joinRSO);

    // Find RSOs by domain
    router.get('/findByDomain/:domain', rso.findRSOByDomain);

    // Find RSO by rso id
    router.get('/findRSO/:rso_id', rso.findRSOById);

    // Find RSOs by user id
    router.get('/findByUser/:user_id', rso.findRSOByUser);

    // Find users by rso id
    router.get('/findUsers/:rso_id', rso.findUsersInRSO);

    // find num users by rso id (Data is numUsers)
    router.get('/findNumUsers/:rso_id', rso.findNumUsers);

    // Remove user from an RSO
    router.delete('/removeUser', rso.removeUserFromRSO);
    
    app.use('/api/rso', router);
}