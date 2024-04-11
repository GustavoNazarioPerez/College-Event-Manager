module.exports = app => {
    const schools = require('../controllers/schools.controller');

    var router = require('express').Router();

    // Create new school
    router.post('/createSchool', schools.createSchool);

    // Get all schools 
    router.get('/', schools.findAllSchools);

    // Get a school by domain
    router.get('/:domain', schools.findSchoolByDomain);

    // Get a school by super admin id
    router.get('/super/:super_id', schools.findSchoolByDomain);

    app.use('/api/schools', router);
}