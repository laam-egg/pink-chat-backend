import compareId from "../compareId";

export default function locateMemberInGroup(group, memberUserId) {
    for (let memberInfo of group.users) {
        if (compareId(memberUserId, memberInfo.userId)) {
            return memberInfo;
        }
    }
    return null;
}
