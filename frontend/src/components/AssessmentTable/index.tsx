import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";

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

interface Props {
  data: Assessment[];
  onMenuClick: (event: React.MouseEvent<HTMLElement>, runId: string) => void;
}

const AssessmentTable: React.FC<Props> = ({ data, onMenuClick }) => {
  const columnTemplate = "42px 160px 260px 80px 80px 80px 130px 160px 20px";

  return (
    <Box
      sx={{ overflow: "auto", maxHeight: "calc(100vh - 290px)" }}
      className="scroll-container"
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: columnTemplate,
          backgroundColor: "#91939A",
          borderRadius: 1,
          p: 2,
          alignItems: "center",
          gap: 2,
          width: "fit-content",
        }}
      >
        {[
          "Run ID",
          "Org",
          "Assessment Run Name",
          "Start Date",
          "Last Activity",
          "End Date",
          "Last Updated By",
          "Status",
          "",
        ].map((header, ind) => (
          <Typography
            key={header}
            variant="caption"
            color="#FFFFFF"
            fontWeight={600}
            textAlign={ind > 2 ? "center" : "left"}
          >
            {header}
          </Typography>
        ))}
      </Box>

      {/* Table Body (Card style rows) */}
      <Box sx={{ mt: 2 }}>
        {data.map((assessment) => (
          <Paper
            key={assessment.runId}
            variant="outlined"
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #E7E7E8",
              borderRadius: "8px",
              display: "grid",
              gridTemplateColumns: columnTemplate,
              alignItems: "center",
              gap: 2,
              "&:hover": {
                border: "1px solid #1976d2",
              },
              width: "fit-content",
              cursor: "pointer",
            }}
          >
            {/* Run ID */}
            <Typography>{assessment.runId}</Typography>

            {/* Org + Industry */}
            <Box>
              <Typography fontWeight={600}>{assessment.org}</Typography>
              <Typography variant="body2" color="text.secondary">
                {assessment.industry}
              </Typography>
            </Box>

            {/* Assessment Name + Description */}
            <Box>
              <Typography fontWeight={600}>{assessment.name}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {assessment.description}{" "}
                <span style={{ color: "#1976d2", cursor: "pointer" }}>
                  read more
                </span>
              </Typography>
            </Box>

            {/* Dates */}
            <Typography>{assessment.startDate}</Typography>
            <Typography>{assessment.lastActivity}</Typography>
            <Typography>{assessment.endDate}</Typography>

            {/* Last Modified */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={assessment.lastModifiedBy.avatar}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="body2">
                {assessment.lastModifiedBy.name}
              </Typography>
            </Box>

            {/* Status */}
            <Box textAlign={"center"}>
              <Typography variant="caption" fontWeight={600}>
                {assessment.status.progress}
                {"% Completed "}
                {assessment.status.closed && " • Closed"}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={assessment.status.progress}
                sx={{
                  height: 12,
                  borderRadius: 1,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      assessment.status.progress === 100
                        ? "#147A50"
                        : "#FFD966",
                  },
                }}
              />
            </Box>

            {/* Actions */}
            <IconButton onClick={(e) => onMenuClick(e, assessment.runId)}>
              <MoreVertIcon />
            </IconButton>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default AssessmentTable;
