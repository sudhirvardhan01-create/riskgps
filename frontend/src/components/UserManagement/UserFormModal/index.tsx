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
  Checkbox,
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
import Image from "next/image";
import { CameraAlt } from "@mui/icons-material";
import { UserFormData } from "@/types/user";
import TooltipComponent from "@/components/TooltipComponent";
import { Organisation } from "@/types/assessment";
import { getOrganization } from "@/pages/api/organization";

interface UserFormModalProps {
  operation: "create" | "edit";
}

const UserFormModal: React.FC<UserFormModalProps> = ({ operation }) => {
  const initialUserFormData = {
    name: "",
    email: "",
    phone: "",
    communicationPreference: "Email",
    company: "",
    role: "",
    organization: "",
    isTermsAndConditionsAccepted: false,
    isActive: true,
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState<UserFormData>(initialUserFormData);
  const [orgSearch, setOrgSearch] = useState("");
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const filteredOrgs = organisations.filter((o) =>
    o.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  const handleChange = useCallback(
    (field: keyof UserFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData] // only depends on setter from props
  );

  console.log(formData);

  return (
    <Box
      width={"944px"}
      height={"744px"}
      borderRadius={4}
      border="1px solid #D9D9D9"
      mt={6}
      mb={2}
      sx={{
        overflow: "auto",
        scrollbarWidth: "none",
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
          <Avatar sx={{ backgroundColor: "#F2F0F0" }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/org-image-icon.png"
                alt="user-image"
                width={32}
                height={32}
                color="transparent"
              />
            </Box>
          </Avatar>
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
            multiline
            minRows={1}
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
            multiline
            minRows={1}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Grid>

        {/* Password */}
        <Grid mt={1} size={{ xs: 6 }}>
          <TextFieldStyled
            required
            label={labels.password}
            isTooltipRequired={true}
            tooltipTitle={tooltips.password}
            placeholder="Enter Password"
            value={formData.password}
            multiline
            minRows={1}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </Grid>

        {/* Confirm Password */}
        <Grid mt={1} size={{ xs: 6 }}>
          <TextFieldStyled
            required
            label={labels.confirmPassword}
            isTooltipRequired={true}
            tooltipTitle={tooltips.confirmPassword}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            multiline
            minRows={1}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
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
            multiline
            minRows={1}
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
            label={labels.userCompany}
            isTooltipRequired={true}
            tooltipTitle={tooltips.userCompany}
            placeholder="Enter company name"
            value={formData.company}
            multiline
            minRows={1}
            onChange={(e) => handleChange("company", e.target.value)}
          />
        </Grid>

        {/* Role */}
        {/* <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled /// this is select
              required
              isTooltipRequired={true}
              tooltipTitle={tooltips.assetCategory}
              value={assetFormData.assetCategory}
              label={labels.assetCategory}
              displayEmpty
              onChange={(e) =>
                handleChange("assetCategory", e.target.value as string)
              }
              renderValue={(selected: any) => {
                if (!selected) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                      }}
                    >
                      Select Asset Category
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
                      {selected}
                    </Typography>
                  );
                }
              }}
            >
              <MenuItem value={"A"}>A</MenuItem>
            </SelectStyled>
          </Grid> */}

        {/* Organisation */}
        <Grid size={{ xs: 12, sm: 6 }} sx={{ height: "100%" }} mt={1}>
          <FormControl fullWidth size="medium">
            <InputLabel id="org-label">
              <Typography variant="body1" color="#121212">
                Organization
              </Typography>
            </InputLabel>
            <Select
              labelId="org-label"
              label={
                <Typography variant="body1" color="#121212">
                  Organization
                </Typography>
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
                fontSize: "14px",
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
                  fontSize: "14px",
                },
              }}
              renderValue={(val) => {
                if (!val) return "Select Organisation";
                return (
                  organisations.find((o) => o.organizationId === val)?.name ||
                  ""
                );
              }}
              required
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
      </Grid>

      <Box m={5}>
        <Divider />
      </Box>

      <Box
        mx={5}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <FormControlLabel
          control={<Checkbox />}
          label={
            <Stack direction={"row"} gap={0.4}>
              <Typography variant="body2" fontWeight={300} color="text.primary">
                Agree to RiskGPS&apos;s
              </Typography>
              <Typography variant="body2" fontWeight={550} color="primary.main">
                Terms of Use
              </Typography>
              <Typography variant="body2" fontWeight={300} color="text.primary">
                and our
              </Typography>
              <Typography variant="body2" fontWeight={550} color="primary.main">
                Privacy Policy
              </Typography>
            </Stack>
          }
        />
        <Box display={"flex"} gap={3}>
          <Button
            sx={{
              width: 113,
              height: 40,
              border: "1px solid primary.main",
              borderRadius: 1,
            }}
            variant="outlined"
            // onClick={onClose}
          >
            <Typography variant="body1" color="primary.main" fontWeight={500}>
              Cancel
            </Typography>
          </Button>
          <Button
            sx={{ width: 110, height: 40, borderRadius: 1 }}
            variant="contained"
            // onClick={() => {
            //   onSubmit("published");
            // }}
            // disabled={
            //   assetFormData.applicationName === "" ||
            //   assetFormData.assetCategory?.length === 0
            // }
            disableRipple
          >
            <Typography variant="body1" color="#F4F4F4" fontWeight={600}>
              Add
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserFormModal;
