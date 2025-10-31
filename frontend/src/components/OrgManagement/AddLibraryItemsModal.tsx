import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import {
  Close,
  Search,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { getBusinessUnits } from "@/services/businessUnitService";
import { BusinessUnitData } from "@/types/business-unit";
import { getOrganizationProcess } from "@/pages/api/organization";

// Generic interfaces for library items
interface LibraryItem {
  id: string | number;
  name: string;
  description: string;
}

// Service interface for fetching data
interface LibraryService {
  fetch: (page: number, limit: number, searchTerm: string, sort: string) => Promise<{ data: LibraryItem[] }>;
}

interface AddLibraryItemsModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (selectedItems: LibraryItem[]) => void;
  title: string;
  service: LibraryService;
  itemType: 'risk-scenarios' | 'processes' | 'assets' | 'controls' | 'threats';
  alreadyAddedIds?: (string | number)[];
  orgItems?: any[]; // Organization items for matching (for risk-scenarios)
  orgId?: string | string[]; // Organization ID for fetching business units
  initialBusinessUnitId?: string | string[]; // Initial business unit ID to pre-select (for processes)
}

const AddLibraryItemsModal: React.FC<AddLibraryItemsModalProps> = ({
  open,
  onClose,
  onAdd,
  title,
  service,
  itemType,
  alreadyAddedIds = [],
  orgItems = [],
  orgId,
  initialBusinessUnitId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string | number>>(new Set());
  const [hasInitialized, setHasInitialized] = useState(false);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([]);
  const [selectedBusinessUnitId, setSelectedBusinessUnitId] = useState<string>("");
  const [loadingBusinessUnits, setLoadingBusinessUnits] = useState(false);
  const [cachedOrgProcesses, setCachedOrgProcesses] = useState<any[]>([]);
  const router = useRouter();

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await service.fetch(0, -1, searchTerm, "id:asc");
      setItems(response.data);
    } catch (err) {
      setError(`Failed to fetch ${itemType}. Please try again.`);
      console.error(`Error fetching ${itemType}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch business units when modal opens and itemType is 'processes'
  useEffect(() => {
    if (!open || itemType !== 'processes' || !orgId || typeof orgId !== 'string') {
      setBusinessUnits([]);
      setSelectedBusinessUnitId("");
      return;
    }

    const fetchBusinessUnits = async () => {
      try {
        setLoadingBusinessUnits(true);
        const data = await getBusinessUnits(orgId);
        setBusinessUnits(data);
        
        // Pre-select initial business unit if provided
        if (initialBusinessUnitId && typeof initialBusinessUnitId === 'string') {
          setSelectedBusinessUnitId(initialBusinessUnitId);
        } else if (data.length > 0 && !initialBusinessUnitId) {
          // If no initial business unit provided, don't auto-select
          // User must select manually
          setSelectedBusinessUnitId("");
        }
      } catch (err) {
        console.error("Error fetching business units:", err);
        setBusinessUnits([]);
      } finally {
        setLoadingBusinessUnits(false);
      }
    };

    fetchBusinessUnits();
  }, [open, itemType, orgId, initialBusinessUnitId]);

  // Reset selections and initialization flag when modal opens/closes
  useEffect(() => {
    if (open) {
      setSelectedItems([]);
      setHasInitialized(false);
      setCachedOrgProcesses([]);
      if (itemType !== 'processes') {
        setSelectedBusinessUnitId("");
      }
    } else {
      // Reset when modal closes
      setHasInitialized(false);
      setSelectedBusinessUnitId("");
      setCachedOrgProcesses([]);
    }
  }, [open, itemType]);

  // Handle search with debouncing and initial fetch when modal opens
  useEffect(() => {
    if (!open) return;

    const timeoutId = setTimeout(() => {
      fetchItems();
    }, searchTerm ? 500 : 0); // No delay for initial fetch, 500ms debounce for search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, open]);

  // Fetch processes for selected business unit when it changes (for processes type)
  useEffect(() => {
    if (
      itemType !== 'processes' ||
      !open ||
      !selectedBusinessUnitId ||
      !orgId ||
      typeof orgId !== 'string' ||
      typeof selectedBusinessUnitId !== 'string'
    ) {
      setCachedOrgProcesses([]);
      return;
    }

    const fetchProcessesForBusinessUnit = async () => {
      try {
        const response = await getOrganizationProcess(orgId, selectedBusinessUnitId, 0, -1);
        const processesData = response?.data?.data || response?.data || [];

        if (Array.isArray(processesData)) {
          setCachedOrgProcesses(processesData);
        } else {
          setCachedOrgProcesses([]);
        }
      } catch (err: any) {
        // If error is "No processes found", treat it as empty state
        if (err.message?.toLowerCase().includes('no processes found')) {
          setCachedOrgProcesses([]);
        } else {
          console.error("Error fetching processes for business unit:", err);
          setCachedOrgProcesses([]);
        }
      }
    };

    fetchProcessesForBusinessUnit();
  }, [selectedBusinessUnitId, itemType, open, orgId]);

  // Match cached processes with library items whenever items change
  useEffect(() => {
    if (
      itemType !== 'processes' ||
      !open ||
      items.length === 0 ||
      cachedOrgProcesses.length === 0
    ) {
      if (itemType === 'processes' && open && items.length > 0 && cachedOrgProcesses.length === 0) {
        // Clear selection if no processes found for business unit
        setSelectedItems([]);
      }
      return;
    }

    // Create a Set of org process names for quick lookup
    const orgProcessNames = new Set(
      cachedOrgProcesses.map((process: any) => (process.processName || '').toLowerCase().trim())
    );

    // Match library items with org processes by processName
    const itemsToSelect = items
      .filter(item => {
        const libraryProcessName = (item.name || '').toLowerCase().trim();
        return libraryProcessName && orgProcessNames.has(libraryProcessName);
      })
      .map(item => item.id!)
      .filter((id): id is string | number => id !== undefined);

    if (itemsToSelect.length > 0) {
      setSelectedItems(itemsToSelect);
    } else {
      setSelectedItems([]);
    }
  }, [cachedOrgProcesses, items, itemType, open]);

  // Pre-select already added items when modal opens and items are loaded (only once)
  useEffect(() => {
    if (!open || items.length === 0 || hasInitialized) return;

    // Skip pre-selection for processes - it's handled by the business unit selection effect above
    if (itemType === 'processes') {
      setHasInitialized(true);
      return;
    }

    let itemsToSelect: (string | number)[] = [];

    // For risk-scenarios, match with org items by riskScenario text
    if (itemType === 'risk-scenarios' && orgItems.length > 0) {
      // Create a Set of org risk scenario texts for quick lookup
      const orgRiskScenarioTexts = new Set(
        orgItems.map((orgItem: any) => (orgItem.riskScenario || '').toLowerCase().trim())
      );

      // Match library items with org items by riskScenario text
      itemsToSelect = items
        .filter(item => {
          const libraryRiskScenarioText = (item.name || '').toLowerCase().trim();
          return libraryRiskScenarioText && orgRiskScenarioTexts.has(libraryRiskScenarioText);
        })
        .map(item => item.id!)
        .filter((id): id is string | number => id !== undefined);
    } else if (itemType === 'assets' && orgItems.length > 0) {
      // For assets, match with org items by applicationName text
      const orgAssetNames = new Set(
        orgItems.map((orgItem: any) => (orgItem.applicationName || '').toLowerCase().trim())
      );

      // Match library items with org items by applicationName text
      itemsToSelect = items
        .filter(item => {
          const libraryAssetName = (item.name || '').toLowerCase().trim();
          return libraryAssetName && orgAssetNames.has(libraryAssetName);
        })
        .map(item => item.id!)
        .filter((id): id is string | number => id !== undefined);
    } else if (alreadyAddedIds.length > 0) {
      // For other item types or if alreadyAddedIds is provided, use direct ID matching
      itemsToSelect = items
        .filter(item => item.id && alreadyAddedIds.includes(item.id))
        .map(item => item.id!)
        .filter((id): id is string | number => id !== undefined);
    }
    
    if (itemsToSelect.length > 0) {
      setSelectedItems(itemsToSelect);
    }
    
    // Mark as initialized so we don't run this again
    setHasInitialized(true);
  }, [open, items, alreadyAddedIds, orgItems, itemType, hasInitialized]);

  const handleItemToggle = (itemId: string | number) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAdd = () => {
    const selectedItemObjects = items.filter(item => 
      item.id && selectedItems.includes(item.id)
    );
    
    // For processes, pass businessUnitId along with selected items
    if (itemType === 'processes') {
      onAdd({ items: selectedItemObjects, businessUnitId: selectedBusinessUnitId } as any);
    } else {
      onAdd(selectedItemObjects);
    }
    
    // Note: Don't clear selectedItems here - they will be reset when modal reopens
    // This way, if the user opens the modal again, previously added items are pre-selected
    setSearchTerm("");
    onClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    setExpandedDescriptions(new Set());
    // Note: selectedItems will be reset when modal opens next time
    onClose();
  };

  const toggleDescription = (itemId: string | number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredItems
      .map(item => item.id)
      .filter((id): id is number => id !== undefined);
    const allSelected = allFilteredIds.every(id => selectedItems.includes(id));

    if (allSelected) {
      // Deselect all filtered items
      setSelectedItems(prev => prev.filter(id => !allFilteredIds.includes(id as number)));
    } else {
      // Select all filtered items
      setSelectedItems(prev => [...new Set([...prev, ...allFilteredIds])]);
    }
  };

  // Filter items based on search term
  const filteredItems = items.filter(item => {
    // Only include items with valid IDs
    if (!item.id) return false;
    
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Get display fields based on item type
  const getDisplayFields = (item: LibraryItem) => {
    switch (itemType) {
      case 'risk-scenarios':
        return {
          title: item.name,
          description: `Description: ${item.description}`
        };
      case 'processes':
        return {
          title: item.name,
          description: `Description: ${item.description}`
        };
      case 'assets':
        return {
          title: item.name,
          description: `Description: ${item.description}`
        };
      case 'controls':
        return {
          title: item.name,
          description: `Description: ${item.description}`
        };
      case 'threats':
        return {
          title: item.name,
          description: `Description: ${item.description}`
        };
      default:
        return {
          title: item.name,
          description: `Description: ${item.description}`
        };
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "8px",
            maxWidth: "1200px",
            maxHeight: "80vh",
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 3,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E7E7E8",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#484848",
            fontSize: "18px",
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {itemType === 'processes' && (
            <>
              {loadingBusinessUnits ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 180 }}>
                  <CircularProgress size={16} sx={{ color: "#04139A" }} />
                  <Typography variant="body2" sx={{ fontSize: "12px", color: "#484848" }}>
                    Loading...
                  </Typography>
                </Box>
              ) 
              // : businessUnits.length === 0 ? (
              //   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              //     <Typography variant="body2" sx={{ fontSize: "12px", color: "#484848" }}>
              //       Create business unit to select process
              //     </Typography>
              //     <Button
              //       onClick={() => {
              //         if (orgId && typeof orgId === 'string') {
              //           onClose();
              //           router.push(`/orgManagement/${orgId}?tab=2`);
              //         }
              //       }}
              //       variant="contained"
              //       size="small"
              //       sx={{
              //         borderRadius: "4px",
              //         backgroundColor: "#04139A",
              //         color: "#FFFFFF",
              //         textTransform: "none",
              //         fontWeight: 500,
              //         fontSize: "12px",
              //         px: 2,
              //         py: 0.5,
              //         "&:hover": {
              //           backgroundColor: "#030d6b",
              //         },
              //       }}
              //     >
              //       Go to Business Units
              //     </Button>
              //   </Box>
              // ) 
              : (
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 180,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                      backgroundColor: "#FFFFFF",
                      fontSize: "12px",
                      height: "32px",
                      "& fieldset": {
                        borderColor: "#E7E7E8",
                      },
                      "&:hover fieldset": {
                        borderColor: "#04139A",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#04139A",
                      },
                    },
                  }}
                >
                  <InputLabel
                    id="business-unit-label"
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#484848",
                      "&.Mui-focused": {
                        color: "#04139A",
                      },
                    }}
                  >
                    Business Unit
                  </InputLabel>
                  <Select
                    labelId="business-unit-label"
                    value={selectedBusinessUnitId}
                    onChange={(e) => setSelectedBusinessUnitId(e.target.value as string)}
                    label="Business Unit"
                    disabled={loadingBusinessUnits}
                    sx={{
                      fontSize: "12px",
                      "& .MuiSelect-select": {
                        py: 0.5,
                        px: 1.5,
                      },
                    }}
                    renderValue={(val) => {
                      if (!val) return "Select Business Unit";
                      const bu = businessUnits.find((b) => b.id === val);
                      return bu?.businessUnitName || "Select Business Unit";
                    }}
                  >
                    <MenuItem value="">
                      <Typography variant="body2" sx={{ fontSize: "12px", color: "#9E9FA5" }}>
                        Select Business Unit
                      </Typography>
                    </MenuItem>
                    {businessUnits.map((bu) => (
                      <MenuItem key={bu.id} value={bu.id}>
                        <Typography variant="body2" sx={{ fontSize: "12px" }}>
                          {bu.businessUnitName}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}
          <Button
            onClick={handleSelectAll}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: "4px",
              borderColor: "#04139A",
              color: "#04139A",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "12px",
              px: 2,
              py: 0.5,
              "&:hover": {
                borderColor: "#030d6b",
                backgroundColor: "rgba(4, 19, 154, 0.1)",
              },
            }}
          >
            {filteredItems.length > 0 &&
              filteredItems.every(item => item.id && selectedItems.includes(item.id!))
              ? "Deselect All"
              : "Select All"}
          </Button>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#04139A",
              "&:hover": {
                backgroundColor: "rgba(4, 19, 154, 0.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          p: 3,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        {/* Search */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, position: "relative" }}>
          <TextField
            fullWidth
            placeholder="Search by keywords"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#91939A" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                backgroundColor: "#FFFFFF",
                "& fieldset": {
                  borderColor: "#E7E7E8",
                },
                "&:hover fieldset": {
                  borderColor: "#04139A",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#04139A",
                },
              },
            }}
          />
        </Box>

        {/* Items Grid */}
        {
        // itemType === 'processes' && !loadingBusinessUnits && businessUnits.length === 0 ? (
        //   <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, gap: 2 }}>
        //     <Typography variant="body1" sx={{ fontSize: "14px", color: "#484848", textAlign: "center" }}>
        //       No business units available. Please create a business unit to select processes.
        //     </Typography>
        //     <Button
        //       onClick={() => {
        //         if (orgId && typeof orgId === 'string') {
        //           onClose();
        //           router.push(`/orgManagement/${orgId}?tab=2`);
        //         }
        //       }}
        //       variant="contained"
        //       sx={{
        //         borderRadius: "4px",
        //         backgroundColor: "#04139A",
        //         color: "#FFFFFF",
        //         textTransform: "none",
        //         fontWeight: 500,
        //         fontSize: "14px",
        //         px: 3,
        //         py: 1,
        //         "&:hover": {
        //           backgroundColor: "#030d6b",
        //         },
        //       }}
        //     >
        //       Go to Business Units
        //     </Button>
        //   </Box>
        // ) : 
        loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress sx={{ color: "#04139A" }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {filteredItems.map((item) => {
              const itemId = item.id!; // We know it's defined after filtering
              const displayFields = getDisplayFields(item);
              const isExpanded = expandedDescriptions.has(itemId);
              const descriptionText = displayFields.description;
              // Remove "Description: " prefix if present to get actual description
              const actualDescription = descriptionText.replace(/^Description:\s*/i, "");
              // Show toggle if description is longer than approximately 80 characters (roughly 2 lines at 14px)
              const shouldShowToggle = actualDescription.trim().length > 80;
              
              return (
                <Grid size={{ xs: 12, sm: 6 }} key={itemId}>
                  <Box
                    sx={{
                      border: "1px solid #E7E7E8",
                      borderLeft: "4px solid #04139A",
                      borderRadius: "8px",
                      p: 2,
                      backgroundColor: "#FFFFFF",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        borderColor: "#04139A",
                        backgroundColor: "rgba(4, 19, 154, 0.02)",
                      },
                    }}
                    onClick={(e) => {
                      // Only handle card clicks that don't originate from interactive elements
                      const isClickOnInteractiveElement = (e.target as HTMLElement).closest(
                        'input, button, label, .MuiFormControlLabel-root'
                      ) !== null;
                      
                      if (!isClickOnInteractiveElement) {
                        handleItemToggle(itemId);
                      }
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedItems.includes(itemId)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleItemToggle(itemId);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: "#04139A",
                            "&.Mui-checked": {
                              color: "#04139A",
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: "20px",
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ ml: 1, flex: 1, display: "flex", flexDirection: "column" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#484848",
                              fontSize: "14px",
                              lineHeight: "20px",
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            {displayFields.title}
                          </Typography>
                          <Box sx={{ position: "relative", display: "inline", width: "100%" }}>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                color: "#484848",
                                fontSize: "14px",
                                lineHeight: "20px",
                                fontWeight: 400,
                                overflow: isExpanded ? "visible" : "hidden",
                                display: isExpanded ? "inline" : "-webkit-box",
                                WebkitLineClamp: isExpanded ? undefined : 2,
                                WebkitBoxOrient: isExpanded ? undefined : "vertical",
                                textOverflow: isExpanded ? "clip" : "ellipsis",
                                maxHeight: isExpanded ? "none" : "40px", // 2 lines * 20px line-height
                                wordBreak: "break-word",
                                verticalAlign: "baseline",
                              }}
                            >
                              {descriptionText}
                            </Typography>
                            {shouldShowToggle && (
                              <Button
                                component="span"
                                onClick={(e) => toggleDescription(itemId, e)}
                                sx={{
                                  textTransform: "none",
                                  color: "#04139A",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  p: 0,
                                  minWidth: 0,
                                  ml: 0.5,
                                  whiteSpace: "nowrap",
                                  verticalAlign: "baseline",
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {isExpanded ? "View less" : "View more"}
                              </Button>
                            )}
                          </Box>
                        </Box>
                      }
                      sx={{
                        alignItems: "flex-start",
                        m: 0,
                        width: "100%",
                        "& .MuiFormControlLabel-label": {
                          flex: 1,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          p: 3,
          justifyContent: "flex-end",
          gap: 3,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: "4px",
            borderColor: "#04139A",
            color: "#04139A",
            textTransform: "none",
            fontWeight: 500,
            p: "12px 40px",
            "&:hover": {
              borderColor: "#030d6b",
              backgroundColor: "rgba(4, 19, 154, 0.1)",
            },
          }}
        >
          Cancel
        </Button>
        <Tooltip
          title={itemType === 'processes' && !selectedBusinessUnitId ? "Business unit not selected" : ""}
          arrow
          placement="top"
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: "#E7E7E8",
                color: "#04139A",
                fontSize: "12px",
                fontWeight: 500,
                padding: "8px 12px",
                borderRadius: "4px",
                "& .MuiTooltip-arrow": {
                  color: "#E7E7E8",
                },
              },
            },
          }}
        >
          <span>
            <Button
              onClick={handleAdd}
              variant="contained"
              disabled={selectedItems.length === 0 || (itemType === 'processes' && !selectedBusinessUnitId)}
              sx={{
                borderRadius: "4px",
                backgroundColor: "#04139A",
                color: "#FFFFFF",
                textTransform: "none",
                fontWeight: 500,
                p: "12px 40px",
                "&:hover": {
                  backgroundColor: "#030d6b",
                },
                "&:disabled": {
                  backgroundColor: "#E7E7E8",
                  color: "#91939A",
                },
              }}
            >
              Add
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default AddLibraryItemsModal;