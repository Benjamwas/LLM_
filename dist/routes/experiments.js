"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const experimentController_1 = require("../Controllers/experimentController");
const experimentRouter = express_1.default.Router();
// Routes for experiments
experimentRouter.post("/generate-experiment", experimentController_1.generateExperiment);
experimentRouter.get("/experiments", experimentController_1.listExperiments);
exports.default = experimentRouter;
//# sourceMappingURL=experiments.js.map