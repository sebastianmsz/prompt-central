import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await connectToDb();
		const prompts = await Prompt.find({}).populate("creator");

		return NextResponse.json(prompts, { status: 200 });
	} catch (error) {
		return NextResponse.json("Failed to fetch all prompts", { status: 500 });
	}
}
