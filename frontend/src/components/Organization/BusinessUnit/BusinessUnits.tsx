import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import CreateBusinessUnitForm from "./CreateBusinessUnitForm";
import BusinessUnitCard from "./BusinessUnitCard";
import BusinessUnitDetailsModal from "./BusinessUnitDetailsModal";
import ToastComponent from "../../ToastComponent";
import { Add as AddIcon } from "@mui/icons-material";
import { getBusinessUnits, createBusinessUnit, updateBusinessUnit } from "@/services/businessUnitService";
import { BusinessUnitFormData, BusinessUnitData } from "@/types/business-unit";

const BusinessUnits: React.FC = () => {
  const router = useRouter();
  const { orgId } = router.query;
  
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<BusinessUnitData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<BusinessUnitFormData | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for business units from API
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([]);
  
  // Ref to track when we're entering edit mode (to avoid React state batching issues)
  const isEnteringEditModeRef = useRef(false);

  // Fetch business units from API
  useEffect(() => {
    const fetchBusinessUnits = async () => {
      if (!orgId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getBusinessUnits(orgId as string);
        setBusinessUnits(data);
      } catch (err) {
        console.error("Error fetching business units:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch business units");
        // Keep empty array for empty state
        setBusinessUnits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessUnits();
  }, [orgId]);

  const handleCreateBusinessUnit = () => {
    isEnteringEditModeRef.current = false;
    setIsEditMode(false);
    setEditData(null);
    setIsCreateFormOpen(true);
  };

  const handleFormSubmit = async (data: BusinessUnitFormData) => {
    // Store current edit state before any async operations
    const currentEditMode = isEditMode;
    const currentSelectedBusinessUnit = selectedBusinessUnit;
    
    console.log('Form submitted. isEditMode:', currentEditMode, 'selectedBusinessUnit:', currentSelectedBusinessUnit?.id);
    if (!orgId) {
      setError("Organization ID is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current user ID from cookies
      const user = JSON.parse(Cookies.get("user") ?? "{}");
      const userId = user.id;
      
      if (!userId) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      if (currentEditMode && currentSelectedBusinessUnit) {
        // Update existing business unit
        console.log('Updating business unit with ID:', currentSelectedBusinessUnit.id);
        await updateBusinessUnit(currentSelectedBusinessUnit.id, {
          name: data.businessUnitName,
          tags: data.tags,
          head: data.buHead,
          pocBiso: data.buPocBiso,
          itPoc: data.buItPoc,
          financeLead: data.buFinanceLead,
          modifiedBy: userId,
        });

        // Update local state
        setBusinessUnits((prev) =>
          prev.map((bu) =>
            bu.id === currentSelectedBusinessUnit.id
              ? {
                  ...bu,
                  businessUnitName: data.businessUnitName,
                  buHead: data.buHead,
                  buPocBiso: data.buPocBiso,
                  buItPoc: data.buItPoc,
                  buFinanceLead: data.buFinanceLead,
                  tags: data.tags,
                  lastUpdated: new Date().toISOString().split("T")[0],
                }
              : bu
          )
        );
        setSuccessMessage(
          `${data.businessUnitName} Business Unit has been updated`
        );
      } else {
        // Create new business unit
        console.log('Creating new business unit');
        const response = await createBusinessUnit(orgId as string, {
          name: data.businessUnitName,
          tags: data.tags,
          head: data.buHead,
          pocBiso: data.buPocBiso,
          itPoc: data.buItPoc,
          financeLead: data.buFinanceLead,
          createdBy: userId,
          status: "active"
        });

        // Add new business unit to local state
        const newBusinessUnit: BusinessUnitData = {
          id: response.data.orgBusinessUnitId,
          businessUnitName: response.data.name,
          buCode: `BU${Math.floor(Math.random() * 1000000)}`, // Generate random BU code
          buSize: 0, // Default size
          assessments: 0, // Default assessments
          tags: response.data.tags || [],
          status: "active", // Default status
          lastUpdated: response.data.modifiedDate,
          buHead: response.data.head,
          buPocBiso: response.data.pocBiso,
          buItPoc: response.data.itPoc,
          buFinanceLead: response.data.financeLead,
        };

        setBusinessUnits((prev) => [...prev, newBusinessUnit]);
        setSuccessMessage(
          `${data.businessUnitName} Business Unit has been created`
        );
      }

      // Show success notification
      setShowSuccessToast(true);
      setIsCreateFormOpen(false);
      setIsEditMode(false);
      setEditData(null);
      setSelectedBusinessUnit(null);
    } catch (err) {
      console.error("Error saving business unit:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to save business unit";
      setError(errorMsg);
      setErrorMessage(errorMsg);
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    console.log('Form closing. Resetting edit mode and selected business unit');
    isEnteringEditModeRef.current = false;
    setIsCreateFormOpen(false);
    setIsEditMode(false);
    setEditData(null);
    setSelectedBusinessUnit(null);
  };

  const handleEditBusinessUnit = (businessUnit: BusinessUnitData) => {
    console.log('Edit business unit clicked for:', businessUnit.businessUnitName, 'with ID:', businessUnit.id);
    // Convert BusinessUnitData to BusinessUnitFormData for editing
    const formData: BusinessUnitFormData = {
      businessUnitName: businessUnit.businessUnitName,
      buHead: businessUnit.buHead || { name: "", email: "" },
      buPocBiso: businessUnit.buPocBiso || { name: "", email: "" },
      buItPoc: businessUnit.buItPoc || { name: "", email: "" },
      buFinanceLead: businessUnit.buFinanceLead || { name: "", email: "" },
      tags:
        businessUnit.tags.length > 0
          ? businessUnit.tags
          : [{ key: "", value: "" }],
    };

    console.log('Setting edit mode with business unit:', businessUnit);
    // Set ref to indicate we're entering edit mode (before state updates)
    isEnteringEditModeRef.current = true;
    // Set all edit state
    setSelectedBusinessUnit(businessUnit);
    setEditData(formData);
    setIsEditMode(true);
    setIsCreateFormOpen(true);
    // Close the details modal after state is set
    setTimeout(() => {
      setIsDetailsModalOpen(false);
      // Reset the ref after a short delay to ensure form is open
      setTimeout(() => {
        isEnteringEditModeRef.current = false;
      }, 100);
    }, 0);
  };

  const handleBusinessUnitClick = (businessUnit: BusinessUnitData) => {
    setSelectedBusinessUnit(businessUnit);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    // Don't reset selectedBusinessUnit if we're entering edit mode
    // Check both the ref (for immediate access) and isCreateFormOpen (for delayed closes)
    if (!isEnteringEditModeRef.current && !isCreateFormOpen) {
      setSelectedBusinessUnit(null);
    }
  };

  const handleToastClose = () => {
    setShowSuccessToast(false);
    setSuccessMessage("");
  };

  const handleErrorToastClose = () => {
    setShowErrorToast(false);
    setErrorMessage("");
  };

  const handleStatusChange = async (id: string, status: "active" | "disable") => {
    try {
      // Get current user ID from cookies
      const user = JSON.parse(Cookies.get("user") ?? "{}");
      const userId = user.id;
      
      if (!userId) {
        setError("User ID not found. Please login again.");
        setErrorMessage("User ID not found. Please login again.");
        setShowErrorToast(true);
        return;
      }

      // Find the business unit to get its current data
      const businessUnit = businessUnits.find(bu => bu.id === id);
      if (!businessUnit) {
        setError("Business unit not found.");
        setErrorMessage("Business unit not found.");
        setShowErrorToast(true);
        return;
      }

      // Call API to update business unit with current data and status
      await updateBusinessUnit(id, {
        name: businessUnit.businessUnitName,
        head: businessUnit.buHead,
        pocBiso: businessUnit.buPocBiso,
        itPoc: businessUnit.buItPoc,
        financeLead: businessUnit.buFinanceLead,
        tags: businessUnit.tags,
        status: status,
        modifiedBy: userId,
      });

      // Update local state only after successful API call
      setBusinessUnits((prev) =>
        prev.map((bu) => (bu.id === id ? { ...bu, status } : bu))
      );

      // Update selectedBusinessUnit if it's the one being changed
      if (selectedBusinessUnit && selectedBusinessUnit.id === id) {
        setSelectedBusinessUnit((prev) => (prev ? { ...prev, status } : null));
      }

      // Show success message
      setSuccessMessage(`Business Unit status updated to ${status}`);
      setShowSuccessToast(true);
    } catch (err) {
      console.error("Error updating business unit status:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to update business unit status";
      setError(errorMsg);
      setErrorMessage(errorMsg);
      setShowErrorToast(true);
    }
  };

  // Show loading state
  if (loading && businessUnits.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        pt: 2, pl: 3, pr: 3, pb: 3 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error && businessUnits.length === 0) {
    return (
      <Box sx={{ pt: 2, pl: 3, pr: 3, pb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
            py: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: "#d32f2f",
              mb: 2,
            }}
          >
            Error loading business units: {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              backgroundColor: "#04139A",
              color: "#F4F4F4",
              fontWeight: 600,
              textTransform: "none",
              p: "12px 40px",
              borderRadius: "4px",
              minWidth: "229px",
              height: "40px",
              "&:hover": {
                backgroundColor: "#04139A",
              },
            }}
          >
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 2, pl: 3, pr: 3, pb: 3 }}>
      {businessUnits.length === 0 ? (
        // Empty state when no business units exist
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
            py: 2,
          }}
        >
          {/* Placeholder Icon */}
          <Box
            sx={{
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Image
              src={"/create.png"}
              alt="org-image"
              width={120}
              height={120}
            />
          </Box>

          {/* Main message */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: "#484848",
              mb: 2,
            }}
          >
            Looks like you haven&apos;t created any Business Units yet. <br />
            Click on &apos;Create Business Unit&apos; to start organizing your
            units and streamline your operations.
          </Typography>

          {/* Create Business Unit Button */}
          <Button
            variant="contained"
            onClick={handleCreateBusinessUnit}
            sx={{
              backgroundColor: "#04139A",
              color: "#F4F4F4",
              fontWeight: 600,
              textTransform: "none",
              p: "12px 40px",
              borderRadius: "4px",
              minWidth: "229px",
              height: "40px",
              "&:hover": {
                backgroundColor: "#04139A",
              },
              "&:focus": {
                backgroundColor: "#04139A",
              },
            }}
          >
            Create Business Unit
          </Button>
        </Box>
      ) : (
        // Display business unit cards when business units exist
        <Box>
          {/* Header with Create Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                color: "#04139A",
                fontSize: "14px",
                fontWeight: 500,
              }}
              onClick={handleCreateBusinessUnit}
            >
              <AddIcon sx={{ fontSize: 16 }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "inherit" }}
              >
                Create Business Unit
              </Typography>
            </Box>
          </Box>

          {/* Business Unit Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              "@media (max-width: 768px)": {
                gridTemplateColumns: "1fr",
              },
              mb: 4
            }}
          >
            {businessUnits.map((businessUnit) => (
              <BusinessUnitCard
                key={businessUnit.id}
                businessUnit={businessUnit}
                onEdit={handleEditBusinessUnit}
                onStatusChange={handleStatusChange}
                onClick={handleBusinessUnitClick}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Create Business Unit Form Modal */}
      <CreateBusinessUnitForm
        open={isCreateFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editData={editData || undefined}
        isEditMode={isEditMode}
      />

      {/* Business Unit Details Modal */}
      <BusinessUnitDetailsModal
        open={isDetailsModalOpen}
        onClose={handleDetailsModalClose}
        businessUnit={selectedBusinessUnit}
        onEdit={handleEditBusinessUnit}
        onStatusChange={handleStatusChange}
      />

      {/* Success Toast Notification */}
      <ToastComponent
        open={showSuccessToast}
        message={successMessage}
        onClose={handleToastClose}
        toastSeverity="success"
        toastBorder="1px solid #4CAF50"
        toastColor="#2E7D32"
        toastBackgroundColor="#E8F5E8"
      />

      {/* Error Toast Notification */}
      <ToastComponent
        open={showErrorToast}
        message={errorMessage}
        onClose={handleErrorToastClose}
        toastSeverity="error"
        toastBorder="1px solid #f44336"
        toastColor="#d32f2f"
        toastBackgroundColor="#ffebee"
      />
    </Box>
  );
};

export default BusinessUnits;
