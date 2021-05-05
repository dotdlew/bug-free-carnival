const router = require("express").Router(); // import router
const { Post, User, Comment } = require("../../models"); // required for these routes
const sequelize = require("../../config/connection"); // connect to the database
const withAuth = require("../../utils/auth"); //ensure user is logged in


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
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    
})

router.post('/', (req, res) => {
    Post.create({
        
    })
});