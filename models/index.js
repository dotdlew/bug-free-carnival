const User = require("./User");
const Comment = require("./Comment");
const Post = require("./Post")

User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belondsTo(User, {
    foreignKey: 'user_id',
    onDelete: "cascade"
});

Comment.belondsTo(User, {
    foreignKey: 'user_id',
    onDelete: "cascade"
});

Comment.belondsTo(Post, {
    foreignKey: 'post_id',
    onDelete: "cascade"
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: "cascade"
});

Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: "cascade"
});

module.exports = { User, Post, Comment };
