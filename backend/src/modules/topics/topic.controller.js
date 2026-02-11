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

  async getAllPageable(req, res, next) {
    try {
      const page = Number(req.query.page) || 0;
      const limit = Number(req.query.limit) || 20;
      const topics = await topicService.getAllPageable({page,limit});
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

  async getAllModerators(req, res, next) {
    try {
      const moderators = await topicService.getAllModerators(
        req.params.id,
        req.user.login,
        req.user.isAdmin
      );

      res.json(moderators);
    } catch (err) {
      next(err);
    }
  }

  async checkIsModerator(req, res, next) {
    try {
      const isModerator = await topicService.checkIsModerator(
        req.params.id,
        req.user.login
      );

      res.json({ isModerator });
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

  async blockUserRecursively(req, res, next) {
    try {
      const { login } = req.body;

      const topic = await topicService.blockUserRecursively(
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

  async unblockUserRecursively(req, res, next) {
    try {
      const { login } = req.body;

      const topic = await topicService.unblockUserRecursively(
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

  async getAllBlocked(req, res, next) {
    try {
      const blockedUsers = await topicService.getAllBlocked(
        req.params.id,
        req.user.login,
        req.user.isAdmin
      );

      res.json(blockedUsers);
    } catch (err) {
      next(err);
    }
  }

  async checkAccess(req, res, next) {
    try {
      const access = await topicService.checkAccess(
        req.params.id,
        req.user.login
      );

      res.json({ access });
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
