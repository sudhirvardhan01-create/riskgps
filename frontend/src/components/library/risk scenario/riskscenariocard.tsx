// components/TicketCard.tsx
import {
  Box,
  Chip,
  Typography,
  Stack,
  Switch,
  IconButton,
  Divider,
  FormControlLabel
} from '@mui/material';
import { DoneOutlined, MoreVert } from '@mui/icons-material';

interface TicketCardProps {
  id: string;
  industry: string;
  title: string;
  tags: number;
  processes: number;
  assets: number;
  threats: number;
  lastUpdated: string;
  status: string;
}

const TicketCard = ({
  id,
  industry,
  title,
  tags,
  processes,
  assets,
  threats,
  lastUpdated,
  status,
}: TicketCardProps) => {
  const getStatusComponent = () => {
    if (status === 'Enabled' || status === 'Disabled') {
      return <FormControlLabel control={<Switch color="success" checked={status === 'Enabled'} />} label={status} />;
    }
    return (
      <Chip
      icon={<DoneOutlined />}
        label="Draft"
        variant="outlined"
        size="small"
        color="primary"
        sx={{ fontWeight: 500, borderRadius: 0.5 }}
      />
    );
  };

  return (
    <Box
      sx={{
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        boxShadow: 1,
        border: '1px solid #E4E4E4'
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 1, backgroundColor: '#F3F8FF'}}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontWeight={600}>{id}</Typography>
          <Chip label={`Industry: ${industry}`} variant="outlined" size="small" sx={{borderRadius: 1}}/>
        </Stack>

        <Stack direction="row" alignItems="center"  spacing={1}>
          <Typography variant="body2" color="textSecondary">
            Last Updated: {lastUpdated}
          </Typography>
          {getStatusComponent()}
          <IconButton>
            <MoreVert />
          </IconButton>
        </Stack>
      </Stack>
      </Box>

      {/* Title */}
      <Typography variant="h6" fontWeight={500} sx={{ px: 3}}>
        {title}
      </Typography>

      <Divider sx={{mx: 3}}/>

      {/* Meta Info */}
      <Typography variant="body2" color="textSecondary"  sx={{ px: 3, pb: 1}}>
        {tags} Tags &nbsp; • &nbsp; {processes} Processes &nbsp; • &nbsp; {assets} Assets &nbsp; • &nbsp; {threats} Threats
      </Typography>
    </Box>
  );
};

export default TicketCard;
