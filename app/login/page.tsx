import { Suspense } from "react";

import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm text-gray-600 dark:text-[#9BA8AB]">
            Loading login...
          </p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}