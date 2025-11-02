"use client";

import React, { useState, useCallback, useEffect } from "react";
import ToastComponent from "@/components/ToastComponent";
import { setShowToast } from "@/utils/toastManager";

const GlobalToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const showToast = useCallback(
    (msg: string, sev: "success" | "error" | "info" | "warning" = "info") => {
      setMessage(msg);
      setSeverity(sev);
      setOpen(true);
    },
    []
  );

  const handleClose = () => setOpen(false);

  // Register this function globally
  useEffect(() => {
    setShowToast(showToast);
  }, [showToast]);

  return (
    <>
      {children}
      <ToastComponent
        open={open}
        message={message}
        toastSeverity={severity}
        onClose={handleClose}
      />
    </>
  );
};

export default GlobalToastProvider;
