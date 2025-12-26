const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const topicService = require(
  path.join(SRC, "modules", "topics", "topic.service")
);

class TopicController {
  async getAll(_req, res, next) {
    try {
      const topics = await topicService.getAll();
      res.json(topics);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const topic = await topicService.getById(req.params.id);
      res.json(topic);
    } catch (err) {
      next(err);
    }
  }

  async createTopic(req, res, next) {
    try {
      const topic = await topicService.createTopic(
        req.body,
        req.user.login
      );
      res.status(201).json(topic);
    } catch (err) {
      next(err);
    }
  }

  async updateTopic(req, res, next) {
    try {
      const topic = await topicService.updateTopic(
        req.params.id,
        req.body,
        req.user.login,
        req.user.isAdmin
      );
      res.json(topic);
    } catch (err) {
      next(err);
    }
  }

  async addModerator(req, res, next) {
    try {
      const { login } = req.body;

      const topic = await topicService.addModerator(
        req.params.id,
        login,
        req.user.login,
        req.user.isAdmin
      );

      res.json(topic);
    } catch (err) {
      next(err);
    }
  }

  async removeModerator(req, res, next) {
    try {
      const { login } = req.body;

      const topic = await topicService.removeModerator(
        req.params.id,
        login,
        req.user.login,
        req.user.isAdmin
      );

      res.json(topic);
    } catch (err) {
      next(err);
    }
  }

  async blockUser(req, res, next) {
    try {
      const { login } = req.body;

      const topic = await topicService.blockUser(
        req.params.id,
        login,
        req.user.login,
        req.user.isAdmin
      );

      res.json(topic);
    } catch (err) {
      next(err);
    }
  }

  async unblockUser(req, res, next) {
    try {
      const { login } = req.body;

      const topic = await topicService.unblockUser(
        req.params.id,
        login,
        req.user.login,
        req.user.isAdmin
      );

      res.json(topic);
    } catch (err) {
      next(err);
    }
  }

  async setClosed(req, res, next) {
    try {
      const { isClosed } = req.body;

      const topic = await topicService.setClosed(
        req.params.id,
        isClosed,
        req.user.isAdmin
      );

      res.json(topic);
    } catch (err) {
      next(err);
    }
  }

  async setHidden(req, res, next) {
    try {
      const { isHidden } = req.body;

      const topic = await topicService.setHidden(
        req.params.id,
        isHidden,
        req.user.isAdmin
      );

      res.json(topic);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TopicController();
