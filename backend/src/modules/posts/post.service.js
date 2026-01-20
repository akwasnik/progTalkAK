const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const ApiError = require(path.join(SRC, "common", "errors", "ApiError"));
const postRepository = require(path.join(SRC, "modules", "posts", "post.repository"));
const topicRepository = require(path.join(SRC, "modules", "topics", "topic.repository"));
const userRepository = require(path.join(SRC,"modules","users","user.repository"));
const { emitToTopic } = require(path.join(SRC,"sockets","socket"));



class PostService {
  async createPost({ topicId, login, content, tags = [], references = [] }) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    if (topic.isClosed) {
      throw ApiError.forbidden("Topic is closed");
    }

    const blocked = await topicRepository.checkBlocked(topicId, login);
    if (blocked) {
      throw ApiError.forbidden("User is blocked in this topic");
    }
    
    const post = await postRepository.create({
      topic: topicId,
      login,
      content,
      tags,
      references
    });

    emitToTopic(topicId, "post-created", post);

    return post;
  }

  async getPostById(postId) {
    const post = await postRepository.findById(postId);

    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    return post
  }

  async getPostsByTopic(topicId, { page = 0, limit = 20, isAdmin = false } = {}) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    return postRepository.findByTopic(topicId, { page, limit, isAdmin });
  }

  async toggleLike(postId, login) {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    const liked = await postRepository.hasUserLiked(postId, login);

    if (liked) {
      await postRepository.removeLike(postId, login);
      return { liked: false };
    }

    await postRepository.addLike(postId, login);
    return { liked: true };
  }

  async deletePost(postId, login) {
    const post = await postRepository.findById(postId);
    const user = await userRepository.findByLogin(login);

    if (!post || post.isDeleted) {
      throw ApiError.notFound("Post not found");
    }

    if (post.author !== user.login && !user.isAdmin) {
      throw ApiError.forbidden("No permission to delete this post");
    }

    await postRepository.delete(postId);
  }
}

module.exports = new PostService();
