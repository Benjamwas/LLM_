export function computeMetrics(response, prompt) {
    const tokens = response.split(/\s+/).length;
    const uniqueTokens = new Set(response.split(/\s+/));
    const diversity = uniqueTokens.size / tokens;
    const expectedLength = prompt.length / 10;
    const lengthScore = Math.exp(-Math.abs(tokens - expectedLength) / expectedLength);
    const composite = (diversity + lengthScore) / 2;
    return {
        tokenCount: tokens,
        diversityScore: Number(diversity.toFixed(2)),
        coherenceScore: Number(lengthScore.toFixed(2)),
        latencyMs: 0, // Placeholder for latency
    };
}
//# sourceMappingURL=metricsUtils.js.map