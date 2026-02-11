import api from "@/services/api";

export const fetchTopics = () =>
  api.get("/topics").then(res => res.data);

export const fetchTopicsPageable = ({ page = 0, limit = 20 } = {}) =>
  api.get(`/topics`, {
      params: { page, limit }
    })
    .then(res => res.data);

export const fetchTopic = (topicId) =>
  api.get(`/topics/${topicId}`).then(res => res.data);

export const patchToggleTopicHidden = (topic) =>
    api.patch(`/topics/${topic._id}/hidden`, {
    isHidden: !topic.isHidden
  }); 

export const patchToggleTopicClosed = (topic) =>
    api.patch(`/topics/${topic._id}/closed`, {
    isClosed: !topic.isClosed
  });

export const postTopic = (name,description) =>
    api.post("/topics", {
      name: name,
      description: description
    }).then(res => res.data);

export const patchTopic = (topic,name,description) => 
    api.patch(`/topics/${topic._id}`,{
      name,
      description
    });

export const postSubtopic = (name,description,parentId) =>
    api.post("/topics", {
      name: name,
      description: description,
      parent: parentId
    }).then(res => res.data);




export const checkIsModerator = (topic) =>
    api.get(`/topics/${topic._id}/isModerator`).then(res => res.data);

export const getModerators = (id) => 
    api.get(`/topics/${id}/moderators`).then(res => res.data)

export const addModerator = (id, login) =>
    api.patch(`/topics/${id}/moderators/add`, { login });

export const removeModerator = (id, login) =>
    api.patch(`/topics/${id}/moderators/remove`, { login });



export const checkAccess = (topic) =>
    api.get(`/topics/${topic._id}/access`).then(res => res.data);

export const getBlocked = (id) => 
    api.get(`/topics/${id}/blocked`).then(res => res.data)

export const blockUser = (id, login) =>
    api.patch(`/topics/${id}/block`, { login });

export const fullBlockUser = (id, login) =>
    api.patch(`/topics/${id}/fullBlock`, { login });

export const unblockUser = (id, login) =>
    api.patch(`/topics/${id}/unblock`, { login });

export const fullUnblockUser = (id, login) =>
    api.patch(`/topics/${id}/fullUnblock`, { login });
