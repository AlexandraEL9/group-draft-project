import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../index.scss";
import AddRoutineForm from "../components/addRoutineForm/AddRoutineForm";


function AddRoutine() {
  
  return (
    <main>
      <AddRoutineForm />
    </main>
  );

}

export default AddRoutine; 
