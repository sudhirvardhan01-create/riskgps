"use client";

import React, { useMemo, useState } from "react";
import { Paper, Typography, TextField, Box } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import DraggableAssetItem from "../DraggableAssetItem";
import { Asset } from "@/types/assessment";

interface AssetPoolProps {
  assetPool: Asset[];
}

const AssetPool: React.FC<AssetPoolProps> = ({ assetPool }) => {
  const { setNodeRef } = useDroppable({ id: "asset-pool" });
  const [search, setSearch] = useState("");

  // Filter riskScenarios by title
  const filteredAssets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assetPool;
    return assetPool.filter((r) => r.applicationName.toLowerCase().includes(q));
  }, [assetPool, search]);

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
          Assets
        </Typography>
        <Typography variant="caption" color="text.primary">
          Drag and drop assets into relevant processes
        </Typography>
      </Box>
      <Box sx={{ backgroundColor: "#F0F0F0", mx: -2 }}>
        <TextField
          placeholder="Search assets"
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
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <DraggableAssetItem key={asset.id} asset={asset} />
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
            No assets found
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default AssetPool;
