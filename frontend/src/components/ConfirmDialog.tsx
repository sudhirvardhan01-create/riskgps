import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    confirmColor?: string; // background color for confirm button
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    cancelText = "Cancel",
    confirmText = "Confirm",
    confirmColor = "#B20606",
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{
            paper: {
                sx: { borderRadius: 2, border: '1px solid #E7E7E7', paddingTop: 2, paddingX: 1}
            }
        }}>
            <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', top: 16, right: 16, color: 'primary.main', padding: 0 }}>
                <CloseIcon fontSize="small" />
            </IconButton>
            <DialogTitle sx={{ textAlign: "center", mb: 0, pb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {title}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body2" sx={{ color: "#91939A", textAlign: 'center', fontWeight: 500 }}>{description}</Typography>
            </DialogContent>

            <DialogActions sx={{ display: 'flex', justifyContent: "center", pb: 3, gap: 3, alignItems: 'center', pt: 1.5 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: 1,
                        border: "1px solid #04139A",
                        px: 3,
                        textTransform: "none",
                    }}
                >
                    <Typography variant="body1" color="primary.main" fontWeight={500}>{cancelText}</Typography>
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        backgroundColor: confirmColor,
                        borderRadius: 1,
                        px: 3,
                        textTransform: "none",
                        ml: '0 !important',
                        "&:hover": {
                            backgroundColor: confirmColor,
                            opacity: 0.9,
                        },
                    }}
                >
                    <Typography variant="body1" color="#F4F4F4" fontWeight={600}>{confirmText}</Typography>
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
