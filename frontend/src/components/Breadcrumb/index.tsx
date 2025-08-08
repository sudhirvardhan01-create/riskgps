import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";

type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <Typography variant="h6">{"/"}</Typography>,
}) => {
  return (
    <Breadcrumbs separator={separator} aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const content = (
          <Box display="flex" alignItems="center" gap={2.5}>
            {item.icon}
            <Typography variant="h6">{item.label}</Typography>
          </Box>
        );

        if (isLast) {
          return (
            <Typography
              key={index}
              color="primary.main"
              variant="h6"
              fontWeight={600}
            >
              {content}
            </Typography>
          );
        }

        return item.href ? (
          <Link
            key={index}
            underline="hover"
            color="inherit"
            href={item.href}
            onClick={item.onClick}
          >
            {content}
          </Link>
        ) : (
          <Link
            key={index}
            underline="hover"
            color="inherit"
            component="button"
            onClick={item.onClick}
          >
            {content}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
