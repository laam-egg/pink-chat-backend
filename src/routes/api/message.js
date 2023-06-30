import { Router } from "express";
import CA from "../../exceptions/catchAsync.js";
import userMustHaveLoggedIn from "../../middleware/userMustHaveLoggedIn";
import groupMustExist from "../../middleware/groupMustExist";
import userMustBeInGroup from "../../middleware/userMustBeInGroup";
import userMustHaveSentMessage from "../../middleware/userMustHaveSentMessage";
import validateMessageBody from "../../middleware/validateMessageBody";
import { listMessages, sendMessage, editMessage, deleteMessage } from "../../controllers/message";

const messageRouter = Router();

messageRouter.use(CA(userMustHaveLoggedIn), CA(groupMustExist), CA(userMustBeInGroup));

messageRouter.post("/list", CA(listMessages));

messageRouter.post("/send", CA(validateMessageBody), CA(sendMessage));

messageRouter.patch("/edit", CA(userMustHaveSentMessage), CA(validateMessageBody), CA(editMessage));

messageRouter.delete("/delete", CA(userMustHaveSentMessage), CA(deleteMessage));

export default messageRouter;
