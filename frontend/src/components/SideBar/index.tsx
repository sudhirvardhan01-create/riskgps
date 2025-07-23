import { Box, Typography } from "@mui/material";
import HomeIcon from "@/icons/home.svg";
import MetaDataIcon from "@/icons/meta-data.svg";
import LibraryIcon from "@/icons/library.svg";
import AssessmentIcon from "@/icons/assessment.svg";
import ReportsIcon from "@/icons/reports.svg";
import UserManagementIcon from "@/icons/user-management.svg";
import OrgManagementIcon from "@/icons/org-management.svg";
import { useRouter } from "next/navigation";

const links = [
  { name: "Home", path: "/home", icon: <HomeIcon /> },
  { name: "Meta Data", path: "/meta-data", icon: <MetaDataIcon /> },
  { name: "Library", path: "/library", icon: <LibraryIcon /> },
  { name: "Assessment", path: "/assessment", icon: <AssessmentIcon /> },
  { name: "Reports", path: "/reports", icon: <ReportsIcon /> },
  {
    name: "User Management",
    path: "/user-management",
    icon: <UserManagementIcon />,
  },
  {
    name: "Org Management",
    path: "/org-management",
    icon: <OrgManagementIcon />,
  },
];

const SideBar = () => {
  const router = useRouter();

  return (
    <Box
      bgcolor={"primary.main"}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {links.map((link) => {
        return (
          <Box
            key={link.name}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => router.push(link.path)}
          >
            <Box sx={{ height: 24, width: 24 }}>{link.icon}</Box>
            <Typography variant="caption">{link.name}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default SideBar;
