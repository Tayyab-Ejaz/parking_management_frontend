import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import useAuth from "../../Hooks/useAuth";

const ParkingSlotList = ({
  parkingSlots,
  onBookSlot = () => {},
  onUpdateSlot = () => {},
  filters = {},
}) => {
  const { isAdmin } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "start",
      }}
    >
      {parkingSlots.length === 0 ? (
        <Typography>
          No parking slots available for the selected filters.
        </Typography>
      ) : (
        <>
          {parkingSlots.map((slot) => (
            <Card
              key={slot.id}
              sx={{ minWidth: 280, maxWidth: 320, width: 300 }}
            >
              <CardContent>
                <Typography variant="h6">{slot.description}</Typography>
                <Typography>Price per hour: {slot.price_per_hour}</Typography>
                <Typography>
                  Disabled access: {slot.for_disabled_only ? "Yes" : "No"}
                </Typography>
                <Typography>
                  Has shade: {slot.has_shade ? "Yes" : "No"}
                </Typography>
                <Typography mb={3}>
                  Available: {slot.is_available ? "Yes" : "No"}
                </Typography>
                <Typography mb={3} minHeight={"2rem"}>
                  Supported Car Types:{" "}
                  {slot.car_types.map((type) => type.name).join(", ")}
                </Typography>
                <Box display={"flex"} justifyContent={"space-between"}>
                  {(!isAdmin() ||
                    (isAdmin() && filters.startTime && filters.endTime)) && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onBookSlot(slot)}
                      >
                        Book Slot
                      </Button>
                    )}
                  {isAdmin() && (
                    <Button
                      variant="outlined"
                      onClick={() => onUpdateSlot(slot)}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
          
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
};

export default ParkingSlotList;
