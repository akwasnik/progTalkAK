import api from "@/services/api";

export const fetchAllUsers = () =>
  api.get("/api/users/getAll").then(res => res.data);

export const fetchNotAllowed = () =>
  api.get("/api/users/getNotAllowed").then(res => res.data);

export const fetchAdmins = () =>
  api.get("/api/users/getAdmins").then(res => res.data);

export const setAdmin = (id, admin) =>
  api.patch(`/api/users/${id}/make-admin`, { admin });

export const setAllowed = (id, allowed) =>
  api.patch(`/api/users/${id}/allow`, { allowed });
