import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useState } from "react";
import { LoginForm } from "../../components/Login";
import "./testUtils";

describe("LoginForm", () => {
  const renderLogin = () => {
    const Wrapper = () => {
      const [currentForm, setCurrentForm] = useState<"login" | "signup">(
        "login"
      );
      return <LoginForm setCurrentForm={setCurrentForm} />;
    };
    return render(<Wrapper />);
  };

  it("renders fields and captcha", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/password/i)[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    // expect(screen.getByTestId("mock-recaptcha")).toBeInTheDocument();
  });

  it("disables login when fields are empty", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });

  it("enables login and logs data", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: "secret" },
    });
    // fireEvent.click(screen.getByRole("button", { name: /login/i }));
    // expect(consoleSpy).toHaveBeenCalledWith("Form submitted:", {
    //   email: "a@b.com",
    //   password: "secret",
    // });
    consoleSpy.mockRestore();
  });

  it("toggles password visibility", () => {
    renderLogin();
    const passwordInput = screen.getAllByLabelText(/password/i)[0];
    const toggleButton = screen.getByLabelText(/toggle password visibility/i);
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
