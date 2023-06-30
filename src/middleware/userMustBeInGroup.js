import HttpException from "../exceptions/HttpException";
import Group from "../models/Group";

export default async function userMustBeInGroup(req, res, next) {
    const group = req.group;
    const user = req.user;
    
    if (!await Group.findOne({
        _id: group._id,
        users: {
            $elemMatch: {
                userId: user._id
            }
        }
    })) {
        throw new HttpException(401, "You are not in this group");
    }

    next();
}
