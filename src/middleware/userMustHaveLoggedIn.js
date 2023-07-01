import User from "../models/User";
import jwt from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";
import { DEBUG } from "../env";

export default async function userMustHaveLoggedIn(req, res, next) {
    const authHeader = req.headers.authorization;
    const bearerPrefix = "Bearer ";
    if (!authHeader || !authHeader.startsWith(bearerPrefix)) {
        throw new HttpException(401, "Access denied. User not logged in");
    }

    const accessToken = authHeader.replace(bearerPrefix, "");
    let decoded;
    try {
        if (DEBUG) console.log("ACCESS TOKEN:", accessToken);
        decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
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
