import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/layout/Container";

export default function HomePage() {
  return (
    <Container>
      <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          RepoPilot AI
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-[#9BA8AB]">
          AI-powered GitHub repository explorer and assistant.
        </p>

        <Link href="/search">
          <Button className="mt-8">
            Get Started
          </Button>
        </Link>
      </section>
    </Container>
  );
}