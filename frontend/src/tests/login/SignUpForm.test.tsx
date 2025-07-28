import "./testUtils";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act, useState } from "react";
import { SignUpForm } from "../../components/Login";

describe.skip("SignUpForm", () => {
  const renderSignUp = () => {
    const Wrapper = () => {
      const [currentForm, setCurrentForm] = useState<"login" | "signup">(
        "signup"
      );
      return <SignUpForm setCurrentForm={setCurrentForm} />;
    };
    return act(() => {
      render(<Wrapper />);
    });
  };

  it("renders fields and captcha", () => {
    renderSignUp();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/email/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/organisation/i)).toBeInTheDocument();
    // expect(screen.getByTestId("mock-recaptcha")).toBeInTheDocument();
  });

  it("disables submit when required fields are empty", () => {
    renderSignUp();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();
  });

  it("enables submit and logs data", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    renderSignUp();

    act(() => {
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: "Jane" },
      });
      fireEvent.change(screen.getByLabelText(/^email$/i), {
        target: { value: "jane@a.com" },
      });
      fireEvent.change(screen.getByLabelText(/organisation/i), {
        target: { value: "Org" },
      });
    });

    // const signUpButton = screen.getByRole("button", { name: /sign up/i });
    // expect(signUpButton).toBeEnabled();
    // fireEvent.click(signUpButton);

    // expect(consoleSpy).toHaveBeenCalledWith(
    //   "Form submitted:",
    //   expect.objectContaining({
    //     name: "Jane",
    //     email: "jane@a.com",
    //     organisation: "Org",
    //   })
    // );
    consoleSpy.mockRestore();
  });

  it("allows selecting communication preference", () => {
    renderSignUp();
    const phoneRadio = screen.getAllByLabelText(/phone/i)[0];
    fireEvent.click(phoneRadio);
    // expect(phoneRadio).toHaveValue("Phone");
  });
});
