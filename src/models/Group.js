import { Schema, model, ObjectId } from "mongoose";

const GroupSchema = new Schema({
    name: String,
    users: {
        type: [
            { userId: ObjectId, isAdmin: { type: Boolean, required: true } }],
        required: true
    },
    themeId: ObjectId,
    seenUsers: [{ userId: ObjectId }]
});

const Group = model("Group", GroupSchema);

export default Group;
