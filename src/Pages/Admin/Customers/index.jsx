import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Container,
} from "@mui/material";
import CustomPagination from "../../../components/CustomPagination";
import useAxiosInstance from "../../../Hooks/axiosInstance";
import AddCustomerModal from "./AddCustomerModal";

const CustomersIndex = () => {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const axiosInstance = useAxiosInstance();

  const fetchCustomers = async (page = 1) => {
    try {
      const response = await axiosInstance.get("/admin/customers", {
        params: {
          page,
        },
      });

      setCustomers(response.data.customers);
      setPagination({
        currentPage: response.data.current_page,
        totalPages: response.data.total_pages,
      });
    } catch (error) {
      console.error("Error fetching customers:", error.message);
    }
  };

  useEffect(() => {
    fetchCustomers(pagination.currentPage);
  }, [pagination.currentPage]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/admin/customers/${id}`);
      fetchCustomers(pagination.currentPage);
    } catch (error) {
      console.error("Error deleting customer:", error.message);
    }
  };

  const handleAddCustomer = async (customerData) => {
    try {
      await axiosInstance.post("/admin/customers", customerData);
      fetchCustomers(pagination.currentPage);
    } catch (error) {
      console.error("Error adding customer:", error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" py={3}>
        Customer List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setAddCustomerModalOpen(true)} // Open the modal
      >
        Add Customer
      </Button>
      <Table>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(pageNumber) =>
          setPagination({ ...pagination, currentPage: pageNumber })
        }
      />

      <AddCustomerModal
        open={isAddCustomerModalOpen}
        onClose={() => setAddCustomerModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />
    </Container>
  );
};

export default CustomersIndex;
