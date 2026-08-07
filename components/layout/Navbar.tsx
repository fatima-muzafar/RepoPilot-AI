import Link from "next/link";
import Container from "./Container";
import { navigationLinks } from "@/constants/navigation";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            RepoPilot AI
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/login"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}