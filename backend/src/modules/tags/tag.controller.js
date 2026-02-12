const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const tagService = require(path.join(SRC, "modules", "tags", "tag.service"));

class TagController {
  async getAll(_req, res, next) {
    try {
      const tags = await tagService.getAll();
      res.json(tags);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const tag = await tagService.create(req.body);
      res.status(201).json(tag);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await tagService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TagController();
