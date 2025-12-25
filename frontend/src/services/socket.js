import { io } from "socket.io-client";

let socket = null;

export const initSocket = (isAdmin) => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    withCredentials: true
  });

  socket.on("connect", () => {
    if (isAdmin) {
      socket.emit("join-admin");
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
