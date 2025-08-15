import React from 'react';
import { Routes, Route } from 'react-router-dom';
//import Layout from './components/Layout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Routines from './pages/Routines';
import EditRoutine from './pages/EditRoutine';
import PlayRoutine from './pages/PlayRoutine';
import OurTeam from './pages/OurTeam';

export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/routines/edit/:id" element={<EditRoutine />} />
        <Route path="/routines/play/:id" element={<PlayRoutine />} />
        <Route path="/team" element={<OurTeam />} />
        <Route path="*" element={<div style={{padding:24}}>Page not found</div>} />
    </Routes>
  );
}
