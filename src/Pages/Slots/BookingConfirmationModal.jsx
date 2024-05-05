// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Grid,
//   Container,
//   DialogContentText,
// } from "@mui/material";

// const BookingConfirmationModal = ({
//   open,
//   slot,
//   startTime,
//   endTime,
//   onConfirm,
//   onCancel,
// }) => {
//   const start_time_formatted = new Date(startTime).toLocaleString();
//   const end_time_formatted = new Date(endTime).toLocaleString();
//   return (
//     <>
//       <Dialog open={open} onClose={onCancel}>
//         <DialogTitle>Confirm Booking</DialogTitle>
//         <DialogContent>
//           <p>Slot: {slot.description}</p>
//           <p>Start Time: {start_time_formatted}</p>
//           <p>End Time: {end_time_formatted}</p>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onCancel}>Cancel</Button>
//           <Button onClick={onConfirm} variant="contained" color="primary">
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default BookingConfirmationModal;


import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import useAxiosInstance from "../../Hooks/axiosInstance";
import useAuth from "../../Hooks/useAuth";

const BookingConfirmationModal = ({
  open,
  slot,
  startTime,
  endTime,
  onConfirm,
  onCancel,
}) => {
  const [userList, setUserList] = useState([]);  
  const [selectedUser, setSelectedUser] = useState(null);  
  const  axiosInstance = useAxiosInstance(); 
  const {isAdmin} = useAuth();

  useEffect(() => {
    if (isAdmin()) {
      const fetchUsers = async () => {
        try {
          const response = await axiosInstance.get("/admin/users");
          setUserList(response.data);
        } catch (error) {
          console.error("Error fetching user list:", error.message);
        }
      };
      fetchUsers(); 
    }
  }, []); 

  const start_time_formatted = new Date(startTime).toLocaleString();
  const end_time_formatted = new Date(endTime).toLocaleString();

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirm Booking</DialogTitle>
      <DialogContent>
        <p>Slot: {slot.description}</p>
        <p>Start Time: {start_time_formatted}</p>
        <p>End Time: {end_time_formatted}</p>
        
        {isAdmin() ? ( 
          <FormControl fullWidth margin="dense">
            <InputLabel id="select-user-label">Select User</InputLabel>
            <Select
              labelId="select-user-label"
              value={selectedUser || ""}
              onChange={(e) => setSelectedUser(e.target.value)} 
            >
              {userList.length === 0 ? (
                <MenuItem value="">
                  <CircularProgress size={20} /> 
                </MenuItem>
              ) : (
                userList.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          onClick={() => onConfirm(selectedUser)} 
          variant="contained"
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingConfirmationModal;
