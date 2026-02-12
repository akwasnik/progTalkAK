const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const { Router } = require("express");

const postController = require(path.join(SRC,"modules","posts","post.controller"));

const authRequired = require(path.join(SRC,"common","middleware","authRequired"));

const router = Router();

router.post(
  "/topics/:topicId/posts",
  authRequired,
  postController.create
);

router.get(
  "/topics/:topicId/posts",
  authRequired,
  postController.getByTopic
);

router.get("/posts/:postId", 
  authRequired,
  postController.getPostById
);

router.post(
  "/posts/:postId/like",
  authRequired,
  postController.toggleLike
);

router.delete(
  "/posts/:postId",
  authRequired,
  postController.delete
);

module.exports = router;
