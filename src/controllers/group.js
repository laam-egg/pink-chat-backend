import HttpException from "../exceptions/HttpException";
import Group from "../models/Group";
import Message from "../models/Message";
import compareId from "../helpers/compareId";
import $textSearch from "../helpers/$textSearch";
import locateMemberInGroup from "../helpers/locateMemberInGroup";

export async function listAllGroups(req, res) {
    const { nameContains } = req.body;
    const filter = {};
    $textSearch("name", nameContains, filter);

    const resBody = {
        list: await Group.find(filter)
    };
    res.status(200).json(resBody);
}

export async function listMyGroups(req, res) {
    const { nameContains } = req.body;
    const filter = {
        users: {
            $elemMatch: {
                userId: req.user._id
            }
        }
    };
    $textSearch("name", nameContains, filter);

    const resBody = {
        list: await Group.find(filter)
    };
    res.status(200).json(resBody);
}

export async function getGroupInfo(req, res) {
    res.status(200).json(req.group);
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

    const result = {};

    const memberInfo = locateMemberInGroup(req.group, inviteeUserId);
    if (memberInfo) {
        result.already = true;
        result.isAdmin = memberInfo.isAdmin;
        // Invitee already in group.
        // Check admin status (CURRENTLY: DON'T DO THIS).
        // if (isInviteeGonnaBeAdmin !== undefined && Boolean(isInviteeGonnaBeAdmin) !== Boolean(memberInfo.isAdmin)) {
        //     result.isAdmin = Boolean(isInviteeGonnaBeAdmin);
        //     await Group.updateOne(
        //         { _id: req.group._id, "users.userId": inviteeUserId },
        //         {
        //             $set: {
        //                 "users.$.isAdmin": result.isAdmin
        //             }
        //         }
        //     );
        //     result.isAdminChanged = true;
        // } else {
        //     result.isAdmin = memberInfo.isAdmin || false;
        //     result.isAdminChanged = false;
        // }
    } else {
        result.already = false;
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
        req.group._id,
        updates,
        { new: true }
    );
    res.status(200).json(group);
}

async function removeMemberFromGroupInternal_(req, memberUserId) {
    return await Group.findByIdAndUpdate(
        req.group._id,
        {
            $pull: {
                users: {
                    userId: memberUserId
                }
            }
        },
        { new: true }
    );
}

export async function removeMemberFromGroup(req, res) {
    const group = await removeMemberFromGroupInternal_(req, req.memberInfo.userId);
    res.status(200).json(group);
}

export async function leaveGroup(req, res) {
    const result = { groupRemoved: false };
    const group = await removeMemberFromGroupInternal_(req, req.user._id);
    if (group.users.length === 0) {
        // No members left, immediately dispose of the group
        await deleteGroupInternal_(req);
        result.groupRemoved = true;
    }
    res.status(200).json(result);
}

async function deleteGroupInternal_(req) {
    await Group.findByIdAndRemove(req.group._id);
    await Message.deleteMany({ groupId: req.group._id });
}

export async function deleteGroup(req, res) {
    await deleteGroupInternal_(req);
    res.status(200).json({});
}
