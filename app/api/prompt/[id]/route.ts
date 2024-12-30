import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";
import { NextResponse, NextRequest } from "next/server";

interface Params {
  id: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    await connectToDb();

    if (!id) {
      return NextResponse.json(
        { message: "Missing prompt id" },
        { status: 400 }
      );
    }

    const deletedPrompt = await Prompt.findByIdAndDelete(id);

    if (!deletedPrompt) {
      return NextResponse.json(
        { message: "Prompt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Prompt deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting prompt:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      {
        message: "Failed to delete prompt",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    await connectToDb();

    if (!id) {
      return NextResponse.json(
        { message: "Missing prompt id" },
        { status: 400 }
      );
    }

    const prompt = await Prompt.findById(id);

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(prompt, { status: 200 });
  } catch (error) {
    console.error("Error fetching prompt:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { error: "Failed to fetch prompt", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    await connectToDb();

    if (!id) {
      return NextResponse.json(
        { message: "Missing prompt id" },
        { status: 400 }
      );
    }

    const { prompt, tag } = await request.json() as { prompt: string; tag: string };

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      id,
      { prompt, tag },
      { new: true }
    );

    if (!updatedPrompt) {
      return NextResponse.json(
        { message: "Prompt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPrompt, { status: 200 });
  } catch (error) {
    console.error("Error updating prompt:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      {
        message: "Failed to update prompt",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
