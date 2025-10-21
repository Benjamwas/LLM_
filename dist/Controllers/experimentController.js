"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExperiment = generateExperiment;
exports.listExperiments = listExperiments;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const paramUtils_1 = require("../utils/paramUtils");
// Step 1: Mock prompt-response dictionary
const mockResponses = {
    "Summarize the importance of renewable energy in one paragraph.": "Renewable energy is essential for reducing carbon emissions and creating a sustainable future. It helps preserve the environment while driving economic and social development.",
    "Write a short motivational message about teamwork.": "Together, we achieve more. Each person’s effort counts toward a shared goal — teamwork transforms vision into success.",
    "Explain quantum computing in simple terms.": "Quantum computing uses tiny particles called qubits to process many calculations at once, making it much faster than traditional computers for certain tasks."
};
// Step 2: Mock LLM response logic
async function mockLLMResponse(prompt, parameters) {
    // Check if the prompt matches one of the predefined mock ones
    const baseResponse = mockResponses[prompt] || `Mock response for: ${prompt}`;
    // Slight variation for realism depending on temperature
    const variation = parameters.temperature > 0.8
        ? " (This version feels more creative and varied.)"
        : parameters.temperature < 0.4
            ? " (This version feels more focused and concise.)"
            : "";
    return `${baseResponse}${variation}`;
}
// Step 3: Save experiment and responses
async function saveExperiment({ prompt, results }) {
    const experiment = await PrismaClient_1.default.experiment.create({
        data: {
            prompt,
            results: JSON.stringify(results)
        }
    });
    for (const r of results) {
        await PrismaClient_1.default.responseResult.create({
            data: {
                experimentId: experiment.id,
                temperature: r.parameters.temperature,
                topP: r.parameters.topP,
                modelName: "mock-llm",
                actualResponse: r.response,
                coherenceScore: r.metrics.coherenceScore,
                diversityScore: r.metrics.diversityScore,
                latencyMs: r.metrics.latencyMs,
                tokenCount: r.metrics.tokenCount
            }
        });
    }
    return experiment;
}
// Step 4: Generate experiment endpoint
async function generateExperiment(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Request body is missing" });
        }
        const { parameters, prompt } = req.body || {};
        if (!parameters || !prompt) {
            return res.status(400).json({ error: "Missing parameters or prompt" });
        }
        const paramsGrid = (0, paramUtils_1.expandGrid)(parameters);
        const results = [];
        for (const combo of paramsGrid) {
            const responseText = await mockLLMResponse(prompt, combo);
            // Dynamic mock metrics (based on parameters)
            const metrics = {
                coherenceScore: Number((1 - Math.abs(combo.temperature - 0.5) * 0.3).toFixed(2)),
                diversityScore: Number((0.5 + combo.temperature * 0.4).toFixed(2)),
                latencyMs: Math.floor(80 + Math.random() * 50),
                tokenCount: Math.floor(40 + Math.random() * 20)
            };
            results.push({ parameters: combo, response: responseText, metrics });
        }
        const experiment = await saveExperiment({ prompt, results });
        res.status(201).json(experiment);
        async function listExperiments(req, res) {
            try {
                const experiments = await PrismaClient_1.default.experiment.findMany({
                    orderBy: { createdAt: "desc" },
                    include: { responses: true }
                });
                res.status(200).json(experiments);
            }
            catch (error) {
                console.error("Error fetching experiments:", error);
                res.status(500).json({ error: "Failed to fetch experiments!" });
            }
        }
    }
    catch (error) {
        console.error("Error creating experiment:", error);
        res.status(500).json({ error: "Experiment generation failed!" });
    }
}
// Step 5: List experiments
async function listExperiments(req, res) {
    try {
        const experiments = await PrismaClient_1.default.experiment.findMany({
            orderBy: { createdAt: "desc" },
            include: { responses: true } // includes related response results
        });
        res.status(200).json(experiments);
    }
    catch (error) {
        console.error("Error fetching experiments:", error);
        res.status(500).json({ error: "Failed to fetch experiments!" });
    }
}
//# sourceMappingURL=experimentController.js.map