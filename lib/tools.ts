import { tool } from "ai";
import { z } from "zod";

const githubApiUrl =
  process.env.GITHUB_API_URL ?? "https://api.github.com";

const githubToken = process.env.GITHUB_TOKEN;

export const getRepositoryDetails = tool({
  description:
    "Fetch current metadata and statistics for a public GitHub repository.",

  inputSchema: z.object({
    owner: z
      .string()
      .min(1)
      .describe("The GitHub repository owner or organization name."),

    repo: z
      .string()
      .min(1)
      .describe("The GitHub repository name."),
  }),

  execute: async ({ owner, repo }) => {
    const response = await fetch(
      `${githubApiUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(githubToken
            ? { Authorization: `Bearer ${githubToken}` }
            : {}),
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository ${owner}/${repo} was not found.`);
      }

      throw new Error(
        `GitHub API request failed with status ${response.status}.`,
      );
    }

    const data = await response.json();

    return {
      name: data.name,
      fullName: data.full_name,
      owner: data.owner.login,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      language: data.language,
      license: data.license?.spdx_id ?? null,
      topics: data.topics ?? [],
      url: data.html_url,
    };
  },
});