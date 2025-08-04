// components/RiskScenarioCard.tsx
import React from "react";
import {
  Box,
  Chip,
  Typography,
  Stack,
  Divider,
  FormControlLabel
} from '@mui/material';
import { DeleteOutlineOutlined, DoneOutlined, EditOutlined } from '@mui/icons-material';
import { RiskScenarioData } from '@/types/risk-scenario';
import MenuItemComponent from '@/components/MenuItemComponent';
import ToggleSwitch from '../toggle-switch/ToggleSwitch';


interface RiskScenarioCardProps {
  riskScenarioData: RiskScenarioData;
  setSelectedRiskScenario: React.Dispatch<React.SetStateAction<RiskScenarioData | null>>;
  setIsViewRiskScenarioOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditRiskScenarioOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateRiskScenarioStatus: (id: number, status: string) => void
}

const RiskScenarioCard: React.FC<RiskScenarioCardProps> = ({
  riskScenarioData,
  setSelectedRiskScenario,
  setIsViewRiskScenarioOpen,
  setIsEditRiskScenarioOpen,
  setIsDeleteConfirmPopupOpen,
  handleUpdateRiskScenarioStatus
}: RiskScenarioCardProps) => {
  const getStatusComponent = () => {
    if (riskScenarioData.status === 'published' || riskScenarioData.status === 'not_published') {
      return <FormControlLabel control={<ToggleSwitch sx={{m: 1}} color="success" onChange={(e)=>{
        const updatedStatus = e.target.checked ? "published" : "not_published";
        handleUpdateRiskScenarioStatus(riskScenarioData.id as number, updatedStatus);
      }} checked={riskScenarioData.status === 'published'}/>} label={riskScenarioData.status === "published" ? "Enabled" : "Disabled"} />;
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


  const dialogData = [{
    onAction: () => { 
      setSelectedRiskScenario(riskScenarioData);
      setIsEditRiskScenarioOpen(true);
},
    color: 'primary.main',
    action: 'Edit',
    icon: <EditOutlined fontSize="small" />
  },
  {
    onAction: () => {
      setSelectedRiskScenario(riskScenarioData);
      setIsDeleteConfirmPopupOpen(true);

    },
    color: '#CD0303',
    action: 'Delete',
    icon: <DeleteOutlineOutlined fontSize="small" />
  }
  ]

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
            <Chip label={`Industry: ${riskScenarioData.industry && riskScenarioData.industry?.length > 0 ? riskScenarioData.industry.join(", ") : "Not Defined"}`} variant="outlined" size="small" sx={{ borderRadius: 0.5 }} />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0}>
            <Typography variant="body2" color="textSecondary">
              Last Updated: {new Date(riskScenarioData.lastUpdated as Date).toISOString().split('T')[0]}
            </Typography>
            <Box sx={{ width: '200px', mx: '24px !important' }}>
              {getStatusComponent()}
            </Box>
            {/* <IconButton sx={{ px: 0, mx:'0px !important'}}>
            <MoreVert sx={{color:"primary.main"}}/>
          </IconButton> */}
            <MenuItemComponent items={dialogData}/>
          </Stack>
        </Stack>
      </Box>

      {/* Title */}
      <div onClick={() => {
        console.log(riskScenarioData)
        setSelectedRiskScenario(riskScenarioData);
        setIsViewRiskScenarioOpen(true)

      }}>
        <Typography variant="body1" fontWeight={500} sx={{ px: 3 }}>
          {riskScenarioData.riskScenario}
        </Typography>

        <Divider sx={{ mx: 3, my: 1 }} />

      {/* Meta Info */}
      <Typography variant="body2" color="textSecondary"  sx={{ px: 3, pb: 1}}>
        {riskScenarioData.tags} Tags &nbsp; • &nbsp; {1} Processes &nbsp; • &nbsp; {riskScenarioData.assets} Assets &nbsp; • &nbsp; {riskScenarioData.threats} Threats
      </Typography>
      </div>
    </Box>
  );
};

export default RiskScenarioCard;
