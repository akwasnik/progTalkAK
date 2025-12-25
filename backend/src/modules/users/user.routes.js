const path = require('node:path');
const SRC = path.join(process.cwd(),"src");

const { Router } = require("express");
const userController = require(path.join(SRC,"modules","users","user.controller"));

const authRequired = require(path.join(SRC,"common","middleware","authRequired"));
const adminRequired = require(path.join(SRC,"common","middleware","adminRequired"));

const router = Router();

// ADMIN Required
router.get("/getAll", adminRequired, userController.listAll);
router.get("/getNotAllowed", adminRequired,userController.getNotAllowed);
router.get("/getAdmins", adminRequired, userController.getAdmins);
router.patch("/:id/make-admin", adminRequired, userController.makeAdmin);
router.patch("/:id/allow", adminRequired, userController.setAllowed);
router.delete("/:id", adminRequired, userController.deleteUser);

// AUTH REQUIRED
router.get("/:id", authRequired, userController.getProfile);
router.patch("/:id/password", authRequired, userController.updatePassword);

module.exports = router;
