import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Alert, Snackbar } from "@mui/material";

interface SuccessToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ open, message, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'center'}} onClose={onClose}>
    <Alert
      iconMapping={{
      success: <CheckCircleOutlineIcon fontSize="inherit"/>,
      }}
      sx={{border: '1px solid #147A50', borderRadius: 2, color: '#147A50', boxShadow: '0px 4px 16px 0px #E4E4E7', backgroundColor: '#DDF5EB', fontWeight: 550}}
    >
      {message}
    </Alert>
    </Snackbar>
  );
};

export default SuccessToast;
