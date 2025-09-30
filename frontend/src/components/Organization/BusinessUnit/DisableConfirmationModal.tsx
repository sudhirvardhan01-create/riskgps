import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface DisableConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  businessUnitName: string;
}

const DisableConfirmationModal: React.FC<DisableConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  businessUnitName,
}) => {
  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfirm();
    onClose();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={false}
      sx={{
        zIndex: 1400, // Higher than default dialog z-index
        '& .MuiDialog-paper': {
          borderRadius: '8px',
          padding: '32px',
          maxWidth: '511px',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          mb: 2,
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            color: '#484848',
          }}
        >
          Disable Business Unit?
        </Typography>
      </DialogTitle>

      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          color: '#04139A',
          '&:hover': {
            backgroundColor: 'rgba(156, 39, 176, 0.04)',
          },
        }}
      >
        <CloseIcon sx={{ fontSize: '24px' }} />
      </IconButton>

      <DialogContent sx={{ p: 0, mb: 3, textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#666666',
          }}
        >
          Are you sure you want to disable {businessUnitName}?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 0, gap: 2, justifyContent: 'center' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            height: "40px",
            width: "168px",
            borderColor: '#04139A',
            color: '#04139A',
            textTransform: 'none',
            p: "12px, 40px",
            '&:hover': {
              borderColor: '#04139A',
              backgroundColor: 'rgba(156, 39, 176, 0.04)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            height: "40px",
            width: "168px",
            backgroundColor: '#B20606',
            color: '#FFFFFF',
            textTransform: 'none',
            p: "12px, 40px",
            '&:hover': {
              backgroundColor: '#B20606',
            },
          }}
        >
          Yes, Disable
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisableConfirmationModal;
