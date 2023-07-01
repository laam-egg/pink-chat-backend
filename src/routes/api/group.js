import { createGroup, invite, deleteGroup, listAllGroups, listMyGroups, renameGroup } from "../../controllers/group";
import { Router } from "express";
import CA from "../../exceptions/catchAsync";

// Middleware
import groupMustExist from "../../middleware/groupMustExist";
import userMustHaveLoggedIn from "../../middleware/userMustHaveLoggedIn";
import userMustBeInGroup from "../../middleware/userMustBeInGroup";
import userMustBeAdminInGroup from "../../middleware/userMustBeAdminInGroup";

const groupRouter = Router();

groupRouter.post("/list_all", CA(listAllGroups));

groupRouter.post("/list", CA(userMustHaveLoggedIn), CA(listMyGroups));

groupRouter.post("/create", CA(userMustHaveLoggedIn), CA(createGroup));

groupRouter.post("/invite", CA(userMustHaveLoggedIn), CA(groupMustExist), CA(userMustBeAdminInGroup), CA(invite));

groupRouter.patch("/rename", CA(userMustHaveLoggedIn), CA(groupMustExist), CA(userMustBeInGroup), CA(renameGroup));

groupRouter.delete("/delete", CA(userMustHaveLoggedIn), CA(groupMustExist), CA(userMustBeInGroup), CA(deleteGroup));

export default groupRouter;
