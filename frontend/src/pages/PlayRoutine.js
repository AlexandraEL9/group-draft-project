import React from 'react';
import { useParams } from 'react-router-dom';
export default function PlayRoutine() {
  const { id } = useParams();
  return <h1>Play Routine #{id}</h1>;
}
