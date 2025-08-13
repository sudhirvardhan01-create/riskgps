import React from "react";
import { Alert, Snackbar } from "@mui/material";

interface ToastComponentProps {
  open: boolean;
  message: string;
  onClose: () => void;
  toastBorder?: string;
  toastColor?: string;
  toastBackgroundColor?: string;
  toastSeverity: 'error' | 'warning' | 'info' | 'success'
}

const ToastComponent: React.FC<ToastComponentProps> = ({ open, message, onClose, toastBorder, toastColor, toastBackgroundColor, toastSeverity }) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{vertical: 'top', horizontal: 'center'}} onClose={onClose}>
    <Alert
      severity={toastSeverity}
      sx={{border: toastBorder, borderRadius: 2, color: toastColor, boxShadow: '0px 4px 16px 0px #E4E4E7', backgroundColor: toastBackgroundColor, fontWeight: 550}}
    >
      {message}
    </Alert>
    </Snackbar>
  );
};

export default ToastComponent;
