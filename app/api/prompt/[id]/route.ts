import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
	try {
		await connectToDb();

		const url = new URL(request.url);
		const id = url.searchParams.get("id");

		const deletedPrompt = await Prompt.findByIdAndDelete(id);

		if (!deletedPrompt) {
			return NextResponse.json(
				{ message: "Prompt not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ message: "Prompt deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error deleting prompt:", error);
		let errorMessage = "An unknown error occurred";
		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return NextResponse.json(
			{
				message: "Failed to delete prompt",
				error: errorMessage,
			},
			{ status: 500 },
		);
	}
}
