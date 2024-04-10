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
        schoolName: req.body.schoolName,
        location: req.body.location,
        numStudents: req.body.numStudents,
        super_id: req.body.super_id
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

// Get a school by its superadmin 
exports.findSchoolBySuper = (req, res) => {
    const super_id = req.params.super_id;

    Schools.findOne({ where: { super_id: super_id} }).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find School with superadmin= ${super_id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving School with domain= ${super_id}`
        });
    });
}
