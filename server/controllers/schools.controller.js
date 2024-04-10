const db = require('../models');
const Schools = db.Schools;
const Op = db.Sequelize.Op;

// Create a School
exports.createSchool = (req, res) => {
    // Validate Request
    if (!req.body.domain) {
        res.status(400).send({
            message: 'Content is empty'
        });
        return;
    }

    // Create
    const school = {
        domain: req.body.domain,
        schoolName: req.body.schoolName
    };

    // Create school in database
    Schools.create(school).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Error while creating school'
        });
    });
};

// Gets all schools
exports.findAllSchools = (req, res) => {
    Schools.findAll().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Error while getting tutorials'
        });
    });

};

// Get a school by domain
exports.findSchoolByDomain = (req, res) => {
    const domain = req.params.domain;

    Schools.findByPk(domain).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find School with domain= ${domain}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving School with domain= ${domain}`
        });
    });
};
