"use client";

import Container from "@/components/layout/Container";
import useAuth from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container>
        <section className="py-16">
          <p className="text-slate-600 dark:text-[#9BA8AB]">Loading profile...</p>
        </section>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Profile
          </h1>

          <p className="mt-4 max-w-lg text-lg text-slate-600 dark:text-[#9BA8AB]">
            Please log in to view your account information.
          </p>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className="py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Profile
            </h1>

            <p className="mt-4 text-lg text-slate-600 dark:text-[#9BA8AB]">
              Manage your RepoPilot AI account information.
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-[#4A5C6A] dark:bg-[#11212D]">
            <h2 className="text-xl font-semibold">
              Account Information
            </h2>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-[#9BA8AB]">
                  Display Name
                </p>

                <p className="mt-2 text-base text-slate-900 dark:text-[#CCD0CF]">
                  {user.displayName || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-[#9BA8AB]">
                  Email
                </p>

                <p className="mt-2 text-base text-slate-900 dark:text-[#CCD0CF]">
                  {user.email || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-[#9BA8AB]">
                  Account ID
                </p>

                <p className="mt-2 break-all font-mono text-sm text-slate-600 dark:text-[#9BA8AB]">
                  {user.uid}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}