import React, { useEffect, useState } from 'react';
import ReservationCard from './ReservationShowCard';
import Pagination from '@mui/material/Pagination';
import { Box, Container, Typography } from '@mui/material';
import useAxiosInstance from '../../Hooks/axiosInstance';

const ReservationsIndex = () => {
  const [reservations, setReservations] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const axiosInstance = useAxiosInstance();

  const fetchReservations = async (page = 1) => {
    try {
      const response = await axiosInstance.get('/reservations', {
        params: {
          page,
        },
      });

      setReservations(response.data.reservations);
      setPagination({
        currentPage: response.data.current_page,
        totalPages: response.data.total_pages,
      });
    } catch (error) {
      console.error('Error fetching reservations:', error.message);
    }
  };

  const updateReservationStatus = async (reservation, newStatus) => {
    try {
      await axiosInstance.patch(`/reservations/${reservation.id}/update_status`, {status: newStatus});
      fetchReservations(pagination.currentPage); 
    } catch (error) {
      console.error('Failed to cancel reservation:', error.message);
    }
  };

  const deleteReservation = async (reservation, newStatus) => {
    try {
      await axiosInstance.delete(`/reservations/${reservation.id}`);
      fetchReservations(pagination.currentPage); 
    } catch (error) {
      console.error('Failed to cancel reservation:', "error");
    }
  };


  useEffect(() => {
    fetchReservations(pagination.currentPage);
  }, [pagination.currentPage]);

  return (
    <Container>
      <Typography variant="h4" align='center' my={2}>My Reservations</Typography>
      {reservations.length == 0 ? <Typography variant="p" align={'center'} color="red" my={2}>You don't have any reservations to show</Typography> : reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onUpdateStatus={updateReservationStatus}
          onDeleteReservation = {deleteReservation}
        />
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={(e, page) => setPagination({ ...pagination, currentPage: page })}
        />
      </Box>
    </Container>
  );
};

export default ReservationsIndex;
