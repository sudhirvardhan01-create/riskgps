import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { register } from "@/pages/api/AuthAPI";

interface FormState {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  message: string;
  password: string;
  confirmPassword: string;
  communicationPreference: "Email" | "Phone" | "Both";
  captchaValue: string | null;
}

interface SignUpFormProps {
  setCurrentForm: (form: "login" | "signup") => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ setCurrentForm }) => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    organisation: "",
    message: "",
    communicationPreference: "Email",
    captchaValue: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value: string | null) => {
    setFormData((prev) => ({ ...prev, captchaValue: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!formData.captchaValue) {
    //   alert("Please verify the reCAPTCHA.");
    //   return;
    // }

    if (formData.confirmPassword !== formData.password) {
      alert("Passwords do not match.");
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.organisation ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone,
      formData.organisation,
      formData.communicationPreference,
      formData.message,
      "User" // Assuming roleName is "User" for simplicity
    )
      .then((data) => {
        console.log("Registration successful:", data);
        setCurrentForm("login");
        alert("Registration successful! Please log in.");
      })
      .catch((error) => {
        console.error("Registration failed:", error);
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
            sx={{ fontSize: 32, fontWeight: 600, mb: 4 }}
          >
            Sign up for SeaHorse
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                placeholder="Enter name"
                size="small"
                required
                value={formData.name}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": { borderColor: "#D0D5DD" },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                placeholder="Enter email"
                type="email"
                size="small"
                required
                value={formData.email}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": { borderColor: "#D0D5DD" },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                placeholder="Enter password"
                type="password"
                size="small"
                required
                value={formData.password}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": { borderColor: "#D0D5DD" },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Enter confirm password"
                type="password"
                size="small"
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": { borderColor: "#D0D5DD" },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="phone"
                label="Phone"
                placeholder="Enter phone"
                size="small"
                value={formData.phone}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": { borderColor: "#D0D5DD" },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="#121212">
                    Communication Preference
                  </Typography>
                </FormLabel>
                <RadioGroup
                  row
                  name="communicationPreference"
                  value={formData.communicationPreference}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Email"
                    control={<Radio />}
                    label={
                      <Typography variant="body1" color="text.primary">
                        Email
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="Phone"
                    control={<Radio />}
                    label={
                      <Typography variant="body1" color="text.primary">
                        Phone
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="Both"
                    control={<Radio />}
                    label={
                      <Typography variant="body1" color="text.primary">
                        Both
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="organisation"
                label="Company"
                placeholder="Enter Company"
                size="small"
                required
                value={formData.organisation}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": { borderColor: "#D0D5DD" },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="message"
                label="Your Message"
                placeholder="Enter message"
                size="small"
                multiline
                minRows={3}
                value={formData.message}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": { borderColor: "#D0D5DD" },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <ReCAPTCHA
                sitekey="YOUR_RECAPTCHA_SITE_KEY"
                onChange={handleCaptchaChange}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableRipple
              color="primary"
              disabled={
                formData.name === "" ||
                formData.email === "" ||
                formData.organisation === "" ||
                formData.password === ""
                // !formData.captchaValue
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
              Sign Up
            </Button>

            <Box sx={{ textAlign: "center", mt: 2.5 }}>
              <Typography variant="body2" sx={{ color: "#475467" }}>
                Already have an account?{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "#1849A9",
                    textDecoration: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => setCurrentForm("login")}
                >
                  Log In
                </Typography>
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong style={{ color: "#000" }}>Please note:</strong> Signing
                up is not registration into the portal. Our dedicated SeaHorse
                team will reach out to you shortly for further communication.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUpForm;
