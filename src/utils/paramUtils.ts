export function expandGrid(params: Record<string, number[]>): any[] {
    const keys = Object.keys(params);
    const results: Record<string, any>[] = [];

    function helper(index: number, current: Record<string, any>) {
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
