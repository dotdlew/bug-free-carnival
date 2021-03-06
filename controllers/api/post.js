const router = require("express").Router(); // import router
const { Post, User, Comment } = require("../../models"); // required for these routes
const sequelize = require("../../config/connection"); // connect to the database
const userAuth = require("../../utils/auth"); //ensure user is logged in


router.get('/', (req, res) => {
    console.log('===========');
    Post.findAll({
        attributes: ["id", "title", "content", "created_at"],
    order: [["created_at", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
    }).then((dbPostData) => res.json(dbPostData.reverse()))
    .catch((err => {
        console.log(err);
        res.status(500).json(err);
    }));
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ["id", "content", "title", "created_at"],
        include: [
            {
                model: User,
                attributes: ['username'],
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
        ],
    }).then((dbPostData) => {
        if (!dbPostData) {
            req.status(404).json({ message: 'No post found with that id.' });
            return;
        }
        res.json(dbPostData);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.post('/', userAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id,
    }).then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id', userAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            content: req.body.content,
        },
        {
            where: {
                id: req.params.id,
            }
        }
    ).then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post was found with this id.' });
            return;
        }
        res.json(dbPostData);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', userAuth, (req, res) => {
   Post.destroy({
       where: {
           id: req.params.id,
       },
   }).then((dbPostData) => {
       if (!dbPostData) {
           res.status(404).json({ message: 'No post was found with this id.' });
           return;
       }
       res.json(dbPostData);
   }).catch((err) => {
       console.log(err);
       res.status(500).json(err);
   })
});

module.exports = router;