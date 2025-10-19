import { Request, Response } from 'express';
import prisma from '../PrismaClient';
import { Parser as CsvParser } from 'json2csv';
import fs from 'fs';
import path from 'path';

// Export a single experiment by ID
export async function exportExperiment(req: Request, res: Response) {
  try {
    const { experimentId } = req.params;
    const { format = 'json' } = req.query;

    const experiment = await prisma.experiment.findUnique({
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

      const csv = new CsvParser().parse(responses);

      const filePath = path.join(process.cwd(), `exports/experiment_${experiment.id}.csv`);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, csv);

      res.download(filePath, `experiment_${experiment.id}.csv`);
    } else {
      // Default: JSON export
      res.json(experiment);
    }
  } catch (error) {
    console.error('Error exporting experiment:', error);
    res.status(500).json({ error: 'Failed to export experiment' });
  }
}

// Export all experiments
export async function exportAllExperiments(req: Request, res: Response) {
  try {
    const { format = 'json' } = req.query;
    const experiments = await prisma.experiment.findMany({
      include: { responses: true },
    });

    if (format === 'csv') {
      const allResponses = experiments.flatMap((exp) =>
        exp.responses.map((r) => ({
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
        }))
      );

      const csv = new CsvParser().parse(allResponses);

      const filePath = path.join(process.cwd(), `exports/all_experiments.csv`);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, csv);

      res.download(filePath, 'all_experiments.csv');
    } else {
      res.json(experiments);
    }
  } catch (error) {
    console.error('Error exporting all experiments:', error);
    res.status(500).json({ error: 'Failed to export all experiments' });
  }
}
