const router = require('express').Router();
const { Comment } = require('../../models');
const userAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Comment.findAll({})
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
        res.status(500).json(err);
    });
});
router.get('/:id', (req, res) => {
    Comment.findAll({
        wjere: {
            id: req.params.id,
        },
    }).then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
        console.log(err);
    });
});

router.post('/:id', userAuth, (req, res) => {
    if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id,
        }).then((dbCommentData) => res.json(dbCommentData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});
