"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useSearchParams } from "next/navigation";

import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { RepositorySummary } from "@/types/repository";

export default function AssistantClient() {
  const searchParams = useSearchParams();

  const ownerParam = searchParams.get("owner");
  const repoParam = searchParams.get("repo");

  const owner = ownerParam ?? "";
  const repo = repoParam ?? "";

  const [repository, setRepository] =
    useState<RepositorySummary | null>(null);

  const [repositoryLoading, setRepositoryLoading] =
    useState(true);

  const [repositoryError, setRepositoryError] =
    useState<string | null>(null);

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(null);

  const [showJumpToLatest, setShowJumpToLatest] =
    useState(false);

  const {
    messages,
    sendMessage,
    stop,
    status,
    error,
  } = useChat();

  const isStreaming =
    status === "submitted" || status === "streaming";

  /*
   * Load the selected repository so the AI always receives
   * repository context with every message.
   */
  useEffect(() => {
    if (!owner || !repo) {
      return;
    }

    const controller = new AbortController();

    async function loadRepository() {
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
        setRepositoryError(null);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setRepositoryError(
          error instanceof Error
            ? error.message
            : "Failed to load repository.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setRepositoryLoading(false);
        }
      }
    }

    loadRepository();

    return () => {
      controller.abort();
    };
  }, [owner, repo]);

  /*
   * Keep the chat pinned to the bottom only when the user
   * is already near the bottom.
   *
   * If the user scrolls upward, new streamed tokens will
   * not force the page back down.
   */
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    const isNearBottom = distanceFromBottom < 80;

    if (isNearBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });

      setShowJumpToLatest(false);
    }
  }, [messages]);

  function handleMessagesScroll() {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setShowJumpToLatest(distanceFromBottom > 80);
  }

  function jumpToLatest() {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });

    setShowJumpToLatest(false);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const text = String(
      formData.get("message") ?? "",
    ).trim();

    if (!text || isStreaming || !repository) {
      return;
    }

    event.currentTarget.reset();

    await sendMessage(
      {
        text,
      },
      {
        body: {
          repository,
        },
      },
    );
  }

  if (!owner || !repo) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Container>
          <div className="mx-auto max-w-3xl py-12">
            <Card>
              <h1 className="text-xl font-semibold text-slate-900">
                Unable to start RepoPilot
              </h1>

              <p className="mt-2 text-sm text-red-600">
                Repository information is missing.
              </p>
            </Card>
          </div>
        </Container>
      </main>
    );
  }

  if (repositoryLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Container>
          <div className="mx-auto max-w-3xl py-12">
            <Card>
              <p className="text-sm text-slate-600">
                Loading repository context...
              </p>
            </Card>
          </div>
        </Container>
      </main>
    );
  }

  if (repositoryError || !repository) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Container>
          <div className="mx-auto max-w-3xl py-12">
            <Card>
              <h1 className="text-xl font-semibold text-slate-900">
                Unable to start RepoPilot
              </h1>

              <p className="mt-2 text-sm text-red-600">
                {repositoryError ??
                  "Repository context is unavailable."}
              </p>
            </Card>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Container>
        <div className="mx-auto max-w-4xl py-6 sm:py-10">
          <Card>
            <div className="overflow-hidden">
              {/* Repository header */}
              <div className="border-b border-slate-200 pb-5">
                <p className="text-sm font-medium text-slate-500">
                  RepoPilot AI
                </p>

                <h1 className="mt-1 break-words text-2xl font-bold text-slate-900">
                  {repository.owner}/{repository.name}
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                  Ask questions about this repository.
                </p>
              </div>

              {/* Chat messages */}
              <div
                ref={messagesContainerRef}
                onScroll={handleMessagesScroll}
                className="relative h-[50vh] min-h-[320px] max-h-[520px] space-y-5 overflow-y-auto py-6 pr-2"
                aria-live="polite"
                aria-busy={isStreaming}
              >
                {messages.length === 0 && (
                  <div className="flex min-h-[280px] items-center justify-center px-4 text-center">
                    <div className="max-w-md">
                      <h2 className="text-lg font-semibold text-slate-900">
                        Ask RepoPilot
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Ask about the repository, its purpose,
                        technology, architecture, or anything
                        available in the repository context.
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        message.role === "user"
                          ? "max-w-[90%] break-words rounded-2xl rounded-br-md bg-slate-900 px-4 py-3 text-sm leading-6 text-white sm:max-w-[85%]"
                          : "max-w-[90%] break-words rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 sm:max-w-[85%]"
                      }
                    >
                      {message.parts.map(
                        (part, index) => {
                          if (part.type !== "text") {
                            return null;
                          }

                          return (
                            <span key={index}>
                              {part.text}
                            </span>
                          );
                        },
                      )}
                    </div>
                  </div>
                ))}

                {/* Thinking indicator appears before first token */}
                {status === "submitted" && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                      <span
                        className="mr-2 inline-block animate-pulse"
                        aria-hidden="true"
                      >
                        ●
                      </span>

                      <span>
                        RepoPilot is thinking...
                      </span>
                    </div>
                  </div>
                )}

                {/* Chat request error */}
                {error && !isStreaming && (
                  <div className="flex justify-start">
                    <div
                      role="alert"
                      className="max-w-[90%] rounded-2xl rounded-bl-md border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                    >
                      Something went wrong while generating
                      the response. Please try again.
                    </div>
                  </div>
                )}

                {/* Jump-to-latest control */}
                {showJumpToLatest && (
                  <div className="sticky bottom-3 z-10 flex justify-center">
                    <Button
                      type="button"
                      onClick={jumpToLatest}
                    >
                      Jump to latest
                    </Button>
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-slate-200 pt-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label
                    htmlFor="message"
                    className="sr-only"
                  >
                    Ask RepoPilot a question
                  </label>

                  <input
                    id="message"
                    name="message"
                    type="text"
                    autoComplete="off"
                    disabled={isStreaming}
                    placeholder="Ask about this repository..."
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                  {isStreaming ? (
                    <Button
                      type="button"
                      onClick={() => stop()}
                    >
                      Stop
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!repository}
                    >
                      Send
                    </Button>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Responses are generated using the repository
                  context shown above.
                </p>
              </form>
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}