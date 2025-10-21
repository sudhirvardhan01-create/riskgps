import React, { useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  Button,
  MenuItem,
  IconButton,
  Typography,
  DialogActions,
  Divider,
  FormControlLabel,
  Stack,
  Avatar,
} from "@mui/material";
import { AssetForm } from "@/types/asset";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";
import { tooltips } from "@/utils/tooltips";
import { labels } from "@/utils/labels";
import Image from "next/image";
import { CameraAlt } from "@mui/icons-material";

interface UserFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  assetFormData: AssetForm;
  processes: any[];
  metaDatas: any[];
  setAssetFormData: React.Dispatch<React.SetStateAction<AssetForm>>;
  onSubmit: (status: string) => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  operation,
  open,
  onClose,
  assetFormData,
  setAssetFormData,
  onSubmit,
}) => {
  const handleChange = useCallback(
    (field: keyof AssetForm, value: any) => {
      setAssetFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setAssetFormData] // only depends on setter from props
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { sx: { borderRadius: 2, padding: 5 } } }}
    >
      <DialogTitle
        sx={{
          paddingY: 0,
          paddingX: 0,
          marginBottom: 5,
        }}
      >
        <Box sx={{ position: "relative", mb: 4 }}>
          <Avatar
            sx={{
              width: 96,
              height: 96,
              backgroundColor: "#F2F0F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/default-user.png"
                alt="org-image"
                width={32}
                height={32}
              />
            </Box>
          </Avatar>
          <IconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#04139A",
              color: "#FFFFFF",
              width: 24,
              height: 24,
              "&:hover": {
                backgroundColor: "#04139A",
                opacity: 0.9,
              },
            }}
          >
            <CameraAlt sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: 0 }}>
        <Grid container spacing={4}>
          {/* Asset Category */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled /// this is select
              required
              isTooltipRequired={true}
              tooltipTitle={tooltips.assetCategory}
              value={assetFormData.assetCategory}
              label={labels.assetCategory}
              displayEmpty
              onChange={(e) =>
                handleChange("assetCategory", e.target.value as string)
              }
              renderValue={(selected: any) => {
                if (!selected) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                      }}
                    >
                      Select Asset Category
                    </Typography>
                  );
                } else {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                      }}
                    >
                      {selected}
                    </Typography>
                  );
                }
              }}
            >
              <MenuItem value={"A"}>A</MenuItem>
            </SelectStyled>
          </Grid>

          {/* Asset Description */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.assetDescription}
              isTooltipRequired={true}
              tooltipTitle={tooltips.assetDescription}
              placeholder="Enter Asset Description"
              value={assetFormData.assetDescription}
              multiline
              minRows={1}
              onChange={(e) => handleChange("assetDescription", e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Divider sx={{ width: "100%" }} />
      </Box>
      <DialogActions
        sx={{
          pt: 4,
          display: "flex",
          justifyContent: "space-between",
          pb: 0,
          px: 0,
        }}
      >
        <Button
          sx={{
            width: 113,
            height: 40,
            border: "1px solid #CD0303",
            borderRadius: 1,
          }}
          variant="outlined"
          onClick={onClose}
        >
          <Typography variant="body1" color="#CD0303" fontWeight={500}>
            Cancel
          </Typography>
        </Button>
        <Box display={"flex"} gap={3}>
          <Button
            onClick={() => {
              onSubmit("draft");
            }}
            sx={{ width: 161, height: 40, borderRadius: 1 }}
            variant="outlined"
          >
            <Typography variant="body1" color="#04139A" fontWeight={500}>
              Save as Draft
            </Typography>
          </Button>
          <Button
            sx={{ width: 132, height: 40, borderRadius: 1 }}
            variant="contained"
            onClick={() => {
              onSubmit("published");
            }}
            disabled={
              assetFormData.applicationName === "" ||
              assetFormData.assetCategory?.length === 0
            }
            disableRipple
          >
            <Typography variant="body1" color="#F4F4F4" fontWeight={600}>
              Publish
            </Typography>
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModalProps;
