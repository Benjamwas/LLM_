import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes/index';


dotenv.config();


const app = express();
app.use(cors());
app.use(bodyParser.json());

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
