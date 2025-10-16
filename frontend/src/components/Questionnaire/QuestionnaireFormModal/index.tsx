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
  Chip,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { Close, DoneOutlined } from "@mui/icons-material";
import { AssetForm } from "@/types/asset";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";
import { tooltips } from "@/utils/tooltips";
import { labels } from "@/utils/labels";

interface QuestionnaireFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  assetFormData: AssetForm;
  processes: any[];
  metaDatas: any[];
  setAssetFormData: React.Dispatch<React.SetStateAction<AssetForm>>;
  onSubmit: (status: string) => void;
}

const QuestionnaireFormModal: React.FC<QuestionnaireFormModalProps> = ({
  operation,
  open,
  onClose,
  assetFormData,
  setAssetFormData,
  metaDatas,
  onSubmit,
}) => {
  const assetCategoryItems = [
    "Windows",
    "macOS",
    "Linux",
    "Office 365",
    "Azure AD",
    "Google Workspace",
    "SaaS",
    "IaaS",
    "Network Devices",
    "Containers",
    "Android",
    "iOS",
  ];

  const handleChange = useCallback(
    (field: keyof AssetForm, value: any) => {
      setAssetFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setAssetFormData] // only depends on setter from props
  );

  const getStatusComponent = () => {
    if (
      assetFormData.status === "published" ||
      assetFormData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={assetFormData.status === "published"}
            />
          }
          label={assetFormData.status === "published" ? "Enabled" : "Disabled"}
          sx={{ width: 30, height: 18, marginLeft: "0 !important", gap: 1 }}
        />
      );
    }
    return (
      <Chip
        icon={<DoneOutlined />}
        label="Draft"
        variant="outlined"
        size="small"
        color="primary"
        sx={{
          fontWeight: 550,
          borderRadius: 1,
          color: "primary.main",
          width: "96px",
          "& .MuiChip-icon": {
            marginRight: "1px",
          },
        }}
      />
    );
  };

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
        <Stack
          display={"flex"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack
            display={"flex"}
            direction="row"
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
            <Typography variant="h5" fontWeight={550} color="#121212">
              {operation === "create"
                ? "Add Asset"
                : `Edit Asset ${assetFormData.assetCode}`}
            </Typography>
            {operation === "edit" ? getStatusComponent() : null}
          </Stack>

          <IconButton onClick={onClose} sx={{ padding: 0 }}>
            <Close sx={{ color: "primary.main" }} />
          </IconButton>
        </Stack>
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
              {metaDatas?.find((item) => item.name === "Asset Category")
                ?.supported_values &&
              metaDatas?.find((item) => item.name === "Asset Category")
                ?.supported_values?.length > 0
                ? metaDatas
                    ?.find((item) => item.name === "Asset Category")
                    ?.supported_values?.map((item: string) => {
                      return (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })
                : assetCategoryItems.map((item) => {
                    return (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
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

export default QuestionnaireFormModal;
