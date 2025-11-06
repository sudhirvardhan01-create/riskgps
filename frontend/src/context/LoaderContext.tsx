"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Backdrop, Box, Typography } from "@mui/material";

interface LoaderContextType {
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType>({
  showLoader: () => {},
  hideLoader: () => {},
});

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [pings, setPings] = useState<{ x: number; y: number; id: number }[]>(
    []
  );

  const showLoader = () => setLoadingCount((c) => c + 1);
  const hideLoader = () => setLoadingCount((c) => Math.max(c - 1, 0));

  // Random ping generator
  useEffect(() => {
    if (loadingCount === 0) return;
    const interval = setInterval(() => {
      setPings((prev) => {
        const id = Date.now();
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const newPing = { x, y, id };
        return [...prev.filter((p) => Date.now() - p.id < 2000), newPing];
      });
    }, 500);
    return () => clearInterval(interval);
  }, [loadingCount]);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}

      <Backdrop
        open={loadingCount > 0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 9999,
          color: "#fff",
          backgroundColor: "#00000066",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 250,
            height: 250,
            borderRadius: "50%",
            overflow: "hidden",
            background:
              "radial-gradient(circle at center, rgba(4, 19, 154, 0.15) 0%, rgba(255,255,255,0.9) 80%)",
            boxShadow: "0 0 40px 5px rgba(4, 19, 154,0.2)",
          }}
        >
          {/* Grid Lines */}
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                inset: 0,
                border: `1px solid rgba(4, 19, 154,${0.1 + i * 0.05})`,
                borderRadius: "50%",
                transform: `scale(${(i + 1) / 6})`,
              }}
            />
          ))}

          {/* Cross Lines */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: "1px",
              backgroundColor: "rgba(4, 19, 154,0.15)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: 0,
              width: "1px",
              height: "100%",
              backgroundColor: "rgba(0,255,170,0.15)",
            }}
          />

          {/* Rotating Radar Beam */}
          <Box
            sx={{
              position: "absolute",
              width: "50%",
              height: "2px",
              top: "50%",
              left: "50%",
              transformOrigin: "left center",
              background:
                "linear-gradient(90deg, rgba(0,255,170,0.7) 0%, rgba(0,255,170,0) 100%)",
              animation: "radarRotate 2.5s linear infinite",
            }}
          />

          {/* Center Glow */}
          <Box
            sx={{
              position: "absolute",
              width: 12,
              height: 12,
              top: "50%",
              left: "50%",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(0,255,170,0.8)",
              boxShadow: "0 0 20px 6px rgba(0,255,170,0.6)",
            }}
          />

          {/* Random Glowing Pings */}
          {pings.map((ping) => (
            <Box
              key={ping.id}
              sx={{
                position: "absolute",
                top: `${ping.y}%`,
                left: `${ping.x}%`,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "rgba(0,255,170,0.8)",
                boxShadow: "0 0 15px 3px rgba(0,255,170,0.8)",
                animation: "pingFade 2s ease-out forwards",
              }}
            />
          ))}
        </Box>

        <style>{`
          @keyframes radarRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pingFade {
            0% { opacity: 1; transform: scale(0.5); }
            100% { opacity: 0; transform: scale(1.6); }
          }

          @keyframes fadeText {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        `}</style>
      </Backdrop>
    </LoaderContext.Provider>
  );
};
