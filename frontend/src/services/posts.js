import api from "@/services/api";

export const fetchPostById = async (postId) => 
  await api.get(`/posts/${postId}`).then(res => res.data);

export const fetchPostsByTopic = (topicId, { page = 0, limit = 20 } = {}) =>
  api
    .get(`/topics/${topicId}/posts`, {
      params: { page, limit }
    })
    .then(res => res.data);

export const createPost = (topicId, content, tags = [], references = []) =>
  api
    .post(`/topics/${topicId}/posts`, {
      content,
      tags,
      references
    })
    .then(res => res.data);

export const toggleLikePost = (postId) =>
  api
    .post(`/posts/${postId}/like`)
    .then(res => res.data);

export const deletePost = (postId) =>
  api.delete(`/posts/${postId}`);
