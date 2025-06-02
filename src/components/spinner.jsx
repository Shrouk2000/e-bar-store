import React from 'react';
import { CircularProgress } from '@mui/material';

function Spinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <CircularProgress />
    </div>
  );
}

export default Spinner;