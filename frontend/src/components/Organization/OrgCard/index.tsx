import { Box, Chip, Typography, Avatar, Paper } from "@mui/material";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import MenuItemComponent from "@/components/MenuItemComponent";
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";
import { Organization } from "@/types/organization";
import Image from "next/image";
import { useRouter } from "next/router";
import { ORG_COLUMN_TEMPLATE } from "@/constants/constant";

interface OrgCardProps {
  organization: Organization;
  setSelectedOrganization: React.Dispatch<React.SetStateAction<Organization | null>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onEditOrganization?: (organization: Organization) => void;
}

const OrgCard: React.FC<OrgCardProps> = ({
  organization,
  setSelectedOrganization,
  setIsDeleteConfirmOpen,
  onEditOrganization,
}) => {
  const router = useRouter();

  const dialogData = [
    {
      onAction: () => {
        if (onEditOrganization) {
          onEditOrganization(organization);
        }
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
    // Navigate to organization details page
    router.push(`/orgmanagement/${organization.orgId}`);
  };

  const handleInteractiveClick = (e: React.MouseEvent) => {
    // Stop event from bubbling up to the card
    e.stopPropagation();
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
        gridTemplateColumns: ORG_COLUMN_TEMPLATE,
        alignItems: "center",
        gap: 2,
        "&:hover": { border: "1px solid #1976d2" },
        width: "100%",
        cursor: "pointer",
      }}
    >
      {/* Org Name + Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
            variant="body1"
            fontWeight={500}
            color="#484848"
            sx={{
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
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {organization.orgCode.length > 15
              ? organization.orgCode.substring(0, 15) + "..."
              : organization.orgCode}
          </Typography>
        </Box>
      </Box>

      {/* Tags */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
      </Box>

      {/* Org Members */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {organization.members.avatars.map((avatar, index) => (
            <Avatar
              key={index}
              src={avatar || undefined}
              sx={{
                width: 28,
                height: 28,
                fontSize: "12px",
                border: "1.5px solid white",
                zIndex: index,
                ml: index === 0 ? 0 : -0.75, //negative margin for overlap
              }}
            >
              {!avatar && "?"}
            </Avatar>
          ))}
          {organization.members.additionalCount > 0 && (
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "32px",
                backgroundColor: "#04139A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid #FFFFFF",
                opacity: 1,
                zIndex: organization.members.avatars.length + 1,
                ml: -0.75, //also overlap with previous avatar
                p: 0.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                +{organization.members.additionalCount}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Business Units */}
      <Box>
        <Typography
          variant="body1"
          color="#484848"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {organization.businessUnits.slice(0, 2).join(", ")}
        </Typography>
        {organization.businessUnits.length > 2 && (
          <Typography
            variant="body2"
            color="#04139A"
            sx={{
              mt: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            +{organization.businessUnits.length - 2} more
          </Typography>
        )}
      </Box>

      {/* Status */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ToggleSwitch
          sx={{ m: 0 }}
          checked={organization.status === "active"}
          onClick={handleInteractiveClick}
        />
        <Typography
          variant="body2"
          sx={{
            color: organization.status === "active" ? "#147A50" : "#757575",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {organization.status === "active" ? "Active" : "Disabled"}
        </Typography>
      </Box>

      {/* Actions Menu */}
      <Box onClick={handleInteractiveClick}>
        <MenuItemComponent items={dialogData} />
      </Box>
    </Paper>
  );
};

export default OrgCard;
