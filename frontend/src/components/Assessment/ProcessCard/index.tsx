import React from "react";
import { Box, Checkbox, Paper, Typography } from "@mui/material";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";


interface ProcessItem { id: string; name: string; }


export default function ProcessCard({ item, checked, onToggle }: { item: ProcessItem; checked: boolean; onToggle: () => void; }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 1.25,
                borderRadius: 2,
                border: "1px solid #E6E8EF",
                position: "relative",
                overflow: "hidden",
                '&:before': {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: checked ? "#223DFF" : "#EEF0FF",
                },
            }}
        >
            <Box display="flex" alignItems="center" gap={1}>
                <Checkbox
                    checked={checked}
                    onChange={onToggle}
                    icon={<RadioButtonUncheckedRoundedIcon fontSize="small" />}
                    checkedIcon={<DoneRoundedIcon fontSize="small" />}
                    sx={{ p: 0.5, color: "#6F7287", '&.Mui-checked': { color: "#223DFF" } }}
                />
                <Typography fontSize={12.5} color="#1F1F2C">
                    {item.name}
                </Typography>
            </Box>
        </Paper>
    );
}