const { Post } = require('../models');

const postdata = [
  {
    
  },
  {
    title: 'Lorem Ipsum II',
    content: 'Amet aliquam id diam maecenas ultricies mi eget mauris pharetra.',
    user_id: 2
  },
  {
    title: 'Lorem Ipsum III',
    content: 'Ut etiam sit amet nisl purus in mollis.',
    user_id: 3
  }
  {
    title: 'Lorem Ipsum III',
    content: 'Ut etiam sit amet nisl purus in mollis.',
    user_id: 4
  }
];

const seedPosts = () => Post.bulkCreate(postdata);

module.exports = seedPosts;