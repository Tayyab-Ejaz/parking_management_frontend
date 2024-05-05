import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import useAxiosInstance from "../Hooks/axiosInstance";
import { useAlert } from "../Contexts/AlertContext";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxiosInstance();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/signup", {
        user: { email, password, name },
      });

      if (response.status === 200) {
        showAlert("Signed up successfully. Please login.", "success");
        setLoading(false);
        navigate("/login");
      }
    } catch (error) {
      setLoading(false);
      showAlert(
        `Sign-up failed. ${
          error.response ? error.response.data.message : error.message
        }`,
        "error"
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSignup}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </Container>
  );
};

export default SignUpPage;
