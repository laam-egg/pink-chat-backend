import { Router } from "express";
import CA from "../../exceptions/catchAsync.js";
import userMustHaveLoggedIn from "../../middleware/userMustHaveLoggedIn";
import groupMustExist from "../../middleware/groupMustExist";
import userMustBeInGroup from "../../middleware/userMustBeInGroup";
import userMustHaveSentMessage from "../../middleware/userMustHaveSentMessage";
import validateMessageBody from "../../middleware/validateMessageBody";
import { listMyMessages, listAllMessages, sendMessage, editMessage, deleteMessage } from "../../controllers/message";

const messageRouter = Router();

messageRouter.use(CA(userMustHaveLoggedIn));

messageRouter.post("/list", CA(listMyMessages));

messageRouter.post("/list_all", CA(listAllMessages));

messageRouter.post("/send", CA(groupMustExist), CA(userMustBeInGroup), CA(validateMessageBody), CA(sendMessage));

messageRouter.patch("/edit", CA(groupMustExist), CA(userMustBeInGroup), CA(userMustHaveSentMessage), CA(validateMessageBody), CA(editMessage));

messageRouter.delete("/delete", CA(groupMustExist), CA(userMustBeInGroup), CA(userMustHaveSentMessage), CA(deleteMessage));

export default messageRouter;
