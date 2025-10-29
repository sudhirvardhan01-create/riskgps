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
} from "@mui/material";
import {
  Close,
  Search,
} from "@mui/icons-material";

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
}

const AddLibraryItemsModal: React.FC<AddLibraryItemsModalProps> = ({
  open,
  onClose,
  onAdd,
  title,
  service,
  itemType,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await service.fetch(0, 6, searchTerm, "id:asc");
      setItems(response.data);
    } catch (err) {
      setError(`Failed to fetch ${itemType}. Please try again.`);
      console.error(`Error fetching ${itemType}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debouncing and initial fetch when modal opens
  useEffect(() => {
    if (!open) return;

    const timeoutId = setTimeout(() => {
      fetchItems();
    }, searchTerm ? 500 : 0); // No delay for initial fetch, 500ms debounce for search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, open]);

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
    onAdd(selectedItemObjects);
    setSelectedItems([]);
    setSearchTerm("");
    onClose();
  };

  const handleClose = () => {
    setSelectedItems([]);
    setSearchTerm("");
    onClose();
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
        {loading ? (
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
                      "&:hover": {
                        borderColor: "#04139A",
                        backgroundColor: "rgba(4, 19, 154, 0.02)",
                      },
                    }}
                    onClick={() => handleItemToggle(itemId)}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedItems.includes(itemId)}
                          onChange={() => handleItemToggle(itemId)}
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
                        <Box sx={{ ml: 1 }}>
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
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#484848",
                              fontSize: "14px",
                              lineHeight: "20px",
                              fontWeight: 400,
                            }}
                          >
                            {displayFields.description}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        alignItems: "flex-start",
                        m: 0,
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
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={selectedItems.length === 0}
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
      </DialogActions>
    </Dialog>
  );
};

export default AddLibraryItemsModal;