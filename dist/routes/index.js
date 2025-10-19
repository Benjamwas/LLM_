import express from 'express';
import { generateExperiment } from './experiments.js';
const router = express.Router();
// Experiment routes
router.post('/generate-experiment', generateExperiment);
export default router;
//# sourceMappingURL=index.js.map