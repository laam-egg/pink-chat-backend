import escapeStringRegexp from "escape-string-regexp";

export default function $textSearch(fieldName, contains, filter) {
    if (!contains) return;
    const orList = [];
    for (let word of contains.split(" ")) {
        if (!word) continue;
        const q = {};
        q[fieldName] = {
            $regex: new RegExp(escapeStringRegexp(word), "i")
        };
        orList.push(q);
    };
    if (orList.length === 0) return;
    filter.$or = orList.concat(filter.$or ? filter.$or : []);
}
