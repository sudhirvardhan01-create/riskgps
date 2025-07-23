import { Card, Chip, IconButton, Stack, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export interface AccessTypeCardProps {
  keyLabel: string;
  values: string[];
  onEdit?: () => void;
  onDelete?: () => void;
}

const AccessTypeCard: React.FC<AccessTypeCardProps> = ({
  keyLabel,
  values,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 1,
        px: 2,
        py: 1.5,
        boxShadow: 1,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        border: '1px solid #E4E4E4'
      }}
    >
      {/* Key */}
      <Stack spacing={1} flex={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Key
        </Typography>
        <Typography fontWeight={500}>{keyLabel}</Typography>
      </Stack>

      {/* Values */}
      <Stack spacing={1} flex={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Values
        </Typography>
        <Stack direction="row" flexWrap="wrap" spacing={1}>
          {values.length > 0 ? (
            values.map((value) => (
              <Chip
                key={value}
                label={value}
                sx={{ borderRadius: '2px', bgcolor: '#E7E7E8' }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.disabled">
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

export default AccessTypeCard;
