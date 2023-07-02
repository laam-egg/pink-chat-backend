import HttpException from "../exceptions/HttpException";
import Message from "../models/Message";
import compareId from "../helpers/compareId";

export default async function userMustHaveSentMessage(req, res, next) {
    const { messageId } = req.body;

    const message = await Message.findOne({ _id: messageId });

    if (!message) {
        throw new HttpException(404, "Message not found");
    }

    if (!compareId(message.senderUserId, req.user._id)) {
        throw new HttpException(401, "You didn't send this message");
    }

    req.message = message;

    next();
}
