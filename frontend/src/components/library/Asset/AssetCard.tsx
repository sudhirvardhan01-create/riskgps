// components/AssetCard.tsx
import React from "react";
import {
  Box,
  Chip,
  Typography,
  Stack,
  FormControlLabel
} from '@mui/material';
import { DeleteOutlineOutlined, DoneOutlined, EditOutlined } from '@mui/icons-material';
import { AssetForm } from '@/types/asset';
import MenuItemComponent from '@/components/MenuItemComponent';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';


interface AssetCardProps {
  assetData: AssetForm;
  setSelectedAsset: React.Dispatch<React.SetStateAction<AssetForm | null>>;
  setIsViewAssetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditAssetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateAssetStatus: (id: number, status: string) => void
}

const AssetCard: React.FC<AssetCardProps> = ({
  assetData,
  setSelectedAsset,
  setIsViewAssetOpen,
  setIsEditAssetOpen,
  setIsDeleteConfirmPopupOpen,
  handleUpdateAssetStatus
}: AssetCardProps) => {
  const getStatusComponent = () => {
    if (assetData.status === 'published' || assetData.status === 'not_published') {
      return <FormControlLabel control={<ToggleSwitch sx={{m: 1}} color="success" onChange={(e)=>{
        const updatedStatus = e.target.checked ? "published" : "not_published";
        handleUpdateAssetStatus(assetData.id as number, updatedStatus);
      }} checked={assetData.status === 'published'}/>} label={assetData.status === "published" ? "Enabled" : "Disabled"} />;
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
      setSelectedAsset(assetData);
      setIsEditAssetOpen(true);
},
    color: 'primary.main',
    action: 'Edit',
    icon: <EditOutlined fontSize="small" />
  },
  {
    onAction: () => {
      setSelectedAsset(assetData);
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
            <Typography fontWeight={600}>{assetData.asset_code}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0}>
            <Typography variant="body2" color="textSecondary">
              Last Updated: {new Date(assetData.lastUpdated as Date).toISOString().split('T')[0]}
            </Typography>
            <Box sx={{ width: '200px', mx: '24px !important' }}>
              {getStatusComponent()}
            </Box>
            <MenuItemComponent items={dialogData}/>
          </Stack>
        </Stack>
      </Box>

      {/* Title */}
      <div onClick={() => {
        console.log(assetData)
        setSelectedAsset(assetData);
        setIsViewAssetOpen(true)

      }}>
        <Typography variant="body1" fontWeight={500} sx={{ px: 3 }}>
          {assetData.assetName}
        </Typography>

      </div>
    </Box>
  );
};

export default AssetCard;
