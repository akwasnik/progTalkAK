import api from "@/services/api";

export const fetchTopics = () =>
  api.get("/api/topics").then(res => res.data);

export const fetchTopic = (topicId) =>
  api.get(`/api/topics/${topicId}`).then(res => res.data);

export const patchToggleTopicHidden = (topic) =>
    api.patch(`/api/topics/${topic._id}/hidden`, {
    isHidden: !topic.isHidden
  }); 

export const patchToggleTopicClosed = (topic) =>
    api.patch(`/api/topics/${topic._id}/closed`, {
    isClosed: !topic.isClosed
  });

export const postTopic = (name,description) =>
    api.post("/api/topics", {
      name: name,
      description: description
    }).then(res => res.data);

export const patchTopic = (topic,name,description) => 
    api.patch(`/api/topics/${topic._id}`,{
      name,
      description
    });

export const postSubtopic = (name,description,parentId) =>
    api.post("/api/topics", {
      name: name,
      description: description,
      parent: parentId
    }).then(res => res.data);




export const checkIsModerator = (topic) =>
    api.get(`/api/topics/${topic._id}/isModerator`).then(res => res.data);

export const getModerators = (id) => 
    api.get(`/api/topics/${id}/moderators`).then(res => res.data)

export const addModerator = (id, login) =>
    api.patch(`/api/topics/${id}/moderators/add`, { login });

export const removeModerator = (id, login) =>
    api.patch(`/api/topics/${id}/moderators/remove`, { login });



export const checkAccess = (topic) =>
    api.get(`/api/topics/${topic._id}/access`).then(res => res.data);

export const getBlocked = (id) => 
    api.get(`/api/topics/${id}/blocked`).then(res => res.data)

export const blockUser = (id, login) =>
    api.patch(`/api/topics/${id}/block`, { login });

export const fullBlockUser = (id, login) =>
    api.patch(`/api/topics/${id}/fullBlock`, { login });

export const unblockUser = (id, login) =>
    api.patch(`/api/topics/${id}/unblock`, { login });

export const fullUnblockUser = (id, login) =>
    api.patch(`/api/topics/${id}/fullUnblock`, { login });
