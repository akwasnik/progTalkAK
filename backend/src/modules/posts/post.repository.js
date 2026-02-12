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
      "likes.userLogin": login
    });
  }

  async addLike(postId, login) {
    return Post.updateOne(
      { _id: postId, "likes.userLogin": { $ne: login } },
      { $addToSet: { likes: { userLogin: login, isValid: true } } }
    );
  }

  async removeLike(postId, login) {
    return Post.updateOne(
      { _id: postId },
      { $pull: { likes: { userLogin: login } } }
    );
  }

  async setLikesValidityByUser(login, isValid) {
    return Post.updateMany(
      { "likes.userLogin": login },
      { $set: { "likes.$[like].isValid": isValid } },
      { arrayFilters: [{ "like.userLogin": login }] }
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
