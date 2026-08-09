import { NextRequest, NextResponse } from "next/server";
import { searchRepositories } from "@/lib/github";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required." },
      { status: 400 },
    );
  }

  try {
    const repositories = await searchRepositories(query);

    return NextResponse.json({
      repositories,
    });
  } catch (error) {
    console.error("GitHub repository search failed:", error);

    return NextResponse.json(
      { error: "Failed to search GitHub repositories." },
      { status: 500 },
    );
  }
}