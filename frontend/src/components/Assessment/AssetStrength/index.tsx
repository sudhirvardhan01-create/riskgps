"use client";

import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  TextField,
} from "@mui/material";
import { Asset, Questionnaire } from "@/types/assessment";
import { CheckCircle, WatchLater } from "@mui/icons-material";

interface AssetListProps {
  assets: Asset[] | undefined;
  onSelect: (asset: Asset) => void;
  selectedAsset: Asset | undefined;
  questionnaires: Questionnaire[];
}

export default function AssetStrength({
  assets,
  onSelect,
  selectedAsset,
  questionnaires,
}: AssetListProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const filtered = assets?.filter((s) =>
    s.applicationName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isQuestionnaireComplete = (a: Asset) => {
    const filterQuestions = questionnaires.filter(
      (q) =>
        selectedAsset?.assetCategory &&
        q.assetCategories.includes(selectedAsset?.assetCategory)
    );
    return a.questionnaire?.length === filterQuestions?.length;
  };

  return (
    <Box
      sx={{
        width: "30%",
        border: "1px solid #eee",
        borderTop: "0px",
      }}
    >
      <Typography variant="body1" fontWeight={550} sx={{ m: 2 }}>
        Assets ({filtered?.length}/{assets?.length})
      </Typography>

      <Box
        sx={{
          backgroundColor: "#F0F0F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
        <Typography variant="caption" color="text.primary" textAlign={"center"}>
          Business Impact
        </Typography>
      </Box>

      <List>
        {filtered?.map((s, idx) => {
          const isExpanded = expanded[idx];
          const displayText =
            s.applicationName.length > 90 && !isExpanded
              ? s.applicationName.slice(0, 90) + "..."
              : s.applicationName;

          const isSelected = selectedAsset?.id === s.id;
          const isComplete = isQuestionnaireComplete(s);

          return (
            <ListItemButton
              key={idx}
              onClick={() => onSelect(s)}
              selected={isSelected}
              sx={{
                borderLeft: isSelected
                  ? "3px solid #1363DF"
                  : "3px solid transparent",
                borderTop: isSelected
                  ? "1px solid transparent"
                  : "1px solid #E7E7E8",
                bgcolor: isSelected ? "#F0F2FB !important" : "transparent",
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{ color: isSelected ? "text.primary" : "#91939A" }}
                  >
                    {displayText}{" "}
                    {s.applicationName.length > 90 && (
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: "primary.main",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(idx);
                        }}
                      >
                        {isExpanded ? "read less" : "read more"}
                      </Typography>
                    )}
                  </Typography>
                }
              />
              {isComplete ? (
                <CheckCircle fontSize="small" color="success" sx={{ ml: 1 }} />
              ) : (
                <WatchLater fontSize="small" sx={{ ml: 1, color: "#91939A" }} />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
