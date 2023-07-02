import User from "../models/User";
import HttpException from "../exceptions/HttpException";
import locateMemberInGroup from "../helpers/locateMemberInGroup";

export default async function groupMemberMustExist(req, res, next) {
    const { memberUserId } = req.body;

    // 1. CHECK IF USER EXISTS
    const memberUser = await User.findById(memberUserId);
    if (!memberUser) {
        throw new HttpException(404, "User not found");
    }
    req.memberUser = memberUser;

    // 2. CHECK IF USER IS A GROUP MEMBER
    const memberInfo = locateMemberInGroup(req.group, memberUser._id);
    if (!memberInfo) {
        throw new HttpException(400, "This user is not in this group");
    }
    req.memberInfo = memberInfo;

    next();
}