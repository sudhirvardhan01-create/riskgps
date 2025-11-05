// pages/index.tsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SecurityIcon from "@mui/icons-material/Security";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "600px",
  backgroundImage: 'url("/4.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 30, 60, 0.75)",
    zIndex: 1,
  },
  [theme.breakpoints.down("md")]: {
    height: "500px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "450px",
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  color: "#ffffff",
  padding: theme.spacing(3),
  maxWidth: "900px",
}));

const CTAButton = styled(Button)(({ theme }) => ({
  padding: "14px 36px",
  fontSize: "16px",
  fontWeight: 600,
  borderRadius: "8px",
  textTransform: "none",
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    padding: "12px 28px",
    fontSize: "14px",
    width: "100%",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.75rem",
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(3),
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  "& svg": {
    fontSize: "32px",
    color: "#ffffff",
  },
}));

export default function LandingPage() {
  const theme = useTheme();

  const features = [
    {
      icon: <SecurityIcon />,
      title: "Connects Cyber Risk to Business Resilience",
      description:
        "A business-centric governance and resilience platform that maps your critical operations to the cyber threats that could disrupt them — exposing systemic risks before they impact performance.",
    },
    {
      icon: <VisibilityIcon />,
      title: "Delivers Real-Time Visibility and Action",
      description:
        "Provides continuous insight into enterprise risk posture and offers actionable recommendations that direct cybersecurity investments where they deliver the most business value. Demonstrates that cyber investments are indeed reducing risks",
    },
    {
      icon: <AccountTreeIcon />,
      title: "Embeds Cybersecurity Into Business Governance",
      description:
        "Aligns security, risk, finance, and executives through shared visibility — from risk-prioritized protection plans and business-centric reporting to demonstrable ROI on every cyber initiative. Enables executives answer - “How well are my critical business processes protected by our cyber program?”",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Redefines How CISOs Lead",
      description:
        "Challenges the traditional approach to cyber risk by empowering CISOs to build, communicate, and manage cybersecurity as a business enabler — fully aligned with enterprise priorities and outcomes.",
    },
    {
      icon: <ShieldOutlinedIcon />,
      title: "Builds Proactive Resilience",
      description:
        "Predicts risks and potential impacts, guides contingency planning, and minimizes business disruption before events unfold.",
    },
  ];

  const howRiskGPSWorks = [
    {
      id: "1",
      title: "Discover",
      desc: "Uncovers which business processes truly drive revenue and trust — giving leaders a clear view of what’s most critical to protect and where disruption would hurt the business most.",
    },
    {
      id: "2",
      title: "Assess",
      desc: "Predicts the risk scenarios most likely to affect your industry and then assesses internal control data, audit findings, and external threat feeds to reveal how prepared your organization is to withstand those threats.",
    },
    {
      id: "3",
      title: "Prioritize",
      desc: "Applies defense-in-depth analysis, business impact modeling, and adversary behavior in your industry to focus security investments where they deliver the greatest reduction in risk and ensure continuity of critical operations.",
    },
    {
      id: "4",
      title: "Plan & Remediate",
      desc: "Builds a defensible, outcome-driven cyber program that prevents business disruption through proactive action. Aligns risk prioritized remediation plans, budgets, and executive reporting to demonstrate measurable risk reduction and long-term resilience. ",
    },
  ];

  const handleLearnMore = () => {
    window.open("https://bluoceancyber.com/riskgps/", "_blank");
  };

  const handleRequestDemo = () => {
    window.open("https://bluoceancyber.com/contact/", "_blank");
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
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
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
              fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
            }}
          >
            Your Only Process Defense Platform For Preventing Business
            Disruption Before It Happens
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
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
                borderColor: "#ffffff",
                color: "#ffffff",
                "&:hover": {
                  borderColor: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
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
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1.05rem", md: "1.2rem" },
              lineHeight: 1.8,
              color: "text.secondary",
              maxWidth: "900px",
              mx: "auto",
            }}
          >
            RiskGPS™ helps organizations prevent business disruption by
            predicting and preventing process outages before they happen.
            Instead of chasing checklist security, RiskGPS focuses on what truly
            matters — protecting the business processes that move money, data,
            and trust.
          </Typography>
        </Box>

        {/* What It Does Section */}
        <Box sx={{ mb: 8 }}>
          <SectionTitle variant="h3" align="center">
            What It Does
          </SectionTitle>
          {/* First Row - 3 Items */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {features.slice(0, 3).map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <FeatureCard elevation={2}>
                  <CardContent>
                    <IconWrapper>{feature.icon}</IconWrapper>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ lineHeight: 1.7, color: "text.secondary" }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>

          {/* Second Row - 2 Items Centered */}
          <Grid
            container
            spacing={4}
            sx={{
              justifyContent: "center",
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            {features.slice(3, 5).map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 6 }} key={index + 3}>
                <FeatureCard elevation={2}>
                  <CardContent>
                    <IconWrapper>{feature.icon}</IconWrapper>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ lineHeight: 1.7, color: "text.secondary" }}
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
            backgroundColor:
              theme.palette.mode === "light" ? "#f5f5f5" : "#1e1e1e",
            borderRadius: "12px",
            padding: { xs: 4, md: 6 },
            textAlign: "center",
          }}
        >
          <SectionTitle variant="h3">Why It Matters</SectionTitle>
          <Typography
            variant="h6"
            sx={{
              lineHeight: 1.8,
              color: "text.primary",
              fontWeight: 500,
              maxWidth: "800px",
              mx: "auto",
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
      </Container>

      {/* How It Works Section */}
      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? "#e8e7e7ff" : "#1a1a1a",
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <SectionTitle variant="h3" align="center" sx={{ color: "orange" }}>
            How RiskGPS Works
          </SectionTitle>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {howRiskGPSWorks.map((item) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                key={item.id}
                border={"8px solid #fff"}
                sx={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    textAlign: "left",
                    p: 3,
                  }}
                  // border={"1px solid text.secondary"}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      backgroundColor: "orange",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    {item.id}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", textAlign: "left" }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Container
        maxWidth="md"
        sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: "1.75rem", md: "2.5rem" },
          }}
        >
          Ready to Prevent Business Disruption?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "text.secondary",
            fontSize: { xs: "1rem", md: "1.1rem" },
            lineHeight: 1.8,
          }}
        >
          Join RiskGPS. Discover how we can protect your critical business
          processes.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CTAButton
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={handleRequestDemo}
          >
            Request a Demo
          </CTAButton>
          <CTAButton
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleLearnMore}
          >
            Learn More
          </CTAButton>
        </Box>
      </Container>
    </Box>
  );
}
