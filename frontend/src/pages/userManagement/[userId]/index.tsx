import { useRouter } from "next/router";
import UserDetails from "@/components/UserManagement/UserDetails";

export default function UserDetailsPage() {
  const router = useRouter();
  const { userId } = router.query;

  // Mock data – you’ll replace this with API call
  const users = [
    {
      userId: "u001",
      userCode: "USR001",
      name: "Harsh Kansal",
      email: "harsh.kansal@example.com",
      phone: "9876543210",
      communicationPreference: "Email",
      company: "ABC",
      organisation: "TechNova Solutions",
      role: "Admin",
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
      name: "Ritika Sharma",
      email: "ritika.sharma@example.com",
      phone: "9823012345",
      communicationPreference: "SMS",
      company: "ABC",
      organisation: "TechNova Solutions",
      role: "User",
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
      name: "Rohit Mehta",
      email: "rohit.mehta@example.com",
      phone: "9811223344",
      communicationPreference: "Email",
      company: "ABC",
      organisation: "TechNova Solutions",
      role: "User",
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
      name: "Neha Verma",
      email: "neha.verma@example.com",
      phone: "9798787878",
      communicationPreference: "Email",
      company: "ABC",
      organisation: "TechNova Solutions",
      role: "Manager",
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
      name: "Arjun Patel",
      email: "arjun.patel@example.com",
      phone: "9900990099",
      communicationPreference: "SMS",
      company: "ABC",
      organisation: "TechNova Solutions",
      role: "Admin",
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

  const user = users?.find((item) => item.userId === userId);

  return (
    <>
      {user && (
        <UserDetails
          user={user}
          onEdit={(id) => router.push(`/userManagement/${id}/edit`)}
          onDelete={(id) => console.log("Delete user:", id)}
          onResetPassword={(id) => console.log("Reset password for:", id)}
        />
      )}
    </>
  );
}
