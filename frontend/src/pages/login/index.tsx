import { LoginForm, SignUpForm } from "@/components/Login";
import { Box, Container, Grid } from "@mui/material";
import { useState } from "react";

const LoginPage = () => {
  const [currentForm, setCurrentForm] = useState("login");

  return (
    <Grid container spacing={21.5} sx={{ padding: 5, minHeight: "100vh" }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            bgcolor: "#D9D9D9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
            borderRadius: 2,
          }}
        >
          <Container maxWidth="sm">
            <Box
              sx={{
                textAlign: "center",
                mb: 4,
              }}
            />
          </Container>
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
