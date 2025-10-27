import React, { useState, useEffect } from 'react';
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
  Stack,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Image from "next/image";
import { useRouter } from 'next/router';
import DisableConfirmationModal from './DisableConfirmationModal';
import AssessmentTable from '../../Assessment/AssessmentTable';
import { Assessment } from '@/types/assessment';
import { BusinessUnitData } from '@/types/business-unit';
import { getAssessmentsByBusinessUnit, formatAssessmentData } from '@/services/businessUnitService';
import ToastComponent from '@/components/ToastComponent';

// Extended interface for modal-specific data
interface BusinessUnitDataWithAssessment extends BusinessUnitData {
  assessmentData?: Assessment[];
}

interface BusinessUnitDetailsModalProps {
  open: boolean;
  onClose: () => void;
  businessUnit: BusinessUnitDataWithAssessment | null;
  onEdit: (businessUnit: BusinessUnitDataWithAssessment) => void;
  onStatusChange: (id: string, status: 'active' | 'disable') => void;
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [assessmentData, setAssessmentData] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success' as 'error' | 'warning' | 'info' | 'success'
  });


  // Fetch assessment data when modal opens or business unit changes
  useEffect(() => {
    if (open && businessUnit?.id && activeTab === 1) {
      fetchAssessmentData();
    }
  }, [open, businessUnit?.id, activeTab]);

  const fetchAssessmentData = async () => {
    if (!businessUnit?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getAssessmentsByBusinessUnit(businessUnit.orgId, businessUnit.id);
      const formattedData = response.data.map(formatAssessmentData);
      setAssessmentData(formattedData);

      // Show success toast
      setToast({
        open: true,
        message: 'Assessment data loaded successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error fetching assessment data:', err);
      setError('Failed to load assessment data');
      setAssessmentData([]);

      // Show error toast
      setToast({
        open: true,
        message: 'Failed to load assessment data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleClose = () => {
    setActiveTab(0); // Reset to Basic Details tab
    onClose();
  };

  const handleEdit = () => {
    if (businessUnit) {
      onEdit(businessUnit);
      handleClose();
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!businessUnit) return;

    const newStatus = event.target.checked ? 'active' : 'disable';

    // If trying to disable, show confirmation modal
    if (newStatus === 'disable') {
      setShowDisableModal(true);
    } else {
      // If enabling, proceed directly
      onStatusChange(businessUnit.id, newStatus);
    }
  };

  const handleDisableConfirm = () => {
    if (businessUnit) {
      onStatusChange(businessUnit.id, 'disable');
      setShowDisableModal(false);
    }
  };

  const handleDisableCancel = () => {
    setShowDisableModal(false);
  };

  const handleCreateAssessment = () => {
    // Navigate to assessment route
    router.push('/assessment');
  };

  // Early return after all hooks
  if (!businessUnit) return null;


  const contactRoles = [
    {
      role: 'BU Head',
      name: businessUnit.buHead?.name || '-',
      email: businessUnit.buHead?.email || '-',
    },
    {
      role: 'BU POC/BISO',
      name: businessUnit.buPocBiso?.name || '-',
      email: businessUnit.buPocBiso?.email || '-',
    },
    {
      role: 'BU IT POC',
      name: businessUnit.buItPoc?.name || '-',
      email: businessUnit.buItPoc?.email || '-',
    },
    {
      role: 'BU Finance Lead',
      name: businessUnit.buFinanceLead?.name || '-',
      email: businessUnit.buFinanceLead?.email || '-',
    },
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
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
            <Typography variant="h5" sx={{ fontWeight: 500, color: '#121212' }}>
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
                  }}
                >
                  {businessUnit.status === 'active' ? 'Active' : 'Disable'}
                </Typography>
              }
              sx={{ m: 0 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {activeTab !== 1 && <IconButton
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
            </IconButton>}
            <IconButton
              onClick={handleClose}
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                minHeight: '32px',
                height: '32px',
                border: '1px solid #E7E7E8',
                borderRadius: '2px',
                backgroundColor: '#FFFFFF',
                color: '#91939A',
                padding: '7px 12px',
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
            <Tab label="Basic Details" />
            <Tab label="Assessments" />
          </Tabs>

          {activeTab === 1 && (
            <Button
              variant="contained"
              onClick={handleCreateAssessment}
              disabled={businessUnit.status === 'disable'}
              sx={{
                minHeight: '32px',
                height: '32px',
                backgroundColor: businessUnit.status === 'disable' ? '#E7E7E8' : '#04139A',
                color: businessUnit.status === 'disable' ? '#91939A' : '#FFFFFF',
                textTransform: 'none',
                fontWeight: 500,
                padding: '7px 12px',
                borderRadius: '2px',
                '&:hover': {
                  backgroundColor: businessUnit.status === 'disable' ? '#E7E7E8' : '#04139A',
                  opacity: businessUnit.status === 'disable' ? 1 : 0.9,
                },
                '&.Mui-disabled': {
                  backgroundColor: '#E7E7E8',
                  color: '#91939A',
                },
              }}
            >
              Create Assessment
            </Button>
          )}
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
                          mb: 0.5,
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
                            }}
                          >
                            Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#484848',
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
                            }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#484848',
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
                      mb: 1,
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
                              mb: 1,
                            }}
                          >
                            Key
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#484848",
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
                              mb: 1,
                            }}
                          >
                            Value
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#484848",
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
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ m: 2 }}>
                  {error}
                </Alert>
              ) : (
                <AssessmentTable
                  data={assessmentData}
                  onMenuClick={(event: React.MouseEvent<HTMLElement>, runId: string) => {
                    console.log('Menu clicked for runId:', runId);
                    // Handle menu click - you can add your logic here
                  }}
                  onCardClick={(runId: string) => {
                    console.log('Card clicked for runId:', runId);
                    // Handle card click - you can add your logic here
                  }}
                  variant="businessUnit"
                  businessUnitName={businessUnit.businessUnitName}
                />
              )}
            </Box>
          </TabPanel>
        </DialogContent>
      </Dialog>

      <DisableConfirmationModal
        open={showDisableModal}
        onClose={handleDisableCancel}
        onConfirm={handleDisableConfirm}
        businessUnitName={businessUnit.businessUnitName}
      />

      <ToastComponent
        open={toast.open}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        message={toast.message}
        toastSeverity={toast.severity}
        toastBorder={toast.severity === "success" ? "1px solid #147A50" : undefined}
        toastColor={toast.severity === "success" ? "#147A50" : undefined}
        toastBackgroundColor={toast.severity === "success" ? "#DDF5EB" : undefined}
      />
    </>
  );
};

export default BusinessUnitDetailsModal;
