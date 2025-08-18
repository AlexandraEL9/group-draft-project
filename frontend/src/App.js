import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Routines from './pages/Routines';
import AddRoutine from "./pages/AddRoutine";
import EditRoutine from './pages/EditRoutine';
import PlayRoutine from './pages/PlayRoutine';
import OurTeam from './pages/OurTeam';
import Navbar from './components/navbar/navbar';
import ApiProbe from "./components/ApiProbe";
import Footer from './components/footer/footer';

export default function App() {
  return (
    <div className="app">
      <main>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/routines/new" element={<AddRoutine />} />
          <Route path="/routines/edit/:id" element={<EditRoutine />} />
          <Route path="/routines/play/:id" element={<PlayRoutine />} />
          <Route path="/team" element={<OurTeam />} />
          <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
        </Routes>
      </main>
      <ApiProbe />
      <Footer />
    </div>
  );
}

