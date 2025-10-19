import express from 'express';
import { generateExperiment } from '../Controllers/experimentController';
import { exportExperiment,exportAllExperiments } from '../Controllers/exportController';
import { compareExperiments } from '../Controllers/compareController';


const router = express.Router();

// Experiment routes
router.post('/generate-experiment', generateExperiment);
router.get('/export-experiment/:experimentId', exportExperiment);
router.get('/export-all-experiments', exportAllExperiments);
router.post('/compare-experiments', compareExperiments);


export default router;
