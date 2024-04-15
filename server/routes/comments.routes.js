module.exports = app => {
    const comment = require('../controllers/comments.controller');

    var router = require('express').Router();

    // Create comment
    router.post('/createComment', comment.createComment);

    // Create a rating comment
    router.post('/createRating', comment.createRating);

    // Delete a comment
    router.delete('/deleteComment/:comment_id', comment.deleteComment);

    // Modify a comment
    router.patch('/editComment/:comment_id', comment.editComment);

    // Find Comments by user id
    router.get('/findUserComments/:user_id', comment.findUserComments);

    // Find Comments by event id
    router.get('/findEventComments/:event_id', comment.findEventComments);

    // Find rating by event id
    router.get('/findEventRatings/:event_id', comment.findEventRatings);

    app.use('/api/comments', router);
}