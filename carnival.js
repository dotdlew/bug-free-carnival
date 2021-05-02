require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
  },
  console.log("Connected to the carnival_db database.")
);

// CREATE a userLogins
const sql = `INSERT INTO userLogins (id, username, email, password)
              VALUES (?,?,?,?)`;
const params = [1, "username", "email", "password"];

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});

// DELETE a userLogins
// db.query(`DELETE FROM userLogins WHERE id = ?`, 1, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// GET all userLogins
// db.query(`SELECT * FROM userLogins`, (err, rows) => {
//   console.log(rows);
// });

// GET a single userLogins
// db.query(`SELECT * FROM userLogins WHERE id = 1`, (err, row) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(row);
// });

// Test the Express.js Connection
app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

// route to handle user requests that aren't supported by the app
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT}`);
});
