const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

require("dotenv").config();
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
