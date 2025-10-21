import express from "express";
import experimentRouter from "./experiments";
import { exportExperiment, exportAllExperiments } from "../Controllers/exportController";
import { compareExperiments } from "../Controllers/compareController";

const router = express.Router();

// Use experiment routes
router.use("/", experimentRouter);

// Other routes
router.get("/export-experiment/:experimentId", exportExperiment);
router.get("/export-all-experiments", exportAllExperiments);
router.post("/compare-experiments", compareExperiments);

export default router;
