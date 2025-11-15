import { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import OrgManagementHeader from "@/components/Organization/OrgManagementHeader";
import OrgList from "@/components/Organization/OrgList";
import { Organization } from "@/types/organization";
import { getOrganizations, transformApiResponseToFrontend, deleteOrganization } from "@/services/organizationService";
import Cookies from "js-cookie";


export default function OrgManagementContainer() {
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState<string>("created_date");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchPattern, setSearchPattern] = useState<string>("");
  const [organizationsData, setOrganizationsData] = useState<Organization[]>([]);

  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  // modals / confirm / toast
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });


  // fetch list
  const loadList = useCallback(async () => {
    try {
      // When filtering by status, we need to fetch all data and do client-side pagination
      // Otherwise, use server-side pagination
      if (statusFilter && statusFilter !== "all") {
        // Fetch all data for client-side filtering and pagination
        const apiResponse = await getOrganizations(0, 1000, searchPattern, sortField, sortDirection.toUpperCase());
        const transformedData = transformApiResponseToFrontend(apiResponse);

        // Apply client-side filtering for status
        let filteredData = transformedData.organizations;
        // Show organizations with specific status
        filteredData = filteredData.filter(org => org.status === statusFilter);

        // Apply client-side pagination
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setOrganizationsData(paginatedData);
        setTotalRows(filteredData.length);
      } else {
        // Use server-side pagination when no status filter is applied
        const apiResponse = await getOrganizations(page, rowsPerPage, searchPattern, sortField, sortDirection.toUpperCase());
        const transformedData = transformApiResponseToFrontend(apiResponse);

        setOrganizationsData(transformedData.organizations);
        setTotalRows(transformedData.total);
      }
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to fetch organizations",
        severity: "error",
      });
    }
  }, [page, rowsPerPage, searchPattern, sortField, sortDirection, statusFilter]);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger]);


  // Org Delete function
  const handleDelete = async () => {
    try {
      if (!selectedOrganization?.id) throw new Error("Invalid selection");

      // Get current user ID from cookies
      const userCookie = Cookies.get("user");
      if (!userCookie) {
        throw new Error("User not found. Please login again.");
      }
      
      const user = JSON.parse(userCookie)
      const userId = user.id;
      if (!userId) {
        throw new Error("User ID not found. Please login again.");
      }

      // Call the soft delete API
      await deleteOrganization(selectedOrganization.id, userId);

      setIsDeleteConfirmOpen(false);
      setSelectedOrganization(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Organization ${selectedOrganization?.name} deleted successfully`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: err instanceof Error ? err.message : "Failed to delete organization",
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
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(0); // Reset to first page when filtering
  };

  const handleSearchChange = (val: string) => {
    setSearchPattern(val);
  };

  const handleEditOrganization = (organization: Organization) => {
    router.push(`/orgManagement/${organization.orgId}/editOrgDetails`);
  };

  return (
    <>
      {/* Org Delete Confirm dialogs */}
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
      <Box
        sx={{
          pt: 5,
          px: 5,
          pb: 2,
          height: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <OrgManagementHeader
          onAddOrg={() => {
            router.push("/orgManagement/create");
          }}
          localSearch={searchPattern}
          handleSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          handleStatusChange={handleStatusChange}
        />

        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <OrgList
            data={organizationsData}
            totalRows={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            setSelectedOrganization={setSelectedOrganization}
            setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            onEditOrganization={handleEditOrganization}
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
