import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import NotificationIcon from "@/icons/notification.svg";
import AvatarIcon from "@/icons/avatar.svg";

const Header = () => {
  return (
    <Box
      sx={{
        height: 72,
        borderBottom: "1px solid #E7E7E8",
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        px: 5,
        py: 3,
      }}
    >
      <NotificationIcon
        height={24}
        width={24}
        style={{ marginRight: 32, cursor: "pointer" }}
      />
      <AvatarIcon height={24} width={24} style={{ cursor: "pointer" }} />
    </Box>
  );
};

export default Header;
