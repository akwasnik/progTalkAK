import api from "@/services/api";

export const fetchTags = () =>
  api.get("/tags").then(res => res.data);

export const createTag = ({ name }) =>
  api.post("/tags", { name }).then(res => res.data);

export const deleteTag = (id) =>
  api.delete(`/tags/${id}`);
