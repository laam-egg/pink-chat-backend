import { Router } from "express";
import CA from "../../exceptions/catchAsync.js";

import { login, refreshAccessToken } from "../../controllers/auth.js";

const authRouter = Router();

authRouter.post("/login", CA(login));

authRouter.post("/refresh-access-token", CA(refreshAccessToken));

export default authRouter;
