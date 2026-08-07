import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t py-6">
      <Container>
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RepoPilot AI
        </p>
      </Container>
    </footer>
  );
}