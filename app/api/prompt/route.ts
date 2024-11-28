import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await connectToDb();
		const prompts = await Prompt.find({}).populate("creator");

		return NextResponse.json(prompts, { status: 200 });
	} catch (error) {
		console.error("Error fetching prompts:", error);

		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred";

		return NextResponse.json(
			{ error: "Failed to fetch prompts", details: errorMessage },
			{ status: 500 },
		);
	}
}
