const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const { Router } = require("express");

const topicController = require(path.join(SRC, "modules", "topics", "topic.controller"));

const authRequired = require(path.join(SRC, "common", "middleware", "authRequired"));

const router = Router();


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

router.get("/:id/moderators", authRequired, topicController.getAllModerators);

router.get(
  "/:id/isModerator",
  authRequired,
  topicController.checkIsModerator
);

router.patch(
  "/:id/block",
  authRequired,
  topicController.blockUser
);

router.patch(
  "/:id/fullBlock",
  authRequired,
  topicController.blockUserRecursively
);

router.patch(
  "/:id/unblock",
  authRequired,
  topicController.unblockUser
);

router.patch(
  "/:id/fullUnblock",
  authRequired,
  topicController.unblockUserRecursively
);

router.get("/:id/blocked", authRequired, topicController.getAllBlocked);

router.get(
  "/:id/access",
  authRequired,
  topicController.checkAccess
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
