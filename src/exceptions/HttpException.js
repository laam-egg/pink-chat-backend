export default class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }

    getStatusCode() {
        return this.status;
    }
};
