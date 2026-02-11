const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const topicRepository = require(path.join(SRC, "modules", "topics", "topic.repository"));
const ApiError = require(path.join(SRC, "common", "errors", "ApiError"));
const userRepository = require(path.join(SRC,"modules","users","user.repository"));


class TopicService {
    
  async getById(id) {
    const topic = await topicRepository.findById(id);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }
    return topic;
  }

  async getAllPageable({ page = 0, limit = 20} = {}) {
    return topicRepository.findAllPageable({ page, limit });
  }

  async getAll() {
    return topicRepository.findAll();
  }

  async createTopic(data, userLogin) {
    if (!data.name) {
      throw ApiError.badRequest("Topic name is required");
    }

    const topicData = {
      name: data.name,
      description: data.description || "",
      parent: data.parent || null,
      createdBy: userLogin,
      moderators: [userLogin],
      blockedUsers: [],
      path: []
    };

    if (data.parent) {
      const parent = await topicRepository.findById(data.parent);
      if (!parent) {
        throw ApiError.notFound("Parent topic not found");
      }

      topicData.path = [...parent.path, parent._id];
    }

    const topic = await topicRepository.createTopic(topicData);

    return topic;
  }


  async updateTopic(id, data, userLogin, isAdmin) {
    const topic = await topicRepository.findById(id);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    if (!isAdmin && topic.createdBy !== userLogin) {
      throw ApiError.forbidden("No permission to update topic");
    }

    return topicRepository.updateTopic(id, data);
  }

// MODERATORS

  async addModerator(topicId, loginToAdd, userLogin, isAdmin) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    const isModerator = await topicRepository.checkModerator(topicId, userLogin);
    const isLoginToAddModerator = await topicRepository.checkModerator(topicId, loginToAdd);
    const isLoginToAddAdmin = await userRepository.findByLogin(loginToAdd)
    if(!isLoginToAddAdmin){
      throw ApiError.badRequest("Login not found");
    }

    if(isLoginToAddModerator || isLoginToAddAdmin.isAdmin){
      throw ApiError.forbidden("Login is already moderator or admin");
    }

    if (!isAdmin && !isModerator) {
      throw ApiError.forbidden("Only moderators or admins can add moderators");
    }

    return topicRepository.addModerator(topicId, loginToAdd);
  }

  async removeModerator(topicId, loginToRemove, userLogin, isAdmin) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    if(loginToRemove === topic.createdBy){
      throw ApiError.badRequest("Cant remove main moderator");
    }

    const isModerator = await topicRepository.checkModerator(topicId, userLogin);
    const isLoginToRemoveModerator = await topicRepository.checkModerator(topicId, loginToRemove);

    if(!isLoginToRemoveModerator){
      throw ApiError.notFound("User is not a moderator");
    }

    if (!isAdmin && !isModerator) {
      throw ApiError.forbidden("Only moderators or admins can remove moderators");
    }

    return topicRepository.removeModerator(topicId, loginToRemove);
  }

  async getAllModerators(topicId, userLogin, isAdmin) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    const isModerator = await topicRepository.checkModerator(topicId, userLogin);

    if (!isAdmin && !isModerator) {
      throw ApiError.forbidden("No permission to view moderators");
    }

    const allModerators = await topicRepository.getAllModerators(topicId)
    return allModerators;
  }

  async checkIsModerator(topicId, userLogin) {
    const isModerator = await topicRepository.checkModerator(topicId, userLogin);

    return (isModerator) ? true : false;
  }


