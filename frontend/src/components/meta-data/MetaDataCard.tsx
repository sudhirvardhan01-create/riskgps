import { Card, Chip, IconButton, Stack, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

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
  onClick
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        px: 2,
        pt: 1.5,
        pb: 0.5,
        boxShadow: '0px 4px 4px 0px #D9D9D966',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        border: '1px solid #E4E4E4',
      }}
    >

      {/* Key */}
      <Stack spacing={1} flex={1} onClick={onClick}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={550} fontSize={"14px"}>
          Key
        </Typography>
        <Typography sx={{ fontWeight: "medium"}} color="text.primary" fontSize={"16px"}>{keyLabel}</Typography>
      </Stack>

      {/* Values */}
      <Stack spacing={1} flex={2} onClick={onClick}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={550} fontSize={"14px"}>
          Values
        </Typography>
        <Stack direction="row" flexWrap="wrap">
          {values && values?.length > 0 ? (
            values?.map((value) => (
              <Chip
                key={value}
                label={value}
                sx={{ borderRadius: '2px', bgcolor: '#E7E7E8', color: 'text.primary', fontSize: "14px", fontWeight: "medium", marginRight: "8px", marginBottom: "8px" }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 'medium'}}>
              No values assigned
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* Actions */}
      <Stack direction="row" spacing={1}>
        <IconButton onClick={onEdit} aria-label="edit" sx={{ color: '#0029A9' }}>
          <EditOutlinedIcon />
        </IconButton>
        <IconButton onClick={onDelete} aria-label="delete" sx={{ color: '#DB0000' }}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Stack>
    </Card>
  );
};

export default MetaDataCard;
