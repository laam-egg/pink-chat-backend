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
        required: true
    },
    blockList: [{ userId: ObjectId }],
    avatar: { mediaId: ObjectId }
});

const User = model("User", UserSchema);

export default User;
