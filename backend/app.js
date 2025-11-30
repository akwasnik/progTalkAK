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

const userRoutes = require(path.join(SRC,"modules","users","user.routes"))
app.use("/api/users", userRoutes);


module.exports = app;