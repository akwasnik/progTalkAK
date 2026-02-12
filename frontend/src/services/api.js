import axios from "axios";

const isLocalhostHost = (host) =>
  host === "localhost" || host === "127.0.0.1" || host === "::1";

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (!envUrl) return "/api";
  if (envUrl.startsWith("/")) return envUrl;

  try {
    const parsed = new URL(envUrl);

    if (
      typeof window !== "undefined" &&
      !isLocalhostHost(window.location.hostname) &&
      isLocalhostHost(parsed.hostname)
    ) {
      return "/api";
    }

    return envUrl;
  } catch {
    return envUrl;
  }
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true
});

export default api;
