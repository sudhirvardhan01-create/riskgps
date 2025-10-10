import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import Image from "next/image";
import CreateBusinessUnitForm from "./CreateBusinessUnitForm";
import BusinessUnitCard from "./BusinessUnitCard";
import BusinessUnitDetailsModal from "./BusinessUnitDetailsModal";
import ToastComponent from "../../ToastComponent";
import { Add as AddIcon } from "@mui/icons-material";

interface BusinessUnitFormData {
  businessUnitName: string;
  buHead: { name: string; email: string };
  buPocBiso: { name: string; email: string };
  buItPoc: { name: string; email: string };
  buFinanceLead: { name: string; email: string };
  tags: { key: string; value: string }[];
}

interface BusinessUnitData {
  id: string;
  businessUnitName: string;
  buCode: string;
  buSize: number;
  assessments: number;
  tags: { key: string; value: string }[];
  status: "active" | "disable";
  lastUpdated?: string;
  // Contact roles
  buHead?: { name: string; email: string };
  buPocBiso?: { name: string; email: string };
  buItPoc?: { name: string; email: string };
  buFinanceLead?: { name: string; email: string };
}

const BusinessUnits: React.FC = () => {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<BusinessUnitData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<BusinessUnitFormData | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Mock data for business units - replace with actual API call
  // To test empty state, change this to an empty array: []
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([
    {
      id: "1",
      businessUnitName: "Retail Banking",
      buCode: "BU283692",
      buSize: 33,
      assessments: 0,
      tags: [
        { key: "department", value: "Banking" },
        { key: "location", value: "Main Campus" },
        { key: "priority", value: "High" },
      ],
      status: "active",
      lastUpdated: "2024-01-15",
      buHead: {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@hospital.com",
      },
      buPocBiso: { name: "Mike Chen", email: "mike.chen@abc.com" },
      buItPoc: { name: "Lisa Wang", email: "lisa.wang@abc.com" },
      buFinanceLead: {
        name: "Robert Davis",
        email: "robert.davis@abc.com",
      },
    },
    {
      id: "2",
      businessUnitName: "Loan Services",
      buCode: "BU283693",
      buSize: 25,
      assessments: 0,
      tags: [
        { key: "department", value: "Loan" },
        { key: "location", value: "Headquarters" },
        { key: "priority", value: "Critical" },
      ],
      status: "active",
      lastUpdated: "2024-01-15",
      buHead: {
        name: "Dr. Michael Brown",
        email: "michael.brown@abc.com",
      },
      buPocBiso: { name: "Jennifer Lee", email: "jennifer.lee@abc.com" },
      buItPoc: { name: "David Kim", email: "david.kim@abc.com" },
      buFinanceLead: {
        name: "Amanda Wilson",
        email: "amanda.wilson@abc.com",
      },
    },
    {
      id: "3",
      businessUnitName: "Investor Services",
      buCode: "BU283694",
      buSize: 45,
      assessments: 0,
      tags: [
        { key: "department", value: "Wealth" },
        { key: "location", value: "Headquarters" },
        { key: "priority", value: "Medium" },
      ],
      status: "active",
      lastUpdated: "2024-01-15",
      buHead: { name: "Dr. Emily Taylor", email: "emily.taylor@abc.com" },
      buPocBiso: {
        name: "James Rodriguez",
        email: "james.rodriguez@abc.com",
      },
      buItPoc: { name: "Maria Garcia", email: "maria.garcia@abc.com" },
      buFinanceLead: {
        name: "Kevin Thompson",
        email: "kevin.thompson@abc.com",
      },
    },
  ]);

  const handleCreateBusinessUnit = () => {
    setIsEditMode(false);
    setEditData(null);
    setIsCreateFormOpen(true);
  };

  const handleFormSubmit = (data: BusinessUnitFormData) => {
    // TODO: Implement API call to create/update business unit
    console.log("Business Unit Data:", data);

    if (isEditMode && selectedBusinessUnit) {
      // Update existing business unit
      setBusinessUnits((prev) =>
        prev.map((bu) =>
          bu.id === selectedBusinessUnit.id
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
      // Create new business unit from form data
      const newBusinessUnit: BusinessUnitData = {
        id: Date.now().toString(),
        businessUnitName: data.businessUnitName,
        buCode: `BU${Math.floor(Math.random() * 1000000)}`,
        buSize: 0, // This would come from the form or be calculated
        assessments: 0,
        tags: data.tags,
        status: "active",
        lastUpdated: new Date().toISOString().split("T")[0],
        buHead: data.buHead,
        buPocBiso: data.buPocBiso,
        buItPoc: data.buItPoc,
        buFinanceLead: data.buFinanceLead,
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
  };

  const handleFormClose = () => {
    setIsCreateFormOpen(false);
    setIsEditMode(false);
    setEditData(null);
  };

  const handleEditBusinessUnit = (businessUnit: BusinessUnitData) => {
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

    setSelectedBusinessUnit(businessUnit);
    setEditData(formData);
    setIsEditMode(true);
    setIsCreateFormOpen(true);
  };

  const handleBusinessUnitClick = (businessUnit: BusinessUnitData) => {
    setSelectedBusinessUnit(businessUnit);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedBusinessUnit(null);
  };

  const handleToastClose = () => {
    setShowSuccessToast(false);
    setSuccessMessage("");
  };

  const handleStatusChange = (id: string, status: "active" | "disable") => {
    setBusinessUnits((prev) =>
      prev.map((bu) => (bu.id === id ? { ...bu, status } : bu))
    );

    // Update selectedBusinessUnit if it's the one being changed
    if (selectedBusinessUnit && selectedBusinessUnit.id === id) {
      setSelectedBusinessUnit((prev) => (prev ? { ...prev, status } : null));
    }
  };

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
              src={"/create-bu.png"}
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
    </Box>
  );
};

export default BusinessUnits;
