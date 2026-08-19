"use client";

import Link from "next/link";
import { signOut, getAuth } from "firebase/auth";

import Container from "./Container";
import { navigationLinks } from "@/constants/navigation";
import { firebaseApp } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    const auth = getAuth(firebaseApp);

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
                className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
              >
                {link.label}
              </Link>
            ))}

            {!loading && user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}