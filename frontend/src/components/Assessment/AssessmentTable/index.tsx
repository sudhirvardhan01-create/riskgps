import {
  Avatar,
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useState } from "react";
import { Assessment } from "@/types/assessment";

interface Props {
  data: Assessment[];
  onMenuClick: (event: React.MouseEvent<HTMLElement>, runId: string) => void;
  onCardClick: (runId: string) => void;
}

const columnTemplate = "42px 160px 260px 80px 80px 80px 130px 160px 20px";

const userData = {
  name: "Harsh Kansal",
  avatar: "/path/to/avatar",
};

// ✅ Child row component
const AssessmentRow: React.FC<{
  assessment: Assessment;
  onMenuClick: Props["onMenuClick"];
  onCardClick: Props["onCardClick"];
}> = ({ assessment, onMenuClick, onCardClick }) => {
  const [expanded, setExpanded] = useState(false);
  const desc = assessment.assessmentDesc || "";

  const limit = 25;
  const isLong = desc.length > limit;
  const displayedText =
    expanded || !isLong ? desc : desc.slice(0, limit) + "...";

  return (
    <Paper
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
        "&:hover": { border: "1px solid #1976d2" },
        width: "100%",
        cursor: "pointer",
      }}
      onClick={() => onCardClick(assessment.runId)}
    >
      {/* Run ID */}
      <Typography>{assessment.runId}</Typography>

      {/* Org + Industry */}
      <Box>
        <Typography fontWeight={600}>{assessment.orgName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {assessment.orgDesc}
        </Typography>
      </Box>

      {/* Assessment Name + Description */}
      <Box>
        <Typography fontWeight={600}>{assessment.assessmentName}</Typography>
        <Typography variant="caption">
          <span style={{ color: "#484848", fontWeight: 600 }}>
            Description:{" "}
          </span>
          <span style={{ color: "#91939A", textWrap: "wrap" }}>
            {displayedText}{" "}
          </span>
          {isLong && (
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "read less" : "read more"}
            </span>
          )}
        </Typography>
      </Box>

      {/* Dates */}
      <Typography variant="body2">
        {new Date(assessment.startDate).toLocaleDateString()}
      </Typography>
      <Typography variant="body2">
        {new Date(assessment.lastActivity).toLocaleDateString()}
      </Typography>
      <Typography variant="body2">
        {assessment.endDate &&
          new Date(assessment.endDate).toLocaleDateString()}
      </Typography>

      {/* Last Modified */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar src={userData.avatar} sx={{ width: 24, height: 24 }} />
        <Typography variant="body2">{userData.name}</Typography>
      </Box>

      {/* Status */}
      <Box textAlign={"center"}>
        <Typography variant="caption" fontWeight={600}>
          {assessment.status == "in_progress" ? 30 : 100}
          {"% Completed "}
          {assessment.status == "closed" && " • Closed"}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={assessment.status == "in_progress" ? 30 : 100}
          sx={{
            height: 12,
            borderRadius: 1,
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                assessment.status == "completed" ? "#147A50" : "#FFD966",
            },
          }}
        />
      </Box>

      {/* Actions */}
      <IconButton onClick={(e) => onMenuClick(e, assessment.runId)}>
        <MoreVertIcon />
      </IconButton>
    </Paper>
  );
};

// ✅ Main table
const AssessmentTable: React.FC<Props> = ({
  data,
  onMenuClick,
  onCardClick,
}) => {
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: columnTemplate,
          backgroundColor: "#91939A",
          borderRadius: 1,
          p: 2,
          alignItems: "center",
          gap: 2,
          width: "100%",
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

      {/* Body */}
      <Box sx={{ mt: 2, overflow: "auto", maxHeight: "calc(100vh - 344px)" }}>
        {data.map((assessment) => (
          <AssessmentRow
            key={assessment.runId}
            assessment={assessment}
            onMenuClick={onMenuClick}
            onCardClick={onCardClick}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AssessmentTable;
