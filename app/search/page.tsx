"use client";

import Link from "next/link";
import { useState } from "react";

import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useRepositories } from "@/hooks/useRepositories";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
  }).format(value);
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const {
    repositories,
    isLoading,
    error,
    search,
  } = useRepositories();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return;
  }

  setHasSearched(true);
  await search(trimmedQuery);
}
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Search GitHub repositories
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Find a repository and open it to explore its details with
              RepoPilot.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <label
              htmlFor="repository-search"
              className="sr-only"
            >
              Search repositories
            </label>

            <input
              id="repository-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try react, next.js, vite..."
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <Button
              type="submit"
              disabled={!query.trim() || isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>

          <div
            className="mt-8 space-y-4"
            aria-live="polite"
            aria-busy={isLoading}
          >
            {isLoading && (
              <Card>
                <p className="text-sm text-slate-600">
                  Searching GitHub Repositries...
                </p>
              </Card>
            )}

            {error && (
              <Card>
                <p className="font-medium text-red-600">
                  Search failed
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {error}
                </p>
              </Card>
            )}

           {hasSearched &&
              !isLoading &&
              !error &&
               repositories.length === 0 && (
                <Card>
                  <p className="font-medium text-slate-900">
                    No repositories found.
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Try a different repository name or keyword.
                  </p>
                </Card>
              )}

            {repositories.map((repository) => (
              <Card key={repository.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">
                      {repository.owner}
                    </p>

                    <h2 className="mt-1 break-words text-xl font-semibold text-slate-900">
                      {repository.name}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {repository.description ??
                        "No description provided."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                      <span>
                        ★ {formatNumber(repository.stars)}
                      </span>

                      <span>
                        {repository.language ??
                          "Unknown language"}
                      </span>

                      <span>
                        Forks {formatNumber(repository.forks)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/repository/${encodeURIComponent(
                      repository.owner,
                    )}/${encodeURIComponent(repository.name)}`}
                    className="shrink-0 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Explore
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}