import HttpException from "../exceptions/HttpException";
import Message from "../models/Message";
import Media from "../models/Media";
import mediaMustExist from "./mediaMustExist";

export default async function validateMessageBody(req, res, next) {
    const { text, mediaId } = req.body;

    if (!text && !mediaId) {
        throw new HttpException(400, "Message cannot be empty")
    }

    if (mediaId) {
        await mediaMustExist(req, res, () => {});
    } else {
        req.body.mediaId = null;
    }

    req.body.text = text ? String(text) : "";

    next();
}
