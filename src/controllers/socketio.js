import userMustHaveLoggedIn from "../middleware/userMustHaveLoggedIn";
import CAS from "../exceptions/catchAsyncForSocketio";
import HttpException from "../exceptions/HttpException";
import compareId from "../helpers/compareId";
import { DEBUG } from "../env";

const socketIdAndUserIdMap = {};
const socketIdAndSocketMap = {};

function addSocket(socket, userId) {
    userId = String(userId);
    const socketId = String(socket.id);
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

function forEachOnlineReceiverSocketIdAndUserId(senderUser, group, func) {
    for (let memberInfo of group.users) {
        const receiverUserId = String(memberInfo.userId);
        if (compareId(receiverUserId, senderUser._id)) continue; // do not notify sender
        const receiverSocketId = getSocketIdByUserId(receiverUserId);
        if (!receiverSocketId) continue; // receiver offline
        func(receiverSocketId, receiverUserId, memberInfo.isAdmin);
    }
}

export async function notifyNewMessage(senderUser, group, message) {
    forEachOnlineReceiverSocketIdAndUserId(senderUser, group, (receiverSocketId) => {
        const receiverSocket = getSocketBySocketId(receiverSocketId);
        receiverSocket.emit("new-message", {
            groupId: group._id,
            message
        });
    });
}

export async function notifyEditMessage(senderUser, group, message) {
    forEachOnlineReceiverSocketIdAndUserId(senderUser, group, (receiverSocketId) => {
        const receiverSocket = getSocketBySocketId(receiverSocketId);
        receiverSocket.emit("edit-message", {
            groupId: group._id,
            message
        });
    });
}

export async function notifyDeleteMessage(senderUser, group, messageId) {
    forEachOnlineReceiverSocketIdAndUserId(senderUser, group, (receiverSocketId) => {
        const receiverSocket = getSocketBySocketId(receiverSocketId);
        receiverSocket.emit("delete-message", {
            groupId: group._id,
            messageId
        });
    });
}

// function socketUserMustHaveLoggedIn(socket) {
//     const userId = getUserIdBySocketId(socket.id);
//     if (!userId) {
//         throw new HttpException(401, "Socket not authenticated");
//     }
//     return userId;
// }

export function isUserAlreadyConnected(userId) {
    return getSocketIdByUserId(userId) !== undefined;
}

export function handleSocketioConnection(socket) {
    socket.on("authenticate", CAS(socket, async (data) => {
        const accessToken = data.accessToken;
        // Fake req instance to use the middleware
        const req = {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        };
        await userMustHaveLoggedIn(req, null, () => { });

        addSocket(socket, req.user._id);
        socket.emit("authenticate-done");
    }));

    socket.on("disconnect", CAS(socket, async (data) => {
        removeSocketById(socket.id);
    }));
}