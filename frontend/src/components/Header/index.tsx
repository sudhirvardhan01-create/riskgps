import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import NotificationIcon from "@/icons/notification.svg";
import AvatarIcon from "@/icons/avatar.svg";
import Image from "next/image";
import riskgps_logo from "../../../public/riskgps_logo.jpg";
import riskGPS_logo from "../../../public/riskGPS_logo.png";
import riskgps_logo_svg from "../../../public/riskgps_logo_svg.svg";
import { logout } from "@/pages/api/AuthAPI";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { Logout } from "@mui/icons-material";

const Header = () => {
  const router = useRouter();
  const { logoutContext } = useAuth();
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = async () => {
    try {
      await logout(Cookies.get("refreshToken") as string);
      logoutContext();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <Box
      sx={{
        height: 72,
        borderBottom: "1px solid #E7E7E8",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pr: 5,
        py: 3,
        pl: 2,
      }}
    >
      <Image
        src={"/riskgps_logo_svg.svg"}
        alt="RiskGPS Logo"
        width={125}
        height={40}
      />
      <Stack display={"flex"} flexDirection={"row"}>
        <Tooltip title="Notifications">
          <NotificationIcon
            height={24}
            width={24}
            style={{ marginRight: 32, cursor: "pointer" }}
          />
        </Tooltip>
        <Tooltip title="My Profile">
          <IconButton
            onClick={handleClick}
            sx={{ width: 24, height: 24, padding: "0px !important" }}
          >
            <AvatarIcon height={24} width={24} style={{ cursor: "pointer" }} />
          </IconButton>
        </Tooltip>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem sx={{ cursor: "default" }}>
            <Stack direction={"row"} gap={1}>
              <Avatar sx={{ width: 48, height: 48 }} />
              <Stack direction={"column"} justifyContent={"center"}>
                <Typography variant="body1">{user?.name as string}</Typography>
                <Typography variant="body2">{user?.email as string}</Typography>
              </Stack>
            </Stack>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleLogout()}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
};

export default Header;
