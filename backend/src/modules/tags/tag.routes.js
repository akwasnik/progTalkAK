const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const { Router } = require("express");

const tagController = require(path.join(SRC, "modules", "tags", "tag.controller"));
const authRequired = require(path.join(SRC, "common", "middleware", "authRequired"));
const adminRequired = require(path.join(SRC, "common", "middleware", "adminRequired"));

const router = Router();

router.get("/", authRequired, tagController.getAll);
router.post("/", authRequired, adminRequired, tagController.create);
router.delete("/:id", authRequired, adminRequired, tagController.remove);

module.exports = router;
