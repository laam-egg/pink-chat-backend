import HttpException from "../exceptions/HttpException.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

import { isUserAlreadyConnected } from "./socketio.js";

import { DEBUG } from "../env.js";

/**
 * Salt is to be embedded into JWT so that with the same base data, tokens are generated different each time.
 * For this purpose, salts are also required to be different each time they are acquired.
 */
function generateSalt() {
    return Date.now().toString() + (Math.random() * 19).toString();
}


function generateAccessToken(user, expiresIn = (DEBUG ? "15d" : "1d")) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            salt: generateSalt()
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn
        }
    );
}

function generateRefreshToken(user, expiresIn = "365d") {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            salt: generateSalt()
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn
        }
    );
}

const refreshTokens = [];

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new HttpException(404, "No user with such email address");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new HttpException(401, "Incorrect password");
    }

    if (isUserAlreadyConnected(user._id)) {
        throw new HttpException(403, "User already logged in on another device");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // if true, HTTPS only
        path: "/"
    });

    res.status(200).json({
        accessToken
    });
}

export async function refreshAccessToken(req, res) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new HttpException(400, "No refresh token");
    }
    if (!refreshTokens.includes(refreshToken)) {
        throw new HttpException(403, "Refresh token is invalid");
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new HttpException(401, "Invalid refresh token");
    }

    const user = await User.findById(decoded.id);
    if (!user) throw new HttpException(404, "User not found");

    const accessToken = generateAccessToken(user);
    res.status(200).json({
        accessToken
    });
}
