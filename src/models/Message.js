import { Schema, model, ObjectId } from "mongoose";

const MessageSchema = new Schema({
    senderUserId: {
        type: ObjectId,
        required: true
    },
    groupId: {
        type: ObjectId,
        required: true
    },
    text: {
        type: String,
        // required: true
    },
    mediaId: ObjectId,
    datetime: {
        type: Date,
        required: true
    }
});

const Message = model("Message", MessageSchema);

export default Message;
