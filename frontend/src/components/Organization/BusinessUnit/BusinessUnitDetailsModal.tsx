import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Image from "next/image";

interface BusinessUnitData {
  id: string;
  businessUnitName: string;
  buCode: string;
  buSize: number;
  assessments: number;
  tags: { key: string; value: string }[];
  status: 'active' | 'inactive';
  lastUpdated?: string;
  // Contact roles
  buHead?: { name: string; email: string };
  buPocBiso?: { name: string; email: string };
  buItPoc?: { name: string; email: string };
  buFinanceLead?: { name: string; email: string };
}

interface BusinessUnitDetailsModalProps {
  open: boolean;
  onClose: () => void;
  businessUnit: BusinessUnitData | null;
  onEdit: (businessUnit: BusinessUnitData) => void;
  onStatusChange: (id: string, status: 'active' | 'inactive') => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bu-details-tabpanel-${index}`}
      aria-labelledby={`bu-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, ...sx }}>{children}</Box>}
    </div>
  );
}

const BusinessUnitDetailsModal: React.FC<BusinessUnitDetailsModalProps> = ({
  open,
  onClose,
  businessUnit,
  onEdit,
  onStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!businessUnit) return null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    onEdit(businessUnit);
    onClose();
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange(businessUnit.id, event.target.checked ? 'active' : 'inactive');
  };

  const contactRoles = [
    {
      role: 'BU Head',
      name: businessUnit.buHead?.name || 'Karan Gautam',
      email: businessUnit.buHead?.email || 'karangautam@abccompany.com',
    },
    {
      role: 'BU POC/BISO',
      name: businessUnit.buPocBiso?.name || 'Nishant Saxena',
      email: businessUnit.buPocBiso?.email || 'nishant.s@abccompany.com',
    },
    {
      role: 'BU IT POC',
      name: businessUnit.buItPoc?.name || 'Akriti Sharma',
      email: businessUnit.buItPoc?.email || 'sharma.akriti@abccompany.com',
    },
    {
      role: 'BU Finance Lead',
      name: businessUnit.buFinanceLead?.name || 'Siva Prasad',
      email: businessUnit.buFinanceLead?.email || 'siva@abccompany.com',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: "8px",
          maxHeight: '90vh',
          width: "1034px",
          padding: "5px 24px"
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 3,
          pl: 0,
          pr: 0,
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, fontSize: "24px", color: '#121212', lineHeight: "130%", letterSpacing: "0px" }}>
            {businessUnit.businessUnitName}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={businessUnit.status === 'active'}
                onChange={handleStatusChange}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#147A50',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#147A50',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  color: businessUnit.status === 'active' ? '#147A50' : '#9E9E9E',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: "150%",
                  letterSpacing: "0px"
                }}
              >
                {businessUnit.status === 'active' ? 'Active' : 'Inactive'}
              </Typography>
            }
            sx={{ m: 0 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handleEdit}
            sx={{
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <Image
              src={"/edit-icon.png"}
              alt="edit-icon"
              width={20}
              height={20}
            />
          </IconButton>
          <IconButton
            onClick={onClose}
            sx={{
              width: 24,
              height: 24,
              color: '#484848',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <CloseIcon sx={{ width: 24, height: 24 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider sx={{ mb: 3 }} />

      <Box >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="business unit details tabs"
          sx={{
            '& .MuiTabs-flexContainer': {
              gap: '8px',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              minHeight: '32px',
              height: '32px',
              border: '1px solid #E7E7E8',
              borderRadius: '2px',
              backgroundColor: '#FFFFFF',
              color: '#91939A',
              padding: '7px 12px',
              lineHeight: "100%",
              letterSpacing: "0%",
              '&:hover': {
                backgroundColor: '#F5F5F5',
                color: '#484848',
              },
              '&.Mui-selected': {
                backgroundColor: '#EDF3FCA3',
                color: '#484848',
                border: '1px solid #04139A',
                fontWeight: 500,
                fontSize: '14px',
              },
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab label="Basic Details" />
          <Tab label="Assessments" />
        </Tabs>
      </Box>

      <DialogContent
        sx={{
          p: "0 !important",
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
        }}>
        <TabPanel
          value={activeTab}
          index={0}
          sx={{ p: 0, m: 0 }}
        >
          <Box sx={{ p: 0 }}>
            {/* Contact Roles Section */}
            <Box >
              <Stack spacing={2}>
                {contactRoles.map((contact, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: '#E7E7E84D',
                      border: '1px solid #E7E7E8',
                      borderRadius: '8px',
                      padding: '12px',
                      boxShadow: '0px 1px 3px #E7E7E84D',
                      height: "86px"
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#121212',
                        mb: 1.5,
                        fontSize: '12px',
                        lineHeight: '100%',
                        letterSpacing: "0px"
                      }}
                    >
                      {contact.role}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: '#91939A',
                            fontSize: '12px',
                            lineHeight: '100%',
                            letterSpacing: "0px",
                            mb: 0.5,
                          }}
                        >
                          Name
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#484848',
                            fontSize: '14px',
                            lineHeight: '130%',
                            letterSpacing: "0px",
                            fontWeight: 400
                          }}
                        >
                          {contact.name}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: '#91939A',
                            fontSize: '12px',
                            lineHeight: '100%',
                            letterSpacing: "0px",
                            mb: 0.5,
                          }}
                        >
                          Email
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#484848',
                            fontSize: '14px',
                            lineHeight: '130%',
                            letterSpacing: "0px",
                            fontWeight: 400
                          }}
                        >
                          {contact.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Tags Section */}
            {businessUnit.tags && businessUnit.tags.length > 0 && (
              <Box sx={{
                backgroundColor: '#E7E7E84D',
                border: '1px solid #E7E7E8',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0px 1px 3px #E7E7E84D',
                mt: 2,
                mb: 2
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#121212',
                    mb: 1.5,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: "0px"
                  }}
                >
                  Tags
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                  }}
                >
                  {businessUnit.tags.map((tag, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: 2,
                        backgroundColor: "#FFFFFF",
                        p: 1,
                        borderRadius: "4px",
                        border: "1px solid #E7E7E8"
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "#91939A",
                            fontSize: "12px",
                            lineHeight: "100%",
                            letterSpacing: "0px",
                            mb: 1,
                          }}
                        >
                          Key
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#484848",
                            fontSize: "14px",
                            lineHeight: "130%",
                            letterSpacing: "0px",
                            fontWeight: 400,
                          }}
                        >
                          {tag.key}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "#91939A",
                            fontSize: "12px",
                            lineHeight: "100%",
                            letterSpacing: "0px",
                            mb: 1,
                          }}
                        >
                          Value
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#484848",
                            fontSize: "14px",
                            lineHeight: "130%",
                            letterSpacing: "0px",
                            fontWeight: 400,
                          }}
                        >
                          {tag.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1} sx={{ p: 0, m: 0 }}>
          <Box sx={{ p: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#484848',
                mb: 2,
                fontSize: '18px',
              }}
            >
              Assessments
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666666',
                fontSize: '14px',
              }}
            >
              No assessments available for this business unit.
            </Typography>
          </Box>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessUnitDetailsModal;
