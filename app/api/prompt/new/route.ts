// /app/api/prompt/new/route.ts
import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse } from "next/server";
import { CreatePost } from "@types";

export async function POST(request: Request) {
	try {
		const reqBody = (await request.json()) as CreatePost & {
			userId: string;
		};

		// Validate the tag field
		if (
			!reqBody.userId ||
			!reqBody.prompt ||
			!reqBody.tag ||
			!Array.isArray(reqBody.tag) ||
			reqBody.tag.length === 0
		) {
			return NextResponse.json(
				{
					message:
						"Please provide a userId, prompt, and at least one tag (as an array)",
				},
				{ status: 400 },
			);
		}

		await connectToDb();
		const newPrompt = new Prompt({
			creator: reqBody.userId,
			prompt: reqBody.prompt,
			tag: reqBody.tag,
		});
		await newPrompt.save();

		return NextResponse.json(newPrompt, { status: 201 });
	} catch (error) {
		console.error("Error creating new prompt:", error);

		let errorMessage = "An unknown error occurred";
		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return NextResponse.json(
			{
				message: "Failed to create new prompt",
				error: errorMessage, // Send the actual error message in the response
			},
			{ status: 500 },
		);
	}
}
