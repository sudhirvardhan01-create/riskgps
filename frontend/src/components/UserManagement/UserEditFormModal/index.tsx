import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  MenuItem,
  IconButton,
  Typography,
  FormControlLabel,
  Stack,
  Avatar,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  InputLabel,
  Select,
  ListSubheader,
  TextField,
} from "@mui/material";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";
import { tooltips } from "@/utils/tooltips";
import { labels } from "@/utils/labels";
import { CameraAlt } from "@mui/icons-material";
import { UserEditFormData } from "@/types/user";
import TooltipComponent from "@/components/TooltipComponent";
import { Organisation } from "@/types/assessment";
import { getOrganization } from "@/pages/api/organization";
import { UserService } from "@/services/userService";

interface UserEditFormModalProps {
  onClose: () => void;
  userData: UserEditFormData;
  setIsEditConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setToast: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      severity: "success" | "error" | "info";
    }>
  >;
}

const UserEditFormModal: React.FC<UserEditFormModalProps> = ({
  onClose,
  userData,
  setIsEditConfirmOpen,
  setToast,
}) => {
  const [orgSearch, setOrgSearch] = useState("");
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(
    userData.organization
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserEditFormData>(userData);
  const [roles, setRoles] = useState<
    {
      roleId: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setLoading(true);
        const res = await getOrganization();
        setOrganisations(res.data.organizations);
      } catch (error) {
        console.error("Error fetching organisations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await UserService.fetchRoles();
        setRoles(data);
      } catch (err) {
        console.error("Error while fetching roles:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredOrgs = organisations.filter((o) =>
    o.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  const handleChange = useCallback(
    (field: keyof UserEditFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData] // only depends on setter from props
  );

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await UserService.update(formData.userId, formData);
      setToast({
        open: true,
        message: "Updated user successfully",
        severity: "success",
      });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.log(err);
      setToast({
        open: true,
        message: "Failed to update user",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        width={"944px"}
        borderRadius={4}
        border="1px solid #D9D9D9"
        mt={6}
        mb={2}
        sx={{
          overflow: "auto",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            mb: 5,
            mt: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 96,
              height: 96,
              position: "relative",
              backgroundColor: "#F2F0F0",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                backgroundColor: "#F2F0F0",
                color: "#91939A",
              }}
              src="default-user.png"
            />
            <IconButton
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#04139A",
                color: "#FFFFFF",
                width: 24,
                height: 24,
                "&:hover": {
                  backgroundColor: "#04139A",
                  opacity: 0.9,
                },
              }}
            >
              <CameraAlt sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={4} px={5}>
          {/* Name */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              required
              label={labels.userName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.userName}
              placeholder="Enter User Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Grid>
          {/* Email */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              required
              label={labels.userEmail}
              isTooltipRequired={true}
              tooltipTitle={tooltips.userEmail}
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Grid>
          {/* Phone */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.userPhone}
              isTooltipRequired={true}
              tooltipTitle={tooltips.userPhone}
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Grid>
          {/* Communication Preference */}
          <Grid pl={1.5} size={{ xs: 6 }}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel
                component="legend"
                id="communication-preference-radio-buttons-group"
              >
                <Box display={"flex"} gap={0.5}>
                  <Typography variant="body2" color="#121212">
                    {labels.userCommunicationPreference}
                  </Typography>
                  <TooltipComponent
                    title={tooltips.userCommunicationPreference}
                    width={"12px"}
                    height={"12px"}
                  />
                </Box>
              </FormLabel>
              <RadioGroup
                aria-labelledby="communication-preference-radio-buttons-group"
                name="communicationPreference"
                row
                value={formData.communicationPreference}
                onChange={(e) => {
                  handleChange("communicationPreference", e.target.value);
                }}
              >
                <FormControlLabel
                  value="Email"
                  control={<Radio />}
                  label={
                    <Typography variant="body1" color="text.primary">
                      Email
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="Phone"
                  control={<Radio />}
                  label={
                    <Typography variant="body1" color="text.primary">
                      Phone
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="Both"
                  control={<Radio />}
                  label={
                    <Typography variant="body1" color="text.primary">
                      Both
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/* Company */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              required
              label={labels.userCompany}
              isTooltipRequired={true}
              tooltipTitle={tooltips.userCompany}
              placeholder="Enter company name"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </Grid>
          {/* Role */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled /// this is select
              required
              isTooltipRequired={true}
              tooltipTitle={tooltips.userType}
              value={formData.role}
              label={labels.userType}
              displayEmpty
              onChange={(e) => handleChange("role", e.target.value as string)}
              renderValue={(selected: any) => {
                if (!selected) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                      }}
                    >
                      Select User Type
                    </Typography>
                  );
                } else {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                      }}
                    >
                      {roles.find((r) => selected === r.roleId)?.name}
                    </Typography>
                  );
                }
              }}
            >
              {roles.map((item) => (
                <MenuItem key={item.roleId} value={item.roleId}>
                  {item.name}
                </MenuItem>
              ))}
            </SelectStyled>
          </Grid>{" "}
        </Grid>

        <Box m={5}>
          <Divider />
        </Box>

        <Stack direction={"column"} mt={4} mx={5}>
          <Typography variant="body1" color="primary.main" fontWeight={550}>
            Assigned Organization
          </Typography>

          {/* Organisation */}
          <Grid size={{ xs: 12, sm: 6 }} sx={{ height: "100%" }} mt={3}>
            <FormControl fullWidth size="medium">
              <InputLabel
                id="org-label"
                sx={{
                  backgroundColor: "#fff",
                  px: "4px",
                  "& .MuiFormLabel-asterisk": {
                    color: "#FB2020",
                  },
                }}
                shrink
              >
                <Box display={"flex"} gap={0.5} alignItems={"center"}>
                  <Typography variant="body1" color="#121212" fontWeight={500}>
                    {labels.userOrganization}
                  </Typography>
                  {/* <Typography variant="body1" color="#FB2020" fontWeight={550}>
                  *
                </Typography> */}
                  <TooltipComponent
                    title={tooltips.userOrganization}
                    width={"16px"}
                    height={"16px"}
                  />
                </Box>
              </InputLabel>
              <Select
                required
                labelId="org-label"
                label={
                  <Box display={"flex"} gap={0.5} alignItems={"center"}>
                    <Typography
                      variant="body1"
                      color="#121212"
                      fontWeight={500}
                    >
                      {labels.userOrganization}
                    </Typography>
                    {/* <Typography variant="body1" color="#FB2020" fontWeight={550}>
                    *
                  </Typography> */}
                    <TooltipComponent
                      title={tooltips.userOrganization}
                      width={"16px"}
                      height={"16px"}
                    />
                  </Box>
                }
                value={selectedOrg}
                onChange={(e) => {
                  handleChange("organization", e.target.value);
                  setSelectedOrg(e.target.value);
                }}
                sx={{
                  height: "56px",
                  bgcolor: "#fff",
                  borderRadius: "8px",
                  fontSize: "16px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& .MuiSelect-select": {
                    padding: "14px 16px",
                    fontSize: "16px",
                  },
                }}
                renderValue={(val) => {
                  if (!val) return "Select Organisation";
                  return (
                    organisations.find((o) => o.organizationId === val)?.name ||
                    ""
                  );
                }}
              >
                <ListSubheader>
                  <TextField
                    size="small"
                    placeholder="Search Organization"
                    value={orgSearch}
                    onChange={(e) => setOrgSearch(e.target.value)}
                    fullWidth
                  />
                </ListSubheader>

                {filteredOrgs.map((org) => (
                  <MenuItem key={org.organizationId} value={org.organizationId}>
                    <Radio checked={selectedOrg === org.organizationId} />
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Stack>

        <Box m={5}>
          <Divider />
        </Box>

        <Box
          mx={5}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          mb={5}
        >
          <Box display={"flex"} gap={3}>
            <Button
              sx={{
                width: 113,
                height: 40,
                border: "1px solid primary.main",
                borderRadius: 1,
              }}
              variant="outlined"
              onClick={() => setIsEditConfirmOpen(true)}
            >
              <Typography variant="body1" color="primary.main" fontWeight={500}>
                Cancel
              </Typography>
            </Button>
            <Button
              sx={{ width: 110, height: 40, borderRadius: 1 }}
              variant="contained"
              loading={loading}
              onClick={() => {
                handleUpdate();
              }}
              disabled={
                formData.name === "" ||
                formData.email === "" ||
                formData.company === "" ||
                formData.role === ""
              }
              disableRipple
            >
              <Typography variant="body1" color="#F4F4F4" fontWeight={600}>
                {"Save"}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UserEditFormModal;
