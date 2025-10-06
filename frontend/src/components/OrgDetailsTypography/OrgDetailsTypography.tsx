import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface OrgDetailsTypographyProps extends Omit<TypographyProps, 'color' | 'variant'> {
  color?: string;
  variant?: 'label' | 'value';
  children: React.ReactNode;
}

const OrgDetailsTypography: React.FC<OrgDetailsTypographyProps> = ({
  color,
  variant = 'label',
  children,
  sx = {},
  ...props
}) => {
  const finalColor = color || (variant === 'label' ? "#91939A" : "#484848");
  
  // Map custom variants to Material-UI Typography variants
  const muiVariant = variant === 'label' ? 'caption' : 'body2';

  return (
    <Typography
      variant={muiVariant}
      color={finalColor}
      sx={sx}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default OrgDetailsTypography;
