const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const { Router } = require("express");
const topicController = require(
  path.join(SRC, "modules", "topics", "topic.controller")
);

const authRequired = require(
  path.join(SRC, "common", "middleware", "authRequired")
);

const router = Router();

/*
  Wszystkie operacje na topicach
  wymagają zalogowania
*/

// GET /topics
router.get("/", authRequired, topicController.getAll);

router.get("/:id", authRequired, topicController.getById);

router.post("/", authRequired, topicController.createTopic);

router.patch("/:id", authRequired, topicController.updateTopic);

router.patch(
  "/:id/moderators/add",
  authRequired,
  topicController.addModerator
);

router.patch(
  "/:id/moderators/remove",
  authRequired,
  topicController.removeModerator
);

router.patch(
  "/:id/block",
  authRequired,
  topicController.blockUser
);

router.patch(
  "/:id/unblock",
  authRequired,
  topicController.unblockUser
);

router.patch(
  "/:id/closed",
  authRequired,
  topicController.setClosed
);

router.patch(
  "/:id/hidden",
  authRequired,
  topicController.setHidden
);

module.exports = router;
