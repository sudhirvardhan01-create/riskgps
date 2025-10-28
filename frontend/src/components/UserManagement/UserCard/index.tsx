import { Box, Typography, Avatar, Paper } from "@mui/material";
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";
import { UserData } from "@/types/user";
import Image from "next/image";
import { useRouter } from "next/router";
import { USER_TABLE_HEADER_COLUMN_TEMPLATE } from "@/constants/constant";
import { formatDate } from "@/utils/utility";

interface UserCardProps {
  record: UserData;
  setSelectedRecord: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserCard: React.FC<UserCardProps> = ({ record, setSelectedRecord }) => {
  const router = useRouter();

  const handleCardClick = () => {
    // Navigate to user details page
    router.push(`/userManagement/${record.userId}`);
  };

  return (
    <Paper
      variant="outlined"
      onClick={handleCardClick}
      sx={{
        p: 2,
        border: "1px solid #D9D9D9",
        borderRadius: "8px",
        display: "grid",
        gridTemplateColumns: USER_TABLE_HEADER_COLUMN_TEMPLATE,
        alignItems: "center",
        gap: 2,
        "&:hover": { border: "1px solid #1976d2" },
        width: "100%",
        cursor: "pointer",
      }}
    >
      {/* User Personal Details + Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "36px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Avatar
            src="/default-user.png"
            alt={record.name}
            sx={{ width: 48, height: 48 }}
          />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            color="text.primary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {record.name}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={400}
            color="#91939A"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {`${record.userCode}  •  ${record.email}  •  ${record.phone}`}
          </Typography>
        </Box>
      </Box>

      {/* User Type */}
      <Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            textAlign: "start",
          }}
        >
          {record.role}
        </Typography>
      </Box>

      {/* Created On */}
      <Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            textAlign: "start",
          }}
        >
          {record.createdDate ? formatDate(record.createdDate) : "-"}
        </Typography>
      </Box>

      {/* Organisation */}
      <Box>
        <Typography
          variant="body1"
          color="#484848"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {record.organization ? record.organization : "-"}
        </Typography>
      </Box>

      {/* Status */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ToggleSwitch
          sx={{ m: 0 }}
          checked={record.isActive}
          //   onClick={handleInteractiveClick}
        />
        <Typography
          variant="body2"
          sx={{
            color: record.isActive ? "#147A50" : "#757575",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {record.isActive ? "Active" : "Disabled"}
        </Typography>
      </Box>
    </Paper>
  );
};

export default UserCard;
