"use client";

import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import useTheme, { type Theme } from "@/hooks/useTheme";
import { firebaseApp } from "@/lib/firebase";

const themeOptions: {
  value: Theme;
  label: string;
  description: string;
}[] = [
  {
    value: "system",
    label: "System",
    description: "Use your device's theme preference.",
  },
  {
    value: "light",
    label: "Light",
    description: "Use the light theme.",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use the dark theme.",
  },
];

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      const auth = getAuth(firebaseApp);

      await signOut(auth);

      router.push("/login");
    } catch {
      setLogoutError(
        "Unable to log out. Please try again."
      );
      setIsLoggingOut(false);
    }
  };

  return (
    <Container>
      <section className="py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Settings
            </h1>

            <p className="mt-4 text-lg text-slate-600 dark:text-[#9BA8AB]">
              Customize your RepoPilot AI experience.
            </p>
          </div>

          <div className="mt-12 space-y-8">
            <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-[#4A5C6A] dark:bg-[#11212D]">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-[#CCD0CF]">
                  Appearance
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-[#9BA8AB]">
                  Choose how RepoPilot AI should look.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      theme === option.value
                        ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950"
                        : "border-slate-200 hover:bg-slate-50 dark:border-[#4A5C6A] dark:hover:bg-[#253745]"
                    }`}
                  >
                    <p className="font-medium text-slate-900 dark:text-[#CCD0CF]">
                      {option.label}
                    </p>

                    <p className="mt-1 text-sm text-slate-600 dark:text-[#9BA8AB]">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {!loading && user && (
              <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-[#4A5C6A] dark:bg-[#11212D]">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-[#CCD0CF]">
                    Account
                  </h2>

                  <p className="mt-2 text-sm text-slate-600 dark:text-[#9BA8AB]">
                    Manage your RepoPilot AI account.
                  </p>
                </div>

                {logoutError && (
                  <p className="mt-6 text-sm text-red-600 dark:text-red-300">
                    {logoutError}
                  </p>
                )}

                <Button
                  type="button"
                  className="mt-6"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </Button>
              </section>
            )}
          </div>
        </div>
      </section>
    </Container>
  );
}