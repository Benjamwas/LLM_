"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const PrismaClient_1 = __importDefault(require("./PrismaClient"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get("/api/db-check", async (req, res) => {
    try {
        const experiments = await PrismaClient_1.default.experiment.findMany({ take: 1 });
        res.json({ ok: true, message: "✅ Database connection works!", experiments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "❌ Database connection failed", error });
    }
});
// Routes
app.use('/api', index_1.default);
// ✅ Health check route
app.get('/', (req, res) => {
    res.send(' LLM Experiment API is running...');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map