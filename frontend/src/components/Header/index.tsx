import { Box, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import React from "react";
import NotificationIcon from "@/icons/notification.svg";
import AvatarIcon from "@/icons/avatar.svg";
import Image from "next/image";
import riskgps_logo from "../../../public/riskgps_logo.jpg";
import { logout } from "@/pages/api/AuthAPI";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { logoutContext } = useAuth();
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
      <Image src={riskgps_logo} alt="RiskGPS Logo" width={150} height={36} />
      <Stack display={"flex"} flexDirection={"row"}>
        <NotificationIcon
          height={24}
          width={24}
          style={{ marginRight: 32, cursor: "pointer" }}
        />
        <IconButton
          onClick={handleClick}
          sx={{ width: 24, height: 24, padding: "0px !important" }}
        >
          <AvatarIcon height={24} width={24} style={{ cursor: "pointer" }} />
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
};

export default Header;
