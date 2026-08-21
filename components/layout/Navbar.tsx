"use client";

import Link from "next/link";
import { signOut, getAuth } from "firebase/auth";

import Container from "./Container";
import { navigationLinks } from "@/constants/navigation";
import { firebaseApp } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";

export default function Navbar() {
  const { user, loading } = useAuth();
  useTheme();

  const handleLogout = async () => {
    const auth = getAuth(firebaseApp);

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white dark:border-[#4A5C6A] dark:bg-[#11212D]">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            RepoPilot AI
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-[#9BA8AB] dark:hover:text-[#CCD0CF]"
              >
                {link.label}
              </Link>
            ))}

            {!loading && user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-[#4A5C6A] dark:hover:bg-[#253745]"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-[#4A5C6A] dark:hover:bg-[#253745]"
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