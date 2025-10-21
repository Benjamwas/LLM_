"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareExperiments = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const compareExperiments = async (req, res) => {
    try {
        const { parameters } = req.body; // e.g. ["temperature", "topP"]
        if (!parameters || !Array.isArray(parameters) || parameters.length === 0) {
            return res.status(400).json({
                error: 'Provide at least one parameter to compare, e.g., { "parameters": ["temperature", "topP"] }',
            });
        }
        // Fetch all experiments including their responses
        const experiments = await PrismaClient_1.default.experiment.findMany({
            include: { responses: true },
        });
        const comparisonResults = experiments.map((exp) => {
            const metrics = exp.responses.map((resp) => {
                // Build a key for the parameter combination, e.g. "temperature=0.7|topP=0.9"
                const key = parameters
                    .map((param) => `${param}=${resp[param] ?? 'unknown'}`)
                    .join('|');
                return {
                    experimentId: exp.id,
                    prompt: exp.prompt,
                    combinationKey: key,
                    coherence: resp.coherenceScore,
                    diversity: resp.diversityScore,
                    latency: resp.latencyMs,
                };
            });
            // Group results by parameter combination
            const grouped = {};
            for (const m of metrics) {
                if (!grouped[m.combinationKey])
                    grouped[m.combinationKey] = [];
                grouped[m.combinationKey].push(m);
            }
            // Compute averages per combination
            const summaries = Object.keys(grouped).map((key) => {
                const group = grouped[key];
                const avgCoherence = group.reduce((sum, g) => sum + g.coherence, 0) / group.length;
                const avgDiversity = group.reduce((sum, g) => sum + g.diversity, 0) / group.length;
                const avgLatency = group.reduce((sum, g) => sum + g.latency, 0) / group.length;
                return {
                    combination: key,
                    avgCoherence,
                    avgDiversity,
                    avgLatency,
                    count: group.length,
                };
            });
            return { experimentId: exp.id, summaries };
        });
        res.status(200).json({
            message: `Comparison results across parameters: ${parameters.join(', ')}`,
            data: comparisonResults,
        });
    }
    catch (error) {
        console.error('Error comparing experiments:', error);
        res.status(500).json({ error: 'Failed to compare experiments!' });
    }
};
exports.compareExperiments = compareExperiments;
//# sourceMappingURL=compareController.js.map