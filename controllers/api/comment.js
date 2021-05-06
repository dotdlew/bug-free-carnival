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

router.post('/', userAuth, (req, res) => {
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

router.put('/:id', userAuth, (req, res) => {
    Comment.update(
        {
            comment_text: req.body.comment_text,
        },
        {
            where: {
                id: req.params.id,
            }
        }
    ).then((dbCommentData) => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'No comment was found with this id.' });
            return;
        }
        res.json(dbCommentData);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete("/:id", userAuth, (req, res) => {
    Comment.destroy({
    where: {
        id: req.params.id,
    },
    }).then((dbCommentData) => {
    if (!dbCommentData) {
        res.status(404).json({ message: "No comment found with this id" });
        return;
        }
        res.json(dbCommentData);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;