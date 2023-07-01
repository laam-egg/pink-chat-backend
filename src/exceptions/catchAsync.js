import serializeError from "./serializeError.js";

export default (func) => (req, res, next) => func(req, res, next).catch((error) => {
    const e = serializeError(error);
    res.status(e.status).json(e);
});
