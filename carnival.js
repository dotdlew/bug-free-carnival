require("dotenv").config();
const inputCheck = require("./utils/inputCheck");
const routes = require("./controllers");
const express = require("express");
const mysql = require("mysql2");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const exphbs = require("express-handlebars");
const helpers = require("./utils/helpers");
const hbs = exphbs.create({ helpers });
const methodOverride = require("method-override");

const PORT = process.env.PORT || 3001;

const initializePassport = require("./config/passport");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.engine("handlebars", hbs.engine);
app.set("view-engine", "handlebars");

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const users = [];

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
// app.use((req, res) => {
//   res.status(404).end();
// });

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT}`);
});

//for login

app.get("/", checkAuthenticated, (req, res) => {
  res.render("homepage.handlebars");
});

// app.get('/login', checkNotAuthenticated, (req, res) => {
//   res.render('./public/login.handlebars')
// })
app.get("/login", (req, res) => {
  console.log("Testing");
  res.render("login.handlebars");
});

app.post("/login", async (req, res) => {
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/login");
  }
  console.log(users);
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
