import { Router } from "express";
import CA from "../../exceptions/catchAsync";
import { createMedia, deleteMedia } from "../../controllers/media";
import userMustHaveLoggedIn from "../../middleware/userMustHaveLoggedIn";
import mediaMustExist from "../../middleware/mediaMustExist";

const mediaRouter = Router();

mediaRouter.post("/create", CA(userMustHaveLoggedIn), CA(createMedia));

mediaRouter.delete("/delete", CA(userMustHaveLoggedIn), CA(mediaMustExist), CA(deleteMedia));

export default mediaRouter;
