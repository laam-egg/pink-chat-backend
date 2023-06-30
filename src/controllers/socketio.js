import userMustHaveLoggedIn from "../middleware/userMustHaveLoggedIn";
import CAS from "../exceptions/catchAsyncForSocketio";
import HttpException from "../exceptions/HttpException";

const socketIdAndUserIdMap = {};
const socketIdAndSocketMap = {};

// This function's purpose is to obtain socketId from known userId in the map above.
// Source: https://stackoverflow.com/a/28191966/13680015
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function forEachReceiverSocketIdAndUserId(group, func) {
    for (let memberInfo of group.users) {
        const receiverSocketId = getKeyByValue(socketIdAndUserIdMap, receiverUserId);
        func(receiverSocketId, memberInfo.userId, memberInfo.isAdmin);
    }
}

export async function notifyNewMessage(senderUser, group, message) {
    forEachReceiverSocketIdAndUserId((receiverSocketId) => {
        if (!receiverSocketId) return; // receiver offline
    
        const receiverSocket = socketIdAndSocketMap[receiverSocketId];
        receiverSocket.emit("new-message", {
            groupId: group._id,
            message
        });
    });
}

export async function notifyEditMessage(senderUser, group, message) {
    forEachReceiverSocketIdAndUserId((receiverSocketId) => {
        if (!receiverSocketId) return; // receiver offline
    
        const receiverSocket = socketIdAndSocketMap[receiverSocketId];
        receiverSocket.emit("edit-message", {
            groupId: group._id,
            message
        });
    });
}

export async function notifyDeleteMessage(senderUser, group, messageId) {
    forEachReceiverSocketIdAndUserId((receiverSocketId, receiverUserId) => {
        if (!receiverSocketId) return; // receiver offline

        const receiverSocket = socketIdAndSocketMap[receiverSocketId];
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

    socket.on("authenticate", CAS(async (data) => {
        const accessToken = data.accessToken;
        // Fake req instance to use the middleware
        const req = {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        };
        try {
            await userMustHaveLoggedIn(req, null, () => { });
        } catch (error) {
            if (error instanceof HttpException) {
                socket.emit("error", {
                    status: error.getStatusCode(),
                    message: error.message
                });
                return;
            } else {
                throw error;
            }
        }

        socketIdAndUserIdMap[socket.id] = req.user._id;
        socketIdAndSocketMap[socket.id] = socket;
        socket.emit("authenticate-done");
    }));

    socket.on("disconnect", CAS(async (data) => {
        delete socketIdAndUserIdMap[socket.id];
        delete socketIdAndSocketMap[socket.id];
    }));
}