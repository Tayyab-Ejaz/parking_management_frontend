import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Parking Management System
        </Typography>

        {/* Hamburger menu for mobile */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            keepMounted
          >
            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
              Home
            </MenuItem>
            <MenuItem component={Link} to="/about" onClick={handleMenuClose}>
              About
            </MenuItem>
            {user ? (
              <>
                {isAdmin() && (
                  <>
                    <MenuItem
                      component={Link}
                      to="/admin/slots"
                      onClick={handleMenuClose}
                    >
                      Manage Slots
                    </MenuItem>

                    <MenuItem
                      component={Link}
                      to="/admin/customers"
                      onClick={handleMenuClose}
                    >
                      Manage Customers
                    </MenuItem>

                    <MenuItem
                      component={Link}
                      to="/reservations"
                      onClick={handleMenuClose}
                    >
                      Manage Reservations
                    </MenuItem>
                  </>
                )}

                {!isAdmin() && (
                  <>
                    <MenuItem
                      component={Link}
                      to="/slots"
                      onClick={handleMenuClose}
                    >
                      Parking Slots
                    </MenuItem>
                  </>
                )}

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                >
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  component={Link}
                  to="/login"
                  onClick={handleMenuClose}
                >
                  Login
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/signup"
                  onClick={handleMenuClose}
                >
                  Signup
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {user ? (
            <>
              {isAdmin() && (
                <>
                  <Button color="inherit" component={Link} to="/admin/slots">
                    Manage Slots
                  </Button>

                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin/customers"
                  >
                    Manage Customers
                  </Button>

                  <Button
                    color="inherit"
                    component={Link}
                    to="/reservations"
                  >
                    Manage Reservations
                  </Button>
                </>
              )}

              {!isAdmin() && (
                <>
                  <Button color="inherit" component={Link} to="/slots">
                    Parking Slots
                  </Button>
                  <Button color="inherit" component={Link} to="/reservations">
                    My reservations
                  </Button>
                </>
              )}

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
