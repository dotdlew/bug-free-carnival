const { User } = require("../models");

const userData = [
  {
    username: "TEST_USER_1",
    email: "TEST_EMAIL_1@ema.il",
    password: "TEST_PASSWORD_1",
    id: 1,
  },
  {
    username: "TEST_USER_2",
    email: "TEST_EMAIL_2@ema.il",
    password: "TEST_PASSWORD_2",
    id: 2,
  },
  {
    username: "TEST_USER_3",
    email: "TEST_EMAIL_3@ema.il",
    password: "TEST_PASSWORD_3",
    id: 3,
  },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;

// INSERT INTO userPosts (name, description)
// VALUES
//     ('TEST_NAME_1','TEST_DESC_1'),
//     ('TEST_NAME_2','TEST_DESC_2'),
//     ('TEST_NAME_3','TEST_DESC_3');

// INSERT INTO userLogins (username, email, password)
// VALUES
//     ("user1", "u1@ema.il", "passw1rd"),
//     ("user2", "u2@ema.il", "passw2rd"),
//     ("user3", "u3@ema.il", "passw3rd");
