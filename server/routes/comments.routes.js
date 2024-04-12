module.exports = app => {
    const comment = require('../controllers/comments.controller');

    var router = require('express').Router();

    // Create comment
    router.post('/createComment', comment.createComment);

    // Delete a comment
    router.delete('/deleteComment/:comment_id', comment.deleteComment);

    // Find Comments by user id
    router.get('/findUserComments/:user_id', comment.findUserComments);

    // Find Comments by event id
    router.get('/findEventComments/:event_id', comment.findEventComments);

    app.use('/api/comments', router);
}