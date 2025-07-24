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
                sx: { borderRadius: 2, border: '1px solid #E7E7E7'}
            }
        }}>
            <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', top: 4, right: 4, color: 'primary.main' }}>
                <CloseIcon fontSize="small" />
            </IconButton>
            <DialogTitle sx={{ textAlign: "center", mb: 0, pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#484848' }}>
                    {title}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Typography sx={{ color: "#91939A", fontSize: 14, textAlign: 'center', fontWeight: 400 }}>{description}</Typography>
            </DialogContent>

            <DialogActions sx={{ display: 'flex', justifyContent: "center", pb: 3, gap: 3, alignItems: 'center' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        color: "primary.main",
                        borderRadius: 1,
                        border: "1px solid #04139A",
                        px: 3,
                        fontWeight: 400,
                        textTransform: "none",
                    }}
                >
                    {cancelText}
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        backgroundColor: confirmColor,
                        borderRadius: 1,
                        color: "#F4F4F4",
                        px: 3,
                        fontWeight: 600,
                        textTransform: "none",
                        ml: '0 !important',
                        "&:hover": {
                            backgroundColor: confirmColor,
                            opacity: 0.9,
                        },
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
