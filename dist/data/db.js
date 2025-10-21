"use strict";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function saveExperiment(experiment) {
    const savedExperiment = await prisma.experiment.create({
        data: {
            prompt: experiment.prompt,
            results: experiment.results,
        },
    });
    return savedExperiment;
}
async function getExperiments() {
    const experiments = await prisma.experiment.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    return experiments;
}
module.exports = { saveExperiment, getExperiments };
//# sourceMappingURL=db.js.map