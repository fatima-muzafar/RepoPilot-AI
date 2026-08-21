import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AssistantClient from "@/app/assistant/AssistantClient";

const mockSendMessage = vi.fn();
const mockRegenerate = vi.fn();
const mockStop = vi.fn();

type MockChatMessage = {
  id: string;
  role: string;
  parts: Array<Record<string, unknown>>;
};

let mockChatState = {
  messages: [] as MockChatMessage[],
  sendMessage: mockSendMessage,
  regenerate: mockRegenerate,
  stop: mockStop,
  status: "ready",
  error: undefined as Error | undefined,
};

vi.mock("@ai-sdk/react", () => ({
  useChat: () => mockChatState,
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "owner") return "facebook";
      if (key === "repo") return "react";
      return null;
    },
  }),
}));

vi.mock("@/components/ai/RepositoryToolResult", () => ({
  default: ({
    fullName,
    description,
  }: {
    fullName: string;
    description: string | null;
  }) => (
    <div>
      <p>Repository information</p>
      <h3>{fullName}</h3>
      <p>{description ?? "No description provided."}</p>
    </div>
  ),
}));

const repository = {
  owner: "facebook",
  name: "react",
  description: "The library for web and native user interfaces.",
  language: "JavaScript",
  stargazers_count: 220000,
  forks_count: 45000,
  html_url: "https://github.com/facebook/react",
};

function setChatState(
  overrides: Partial<typeof mockChatState>,
) {
  mockChatState = {
    ...mockChatState,
    ...overrides,
  };
}

function mockRepositoryFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        repository,
      }),
    }),
  );
}

describe("AssistantClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockChatState = {
      messages: [],
      sendMessage: mockSendMessage,
      regenerate: mockRegenerate,
      stop: mockStop,
      status: "ready",
      error: undefined,
    };

    mockRepositoryFetch();
  });

  it("shows the pending thinking state", async () => {
    setChatState({
      status: "submitted",
    });

    render(<AssistantClient />);

    expect(
      await screen.findByText("facebook/react"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("RepoPilot is thinking..."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: "Ask RepoPilot a question",
      }),
    ).toBeDisabled();
  });

  it("renders streamed assistant content", async () => {
    setChatState({
      status: "streaming",
      messages: [
        {
          id: "assistant-1",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "React uses a component-based architecture.",
            },
          ],
        },
      ],
    });

    render(<AssistantClient />);

    expect(
      await screen.findByText(
        "React uses a component-based architecture.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Stop response" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: "Ask RepoPilot a question",
      }),
    ).toBeDisabled();
  });

  it("shows the chat error and retry action", async () => {
    setChatState({
      error: new Error("AI request failed"),
      status: "ready",
    });

    render(<AssistantClient />);

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Unable to get a response",
    );

    expect(
  screen.getByText(
    /Something went wrong while generating the answer/,
  ),
).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Retry" }),
    ).toBeInTheDocument();
  });

  it("renders the repository tool loading state", async () => {
    setChatState({
      messages: [
        {
          id: "tool-loading",
          role: "assistant",
          parts: [
            {
              type: "tool-get_repository_details",
              state: "input-streaming",
            },
          ],
        },
      ],
    });

    render(<AssistantClient />);

    expect(
      await screen.findByText(
        "Looking up repository information...",
      ),
    ).toBeInTheDocument();
  });

  it("renders repository tool input details", async () => {
    setChatState({
      messages: [
        {
          id: "tool-input",
          role: "assistant",
          parts: [
            {
              type: "tool-get_repository_details",
              state: "input-available",
              input: {
                owner: "facebook",
                repo: "react",
              },
            },
          ],
        },
      ],
    });

    render(<AssistantClient />);

    expect(
      await screen.findByText("Repository lookup"),
    ).toBeInTheDocument();

    expect(
  screen.getAllByText("facebook/react"),
).toHaveLength(2);

    expect(
      screen.getByText(
        "Fetching current repository information...",
      ),
    ).toBeInTheDocument();
  });

  it("renders the repository tool error state", async () => {
    setChatState({
      messages: [
        {
          id: "tool-error",
          role: "assistant",
          parts: [
            {
              type: "tool-get_repository_details",
              state: "output-error",
            },
          ],
        },
      ],
    });

    render(<AssistantClient />);

    const status = await screen.findByRole("status");

    expect(status).toHaveTextContent(
      "Unable to get repository information",
    );

    expect(screen.getByText("Repository lookup failed"))
      .toBeInTheDocument();

    expect(screen.getByText(
      "We couldn't retrieve the repository information right now.",
    )).toBeInTheDocument();
  });

  it("submits a question with repository context", async () => {
    const user = userEvent.setup();

    render(<AssistantClient />);

    await screen.findByText("facebook/react");

    const input = screen.getByRole("textbox", {
      name: "Ask RepoPilot a question",
    });

    await user.type(input, "What technologies are used?");

    await user.click(
      screen.getByRole("button", { name: "Send" }),
    );

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledTimes(1);
    });

    expect(mockSendMessage).toHaveBeenCalledWith(
      {
        text: "What technologies are used?",
      },
      {
        body: {
          repository,
        },
      },
    );
  });
});