import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const baseDate = "2000-01-01";
const HourlyDropdown = ({ label, value, onChange }) => {
  const times = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`
  );
  const isoTimestamps = times.map((time) => `${baseDate}T${time}:00.000Z`);

  return (
    <FormControl fullWidth mx={2}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange}>
        {isoTimestamps.map((time) => (
          <MenuItem key={time} value={time}>
            {new Date(time).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default HourlyDropdown;
