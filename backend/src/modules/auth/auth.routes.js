const { Router } = require("express");
const path = require('node:path');
const SRC = path.join(process.cwd(),"src");
const authController = require(path.join(SRC,"modules","auth","auth.controller"));

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;
