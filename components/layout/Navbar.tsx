import Link from "next/link";
import Container from "./Container";

export default function Navbar() {
  return (
    <header className="border-b">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            RepoPilot AI
          </Link>

          <div className="text-sm text-gray-500">
            Navigation coming soon
          </div>
        </nav>
      </Container>
    </header>
  );
}