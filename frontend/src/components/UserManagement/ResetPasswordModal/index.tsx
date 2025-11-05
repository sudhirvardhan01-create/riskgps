import React from "react";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import TextFieldStyled from "@/components/TextFieldStyled";
import { labels } from "@/utils/labels";
import { tooltips } from "@/utils/tooltips";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  formData: ResetPasswordForm;
  setFormData: React.Dispatch<React.SetStateAction<ResetPasswordForm>>;
  onSubmit: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
}) => {
  //Function to handle the Field change
  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            paddingTop: "16px",
            paddingLeft: "12px",
            paddingRight: "10px",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={550} color="#121212">
          Reset Password
        </Typography>
        <IconButton onClick={onClose} sx={{ padding: "0px !important" }}>
          <Close sx={{ color: "primary.main" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ marginTop: 2 }}>
        <Grid container spacing={4}>
          {/* Password */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.password}
              isTooltipRequired={true}
              tooltipTitle={tooltips.password}
              placeholder="Password"
              value={formData.password}
              required
              type="password"
              onChange={(e) => handleFieldChange("password", e.target.value)}
            />
          </Grid>

          {/* MITRE Control Name */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.confirmPassword}
              isTooltipRequired={true}
              tooltipTitle={tooltips.confirmPassword}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              required
              type="password"
              onChange={(e) =>
                handleFieldChange("confirmPassword", e.target.value)
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2.5, mx: 3 }}>
        <Divider sx={{ width: "100%" }} />
      </Box>
      <DialogActions
        sx={{
          px: 3,
          pt: 1.5,
          pb: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Box display={"flex"} gap={3}>
          <Button
            onClick={onClose}
            sx={{
              width: 113,
              height: 40,
              borderRadius: 1,
              border: "1px solid #04139A",
            }}
            variant="outlined"
          >
            <Typography variant="body1" color="primary.main">
              Cancel
            </Typography>
          </Button>
          <Button
            sx={{
              width: 110,
              height: 40,
              borderRadius: 1,
            }}
            variant="contained"
            onClick={onSubmit}
            disabled={
              formData.password === "" ||
              formData.confirmPassword === "" ||
              formData.password !== formData.confirmPassword
            }
            disableRipple
          >
            <Typography variant="body1" color="#F4F4F4" fontWeight={600}>
              Reset
            </Typography>
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordModal;
