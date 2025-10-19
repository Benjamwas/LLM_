import type { Request, Response } from 'express';
declare function generateExperiment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare function listExperiments(req: Request, res: Response): Promise<void>;
export { generateExperiment, listExperiments };
//# sourceMappingURL=experiments.d.ts.map