// BLOCKED

  async blockUser(topicId, loginToBlock, userLogin, isAdmin) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    if(loginToBlock === topic.createdBy){
      throw ApiError.badRequest("Cant block main moderator");
    }

    const isModerator = await topicRepository.checkModerator(topicId, userLogin);
    const isLoginToBlockModerator = await topicRepository.checkModerator(topicId, loginToBlock);
    const isLoginToBlockBlocked = await topicRepository.checkBlocked(topicId, loginToBlock);
    const isLoginToBlockAdmin = await userRepository.findByLogin(loginToBlock)

    if(isLoginToBlockBlocked){
      throw ApiError.badRequest("User is already blocked");
    }

    if( isLoginToBlockModerator || isLoginToBlockAdmin.isAdmin){
      throw ApiError.forbidden("Moderators or Admins cant be blocked");
    }

    if (!isAdmin && !isModerator) {
      throw ApiError.forbidden("Only moderators or admins can block users");
    }

    return topicRepository.blockUser(topicId, loginToBlock);
  }

  async blockUserRecursively(topicId, loginToBlock, userLogin, isAdmin) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    if(loginToBlock === topic.createdBy){
      throw ApiError.badRequest("Cant block main moderator");
    }

    const isModerator = await topicRepository.checkModerator(topicId, userLogin);
    const isLoginToBlockModerator = await topicRepository.checkModerator(topicId, loginToBlock);
    const isLoginToBlockBlocked = await topicRepository.checkBlocked(topicId, loginToBlock);
    const isLoginToBlockAdmin = await userRepository.findByLogin(loginToBlock)

    if(isLoginToBlockBlocked){
      throw ApiError.badRequest("User is already blocked");
    }

    if( isLoginToBlockModerator || isLoginToBlockAdmin.isAdmin){
      throw ApiError.forbidden("Moderators or Admins cant be blocked");
    }

    if (!isAdmin && !isModerator) {
      throw ApiError.forbidden("Only moderators or admins can block users");
    }

    return topicRepository.blockUserRecursive(topicId, loginToBlock);
  }

  async unblockUser(topicId, loginToUnblock, userLogin, isAdmin) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    const isModerator = await topicRepository.checkModerator(topicId, userLogin);
    const isLoginToUnBlockBlocked = await topicRepository.checkBlocked(topicId, loginToUnblock);

    if(!isLoginToUnBlockBlocked){
        throw ApiError.badRequest("User is not blocked")
    }

    if (!isAdmin && !isModerator) {
      throw ApiError.forbidden("Only moderators or admins can unblock users");
    }

    return topicRepository.unblockUser(topicId, loginToUnblock);
  }
  
  async unblockUserRecursively(topicId, loginToUnblock, userLogin, isAdmin) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    const isModerator = await topicRepository.checkModerator(topicId, userLogin);
    const isLoginToUnBlockBlocked = await topicRepository.checkBlocked(topicId, loginToUnblock);

    if(!isLoginToUnBlockBlocked){
        throw ApiError.badRequest("User is not blocked")
    }

    if (!isAdmin && !isModerator) {
      throw ApiError.forbidden("Only moderators or admins can unblock users");
    }

    return topicRepository.unblockUserRecursive(topicId, loginToUnblock);
  }

  async checkAccess(topicId, userLogin) {
    const isBlocked = await topicRepository.checkBlocked(topicId, userLogin);

    return (isBlocked) ? false : true;
  }

  async getAllBlocked(topicId, userLogin, isAdmin) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    const isModerator = await topicRepository.checkModerator(topicId, userLogin);

    if (!isAdmin && !isModerator) {
      throw ApiError.forbidden("No permission to view blocked users");
    }
    const allBlocked = await topicRepository.getAllBlocked(topicId)
    return allBlocked;
  }

// STATE

  async setClosed(topicId, isClosed, isAdmin) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    if (!isAdmin) {
      throw ApiError.forbidden("Only admins can close topic");
    }

    return topicRepository.setClosed(topicId, isClosed);
  }

  async setHidden(topicId, isHidden, isAdmin) {
    const topic = await topicRepository.findById(topicId);
    if (!topic) {
      throw ApiError.notFound("Topic not found");
    }

    if (!isAdmin) {
      throw ApiError.forbidden("Only admins can hide topics");
    }

    return topicRepository.setHidden(topicId, isHidden);
  }

}

module.exports = new TopicService();
