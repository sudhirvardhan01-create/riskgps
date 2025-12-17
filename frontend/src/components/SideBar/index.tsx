import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import MetaDataIcon from "@/icons/meta-data.svg";
import LibraryIcon from "@/icons/library.svg";
import AssessmentIcon from "@/icons/assessment.svg";
import ReportsIcon from "@/icons/reports.svg";
import UserManagementIcon from "@/icons/user-management.svg";
import OrgManagementIcon from "@/icons/orgManagement.svg";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const ACTIVE_BG = "#00000014";
const HOVER_BG = "#EEF2FF";

interface SideBarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SideBar = ({ collapsed, setCollapsed }: SideBarProps) => {
  const [user, setUser] = useState<{ role?: string; orgId?: string }>({});
  const router = useRouter();

  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) setUser(JSON.parse(cookieUser));
  }, []);

  const links = [
    {
      name: user?.role === "Admin" ? "Assessments" : "My Assessments",
      path: "/assessment",
      icon: <AssessmentIcon />,
    },
    {
      name: user?.role === "Admin" ? "Reports" : "My Reports",
      path: "/reports",
      icon: <ReportsIcon />,
    },
    ...(user?.role === "Admin"
      ? [
          { name: "Library", path: "/library", icon: <LibraryIcon /> },
          { name: "Meta Data", path: "/metadata", icon: <MetaDataIcon /> },
          {
            name: "User Management",
            path: "/userManagement",
            icon: <UserManagementIcon />,
          },
        ]
      : []),
    {
      name: user?.role === "Admin" ? "Org Management" : "My Org",
      path:
        user?.role === "Admin"
          ? "/orgManagement"
          : `/orgManagement/${user.orgId}`,
      icon: <OrgManagementIcon />,
    },
    {
      name: user?.role === "Admin" ? "Settings" : "My Settings",
      path: "/reports/assessment-sync-page",
      icon: <OrgManagementIcon />,
    },
  ];

  return (
    <Box
      component="nav"
      aria-label="Main sidebar"
      sx={{
        position: "relative",
        bgcolor: "#F9FAFB",
        color: "primary.main",
        width: collapsed ? "80px" : "120px",
        minHeight: "calc(100vh - 71px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "width 0.3s ease",
        borderRight: "1px solid #e0e0e0",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Sidebar Links */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          pt: 1.5,
          flexGrow: 1,
        }}
      >
        {links.map((link) => {
          const isActive =
            link.path === "/"
              ? router.pathname === "/"
              : router.pathname.startsWith(link.path);

          const linkBox = (
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
                p: 1,
                mx: 0.5,
                my: 0.5,
                borderRadius: 1,
                display: "flex",
                flexDirection: collapsed ? "row" : "column",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
                cursor: "pointer",
                width: collapsed ? "60px" : "90%",
                textAlign: "center",
                backgroundColor: isActive ? ACTIVE_BG : "transparent",
                transition: "all 200ms ease",
                "&:hover": {
                  backgroundColor: !isActive ? HOVER_BG : ACTIVE_BG,
                },
              }}
            >
              <Box sx={{ height: 24, width: 24 }}>{link.icon}</Box>
              {!collapsed && (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    color: "primary.main",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {link.name}
                </Typography>
              )}
            </Box>
          );

          return collapsed ? (
            <Tooltip title={link.name} placement="right" key={link.path}>
              {linkBox}
            </Tooltip>
          ) : (
            linkBox
          );
        })}
      </Box>

      {/* Collapse Toggle Button (Bottom Right) */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: "primary.main",
            mb: 1.5,
            mr: collapsed ? "auto" : 1.5,
            transition: "all 0.3s ease",
          }}
        >
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default SideBar;
