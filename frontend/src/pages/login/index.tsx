import { LoginForm, SignUpForm } from "@/components/Login";
import theme from "@/styles/theme";
import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";

const LoginPage = () => {
  const [currentForm, setCurrentForm] = useState("login");

  return (
    <Grid container spacing={21.5} sx={{ padding: 5, minHeight: "100vh" }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
            borderRadius: 2,
            backgroundImage: 'url("/4.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
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
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              color: "#ffffff",
              padding: theme.spacing(3),
            }}
          >
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
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {currentForm === "login" ? (
          <LoginForm setCurrentForm={setCurrentForm} />
        ) : (
          <SignUpForm setCurrentForm={setCurrentForm} />
        )}
      </Grid>
    </Grid>
  );
};

export default LoginPage;
