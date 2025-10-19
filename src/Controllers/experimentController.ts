import type { Request, Response } from 'express';
import prisma from '../PrismaClient'
import { expandGrid } from '../utils/paramUtils';
import { computeMetrics } from '../utils/metricsUtils';

async function mockLLMResponse(prompt: string, parameters: Record<string, any>): Promise<string> {
  return `Response for prompt: ${prompt} with parameters: ${JSON.stringify(parameters)}`;
}

async function saveExperiment({ prompt, results }: any) {
  const experiment = await prisma.experiment.create({
    data: {
      prompt,
      results: JSON.stringify(results), // Store results as JSON in the results field
    },
    include: {},
  });

  // Create response results separately
  for (const r of results) {
    await prisma.responseResult.create({
      data: {
        experimentId: experiment.id,
        temperature: r.parameters.temperature,
        topP: r.parameters.topP,
        modelName: 'mock-llm',
        actualResponse: r.response,
        coherenceScore: r.metrics.coherenceScore,
        diversityScore: r.metrics.diversityScore,
        latencyMs: r.metrics.latencyMs || 0,
        tokenCount: r.metrics.tokenCount || 0,
      },
    });
  }

  return experiment;
}

async function generateExperiment(req: Request, res: Response) {
  try {
    const { parameters, prompt } = req.body;

    if (!parameters || !prompt) {
      return res.status(400).json({ error: 'Missing parameters or prompt' });
    }

    const paramsGrid = expandGrid(parameters);
    const results: any[] = [];

    for (const combo of paramsGrid) {
      const responseText = await mockLLMResponse(prompt, combo);
      const metrics = computeMetrics(responseText, prompt);
      results.push({ parameters: combo, response: responseText, metrics });
    }

    const experiment = await saveExperiment({ prompt, results });
    res.status(201).json(experiment);
  } catch (error) {
    console.error('Error creating experiment:', error);
    res.status(500).json({ error: 'Experiment generation failed!' });
  }
}

async function listExperiments(req: Request, res: Response) {
    try {
        const experiments = await prisma.experiment.findMany({
            orderBy: { createdAt: 'desc' },
            include: { responses: true },
        });
        res.status(200).json(experiments);
    }
    catch (error) {
        console.error('Error fetching experiments:', error);
        res.status(500).json({ error: 'Failed to fetch experiments!' });
    }
}

export { generateExperiment, listExperiments };
