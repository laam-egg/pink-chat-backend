import HttpException from "./HttpException.js"

export default (socket, func) => (data) => func(data).catch((error) => {
    let message, status = 500;
    if (error instanceof Error) {
        if (error instanceof HttpException) status = error.status;
        message = error.message;
    } else {
        message = error.toString();
    }
    socket.emit("error", {
        status,
        message
    });
    console.log(error);
});
