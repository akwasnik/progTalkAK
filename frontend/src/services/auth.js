import api from "@/services/api";

export async function fetchMe() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function login(login, password) {
  await api.post("/auth/login", { login, password });
}

export async function register(login, password) {
  await api.post("/auth/register", { login, password });
}

export async function logout() {
  await api.post("/auth/logout");
}
