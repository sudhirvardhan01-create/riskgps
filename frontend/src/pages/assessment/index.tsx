import AssessmentModal from "@/components/Assessment/AssessmentModal";
import AssessmentTable from "@/components/Assessment/AssessmentTable";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAssessment } from "../api/assessment";
import { useRouter } from "next/router";

interface Assessment {
  assessmentId: string;
  assessmentName: string;
  assessmentDesc: string;
  runId: string;
  orgId: string;
  orgName: string;
  orgDesc?: string;
  businessUnitId: string;
  businessUnitName: string;
  businessUnitDesc?: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  lastActivity: Date;
}

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

  const handleCardClick = (runId: string) => {
    setSelectedAssessment(runId);
    router.push("/assessment/assessmentProcess");
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
          <MenuItem onClick={handleMenuClose}>Publish</MenuItem>
          <MenuItem onClick={handleMenuClose}>Close</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </Box>

      <AssessmentModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default AssessmentDashboard;
