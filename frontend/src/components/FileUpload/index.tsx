import React, { ChangeEvent, useState, DragEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import { Close, CloudUploadOutlined, Download } from "@mui/icons-material";

interface FileUploadProps {
  open: boolean;
  onClose: () => void;
  onFileSelect: (file : File | null) => void;
  onDownload: () => void;
  onUpload: () => void;
  file: File | null,
  title: string;
  downloadTemplateText?: string;
  cancelText?: string;
  uploadText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  open,
  onClose,
  onFileSelect,
  onUpload,
  onDownload,
  file,
  title,
  downloadTemplateText = "Download Template",
  cancelText = "Cancel",
  uploadText = "Upload",
}) => {
  
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const validateFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Only .csv files are allowed");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            border: "1px solid #E7E7E7",
            paddingTop: 2,
            paddingX: 1,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={550} color="#121212">
          {title}
        </Typography>
        <IconButton onClick={onClose} sx={{ padding: "0px !important" }}>
          <Close sx={{ color: "primary.main" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack direction={"column"} gap={2} mt={1}>
          <Box display={"flex"} flexDirection={"column"} gap={1}>
            <Box
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
                onFileSelect(null);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed #91939A",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragging ? "#f0f0f0" : "#fafafa",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
              display={"flex"}
              flexDirection={"column"}
              gap={2}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <CloudUploadOutlined sx={{ fontSize: 40, color: "#91939A" }} />

              <Typography variant="body1" color="text.primary">
                {isDragging
                  ? "Drop your CSV file here..."
                  : "Drag & drop your CSV file here, or click below"}
              </Typography>

              <Button
                variant="contained"
                sx={{ borderRadius: 1, textTransform: "none" }}
                component="label"
              >
                <Typography variant="body1" fontWeight={500}>
                  Browse CSV
                </Typography>
                <input
                  type="file"
                  hidden
                  accept=".csv,text/csv"
                  onChange={handleFileSelect}
                />
              </Button>
            </Box>
            {error && (
              <Typography
                variant="body2"
                color="error"
                textAlign={"center"}
                fontWeight={600}
              >
                {error}
              </Typography>
            )}
          </Box>
          {file && (
            <Stack direction={"row"} gap={0.5} textAlign={"center"} alignSelf={"center"}>
              <Typography variant="body2" fontWeight={500} color="text.primary">
                Selected file:{" "}
              </Typography>
              <Typography variant="body2" fontWeight={600} color="#121212">
                {file.name}
              </Typography>
            </Stack>
          )}
          <Button
            sx={{
              height: 40,
              width: 250,
              padding: 0,
              marginLeft: -2
            }}
            variant="text"
            onClick={onDownload}
            endIcon={<Download />}
          >
            <Typography variant="body1" color="primary.main" fontWeight={600}>
              {downloadTemplateText}
            </Typography>
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pt: 1.5,
          pb: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Box display={"flex"} gap={3}>
          <Button
            onClick={onClose}
            sx={{
              width: 113,
              height: 40,
              borderRadius: 1,
              border: "1px solid #04139A",
            }}
            variant="outlined"
          >
            <Typography variant="body1" color="primary.main">
              {cancelText}
            </Typography>
          </Button>
          <Button
            disabled = {!file}
            disableRipple
            sx={{
              width: 110,
              height: 40,
              borderRadius: 1,
            }}
            variant="contained"
            onClick={onUpload}
          >
            <Typography variant="body1" color="#F4F4F4" fontWeight={600}>
              {uploadText}
            </Typography>
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default FileUpload;
