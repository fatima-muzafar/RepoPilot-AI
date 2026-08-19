import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginForm from "@/app/login/LoginForm";

const mockPush = vi.fn();
const mockSignInWithEmailAndPassword = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: () => null,
  }),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({ mockAuth: true })),
  signInWithEmailAndPassword: (...args: unknown[]) =>
    mockSignInWithEmailAndPassword(...args),
}));

vi.mock("@/lib/firebase", () => ({
  firebaseApp: {},
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithEmailAndPassword.mockResolvedValue({});
  });

  it("renders accessible email and password fields", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("textbox", { name: "Email" }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Sign in" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(
      screen.getByRole("button", { name: "Sign in" }),
    );

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please enter your password."),
    ).toBeInTheDocument();

    expect(
      mockSignInWithEmailAndPassword,
    ).not.toHaveBeenCalled();
  });

  it("shows an error for an invalid email address", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "invalid-email",
    );

    await user.type(
      screen.getByLabelText("Password"),
      "password123",
    );

    await user.click(
      screen.getByRole("button", { name: "Sign in" }),
    );

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();

    expect(
      mockSignInWithEmailAndPassword,
    ).not.toHaveBeenCalled();
  });

  it("submits valid credentials through Firebase", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "test@example.com",
    );

    await user.type(
      screen.getByLabelText("Password"),
      "password123",
    );

    await user.click(
      screen.getByRole("button", { name: "Sign in" }),
    );

    expect(
      mockSignInWithEmailAndPassword,
    ).toHaveBeenCalledTimes(1);

    expect(
      mockSignInWithEmailAndPassword,
    ).toHaveBeenCalledWith(
      { mockAuth: true },
      "test@example.com",
      "password123",
    );

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("shows an error when Firebase rejects invalid credentials", async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({
      code: "auth/invalid-credential",
    });

    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "test@example.com",
    );

    await user.type(
      screen.getByLabelText("Password"),
      "wrong-password",
    );

    await user.click(
      screen.getByRole("button", { name: "Sign in" }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Invalid email or password.");

    expect(mockPush).not.toHaveBeenCalled();
  });
});