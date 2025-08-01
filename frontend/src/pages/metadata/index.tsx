import {
    Box,
    Typography,
    Stack,
    Select,
    MenuItem,
    Button,
    InputAdornment,
    TextField,
    InputLabel,
    FormControl,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import MetaDataCard from '@/components/meta-data/MetaDataCard'
import React, { useState, useEffect } from 'react'
import { FilterAltOutlined, Search } from '@mui/icons-material';
import { fetchMetaDatas, deleteMetaData } from '../api/meta-data';
import { MetaData } from '@/types/meta-data';
import ConfirmDialog from '@/components/ConfirmDialog';
import ToastComponent from '@/components/ToastComponent';
import ViewMetaDataModal from '@/components/meta-data/ViewMetaDataModal';

const Index = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [loading, setLoading] = useState(false);
    const [metaDatas, setMetaDatas] = useState<MetaData[]>();
    const [selectedMetaData, setSelectedMetaData] = useState<MetaData | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isViewMetaDataModalOpen, setIsViewMetaDataModalOpen] = useState(false);
    const [isAddEditDeleteMDSuccessToastOpen, setIsAddEditDeleteMDSuccessToastOpen] = useState(false);
    const [addEditDeleteMDSuccessToastMessage, setAddEditDeleteMDSuccessToastMessage] = useState("");
    const [isDeleteMetaDataConfirmPopupOpen, setIsDeleteMetaDataConfirmPopupOpen] = useState(false);

    useEffect(() => {
        const getMetaDatas = async () => {
            try {
                setLoading(true);
                const data = await fetchMetaDatas();
                setMetaDatas(data);
            } catch (error) {
                console.error("Error fetching risk scenarios:", error);
            } finally {
                setLoading(false);
            }
        };
        getMetaDatas();
    }, [refreshTrigger]);

    //Function to handle the delete of a metadata
    const handleDeleteMetaData = async () => {
        try {
            if (selectedMetaData?.id) {
                const res = await deleteMetaData(
                    selectedMetaData?.id as number
                );
                console.log(res);
                setRefreshTrigger((prev) => prev + 1);
                setIsDeleteMetaDataConfirmPopupOpen(false);
                setIsAddEditDeleteMDSuccessToastOpen(true);
                setAddEditDeleteMDSuccessToastMessage(`${selectedMetaData.name} deleted`)
            } else {
                throw new Error("Invalid ID");
            }
        } catch (err) {
            console.log("Something went wrong", err);
            alert("Failed to Delete");
        }
    };

    return (
        <>

            {selectedMetaData && isViewMetaDataModalOpen && (<ViewMetaDataModal open={isViewMetaDataModalOpen} metaData={selectedMetaData} onClose={() => setIsViewMetaDataModalOpen(false)} />)}

            {selectedMetaData?.id && <ConfirmDialog open={isDeleteMetaDataConfirmPopupOpen} onClose={() => setIsDeleteMetaDataConfirmPopupOpen(false)} onConfirm={handleDeleteMetaData} title={"Delete " + selectedMetaData.name + "?"} description={"Are you sure about " + selectedMetaData.name + "?"} cancelText='Cancel' confirmText='Yes, Delete' confirmColor='#B20606' />}

            <ToastComponent open={isAddEditDeleteMDSuccessToastOpen} onClose={() => setIsAddEditDeleteMDSuccessToastOpen(false)} message={addEditDeleteMDSuccessToastMessage} toastBorder='1px solid #147A50'
                toastColor='#147A50'
                toastBackgroundColor='#DDF5EB'
                toastSeverity='success' />


            {/* Landing Page code*/}
            <Box p={2} paddingBottom={8}>
                <Box mb={3}>
                    {/* Row 1: Breadcrumb + Add Button */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        spacing={2}
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="body1" color="#121212" fontWeight={600}>
                            Metadata
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "primary.main",
                                textTransform: "none",
                                borderRadius: 1,
                                "&:hover": {
                                    backgroundColor: "#001080",
                                },
                            }}
                        >
                            Add Configuration
                        </Button>
                    </Stack>

                    {/* Row 2: Search + Sort */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        useFlexGap
                        flexWrap="wrap"
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                    >
                        {/* Search Bar */}
                        <TextField
                            size="small"
                            placeholder="Search by key, value"
                            variant="outlined"
                            sx={{
                                borderRadius: 1,
                                height: "40px",
                                width: "33%",
                                minWidth: 200,
                                backgroundColor: "#FFFFFF",
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Sort */}
                        <Stack
                            direction="row"
                            spacing={2}
                            flexWrap="wrap"
                            justifyContent={isMobile ? "flex-start" : "flex-end"}
                        >
                            <FormControl sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}>
                                <InputLabel id="sort-metadata">Sort</InputLabel>
                                <Select
                                    size="small"
                                    defaultValue="Alphabetical (A-Z)"
                                    label="Sort"
                                    labelId="sort-metadata"
                                >
                                    <MenuItem value="Latest First">Latest First</MenuItem>
                                    <MenuItem value="Oldest First">Oldest First</MenuItem>
                                    <MenuItem value="Alphabetical (A-Z)">Alphabetical (A-Z)</MenuItem>
                                    <MenuItem value="Alphabetical (Z-A)">Alphabetical (Z-A)</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="outlined"
                                endIcon={<FilterAltOutlined />}
                                onClick={() => console.log("Open Filter")}
                                sx={{
                                    textTransform: "none",
                                    borderColor: "#ccc",
                                    color: "black",
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: 1,
                                }}
                            >
                                Filter
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                <Stack spacing={2}>
                    {metaDatas && metaDatas?.length > 0 &&
                        metaDatas?.map((item, index) => (
                            <MetaDataCard key={index}
                                keyLabel={item.name}
                                values={item.supported_values}
                                onEdit={() => console.log('Edit clicked')}
                                onDelete={() => {
                                    setSelectedMetaData(item);
                                    setIsDeleteMetaDataConfirmPopupOpen(true);
                                }}
                                onClick={() => {
                                    setSelectedMetaData(item);
                                    setIsViewMetaDataModalOpen(true)
                                }}
                            />
                        ))}
                </Stack>
            </Box>
        </>

    )
}

export default Index