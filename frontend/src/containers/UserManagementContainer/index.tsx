import { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import { UserData } from "@/types/user";
import {
  getOrganizations,
  transformApiResponseToFrontend,
  deleteOrganization,
} from "@/services/organizationService";
import Cookies from "js-cookie";
import UserHeader from "@/components/UserManagement/UserHeader";
import UserTableHeader from "@/components/UserManagement/UserTableHeader";
import UserList from "@/components/UserManagement/UserList";
import { UserService } from "@/services/userService";

export default function UserManagementContainer() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState<string>("created_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchPattern, setSearchPattern] = useState<string>("");
  const [usersData, setUsersData] = useState<UserData[]>([]);

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

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
      setLoading(true);
      const data = await UserService.fetch();
      setUsersData(data ?? []);
      setTotalRows(data?.total ?? 0);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to fetch users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger]);

  // Org Delete function
  // const handleDelete = async () => {
  //   try {
  //     if (!selectedOrganization?.id) throw new Error("Invalid selection");

  //     // Get current user ID from cookies
  //     const userCookie = Cookies.get("user");
  //     if (!userCookie) {
  //       throw new Error("User not found. Please login again.");
  //     }

  //     const user = JSON.parse(userCookie);
  //     const userId = user.id;
  //     if (!userId) {
  //       throw new Error("User ID not found. Please login again.");
  //     }

  //     // Call the soft delete API
  //     await deleteOrganization(selectedOrganization.id, userId);

  //     setIsDeleteConfirmOpen(false);
  //     setSelectedOrganization(null);
  //     setRefreshTrigger((p) => p + 1);
  //     setToast({
  //       open: true,
  //       message: `Organization ${selectedOrganization?.name} deleted successfully`,
  //       severity: "success",
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     setToast({
  //       open: true,
  //       message:
  //         err instanceof Error ? err.message : "Failed to delete organization",
  //       severity: "error",
  //     });
  //   }
  // };

  //Update Status Only
  const handleUpdateStatus = async (id: string, isActive: boolean) => {
    try {
      await UserService.updateStatus(id, isActive);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: "User status updated",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to update status",
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
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(0); // Reset to first page when filtering
  };

  const handleSearchChange = (val: string) => {
    setSearchPattern(val);
  };

  return (
    <>
      {/* Org Delete Confirm dialogs */}
      {/* <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Organization Deletion?"
        description={`Are you sure you want to delete ${selectedOrganization?.name}? All associated data will be removed from the system.`}
        onConfirm={handleDelete}
        cancelText="Cancel"
        confirmText="Yes, Delete"
      /> */}

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
        <UserHeader
          onAddUser={() => {
            router.push("/userManagement/create");
          }}
        />

        <UserTableHeader />

        <Box sx={{ flex: 1, overflow: "hidden", mt: 3 }}>
          <UserList
            data={usersData}
            totalRows={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            setSelectedRecord={setSelectedUser}
            handleUpdateStatus={handleUpdateStatus}
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
