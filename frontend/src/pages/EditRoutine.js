import React from 'react';
import { useParams } from 'react-router-dom';
export default function EditRoutine() {
  const { id } = useParams();
  return <h1>Edit Routine #{id}</h1>;
}
