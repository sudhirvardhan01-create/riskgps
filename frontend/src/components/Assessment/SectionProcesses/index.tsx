import { Grid, Box, TextField, IconButton } from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useState } from "react";
import ProcessCard from "./ProcessCard";
import { ProcessUnit } from "@/types/assessment";

interface SectionProcessesProps {
  processes: ProcessUnit[];
  selected: ProcessUnit[]; // ✅ store full objects
  onSelectionChange: (selected: ProcessUnit[]) => void;
}

export default function SectionProcesses({
  processes,
  selected,
  onSelectionChange,
}: SectionProcessesProps) {
  const [search, setSearch] = useState("");

  const isSelected = (process: ProcessUnit) =>
    selected.some((p) => p.orgProcessId === process.orgProcessId);

  const toggleSelection = (process: ProcessUnit) => {
    const updated = isSelected(process)
      ? selected.filter((p) => p.orgProcessId !== process.orgProcessId)
      : [...selected, process];

    onSelectionChange(updated);
  };

  const filteredProcesses = processes.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* 🔎 Search + Filter row */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by process name, keywords"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            bgcolor: "#fff",
            borderRadius: "8px",
            width: "480px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
        <IconButton
          sx={{
            border: "1px solid #D3D3D3",
            borderRadius: "8px",
            bgcolor: "#fff",
          }}
        >
          <FilterAltOutlinedIcon sx={{ color: "#484848" }} />
        </IconButton>
      </Box>

      {/* ✅ Process grid */}
      <Grid container spacing={2}>
        {filteredProcesses.map((process) => (
          <Grid size={{ xs: 12, md: 6 }} key={process.orgProcessId}>
            <ProcessCard
              label={process.name}
              checked={isSelected(process)}
              onChange={() => toggleSelection(process)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
