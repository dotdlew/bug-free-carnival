
const passport = require('passport')
const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login'}) (req, res, next)
});

router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ["(password)"] },
    }).then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ["(password)"] },
        where: {
            id: req.params.id,
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at'],
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "created_at"],
                include: {
                    model: Post,
                    attributes: ['title', 'content'],
                }
            },
            {
                model: Post,
                attributes: ['title', 'content']
            },
        ],
    }).then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user was found with this id.' })
            return;
        }
        res.json(dbUserData);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
    }).then((dbUserData) => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

