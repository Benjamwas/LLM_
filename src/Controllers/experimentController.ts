import type { Request, Response } from "express";
import prisma from "../PrismaClient";
import { expandGrid } from "../utils/paramUtils";
import { computeMetrics } from "../services/metricService"; // ✅ integrated real metric logic

// 🧠 Step 1: Mock dictionary of prompts and responses
const mockResponses: Record<string, string> = {
  "Summarize the importance of renewable energy in one paragraph.":
    "Renewable energy is essential for reducing carbon emissions and creating a sustainable future. It helps preserve the environment while driving economic and social development.",

  "Write a short motivational message about teamwork.":
    "Together, we achieve more. Each person’s effort counts toward a shared goal — teamwork transforms vision into success.",

  "Explain quantum computing in simple terms.":
    "Quantum computing uses tiny particles called qubits to process many calculations at once, making it much faster than traditional computers for certain tasks."
};

// 🧩 Step 2: Mock model logic with temperature-driven variation
async function mockLLMResponse(prompt: string, parameters: Record<string, any>): Promise<string> {
  const base = mockResponses[prompt] || `Mock response for: ${prompt}`;

  const variation =
    parameters.temperature > 0.8
      ? " (This version feels more creative and expressive.)"
      : parameters.temperature < 0.4
      ? " (This version feels more focused and concise.)"
      : " (Balanced tone and structure.)";

  // Add mild random noise for realism
  const noise = Math.random() > 0.5 ? " 🤖" : "";
  return `${base}${variation}${noise}`;
}

// 💾 Step 3: Save experiment and responses
async function saveExperiment(prompt: string, results: any[]) {
  const experiment = await prisma.experiment.create({
    data: {
      prompt,
      results: JSON.stringify(results)
    }
  });

  for (const r of results) {
    await prisma.responseResult.create({
      data: {
        experimentId: experiment.id,
        temperature: r.parameters.temperature,
        topP: r.parameters.topP,
        modelName: "mock-llm",
        actualResponse: r.response,
        ...r.metrics // ✅ dynamically spread computed metrics
      }
    });
  }

  return experiment;
}

// ⚙️ Step 4: Generate multiple responses per parameter combo
export async function generateExperiment(req: Request, res: Response) {
  try {
    const { parameters, prompt } = req.body || {};

    if (!parameters || !prompt) {
      return res.status(400).json({ error: "Missing parameters or prompt" });
    }

    const paramGrid = expandGrid(parameters);
    const results: any[] = [];

    // 🔁 For each combination, generate multiple variations
    for (const combo of paramGrid) {
      for (let i = 0; i < 2; i++) { // generate 2 responses per combo
        const responseText = await mockLLMResponse(prompt, combo);
        const metrics = computeMetrics(responseText, prompt); // ✅ realistic computed metrics
        results.push({ parameters: combo, response: responseText, metrics });
      }
    }

    const experiment = await saveExperiment(prompt, results);
    return res.status(201).json(experiment);
  } catch (error) {
    console.error("Error creating experiment:", error);
    return res.status(500).json({ error: "Experiment generation failed!" });
  }
}

// 📜 Step 5: Retrieve experiment history
export async function listExperiments(req: Request, res: Response) {
  try {
    const experiments = await prisma.experiment.findMany({
      orderBy: { createdAt: "desc" },
      include: { responses: true }
    });
    res.status(200).json(experiments);
  } catch (error) {
    console.error("Error fetching experiments:", error);
    res.status(500).json({ error: "Failed to fetch experiments!" });
  }
}
