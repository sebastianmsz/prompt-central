import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { userId, prompt, tag } = await request.json();

		await connectToDb();
		const newPrompt = new Prompt({ creator: userId, prompt, tag });
		await newPrompt.save();

		return NextResponse.json(newPrompt, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to create new prompt" },
			{ status: 500 },
		);
	}
}
