import { useRouter } from "next/router";
import UserDetails from "@/components/UserManagement/UserDetails";

export default function UserDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  // Mock data – you’ll replace this with API call
  const user = {
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
  };

  return (
    <UserDetails
      user={user}
      onEdit={(id) => router.push(`/userManagement/${id}/edit`)}
      onDelete={(id) => console.log("Delete user:", id)}
      onResetPassword={(id) => console.log("Reset password for:", id)}
    />
  );
}
