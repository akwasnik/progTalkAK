const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const ApiError = require(path.join(SRC, "common", "errors", "ApiError"));
const tagRepository = require(path.join(SRC, "modules", "tags", "tag.repository"));

class TagService {
  async getAll() {
    return tagRepository.findAll();
  }

  async create({ name }) {
    const normalized = name.trim().toLowerCase();

    const existing = await tagRepository.findByName(normalized);
    if (existing) {
      throw ApiError.conflict("Tag already exists");
    }

    return tagRepository.create({ name: normalized });
  }
  
  async remove(id) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw ApiError.notFound("Tag not found");
    }

    await tagRepository.delete(id);
  }
}

module.exports = new TagService();
