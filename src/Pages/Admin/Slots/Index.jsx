import React, { useEffect, useState } from "react";
import ParkingSlotFilters from "../../Slots/ParkingSlotFilters";
import ParkingSlotList from "../../Slots/ParkingSlotList";
import CustomPagination from "../../../components/CustomPagination";
import "../../../css/ParkingSlot.css";
import useAxiosInstance from "../../../Hooks/axiosInstance";
import { Grid, Container, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BookingConfirmationModal from "../../Slots/BookingConfirmationModal";
import EditParkingSlotModal from "./EditParkingSlotModal";
import { useAlert } from "../../../Contexts/AlertContext";

const AdminParkingSlotsIndex = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [filters, setFilters] = useState({
    startTime: "",
    endTime: "",
    disabledOnly: false,
    hasShade: false,
    selectedCarTypes: [],
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resrvationModalOpen, setResrvationModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();

  const handleUpdateSlot = (slot) => {
    setSelectedSlot(slot);
    setEditModalOpen(true);
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setResrvationModalOpen(true);
  };

  const onUpdateSlot = async (slot) => {
    try {
      const response = await axiosInstance.put(
        `/admin/parking_slots/${slot.id}`,
        {
          parking_slot: slot,
        }
      );

      if (response.status == 200) {
        showAlert("Record updated successfully", "success");

        const updatedSlot = response.data;
        const updatedParkingSlots = parkingSlots.map((s) =>
          s.id === updatedSlot.id ? updatedSlot : s
        );

        setParkingSlots(updatedParkingSlots);

        setEditModalOpen(false);
      } else {
        showAlert(response.data.message, "error");
      }
    } catch (error) {
      showAlert("Failed to book reservation:", "error");
    }
  };

  const handleModalCancel = () => {
    setResrvationModalOpen(false);
  };

  const handleCreateReservation = async (user_id = null) => {
    if(!user_id) {
      showAlert("Please select atleast one user");
      return; 
    }

    if (!filters.startTime || !filters.endTime) {
      showAlert("Start Time and End Time are required");
      return;
    }

    try {
      await axiosInstance.post("/reservations", {
        reservation: {
          parking_slot_id: selectedSlot.id,
          start_time: filters.startTime,
          end_time: filters.endTime,
          user_id: user_id
        },
      });

      navigate("/reservations");
      setResrvationModalOpen(false);
    } catch (error) {
      showAlert("Failed to book reservation:", error.message);
    }
  };

  const fetchParkingSlots = async (page = 1) => {
    try {
      const response = await axiosInstance.get("/admin/parking_slots", {
        params: {
          page,
          start_time: filters.startTime,
          end_time: filters.endTime,
          disabled_only: filters.disabledOnly,
          has_shade: filters.hasShade,
          car_type_ids: filters.selectedCarTypes,
        },
      });

      setParkingSlots(response.data.parking_slots);
      setPagination({
        currentPage: response.data.current_page,
        totalPages: response.data.total_pages,
      });
    } catch (error) {
      console.error("Error fetching parking slots:", error.message);
    }
  };

  useEffect(() => {
    fetchParkingSlots(pagination.currentPage);
  }, [filters, pagination.currentPage]);

  return (
    <Container>
      <Box>
        <Typography variant="h4" align="center" py={2}>
          Manage Parking Slots
        </Typography>
      </Box>
      <Grid container spacing={2} className="">
        <Grid item xs={2}>
          <ParkingSlotFilters
            onFilterChange={(updatedFilters) => setFilters(updatedFilters)}
          />
        </Grid>
        <Grid item xs={10}>
          <Box py={5}>
            <>
              <CustomPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(pageNumber) =>
                  setPagination({ ...pagination, currentPage: pageNumber })
                }
              />

              <ParkingSlotList
                parkingSlots={parkingSlots}
                onBookSlot = {handleBookSlot}
                onUpdateSlot={handleUpdateSlot}
                filters={filters}
              />

              {!!selectedSlot && (
                <EditParkingSlotModal
                  slot={selectedSlot}
                  open={editModalOpen}
                  onClose={() => { setSelectedSlot(null);  setEditModalOpen(false)}}
                  onUpdate={(updatedSlot) => {
                    setSelectedSlot(null);
                    onUpdateSlot(updatedSlot);
                  }}
                />
              )}

              {!!selectedSlot && filters.startTime && filters.endTime && (
                <BookingConfirmationModal
                  open={resrvationModalOpen}
                  slot={selectedSlot}
                  startTime={filters.startTime}
                  endTime={filters.endTime}
                  onConfirm={handleCreateReservation}
                  onCancel={handleModalCancel}
                />
              )}
            </>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminParkingSlotsIndex;
