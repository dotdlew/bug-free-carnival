require("dotenv").config();
const inputCheck = require("./utils/inputCheck");
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
app.post("/api/users", ({ body }, res) => {
  const errors = inputCheck(body, "username", "email", "password");

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO userLogins (id, username, email, password)
    VALUES (?,?,?,?)`;
  const params = [body.username, body.email, body.password];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
});

// DELETE a userLogins
app.delete("/api/users/:id", (req, res) => {
  const sql = `DELETE FROM userLogins WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "user not found",
      });
    } else {
      res.json({
        message: "user deleted",
        changes: result.affectedRows,
        id: req.params.id,
      });
    }
  });
});

// GET all userLogins
app.get("/api/users", (req, res) => {
  const sql = `SELECT * FROM userLogins`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Get a single userLogins
app.get("/api/users/:id", (req, res) => {
  const sql = `SELECT * FROM userLogins WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

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
