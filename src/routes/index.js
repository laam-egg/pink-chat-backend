import express, { Router } from "express";
import createEsmUtils from "esm-utils";
const { dirname } = createEsmUtils(import.meta);

import frontendRouter from "./frontend";
import apiRouter from "./api";

const router = Router();

router.use("/assets", express.static(dirname + "/../view_assets"));

router.use("/api/v1", apiRouter);

router.use("/", frontendRouter);

export default router;
