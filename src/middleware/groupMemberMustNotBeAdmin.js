import HttpException from "../exceptions/HttpException";

export default async function groupMemberMustNotBeAdmin(req, res, next) {
    if (req.memberInfo.isAdmin) {
        throw new HttpException(403, "This group member must not be a group admin");
    }
    next();
}