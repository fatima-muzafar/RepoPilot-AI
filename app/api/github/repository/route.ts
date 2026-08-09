import { NextRequest, NextResponse } from "next/server";
import { getRepository } from "@/lib/github";

export async function GET(request: NextRequest) {
  const owner = request.nextUrl.searchParams.get("owner")?.trim();
  const repo = request.nextUrl.searchParams.get("repo")?.trim();

  if (!owner || !repo) {
    return NextResponse.json(
      {
        error: "Repository owner and name are required.",
      },
      { status: 400 },
    );
  }

  try {
    const repository = await getRepository(owner, repo);

    return NextResponse.json({
      repository,
    });
  } catch (error) {
    console.error(
      "GitHub repository details request failed:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to load repository.";

    const status =
      message === "Repository not found." ? 404 : 500;

    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}