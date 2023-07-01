import serializeError from "./serializeError";

export default (socket, func) => (data) => func(data).catch((error) => {
    socket.emit("error", serializeError(error));
});
