import type { Request, Response } from "express";
import prisma from "../PrismaClient";
import { expandGrid } from "../utils/paramUtils";
import { computeMetrics } from "../services/metricService";

// Step 1: Enhanced mock dictionary with multiple tones per prompt
const mockResponses: Record<string, string[]> = {
  "Summarize the importance of renewable energy in one paragraph.": [
    "Renewable energy is essential for reducing carbon emissions and creating a sustainable future. It helps preserve the environment while driving economic and social development.",
    "Renewable energy powers progress without harming the planet, offering sustainable growth and cleaner air for future generations.",
    "By investing in renewable energy, we protect the earth, boost economies, and pave the way for a sustainable tomorrow."
  ],

  "Write a short motivational message about teamwork.": [
    "Together, we achieve more. Every person’s effort counts toward a shared goal — teamwork turns vision into success.",
    "Great things happen when we unite — collaboration multiplies strength, and teamwork fuels victory.",
    "When we lift each other up, challenges become opportunities — teamwork transforms potential into progress."
  ],

  "Explain quantum computing in simple terms.": [
    "Quantum computing uses qubits that can represent both 0 and 1, allowing it to solve complex problems much faster than regular computers.",
    "Think of quantum computing like flipping many coins at once — it explores all possibilities before landing on the best solution.",
    "Quantum computers work with the rules of physics, letting them perform powerful calculations far beyond what normal machines can do."
  ]
};

// Step 2: Mock model logic with temperature-driven tone adjustment
async function mockLLMResponse(
  prompt: string,
  parameters: Record<string, any>
): Promise<string[]> {
  const candidates = mockResponses[prompt] || [`Mock response for: ${prompt}`];

  // Pick 1–3 random variations
  const variationCount = Math.floor(Math.random() * 3) + 1;
  const selected = [...candidates].sort(() => 0.5 - Math.random()).slice(0, variationCount);

  // Add temperature-based tone and noise
  return selected.map((r) => {
    const tone =
      parameters.temperature > 0.8
        ? " (Creative and expressive tone)"
        : parameters.temperature < 0.4
        ? " (Concise and analytical tone)"
        : " (Balanced tone)";
    const noise = Math.random() > 0.5 ? " 🤖" : "";
    return `${r}${tone}${noise}`;
  });
}

// Step 3: Save experiment and responses
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
        ...r.metrics
      }
    });
  }

  return experiment;
}

// Step 4: Generate multiple responses per parameter combo
export async function generateExperiment(req: Request, res: Response) {
  try {
    const { parameters, prompt } = req.body || {};

    if (!parameters || !prompt) {
      return res.status(400).json({ error: "Missing parameters or prompt" });
    }
    
    // 🔹 Convert comma-separated strings (e.g., "0.5,0.7") to numeric arrays
    const cleanedParams: Record<string, number[]> = Object.entries(parameters).reduce(
      (acc, [key, val]) => {
        if (typeof val === "string") {
          acc[key] = val
            .split(",")
            .map((v) => parseFloat(v.trim()))
            .filter((n) => !isNaN(n));
        } else if (Array.isArray(val)) {
          acc[key] = val
            .map((v) => (typeof v === "string" ? parseFloat(v.trim()) : Number(v)))
            .filter((n) => !isNaN(n));
        } else if (typeof val === "number") {
          acc[key] = [val];
        } else {
          acc[key] = [];
        }
        return acc;
      },
      {} as Record<string, number[]>
    );
    
    // 🔹 Generate parameter combinations (grid)
    const paramGrid = expandGrid(cleanedParams);
    const results: any[] = [];

    // 🔹 Generate multiple variations for each combo
    for (const combo of paramGrid) {
      const responseList = await mockLLMResponse(prompt, combo);
      for (const responseText of responseList) {
        const metrics = computeMetrics(responseText, prompt);
        results.push({ parameters: combo, response: responseText, metrics });
      }
    }

    // 🔹 Save to DB
    const experiment = await saveExperiment(prompt, results);

    return res.status(201).json({
      prompt,
      totalResponses: results.length,
      results
    });
  } catch (error) {
    console.error("Error creating experiment:", error);
    return res.status(500).json({ error: "Experiment generation failed!" });
  }
}

// Step 5: Retrieve experiment history
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
