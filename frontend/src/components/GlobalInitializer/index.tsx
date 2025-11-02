"use client";

import React, { useEffect } from "react";
import { useLoader } from "@/context/LoaderContext";
import { registerLoader } from "@/utils/apiClient";

const GlobalInitializer = () => {
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    registerLoader(showLoader, hideLoader);
  }, [showLoader, hideLoader]);

  return null;
};

export default GlobalInitializer;
