import mongoose from "mongoose";

let cachedConnection = null;

export const connectToDatabase = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI in environment variables");
  }

  cachedConnection = await mongoose.connect(mongoUri);
  return cachedConnection;
};
