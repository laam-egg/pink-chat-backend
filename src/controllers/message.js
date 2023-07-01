import Message from "../models/Message";
import { notifyNewMessage, notifyEditMessage, notifyDeleteMessage } from "./socketio";

export async function listMessages(req, res) {
    const { pagination, datetimeBefore } = req.body;

    let query = Message.find({
        groupId: req.group._id,
        datetime: { $lt: (datetimeBefore ? new Date(datetimeBefore) : Date.now()) }
    }).sort("-date");

    if (pagination) query = query.limit(pagination);

    const resBody = {
        list: await query
    };

    res.status(200).json(resBody);
}

export async function sendMessage(req, res) {
    const { groupId, text, mediaId } = req.body;

    const messageSpec = {
        senderUserId: req.user._id,
        groupId,
        text,
        datetime: Date.now()
    };

    if (mediaId) messageSpec.mediaId = mediaId;

    const message = await Message.create(messageSpec);

    res.status(200).json(message);

    await notifyNewMessage(req.user, req.group, message);
}

export async function editMessage(req, res) {
    const updates = {
        $set: {
            text: req.body.text
        }
    };

    if (req.body.mediaId) {
        updates.$set.mediaId = req.body.mediaId;
    } else {
        updates.$unset = {
            mediaId: ""
        };
    }

    const message = await Message.findByIdAndUpdate(
        req.message._id,
        updates,
        { new: true }
    );
    res.status(200).json(message);

    await notifyEditMessage(req.user, req.group, message);
}

export async function deleteMessage(req, res) {
    const messageId = req.message._id;
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({});
    await notifyDeleteMessage(req.user, req.group, messageId);
}