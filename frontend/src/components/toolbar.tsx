// components/Toolbar.tsx
import {
    Box,
    Typography,
    Stack,
    Select,
    MenuItem,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    useTheme,
    useMediaQuery,
    InputLabel,
    FormControl,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import { FilterAltOutlined } from '@mui/icons-material';

const Toolbar = () => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box p={2}>
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
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton onClick={() => router.back()} size="small">
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body1" color="textPrimary">
                        Library /
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#0018A8', fontWeight: 600 }}>
                        Risk Scenarios
                    </Typography>
                </Stack>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#0018A8',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#001080',
                        },
                    }}
                >
                    Add Risk Scenario
                </Button>
            </Stack>

            {/* Row 2: Search + Sort + Filter */}
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
                    placeholder="Search by keywords"
                    variant="outlined"
                    sx={{ borderRadius: 0.5, height: "48px", width: "33%", minWidth: 200 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Right Controls */}
                <Stack
                    direction="row"
                    spacing={2}
                    flexWrap="wrap"
                    justifyContent={isMobile ? 'flex-start' : 'flex-end'}
                >
                    <FormControl>
                    <InputLabel id="sort-risk-scenarios">Sort</InputLabel>
                    <Select size="small" defaultValue="Risk ID (Ascending)" label="Sort" labelId="sort-risk-scenarios">
                        <MenuItem value="Risk ID (Ascending)">Risk ID (Ascending)</MenuItem>
                        <MenuItem value="Risk ID (Descending)">Risk ID (Descending)</MenuItem>
                        <MenuItem value="Created (Latest to Oldest)">Created (Latest to Oldest)</MenuItem>
                        <MenuItem value="Created (Oldest to Latest)">Created (Oldest to Latest)</MenuItem>
                        <MenuItem value="Updated (Latest to Oldest)">Updated (Latest to Oldest)</MenuItem>
                        <MenuItem value="Updated (Oldest to Latest)">Updated (Oldest to Latest)</MenuItem>
                    </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        endIcon={<FilterAltOutlined />}
                        sx={{
                            textTransform: 'none',
                            borderColor: '#ccc',
                            color: 'black',
                        }}
                    >
                        Filter
                    </Button>
                </Stack>
            </Stack>
        </Box>
        </Box>
    );
};

export default Toolbar;
