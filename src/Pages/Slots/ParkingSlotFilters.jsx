
import React, { useEffect, useState } from "react";

import useAxiosInstance from "../../Hooks/axiosInstance";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ParkingSlotFilters component with improved validation
const ParkingSlotFilters = ({ onFilterChange }) => {
  const [carTypes, setCarTypes] = useState([]);
  const [filters, setFilters] = useState({
    startTime: null,
    endTime: null,
    disabledOnly: false,
    hasShade: false,
    selectedCarTypes: [],
  });
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    // Fetch available car types from the backend
    axiosInstance
      .get("/car_types")
      .then((response) => {
        setCarTypes(response.data);
      })
      .catch((error) =>
        console.error("Error fetching car types:", error.message)
      );
  }, []);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };

    if (
      key === "endTime" &&
      updatedFilters.startTime &&
      value &&
      value < updatedFilters.startTime
    ) {
      alert("End Time must be later than Start Time.");
      return;
    }

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Box className="filter-section">
      <h3>Filter Parking Slots</h3>
      <Box sx={{ mb: 2 }}>
        <label>Start Time:</label>
        <DatePicker
          selected={filters.startTime}
          onChange={(date) => handleFilterChange("startTime", date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Select a date and time"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <label>End Time:</label>
        <DatePicker
          selected={filters.endTime}
          onChange={(date) => handleFilterChange("endTime", date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Select a date and time"
        />
      </Box>
      <FormGroup sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.disabledOnly}
              onChange={(e) =>
                handleFilterChange("disabledOnly", e.target.checked)
              }
            />
          }
          label="Disabled Only"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.hasShade}
              onChange={(e) => handleFilterChange("hasShade", e.target.checked)}
            />
          }
          label="Has Shade"
        />
      </FormGroup>
      <Box sx={{ mb: 2 }}>
        <InputLabel id="car-types-label">Car Types</InputLabel>
        <FormControl fullWidth>
          <Select
            labelId="car-types-label"
            multiple
            value={filters.selectedCarTypes}
            onChange={(e) => {
              const selectedCarTypes = Array.from(e.target.value);
              handleFilterChange("selectedCarTypes", selectedCarTypes);
            }}
          >
            {carTypes.map((carType) => (
              <MenuItem key={carType.id} value={carType.id}>
                {carType.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default ParkingSlotFilters;
