import React, { useState, useEffect } from "react";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { useAlert } from "../Contexts/AlertContext";
import useAxiosInstance from "../Hooks/axiosInstance";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (user) {
      if (isAdmin()) {
        navigate("/admin/slots");
      } else {
        navigate("/slots");
      }
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/login", {
        user: { email, password },
      });

      if (response.status === 200) {
        login(response.data.data.user);
        setLoading(false);
        if (isAdmin()) {
          navigate("/admin/slots");
        } else {
          navigate("/slots");
        }
      }
    } catch (error) {
      setLoading(false);
      showAlert(
        `Email or password is invalid. ${
          error.response ? error.response.data.message : error.message
        }`,
        "error"
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
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
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Container>
  );
};

export default LoginPage;
