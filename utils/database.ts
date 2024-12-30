import mongoose from "mongoose";

let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 3;

export const connectToDb = async () => {
	mongoose.set("strictQuery", true);
	if (isConnected) {
		console.log("MongoDB is already connected");
		return;
	}

	const mongoUri = process.env.MONGODB_URI;
	if (!mongoUri) {
		throw new Error("MONGODB_URI is not defined in the environment variables");
	}

	try {
		if (connectionAttempts >= MAX_RETRIES) {
			throw new Error("Max connection attempts reached");
		}

		await mongoose.connect(mongoUri, {
			dbName: "prompt-central",
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 5000,
		});

		isConnected = true;
		connectionAttempts = 0;
		console.log("MongoDB connected");
	} catch (error) {
		connectionAttempts++;
		console.error("MongoDB connection error:", error);
		throw error;
	}
};