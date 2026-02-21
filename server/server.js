import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);


const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();