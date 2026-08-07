import Container from "@/components/layout/Container";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <Container>
      <section className="py-24 text-center">
        <h1 className="text-4xl font-bold">{title}</h1>

        <p className="mt-4 text-gray-600">
          {description}
        </p>

        <p className="mt-8 text-sm text-gray-400">
          This page will be implemented in a future milestone.
        </p>
      </section>
    </Container>
  );
}