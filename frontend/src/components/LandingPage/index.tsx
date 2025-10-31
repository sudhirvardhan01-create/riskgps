// pages/index.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '600px',
  backgroundImage: 'url(/hero-image.jpg)', // Replace with your image path
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 30, 60, 0.75)',
    zIndex: 1,
  },
  [theme.breakpoints.down('md')]: {
    height: '500px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '450px',
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  color: '#ffffff',
  padding: theme.spacing(3),
  maxWidth: '900px',
}));

const CTAButton = styled(Button)(({ theme }) => ({
  padding: '14px 36px',
  fontSize: '16px',
  fontWeight: 600,
  borderRadius: '8px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    padding: '12px 28px',
    fontSize: '14px',
    width: '100%',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.75rem',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: '32px',
    color: '#ffffff',
  },
}));

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <SecurityIcon />,
      title: 'Process Mapping',
      description:
        'Maps how your business operates and identifies where attackers could strike.',
    },
    {
      icon: <TrendingUpIcon />,
      title: 'Risk Quantification',
      description:
        'Quantifies cyber risk in financial and operational terms so leaders can make informed decisions.',
    },
    {
      icon: <PriorityHighIcon />,
      title: 'Smart Prioritization',
      description:
        'Prioritizes actions that directly reduce disruption and align with business goals.',
    },
  ];

  const handleLearnMore = () => {
    window.open('https://bluoceancyber.com/riskgps/', '_blank');
  };

  const handleRequestDemo = () => {
    // Redirect to login or coming soon page
    window.location.href = '/login'; // Change to your desired route
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            BluOcean RiskGPS™
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            }}
          >
            Your Only Process Defense Platform For Preventing Business Disruption
            Before It Happens
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
            }}
          >
            <CTAButton
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleLearnMore}
            >
              Learn More
            </CTAButton>
            <CTAButton
              variant="outlined"
              size="large"
              onClick={handleRequestDemo}
              sx={{
                borderColor: '#ffffff',
                color: '#ffffff',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Request a Demo
            </CTAButton>
          </Box>
        </HeroContent>
      </HeroSection>

      {/* Introduction Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.05rem', md: '1.2rem' },
              lineHeight: 1.8,
              color: 'text.secondary',
              maxWidth: '900px',
              mx: 'auto',
            }}
          >
            RiskGPS™ helps organizations prevent business disruption by predicting
            and preventing process outages before they happen. Instead of chasing
            checklist security, RiskGPS focuses on what truly matters — protecting
            the business processes that move money, data, and trust.
          </Typography>
        </Box>

        {/* What It Does Section */}
        <Box sx={{ mb: 8 }}>
          <SectionTitle variant="h3" align="center">
            What It Does
          </SectionTitle>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{xs: 12, sm: 6, md: 4,}} key={index}>
                <FeatureCard elevation={2}>
                  <CardContent>
                    <IconWrapper>{feature.icon}</IconWrapper>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ lineHeight: 1.7, color: 'text.secondary' }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why It Matters Section */}
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#1e1e1e',
            borderRadius: '12px',
            padding: { xs: 4, md: 6 },
            textAlign: 'center',
          }}
        >
          <SectionTitle variant="h3">Why It Matters</SectionTitle>
          <Typography
            variant="h6"
            sx={{
              lineHeight: 1.8,
              color: 'text.primary',
              fontWeight: 500,
              maxWidth: '800px',
              mx: 'auto',
              mb: 2,
            }}
          >
            Most security tools defend assets. RiskGPS defends processes that
            actually keep your business running.
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mt: 3,
            }}
          >
            No process outages from cyber. Not once. Not ever.
          </Typography>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            mt: 8,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CTAButton
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={handleLearnMore}
          >
            Learn More About RiskGPS
          </CTAButton>
          <CTAButton
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleRequestDemo}
          >
            Request a Demo
          </CTAButton>
        </Box>
      </Container>
    </Box>
  );
}
