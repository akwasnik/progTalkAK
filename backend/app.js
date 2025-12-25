const express = require("express");
const cors = require("cors");
const path = require("node:path");
const SRC = path.join(process.cwd(),"src")
const cookieParser = require("cookie-parser");
const conf = require(path.join(SRC, 'config',));

const app = express();
app.use(cors({origin: conf.FRONTEND_URL, credentials: true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// USER
const userRoutes = require(path.join(SRC,"modules","users","user.routes"))
app.use("/api/users", userRoutes);


// AUTH
const passport = require("passport");
const passportConfig = require(path.join(SRC,"common","utils","passport"));

passportConfig(passport);

app.use(passport.initialize());

const authRoutes = require(path.join(SRC,"modules","auth","auth.routes"))
app.use("/api/auth", authRoutes);

// TOPICS
const topicRoutes = require(path.join(SRC,"modules","topics","topic.routes"))


const errorMiddleware = require(path.join(SRC,"common","errors","error-middleware"))
app.use(errorMiddleware);

module.exports = app;