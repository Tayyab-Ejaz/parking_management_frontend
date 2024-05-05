import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";
import useAuth from "../../Hooks/useAuth";

const ReservationCard = ({ reservation, onUpdateStatus, onDeleteReservation }) => {
  const { parking_slot, start_time, end_time, status, user } = reservation;
  const { isAdmin } = useAuth();

  return (
    <Card sx={{ marginBottom: 2, width: "100%" }}>
      <CardContent>
        <Grid container>
          <Grid item md={10} xs={12}>
            <Typography variant="h6">
              Parking Slot: {parking_slot?.description}
            </Typography>
            <Typography>
              Start Time: {new Date(start_time).toLocaleString()}
            </Typography>
            <Typography>
              End Time: {new Date(end_time).toLocaleString()}
            </Typography>

            <Typography>Status: {status}</Typography>

            {isAdmin() && <Typography>Username: {user.name}</Typography>}
          </Grid>
          <Grid item md={2} xs={12}>
            {!["checked_in", "cancelled", "checked_out"].find(
              (st) => st == status
            ) && (
              <Box mb={1}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  fullWidth
                  onClick={() => onUpdateStatus(reservation, "cancelled")}
                >
                  Cancel Reservation
                </Button>
              </Box>
            )}
            {!["checked_in", "cancelled", "checked_out"].find(
              (st) => st == status
            ) && (
              <Box mb={1}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  fullWidth
                  onClick={() => onUpdateStatus(reservation, "checked_in")}
                >
                  Check In
                </Button>
              </Box>
            )}
            {["checked_in"].find((st) => status == st) && (
              <Box mb={1}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  fullWidth
                  onClick={() => onUpdateStatus(reservation, "checked_out")}
                >
                  Checkout
                </Button>
              </Box>
            )}

            {isAdmin() && (
              <Box mb={1}>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  fullWidth
                  onClick={() => onDeleteReservation(reservation)}
                >
                  Delete Resrvation
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
