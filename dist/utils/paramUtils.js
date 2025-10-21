"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandGrid = expandGrid;
function expandGrid(params) {
    const keys = Object.keys(params);
    const results = [];
    function helper(index, current) {
        if (index === keys.length) {
            results.push({ ...current });
            return;
        }
        const key = keys[index];
        const values = params[key];
        if (values) {
            for (const value of values) {
                const newCurrent = { ...current };
                newCurrent[key] = value;
                helper(index + 1, newCurrent);
            }
        }
    }
    helper(0, {});
    return results;
}
//# sourceMappingURL=paramUtils.js.map