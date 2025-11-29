const express = require("express");
const cors = require("cors");
const path = require("node:path");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({origin: env.FRONTEND_URL, credentials: true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

module.exports = app;