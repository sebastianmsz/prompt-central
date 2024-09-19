import mongoose from "mongoose";

let isConnected = false;

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
		await mongoose.connect(mongoUri, {
			dbName: "prompt-central",
		});
		isConnected = true;
		console.log("MongoDB connected");
	} catch (error) {
		console.log(error);
	}
};
