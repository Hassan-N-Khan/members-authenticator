const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();

const path = require("path");
const { Pool } = require("pg");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: process.env.PG_HOST, // or wherever the db is hosted
  user: process.env.PG_USER,
  database: process.env.PG_NAME,
  port: process.env.PG_PORT, // The default port
  password: process.env.PG_PASSWORD
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../client")));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [req.body.username, hashedPassword]
    );

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, error: "Signup failed" });
  }
});


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = rows[0];

        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
        }

            return done(null, user);
        } catch(err) {
            return done(err);
        }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.post("/log-in", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.json({ success: false, message: info.message });

    req.login(user, (err) => {
      if (err) return next(err);
      // Successful login
      return res.json({ success: true, user: { username: user.username, id: user.id } });
    });
  })(req, res, next);
});

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
});

app.get("/session", (req, res) => {
  if (req.user) {
    return res.json({ loggedIn: true, user: req.user });
  }
  res.json({ loggedIn: false });
});

app.get("/messages", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT username, message, created_at FROM messages ORDER BY created_at ASC"
    );
    res.json({ success: true, messages: rows });
  } catch (err) {
    console.error("DB FETCH ERROR:", err);
    res.json({ success: false, messages: [] });
  }
});



app.post("/messages", async (req, res) => {
  const { user, message } = req.body;

  if (!user || !message) {
    return res.json({ success: false, error: "Missing fields" });
  }

  try {
    await pool.query(
      "INSERT INTO messages (username, message) VALUES ($1, $2)",
      [user, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("DB INSERT ERROR:", err);
    res.json({ success: false, error: err.message });
  }
});



app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(5001, () => console.log("Server running on port 5001"));