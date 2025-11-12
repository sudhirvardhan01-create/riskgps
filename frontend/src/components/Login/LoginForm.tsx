import { login } from "@/pages/api/AuthAPI";
import { Refresh, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  setCurrentForm: (form: "login" | "signup") => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setCurrentForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const { loginContext } = useAuth();

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // if (!captchaValue) {
    //   alert("Please verify the reCAPTCHA.");
    //   return;
    // }

    login(formData.email, formData.password)
      .then((data) => {
        loginContext(data.data.accessToken, data.data.refreshToken);
        Cookies.set("user", JSON.stringify(data.data.user));
        router.push("/library"); // Redirect to dashboard after login
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
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
            sx={{ fontSize: 32, fontWeight: 600, mb: 8 }}
          >
            Log in to RiskGPS
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
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
                    "& fieldset": { borderColor: "#D0D5DD" },
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
                    "& fieldset": { borderColor: "#D0D5DD" },
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          type="button"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box sx={{ textAlign: "right", mb: 4 }}>
              <Link href="#" passHref>
                <Typography
                  component="span"
                  variant="body1"
                  fontWeight={600}
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot password?
                </Typography>
              </Link>
            </Box>

            {/* <Box sx={{ mb: 3 }}>
              <ReCAPTCHA
                sitekey="YOUR_RECAPTCHA_SITE_KEY"
                onChange={handleCaptchaChange}
              />
            </Box> */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableRipple
              color="primary"
              disabled={
                formData.email === "" || formData.password === ""
                // !captchaValue
              }
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                height: 40,
                boxShadow: "none",
              }}
            >
              Login
            </Button>

            {/* <Box sx={{ textAlign: "center", mt: 2.5 }}>
              <Typography variant="body2" sx={{ color: "#475467" }}>
                Want to know more about RiskGPS?{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "#1849A9",
                    textDecoration: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => setCurrentForm("signup")}
                >
                  Sign Up
                </Typography>
              </Typography>
            </Box> */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginForm;
