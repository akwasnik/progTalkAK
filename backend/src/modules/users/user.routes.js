const path = require('node:path');
const SRC = path.join(process.cwd(),"src");

const { Router } = require("express");
const userController = require(path.join(SRC,"modules","users","user.controller"));

const authRequired = require(path.join(SRC,"common","middleware","authRequired"));
const adminRequired = require(path.join(SRC,"common","middleware","adminRequired"));

const router = Router();

// ------- PUBLIC -------
router.post("/register", userController.register);

// ------- AUTH REQUIRED -------
router.get("/:id", authRequired, userController.getProfile);
router.patch("/:id", authRequired, userController.updateUser);

// ------- ADMIN -------
router.patch("/:id/make-admin", adminRequired, userController.makeAdmin);
router.patch("/:id/allow", adminRequired, userController.setAllowed);

router.get("/", adminRequired, userController.listAll);
router.delete("/:id", adminRequired, userController.deleteUser);

module.exports = router;
