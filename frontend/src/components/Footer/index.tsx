import Image from "next/image";
import React from "react";
import styles from "@/styles/Home.module.css";
import { Box, Typography } from "@mui/material";
import { constants } from "@/utils/constants";

const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "right",
        padding: "20px 15px",
        backgroundColor: "#f5f5f5",
        color: "#91939A",
        position: "absolute",
        bottom: 0,
        width: "90vw",
      }}
    >
      <Typography fontSize={"11px"}>{constants.footerDescription}</Typography>
    </Box>
  );
};

export default Footer;
