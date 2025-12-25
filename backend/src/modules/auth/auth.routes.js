const { Router } = require("express");
const path = require('node:path');
const SRC = path.join(process.cwd(),"src");
const authController = require(path.join(SRC,"modules","auth","auth.controller"));
const authRequired = require(path.join(SRC,"common","middleware","authRequired"));

const router = Router();

router.get("/me",authRequired,authController.me);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;
