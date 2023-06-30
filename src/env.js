import dotenv from "dotenv";

dotenv.config();

export const DEBUG = (process.env.DEBUG == "true") || false;
export const MONGODB_URL = process.env.MONGODB_URL;
export const API_HOST = process.env.API_HOST || "127.0.0.1";
export const API_PORT = process.env.API_PORT || (DEBUG ? 8000 : 443);
export const SOCKET_PORT = process.env.SOCKET_PORT || 3000;

export default {
    DEBUG, MONGODB_URL, API_HOST, API_PORT, SOCKET_PORT
};
