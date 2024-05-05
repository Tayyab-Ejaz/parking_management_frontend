import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import LoginPage from "../Pages/LoginPage";
import SignupPage from "../Pages/SignUpPage";
import CustomersIndex from "../Pages/Admin/Customers/index";
import ReservationsIndex from "../Pages/Resrvations/ReservationsIndex";
import ParkingSlotsIndex from "../Pages/Slots";
import Header from "./Header";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import useAuth from "../Hooks/useAuth";
import AdminParkingSlotsIndex from "../Pages/Admin/Slots/Index";

const AppRouter = ({}) => {
  const { user, login } = useAuth();

  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes  */}
        <Route
          path="/"
          exact
          element={
            <ProtectedRoute user={user}>
              <ParkingSlotsIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/slots"
          exact
          element={
            <ProtectedRoute user={user}>
              <ParkingSlotsIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          exact
          element={
            <ProtectedRoute user={user}>
              <ReservationsIndex />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/customers"
          element={
            <AdminRoute user={user}>
              <CustomersIndex />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/slots"
          element={
            <AdminRoute user={user}>
              <AdminParkingSlotsIndex />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Container py={4}><Typography variant="h4" align={'center'} py={3}>404 - Not Found</Typography></Container>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
