import { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import OrgList from "@/components/Organization/OrgList";
import { Organization, OrganizationForm } from "@/types/organization";

// Mock data for organizations
const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "MediCare Health",
    orgId: "ORG100001",
    orgImage: "/orgImage.png",
    tags: {
      industry: "Healthcare",
      size: "Small (< 500 Employees)"
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
      additionalCount: 3
    },
    businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
    status: "active",
    lastUpdated: "2024-01-15"
  },
  {
    id: "2",
    name: "FinTech Comp",
    orgId: "ORG100002",
    orgImage: "/orgImage.png",
    tags: {
      industry: "Healthcare",
      size: "Small (< 500 Employees)"
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
      additionalCount: 3
    },
    businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
    status: "active",
    lastUpdated: "2024-01-15"
  },
  {
    id: "3",
    name: "EduSmart Global",
    orgId: "ORG100003",
    orgImage: "/orgImage.png",
    tags: {
      industry: "Healthcare",
      size: "Small (< 500 Employees)"
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
      additionalCount: 3
    },
    businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
    status: "active",
    lastUpdated: "2024-01-15"
  },
  {
    id: "4",
    name: "Green Energy",
    orgId: "SH23978749",
    orgImage: "/orgImage.png",
    tags: {
      industry: "Healthcare",
      size: "Small (< 500 Employees)"
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
      additionalCount: 3
    },
    businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
    status: "active",
    lastUpdated: "2024-01-15"
  },
  {
    id: "5",
    name: "ABC Company",
    orgId: "ORG100001",
    orgImage: "/orgImage.png",
    tags: {
      industry: "Healthcare",
      size: "Small (< 500 Employees)"
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
      additionalCount: 3
    },
    businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
    status: "disabled",
    lastUpdated: "2024-01-15"
  }
];

export default function OrgManagementContainer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sort, setSort] = useState<string>("name:asc");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchPattern, setSearchPattern] = useState<string>("");
  const [organizationsData, setOrganizationsData] = useState<Organization[]>([]);

  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  // modals / confirm / toast
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [localSearch, setLocalSearch] = useState(searchPattern);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const [formData, setFormData] = useState<OrganizationForm>({
    name: "",
    orgId: "",
    industry: "",
    size: "",
    businessUnits: [],
    members: [],
  });

  // fetch list
  const loadList = useCallback(async () => {
    try {
      setLoading(true);

      // Use mock data with client-side filtering
      let filteredData = [...mockOrganizations];

      // Apply search filter
      if (searchPattern) {
        filteredData = filteredData.filter(org =>
          org.name.toLowerCase().includes(searchPattern.toLowerCase()) ||
          org.orgId.toLowerCase().includes(searchPattern.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter && statusFilter !== "all") {
        filteredData = filteredData.filter(org =>
          org.status === statusFilter
        );
      }

      // Apply sorting
      filteredData.sort((a, b) => {
        const [field, direction] = sort.split(':');
        const aValue = field === 'name' ? a.name : field === 'orgId' ? a.orgId : '';
        const bValue = field === 'name' ? b.name : field === 'orgId' ? b.orgId : '';

        if (direction === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });

      // Apply pagination
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setOrganizationsData(paginatedData);
      setTotalRows(filteredData.length);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to fetch organizations",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchPattern, sort, statusFilter]);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger]);

  // Update status only
  // const handleUpdateStatus = async (id: string, status: string) => {
  //   try {
  //     // Simulate API call for demo purposes
  //     await new Promise(resolve => setTimeout(resolve, 300));
  //     setRefreshTrigger((p) => p + 1);
  //     setToast({
  //       open: true,
  //       message: "Status updated successfully",
  //       severity: "success"
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     setToast({
  //       open: true,
  //       message: "Failed to update status",
  //       severity: "error",
  //     });
  //   }
  // };

  // Delete
  const handleDelete = async () => {
    try {
      if (!selectedOrganization?.id) throw new Error("Invalid selection");

      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 300));

      setIsDeleteConfirmOpen(false);
      setSelectedOrganization(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Deleted ${selectedOrganization?.name}`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to delete organization",
        severity: "error",
      });
    }
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      setSort(`${field}:${newDirection}`);
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
      setSort(`${field}:asc`);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(0); // Reset to first page when filtering
  };

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    // setSearchPattern?.(val);
  };

  return (
    <>
      {/* Add form modal - placeholder for now */}
      {isAddOpen && (
        <Box>
          {/* TODO: Implement Add Organization Modal */}
        </Box>
      )}

      {/* Edit form modal - placeholder for now */}
      {isEditOpen && selectedOrganization && (
        <Box>
          {/* TODO: Implement Edit Organization Modal */}
        </Box>
      )}

      {/* View modal - placeholder for now */}
      {selectedOrganization && isViewOpen && (
        <Box>
          {/* TODO: Implement View Organization Modal */}
        </Box>
      )}

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={isAddConfirmOpen}
        onClose={() => setIsAddConfirmOpen(false)}
        title="Cancel Organization Creation?"
        description="Are you sure you want to cancel the organization creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmOpen(false);
          setFormData({
            name: "",
            orgId: "",
            industry: "",
            size: "",
            businessUnits: [],
            members: [],
          });
          setIsAddOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Organization Update?"
        description="Are you sure you want to cancel the organization update? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedOrganization(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Organization Deletion?"
        description={`Are you sure you want to delete ${selectedOrganization?.name}? All associated data will be removed from the system.`}
        onConfirm={handleDelete}
        cancelText="Cancel"
        confirmText="Yes, Delete"
      />

      {/* Page content */}
      <Box sx={{
        pt: 3,
        pr: 4,
        pb: 2,
        pl: 4,
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography
            sx={{ fontWeight: 600, fontSize: "24px", lineHeight: "130%", letterSpacing: "0px", color: "#121212" }}>
            Org Management
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#04139A",
              color: "#FFFFFF",
              borderRadius: "4px",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0%",
              padding: "12px 32px",
              "&:hover": {
                backgroundColor: "#04139A",
                opacity: 0.9,
              },
            }}
            onClick={() => {
              router.push('/org-management/create');
            }}
          >
            Create New Org
          </Button>
        </Box>

        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <OrgList
            data={organizationsData}
            totalRows={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            setSelectedOrganization={setSelectedOrganization}
            setIsViewOpen={setIsViewOpen}
            setIsEditOpen={setIsEditOpen}
            setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            localSearch={localSearch}
            handleSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            handleStatusChange={handleStatusChange}
          // handleUpdateStatus={handleUpdateStatus}
          />
        </Box>
      </Box>

      <ToastComponent
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        message={toast.message}
        toastBorder={
          toast.severity === "success" ? "1px solid #147A50" : undefined
        }
        toastColor={toast.severity === "success" ? "#147A50" : undefined}
        toastBackgroundColor={
          toast.severity === "success" ? "#DDF5EB" : undefined
        }
        toastSeverity={toast.severity}
      />
    </>
  );
}
