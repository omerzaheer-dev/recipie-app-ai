import dotenv from "dotenv";
dotenv.config();

import { app } from "../src/app.js";
import { connectToDatabase } from "../src/config/db.js";

// Initialize database connection on cold start
let dbInitialized = false;

async function initializeDb() {
  if (!dbInitialized) {
    try {
      await connectToDatabase();
      dbInitialized = true;
      console.log("✅ Database connected on serverless cold start");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }
}

// Vercel serverless handler
export default async function handler(req, res) {
  try {
    // Initialize database on first request
    await initializeDb();

    // Pass request to Express app
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
}
