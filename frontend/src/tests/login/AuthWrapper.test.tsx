import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useState } from "react";
import { LoginForm, SignUpForm } from "../../components/Login";
import "./testUtils";

describe("Auth Wrapper: switching forms", () => {
  const renderAuth = () => {
    const Wrapper = () => {
      const [currentForm, setCurrentForm] = useState<"login" | "signup">(
        "login"
      );
      return currentForm === "login" ? (
        <LoginForm setCurrentForm={setCurrentForm} />
      ) : (
        <SignUpForm setCurrentForm={setCurrentForm} />
      );
    };
    return render(<Wrapper />);
  };

  it("switches from login to sign up and back", () => {
    renderAuth();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    fireEvent.click(screen.getByText(/sign up/i));
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(/log in/i));
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});
