let io = null;

const initSocket = (httpServer) => {
    io = require("socket.io")(httpServer, {
        cors: {
            origin: true,
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join-admin", () => {
            socket.join("admin");
            console.log("Admin joined admin room:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
};

const emitToAdmins = (event, payload) => {
    if (!io) return;
    io.to("admin").emit(event, payload);
};

module.exports = {
    initSocket,
    emitToAdmins
};
