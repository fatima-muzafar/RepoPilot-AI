import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RepositoryToolResult from "@/components/ai/RepositoryToolResult";

const repository = {
  name: "repo-pilot-ai",
  fullName: "fatima-muzafar/repo-pilot-ai",
  owner: "fatima-muzafar",
  description: "An AI-powered repository assistant.",
  stars: 1234,
  forks: 56,
  watchers: 78,
  language: "TypeScript",
  license: "MIT",
  topics: [
    "nextjs",
    "react",
    "typescript",
    "ai",
    "github",
    "firebase",
  ],
  url: "https://github.com/fatima-muzafar/repo-pilot-ai",
};

describe("RepositoryToolResult", () => {
  it("renders repository information", () => {
    render(<RepositoryToolResult {...repository} />);

    expect(
      screen.getByText("Repository information"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "fatima-muzafar/repo-pilot-ai",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("An AI-powered repository assistant."),
    ).toBeInTheDocument();
  });

  it("renders repository statistics", () => {
    render(<RepositoryToolResult {...repository} />);

    expect(screen.getByText("Stars")).toBeInTheDocument();
    expect(screen.getByText("Forks")).toBeInTheDocument();
    expect(screen.getByText("Watchers")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("56")).toBeInTheDocument();
    expect(screen.getByText("78")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("shows fallback text when optional repository information is missing", () => {
    render(
      <RepositoryToolResult
        {...repository}
        description={null}
        language={null}
        license={null}
      />,
    );

    expect(
      screen.getByText("No description provided."),
    ).toBeInTheDocument();

    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.getByText("No license")).toBeInTheDocument();
  });

  it("renders repository topics", () => {
    render(<RepositoryToolResult {...repository} />);

    expect(screen.getByText("nextjs")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("ai")).toBeInTheDocument();
    expect(screen.getByText("github")).toBeInTheDocument();
  });

  it("renders at most five topics", () => {
    render(<RepositoryToolResult {...repository} />);

    expect(screen.getByText("nextjs")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("ai")).toBeInTheDocument();
    expect(screen.getByText("github")).toBeInTheDocument();

    expect(screen.queryByText("firebase")).not.toBeInTheDocument();
  });

  it("renders a GitHub link with the repository URL", () => {
    render(<RepositoryToolResult {...repository} />);

    const githubLink = screen.getByRole("link", {
      name: "View on GitHub",
    });

    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/fatima-muzafar/repo-pilot-ai",
    );

    expect(githubLink).toHaveAttribute("target", "_blank");
  });
});