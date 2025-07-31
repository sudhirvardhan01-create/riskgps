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
} from '@mui/material';
import MetaDataCard from '@/components/meta-data/MetaDataCard'
import React, { useState, useEffect } from 'react'
import { Search } from '@mui/icons-material';
import { fetchMetaDatas } from '../api/meta-data';
import { MetaData } from '@/types/meta-data';

const Index = () => {

    const [loading, setLoading] = useState(false);
    const [metaDatas, setMetaDatas] = useState<MetaData[]>();

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
      }, []);

    return (
        <>
            <Box p={5} paddingBottom={10}>
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
                    </Stack>
                </Box>

                <Stack spacing={2}>
                    {metaDatas && metaDatas?.length > 0 &&
                    metaDatas?.map((item, index) => (
                        <MetaDataCard key={index}
                        keyLabel={item.name}
                        values={item.supported_values}
                        onEdit={() => console.log('Edit clicked')}
                        onDelete={() => console.log('Delete clicked')}
                    />
                    ))}
                </Stack>
            </Box>
        </>

    )
}

export default Index