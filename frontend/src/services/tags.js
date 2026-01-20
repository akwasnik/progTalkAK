import api from "@/services/api";

export const fetchTags = () =>
  api.get("/api/tags").then(res => res.data);

export const createTag = ({ name }) =>
  api.post("/api/tags", { name }).then(res => res.data);

export const deleteTag = (id) =>
  api.delete(`/api/tags/${id}`);
