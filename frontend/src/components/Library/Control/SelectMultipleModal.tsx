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

interface ItemCardProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  checkBoxColor: string;
}

interface SelectMultipleModalProps {
  open: boolean;
  onClose: () => void;
  items: string[];
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  onAction: () => void;
  checkBoxColor: string;
  title: string;
  desc: string;
  action: string;
}

function ItemCard({ label, checked, onChange, checkBoxColor = '#CD0303' }: ItemCardProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      px={2}
      py={1.5}
      sx={{
        bgcolor: "#fff",
        borderRadius: "8px",
        borderLeft: `4px solid ${checkBoxColor}`,
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
          color: `${checkBoxColor}`,
          "&.Mui-checked": {
            color: `${checkBoxColor}`, // ensures blue tick and box
          },
        }}
      />
      <Typography sx={{ fontWeight: 500, color: "#484848" }}>
        {label}
      </Typography>
    </Box>
  );
}

const SelectMultipleModal: React.FC<SelectMultipleModalProps> = ({
  open,
  onClose,
  items,
  selectedItems,
  setSelectedItems,
  onAction,
  checkBoxColor,
  title,
  desc,
  action
}) => {
  const isSelected = (name: string) => {
    return selectedItems.some((c) => c === name);
  };

  const toggleSelection = (name: string) => {
    const updated = isSelected(name)
      ? selectedItems.filter((c) => c !== name)
      : [...selectedItems, name];

    setSelectedItems(updated);
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
          {title}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ pb: 1.5 }}>
          {desc}
        </Typography>

        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid size={{ xs: 12 }} key={item}>
              <ItemCard
                label={item}
                checked={isSelected(item)}
                onChange={() => toggleSelection(item)}
                checkBoxColor={checkBoxColor}
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
            onClick={onAction}
            disabled={!selectedItems}
          variant="contained"
          sx={{ borderRadius: 1, backgroundColor: checkBoxColor }}
        >
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectMultipleModal;
