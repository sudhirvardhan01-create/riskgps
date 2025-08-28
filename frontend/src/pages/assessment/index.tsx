import AssessmentModal from "@/components/Assessment/AssessmentModal";
import AssessmentTable from "@/components/Assessment/AssessmentTable";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";

interface Assessment {
  runId: string;
  org: string;
  industry: string;
  name: string;
  description: string;
  startDate: string;
  lastActivity: string;
  endDate: string;
  lastModifiedBy: {
    name: string;
    avatar: string;
  };
  status: {
    progress: number;
    closed?: boolean;
  };
}

const mockData: Assessment[] = [
  {
    runId: "6299",
    org: "ABC Company",
    industry: "Outpatient Services",
    name: "Outpatient Services - Mar 23",
    description: "Lorem ipsum dolor sit amet",
    startDate: "10/02/2024",
    lastActivity: "10/02/2024",
    endDate: "-",
    lastModifiedBy: {
      name: "Karan Gautam",
      avatar: "/path/to/avatar",
    },
    status: {
      progress: 85,
    },
  },
  {
    runId: "6299",
    org: "ABC Company",
    industry: "Outpatient Services",
    name: "Outpatient Services - Mar 23",
    description: "Lorem ipsum dolor sit amet",
    startDate: "10/02/2024",
    lastActivity: "10/02/2024",
    endDate: "-",
    lastModifiedBy: {
      name: "Karan Gautam",
      avatar: "/path/to/avatar",
    },
    status: {
      progress: 100,
    },
  },
  {
    runId: "6299",
    org: "ABC Company",
    industry: "Outpatient Services",
    name: "Outpatient Services - Mar 23",
    description: "Lorem ipsum dolor sit amet",
    startDate: "10/02/2024",
    lastActivity: "10/02/2024",
    endDate: "-",
    lastModifiedBy: {
      name: "Karan Gautam",
      avatar: "/path/to/avatar",
    },
    status: {
      progress: 100,
      closed: true,
    },
  },
];

const options = [
  { label: "All", value: 0 },
  { label: "In Progress", value: 1 },
  { label: "Completed", value: 2 },
  { label: "Closed", value: 3 },
];

const AssessmentDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(
    null
  );
  const [assessmentStatusFilter, setAssessmentStatusFilter] = useState(mockData)
  const [open, setOpen] = useState(false);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    runId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssessment(runId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAssessment(null);
  };

  const handleStatusFilter = (ind: number) => {
    setTabValue(ind)

    switch (ind) {
      case 0:
        setAssessmentStatusFilter(mockData)
        break;
      case 1:
        setAssessmentStatusFilter(mockData.filter(item => item.status.progress < 100))
        break;
      case 2:
        setAssessmentStatusFilter(mockData.filter(item => item.status.progress == 100 && !item.status.closed))
        break;
      case 3:
        setAssessmentStatusFilter(mockData.filter(item => item.status.closed))
        break;
    }
  }

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
                    borderColor: tabValue === index ? "primary.dark" : "#E7E7E8",
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
                Start Assessment
              </Typography>
            </Button>
          </Box>
        </Box>

        <AssessmentTable data={assessmentStatusFilter} onMenuClick={handleMenuClick} />

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

      <AssessmentModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default AssessmentDashboard;
