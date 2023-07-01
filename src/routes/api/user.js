import { Router } from "express";
import CA from "../../exceptions/catchAsync.js";
import { getSelfUserInfo, getAnotherUserInfo, listUsers, createUser, editUser, forgotPassword, deleteUser } from "../../controllers/user.js";
import userMustHaveLoggedIn from "../../middleware/userMustHaveLoggedIn.js";

const userRouter = Router();

userRouter.post("/list", CA(listUsers));

userRouter.get("/info", CA(userMustHaveLoggedIn), CA(getSelfUserInfo));

userRouter.get("/info/:id", CA(getAnotherUserInfo));

userRouter.post("/signup", CA(createUser));

userRouter.post("/forgot_password", CA(forgotPassword));

userRouter.post("/edit", CA(userMustHaveLoggedIn), CA(editUser));

userRouter.delete("/delete", CA(userMustHaveLoggedIn), CA(deleteUser));

export default userRouter;
