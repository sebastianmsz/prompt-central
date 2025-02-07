import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse, NextRequest } from "next/server";
import User from "@models/user";

export async function GET(request: NextRequest) {
	try {
		await connectToDb();

		console.log("User model imported:", User);

		const DEFAULT_PAGE = 1;
		const DEFAULT_LIMIT = 12;
		const searchParams = request.nextUrl.searchParams;
		const page = Math.max(
			DEFAULT_PAGE,
			parseInt(searchParams.get("page") || `${DEFAULT_PAGE}`, 10),
		);
		const limit = Math.max(
			DEFAULT_LIMIT,
			parseInt(searchParams.get("limit") || `${DEFAULT_LIMIT}`, 10),
		);
		const skip = (page - 1) * limit;

		const total = await Prompt.countDocuments({});
		const prompts = await Prompt.find({})
			.populate("creator")
			.skip(skip)
			.limit(limit);

		return NextResponse.json(
			{
				prompts,
				pagination: {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching prompts:", error);

		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json(
			{
				error: "Failed to fetch prompts",
				code: "PROMPT_FETCH_ERROR",
				details: errorMessage,
			},
			{ status: 500 },
		);
	}
}
