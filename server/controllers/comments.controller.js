const db = require('../models');
const Comments = db.Comments;
const Op = db.Sequelize.Op;

// Create comment
exports.createComment = (req, res) => {
    //validate
    if (!req.body.text) {
        res.status(400).send({
            message: 'Comment field cannot be empty'
        });
        return;
    }

    // Create
    const comment = {
        event_id: req.body.event_id,
        user_id: req.body.user_id,
        name: req.body.name,
        text: req.body.text
    };

    // Add to db
    Comments.create(comment).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occured while creating Comment'
        });
    });
};

// Create a rating
exports.createRating = (req, res) => {
    //validate
    if (!req.body.rating) {
        res.status(400).send({
            message: 'Rating field cannot be empty'
        });
        return;
    }

    // Create
    const comment = {
        event_id: req.body.event_id,
        user_id: req.body.user_id,
        name: req.body.name,
        text: null,
        rating: req.body.rating
    };

    // Add to db
    Comments.create(comment).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occured while creating Rating'
        });
    });
};

// Modify Comment
exports.editComment = (req, res) => {
    const comment_id = req.params.comment_id;
    const newComment = req.body.text;

    Comments.update( {text: newComment }, {where: { comment_id: comment_id} })
    .then(num => {
        if (num == 1) {
            res.send({
                message: `Comment with id: ${comment_id}, Modified successfully`
            });
        } else {
            res.send({
                message: `Cannot update comment with id ${comment_id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error updating comment with id ${comment_id}`
        });
    });
}

// Delete Comment
exports.deleteComment = (req, res) => {
    const comment_id = req.params.comment_id;

    Comments.destroy({ where: { comment_id : comment_id} })
    .then(num => {
        if (num == 1) {
            res.send({
                message: `Comment deleted successfully`
            });
        } else {
            res.send({
                message: `Cannot delete comment ${comment_id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: 'Error while deleting comment'
        });
    });
};

// Find comments by User id
exports.findUserComments = (req, res) => {
    const user_id = req.params.user_id;

    Comments.findAll({ where: { user_id: user_id}}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Comments with user id= ${user_id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving Comments with user id= ${user_id}`
        });
    });
}

// Find comments by Event id
exports.findEventComments = (req, res) => {
    const event_id = req.params.event_id;

    Comments.findAll({ where: { event_id: event_id, rating: null}}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Comments with event id= ${event_id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving Comments with event id= ${event_id}`
        });
    });
}

// Find ratings by Event id
exports.findEventRatings = (req, res) => {
    const event_id = req.params.event_id;

    Comments.findAll({ where: { event_id: event_id, text: null}}).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Ratings with event id= ${event_id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: `Error retrieving Ratings with event id= ${event_id}`
        });
    });
}
