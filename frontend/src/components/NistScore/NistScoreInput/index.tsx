// components/Assessment/NistControlScoreCardList.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { OrganizationFrameworkControl } from "@/types/reports";

interface Props {
  controls: OrganizationFrameworkControl[];
  onSave: (updatedControls: OrganizationFrameworkControl[]) => void;
}

const scoreOptions = Array.from({ length: 5 }, (_, i) => i + 1);

const getCardColors = (current: number | null, target: number | null) => {
  if (current == null && target == null) {
    return { bg: "#F5F5F5", border: "#E0E0E0" };
  }
  const safeCurrent = current ?? 0;
  const safeTarget = target ?? 0;
  const gap = safeTarget - safeCurrent;
  if (gap <= 1) return { bg: "#E6F4EA", border: "#2E7D32" };
  if (gap <= 3) return { bg: "#FFF8E1", border: "#F9A825" };
  return { bg: "#FFEBEE", border: "#C62828" };
};

const NistControlScoreCardList: React.FC<Props> = ({ controls, onSave }) => {
  const [items, setItems] = useState<OrganizationFrameworkControl[]>([]);
  const [initialItems, setInitialItems] = useState<OrganizationFrameworkControl[]>([]);

  useEffect(() => {
    setItems(controls);
    setInitialItems(controls);
  }, [controls]);

  const updateScore = (
    orgControlId: string,
    key: "currentScore" | "targetScore",
    value: number | null
  ) => {
    setItems(prev =>
      prev.map(c =>
        c.orgControlId === orgControlId ? { ...c, [key]: value } : c
      )
    );
  };

  const isDirty = useMemo(() => {
    if (items.length !== initialItems.length) return true;
    const mapInitial = new Map(
      initialItems.map(c => [c.orgControlId, c] as const)
    );
    return items.some(c => {
      const base = mapInitial.get(c.orgControlId);
      if (!base) return true;
      return base.currentScore !== c.currentScore || base.targetScore !== c.targetScore;
    });
  }, [items, initialItems]);

  const handleSave = () => {
    if (!isDirty) return;
    onSave(items);
    setInitialItems(items);
  };

  return (
    <Box sx={{ width: "100%", p: 3, mb: 5, maxHeight: 420 }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          pb: 2,
          background:
            "linear-gradient(to bottom, #ffffff 80%, rgba(255,255,255,0))",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              NIST Control Category Scores
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Set current and target scores (0–10) for each category.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            disabled={!isDirty}
            onClick={handleSave}
          >
            Save
          </Button>
        </Stack>
        <Divider />
      </Box>

      {items.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No NIST control categories configured.
        </Typography>
      ) : (
        <Box sx={{ maxHeight: 600, overflowY: "auto", mt: 2, pr: 1 }}>
          <Grid container spacing={3} sx={{ width: "100%", mt: 1 }}>
            {items.map(control => {
              const { bg, border } = getCardColors(
                control.currentScore,
                control.targetScore
              );

              const code = control.frameWorkControlCategoryId;
              const name = control.frameWorkControlCategory ?? "";
              const description = control.frameWorkControlDescription ?? "";

              return (
                <Grid size={{ xs: 12 }} key={control.orgControlId}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: `2px solid ${border}`,
                      backgroundColor: bg,
                      transition: "all 0.3s ease",
                    }}
                    elevation={0}
                  >
                    <CardContent>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                      >
                        {/* Category label + description */}
                        <Grid size={{ xs: 12, md: 5 }}>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {code} – {name}
                          </Typography>
                          {description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {description}
                            </Typography>
                          )}
                        </Grid>

                        {/* Current score */}
                        <Grid size={{ xs: 12, md: 3 }}>
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{ mt: { xs: 1, md: 0 } }}
                          >
                            <InputLabel>Current score</InputLabel>
                            <Select
                              label="Current score"
                              value={
                                control.currentScore == null
                                  ? -1
                                  : control.currentScore
                              }
                              onChange={e =>
                                updateScore(
                                  control.orgControlId,
                                  "currentScore",
                                  Number(e.target.value) === -1
                                    ? null
                                    : Number(e.target.value)
                                )
                              }
                            >
                              <MenuItem value={-1}>Not Scored</MenuItem>
                              {scoreOptions.map(v => (
                                <MenuItem key={v} value={v}>
                                  {v}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Target score */}
                        <Grid size={{ xs: 12, md: 3 }}>
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{ mt: { xs: 1, md: 0 } }}
                          >
                            <InputLabel>Target score</InputLabel>
                            <Select
                              label="Target score"
                              value={
                                control.targetScore == null
                                  ? -1
                                  : control.targetScore
                              }
                              onChange={e =>
                                updateScore(
                                  control.orgControlId,
                                  "targetScore",
                                  Number(e.target.value) === -1
                                    ? null
                                    : Number(e.target.value)
                                )
                              }
                            >
                              <MenuItem value={-1}>Not Scored</MenuItem>
                              {scoreOptions.map(v => (
                                <MenuItem key={v} value={v}>
                                  {v}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default NistControlScoreCardList;
