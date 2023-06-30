import Media from "../models/Media";

export async function createMedia(req, res) {
    const { type, url } = req.body;

    const newMedia = await Media.create({
        type,
        url
    });

    res.status(200).json(newMedia);
}

export async function deleteMedia(req, res) {
    Media.deleteOne({ _id: req.media._id });

    res.status(200).json({});
}
