"use client";

import { useCallback, useRef, useState } from "react";
import type { RepositorySummary } from "@/types/repository";

interface UseRepositoriesResult {
  repositories: RepositorySummary[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

export function useRepositories(): UseRepositoriesResult {
  const [repositories, setRepositories] = useState<RepositorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string): Promise<void> => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setRepositories([]);
      setError(null);
      return;
    }

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/github/search?q=${encodeURIComponent(trimmedQuery)}`,
        {
          signal: controller.signal,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to search repositories.",
        );
      }

      setRepositories(data.repositories ?? []);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );

      setRepositories([]);
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  const clear = useCallback(() => {
    abortControllerRef.current?.abort();
    setRepositories([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    repositories,
    isLoading,
    error,
    search,
    clear,
  };
}