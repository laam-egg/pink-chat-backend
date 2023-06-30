import HttpException from "../exceptions/HttpException";
import Group from "../models/Group";

export default async function groupMustExist(req, res, next) {
    const { groupId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
        throw new HttpException(404, "Group not found");
    }

    req.group = group;

    next();
}
