const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const Post = require(path.join(SRC, "modules", "posts", "post.model"));

class PostRepository {
  async create(data) {
    return Post.create(data);
  }

  async findById(postId) {
    return Post.findById(postId)
      .populate("topic", "name");
  }

  async findByTopic(topicId, { page = 0, limit = 20, isAdmin = false} = {}) {
    const query = (isAdmin) ? {topic: topicId} : {
      topic: topicId,
      isDeleted: false
    };

    return Post.find(query)
      .populate("topic", "name")
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean();
  }

  async countByTopic(topicId, { tag } = {}) {
    const query = {
      topic: topicId,
      isDeleted: false
    };

    if (tag) {
      query.tags = tag;
    }

    return Post.countDocuments(query);
  }

  async hasUserLiked(postId, login) {
    return Post.exists({
      _id: postId,
      likes: login
    });
  }

  async addLike(postId, login) {
    return Post.updateOne(
      { _id: postId },
      { $addToSet: { likes: login } }
    );
  }

  async removeLike(postId, login) {
    return Post.updateOne(
      { _id: postId },
      { $pull: { likes: login } }
    );
  }

  async delete(postId) {
    return Post.updateOne(
      { _id: postId },
      { isDeleted: true }
    );
  }
}

module.exports = new PostRepository();
