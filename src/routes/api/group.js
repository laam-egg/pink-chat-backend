import { createGroup, invite, deleteGroup, listGroups, renameGroup } from "../../controllers/group";
import { Router } from "express";
import CA from "../../exceptions/catchAsync";

// Middleware
import groupMustExist from "../../middleware/groupMustExist";
import userMustHaveLoggedIn from "../../middleware/userMustHaveLoggedIn";
import userMustBeInGroup from "../../middleware/userMustBeInGroup";
import userMustBeAdminInGroup from "../../middleware/userMustBeAdminInGroup";

const groupRouter = Router();

groupRouter.use(CA(userMustHaveLoggedIn));

groupRouter.post("/list", CA(listGroups));

groupRouter.post("/create", CA(createGroup));

groupRouter.post("/invite", CA(groupMustExist), CA(userMustBeAdminInGroup), CA(invite));

groupRouter.patch("/rename", CA(groupMustExist), CA(userMustBeInGroup), CA(renameGroup));

groupRouter.delete("/delete", CA(groupMustExist), CA(userMustBeInGroup), CA(deleteGroup));

export default groupRouter;
