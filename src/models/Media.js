import { Schema, model, ObjectId } from "mongoose";

const MediaSchema = new Schema({
    type: String, // Possible values: "IMAGE", "AUDIO", "VIDEO", "LINK", "FILE"
    url: String
});

const Media = model("Media", MediaSchema);

export default Media;
