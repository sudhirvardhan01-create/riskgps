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

export default function UserManagementContainer() {
  const router = useRouter();
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
  // const loadList = useCallback(async () => {
  //   try {
  //     // When filtering by status, we need to fetch all data and do client-side pagination
  //     // Otherwise, use server-side pagination
  //     if (statusFilter && statusFilter !== "all") {
  //       // Fetch all data for client-side filtering and pagination
  //       const apiResponse = await getOrganizations(
  //         0,
  //         1000,
  //         searchPattern,
  //         sortField,
  //         sortDirection.toUpperCase()
  //       );
  //       const transformedData = transformApiResponseToFrontend(apiResponse);

  //       // Apply client-side filtering for status
  //       let filteredData = transformedData.organizations;
  //       // Show organizations with specific status
  //       filteredData = filteredData.filter(
  //         (org) => org.status === statusFilter
  //       );

  //       // Apply client-side pagination
  //       const startIndex = page * rowsPerPage;
  //       const endIndex = startIndex + rowsPerPage;
  //       const paginatedData = filteredData.slice(startIndex, endIndex);

  //       setUsersData(paginatedData);
  //       setTotalRows(filteredData.length);
  //     } else {
  //       // Use server-side pagination when no status filter is applied
  //       const apiResponse = await getOrganizations(
  //         page,
  //         rowsPerPage,
  //         searchPattern,
  //         sortField,
  //         sortDirection.toUpperCase()
  //       );
  //       const transformedData = transformApiResponseToFrontend(apiResponse);

  //       setOrganizationsData(transformedData.organizations);
  //       setTotalRows(transformedData.total);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setToast({
  //       open: true,
  //       message: "Failed to fetch organizations",
  //       severity: "error",
  //     });
  //   }
  // }, [
  //   page,
  //   rowsPerPage,
  //   searchPattern,
  //   sortField,
  //   sortDirection,
  //   statusFilter,
  // ]);

  // useEffect(() => {
  //   loadList();
  // }, [loadList, refreshTrigger]);

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

  // const handleEditOrganization = (organization: Organization) => {
  //   router.push(`/orgManagement/${organization.orgId}/editOrgDetails`);
  // };

  const users = [
    {
      userId: "u001",
      userCode: "USR001",
      userImage: "https://via.placeholder.com/150",
      name: "Harsh Kansal",
      email: "harsh.kansal@example.com",
      phone: "+91 9876543210",
      communicationPreference: "Email",
      company: "ABC",
      organisation: "TechNova Solutions",
      businessUnit: "Power Platform Development",
      userType: "Admin",
      isTermsAndConditionsAccepted: true,
      status: "active",
      createdDate: new Date("2024-09-10T10:30:00Z"),
      modifiedDate: new Date("2025-02-20T12:45:00Z"),
      createdBy: "system",
      modifiedBy: "admin",
      isDeleted: false,
      lastLoginDate: new Date("2025-10-10T09:00:00Z"),
      passwordLastChanged: new Date("2025-07-15T08:30:00Z"),
    },
    {
      userId: "u002",
      userCode: "USR002",
      userImage: "https://via.placeholder.com/150",
      name: "Ritika Sharma",
      email: "ritika.sharma@example.com",
      phone: "+91 9823012345",
      communicationPreference: "SMS",
      company: "ABC",
      organisation: "TechNova Solutions",
      businessUnit: "Cybersecurity",
      userType: "User",
      isTermsAndConditionsAccepted: true,
      status: "active",
      createdDate: new Date("2024-11-02T11:20:00Z"),
      modifiedDate: new Date("2025-03-15T15:00:00Z"),
      createdBy: "admin",
      modifiedBy: "admin",
      isDeleted: false,
      lastLoginDate: new Date("2025-10-11T07:10:00Z"),
      passwordLastChanged: new Date("2025-08-12T09:30:00Z"),
    },
    {
      userId: "u003",
      userCode: "USR003",
      userImage: "https://via.placeholder.com/150",
      name: "Rohit Mehta",
      email: "rohit.mehta@example.com",
      phone: "+91 9811223344",
      communicationPreference: "Email",
      company: "ABC",
      organisation: "TechNova Solutions",
      businessUnit: "Cloud Engineering",
      userType: "User",
      isTermsAndConditionsAccepted: true,
      status: "inactive",
      createdDate: new Date("2024-06-12T09:45:00Z"),
      modifiedDate: new Date("2025-01-20T14:15:00Z"),
      createdBy: "admin",
      modifiedBy: "system",
      isDeleted: false,
      lastLoginDate: new Date("2025-09-20T10:20:00Z"),
      passwordLastChanged: new Date("2025-05-10T11:10:00Z"),
    },
    {
      userId: "u004",
      userCode: "USR004",
      userImage: "https://via.placeholder.com/150",
      name: "Neha Verma",
      email: "neha.verma@example.com",
      phone: "+91 9798787878",
      communicationPreference: "Email",
      company: "ABC",
      organisation: "TechNova Solutions",
      businessUnit: "IT Operations",
      userType: "Manager",
      isTermsAndConditionsAccepted: true,
      status: "active",
      createdDate: new Date("2024-12-15T10:00:00Z"),
      modifiedDate: new Date("2025-04-05T09:50:00Z"),
      createdBy: "system",
      modifiedBy: "admin",
      isDeleted: false,
      lastLoginDate: new Date("2025-10-12T08:30:00Z"),
      passwordLastChanged: new Date("2025-09-01T10:15:00Z"),
    },
    {
      userId: "u005",
      userCode: "USR005",
      userImage: "https://via.placeholder.com/150",
      name: "Arjun Patel",
      email: "arjun.patel@example.com",
      phone: "+91 9900990099",
      communicationPreference: "SMS",
      company: "ABC",
      organisation: "TechNova Solutions",
      businessUnit: "AI & Data Science",
      userType: "Admin",
      isTermsAndConditionsAccepted: false,
      status: "pending",
      createdDate: new Date("2025-01-25T08:15:00Z"),
      modifiedDate: new Date("2025-05-30T11:25:00Z"),
      createdBy: "admin",
      modifiedBy: null,
      isDeleted: false,
      lastLoginDate: new Date("2025-09-25T12:00:00Z"),
      passwordLastChanged: new Date("2025-08-25T14:45:00Z"),
    },
  ];

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
            data={users}
            totalRows={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            setSelectedRecord={setSelectedUser}
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
