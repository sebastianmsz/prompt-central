import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse } from "next/server";
import { CreatePost } from "@types";

export async function POST(request: Request) {
	try {
		const { userId, prompt, tag } = (await request.json()) as CreatePost & {
			userId: string;
		};

		if (!userId || !prompt || !tag) {
			return NextResponse.json(
				{
					message: "Please provide a userId, prompt and tag",
				},
				{ status: 400 },
			);
		}
		await connectToDb();
		const newPrompt = new Prompt({ creator: userId, prompt, tag });
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
				error: errorMessage,
			},
			{ status: 500 },
		);
	}
}