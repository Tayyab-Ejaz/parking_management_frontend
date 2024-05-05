import React from "react";
import { Box, Pagination } from "@mui/material";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Box mb={3}>
      <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handlePageChange}
      siblingCount={1} 
      boundaryCount={1} 
      color="primary"
      showFirstButton 
      showLastButton
    />
    </Box>
  );
};

export default CustomPagination;
