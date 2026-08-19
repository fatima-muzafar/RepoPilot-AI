"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";

import Container from "@/components/layout/Container";
import { firebaseApp } from "@/lib/firebase";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters."),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [firebaseError, setFirebaseError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setFirebaseError("");

    try {
      const auth = getAuth(firebaseApp);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      router.push("/login");
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error
      ) {
        const code = String(error.code);

        switch (code) {
          case "auth/email-already-in-use":
            setFirebaseError(
              "An account with this email already exists."
            );
            break;

          case "auth/invalid-email":
            setFirebaseError(
              "Please enter a valid email address."
            );
            break;

          case "auth/weak-password":
            setFirebaseError(
              "Password is too weak. Please choose a stronger password."
            );
            break;

          case "auth/operation-not-allowed":
            setFirebaseError(
              "Email/password registration is not enabled."
            );
            break;

          default:
            setFirebaseError(
              "Unable to create your account. Please try again."
            );
        }
      } else {
        setFirebaseError(
          "Unable to create your account. Please try again."
        );
      }
    }
  };

  return (
    <Container>
      <section className="flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-[#4A5C6A] dark:bg-[#11212D]">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Create your account
              </h1>

              <p className="mt-3 text-sm text-gray-600 dark:text-[#9BA8AB]">
                Create your RepoPilot AI account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
              noValidate
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-[#CCD0CF]"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={
                    errors.name ? "name-error" : undefined
                  }
                  {...register("name")}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 dark:border-[#4A5C6A] dark:bg-[#253745] dark:text-[#CCD0CF] dark:focus:border-[#CCD0CF] dark:focus:ring-[#4A5C6A]"
                />

                {errors.name && (
                  <p
                    id="name-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-[#CCD0CF]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={
                    errors.email ? "email-error" : undefined
                  }
                  {...register("email")}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 dark:border-[#4A5C6A] dark:bg-[#253745] dark:text-[#CCD0CF] dark:focus:border-[#CCD0CF] dark:focus:ring-[#4A5C6A]"
                />

                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-[#CCD0CF]"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  {...register("password")}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 dark:border-[#4A5C6A] dark:bg-[#253745] dark:text-[#CCD0CF] dark:focus:border-[#CCD0CF] dark:focus:ring-[#4A5C6A]"
                />

                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-[#CCD0CF]"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={
                    errors.confirmPassword ? "true" : "false"
                  }
                  aria-describedby={
                    errors.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                  {...register("confirmPassword")}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 dark:border-[#4A5C6A] dark:bg-[#253745] dark:text-[#CCD0CF] dark:focus:border-[#CCD0CF] dark:focus:ring-[#4A5C6A]"
                />

                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {firebaseError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                >
                  {firebaseError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#253745] dark:hover:bg-[#4A5C6A]"
              >
                {isSubmitting
                  ? "Creating account..."
                  : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-[#9BA8AB]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600 dark:text-[#CCD0CF] dark:hover:text-[#9BA8AB]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Container>
  );
}