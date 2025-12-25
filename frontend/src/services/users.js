import api from "@/services/api";

export const fetchAllUsers = () =>
  api.get("/users/getAll").then(res => res.data);

export const fetchNotAllowed = () =>
  api.get("/users/getNotAllowed").then(res => res.data);

export const fetchAdmins = () =>
  api.get("/users/getAdmins").then(res => res.data);

export const setAdmin = (id, admin) =>
  api.patch(`/users/${id}/make-admin`, { admin });

export const setAllowed = (id, allowed) =>
  api.patch(`/users/${id}/allow`, { allowed });
