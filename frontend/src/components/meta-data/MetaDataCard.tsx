import { Card, Chip, IconButton, Stack, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

interface MetaDataCardProps {
  keyLabel: string;
  values: string[] | undefined;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const MetaDataCard: React.FC<MetaDataCardProps> = ({
  keyLabel,
  values,
  onEdit,
  onDelete,
  onClick,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        px: 3,
        py: 2,
        boxShadow: "0px 4px 4px 0px #D9D9D966",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        border: "1px solid #E4E4E4",
      }}
    >
      {/* Key */}
      <Stack spacing={0.5} flex={1} onClick={onClick} sx={{ alignSelf: "stretch" }}>
        <Typography variant="body2" color="#91939A" fontWeight={550}>
          Key
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.primary">
          {keyLabel}
        </Typography>
      </Stack>

      {/* Values */}
      <Stack spacing={0.5} flex={2} onClick={onClick}>
        <Typography variant="body2" color="#91939A" fontWeight={550}>
          Values
        </Typography>
        <Stack direction="row" flexWrap="wrap">
          {values && values?.length > 0 ? (
            values?.map((value) => (
              <Chip
                key={value}
                label={value}
                sx={{
                  borderRadius: "2px",
                  bgcolor: "#E7E7E8",
                  color: "text.primary",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginRight: "8px",
                  marginBottom: "8px",
                  height: "24px"
                }}
              />
            ))
          ) : (
            <Typography variant="body1" color="text.disabled" fontWeight={500}>
              No values assigned
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* Actions */}
      <Stack direction="row" spacing={1}>
        <IconButton
          onClick={onEdit}
          aria-label="edit"
          sx={{ color: "primary.main" }}
        >
          <EditOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={onDelete}
          aria-label="delete"
          sx={{ color: "#CD0303" }}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Stack>
    </Card>
  );
};

export default MetaDataCard;
