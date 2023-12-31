import { createGroup, getGroupInfo, invite, deleteGroup, listAllGroups, listMyGroups, renameGroup, removeMemberFromGroup, leaveGroup } from "../../controllers/group";
import { Router } from "express";
import CA from "../../exceptions/catchAsync";

// Middleware
import groupMustExist from "../../middleware/groupMustExist";
import userMustHaveLoggedIn from "../../middleware/userMustHaveLoggedIn";
import userMustBeInGroup from "../../middleware/userMustBeInGroup";
import userMustBeAdminInGroup from "../../middleware/userMustBeAdminInGroup";
import groupMemberMustExist from "../../middleware/groupMemberMustExist";
import groupMemberMustNotBeAdmin from "../../middleware/groupMemberMustNotBeAdmin";

const groupRouter = Router();

groupRouter.post("/list_all", CA(listAllGroups));

groupRouter.post("/list", CA(userMustHaveLoggedIn), CA(listMyGroups));

groupRouter.get("/info/:id",
    (req, res, next) => {
        // embed group ID into req.body so that we can use middleware groupMustExist
        req.body = {
            groupId: req.params.id
        }
        next();
    },
    CA(groupMustExist),
    CA(getGroupInfo)
);

groupRouter.post("/create", CA(userMustHaveLoggedIn), CA(createGroup));

groupRouter.patch("/invite", CA(userMustHaveLoggedIn), CA(groupMustExist), CA(userMustBeAdminInGroup), CA(invite));

groupRouter.patch("/remove_member", CA(userMustHaveLoggedIn), CA(groupMustExist), CA(userMustBeAdminInGroup), CA(groupMemberMustExist), CA(groupMemberMustNotBeAdmin), CA(removeMemberFromGroup));

groupRouter.patch("/leave", CA(userMustHaveLoggedIn), CA(groupMustExist), CA(userMustBeInGroup), CA(leaveGroup));

groupRouter.patch("/rename", CA(userMustHaveLoggedIn), CA(groupMustExist), CA(userMustBeInGroup), CA(renameGroup));

groupRouter.delete("/delete", CA(userMustHaveLoggedIn), CA(groupMustExist), CA(userMustBeAdminInGroup), CA(deleteGroup));

export default groupRouter;
