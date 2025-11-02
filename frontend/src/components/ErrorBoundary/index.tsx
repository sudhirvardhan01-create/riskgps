"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { showToast } from "@/utils/toastManager";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("⚠️ ErrorBoundary caught an error:", error, info);
    // ✅ Use our new toast system (global, no hook needed)
    showToast("Something went wrong in the UI. Please try again.", "error");
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            p: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {this.state.error?.message || "An unexpected error occurred."}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleReload}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
