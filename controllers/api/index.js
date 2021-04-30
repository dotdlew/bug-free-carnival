  
const router = require('express').Router();
const user = require('./user.js');
const post = require('./post.js');
const comment = require('./comment.js');
router.use('/users', user);
router.use('/posts', post);
router.use('/comments', comment);

module.exports = router;