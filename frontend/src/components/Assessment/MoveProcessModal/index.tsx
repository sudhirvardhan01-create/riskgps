"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  Divider,
} from "@mui/material";

interface MoveProcessModalProps {
  open: boolean;
  onClose: () => void;
  processes: { id: string; name: string }[];
  fromProcessId: string | null;
  fromProcessName: string | null;
  onMove: (fromProcessId: string | null, toProcessId: string) => void;
}

const MoveProcessModal: React.FC<MoveProcessModalProps> = ({
  open,
  onClose,
  processes,
  fromProcessId,
  fromProcessName,
  onMove,
}) => {
  const [selected, setSelected] = React.useState<string>("");

  const handleConfirm = () => {
    if (selected) {
      onMove(fromProcessId, selected);
      setSelected("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            m: 0
          }
        }
      }}
    >
      <DialogTitle sx={{ p: 3 }}>
        <Typography variant="body1" fontWeight={600}>
          Move Risk Scenario
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>

        <Typography variant="body2" sx={{ pb: 3 }}>
          Current Location: <strong>{fromProcessName}</strong>
        </Typography>

        <Typography variant="body2" sx={{ pb: 1.5 }}>
          Move to:
        </Typography>

        <RadioGroup
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {processes
            .filter((p) => p.id !== fromProcessId)
            .map((process) => (
              <FormControlLabel
                key={process.id}
                value={process.id}
                control={
                  <Radio
                    size="medium"
                    sx={{
                      color: "primary",
                      "&.Mui-checked": {
                        color: "primary",
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.primary" fontWeight={600}>
                    {process.name}
                  </Typography>
                }
                sx={{
                  mb: 1,
                  border: "1px solid #E5E7EB",
                  borderLeft: "4px solid #04139A",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
                  borderRadius: "8px",
                  px: 1.5,
                  py: 1,
                  mx: 0,
                  "&:hover": { borderColor: "primary" },
                }}
              />
            ))}
        </RadioGroup>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ borderRadius: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selected}
          variant="contained"
          sx={{ borderRadius: 1 }}
        >
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoveProcessModal;
