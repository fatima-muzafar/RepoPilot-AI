"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import {
  getFavorites,
  removeFavorite,
} from "@/lib/favorites";
import type { RepositorySummary } from "@/types/repository";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
  }).format(value);
}

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();

  const [favorites, setFavorites] = useState<RepositorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
  if (authLoading || !user) {
    return;
  }

  const userId = user.uid;

  let cancelled = false;

  async function loadFavorites() {
    setIsLoading(true);
    setError(null);

    try {
      const savedRepositories = await getFavorites(userId);

      if (!cancelled) {
        setFavorites(savedRepositories);
      }
    } catch {
      if (!cancelled) {
        setError(
          "Unable to load your favorites. Please try again.",
        );
      }
    } finally {
      if (!cancelled) {
        setIsLoading(false);
      }
    }
  }

  loadFavorites();

  return () => {
    cancelled = true;
  };
}, [user, authLoading]);

  const handleRemove = async (repositoryId: number) => {
    if (!user) {
      return;
    }

    setRemovingId(repositoryId);
    setError(null);

    try {
      await removeFavorite(user.uid, repositoryId);

      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (repository) => repository.id !== repositoryId,
        ),
      );
    } catch {
      setError(
        "Unable to remove this favorite. Please try again.",
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading || (user && isLoading)) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-12 dark:bg-[#06141B]">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Card>
              <p className="text-sm text-slate-600 dark:text-[#9BA8AB]">
                Loading favorites...
              </p>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-12 dark:bg-[#06141B]">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Card>
              <div className="py-12 text-center">
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-[#9BA8AB]">
                  Favorites
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-[#CCD0CF]">
                  Sign in to view your favorites
                </h1>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-[#9BA8AB]">
                  Log in to access the repositories you have saved.
                </p>

                <Link href="/login" className="mt-6 inline-block">
                  <Button type="button">
                    Sign in
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 dark:bg-[#06141B]">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-[#9BA8AB]">
              Favorites
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-[#CCD0CF]">
              Your saved repositories
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-[#9BA8AB]">
              Repositories you have saved to your RepoPilot AI account.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
            >
              {error}
            </div>
          )}

          {favorites.length === 0 ? (
            <Card>
              <div className="py-12 text-center">
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-[#9BA8AB]">
                  Favorites
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-[#CCD0CF]">
                  No saved repositories yet
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-[#9BA8AB]">
                  Explore repositories and save the ones you want to
                  come back to later.
                </p>

                <Link
                  href="/search"
                  className="mt-6 inline-block"
                >
                  <Button type="button">
                    Explore repositories
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="mt-8 grid gap-6">
              {favorites.map((repository) => (
                <Card key={repository.id}>
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-[#9BA8AB]">
                        {repository.owner}
                      </p>

                      <Link
                        href={`/repository/${encodeURIComponent(
                          repository.owner,
                        )}/${encodeURIComponent(
                          repository.name,
                        )}`}
                        className="mt-1 block break-words text-2xl font-bold text-slate-900 hover:underline dark:text-[#CCD0CF]"
                      >
                        {repository.name}
                      </Link>

                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-[#9BA8AB]">
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

                    <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-[#4A5C6A] sm:flex-row">
                      <Link
                        href={`/repository/${encodeURIComponent(
                          repository.owner,
                        )}/${encodeURIComponent(
                          repository.name,
                        )}`}
                        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-[#253745] dark:hover:bg-[#4A5C6A]"
                      >
                        View repository
                      </Link>

                      <Button
                        type="button"
                        onClick={() =>
                          handleRemove(repository.id)
                        }
                        disabled={removingId === repository.id}
                        className="disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {removingId === repository.id
                          ? "Removing..."
                          : "Remove favorite"}
                      </Button>

                      <a
                        href={repository.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-[#4A5C6A] dark:text-[#CCD0CF] dark:hover:bg-[#253745]"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}