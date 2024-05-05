import React, { useState } from "react";
import useAxiosInstance from "../Hooks/axiosInstance";
import { useAlert } from "../Contexts/AlertContext";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const axiosInstance = useAxiosInstance();
  const { showAlert } = useAlert();
  const { navigate } = useNavigate();

  const handlesignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/signup", {
        user: { email, password, name },
      });

      if (response.status == 200) {
        showAlert("Signed Up Successfully. Please login", "success");
        navigate("/login");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handlesignup}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
    </div>
  );
};

export default SignUpPage;
