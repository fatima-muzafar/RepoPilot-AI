import type {
  GitHubRepository,
  GitHubSearchResponse,
} from "@/types/github";
import type { RepositorySummary } from "@/types/repository";

const GITHUB_API_URL = "https://api.github.com";

function mapRepository(repository: GitHubRepository): RepositorySummary {
  return {
    id: repository.id,
    name: repository.name,
    fullName: repository.full_name,
    owner: repository.owner.login,
    ownerAvatarUrl: repository.owner.avatar_url,
    description: repository.description,
    language: repository.language,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    openIssues: repository.open_issues_count,
    defaultBranch: repository.default_branch,
    htmlUrl: repository.html_url,
  };
}

export async function searchRepositories(
  query: string,
  signal?: AbortSignal,
): Promise<RepositorySummary[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const url = new URL(`${GITHUB_API_URL}/search/repositories`);

  url.searchParams.set("q", trimmedQuery);
  url.searchParams.set("per_page", "10");
  url.searchParams.set("sort", "stars");
  url.searchParams.set("order", "desc");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
    },
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed with status ${response.status}`,
    );
  }

  const data = (await response.json()) as GitHubSearchResponse;

  return data.items.map(mapRepository);

  
}

export async function getRepository(
  owner: string,
  repo: string,
  signal?: AbortSignal,
): Promise<RepositorySummary> {
  const encodedOwner = encodeURIComponent(owner);
  const encodedRepo = encodeURIComponent(repo);

  const response = await fetch(
    `${GITHUB_API_URL}/repos/${encodedOwner}/${encodedRepo}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
      },
      signal,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Repository not found.");
    }

    throw new Error(
      `GitHub API request failed with status ${response.status}`,
    );
  }

  const repository =
    (await response.json()) as GitHubRepository;

  return mapRepository(repository);
}