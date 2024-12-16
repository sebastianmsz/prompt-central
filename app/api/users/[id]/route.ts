import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";
import User from "@models/user";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		await connectToDb();

		const url = new URL(request.url);
		const id = url.searchParams.get("id");

		const user = await User.findById(id);
		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}
		const prompts = await Prompt.find({
			creator: id,
		}).populate("creator");

		return NextResponse.json({ user, prompts }, { status: 200 });
	} catch (error) {
		console.error("Error fetching user data:", error);

		let errorMessage = "An unknown error occurred";
		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return NextResponse.json(
			{ error: "Failed to fetch user data", details: errorMessage },
			{ status: 500 },
		);
	}
}
