"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportExperiment = exportExperiment;
exports.exportAllExperiments = exportAllExperiments;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const json2csv_1 = require("json2csv");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Export a single experiment by ID
async function exportExperiment(req, res) {
    try {
        const { experimentId } = req.params;
        const { format = 'json' } = req.query;
        const experiment = await PrismaClient_1.default.experiment.findUnique({
            where: { id: Number(experimentId) },
            include: { responses: true },
        });
        if (!experiment) {
            return res.status(404).json({ error: 'Experiment not found' });
        }
        if (format === 'csv') {
            const responses = experiment.responses.map((r) => ({
                experimentId: experiment.id,
                prompt: experiment.prompt,
                temperature: r.temperature,
                topP: r.topP,
                modelName: r.modelName,
                coherenceScore: r.coherenceScore,
                diversityScore: r.diversityScore,
                latencyMs: r.latencyMs,
                tokenCount: r.tokenCount,
                response: r.actualResponse,
            }));
            const csv = new json2csv_1.Parser().parse(responses);
            const filePath = path_1.default.join(process.cwd(), `exports/experiment_${experiment.id}.csv`);
            fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            fs_1.default.writeFileSync(filePath, csv);
            res.download(filePath, `experiment_${experiment.id}.csv`);
        }
        else {
            // Default: JSON export
            res.json(experiment);
        }
    }
    catch (error) {
        console.error('Error exporting experiment:', error);
        res.status(500).json({ error: 'Failed to export experiment' });
    }
}
// Export all experiments
async function exportAllExperiments(req, res) {
    try {
        const { format = 'json' } = req.query;
        const experiments = await PrismaClient_1.default.experiment.findMany({
            include: { responses: true },
        });
        if (format === 'csv') {
            const allResponses = experiments.flatMap((exp) => exp.responses.map((r) => ({
                experimentId: exp.id,
                prompt: exp.prompt,
                temperature: r.temperature,
                topP: r.topP,
                modelName: r.modelName,
                coherenceScore: r.coherenceScore,
                diversityScore: r.diversityScore,
                latencyMs: r.latencyMs,
                tokenCount: r.tokenCount,
                response: r.actualResponse,
            })));
            const csv = new json2csv_1.Parser().parse(allResponses);
            const filePath = path_1.default.join(process.cwd(), `exports/all_experiments.csv`);
            fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            fs_1.default.writeFileSync(filePath, csv);
            res.download(filePath, 'all_experiments.csv');
        }
        else {
            res.json(experiments);
        }
    }
    catch (error) {
        console.error('Error exporting all experiments:', error);
        res.status(500).json({ error: 'Failed to export all experiments' });
    }
}
//# sourceMappingURL=exportController.js.map