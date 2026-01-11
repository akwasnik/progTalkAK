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

  async getAllModerators(topicId) {
    const topic = await Topic.findById(topicId).select("path");
    if (!topic) return null;

    const topicsToCheck = [...topic.path, topic._id];

    const result = await Topic.aggregate([
      {
        $match: {
          _id: { $in: topicsToCheck }
        }
      },
      {
        $project: {
          moderators: 1
        }
      },
      {
        $unwind: "$moderators"
      },
      {
        $group: {
          _id: null,
          moderators: { $addToSet: "$moderators" }
        }
      }
    ]);

    return result[0].moderators;
  }

  async checkModerator(topicId, login) {
    const topic = await Topic.findById(topicId).select("path");
    if (!topic) return false;

    const topicsToCheck = [...topic.path, topic._id];

    return Boolean(
      await Topic.exists({
        _id: { $in: topicsToCheck },
        moderators: login,
      })
    );
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

  async getAllBlocked(topicId) {
    const topic = await Topic.findById(topicId).select("path");
    if (!topic) return [];

    const topicsToCheck = [...topic.path, topic._id];

    const result = await Topic.aggregate([
      {
        $match: {
          _id: { $in: topicsToCheck }
        }
      },
      {
        $project: {
          blockedUsers: 1
        }
      },
      {
        $unwind: "$blockedUsers"
      },
      {
        $group: {
          _id: null,
          blockedUsers: { $addToSet: "$blockedUsers" }
        }
      }
    ]);

    return result[0].blockedUsers;
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
