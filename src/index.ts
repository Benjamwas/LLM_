import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes/index';
import prisma from './PrismaClient';


dotenv.config();



const app = express();
app.use(cors());
app.use(bodyParser.json());



app.get("/api/db-check", async (req, res) => {
  try {
    const experiments = await prisma.experiment.findMany({ take: 1 });
    res.json({ ok: true, message: "✅ Database connection works!", experiments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "❌ Database connection failed", error });
  }
});
// Routes
app.use('/api', routes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send(' LLM Experiment API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
