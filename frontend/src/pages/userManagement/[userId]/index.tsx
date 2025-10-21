import { useRouter } from "next/router";
import UserDetails from "@/components/UserManagement/UserDetails";

export default function UserDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  // Mock data – you’ll replace this with API call
  const user = {
    id: id as string,
    name: "John Doe",
    employeeId: "SH23978746",
    email: "johndoe@xyz.com",
    phone: "9839733617",
    userType: "Business user",
    organisation: "Summit Financial Corporation",
    businessUnit: "-",
    position: "Manager",
    communicationPreference: "Email",
    isActive: true,
    createdOn: "04 Jan, 2024",
    createdBy: "Karan Gautam",
    invitationStatus: "Accepted",
    lastLoginDate: "09 Jan, 2024",
    passwordLastChanged: "04 Jan, 2024",
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
