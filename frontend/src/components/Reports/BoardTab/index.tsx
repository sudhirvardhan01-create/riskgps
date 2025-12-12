import { Box, Typography } from "@mui/material";
import ProcessAssetFlow from "../ProcessAssetFlow";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getProcessList } from "@/pages/api/reports";

export default function BoardTab() {
  // const [orgId, setOrgId] = useState<string | null>();
  // const [orgData, setOrgData] = useState<any>(null);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     try {
  //       const cookieUser = Cookies.get("user");
  //       if (cookieUser) {
  //         const parsed = JSON.parse(cookieUser);
  //         setOrgId(parsed?.orgId || parsed?.org_id || null);
  //       }
  //     } catch (err) {
  //       console.warn("Invalid or missing cookie:", err);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     if (!orgId) return;
  //     try {
  //       const [processRes] = await Promise.all([getProcessList(orgId)]);
  //       setOrgData(processRes.data);
  //     } catch (error) {
  //       console.error("Error fetching reports data:", error);
  //     }
  //   }
  //   fetchData();
  // }, [orgId]);

  // console.log(orgData);

  return (
    // <Box
    //   sx={{
    //     display: "flex",
    //     flex: 1,
    //     mb: 0,
    //     maxHeight: 420,
    //     overflow: "auto",
    //   }}
    // >
    //   {orgData && <ProcessAssetFlow data={orgData} />}
    // </Box>
    <Typography>Board Tab Content</Typography>
  );
}
