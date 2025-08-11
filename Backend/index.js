import mongoose from 'mongoose';
import { app } from './server.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); 

const PORT = process.env.PORT || 3000; // <-- Change this from 10000 to 3000

// Connect to MongoDB
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_ID)
    .then(() => console.log("Connected to db!"))
    .catch(err => console.error("DB connection error:", err));
}

// For Vercel serverless deployment
export default app;

// For local development only
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on http://localhost:${PORT}`);
  });
}