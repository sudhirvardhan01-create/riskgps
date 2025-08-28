import { Box, Checkbox, Typography } from "@mui/material";

interface ProcessCardProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function ProcessCard({ label, checked, onChange }: ProcessCardProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      px={2}
      py={1.5}
      sx={{
        bgcolor: "#fff",
        borderRadius: "8px",
        borderLeft: "4px solid #04139A",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0px 4px 8px rgba(0,0,0,0.12)",
        },
      }}
      onClick={onChange}
    >
      <Checkbox
        checked={checked}
        onChange={onChange}
        sx={{
          color: "#04139A",
          "&.Mui-checked": {
            color: "#04139A", // ensures blue tick and box
          },
        }}
      />
      <Typography sx={{ fontWeight: 500, color: "#484848" }}>
        {label}
      </Typography>
    </Box>
  );
}
