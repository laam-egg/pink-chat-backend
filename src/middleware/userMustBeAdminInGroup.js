// WARNING: Duplicate the most code in ./userMustBeInGroup

import HttpException from "../exceptions/HttpException";
import Group from "../models/Group";

export default async function userMustBeAdminInGroup(req, res, next) {
    const group = req.group;
    const user = req.user;
    
    if (!await Group.findOne({
        _id: group._id,
        users: {
            $elemMatch: {
                userId: user._id,
                isAdmin: true
            }
        }
    })) {
        throw new HttpException(401, "You are not an admin in this group");
    }

    next();
}
