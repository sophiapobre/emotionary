import express from 'express';
import cors from 'cors';
import { router } from './routes/index.js';

// exports app so it can be used in prod and testing

const app = express();

app.use(express.json());
app.use(cors({
  origin: "https://emotionary-ubc.vercel.app", // Vercel frontend URL
  credentials: true,
}));
app.use('/', router);

export { app };
