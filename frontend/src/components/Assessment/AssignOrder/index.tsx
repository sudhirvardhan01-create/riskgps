import { useAssessment } from "@/context/AssessmentContext";
import { ProcessUnit } from "@/types/assessment";
import { Box, Grid, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface AssignOrderProps {
  processes: ProcessUnit[] | undefined;
}

export default function AssignOrder({ processes }: AssignOrderProps) {
  const { updateAssessment } = useAssessment();

  const [orderedProcesses, setOrderedProcesses] = useState<
    ProcessUnit[] | undefined
  >([]);

  // Initialize order when processes change
  useEffect(() => {
    const initialized = processes?.map((p, i) => ({
      ...p,
      order: p.order ?? i + 1, // keep existing order if present, otherwise assign sequential
    }));
    setOrderedProcesses(initialized);
  }, []);

  const handleOrderChange = (processId: string, value: number) => {
    setOrderedProcesses((prev) => {
      const updated = prev?.map((p) =>
        p.id === processId ? { ...p, order: value } : p
      );

      // Swap conflicts → ensure uniqueness
      const conflictIndex = updated?.findIndex(
        (p) => p.id !== processId && p.order === value
      );
      if (conflictIndex != undefined && conflictIndex >= 0) {
        const oldOrder = prev?.find((p) => p.id === processId)?.order;
        if (updated)
          updated[conflictIndex] = {
            ...updated[conflictIndex],
            order: oldOrder,
          };
      }
      updateAssessment({ processes: updated });

      return updated;
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {orderedProcesses
          ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) // always render sorted
          .map((process) => (
            <Grid size={12} key={process.id}>
              <Box display="flex" gap={2} alignItems="center">
                {/* Order Dropdown */}
                <Select
                  value={process.order ?? ""}
                  onChange={(e) =>
                    handleOrderChange(process.id, Number(e.target.value))
                  }
                  displayEmpty
                  size="small"
                  sx={{
                    minWidth: 100,
                    borderRadius: "8px",
                    bgcolor: "#fff",
                  }}
                >
                  {processes?.map((_, i) => (
                    <MenuItem key={i} value={i + 1}>
                      Order: {i + 1}
                    </MenuItem>
                  ))}
                </Select>

                {/* Process Card */}
                <Box
                  flex={1}
                  px={2}
                  py={1.5}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: "8px",
                    borderLeft: "4px solid #04139A",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
                    maxWidth: 680,
                    height: 48,
                  }}
                >
                  <Typography sx={{ fontWeight: 500, color: "#484848" }}>
                    {process.processName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
