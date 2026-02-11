const express = require("express");
const cors = require("cors");
const path = require("node:path");
const fs = require("node:fs");
const SRC = path.join(process.cwd(),"src")
const PUBLIC_DIR = path.join(process.cwd(), "public");
const INDEX_FILE = path.join(PUBLIC_DIR, "index.html");
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
app.use("/api/topics", topicRoutes);

// POSTS
const postRoutes = require(path.join(SRC,"modules","posts","post.routes"));
app.use("/api", postRoutes);

// TAGS
const tagRoutes = require(path.join(SRC,"modules","tags","tag.routes"));
app.use("/api/tags",tagRoutes)

app.use(express.static(PUBLIC_DIR));

app.get(/^(?!\/api).*/, (req, res, next) => {
	if (!fs.existsSync(INDEX_FILE)) {
		return next();
	}
	res.sendFile(INDEX_FILE);
});

const errorMiddleware = require(path.join(SRC,"common","errors","error-middleware"))
app.use(errorMiddleware);

module.exports = app;