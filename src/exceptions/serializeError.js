import HttpException from "./HttpException";

export default function serializeError(error) {
    let status = 500, message, data;
    if (error instanceof Error) {
        if (error instanceof HttpException) {
            status = error.status;
            data = error.data;
        }
        message = error.message;
    } else {
        message = error.toString();
    }
    return { status, message, data };
}
