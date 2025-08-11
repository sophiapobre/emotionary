import mongoose from 'mongoose';
import { app } from './server.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); 

const PORT = process.env.PORT || 10000; // Render uses port 10000 by default

// connects to db
mongoose
  .connect(
    process.env.MONGODB_ID
  )
  .then(() => {
    console.log("Connected to db!");
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
