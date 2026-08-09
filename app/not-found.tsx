import Link from "next/link";
import Container from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container>
      <section className="py-24 text-center">
        <h1 className="text-5xl font-bold">404</h1>

        <p className="mt-4 text-gray-600">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-lg border px-4 py-2"
        >
          Back to Home
        </Link>
      </section>
    </Container>
  );
}