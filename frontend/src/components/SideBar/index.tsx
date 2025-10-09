import { Box, Typography } from "@mui/material";
import HomeIcon from "@/icons/home.svg";
import MetaDataIcon from "@/icons/meta-data.svg";
import LibraryIcon from "@/icons/library.svg";
import AssessmentIcon from "@/icons/assessment.svg";
import ReportsIcon from "@/icons/reports.svg";
import UserManagementIcon from "@/icons/user-management.svg";
import OrgManagementIcon from "@/icons/orgManagement.svg";
import { useRouter } from "next/router";

const links = [
  { name: "Home", path: "/", icon: <HomeIcon /> },
  { name: "Meta Data", path: "/metadata", icon: <MetaDataIcon /> },
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
    path: "/orgManagement",
    icon: <OrgManagementIcon />,
  },
];

const ACTIVE_BG = "#FFFFFF40"; // active background
const HOVER_BG = "#FFFFFF26"; // hover background

const SideBar = () => {
  const router = useRouter();

  return (
    <Box
      component="nav"
      aria-label="Main sidebar"
      sx={{
        bgcolor: "primary.main",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        pt: 1.5,
        alignItems: "center",
      }}
    >
      {links.map((link) => {
        // Decide whether this link is active:
        // - For root path "/", only exact match is active.
        // - For other paths, any pathname that starts with link.path is considered active (so nested routes remain highlighted).
        const isActive =
          link.path === "/"
            ? router.pathname === "/"
            : router.pathname.startsWith(link.path);

        return (
          <Box
            key={link.path}
            role="button"
            tabIndex={0}
            aria-current={isActive ? "page" : undefined}
            onClick={() => router.push(link.path)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") router.push(link.path);
            }}
            sx={{
              p: 2,
              mx: 0.5,
              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "pointer",
              width: "90%",
              textAlign: "center",
              backgroundColor: isActive ? ACTIVE_BG : "transparent",
              transition: "background-color 150ms ease",
              "&:hover": {
                backgroundColor: !isActive ? HOVER_BG : ACTIVE_BG,
              },
              // keep consistent icon size
              "& > .MuiBox-root, & svg": {
                height: 24,
                width: 24,
              },
            }}
          >
            <Box sx={{ height: 24, width: 24 }}>{link.icon}</Box>
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              {link.name}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default SideBar;
