import HttpException from "../exceptions/HttpException";
import Group from "../models/Group";
import Message from "../models/Message";
import compareId from "../compareId";

export async function listGroups(req, res) {
    const resBody = {
        list: await Group.find()
    };
    res.status(200).json(resBody);
}

export async function createGroup(req, res) {
    const { name, users, themeId } = req.body;

    let myselfFound = false;
    for (let user of users) {
        if (compareId(user.userId, req.user._id)) {
            myselfFound = true;
            user.isAdmin = true;
            break;
        }
    }
    if (!myselfFound) {
        users.push({
            userId: req.user._id,
            isAdmin: true
        });
    }

    const newGroup = await Group.create({
        name,
        users,
        themeId,
        messages: [],
        seenUsers: []
    });

    res.status(200).json(newGroup);
}

export async function invite(req, res) {
    const { inviteeUserId, isInviteeGonnaBeAdmin } = req.body;

    const result = {
        already: false
    };

    for (let memberInfo of req.group.users) {
        if (compareId(inviteeUserId, memberInfo.userId)) {
            result.already = true;
            // Invitee already in group. Check admin status.
            if (isInviteeGonnaBeAdmin !== undefined && Boolean(isInviteeGonnaBeAdmin) !== Boolean(memberInfo.isAdmin)) {
                result.isAdmin = Boolean(isInviteeGonnaBeAdmin);
                await Group.updateOne(
                    { _id: req.group._id, "users.userId": inviteeUserId },
                    {
                        $set: {
                            "users.$.isAdmin": result.isAdmin
                        }
                    }
                );
                result.isAdminChanged = true;
            } else {
                result.isAdmin = memberInfo.isAdmin || false;
                result.isAdminChanged = false;
            }
        }
    }

    if (!result.already) {
        result.isAdmin = isInviteeGonnaBeAdmin !== undefined ? isInviteeGonnaBeAdmin : false;
        await Group.findByIdAndUpdate(
            req.group._id,
            {
                $push: {
                    users: {
                        userId: inviteeUserId,
                        isAdmin: result.isAdmin
                    }
                }
            }
        );
        result.isAdminChanged = true;
    }

    res.status(200).json(result);
}

export async function renameGroup(req, res) {
    const { name } = req.body;

    const updates = {}

    if (name) {
        updates.$set = {
            name
        };
    } else {
        updates.$unset = {
            name: ""
        };
    }

    const group = await Group.findByIdAndUpdate(
        { _id: req.group.id },
        updates,
        { new: true }
    );
    res.status(200).json(group);
}

export async function deleteGroup(req, res) {
    await Group.findByIdAndRemove(req.group._id);
    await Message.deleteMany({ groupId: req.group._id });
    res.status(200).json({});
}
