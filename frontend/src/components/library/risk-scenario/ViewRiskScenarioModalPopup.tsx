import { EditNotificationsSharp } from "@mui/icons-material";
import { Box, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Switch, ToggleButton, Typography } from "@mui/material";
import ToggleSwitch from "../toggleSwitch/ToggleSwitch";

interface ViewRiskScenarioModalProps {
    open: boolean;
    onClose: () => void;
}
const ViewRiskScenarioModal: React.FC<ViewRiskScenarioModalProps> = ({open, onClose}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                        <Typography variant="h6">Risk Scenario ID#12123456789</Typography>
                        <ToggleSwitch/>
                        <Typography sx={{color: "#147A50", fontWeight: 600}} variant="body2">
                            Enabled
                        </Typography>
                    </Box>

                    <Box>
                        <IconButton>
                            <EditNotificationsSharp/>
                        </IconButton>
                        <IconButton>
                            <EditNotificationsSharp/>
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
            {/* <Divider sx={{mx: 2?., m  .}}/> */}
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12}}>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">Risk Scenario</Typography>
                            <Typography variant="body2" fontWeight={500}>The Fund/Wire Transfer System is not working for extended period of time</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12}}>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">Risk Statement</Typography>
                            <Typography variant="body2" fontWeight={500}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pulvinar ligula at pulvinar pretium. Suspendisse vitae eleifend ante. Sed aliquam velit quis ante pretium, vel elementum purus dapibus.</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12}}>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">Risk Description</Typography>
                            <Typography variant="body2" fontWeight={500}>This is related to the Fund Transfer Process.</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6}}>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">Domain</Typography>
                            <Typography variant="body2" fontWeight={500}>NIST, GDPR</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6}}>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">Process</Typography>
                            <Typography variant="body2" fontWeight={500}>Process 1, Process 2, Process 3</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{my: 2}}></Divider>
                <Grid container spacing={2} sx={{ backgroundColor: "#E7E7E8", padding: 1}}>
                    <Grid size={{ xs: 4}}>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">Created By</Typography>
                            <Typography variant="body2" fontWeight={500}>Person Name</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 4}}>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">Created On</Typography>
                            <Typography variant="body2" fontWeight={500}>2 Jan 2024</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 4}}>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">Last Updated On</Typography>
                            <Typography variant="body2" fontWeight={500}>8 Jan 2024</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default ViewRiskScenarioModal;