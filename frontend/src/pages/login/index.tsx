import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  Container,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import Link from "next/link";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Grid container spacing={21.5} sx={{ padding: 5, minHeight: "100vh" }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            bgcolor: "#D9D9D9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "90vh",
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "90vh",
            maxWidth: 416,
          }}
        >
          <Container maxWidth="sm">
            <Box
              sx={{
                my: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                color="primary.main"
                sx={{
                  fontSize: 32,
                  fontWeight: 500,
                  mb: 8,
                }}
              >
                Log in to SeaHorse
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                <Box sx={{ mb: 5 }}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    size="small"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& fieldset": {
                          borderColor: "#D0D5DD",
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    id="password"
                    size="small"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& fieldset": {
                          borderColor: "#D0D5DD",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            type="button"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ textAlign: "right", mb: 4 }}>
                  <Link href="/forgot-password" passHref>
                    <Typography
                      component="span"
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontSize: "14px",
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Forgot password?
                    </Typography>
                  </Link>
                </Box>

                {/* <Box sx={{ mb: 3 }}>
                  <div
                    className="g-recaptcha"
                    data-sitekey="your-recaptcha-site-key"
                  />
                </Box> */}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disableRipple={true}
                  color="primary"
                  sx={{
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    height: 40,
                  }}
                >
                  Login
                </Button>

                <Box sx={{ textAlign: "center", mt: 2.5 }}>
                  <Typography variant="body2" sx={{ color: "#475467" }}>
                    Want to know more about SeaHorse?{" "}
                    <Link href="/signup" passHref>
                      <Typography
                        component="span"
                        sx={{
                          color: "#1849A9",
                          textDecoration: "none",
                          fontWeight: 600,
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Sign Up
                      </Typography>
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
