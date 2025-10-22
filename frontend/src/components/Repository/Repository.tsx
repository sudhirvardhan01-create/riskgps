import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Stack,
  SxProps,
  Theme,
  Tooltip,
} from '@mui/material';
import {
  Info as InfoIcon,
} from '@mui/icons-material';
import LibraryCardIcon from "@/icons/risk-scenario-card.svg";
import ThreatCardIcon from "@/icons/threats-card.svg";
import AssetCardIcon from "@/icons/assets-card.svg";
import ControlCardIcon from "@/icons/controls-card.svg";
import ProcessCardIcon from "@/icons/processes-card.svg";
import { constants } from "@/utils/constants";
import RiskTaxonomy from './RiskTaxonomy';
import Scales from './Scales';
import { tooltips } from "@/utils/tooltips";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: SxProps<Theme>;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`repository-tabpanel-${index}`}
      aria-labelledby={`repository-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ ...sx }}>{children}</Box>}
    </div>
  );
}

interface RepositoryCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  count: number;
}

function RepositoryCard({ name, description, icon, href, count }: RepositoryCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    // Extract orgId from current route
    const orgId = router.query.orgId;
    if (orgId) {
      // Navigate to the specific library page
      router.push(`/orgManagement/${orgId}/library${href}`);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        border: "1px solid #E4E4E4",
        borderRadius: 2,
        boxShadow: "0px 4px 4px 0px #D9D9D98F",
        cursor: "pointer",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={handleCardClick}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Box sx={{ height: 24, width: 24 }}>{icon}</Box>
        <Typography
          variant="h6"
          fontWeight={600}
          color="primary.main"
        >
          {name} ({count})
        </Typography>
      </Stack>
      <Typography variant="body1" color="#91939A" sx={{ mt: 3 }}>
        {description}
      </Typography>
    </Box>
  );
}

function Repository() {
  const [repositoryTabValue, setRepositoryTabValue] = useState(0);

  const handleRepositoryTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setRepositoryTabValue(newValue);
  };

  const repositoryCards = [
    {
      name: constants.libRiskScenarioTitle,
      description: constants.libRiskScenarioDescription,
      icon: <LibraryCardIcon height={24} width={24} />,
      href: "/riskScenarios",
      count: 0
    },
    {
      name: constants.libThreatTitle,
      description: constants.libThreatDescription,
      icon: <ThreatCardIcon height={24} width={24} />,
      href: "/threats",
      count: 0
    },
    {
      name: constants.libAssetTitle,
      description: constants.libAssetDescription,
      icon: <AssetCardIcon height={24} width={24} />,
      href: "/assets",
      count: 0
    },
    {
      name: constants.libControlTitle,
      description: constants.libControlDescription,
      icon: <ControlCardIcon height={24} width={24} />,
      href: "/controls",
      count: 0
    },
    {
      name: constants.libProcessTitle,
      description: constants.libProcessDescription,
      icon: <ProcessCardIcon height={24} width={24} />,
      href: "/processes",
      count: 0
    },
  ];

  return (
    <Box sx={{ width: "100%", pt: "10px" }}>
      {/* Repository Sub-navigation */}
      <Box
        sx={{
          mb: "14px",
          pl: "25px", pr: "25px"
        }}
      >
        <Tabs
          value={repositoryTabValue}
          onChange={handleRepositoryTabChange}
          aria-label="repository tabs"
          sx={{
            '& .MuiTabs-flexContainer': {
              gap: '8px',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minHeight: '32px',
              border: '1px solid #E7E7E8',
              borderRadius: '4px',
              backgroundColor: '#FFFFFF',
              color: '#484848',
              padding: '7px 16px',
              '&:hover': {
                backgroundColor: '#F5F5F5',
                color: '#484848',
              },
              '&.Mui-selected': {
                backgroundColor: '#EDF3FCA3',
                color: '#484848',
                border: '1px solid #04139A',
                fontWeight: 500,
              },
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab label="Library" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Risk Taxonomy
                <Tooltip
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#484848' }}>
                        {tooltips.RiskTaxonomyLabel}
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.4, color: '#91939A' }}>
                        {tooltips.RiskTaxonomyDes}
                      </Typography>
                    </Box>
                  }
                  placement="bottom"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: '#FFFFFF',
                        color: '#484848',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                        borderRadius: '8px',
                        border: '1px solid #E7E7E8',
                        maxWidth: '300px',
                        fontSize: '0.875rem',
                        '& .MuiTooltip-arrow': {
                          color: '#FFFFFF',
                          '&::before': {
                            border: '1px solid #E7E7E8',
                          }
                        }
                      }
                    }
                  }}
                >
                  <InfoIcon sx={{ fontSize: 14, color: '#04139A', cursor: 'pointer' }} />
                </Tooltip>
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Scales
                <Tooltip
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#484848' }}>
                        {tooltips.scaleLabel}
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.4, color: '#91939A' }}>
                        {tooltips.scaleDes}
                      </Typography>
                    </Box>
                  }
                  placement="bottom"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: '#FFFFFF',
                        color: '#484848',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                        borderRadius: '8px',
                        border: '1px solid #E7E7E8',
                        maxWidth: '300px',
                        fontSize: '0.875rem',
                        '& .MuiTooltip-arrow': {
                          color: '#FFFFFF',
                          '&::before': {
                            border: '1px solid #E7E7E8',
                          }
                        }
                      }
                    }
                  }}
                >
                  <InfoIcon sx={{ fontSize: 14, color: '#04139A', cursor: 'pointer' }} />
                </Tooltip>
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* Repository Tab Content */}
      <TabPanel value={repositoryTabValue} index={0} sx={{ pl: "25px", pr: "25px" }}>
        <Grid
          container
          rowSpacing={3}
          columnSpacing={3}
          sx={{ overflow: "auto", mb: 7 }}
        >
          {repositoryCards.map((card, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={card.name}>
              <RepositoryCard
                name={card.name}
                description={card.description}
                icon={card.icon}
                href={card.href}
                count={card.count}
              />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={repositoryTabValue} index={1} sx={{ pl: "25px", pr: "25px" }}>
        <RiskTaxonomy />
      </TabPanel>

      <TabPanel value={repositoryTabValue} index={2} sx={{ pl: "25px", pr: "25px" }}>
        <Scales />
      </TabPanel>
    </Box>
  );
}

export default Repository;
