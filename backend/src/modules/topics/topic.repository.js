const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const Topic = require(path.join(SRC, "modules", "topics", "topic.model"));

class TopicRepository {
  async findById(id) {
    return Topic.findById(id);
  }

  async findAll() {
    return Topic.find();
  }

  //  CREATE 

  async createTopic(data) {
    const topic = new Topic(data);
    return topic.save();
  }

  //  UPDATE 

  async updateTopic(id, data) {
    return Topic.findByIdAndUpdate(id, data, { new: true });
  }

  //  MODERATORS 

  async addModerator(topicId, login) {
    return Topic.findByIdAndUpdate(
      topicId,
      { $addToSet: { moderators: login } },
      { new: true }
    );
  }

  async removeModerator(topicId, login) {
    return Topic.findByIdAndUpdate(
      topicId,
      { $pull: { moderators: login } },
      { new: true }
    );
  }

  async checkModerator(topicId, login) {
    const topic = await Topic.findById(topicId).select("path");
    if (!topic) return null;

    const topicsToCheck = [...topic.path, topic._id];

    return Topic.exists({
        _id: { $in: topicsToCheck },
        moderators: login
    });
  }

  //  BLOCKED USERS 

  async blockUser(topicId, login) {
    return Topic.findByIdAndUpdate(
      topicId,
      { $addToSet: { blockedUsers: login } },
      { new: true }
    );
  }

  async unblockUser(topicId, login) {
    return Topic.findByIdAndUpdate(
      topicId,
      { $pull: { blockedUsers: login } },
      { new: true }
    );
  }

  async checkBlocked(topicId, login) {
    const topic = await Topic.findById(topicId).select("path");
    if (!topic) return null;

    const topicsToCheck = [...topic.path, topic._id];

    return Topic.exists({
        _id: { $in: topicsToCheck },
        blockedUsers: login
    });
  }

  //  STATE 

  async setClosed(topicId, isClosed) {
    return Topic.findByIdAndUpdate(
      topicId,
      { isClosed },
      { new: true }
    );
  }

  async setHidden(topicId, isHidden) {
    return Topic.findByIdAndUpdate(
      topicId,
      { isHidden },
      { new: true }
    );
  }
}

module.exports = new TopicRepository();
