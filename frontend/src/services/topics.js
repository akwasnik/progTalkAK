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

export const checkAccess = (topic) =>
    api.get(`/api/topics/${topic._id}/access`).then(res => res.data);


export const checkIsModerator = (topic) =>
    api.get(`/api/topics/${topic._id}/isModerator`).then(res => res.data);