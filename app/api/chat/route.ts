import { streamText, convertToModelMessages } from "ai";
import { openrouter, AI_MODEL, SYSTEM_PROMPT } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const messages = body.messages ?? [];
    const repository = body.repository;

    const repositoryContext = repository
      ? `
Repository context:

- Owner: ${repository.owner}
- Name: ${repository.name}
- Description: ${
          repository.description ?? "No description provided."
        }
- Language: ${repository.language ?? "Unknown"}
- Stars: ${repository.stargazers_count ?? 0}
- Forks: ${repository.forks_count ?? 0}
- URL: ${repository.html_url ?? "Unavailable"}
`
      : "No repository context was provided.";

    const modelMessages =
      await convertToModelMessages(messages);

    const result = streamText({
      model: openrouter(AI_MODEL),

      system: `${SYSTEM_PROMPT}

${repositoryContext}`,

      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate AI response.",
      },
      { status: 500 },
    );
  }
}