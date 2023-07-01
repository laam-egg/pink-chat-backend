import userMustHaveLoggedIn from "../middleware/userMustHaveLoggedIn";
import CAS from "../exceptions/catchAsyncForSocketio";
import HttpException from "../exceptions/HttpException";

const socketIdAndUserIdMap = {};
const socketIdAndSocketMap = {};

function addSocket(socket, userId) {
    userId = String(userId);
    const socketId = String(socket._id);
    socketIdAndSocketMap[socketId] = socket;
    socketIdAndUserIdMap[socketId] = userId;
}

function removeSocketById(socketId) {
    socketId = String(socketId);
    delete socketIdAndSocketMap[socketId];
    delete socketIdAndUserIdMap[socketId];
}

function getSocketIdByUserId(userId) {
    // Modified from: https://stackoverflow.com/a/28191966/13680015
    userId = String(userId);
    return Object.keys(socketIdAndUserIdMap).find(socketId => getUserIdBySocketId(socketId) === userId);
}

function getSocketBySocketId(socketId) {
    return socketIdAndSocketMap[String(socketId)];
}

function getUserIdBySocketId(socketId) {
    return socketIdAndUserIdMap[String(socketId)];
}

function forEachReceiverSocketIdAndUserId(group, func) {
    for (let memberInfo of group.users) {
        const receiverUserId = String(memberInfo.userId);
        const receiverSocketId = String(getSocketIdByUserId(receiverUserId));
        func(receiverSocketId, memberInfo.userId, memberInfo.isAdmin);
    }
}

export async function notifyNewMessage(senderUser, group, message) {
    forEachReceiverSocketIdAndUserId(group, (receiverSocketId) => {
        if (!receiverSocketId) return; // receiver offline
    
        const receiverSocket = getSocketBySocketId(receiverSocketId);
        receiverSocket.emit("new-message", {
            groupId: group._id,
            message
        });
    });
}

export async function notifyEditMessage(senderUser, group, message) {
    forEachReceiverSocketIdAndUserId(group, (receiverSocketId) => {
        if (!receiverSocketId) return; // receiver offline
    
        const receiverSocket = getSocketBySocketId(receiverSocketId);
        receiverSocket.emit("edit-message", {
            groupId: group._id,
            message
        });
    });
}

export async function notifyDeleteMessage(senderUser, group, messageId) {
    forEachReceiverSocketIdAndUserId(group, (receiverSocketId) => {
        if (!receiverSocketId) return; // receiver offline

        const receiverSocket = getSocketBySocketId(receiverSocketId);
        receiverSocket.emit("delete-message", {
            groupId: group._id,
            messageId
        });
    });
}

function getUserIdBySocketId(socketId) {
    return socketIdAndUserIdMap[socketId];
}

// function socketUserMustHaveLoggedIn(socket) {
//     const userId = getUserIdBySocketId(socket.id);
//     if (!userId) {
//         throw new HttpException(401, "Socket not authenticated");
//     }
//     return userId;
// }

export function handleSocketioConnection(_socket) {
    const socket = _socket; // closure

    socket.on("authenticate", CAS(socket, async (data) => {
        const accessToken = data.accessToken;
        // Fake req instance to use the middleware
        const req = {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        };
        await userMustHaveLoggedIn(req, null, () => { });

        socketIdAndUserIdMap[String(socket.id)] = String(req.user._id);
        socketIdAndSocketMap[String(socket.id)] = socket;
        socket.emit("authenticate-done");
    }));

    socket.on("disconnect", CAS(socket, async (data) => {
        removeSocketById(socket.id);
    }));
}