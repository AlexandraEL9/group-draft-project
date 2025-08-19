// src/pages/PlayRoutine/PlayRoutine.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function PlayRoutine() {
  const { id } = useParams();

  return (
    <section className="player">
      <h1 className="player__title">…</h1>
      <div className="player__card">
        <div className="player__task-name">—</div>
        <div className="timer-section">
          <div className="player__play">
            <span>00</span>:<span>00</span>
          </div>
          <button className="btn" disabled>Play</button>
          <button className="btn" disabled>Skip</button>
        </div>
      </div>
      <div className="player__next">
        <div className="player__next-label">All tasks complete</div>
      </div>
    </section>
  );
}
