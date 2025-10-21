"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const experiments_1 = __importDefault(require("./experiments"));
const exportController_1 = require("../Controllers/exportController");
const compareController_1 = require("../Controllers/compareController");
const router = express_1.default.Router();
// Use experiment routes
router.use("/", experiments_1.default);
// Other routes
router.get("/export-experiment/:experimentId", exportController_1.exportExperiment);
router.get("/export-all-experiments", exportController_1.exportAllExperiments);
router.post("/compare-experiments", compareController_1.compareExperiments);
exports.default = router;
//# sourceMappingURL=index.js.map