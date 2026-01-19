const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const postService = require(path.join(SRC,"modules","posts","post.service"));

class PostController {
  async create(req, res, next) {
    try {
      const { topicId } = req.params;
      const { content, tags, references } = req.body;

      const post = await postService.createPost({
        topicId,
        login: req.user.login,
        content,
        tags,
        references
      });

      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }

  async getByTopic(req, res, next) {
    try {
      const { topicId } = req.params;
      const page = Number(req.query.page) || 0;
      const limit = Number(req.query.limit) || 20;

      const posts = await postService.getPostsByTopic(topicId, {
        page,
        limit,
        isAdmin: req.user.isAdmin
      });

      res.json(posts);
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const { postId } = req.params;

      const result = await postService.toggleLike(
        postId,
        req.user.login
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { postId } = req.params;

      await postService.deletePost(
        postId,
        req.user.login
      );

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();