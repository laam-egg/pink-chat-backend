import HttpException from "../exceptions/HttpException";
import Media from "../models/Media";

export default async function mediaMustExist(req, res, next) {
    const { mediaId } = req.body;

    const media = await Media.findOne({ _id: mediaId });

    if (!media) {
        throw new HttpException(404, "Media not found");
    }

    req.media = media;

    next();
}
