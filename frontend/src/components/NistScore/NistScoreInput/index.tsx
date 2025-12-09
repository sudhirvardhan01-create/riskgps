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

export interface NistControlCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface NistControlScore {
  categoryId: string;
  currentScore: number;
  targetScore: number;
}

interface Props {
  categories: NistControlCategory[];
  values?: NistControlScore[];
  onSave: (scores: NistControlScore[]) => void;
}

const scoreOptions = Array.from({ length: 11 }, (_, i) => i);

const getCardColors = (current: number, target: number) => {
  if (current === -1 && target === -1) {
    return { bg: "#F5F5F5", border: "#E0E0E0" };
  }
  const gap = target - current;
  if (gap <= 1) return { bg: "#E6F4EA", border: "#2E7D32" };
  if (gap <= 3) return { bg: "#FFF8E1", border: "#F9A825" };
  return { bg: "#FFEBEE", border: "#C62828" };
};

const NistControlScoreCardList: React.FC<Props> = ({
  categories,
  values,
  onSave,
}) => {
  const [scores, setScores] = useState<NistControlScore[]>([]);
  const [initialScores, setInitialScores] = useState<NistControlScore[]>([]);

  useEffect(() => {
    const base =
      values && values.length
        ? values
        : categories.map((c) => ({
            categoryId: c.id,
            currentScore: -1,
            targetScore: -1,
          }));
    setScores(base);
    setInitialScores(base);
  }, [categories, values]);

  const updateScore = (
    categoryId: string,
    key: "currentScore" | "targetScore",
    value: number
  ) => {
    setScores((prev) =>
      prev.map((s) =>
        s.categoryId === categoryId ? { ...s, [key]: value } : s
      )
    );
  };

  const isDirty = useMemo(() => {
    if (scores.length !== initialScores.length) return true;
    const mapInitial = new Map(
      initialScores.map((s) => [s.categoryId, s] as const)
    );
    return scores.some((s) => {
      const base = mapInitial.get(s.categoryId);
      if (!base) return true;
      return (
        base.currentScore !== s.currentScore ||
        base.targetScore !== s.targetScore
      );
    });
  }, [scores, initialScores]);

  const handleSave = () => {
    if (!isDirty) return;
    onSave(scores);
    setInitialScores(scores);
  };

  return (
    <Box sx={{ width: "100%", p: 3, mb: 5, maxHeight: 420}}>
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

      {categories.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No NIST control categories configured.
        </Typography>
      ) : (
          <Box sx={{ maxHeight: 600, overflowY: "auto", mt: 2, pr: 1 }}>

        <Grid container spacing={3} sx={{ width: "100%", mt: 1 }}>
          {categories.map((cat) => {
            const row =
              scores.find((s) => s.categoryId === cat.id) ?? {
                categoryId: cat.id,
                currentScore: -1,
                targetScore: -1,
              };

            const { bg, border } = getCardColors(
              row.currentScore,
              row.targetScore
            );

            return (
              <Grid size={{ xs: 12 }} key={cat.id}>
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
                          {cat.code} – {cat.name}
                        </Typography>
                        {cat.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {cat.description}
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
                            value={row.currentScore}
                            onChange={(e) =>
                              updateScore(
                                cat.id,
                                "currentScore",
                                Number(e.target.value)
                              )
                            }
                          >
                            <MenuItem value={-1}>Not scored</MenuItem>
                            {scoreOptions.map((v) => (
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
                            value={row.targetScore}
                            onChange={(e) =>
                              updateScore(
                                cat.id,
                                "targetScore",
                                Number(e.target.value)
                              )
                            }
                          >
                            <MenuItem value={-1}>Not set</MenuItem>
                            {scoreOptions.map((v) => (
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
