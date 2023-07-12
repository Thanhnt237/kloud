"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDuplicateInput = exports.arrayGroup = void 0;
const lodash_1 = require("lodash");
/**
 * @Description: Add array to another array
 */
function arrayGroup(mainArray, subArray, pickProperties) {
    const mainArr = JSON.parse(JSON.stringify(mainArray));
    for (const sub of subArray) {
        if (pickProperties === null || pickProperties === void 0 ? void 0 : pickProperties.length) {
            sub.subArray = subArray.map(c => (0, lodash_1.pick)(c, pickProperties));
        }
        const subArrayPrefix = (0, lodash_1.groupBy)(sub.subArray, sub.groupProperty);
        mainArr.map((c) => {
            var _a;
            if ((_a = sub.options) === null || _a === void 0 ? void 0 : _a.mapOneOnly) {
                c[sub.groupProperty] = subArrayPrefix[c.groupProperty] ? subArrayPrefix[c.groupProperty][0] : {};
            }
            else {
                c[sub.groupProperty] = subArrayPrefix[c.groupProperty] ? subArrayPrefix[c.groupProperty] : [];
            }
            return c;
        });
    }
    return mainArr;
}
exports.arrayGroup = arrayGroup;
function checkDuplicateInput(array, field) {
    if ((0, lodash_1.uniqBy)(array, `${field}`).length !== array.length) {
        throw new Error('Duplicate Input');
    }
}
exports.checkDuplicateInput = checkDuplicateInput;
