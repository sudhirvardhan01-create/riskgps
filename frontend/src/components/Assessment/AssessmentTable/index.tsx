import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
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

interface Props {
  data: Assessment[];
  onMenuClick: (event: React.MouseEvent<HTMLElement>, runId: string) => void;
  variant?: 'default' | 'businessUnit';
  businessUnitName?: string;
}

const AssessmentTable: React.FC<Props> = ({ data, onMenuClick, variant = 'default', businessUnitName }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  // Different column templates based on variant
  const columnTemplate = variant === 'businessUnit'
    ? "42px 170px 90px 90px 90px 120px 130px 15px"
    : "42px 160px 260px 80px 80px 80px 130px 145px 20px";

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const toggleDescription = (runId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(runId)) {
        newSet.delete(runId);
      } else {
        newSet.add(runId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 35) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Empty state for business unit variant
  if (variant === 'businessUnit' && data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="body1"
          sx={{
            color: '#121212',
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          No assessments available for {businessUnitName || 'business unit'}.
        </Typography>
      </Box>
    );
  }

  // Get data to display (with pagination for business unit variant)
  const displayData = variant === 'businessUnit'
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data;

  return (
    <Box>
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
        {(variant === 'businessUnit'
          ? [
            "Run ID",
            "Assessment Run Name",
            "Start Date",
            "Last Activity",
            "End Date",
            "Last Updated By",
            "Status",
            "",
          ]
          : [
            "Run ID",
            "Org",
            "Assessment Run Name",
            "Start Date",
            "Last Activity",
            "End Date",
            "Last Updated By",
            "Status",
            "",
          ]
        ).map((header, ind) => (
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
        {displayData.map((assessment) => (
          <Paper
            key={assessment.runId}
            variant="outlined"
            sx={{
              mb: 2,
              p: variant === 'businessUnit' ? 1 : 2,
              border: "1px solid #E7E7E8",
              borderRadius: "8px",
              display: "grid",
              gridTemplateColumns: columnTemplate,
              alignItems: "center",
              gap: variant === 'businessUnit' ? 1 : 2,
              "&:hover": {
                border: variant === 'businessUnit' ? "1px solid #04139A" : "1px solid #1976d2",
              },
              width: "100%",
              cursor: "pointer",
            }}
          >
            {/* Run ID */}
            <Typography>{assessment.runId}</Typography>

            {/* Org + Industry (only for default variant) */}
            {variant === 'default' && (
              <Box>
                <Typography fontWeight={600}>{assessment.org}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {assessment.industry}
                </Typography>
              </Box>
            )}

            {/* Assessment Name + Description */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: variant === 'businessUnit' ? 400 : 600,
                  verticalAlign: 'middle',
                  color: variant === 'businessUnit' ? '#484848' : 'inherit',
                  margin: variant === 'businessUnit' ? 0 : 'auto',
                  padding: variant === 'businessUnit' ? 0 : 'auto'
                }}
              >
                {assessment.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 400,
                  verticalAlign: 'middle',
                  color: variant === 'businessUnit' ? '#91939A' : 'text.secondary',
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                  margin: variant === 'businessUnit' ? 0 : 'auto',
                  padding: variant === 'businessUnit' ? 0 : 'auto'
                }}
              >
                {variant === 'businessUnit' ? (
                  <>
                    <span style={{ color: '#484848' }}>Description: </span>
                    {expandedDescriptions.has(assessment.runId)
                      ? assessment.description
                      : truncateText(assessment.description)
                    }{" "}
                    {assessment.description.length > 35 && (
                      <span
                        style={{ color: "#04139A", cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDescription(assessment.runId);
                        }}
                      >
                        {expandedDescriptions.has(assessment.runId) ? 'read less' : 'read more'}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {expandedDescriptions.has(assessment.runId)
                      ? assessment.description
                      : truncateText(assessment.description)
                    }{" "}
                    {assessment.description.length > 35 && (
                      <span
                        style={{ color: "#1976d2", cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDescription(assessment.runId);
                        }}
                      >
                        {expandedDescriptions.has(assessment.runId) ? 'read less' : 'read more'}
                      </span>
                    )}
                  </>
                )}
              </Typography>
            </Box>

            {/* Dates */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontStyle: 'normal',
                verticalAlign: 'middle',
                color: variant === 'businessUnit' ? '#484848' : 'inherit'
              }}
            >
              {assessment.startDate}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontStyle: 'normal',
                verticalAlign: 'middle',
                color: variant === 'businessUnit' ? '#484848' : 'inherit'
              }}
            >
              {assessment.lastActivity}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontStyle: 'normal',
                verticalAlign: 'middle',
                color: variant === 'businessUnit' ? '#484848' : 'inherit'
              }}
            >
              {assessment.endDate}
            </Typography>

            {/* Last Modified */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={assessment.lastModifiedBy.avatar}
                sx={{ width: 24, height: 24 }}
              >
                {assessment.lastModifiedBy.name.charAt(0)}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  fontStyle: 'normal',
                  verticalAlign: 'middle',
                  color: variant === 'businessUnit' ? "#484848" : 'inherit'
                }}
              >
                {assessment.lastModifiedBy.name}
              </Typography>
            </Box>

            {/* Status */}
            <Box textAlign={"center"}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: variant === 'businessUnit' ? 500 : 600,
                  fontStyle: 'normal',
                  color: variant === 'businessUnit' ? '#484848' : 'inherit',
                  mb: variant === 'businessUnit' ? 1 : 0
                }}
              >
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

      {/* Pagination (only for business unit variant) */}
      {variant === 'businessUnit' && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 2,
          px: 1,
          gap: 4,
          mb: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontStyle: 'normal',
                textAlign: 'center',
                color: '#191919'
              }}
            >
              View users per page
            </Typography>
            <FormControl size="small">
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #E7E7E8',
                    borderRadius: '8px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #002F75',
                    borderRadius: '8px',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #002F75',
                    borderRadius: '8px',
                  },
                  height: '37px',
                  fontSize: '14px',
                  color: "#191919",
                  borderRadius: '8px',
                  backgroundColor: "#E7E7E84D"
                }}
              >
                {[5, 10, 25].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontStyle: 'normal',
                textAlign: 'center',
                color: '#191919'
              }}
            >
              {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, data.length)} of {data.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                size="small"
                sx={{
                  border: '1px solid #002F75',
                  borderRadius: "8px",
                  width: 36,
                  height: 36,
                  '&:disabled': {
                    opacity: 0.5,
                  }
                }}
              >
                <Typography variant="h6" sx={{ color: '#002F75' }}>&lt;</Typography>
              </IconButton>
              <IconButton
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}
                size="small"
                sx={{
                  border: '1px solid #002F75',
                  borderRadius: "8px",
                  width: 36,
                  height: 36,
                  '&:disabled': {
                    opacity: 0.5,
                  }
                }}
              >
                <Typography variant="h6" sx={{ color: '#002F75' }}>&gt;</Typography>
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AssessmentTable;
