"use client";

import { useEffect } from "react";
import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center py-12">
        <div className="w-full">
              <Card>
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-5"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                Something went wrong
              </p>

              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                RepoPilot could not load this page.
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                An unexpected error occurred. You can try loading
                the page again.
              </p>

              <Button
                type="button"
                onClick={reset}
                className="mt-5"
              >
                Try again
              </Button>
            </div>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}