"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { RepositorySummary } from "@/types/repository";

import useAuth from "@/hooks/useAuth";
import {
  isFavorite,
  removeFavorite,
  saveFavorite,
} from "@/lib/favorites";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
  }).format(value);
}

export default function RepositoryPage() {
  const params = useParams<{
    owner: string;
    repo: string;
  }>();

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const owner = decodeURIComponent(params.owner);
  const repo = decodeURIComponent(params.repo);

  const [repository, setRepository] =
    useState<RepositorySummary | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSaved, setIsSaved] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRepository() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/github/repository?owner=${encodeURIComponent(
            owner,
          )}&repo=${encodeURIComponent(repo)}`,
          {
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ?? "Failed to load repository.",
          );
        }

        setRepository(data.repository);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadRepository();

    return () => {
      controller.abort();
    };
  }, [owner, repo]);

 useEffect(() => {
  if (!user || !repository) {
    setIsSaved(false);
    setFavoriteError(null);
    return;
  }

  const userId = user.uid;
  const repositoryId = repository.id;

  let cancelled = false;

  async function checkFavorite() {
    try {
      const saved = await isFavorite(userId, repositoryId);

      if (!cancelled) {
        setIsSaved(saved);
      }
    } catch {
      if (!cancelled) {
        setFavoriteError(
          "Unable to check favorite status.",
        );
      }
    }
  }

  checkFavorite();

  return () => {
    cancelled = true;
  };
}, [user, repository]);

  const handleFavorite = async () => {
    if (!repository) {
      return;
    }

    setFavoriteError(null);

    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/repository/${owner}/${repo}`,
        )}`,
      );
      return;
    }

    setIsFavoriteLoading(true);

    try {
      if (isSaved) {
        await removeFavorite(user.uid, repository.id);
        setIsSaved(false);
      } else {
        await saveFavorite(user.uid, repository);
        setIsSaved(true);
      }
    } catch {
      setFavoriteError(
        "Unable to update favorites. Please try again.",
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] py-12 dark:bg-[#06141B]">
        <Container>
          <Card>
            <p className="text-sm text-slate-600 dark:text-[#9BA8AB]">
              Loading repository...
            </p>
          </Card>
        </Container>
      </main>
    );
  }

  if (error || !repository) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] py-12 dark:bg-[#06141B]">
        <Container>
          <Card>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-[#CCD0CF]">
              Unable to load repository
            </h1>

            <p className="mt-2 text-sm text-red-600 dark:text-red-300">
              {error ?? "Repository not found."}
            </p>

            <Link
              href="/search"
              className="mt-6 inline-block"
            >
              <Button type="button">
                Back to search
              </Button>
            </Link>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12 dark:bg-[#06141B]">
      <Container>
        <div className="mx-auto max-w-4xl">
          <Link
            href="/search"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-[#9BA8AB] dark:hover:text-[#CCD0CF]"
          >
            ← Back to search
          </Link>

          <div className="mt-6">
            <Card>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm text-slate-500 dark:text-[#9BA8AB]">
                    {repository.owner}
                  </p>

                  <h1 className="mt-1 break-words text-3xl font-bold text-slate-900 dark:text-[#CCD0CF]">
                    {repository.name}
                  </h1>

                  <p className="mt-4 text-base leading-7 text-slate-600 dark:text-[#9BA8AB]">
                    {repository.description ??
                      "No description provided."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-[#9BA8AB]">
                  <span>
                    ★ {formatNumber(repository.stars)} stars
                  </span>

                  <span>
                    {formatNumber(repository.forks)} forks
                  </span>

                  <span>
                    {formatNumber(repository.openIssues)} open issues
                  </span>

                  <span>
                    {repository.language ??
                      "Unknown language"}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-6 dark:border-[#4A5C6A]">
                  <p className="text-sm font-medium text-slate-500 dark:text-[#9BA8AB]">
                    Default branch
                  </p>

                  <p className="mt-1 text-sm text-slate-900 dark:text-[#CCD0CF]">
                    {repository.defaultBranch}
                  </p>
                </div>

                {favoriteError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                  >
                    {favoriteError}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/assistant?owner=${encodeURIComponent(
                      repository.owner,
                    )}&repo=${encodeURIComponent(
                      repository.name,
                    )}`}
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-[#253745] dark:hover:bg-[#4A5C6A]"
                  >
                    Ask RepoPilot
                  </Link>

                  <Button
                    type="button"
                    onClick={handleFavorite}
                    disabled={
                      authLoading ||
                      isFavoriteLoading
                    }
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isFavoriteLoading
                      ? "Updating..."
                      : isSaved
                        ? "Remove from Favorites"
                        : "Save to Favorites"}
                  </Button>

                  <a
                    href={repository.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-[#4A5C6A] dark:text-[#CCD0CF] dark:hover:bg-[#253745]"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}