import { Box, Chip, Typography, Stack, FormControlLabel, Avatar, IconButton } from "@mui/material";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import MenuItemComponent from "@/components/MenuItemComponent";
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";
import { Organization } from "@/types/organization";
import Image from "next/image";
import { useRouter } from "next/router";

interface OrgCardProps {
  organization: Organization;
  setSelectedOrganization: React.Dispatch<React.SetStateAction<Organization | null>>;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // handleUpdateStatus: (id: string, status: string) => void;
}

const OrgCard: React.FC<OrgCardProps> = ({
  organization,
  setSelectedOrganization,
  setIsViewOpen,
  setIsEditOpen,
  setIsDeleteConfirmOpen,
  // handleUpdateStatus,
}) => {
  const router = useRouter();
  // const getStatusComponent = () => {
  //   return (
  //     <FormControlLabel
  //       control={
  //         <ToggleSwitch
  //           sx={{ m: 1 }}
  //           onChange={(e) => {
  //             const updatedStatus = e.target.checked ? "active" : "inactive";
  //             handleUpdateStatus(organization.id, updatedStatus);
  //           }}
  //           checked={organization.status === "active"}
  //         />
  //       }
  //       label={organization.status === "active" ? "Active" : "Inactive"}
  //     />
  //   );
  // };

  const dialogData = [
    {
      onAction: () => {
        setSelectedOrganization(organization);
        setIsEditOpen(true);
      },
      color: "primary.main",
      action: "Edit",
      icon: <EditOutlined fontSize="small" />,
    },
    {
      onAction: () => {
        setSelectedOrganization(organization);
        setIsDeleteConfirmOpen(true);
      },
      color: "#CD0303",
      action: "Delete",
      icon: <DeleteOutlineOutlined fontSize="small" />,
    },
  ];

  const formattedDate = organization.lastUpdated
    ? new Date(organization.lastUpdated).toISOString().split("T")[0]
    : "";

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on menu items or toggle switch
    const target = e.target as HTMLElement;
    if (target.closest('.MuiIconButton-root') || target.closest('.MuiSwitch-root') || target.closest('.MuiFormControlLabel-root')) {
      return;
    }
    
    // Navigate to organization details page
    router.push(`/org-management/${organization.orgId}`);
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        borderRadius: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        boxShadow: "none",
        border: "1px solid #D9D9D9",
        borderTop: "none",
        backgroundColor: "#FFFFFF",
        cursor: "pointer",
        minHeight: "68px",
        gap: "24px",
        flexWrap: { xs: "wrap", md: "nowrap" },
        "&:last-child": {
          borderRadius: "0 0 4px 4px"
        }
      }}
    >
      {/* Company Identifier Section */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          height: "36px",
          flex: "0 0 auto"
        }}
      >
        {/* Organization Logo/Icon */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "36px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            src={organization.orgImage}
            alt="org-image"
            fill
            style={{ objectFit: "cover" }}
          />

          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#0000001F",
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h6"
            fontWeight={500}
            color="#484848"
            sx={{
              fontSize: "14px",
              lineHeight: "130%",
              letterSpacing: "0%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {organization.name}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={400}
            color="#91939A"
            sx={{
              fontSize: "12px",
              lineHeight: "130%",
              letterSpacing: "0%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {organization.orgId}
          </Typography>
        </Box>
      </Stack>

      {/* Tags Section */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          height: "29px",
          flex: "0 0 auto",
          alignItems: "center"
        }}
      >
        <Chip
          label={`Industry: ${organization.tags.industry}`}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: "4px",
            border: "1px solid #E7E7E8",
            height: 29,
            backgroundColor: "#E7E7E84D",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "100%",
            letterSpacing: "0%",
            maxWidth: "200px",
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }
          }}
        />
        <Chip
          label={`Size: ${organization.tags.size}`}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: "4px",
            border: "1px solid #E7E7E8",
            height: 29,
            backgroundColor: "#E7E7E84D",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "100%",
            letterSpacing: "0%",
            maxWidth: "200px",
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }
          }}
        />
      </Stack>

      {/* Members Section */}
      <Stack
        direction="row"
        spacing={-0.7}
        alignItems="center"
        sx={{
          height: "24px",
          flex: "0 0 auto",
          justifyContent: "center"
        }}
      >
        {organization.members.avatars.map((avatar, index) => (
          <Avatar
            key={index}
            src={avatar || undefined}
            sx={{
              width: 24,
              height: 24,
              fontSize: "12px",
              border: "1.5px solid white",
              zIndex: index,
            }}
          >
            {!avatar && "?"}
          </Avatar>
        ))}
        {organization.members.additionalCount > 0 && (
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: "32px",
              backgroundColor: "#04139A",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #FFFFFF",
              opacity: 1,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
              zIndex: organization.members.avatars.length + 1,
            }}
          >
            +{organization.members.additionalCount}
          </Box>
        )}
      </Stack>

      {/* Business Units Text */}
      <Box
        sx={{
          height: "33px",
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Typography
          variant="body2"
          color="#484848"
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "100%",
            letterSpacing: "0%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {organization.businessUnits.slice(0, 3).join(", ")}
        </Typography>

        {organization.businessUnits.length > 3 && (
          <Typography
            variant="body2"
            color="#04139A"
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "100%",
              letterSpacing: "0%",
              mt: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            +{organization.businessUnits.length - 3} more
          </Typography>
        )}
      </Box>

      {/* Status Section */}
      <Box
        sx={{
          height: "21px",
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        <ToggleSwitch
          sx={{ m: 0 }}
          // onChange={(e) => {
          //   const updatedStatus = e.target.checked ? "active" : "disabled";
          //   handleUpdateStatus(organization.id, updatedStatus);
          // }}
          checked={organization.status === "active"}
        />
        <Typography
          variant="body2"
          sx={{
            color: organization.status === "active" ? "#147A50" : "#757575",
            fontSize: "12px",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {organization.status === "active" ? "Active" : "Disabled"}
        </Typography>
      </Box>

      {/* MenuItemComponent */}
      <Box
        sx={{
          height: "20px",
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <MenuItemComponent items={dialogData} />
      </Box>
    </Box>
  );
};

export default OrgCard;
