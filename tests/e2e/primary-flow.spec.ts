import { test, expect } from "@playwright/test";

const repository = {
  owner: "facebook",
  name: "react",
  description: "The library for web and native user interfaces.",
  language: "JavaScript",
  stars: 220000,
  forks: 45000,
  openIssues: 1200,
  defaultBranch: "main",
  htmlUrl: "https://github.com/facebook/react",
};

test("primary flow: repository details to RepoPilot assistant", async ({
  page,
}) => {
  // Mock the GitHub repository API.
  await page.route("**/api/github/repository*", async (route) => {
    console.log(
      "MOCKING GITHUB API:",
      route.request().url(),
    );

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        repository,
      }),
    });
  });

  // Mock the AI chat API.
  await page.route("**/api/chat*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/plain",
      body: "",
    });
  });

  // Debug: show GitHub API requests.
  page.on("request", (request) => {
    if (request.url().includes("/api/github/repository")) {
      console.log(
        "API REQUEST:",
        request.url(),
      );
    }
  });

  // Debug: show GitHub API responses.
  page.on("response", (response) => {
    if (response.url().includes("/api/github/repository")) {
      console.log(
        "API RESPONSE:",
        response.status(),
        response.url(),
      );
    }
  });

  // Start at the repository details page.
  await page.goto("/repository/facebook/react");

  // Verify repository details loaded.
  await expect(
    page.getByRole("heading", { name: "react" }),
  ).toBeVisible();

  await expect(
    page.getByText(
      "The library for web and native user interfaces.",
    ),
  ).toBeVisible();

  // Open RepoPilot.
  await page
    .getByRole("link", { name: "Ask RepoPilot" })
    .click();

  // Verify the assistant page loaded with repository context.
  await expect(
    page.getByRole("heading", {
      name: "facebook/react",
    }),
  ).toBeVisible();

  await expect(
    page.getByText(
      "Ask questions about this repository.",
    ),
  ).toBeVisible();

  // Enter a question.
  const input = page.getByRole("textbox", {
    name: "Ask RepoPilot a question",
  });

  await input.fill("What technologies are used?");

  // Submit the question.
  await page
    .getByRole("button", { name: "Send" })
    .click();

  // Verify the input is cleared after submission.
  await expect(input).toHaveValue("");
});