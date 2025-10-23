import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import TextFieldStyled from '../../TextFieldStyled';
import SelectStyled from '../../SelectStyled';

interface ContactInfo {
  name: string;
  email: string;
}

interface Tag {
  key: string;
  value: string;
}

interface CreateBusinessUnitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BusinessUnitFormData) => void;
  editData?: BusinessUnitFormData;
  isEditMode?: boolean;
}

interface BusinessUnitFormData {
  businessUnitName: string;
  buHead: ContactInfo;
  buPocBiso: ContactInfo;
  buItPoc: ContactInfo;
  buFinanceLead: ContactInfo;
  tags: Tag[];
}

// Centralized field configuration - control all required fields from here
const FIELD_CONFIG = {
  businessUnitName: { required: true },
  buHead: { 
    name: { required: true },
    email: { required: true }
  },
  buPocBiso: { 
    name: { required: true },
    email: { required: true }
  },
  buItPoc: { 
    name: { required: true },
    email: { required: true }
  },
  buFinanceLead: { 
    name: { required: true },
    email: { required: true }
  }
} as const;

const CreateBusinessUnitForm: React.FC<CreateBusinessUnitFormProps> = ({
  open,
  onClose,
  onSubmit,
  editData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState<BusinessUnitFormData>(() => {
    if (isEditMode && editData) {
      return editData;
    }
    return {
      businessUnitName: '',
      buHead: { name: '', email: '' },
      buPocBiso: { name: '', email: '' },
      buItPoc: { name: '', email: '' },
      buFinanceLead: { name: '', email: '' },
      tags: [{ key: '', value: '' }],
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when editData changes
  useEffect(() => {
    if (isEditMode && editData) {
      setFormData(editData);
    } else if (!isEditMode) {
      setFormData({
        businessUnitName: '',
        buHead: { name: '', email: '' },
        buPocBiso: { name: '', email: '' },
        buItPoc: { name: '', email: '' },
        buFinanceLead: { name: '', email: '' },
        tags: [{ key: '', value: '' }],
      });
    }
  }, [isEditMode, editData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleContactChange = (contactType: keyof Omit<BusinessUnitFormData, 'businessUnitName' | 'tags'>, field: 'name' | 'email', value: string) => {
    setFormData(prev => ({
      ...prev,
      [contactType]: {
        ...prev[contactType],
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    const errorKey = `${contactType}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: '',
      }));
    }
  };

  const handleTagChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) =>
        i === index ? { ...tag, [field]: value } : tag
      ),
    }));
  };

  const addNewTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { key: '', value: '' }],
    }));
  };

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate business unit name
    if (FIELD_CONFIG.businessUnitName.required && !formData.businessUnitName.trim()) {
      newErrors.businessUnitName = 'Business Unit Name is required';
    }

    // Validate contact information using centralized config
    const contactFields = ['buHead', 'buPocBiso', 'buItPoc', 'buFinanceLead'] as const;
    contactFields.forEach(contactType => {
      const contact = formData[contactType];
      const contactConfig = FIELD_CONFIG[contactType];
      
      if (contactConfig.name.required && !contact.name.trim()) {
        newErrors[`${contactType}Name`] = 'Name is required';
      }
      if (contactConfig.email.required && !contact.email.trim()) {
        newErrors[`${contactType}Email`] = 'Email is required';
      } else if (contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        newErrors[`${contactType}Email`] = 'Please enter a valid email';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      // Reset form only if not in edit mode
      if (!isEditMode) {
        setFormData({
          businessUnitName: '',
          buHead: { name: '', email: '' },
          buPocBiso: { name: '', email: '' },
          buItPoc: { name: '', email: '' },
          buFinanceLead: { name: '', email: '' },
          tags: [{ key: '', value: '' }],
        });
        setErrors({});
        onClose();
      }
      // In edit mode, don't close immediately - let the parent handle the close after API call
    }
  };

  const handleCancel = () => {
    // Reset form only if not in edit mode
    if (!isEditMode) {
      setFormData({
        businessUnitName: '',
        buHead: { name: '', email: '' },
        buPocBiso: { name: '', email: '' },
        buItPoc: { name: '', email: '' },
        buFinanceLead: { name: '', email: '' },
        tags: [{ key: '', value: '' }],
      });
    }
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          maxHeight: '90vh',
          width: "800px"
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          pb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#121212',
          }}
        >
          {isEditMode ? 'Edit Business Unit' : 'Create Business Unit'}
        </Typography>
        <IconButton
          onClick={handleCancel}
          sx={{
            color: '#04139A',
            '&:hover': {
              backgroundColor: '#F5F5F5',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 3,
          pt: 1,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Business Unit Name */}
          <Box>
            <TextFieldStyled
              label="Business Unit Name"
              required={FIELD_CONFIG.businessUnitName.required}
              value={formData.businessUnitName}
              onChange={(e) => handleInputChange('businessUnitName', e.target.value)}
              placeholder="Enter name"
              error={!!errors.businessUnitName}
              helperText={errors.businessUnitName}
            />
          </Box>

          <Box>
            {/* BU Head */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: '#121212',
                  mb: 2,
                }}
              >
                BU Head
              </Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <TextFieldStyled
                    label="Name"
                    required={FIELD_CONFIG.buHead.name.required}
                    value={formData.buHead.name}
                    onChange={(e) => handleContactChange('buHead', 'name', e.target.value)}
                    placeholder="Enter name"
                    error={!!errors.buHeadName}
                    helperText={errors.buHeadName}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextFieldStyled
                    label="Email"
                    required={FIELD_CONFIG.buHead.email.required}
                    value={formData.buHead.email}
                    onChange={(e) => handleContactChange('buHead', 'email', e.target.value)}
                    placeholder="Enter email"
                    error={!!errors.buHeadEmail}
                    helperText={errors.buHeadEmail}
                  />
                </Box>
              </Box>
            </Box>

            {/* BU POC/BISO */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: '#121212',
                  mb: 2,
                }}
              >
                BU POC/BISO
              </Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <TextFieldStyled
                    label="Name"
                    required={FIELD_CONFIG.buPocBiso.name.required}
                    value={formData.buPocBiso.name}
                    onChange={(e) => handleContactChange('buPocBiso', 'name', e.target.value)}
                    placeholder="Enter name"
                    error={!!errors.buPocBisoName}
                    helperText={errors.buPocBisoName}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextFieldStyled
                    label="Email"
                    required={FIELD_CONFIG.buPocBiso.email.required}
                    value={formData.buPocBiso.email}
                    onChange={(e) => handleContactChange('buPocBiso', 'email', e.target.value)}
                    placeholder="Enter email"
                    error={!!errors.buPocBisoEmail}
                    helperText={errors.buPocBisoEmail}
                  />
                </Box>
              </Box>
            </Box>

            {/* BU IT POC */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: '#121212',
                  mb: 2,
                }}
              >
                BU IT POC
              </Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <TextFieldStyled
                    label="Name"
                    required={FIELD_CONFIG.buItPoc.name.required}
                    value={formData.buItPoc.name}
                    onChange={(e) => handleContactChange('buItPoc', 'name', e.target.value)}
                    placeholder="Enter name"
                    error={!!errors.buItPocName}
                    helperText={errors.buItPocName}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextFieldStyled
                    label="Email"
                    required={FIELD_CONFIG.buItPoc.email.required}
                    value={formData.buItPoc.email}
                    onChange={(e) => handleContactChange('buItPoc', 'email', e.target.value)}
                    placeholder="Enter email"
                    error={!!errors.buItPocEmail}
                    helperText={errors.buItPocEmail}
                  />
                </Box>
              </Box>
            </Box>

            {/* BU Finance Lead */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: '#121212',
                  mb: 2,
                }}
              >
                BU Finance Lead
              </Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <TextFieldStyled
                    label="Name"
                    required={FIELD_CONFIG.buFinanceLead.name.required}
                    value={formData.buFinanceLead.name}
                    onChange={(e) => handleContactChange('buFinanceLead', 'name', e.target.value)}
                    placeholder="Enter name"
                    error={!!errors.buFinanceLeadName}
                    helperText={errors.buFinanceLeadName}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextFieldStyled
                    label="Email"
                    required={FIELD_CONFIG.buFinanceLead.email.required}
                    value={formData.buFinanceLead.email}
                    onChange={(e) => handleContactChange('buFinanceLead', 'email', e.target.value)}
                    placeholder="Enter email"
                    error={!!errors.buFinanceLeadEmail}
                    helperText={errors.buFinanceLeadEmail}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Tags Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#121212',
                mb: 2,
              }}
            >
              Tags
            </Typography>

            {formData.tags.map((tag, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <SelectStyled
                      label="Key"
                      value={tag.key}
                      onChange={(e) => handleTagChange(index, 'key', e.target.value as string)}
                      name={`tag-key-${index}`}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: 52,
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Select key</em>
                      </MenuItem>
                      <MenuItem value="department">Department</MenuItem>
                      <MenuItem value="location">Location</MenuItem>
                      <MenuItem value="priority">Priority</MenuItem>
                      <MenuItem value="category">Category</MenuItem>
                    </SelectStyled>
                  </Box>

                  {/* Horizontal Divider */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '52px',
                    }}
                  >
                    <Box
                      sx={{
                        height: '1px',
                        width: '32px',
                        backgroundColor: '#CECFD2',
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <TextFieldStyled
                      label="Value"
                      value={tag.value}
                      onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                      placeholder="Enter Value"
                    />
                  </Box>

                  {formData.tags.length > 1 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeTag(index)}
                        sx={{
                          minWidth: 'auto',
                          p: 0.5,
                          '&:hover': {
                            backgroundColor: '#ffebee',
                          }
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}

            <Button
              variant="text"
              startIcon={<AddIcon />}
              onClick={addNewTag}
              sx={{
                color: '#04139A',
                textTransform: 'none',
                fontWeight: 400,
                p: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Add New Key
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            borderColor: '#CD0303',
            color: '#CD0303',
            textTransform: 'none',
            fontWeight: 400,
            height: "40px",
            width: "113px",
            p: "12px 32px",
            '&:hover': {
              borderColor: '#CD0303',
              backgroundColor: '#FFF5F5',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#04139A',
            color: '#F4F4F4',
            textTransform: 'none',
            fontWeight: 400,
            height: "40px",
            width: "113px",
            p: "12px 32px",
            '&:hover': {
              backgroundColor: '#04139A',
            },
          }}
        >
          {isEditMode ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBusinessUnitForm;
