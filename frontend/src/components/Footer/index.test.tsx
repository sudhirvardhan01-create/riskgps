import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./index";
import "@testing-library/jest-dom";

describe("Footer", () => {
  it("renders the copyright text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/©2025 BluOcean Cyber. All rights reserved./i)
    ).toBeInTheDocument();
  });

  it("has correct styles applied", () => {
    render(<Footer />);
    const footerBox = screen.getByText(/BluOcean/).parentElement;
    expect(footerBox).toHaveStyle({
      display: "flex",
      flexDirection: "row",
      justifyContent: "right",
      padding: "20px 15px",
      backgroundColor: "#f5f5f5",
      color: "#000000",
      position: "absolute",
      bottom: "0",
      width: "90vw",
    });
  });
});
