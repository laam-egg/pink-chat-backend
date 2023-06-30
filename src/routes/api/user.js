import { Router } from "express";
import CA from "../../exceptions/catchAsync.js";
import { listUsers, createUser, forgotPassword, deleteUser } from "../../controllers/user.js";
import userMustHaveLoggedIn from "../../middleware/userMustHaveLoggedIn.js";

const userRouter = Router();

userRouter.post("/list", CA(listUsers));

userRouter.post("/sign_up", CA(createUser));

userRouter.post("/forgot_password", CA(forgotPassword));

userRouter.post("/delete", CA(userMustHaveLoggedIn), CA(deleteUser));

export default userRouter;
