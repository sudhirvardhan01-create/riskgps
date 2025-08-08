import { MetaData } from "@/types/meta-data";
import { Close, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { appliesToOptions } from "./MetaDataFormModal";

interface ViewMetaDataModalProps {
  open: boolean;
  metaData: MetaData;
  onClose: () => void;
  onEditButtonClick: () => void;
}

const ViewMetaDataModal: React.FC<ViewMetaDataModalProps> = ({
  open,
  metaData,
  onClose,
  onEditButtonClick,
}: ViewMetaDataModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2, paddingTop: 1 },
        },
      }}
    >
      <DialogTitle
        sx={{
          paddingRight: "16px !important",
          paddingBottom: "20px !important",
        }}
      >
        <Stack
          display={"flex"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="h5" fontWeight={550} color="#121212">
            Configuration
          </Typography>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={1}
          >
            <IconButton onClick={onEditButtonClick}>
              <EditOutlined sx={{ color: "primary.main" }} />
            </IconButton>
            <IconButton onClick={onClose}>
              <Close sx={{ color: "primary.main" }} />
            </IconButton>
          </Box>
        </Stack>
        <Divider sx={{ mt: 3, mb: 0.5, mr: 1.5 }} />
      </DialogTitle>

      <DialogContent sx={{ paddingBottom: "24px !important" }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Box gap={"6px"}>
              <Typography
                variant="body2"
                color="#91939A"
                fontWeight={550}
              >
                Key
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                {metaData.name}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box gap={"6px"}>
              <Typography
                variant="body2"
                color="#91939A"
                fontWeight={550}
              >
                Values
              </Typography>
              <Stack direction="row" flexWrap="wrap" mt="4px">
                {metaData?.supported_values &&
                metaData?.supported_values?.length > 0 ? (
                  metaData?.supported_values?.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      sx={{
                        borderRadius: "2px",
                        bgcolor: "#E7E7E8",
                        color: "text.primary",
                        fontWeight: "500",
                        fontSize: "14px",
                        marginRight: "8px",
                        marginBottom: "8px",
                      }}
                    />
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color="text.disabled"
                    fontWeight={500}
                  >
                    No values assigned
                  </Typography>
                )}
              </Stack>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography
                variant="body2"
                color="#91939A"
                fontWeight={550}
              >
                Input Type
              </Typography>
              <Typography
                variant="body1"
                fontWeight={500}
                color="text.primary"
                sx={{ textTransform: "capitalize" }}
              >
                {metaData.input_type}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography
                variant="body2"
                color="#91939A"
                fontWeight={550}
              >
                Applies To
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                {metaData.applies_to
                  ?.map((item) => {
                    return appliesToOptions?.find(
                      (option) => option.value === item
                    )?.label;
                  })
                  .join(", ")}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMetaDataModal;
