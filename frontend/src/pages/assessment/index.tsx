import AssessmentModal from "@/components/Assessment/AssessmentModal";
import AssessmentTable from "@/components/Assessment/AssessmentTable";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  getAssessment,
  getAssessmentById,
  saveAssessment,
} from "../api/assessment";
import { useRouter } from "next/router";
import { Assessment } from "@/types/assessment";
import withAuth from "@/hoc/withAuth";
import { useAssessment } from "@/context/AssessmentContext";
import Cookies from "js-cookie";

const options = [
  { label: "All", value: 0 },
  { label: "In Progress", value: 1 },
  { label: "Completed", value: 2 },
  { label: "Closed", value: 3 },
];

const AssessmentDashboard = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(
    null
  );
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentStatusFilter, setAssessmentStatusFilter] = useState<
    Assessment[]
  >([]);
  const [open, setOpen] = useState(false);
  const { setAssessment } = useAssessment();

  useEffect(() => {
    const getAssessments = async () => {
      const response = await getAssessment();
      setAssessments(response.data);
      setAssessmentStatusFilter(response.data);
    };
    getAssessments();
  }, []);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    runId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssessment(runId);
  };

  const handleCardClick = async (assessmentId: string) => {
    const response = await getAssessmentById(assessmentId);
    setAssessment(response.data);

    router.push("/assessment/assessmentProcess");
  };

  const handleMenuOptionClick = (option: string) => {
    switch (option) {
      case "publish":
        onSubmit("completed");
        break;
      case "close":
        onSubmit("closed");
        break;
      case "delete":
        break;
    }
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAssessment(null);
  };

  const handleStatusFilter = (ind: number) => {
    setTabValue(ind);

    switch (ind) {
      case 0:
        setAssessmentStatusFilter(assessments);
        break;
      case 1:
        setAssessmentStatusFilter(
          assessments.filter((item) => item.status == "in_progress")
        );
        break;
      case 2:
        setAssessmentStatusFilter(
          assessments.filter((item) => item.status == "completed")
        );
        break;
      case 3:
        setAssessmentStatusFilter(
          assessments.filter((item) => item.status == "closed")
        );
        break;
    }
  };

  const onSubmit = async (status: string) => {
    const assess = assessments.find(
      (item) => item.runId === selectedAssessment
    );

    await saveAssessment({
      assessmentId: assess?.assessmentId,
      assessmentName: assess?.assessmentName,
      assessmentDesc: assess?.assessmentDesc,
      orgId: assess?.orgId,
      orgName: assess?.orgName,
      orgDesc: assess?.orgDesc,
      businessUnitId: assess?.businessUnitId,
      businessUnitName: assess?.businessUnitName,
      businessUnitDesc: assess?.businessUnitDesc,
      status: status,
      userId: JSON.parse(Cookies.get("user") ?? "")?.id,
    });
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="#121212" fontWeight={600} mb={3}>
          Assessments
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            {options.map((option, index) => (
              <Button
                key={index}
                size="medium"
                variant="outlined"
                onClick={() => handleStatusFilter(index)}
                sx={{
                  mr: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  color: "text.primary",
                  backgroundColor: tabValue === index ? "#EDF3FCA3" : "#FFFFFF",
                  borderColor: tabValue === index ? "primary.main" : "#E7E7E8",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor:
                      tabValue === index ? "primary.dark" : "#f5f5f5",
                    borderColor:
                      tabValue === index ? "primary.dark" : "#E7E7E8",
                    color: tabValue === index ? "#FFFFFF" : "text.primary",
                  },
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<FilterAltOutlinedIcon />}
              sx={{
                borderRadius: 1,
                border: "1px solid #E7E7E8",
                color: "text.primary",
              }}
            >
              <Typography variant="body2">Filter</Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 1, boxShadow: "none" }}
              onClick={() => setOpen(true)}
            >
              <Typography variant="body2" fontWeight={600}>
                Create Assessment
              </Typography>
            </Button>
          </Box>
        </Box>

        <AssessmentTable
          data={assessmentStatusFilter}
          onMenuClick={handleMenuClick}
          onCardClick={handleCardClick}
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            disabled={
              (assessmentStatusFilter.find(
                (item) => item.runId == selectedAssessment
              )?.progress ?? 0) < 100
            }
            onClick={() => handleMenuOptionClick("publish")}
          >
            Publish
          </MenuItem>
          <MenuItem
            disabled={
              (assessmentStatusFilter.find(
                (item) => item.runId == selectedAssessment
              )?.progress ?? 0) < 100
            }
            onClick={() => handleMenuOptionClick("close")}
          >
            Close
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </Box>

      <AssessmentModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default withAuth(AssessmentDashboard);
