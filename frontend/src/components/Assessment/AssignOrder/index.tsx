import { Box, Grid, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Risk {
  orgRiskId: string;
  name: string;
  description: string;
}

interface ProcessUnit {
  orgProcessId: string;
  name: string;
  risks: Risk[];
}

interface AssignOrderProps {
  processes: ProcessUnit[];
  onOrderChange?: (mapping: { [key: string]: number }) => void;
}

export default function AssignOrder({
  processes,
  onOrderChange,
}: AssignOrderProps) {
  const [orderMapping, setOrderMapping] = useState<{ [key: string]: number }>(
    {}
  );

  // Initialize mapping when processes change
  useEffect(() => {
    const initial = processes.reduce(
      (acc, process, i) => ({ ...acc, [process.orgProcessId]: i + 1 }),
      {}
    );
    setOrderMapping(initial);
  }, [processes]);

  const handleOrderChange = (processId: string, value: number) => {
    setOrderMapping((prev) => {
      const updated = { ...prev };

      // swap values if conflict
      const oldProcessId = Object.keys(updated).find(
        (key) => updated[key] === value
      );
      if (oldProcessId) {
        updated[oldProcessId] = updated[processId];
      }

      updated[processId] = value;

      if (onOrderChange) onOrderChange(updated);

      return updated;
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {processes.map((process) => (
          <Grid size={12} key={process.orgProcessId}>
            <Box display="flex" gap={2} alignItems="center">
              {/* Order Dropdown */}
              <Select
                value={orderMapping[process.orgProcessId] || ""}
                onChange={(e) =>
                  handleOrderChange(
                    process.orgProcessId,
                    Number(e.target.value)
                  )
                }
                displayEmpty
                size="small"
                sx={{
                  minWidth: 100,
                  borderRadius: "8px",
                  bgcolor: "#fff",
                }}
              >
                {processes.map((_, i) => (
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
                  {process.name}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
