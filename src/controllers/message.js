import Message from "../models/Message";
import { notifyNewMessage, notifyEditMessage, notifyDeleteMessage } from "./socketio";
import $textSearch from "../helpers/$textSearch";

import groupMustExist from "../middleware/groupMustExist";
import userMustBeInGroup from "../middleware/userMustBeInGroup";

async function listMessagesInternal_(req, res, includeMessagesSentByOthers = false) {
    const { groupId, textContains, pagination, datetimeBefore } = req.body;
    const filter = {};

    if (!includeMessagesSentByOthers) {
        filter.senderUserId = req.user._id
    }

    if (groupId) {
        await groupMustExist(req, res, () => 1);
        await userMustBeInGroup(req, res, () => 1);
        filter.groupId = req.group._id;
    }

    if (textContains) {
        $textSearch("text", textContains, filter);
    }

    filter.datetime = {
        $lt: (datetimeBefore ? new Date(datetimeBefore) : Date.now())
    };

    let query = Message.find(filter).sort("-datetime");

    if (pagination) query = query.limit(pagination);

    const resBody = {
        list: await query
    };

    res.status(200).json(resBody);
}

export async function listMyMessages(req, res) {
    return await listMessagesInternal_(req, res, false);
}

export async function listAllMessages(req, res) {
    return await listMessagesInternal_(req, res, true);
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

    await notifyNewMessage(req.user, req.group, message);

    res.status(200).json(message);
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

    await notifyEditMessage(req.user, req.group, message);

    res.status(200).json(message);
}

export async function deleteMessage(req, res) {
    const messageId = req.message._id;
    await Message.findByIdAndDelete(messageId);
    await notifyDeleteMessage(req.user, req.group, messageId);
    res.status(200).json({});
}