import { Box, Button, Typography } from "@mui/material";
import React from "react";

interface ButtonTabsProps {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
  items: string[];
  mitreTabTitle?: string;
  isMITRETabRequired?: boolean;
}

const ButtonTabs: React.FC<ButtonTabsProps> = ({
  selectedTab,
  setSelectedTab,
  items,
  mitreTabTitle,
  isMITRETabRequired,
}) => {
  return (
    <Box display={"Flex"} flexDirection={"row"} gap={1.25} mb={3}>
      {mitreTabTitle && isMITRETabRequired && <Button
        onClick={() => setSelectedTab(mitreTabTitle)}
        sx={{
          borderRadius: 1,
          border:
            selectedTab === mitreTabTitle
              ? "1px solid #04139A"
              : "1px solid #E7E7E8",
          backgroundColor:
            selectedTab === mitreTabTitle
              ? "#EDF3FCA3"
              : "#fff",
        }}
      >
        <Typography variant="body2" color="text.primary" fontWeight={selectedTab === mitreTabTitle
              ? 550
              : 500}>
          {mitreTabTitle}
        </Typography>
      </Button>}
      {items.map((item) => (
        <Button
          key={item}
          onClick={() => setSelectedTab(item)}
          sx={{
            borderRadius: 1,
            border:
              selectedTab === item
                ? "1px solid #04139A"
                : "1px solid #E7E7E8",
            backgroundColor:
              selectedTab === item
                ? "#EDF3FCA3"
                : "#fff",
          }}
        >
          <Typography variant="body2" color="text.primary" fontWeight={selectedTab === item
              ? 550
              : 500}>
            {item}
          </Typography>
        </Button>
      ))}
    </Box>
  );
};

export default ButtonTabs;
