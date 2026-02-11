import { io } from "socket.io-client";

let socket = null;

const isLocalhostHost = (host) =>
  host === "localhost" || host === "127.0.0.1" || host === "::1";

const resolveSocketUrl = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;

  if (!envUrl) return typeof window !== "undefined" ? window.location.origin : undefined;
  if (envUrl.startsWith("/")) return envUrl;

  try {
    const parsed = new URL(envUrl);
    if (
      typeof window !== "undefined" &&
      !isLocalhostHost(window.location.hostname) &&
      isLocalhostHost(parsed.hostname)
    ) {
      return window.location.origin;
    }
    return envUrl;
  } catch {
    return envUrl;
  }
};

export const initSocket = (isAdmin) => {
  if (socket) return socket;

  socket = io(resolveSocketUrl(), {
    withCredentials: true
  });

  socket.on("connect", () => {
    if (isAdmin) {
      socket.emit("join-admin");
    }
  });

  return socket;
};

export const joinTopic = (topicId) => {
  if (!socket) return;
  socket.emit("join-topic", topicId);
};

export const leaveTopic = (topicId) => {
  if (!socket) return;
  socket.emit("leave-topic", topicId);
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
