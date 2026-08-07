import Container from "@/components/layout/Container";

export default function HomePage() {
  return (
    <Container>
      <section className="py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          RepoPilot AI
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          AI-powered GitHub repository explorer and assistant.
        </p>
      </section>
    </Container>
  );
}