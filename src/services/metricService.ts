export function computeMetrics(response: string, prompt: string) {
    const tokenArray = response.split(/\s+/);
    const tokens = tokenArray.length;
    const uniqueTokens = new Set(tokenArray);
    const diversity = uniqueTokens.size / tokens;
    const expectedLength = prompt.length / 10;
    const lengthScore = Math.exp(-Math.abs(tokens - expectedLength) / expectedLength);
    const composite = (diversity + lengthScore) / 2;

    return {
        tokens,
        diversity: Number(diversity.toFixed(2)),
        lengthScore: Number(lengthScore.toFixed(2)),
        composite: Number(composite.toFixed(2))
    };
}
