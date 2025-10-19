import express from 'express';
import { generateExperiment, listExperiments } from '../Controllers/experimentController';

const router = express.Router();

// Experiment routes
router.post('/generate-experiment', generateExperiment);
router.get('/experiments', listExperiments);

export default router;