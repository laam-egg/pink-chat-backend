import { Router } from "express";
import authRouter from "./auth.js";
import userRouter from "./user.js";
import groupRouter from "./group.js";
import messageRouter from "./message.js";
import mediaRouter from "./media.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);

apiRouter.use("/user", userRouter);

apiRouter.use("/group", groupRouter);

apiRouter.use("/message", messageRouter);

apiRouter.use("/media", mediaRouter);

apiRouter.use("/", (req, res) => {
    res.json({
        message: "Wrong METHOD and/or PATH. Contact the authors for detailed API reference"
    })
});

export default apiRouter;
