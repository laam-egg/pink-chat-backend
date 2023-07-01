import User from "../models/User";
import jwt from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";

export default async function userMustHaveLoggedIn(req, res, next) {
    const authHeader = req.headers.authorization;
    const bearerPrefix = "Bearer ";
    if (!authHeader || !authHeader.startsWith(bearerPrefix)) {
        throw new HttpException(401, "Access denied. User not logged in");
    }

    const token = authHeader.replace(bearerPrefix, "");
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        throw new HttpException(400, "Malformed access token");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new HttpException(401, "Authentication failed");
    }

    req.user = user;

    next();
}
