import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import path from "path";

import router from "./routes";
import { handleSocketioConnection } from "./controllers/socketio";

import { DEBUG, MONGODB_URL, API_HOST, API_PORT, SOCKET_PORT } from "./env.js";

import createEsmUtils from "esm-utils";
const { dirname } = createEsmUtils(import.meta);


async function main() {
    if (DEBUG) {
        console.log("DEBUG MODE ENABLED");
    }

    /////////////////
    // HANDLE CORS //
    /////////////////

    const corsOptions = {
        origin: (DEBUG ? "*" : ["127.0.0.1", API_HOST]),
        optionsSuccessStatus: 200
    };

    /////////////////////////
    // CONNECT TO DATABASE //
    /////////////////////////

    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connection to database established.");
    } catch (error) {
        console.log("ERROR: Could not connect to database.");
        if (DEBUG) {
        console.log("MONGODB_URL =", MONGODB_URL);
        }
        return;
    }

    ///////////////////////////////
    // HANDLE SOCKET.IO REQUESTS //
    ///////////////////////////////

    const io = new Server(SOCKET_PORT, {
        cors: corsOptions
    });
    io.on("connection", handleSocketioConnection);

    ///////////////////////////
    // HANDLE HTTPS REQUESTS //
    ///////////////////////////

    const app = express();

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.set("views", path.resolve(path.join(dirname, "/views")));
    app.set("view engine", "ejs");

    app.use(router);

    app.listen(API_PORT, () => {
        console.log(`Server listening ; API port: ${API_PORT} ; socket port: ${SOCKET_PORT}`);
    });
}

await main();
