import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
    const userExists = onlineUsers.find((u) => u.userId === userId);
    if (!userExists) {
        onlineUsers.push({ userId, socketId });
    }
};

const removeUser = (socketId) => {
    const onlineUser = onlineUsers.find((u) => u.socketId !== socketId)
};

const getUser = (userId) => {
    return onlineUsers.find((u) => u.userId === userId);
}

io.on("connection", (socket) => {
    socket.on("newUser", (userId) => {
        addUser(userId, socket.id)
    });

    socket.on("sendMessage", ({ receiverId, data }) => {
        const receiver = getUser(receiverId);
        io.to(receiver?.socketId).emit("getMessage", data);
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
    })
});

io.listen("4000");