import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("Missing MONGODB_URI in environment variables");
    }
    await mongoose.connect(mongoUri);
    app.listen(PORT, () => {
        console.log(`✅ Server is running at port ${PORT}`);
    });
};
start().catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
});