import { MetaData } from "@/types/meta-data";
import { Close, EditOutlined } from "@mui/icons-material";
import { Box, Chip, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";

interface ViewMetaDataModalProps {
    open: boolean;
    metaData: MetaData;
    onClose: () => void;
}

const ViewMetaDataModal: React.FC<ViewMetaDataModalProps> = ({
    open,
    metaData,
    onClose,
}: ViewMetaDataModalProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{
            paper: {
                sx: { borderRadius: 2 }
            }
        }}>
            <DialogTitle>
                <Stack
                    display={"flex"}
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Stack display={"flex"} direction="row" justifyContent={"center"} alignItems={"center"} gap={2}>
                        <Typography variant="h6" fontWeight={550}>Configuration</Typography>
                    </Stack>

                    <Box display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}>
                        <IconButton onClick={() => {
                            // setSelectedRiskScenario(riskScenarioData);
                            // setIsEditRiskScenarioOpen(true)
                        }}>
                            <EditOutlined sx={{ color: "primary.main" }} />
                        </IconButton>
                        <IconButton onClick={onClose}>
                            <Close sx={{ color: "primary.main" }} />
                        </IconButton>
                    </Box>
                </Stack>
                <Divider sx={{ mt: 2, mb: 0.5 }} />
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={550} fontSize={"14px"}>
                                Key
                            </Typography>
                            <Typography variant="body2" fontWeight={500} fontSize={"16px"}>
                                {metaData.name}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={550} fontSize={"14px"}>
                                Values
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" spacing={1}>
                                {metaData?.supported_values && metaData?.supported_values?.length > 0 ? (
                                    metaData?.supported_values?.map((value) => (
                                        <Chip
                                            key={value}
                                            label={value}
                                            sx={{ borderRadius: '2px', bgcolor: '#E7E7E8', color: 'text.primary', fontWeight: "500", fontSize: "14px" }}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.disabled" fontWeight={500} fontSize={"16px"}>
                                        No values assigned
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={550} fontSize={"14px"}>
                                Input Type
                            </Typography>
                            <Typography variant="body2" fontWeight={500} fontSize={"16px"} sx={{ textTransform: "capitalize" }}>
                                {metaData.input_type}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={550} fontSize={"14px"}>
                                Applies To
                            </Typography>
                            <Typography variant="body2" fontWeight={500} fontSize={"16px"} sx={{ textTransform: "capitalize" }}>
                                {metaData.applies_to}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )

}

export default ViewMetaDataModal