// components/RiskScenarioCard.tsx
import {
  Box,
  Chip,
  Typography,
  Stack,
  Switch,
  Divider,
  FormControlLabel
} from '@mui/material';
import EditDeleteDialog from '@/components/EditDeleteDialog';
import { DoneOutlined } from '@mui/icons-material';
import { RiskScenarioData } from '@/types/risk-scenario';


interface RiskScenarioCardProps {
  riskScenarioData: RiskScenarioData
  setSelectedRiskScenario: React.Dispatch<React.SetStateAction<RiskScenarioData | null>>
  setIsAddRiskScenarioOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsEditRiskScenarioOpen: React.Dispatch<React.SetStateAction<boolean>>

}

const RiskScenarioCard:React.FC<RiskScenarioCardProps> = ({
  riskScenarioData,
  setSelectedRiskScenario,
  setIsAddRiskScenarioOpen,
  setIsEditRiskScenarioOpen
}: RiskScenarioCardProps) => {
  const getStatusComponent = () => {
    if (riskScenarioData.status === 'Enabled' || riskScenarioData.status === 'Disabled') {
      return <FormControlLabel control={<Switch color="success" checked={riskScenarioData.status === 'Enabled'} />} label={riskScenarioData.status} />;
    }
    return (
      <Chip
      icon={<DoneOutlined />}
        label="Draft"
        variant="outlined"
        size="small"
        color="primary"
        sx={{ fontWeight: 500, borderRadius: 1, width: '100%' }}
      />
    );
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        boxShadow: '0px 2px 4px 0px #D9D9D98F',
        border: '1px solid #E4E4E4',
        backgroundColor: "#FFFFFF"
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 1, backgroundColor: '#F3F8FF', borderRadius: '8px 8px 0 0' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontWeight={600}>{riskScenarioData.risk_code}</Typography>
          <Chip label={`Industry: ${riskScenarioData.industry && riskScenarioData.industry }`} variant="outlined" size="small" sx={{borderRadius: 0.5}}/>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="textSecondary">
            Last Updated: {riskScenarioData.lastUpdated}
          </Typography>
          <Box sx={{width: '118px', mx: '24px !important'}}>
          {getStatusComponent()}
          </Box>
          {/* <IconButton sx={{ px: 0, mx:'0px !important'}}>
            <MoreVert sx={{color:"primary.main"}}/>
          </IconButton> */}
          <EditDeleteDialog />
        </Stack>
      </Stack>
      </Box>

      {/* Title */}
      <div onClick={() => {
        // setSelectedRiskScenario({
        //   id: id,
        //   riskScenario: title,

        // })
      }}>
      <Typography variant="body1" fontWeight={500} sx={{ px: 3}}>
        {riskScenarioData.riskScenario}
      </Typography>

      <Divider sx={{mx: 3}}/>

      {/* Meta Info */}
      <Typography variant="body2" color="textSecondary"  sx={{ px: 3, pb: 1}}>
        {riskScenarioData.tags} Tags &nbsp; • &nbsp; {riskScenarioData.processes} Processes &nbsp; • &nbsp; {riskScenarioData.assets} Assets &nbsp; • &nbsp; {riskScenarioData.threats} Threats
      </Typography>
      </div>
      </Box>
  );
};

export default RiskScenarioCard;
