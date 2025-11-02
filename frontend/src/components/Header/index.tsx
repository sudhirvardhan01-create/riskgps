import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";
import NotificationIcon from "@/icons/notification.svg";
import AvatarIcon from "@/icons/avatar.svg";
import Image from "next/image";
import riskgps_logo from "../../../public/riskgps_logo.jpg";

const Header = () => {
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
      {/* <Typography variant="h5" color="#91939A" fontWeight={500}>
        RiskGPS
      </Typography> */}
      <Image src={riskgps_logo} alt="RiskGPS Logo" width={150} height={36} />
      <Stack display={"flex"} flexDirection={"row"}>
        <NotificationIcon
          height={24}
          width={24}
          style={{ marginRight: 32, cursor: "pointer" }}
        />
        <AvatarIcon height={24} width={24} style={{ cursor: "pointer" }} />
      </Stack>
    </Box>
  );
};

export default Header;
