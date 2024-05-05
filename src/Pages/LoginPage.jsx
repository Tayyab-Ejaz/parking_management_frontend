import React, { useEffect, useState } from "react";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import useAxiosInstance from "../Hooks/axiosInstance";
import { useAlert } from "../Contexts/AlertContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  const {showAlert} = useAlert();

  if (user) {
    navigate("/");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await axiosInstance
      .post("/login", {
        user: { email, password },
      })
      .catch((error) => {
        console.log("Error", error.message);
      });

    if (response?.status === 200) {
      login(response.data.data.user);
    } else {
      showAlert(`Email or Paassword is invalid.`)
    }
  };

  return (
    <Container>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </Container>
  );
};

export default LoginPage;
