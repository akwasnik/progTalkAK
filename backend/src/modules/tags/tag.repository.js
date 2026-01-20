const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const Tag = require(path.join(SRC, "modules", "tags", "tag.model"));

class TagRepository {
  create(data) {
    return Tag.create(data);
  }

  findAll() {
    return Tag.find().sort({ name: 1 }).lean();
  }

  findByName(name) {
    return Tag.findOne({ name });
  }

  findById(id) {
    return Tag.findById(id);
  }

  update(id, data) {
    return Tag.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return Tag.findByIdAndDelete(id);
  }
}

module.exports = new TagRepository();
