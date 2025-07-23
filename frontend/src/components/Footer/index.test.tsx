import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from ".";
import "@testing-library/jest-dom";

describe("Footer", () => {
  it("renders the copyright text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/@copyright 2025 RiskGPS. All rights reserved./i)
    ).toBeInTheDocument();
  });

  it("has correct styles applied", () => {
    render(<Footer />);
    const footerBox = screen.getByText(/RiskGPS/).parentElement;
    expect(footerBox).toHaveStyle({
      textAlign: "center",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      color: "#000000",
      position: "absolute",
      bottom: "0",
      width: "100%",
    });
  });
});
