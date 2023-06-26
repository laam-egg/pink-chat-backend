import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import allRoutes from "./api/routes/allRoutes.js";

async function main() {
  dotenv.config();
  const PORT = process.env.PORT || 8000;
  const DEBUG = process.env.DEBUG || false;
  const DBPATH = process.env.DBPATH;
  
  if (DEBUG) {
    console.log("DEBUG MODE ENABLED");
  }

  let ERROR_OCCURRED = false;

  if (!ERROR_OCCURRED) {
    try {
      await mongoose.connect(DBPATH);
      console.log("Connection to database established.");
    } catch (error) {
      ERROR_OCCURRED = true;
      console.log("ERROR: Could not connect to database.");
      if (DEBUG) {
        console.log("DBPATH =", DBPATH);
      }
    }
  }

  if (!ERROR_OCCURRED) {
    const app = express();

    if (DEBUG) {
      app.use(cors());
    }
  
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  
    app.use("/", allRoutes);
  
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
};

await main();
