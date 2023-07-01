import { Schema, model, ObjectId } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        index: true
    },
    blockList: [{ userId: ObjectId }],
    avatar: { mediaId: ObjectId }
});

// If you want to search whole-word:
// https://github.com/Automattic/mongoose/issues/7058#issuecomment-425636711

const User = model("User", UserSchema);

export default User;
