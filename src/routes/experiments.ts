import express from "express";
import { generateExperiment, listExperiments } from "../Controllers/experimentController";

const experimentRouter = express.Router();

// Routes for experiments
experimentRouter.post("/generate-experiment", generateExperiment);
experimentRouter.get("/experiments", listExperiments);

export default experimentRouter;
