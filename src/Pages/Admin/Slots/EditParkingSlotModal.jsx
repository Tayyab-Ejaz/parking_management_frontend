import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";

import HourlyDropdown from "../../../components/HourlyDropdown";

import useAxiosInstance from "../../../Hooks/axiosInstance";

const daysOfWeek = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

const EditParkingSlotModal = ({ slot, open, onClose, onUpdate }) => {
  const axiosInstance = useAxiosInstance();
  const [description, setDescription] = useState(slot.description);
  const [pricePerHour, setPricePerHour] = useState(slot.price_per_hour);
  const [workingHours, setWorkingHours] = useState(slot.working_hours);

  const [forDisabledOnly, setForDisabledOnly] = useState(
    slot.for_disabled_only
  );
  const [hasShade, setHasShade] = useState(slot.has_shade);
  const [isAvailable, setIsAvailable] = useState(slot.is_available);
  const [cancelFeeInPercentage, setCancelFeeInPercentage] = useState(
    slot.cancel_fee_in_percentage
  );
  const [cancellationWindowInMinutes, setCancellationWindowInMinutes] =
    useState(slot.cancellation_window_in_minutes);
  const [carTypes, setCarTypes] = useState([]);
  const [selectedCarTypes, setSelectedCarTypes] = useState(
    slot.car_types.map((type) => type.name)
  );

  const handleUpdate = () => {
    onUpdate({
      ...slot,
      description,
      price_per_hour: pricePerHour,
      for_disabled_only: forDisabledOnly,
      has_shade: hasShade,
      is_available: isAvailable,
      cancel_fee_in_percentage: cancelFeeInPercentage,
      cancellation_window_in_minutes: cancellationWindowInMinutes,
      car_type_ids: selectedCarTypes
        .map((name) => carTypes.find((type) => type.name === name))
        .map((ct) => ct.id),
      working_hours_attributes: workingHours,
    });
    onClose();
  };

  useEffect(() => {
    const fetchCarTypes = async () => {
      try {
        const response = await axiosInstance.get("/car_types");
        setCarTypes(response.data);
      } catch (error) {
        console.error("Error fetching car types:", error.message);
      }
    };

    fetchCarTypes();
  }, []);

  const handleWorkingHourChange = (day, key, value) => {
    setWorkingHours((prev) =>
      prev.map((wh) => (wh.day === day ? { ...wh, [key]: value } : wh))
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Parking Slot</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          fullWidth
          margin="dense"
          label="Price per Hour"
          value={pricePerHour}
          onChange={(e) => setPricePerHour(e.target.value)}
          type="number"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={forDisabledOnly}
              onChange={(e) => setForDisabledOnly(e.target.checked)}
            />
          }
          label="For Disabled Only"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={hasShade}
              onChange={(e) => setHasShade(e.target.checked)}
            />
          }
          label="Has Shade"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
          }
          label="Is Available"
        />

        <TextField
          fullWidth
          margin="dense"
          label="Cancellation Fee (%)"
          value={cancelFeeInPercentage}
          onChange={(e) => setCancelFeeInPercentage(e.target.value)}
          type="number"
        />

        <TextField
          fullWidth
          margin="dense"
          label="Cancellation Window (minutes)"
          value={cancellationWindowInMinutes}
          onChange={(e) => setCancellationWindowInMinutes(e.target.value)}
          type="number"
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="car-types-label">Car Types</InputLabel>
          <Select
            labelId="car-types-label"
            multiple
            value={selectedCarTypes}
            onChange={(e) => {
              setSelectedCarTypes(Array.from(e.target.value));
            }}
          >
            {carTypes.map((type) => (
              <MenuItem key={type.id} value={type.name}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <Typography variant="h5" align="center" pt={3}>Set Working Hours</Typography>

        {daysOfWeek.map((dayObj) => {
          const workingHour = workingHours.find(
            (wh) => wh.day === dayObj.label
          ) || {
            day: dayObj.value,
            closed: true,
            start_time: "",
            end_time: "",
          };

          const isClosed = workingHour.closed;

          return (
            <Box
              key={dayObj.value}
              sx={{ display: "flex", alignItems: "center", my: 2 }}
            >
              <Typography sx={{ flex: "0 0 120px" }}>{dayObj.label}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isClosed}
                    onChange={(e) =>
                      handleWorkingHourChange(
                        dayObj.label,
                        "closed",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Closed"
              />
              {!isClosed && (
                <>
                  <HourlyDropdown
                    label="Start Time"
                    value={workingHour.start_time}
                    onChange={(e) =>
                      handleWorkingHourChange(
                        dayObj.label,
                        "start_time",
                        e.target.value
                      )
                    }
                  />
                  <HourlyDropdown
                    label="End Time"
                    value={workingHour.end_time}
                    onChange={(e) =>
                      handleWorkingHourChange(
                        dayObj.label,
                        "end_time",
                        e.target.value
                      )
                    }
                  />
                </>
              )}
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default EditParkingSlotModal;
