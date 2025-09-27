"use client";

import React, { useMemo, useState } from "react";
import { Paper, Typography, TextField, Box } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import DraggableRiskItem from "../DraggableRiskItem";
import { Risk } from "@/types/assessment";

interface RiskScenarioPoolProps {
  riskPool: Risk[];
}

const RiskScenarioPool: React.FC<RiskScenarioPoolProps> = ({ riskPool }) => {
  const { setNodeRef } = useDroppable({ id: "risk-pool" });
  const [search, setSearch] = useState("");

  // Filter risks by title
  const filteredRisks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return riskPool;
    return riskPool.filter((r) => r.name.toLowerCase().includes(q));
  }, [riskPool, search]);

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ fontWeight: 600, mb: 0.5 }}
        >
          Risk Scenarios
        </Typography>
        <Typography variant="caption" color="text.primary">
          Drag and drop risk scenarios into relevant processes
        </Typography>
      </Box>
      <Box sx={{ backgroundColor: "#F0F0F0", mx: -2 }}>
        <TextField
          placeholder="Search risk scenarios"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            p: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              height: "32px",
              backgroundColor: "#ffffff",
            },
          }}
        />
      </Box>

      <Box
        ref={setNodeRef}
        sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}
      >
        {filteredRisks.length > 0 ? (
          filteredRisks.map((risk) => (
            <DraggableRiskItem key={risk.orgRiskId} risk={risk} />
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: "#9CA3AF",
              textAlign: "center",
              mt: 2,
              fontSize: "13px",
            }}
          >
            No risk scenarios found
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default RiskScenarioPool;
