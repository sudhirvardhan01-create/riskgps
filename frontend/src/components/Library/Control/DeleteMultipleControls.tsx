"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  Checkbox,
  Grid,
} from "@mui/material";

interface MITREControlCardProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

interface DeleteMultipleControlsProps {
  open: boolean;
  onClose: () => void;
  mitreControlNames: string[];
  selectedControlsToDelete: string[];
  setSelectedControlsToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  onDelete: () => void;
}

function MITREControlCard({ label, checked, onChange }: MITREControlCardProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      px={2}
      py={1.5}
      sx={{
        bgcolor: "#fff",
        borderRadius: "8px",
        borderLeft: "4px solid #CD0303",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease",
        height: 48,
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
          color: "#CD0303",
          "&.Mui-checked": {
            color: "#CD0303", // ensures blue tick and box
          },
        }}
      />
      <Typography sx={{ fontWeight: 500, color: "#484848" }}>
        {label}
      </Typography>
    </Box>
  );
}

const DeleteMultipleControls: React.FC<DeleteMultipleControlsProps> = ({
  open,
  onClose,
  mitreControlNames,
  selectedControlsToDelete,
  setSelectedControlsToDelete,
  onDelete,
}) => {
  const isSelected = (controlName: string) => {
    return selectedControlsToDelete.some((c) => c === controlName);
  };

  const toggleSelection = (controlName: string) => {
    const updated = isSelected(controlName)
      ? selectedControlsToDelete.filter((c) => c !== controlName)
      : [...selectedControlsToDelete, controlName];

    setSelectedControlsToDelete(updated);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            m: 0,
          },
        },
      }}
    >
      <DialogTitle sx={{ p: 3 }}>
        <Typography variant="body1" fontWeight={600}>
          Delete MITRE Controls
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ pb: 1.5 }}>
          Select the MITRE Control Names to delete:
        </Typography>

        <Grid container spacing={2}>
          {mitreControlNames.map((item) => (
            <Grid size={{ xs: 12 }} key={item}>
              <MITREControlCard
                label={item}
                checked={isSelected(item)}
                onChange={() => toggleSelection(item)}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 1 }}>
          Cancel
        </Button>
        <Button
            onClick={onDelete}
            disabled={!selectedControlsToDelete}
          variant="contained"
          sx={{ borderRadius: 1, backgroundColor: "#CD0303" }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMultipleControls;
