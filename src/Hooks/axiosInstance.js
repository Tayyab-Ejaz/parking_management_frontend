import axios from "axios";
import { useAlert } from "../Contexts/AlertContext";
import useAuth from "./useAuth";

const useAxiosInstance = () => {
  const { showAlert } = useAlert();
  const { logout } = useAuth();

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
    timeout: 10000,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        showAlert("Unathenticated access. Please login again.", "error");
        logout();
      }
      if (error.response && error.response.status === 403) {
        showAlert("You are not athorized to access this resrouce", "error");
      } else if (error.response && error.response.status === 500) {
        showAlert("Internal Server Error. Please try again later.", "error");
      } else if (error.response) {
        showAlert(
          `Somethign went wrong. ${error.response.status}: ${error.response.data.message}`,
          "error"
        );
      } else if (error.request) {
        showAlert(
          `No response received from server: ${error.message}`,
          "error"
        );
      } else {
        console.error("Error during login:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosInstance;
