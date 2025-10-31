import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Grid,
  Link,
  Stack,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";
import { UserData } from "@/types/user";
import { formatDate } from "@/utils/utility";

export interface UserDetailsProps {
  user: UserData;
  onEdit: (id: string | undefined) => void;
  onDelete: () => void;
  onResetPassword?: (id: string | undefined) => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  onEdit,
  onDelete,
  onResetPassword,
}) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        p: 5,
        mb: 5,
        height: "calc(100vh - 135px)",
        overflow: "auto",
      }}
    >
      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={() => router.back()} size="small">
          <ArrowBackIcon sx={{ color: "text.primary" }} />
        </IconButton>
        <Typography variant="h6" color="text.primary">
          User Management/
        </Typography>
        <Typography variant="h6" color="primary" fontWeight={600}>
          User Details
        </Typography>
      </Stack>

      {/* User Info Card */}
      <Card variant="outlined" sx={{ borderRadius: 2, mt: 5 }}>
        <CardContent sx={{ p: "0 !important" }}>
          <Stack
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems="top"
            sx={{ backgroundColor: "#F3F8FF", py: 3, px: 4 }}
          >
            <Stack
              display={"Flex"}
              flexDirection={"row"}
              gap={"6px"}
              alignItems={"center"}
            >
              <Avatar
                src="/default-user.png"
                alt={user.name}
                sx={{ width: 96, height: 96 }}
              />
              <Stack display={"flex"} flexDirection={"column"} gap={1}>
                <Typography variant="h5" fontWeight={650} color="text.primary">
                  {user.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={550}
                >
                  {user.userCode}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              spacing={4}
              alignItems="center"
              height={"24px"}
            >
              <Stack display={"flex"} flexDirection={"row"} gap={1}>
                <ToggleSwitch sx={{ m: 0 }} checked={user.isActive} />
                <Typography
                  variant="body2"
                  sx={{
                    color: user.isActive ? "#147A50" : "#757575",
                    fontWeight: 500,
                  }}
                >
                  {user.isActive ? "Active" : "Disabled"}
                </Typography>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => onEdit?.(user.userId)}
                  color="primary"
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => onDelete()} color="error">
                  <Delete />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* User Information */}
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid size={{ xs: 4 }}>
              <Typography variant="body1" color="#91939A" fontWeight={500}>
                Email ID
              </Typography>
              <Typography fontSize={18} fontWeight={550} color="text.primary">
                {user.email}
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography variant="body1" color="#91939A" fontWeight={500}>
                Phone
              </Typography>
              <Typography fontSize={18} fontWeight={550} color="text.primary">
                {user.phone}
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography variant="body1" color="#91939A" fontWeight={500}>
                Communication Preference
              </Typography>
              <Typography fontSize={18} fontWeight={550} color="text.primary">
                {user.communicationPreference}
              </Typography>
            </Grid>

            <Grid size={{ xs: 4 }}>
              <Typography variant="body1" color="#91939A" fontWeight={500}>
                User Type
              </Typography>
              <Typography fontSize={18} fontWeight={550} color="text.primary">
                {user.role}
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography variant="body1" color="#91939A" fontWeight={500}>
                Company
              </Typography>
              <Typography fontSize={18} fontWeight={550} color="text.primary">
                {user.company}
              </Typography>
            </Grid>
            {/* <Grid size={{ xs: 4 }}>
              <Typography variant="body1" color="#91939A" fontWeight={500}>
                Business Unit
              </Typography>
              <Typography fontSize={18} fontWeight={550} color="text.primary">
                {user.businessUnit || "-"}
              </Typography>
            </Grid> */}

            {/* <Grid size={{ xs: 12 }}>
              <Typography variant="body1" color="#91939A" fontWeight={500}>
                Position / Title
              </Typography>
              <Typography fontSize={18} fontWeight={550} color="text.primary">
                {user.position}
              </Typography>
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          color="text.primary"
          marginBottom={2}
        >
          Organization
        </Typography>
        <Card
          variant="outlined"
          sx={{ borderRadius: 2, border: "1px solid #D9D9D9" }}
        >
          <CardContent sx={{ p: "0 !important" }}>
            <Grid container spacing={3} sx={{ p: 3 }}>
              <Grid size={{ xs: 4 }}>
                <Typography variant="body1" color="#91939A" fontWeight={500}>
                  Assigned Organization
                </Typography>
                <Typography fontSize={18} fontWeight={550} color="text.primary">
                  {user.organization ? user.organization : "-"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Activity Section */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          color="text.primary"
          marginBottom={2}
        >
          Activity
        </Typography>

        <Card
          variant="outlined"
          sx={{ borderRadius: 2, border: "1px solid #D9D9D9" }}
        >
          <CardContent sx={{ p: "0 !important" }}>
            <Grid container spacing={3} sx={{ p: 3 }}>
              <Grid size={{ xs: 4 }}>
                <Typography variant="body1" color="#91939A" fontWeight={500}>
                  Created On
                </Typography>
                <Typography fontSize={18} fontWeight={550} color="text.primary">
                  {user.createdDate ? formatDate(user.createdDate) : "-"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="body1" color="#91939A" fontWeight={500}>
                  Created By
                </Typography>
                <Typography fontSize={18} fontWeight={550} color="text.primary">
                  {user.createdBy ? user.createdBy : "-"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="body1" color="#91939A" fontWeight={500}>
                  Invitation / Terms and Conditions
                </Typography>
                <Typography fontSize={18} fontWeight={550} color="text.primary">
                  {user.isTermsAndConditionsAccepted
                    ? "Accepted"
                    : "Not Accepted"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 4 }}>
                <Typography variant="body1" color="#91939A" fontWeight={500}>
                  Last Login Date
                </Typography>
                <Typography fontSize={18} fontWeight={550} color="text.primary">
                  09 Aug, 2025
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="body1" color="#91939A" fontWeight={500}>
                  Password Last Changed
                </Typography>
                <Typography fontSize={18} fontWeight={550} color="text.primary">
                  04 Aug, 2025
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }} display={"flex"} alignItems={"center"}>
                <Typography
                  component={Link}
                  onClick={() => onResetPassword?.(user.userId)}
                  sx={{
                    cursor: "pointer",
                    color: "primary.main",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "18px",
                  }}
                >
                  Reset Password
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UserDetails;
