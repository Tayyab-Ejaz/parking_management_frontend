import React, { useEffect, useState } from "react";
import ParkingSlotFilters from "./ParkingSlotFilters";
import ParkingSlotList from "./ParkingSlotList";
import CustomPagination from "../../components/CustomPagination";
import "../../css/ParkingSlot.css";
import useAxiosInstance from "../../Hooks/axiosInstance";
import {
  Grid,
  Container,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BookingConfirmationModal from "./BookingConfirmationModal";
import { useAlert } from "../../Contexts/AlertContext";

const ParkingSlotsIndex = () => {
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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };


  const handleCreateReservation = async (user = null) => {
    if (!filters.startTime || !filters.endTime) {
      console.error("Start Time and End Time are required");
      return;
    }

    try {
      await axiosInstance.post("/reservations", {
        reservation: {
          parking_slot_id: selectedSlot.id,
          start_time: filters.startTime,
          end_time: filters.endTime,
        },
      });

      navigate("/reservations");
      setModalOpen(false);
    } catch (error) {
      showAlert("Failed to book reservation:", "error")
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  const fetchParkingSlots = async (page = 1) => {
    try {
      const response = await axiosInstance.get("/parking_slots", {
        params: {
          page,
          start_time: filters.startTime,
          end_time: filters.endTime,
          disabled_only: filters.disabledOnly,
          has_shade: filters.hasShade,
          car_type_ids: filters.selectedCarTypes,
        },
      });

      setParkingSlots(response.data.parking_slots || []);
      setPagination({
        currentPage: response.data.current_page,
        totalPages: response.data.total_pages,
      });
    } catch (error) {
      console.error("Error fetching parking slots:", error.message);
    }
  };

  useEffect(() => {
    if (filters.startTime && filters.endTime) {
      fetchParkingSlots(pagination.currentPage);
    }
  }, [filters, pagination.currentPage]);

  return (
    <Container>
      <Box>
        <Typography variant="h4" align="center" py={2}>
          Search for Parking Slots
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
            {!filters.startTime || !filters.endTime ? (
              <div
                style={{ color: "red", fontSize: "20px", textAlign: "center" }}
              >
                {
                  "{ Please select Start Time and End Time to view parking slots}"
                }
              </div>
            ) : (
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
                  onBookSlot={handleBookSlot}
                />

                {!!selectedSlot && (
                  <BookingConfirmationModal
                    open={modalOpen}
                    slot={selectedSlot}
                    startTime={filters.startTime}
                    endTime={filters.endTime}
                    onConfirm={handleCreateReservation}
                    onCancel={handleModalCancel}
                  />
                )}
                
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ParkingSlotsIndex;
