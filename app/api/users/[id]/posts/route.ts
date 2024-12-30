import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse, NextRequest } from "next/server";
interface Params {
	id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
	try {
		const { id } = await params;
		await connectToDb();
        if(!id){
            return NextResponse.json(
				{ message: "Missing user id" },
				{ status: 400 },
			);
        }

		const prompts = await Prompt.find({
			creator: id,
		}).populate("creator");

		return NextResponse.json(prompts, { status: 200 });
	} catch (error) {
		console.error("Error fetching prompts:", error);

		let errorMessage = "An unknown error occurred";
		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return NextResponse.json(
			{ error: "Failed to fetch prompts", details: errorMessage },
			{ status: 500 },
		);
	}
}