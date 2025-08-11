import express from 'express';
import cors from 'cors';
import { router } from './routes/index.js';

// exports app so it can be used in prod and testing

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    "https://emotionary-ubc.vercel.app", // Production frontend
    "http://localhost:5173", // Local development (Vite default)
    "http://localhost:5174", // Local development (alternative port)
    "http://localhost:3000", // Local development (alternative)
    "http://localhost", // Docker frontend
    "http://localhost:80" // Docker frontend with explicit port
  ],
  credentials: true,
}));
app.use('/', router);

export { app };