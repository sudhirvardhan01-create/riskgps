import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../../pages/login";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import { ReactNode } from "react";

// Mock next/link to render children directly
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => children,
}));

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it("renders login form fields", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows and hides password when toggle is clicked", () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole("button", { name: "" }); // IconButton has no accessible name

    // Initially password type
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("updates form fields on user input", () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("secret");
  });

  it("calls handleSubmit on form submit", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "user@domain.com" } });
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    fireEvent.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith("Form submitted:", {
      email: "user@domain.com",
      password: "mypassword",
    });

    consoleSpy.mockRestore();
  });

  it("renders forgot password and sign up links", () => {
    render(<LoginPage />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
});
